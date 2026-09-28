import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'
import { usageFailureResponse } from '@/lib/usage-response'
import { getPlanLimits } from '@/lib/plans'
import { getDocumentContext } from '@/lib/document-context'
import { sampleDocumentSections, verifySourceQuote } from '@/lib/document-retrieval'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId, count = 10, language = 'fr' } = await request.json()
    const documentContent = await getDocumentContext(supabase, user.id, documentId)

    if (!documentContent) {
      return NextResponse.json({ error: 'Document unavailable' }, { status: 403 })
    }

    const { data: profile } = await supabase.from('users')
      .select('current_plan').eq('id', user.id).single()
    if (!profile) return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    const requestedCount = Number.isFinite(Number(count)) ? Math.floor(Number(count)) : 10
    const questionCount = Math.min(getPlanLimits(profile.current_plan).maxQuizQuestions, Math.max(5, requestedCount))

    // Calculate page cost (5 questions = 1 page)
    const pageCost = calculatePageCost('quiz', questionCount)

    // Check if user has enough pages
    const usageCheck = await checkUserUsage(supabase, user.id, pageCost)
    
    if (!usageCheck.allowed) {
      return usageFailureResponse(usageCheck)
    }

    // Language names for the prompt
    const languageNames: Record<string, string> = {
      fr: 'French', en: 'English', es: 'Spanish', de: 'German',
      it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic'
    }
    const targetLanguage = languageNames[language] || 'French'

    const systemPrompt = `You are an expert quiz creator for students. Analyze the provided document and create exactly ${questionCount} multiple choice questions to test knowledge.

DOCUMENT CONTENT:
${sampleDocumentSections(documentContent, 14000)}

CRITICAL INSTRUCTIONS:
- Create exactly ${questionCount} multiple choice questions
- ALL questions and answers MUST be written in ${targetLanguage}
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE option should be correct
- Include a short sourceQuote copied EXACTLY from the supplied excerpts for each question; never invent a page number
- Cover the most important concepts from the document
- Vary difficulty levels
- Respond ONLY with valid JSON

RESPONSE FORMAT (strict JSON):
{
  "questions": [
    {
      "id": "1",
      "question": "Clear question in ${targetLanguage}?",
      "correctAnswer": "The correct answer text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "sourceQuote": "exact excerpt"
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${questionCount} quiz questions from this document. Write them in ${targetLanguage}.` },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(content)
    
    type GeneratedQuestion = { id?: string; question: string; correctAnswer: string; options: string[]; sourceQuote?: string }
    const generated: unknown = parsed.questions
    const questions = (Array.isArray(generated) ? generated : []).filter((value: unknown): value is GeneratedQuestion => {
      if (!value || typeof value !== 'object') return false
      const q = value as Record<string, unknown>
      return typeof q.question === 'string' && !!q.question.trim() &&
        typeof q.correctAnswer === 'string' && !!q.correctAnswer.trim() &&
        Array.isArray(q.options) && q.options.length === 4 && q.options.every(option => typeof option === 'string' && !!option.trim())
    }).map((q, index) => {
      const options = [...q.options]
      if (!options.includes(q.correctAnswer)) options[0] = q.correctAnswer
      const source = typeof q.sourceQuote === 'string' ? verifySourceQuote(documentContent, q.sourceQuote) : null
      return { id: q.id || String(index + 1), question: q.question.trim(), correctAnswer: q.correctAnswer.trim(), options,
        sourceRef: source ? `${source.page ? `Page ${source.page} · ` : ''}« ${source.quote} »` : undefined }
    })
    
    // Deduct pages from user's quota after successful generation
    const actualQuestionCount = questions.length
    const actualPageCost = calculatePageCost('quiz', actualQuestionCount)
    if (actualPageCost === 0) throw new Error('AI returned no questions')
    const charge = await deductPages(supabase, user.id, actualPageCost)
    if (!charge.success) return NextResponse.json({ error: charge.error }, { status: 403 })
    
    return NextResponse.json({ 
      questions,
      count: actualQuestionCount,
      pagesUsed: actualPageCost
    })

  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
