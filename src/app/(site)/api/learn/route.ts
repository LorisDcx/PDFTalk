import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { learningRequestSchema, learningPlanSchema, learningLessonSchema, learningFeedbackSchema, buildLearningPrompt } from '@/lib/learning'
import { checkLearningAccess, chargeLearningGeneration } from '@/lib/learning-access'
import { getDocumentContextWithStatus } from '@/lib/document-context'
import { selectDocumentContext, verifySourceQuote } from '@/lib/document-retrieval'
import { studyLanguageNames } from '@/lib/study-language'
import { formatChatAnswer, isRenderableChatAnswer } from '@/lib/chat-answer-format'
import { learningCost, learningTokenLimit } from '@/lib/learning-cost'

export const maxDuration = 90

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    if (body.length > 65000) return NextResponse.json({ code: 'invalid_request' }, { status: 400 })
    let json: unknown
    try { json = JSON.parse(body) } catch { return NextResponse.json({ code: 'invalid_request' }, { status: 400 }) }
    const parsed = learningRequestSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ code: 'invalid_request' }, { status: 400 })
    const input = parsed.data
    if (input.action === 'lesson' && input.stepIndex >= input.plan.steps.length) return NextResponse.json({ code: 'invalid_request' }, { status: 400 })
    const access = await checkLearningAccess(learningCost[input.action])
    if (access.response) return access.response
    let fullSource: string | null = null
    if (input.documentId) {
      const result = await getDocumentContextWithStatus(access.supabase, access.user.id, input.documentId, true)
      if (!result.content) return NextResponse.json({ code: result.code }, { status: result.code === 'service_unavailable' ? 503 : result.code === 'subscription_expired' ? 403 : result.code === 'source_unavailable' ? 409 : 404 })
      fullSource = result.content
    }
    const theme = input.action === 'plan' ? input.profile.topic : input.action === 'lesson' ? input.plan.steps[input.stepIndex].title : `${input.step.title} ${input.question}`
    const source = fullSource ? selectDocumentContext(fullSource, `${input.profile.topic} ${theme}`, 24000) : null
    const response = await openai.chat.completions.create({
      model: process.env.LEARNING_TEXT_MODEL || 'gpt-6-luna', reasoning_effort: 'medium', max_completion_tokens: learningTokenLimit[input.action],
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildLearningPrompt(input, studyLanguageNames[input.language], source) },
        { role: 'user', content: JSON.stringify(input) },
      ],
    }, { timeout: 80000, maxRetries: 0, signal: request.signal })
    console.info('learning_usage', { userId: access.user.id, action: input.action, model: response.model,
      inputTokens: response.usage?.prompt_tokens, outputTokens: response.usage?.completion_tokens,
      totalTokens: response.usage?.total_tokens, quotaPages: learningCost[input.action] })
    const result: unknown = JSON.parse(response.choices[0]?.message?.content || '{}')
    let data
    if (input.action === 'plan') {
      data = { plan: learningPlanSchema.parse(result) }
    } else if (input.action === 'lesson') {
      const lesson = learningLessonSchema.parse(result)
      const content = formatChatAnswer(lesson.content)
      if (!content || !isRenderableChatAnswer(content)) throw new Error('Invalid lesson formatting')
      const source = fullSource && lesson.sourceQuote && lesson.sourceQuote.trim().split(/\s+/).length <= 25 ? verifySourceQuote(fullSource, lesson.sourceQuote) : null
      data = { lesson: { ...lesson, content, sourceQuote: source?.quote || '', source } }
    } else {
      const feedback = learningFeedbackSchema.parse(result)
      const answer = formatChatAnswer(feedback.answer)
      if (!answer || !isRenderableChatAnswer(answer)) throw new Error('Invalid feedback formatting')
      data = { ...feedback, answer, mastered: input.mode === 'evaluate' && feedback.mastered }
    }
    const failure = await chargeLearningGeneration(access)
    if (failure) return failure
    return NextResponse.json({ ...data, pagesUsed: learningCost[input.action] }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Learning generation failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ code: 'ai_unavailable' }, { status: 502 })
  }
}
