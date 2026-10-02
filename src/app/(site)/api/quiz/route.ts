import { courseQuestionInstructions } from '@/lib/course-question-quality'
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'
import { usageFailureResponse } from '@/lib/usage-response'
import { getPlanLimits } from '@/lib/plans'
import { getDocumentContextWithStatus } from '@/lib/document-context'
import { sampleDocumentSections, verifySourceQuote } from '@/lib/document-retrieval'
import { parseGeneratedQuiz, uniqueByQuestion, type GeneratedQuizQuestion } from '@/lib/study-generation'

export const maxDuration = 60

const languageNames: Record<string, string> = {
  fr: 'French', en: 'English', es: 'Spanish', de: 'German', it: 'Italian',
  pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic',
}

async function generateBatch(content: string, count: number, language: string, existing: string[]): Promise<GeneratedQuizQuestion[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `Create exactly ${count} distinct multiple-choice study questions in ${language}. ${courseQuestionInstructions} Each has four plausible, distinct options and exactly one correct answer. Test important concepts at varied difficulty. Copy a short sourceQuote EXACTLY from the document when possible; never invent a page. Return valid JSON only: {"questions":[{"question":"...","correctAnswer":"...","options":["...","...","...","..."],"sourceQuote":"..."}]}\n\nDOCUMENT:\n${content}` },
      { role: 'user', content: `Create ${count} questions. Avoid these existing questions: ${existing.slice(-100).join(' | ') || 'none'}.` },
    ],
    temperature: 0.55,
    max_tokens: Math.min(8000, Math.max(2400, count * 240)),
    response_format: { type: 'json_object' },
  })
  const output = response.choices[0]?.message?.content
  if (!output) return []
  try { return parseGeneratedQuiz(output) } catch { return [] }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { documentId, count = 10, language = 'fr' } = await request.json()
    const context = await getDocumentContextWithStatus(supabase, user.id, documentId)
    if (!context.content) return NextResponse.json({ error: context.code, code: context.code }, { status: context.code === 'service_unavailable' ? 503 : 403 })
    const { data: profile, error: profileError } = await supabase.from('users').select('current_plan').eq('id', user.id).single()
    if (profileError || !profile) return NextResponse.json({ error: 'Profile unavailable', code: 'service_unavailable' }, { status: 503 })
    const requested = Number.isFinite(Number(count)) ? Math.floor(Number(count)) : 10
    const questionCount = Math.min(getPlanLimits(profile.current_plan).maxQuizQuestions, Math.max(5, requested))
    const pageCost = calculatePageCost('quiz', questionCount)
    const usage = await checkUserUsage(supabase, user.id, pageCost)
    if (!usage.allowed) return usageFailureResponse(usage)

    const documentContent = context.content
    const selectedContent = sampleDocumentSections(documentContent, 14000)
    const targetLanguage = languageNames[language] || 'French'
    const batchSizes = Array.from({ length: Math.ceil(questionCount / 20) }, (_, index) => Math.min(20, questionCount - index * 20))
    let generated = uniqueByQuestion((await Promise.all(batchSizes.map(size => generateBatch(selectedContent, size, targetLanguage, [])))).flat())
    if (generated.length < questionCount) {
      const missing = questionCount - generated.length
      generated = uniqueByQuestion([...generated, ...await generateBatch(selectedContent, missing, targetLanguage, generated.map(question => question.question))])
    }
    if (generated.length < questionCount) return NextResponse.json({ error: 'Could not create the full quiz. No quota was used.', code: 'generation_incomplete' }, { status: 503 })

    const questions = generated.slice(0, questionCount).map((question, index) => {
      const source = question.sourceQuote ? verifySourceQuote(documentContent, question.sourceQuote) : null
      return { id: String(index + 1), question: question.question, correctAnswer: question.correctAnswer, options: question.options,
        sourceRef: source ? `${source.page ? `Page ${source.page} · ` : ''}« ${source.quote} »` : undefined }
    })
    const charge = await deductPages(supabase, user.id, pageCost)
    if (!charge.success) return NextResponse.json({ error: charge.error, code: charge.code }, { status: charge.code === 'usage_charge_failed' ? 503 : 403 })
    return NextResponse.json({ questions, count: questionCount, pagesUsed: pageCost })
  } catch (error) {
    console.error('Quiz generation error:', error)
    if (error && typeof error === 'object' && 'status' in error && error.status === 429) return NextResponse.json({ error: 'AI service busy. Try again.', code: 'service_unavailable' }, { status: 429 })
    return NextResponse.json({ error: 'Failed to generate quiz', code: 'service_unavailable' }, { status: 503 })
  }
}
