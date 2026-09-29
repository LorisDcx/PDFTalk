import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { getDocumentContextWithStatus } from '@/lib/document-context'
import { selectDocumentContext, verifySourceQuote } from '@/lib/document-retrieval'
import { buildTutorPrompt, selectTutorProfile } from '@/lib/chat-tutor'
import { formatChatAnswer, isRenderableChatAnswer } from '@/lib/chat-answer-format'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId, question, history }: { documentId: unknown; question: unknown; history?: unknown } = await request.json()
    const documentResult = await getDocumentContextWithStatus(supabase, user.id, documentId)

    if (!documentResult.content) {
      if (documentResult.code === 'subscription_expired') return NextResponse.json({ error: 'Access expired', code: 'access_expired' }, { status: 403 })
      if (documentResult.code === 'service_unavailable') return NextResponse.json({ error: 'Service unavailable', code: 'service_unavailable' }, { status: 503 })
      return NextResponse.json({ error: 'Document unavailable', code: 'document_unavailable' }, { status: 404 })
    }
    const documentContent = documentResult.content
    const validHistory = history == null || (Array.isArray(history) && history.length <= 4 &&
      history.reduce((total: number, msg: unknown) => total + (typeof (msg as { content?: unknown })?.content === 'string' ? (msg as { content: string }).content.length : 0), 0) <= 30000 &&
      history.every((msg: unknown) => {
        if (!msg || typeof msg !== 'object') return false
        const entry = msg as Record<string, unknown>
        return (entry.role === 'user' || entry.role === 'assistant') &&
          typeof entry.content === 'string' && entry.content.length <= 8000
      }))
    if (typeof question !== 'string' || !question.trim() || question.length > 6000 || !validHistory) {
      return NextResponse.json({ error: 'Invalid question or history' }, { status: 400 })
    }

    // Build conversation history for context
    const conversationHistory = (history as { role: 'user' | 'assistant'; content: string }[] | undefined)?.map(msg => ({
      role: msg.role,
      content: msg.content,
    })) || []

    const searchQuestion = [...conversationHistory.filter(msg => msg.role === 'user').slice(-2).map(msg => msg.content), question].join(' ')
    const relevantContent = selectDocumentContext(documentContent, searchQuestion)
    const tutor = selectTutorProfile(question, relevantContent)

    const messages = [
      { role: 'system' as const, content: buildTutorPrompt(tutor, relevantContent) },
      ...conversationHistory,
      { role: 'user' as const, content: question },
    ]
    const askModel = async (model: 'gpt-5.6-terra' | 'gpt-5-mini' | 'gpt-4o-mini') => {
      const response = model === 'gpt-4o-mini'
        ? await openai.chat.completions.create({ model, messages, max_tokens: 3600, temperature: 0.2, response_format: { type: 'json_object' } })
        : await openai.chat.completions.create({ model, reasoning_effort: tutor.reasoningEffort, messages, max_completion_tokens: tutor.maxCompletionTokens, response_format: { type: 'json_object' } })
      const content = response.choices[0]?.message?.content?.trim()
      if (!content) throw new Error(`Empty response from ${model}`)
      let parsed: { answer?: unknown; sourceQuote?: unknown }
      try { parsed = JSON.parse(content) } catch { throw new Error(`Invalid JSON from ${model}`) }
      if (typeof parsed.answer !== 'string' || !parsed.answer.trim()) throw new Error(`Empty answer from ${model}`)
      return { answer: parsed.answer.trim(), sourceQuote: parsed.sourceQuote }
    }

    let result
    try {
      result = await askModel(tutor.model)
    } catch (primaryError) {
      console.error('Primary chat model failed; trying fallback:', primaryError)
      try {
        result = await askModel(tutor.model === 'gpt-5.6-terra' ? 'gpt-5-mini' : 'gpt-4o-mini')
      } catch (fallbackError) {
        console.error('Fallback chat model failed:', fallbackError)
        return NextResponse.json({ error: 'AI service temporarily unavailable', code: 'ai_unavailable' }, { status: 502 })
      }
    }

    let answer = formatChatAnswer(result.answer)
    if (!answer || !isRenderableChatAnswer(answer)) {
      try {
        const repair = await openai.chat.completions.create({
          model: 'gpt-5-mini',
          reasoning_effort: 'low',
          max_completion_tokens: 7000,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'Repair the Markdown and LaTeX formatting of this study answer. Return JSON with one string field named answer. Preserve all reasoning, numbers, units, assumptions and conclusions. Do not add new claims. Use $...$ for inline math. Every display equation must have its opening and closing $$ on separate lines with blank lines around the equation. Close every math delimiter. Put headings, list items and table rows on separate lines.' },
            { role: 'user', content: result.answer },
          ],
        })
        const repaired = JSON.parse(repair.choices[0]?.message?.content || '{}') as { answer?: unknown }
        answer = typeof repaired.answer === 'string' ? formatChatAnswer(repaired.answer) : null
      } catch (repairError) {
        console.error('Chat answer formatting repair failed:', repairError)
      }
    }
    if (!answer || !isRenderableChatAnswer(answer)) {
      return NextResponse.json({ error: 'AI answer formatting unavailable', code: 'ai_unavailable' }, { status: 502 })
    }

    const source = typeof result.sourceQuote === 'string'
      ? verifySourceQuote(documentContent, result.sourceQuote) : null
    return NextResponse.json({ answer, source })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 })
  }
}
