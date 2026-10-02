import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { checkLearningAccess, chargeLearningGeneration } from '@/lib/learning-access'
import { learningCost } from '@/lib/learning-cost'
import { maxVoiceBytes, voiceWavSeconds } from '@/lib/learning-voice'

export const maxDuration = 60
export async function POST(request: NextRequest) {
  try {
    const access = await checkLearningAccess(learningCost.transcription)
    if (access.response) return access.response
    if (request.headers.get('Content-Type') !== 'audio/wav' || Number(request.headers.get('Content-Length')) > maxVoiceBytes || !request.body) return NextResponse.json({ code: 'invalid_audio' }, { status: 400 })
    const reader = request.body.getReader()
    const chunks: Uint8Array[] = []
    let length = 0
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.length
      if (length > maxVoiceBytes) { await reader.cancel(); return NextResponse.json({ code: 'invalid_audio' }, { status: 400 }) }
      chunks.push(value)
    }
    const bytes = new Uint8Array(length)
    let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
    const seconds = voiceWavSeconds(bytes.buffer)
    if (!seconds) return NextResponse.json({ code: 'invalid_audio' }, { status: 400 })
    const result = await openai.audio.transcriptions.create({ model: process.env.LEARNING_TRANSCRIPTION_MODEL || 'gpt-transcribe', file: new File([bytes], 'question.wav', { type: 'audio/wav' }) }, { timeout: 50000, maxRetries: 0, signal: request.signal })
    console.info('learning_usage', { userId: access.user.id, action: 'transcription', model: process.env.LEARNING_TRANSCRIPTION_MODEL || 'gpt-transcribe', seconds, quotaPages: learningCost.transcription })
    const text = result.text?.trim()
    if (!text || text.length > 3000) return NextResponse.json({ code: 'transcription_empty' }, { status: 422 })
    const failure = await chargeLearningGeneration(access)
    if (failure) return failure
    return NextResponse.json({ text, pagesUsed: learningCost.transcription }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Learning transcription failed:', error instanceof Error ? error.message : 'Unknown error')
    return NextResponse.json({ code: 'transcription_unavailable' }, { status: 502 })
  }
}
