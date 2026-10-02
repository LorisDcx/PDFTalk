import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { openai } from '@/lib/openai'
import { checkLearningAccess, chargeLearningGeneration } from '@/lib/learning-access'
import { studyLanguageNames } from '@/lib/study-language'
import { learningCost } from '@/lib/learning-cost'

export const maxDuration = 60
const speechSchema = z.object({
  text: z.string().trim().min(1).max(3500), voice: z.enum(['marin', 'cedar', 'coral']),
  language: z.enum(['fr', 'en', 'es', 'de', 'it', 'pt', 'zh', 'ja', 'ar']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    if (body.length > 16000) return NextResponse.json({ code: 'invalid_request' }, { status: 400 })
    let json: unknown
    try { json = JSON.parse(body) } catch { return NextResponse.json({ code: 'invalid_request' }, { status: 400 }) }
    const parsed = speechSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ code: 'invalid_request' }, { status: 400 })
    const access = await checkLearningAccess(learningCost.speech)
    if (access.response) return access.response
    const { text, voice, language } = parsed.data
    const speech = await openai.audio.speech.create({
      model: process.env.LEARNING_SPEECH_MODEL || 'gpt-4o-mini-tts', voice, input: text, response_format: 'mp3',
      instructions: `Speak in ${studyLanguageNames[language]} as a calm, clear teacher. Read at a measured pace with short pauses between ideas. Read exactly the supplied text.`,
    }, { timeout: 50000, maxRetries: 0, signal: request.signal })
    const buffer = await speech.arrayBuffer()
    if (!buffer.byteLength) throw new Error('Empty audio')
    console.info('learning_usage', { userId: access.user.id, action: 'speech', model: process.env.LEARNING_SPEECH_MODEL || 'gpt-4o-mini-tts', characters: text.length, audioBytes: buffer.byteLength, quotaPages: learningCost.speech })
    const failure = await chargeLearningGeneration(access)
    if (failure) return failure
    return new Response(buffer, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'no-store', 'X-Pages-Used': String(learningCost.speech) } })
  } catch (error) {
    console.error('Learning speech failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ code: 'speech_unavailable' }, { status: 502 })
  }
}
