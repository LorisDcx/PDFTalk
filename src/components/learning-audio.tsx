'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { learningError, type LearningCopy } from '@/lib/learning-copy'
import type { StudyLanguage } from '@/lib/study-language'
import { LearningReader } from '@/components/learning-reader'

export function LearningAudio({ text, summary, fullText, language, copy, onUsage }: { text: string; summary?: string; fullText?: string; language: StudyLanguage; copy: LearningCopy; onUsage: () => void }) {
  const [mode, setMode] = useState<'lesson' | 'summary'>('lesson')
  const [voice, setVoice] = useState<'marin' | 'cedar' | 'coral'>('marin')
  const [urls, setUrls] = useState<Record<string, string>>({})
  const url = urls[mode] || null
  const urlsRef = useRef(urls)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [speed, setSpeed] = useState(1)
  const audioRef = useRef<HTMLAudioElement>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const busyRef = useRef(false)
  useEffect(() => () => controllerRef.current?.abort(), [])
  useEffect(() => { urlsRef.current = urls }, [urls])
  useEffect(() => () => { Object.values(urlsRef.current).forEach(url => URL.revokeObjectURL(url)) }, [])
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = speed }, [speed, url])

  const generate = async () => {
    if (busyRef.current) return
    busyRef.current = true
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/learn/speech', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: mode === 'summary' ? summary : text, voice, language }), signal: controller.signal,
      })
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        setError(learningError(data.code || null, copy))
        return
      }
      const blob = await response.blob()
      if (!blob.size || !blob.type.startsWith('audio/')) throw new Error('Invalid audio')
      if (controller.signal.aborted) return
      const nextUrl = URL.createObjectURL(blob)
      setUrls(previous => ({ ...previous, [mode]: nextUrl }))
      onUsage()
    } catch {
      if (!controller.signal.aborted) setError(copy.audioError)
    } finally {
      busyRef.current = false
      if (!controller.signal.aborted) setLoading(false)
    }
  }

  return <section className="space-y-3 rounded-[var(--cd-radius-control)] border border-[var(--cd-line)] bg-[var(--cd-paper)] p-4" aria-label={copy.aiVoice}>
    <p className="flex items-center gap-2 text-base font-semibold"><Volume2 className="size-5 shrink-0 text-[var(--cd-brand)]" aria-hidden="true" />{copy.aiVoice}</p>
    <LearningReader text={fullText || text} language={language} copy={copy} />
    {summary && <label className="block text-base">{copy.audioContent}<select value={mode} disabled={loading} onChange={event => { audioRef.current?.pause(); setError(null); setMode(event.target.value as typeof mode) }} className="mt-1 block min-h-11 max-w-full rounded-xl border border-[var(--cd-line)] bg-white px-3"><option value="lesson">{copy.audioLesson}</option><option value="summary">{copy.audioSummary}</option></select></label>}
    {!url && <div className="flex flex-wrap items-end gap-3">
      <label className="text-base">{copy.voice}<select value={voice} onChange={event => setVoice(event.target.value as typeof voice)} disabled={loading} className="mt-1 block min-h-11 rounded-xl border border-[var(--cd-line)] bg-white px-3"><option value="marin">Marin</option><option value="cedar">Cedar</option><option value="coral">Coral</option></select></label>
      <Button type="button" variant="outline" disabled={loading} onClick={() => void generate()} className="min-h-11 h-auto gap-2 whitespace-normal text-left">{loading && <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden="true" />}{loading ? copy.audioLoading : copy.listen}</Button>
    </div>}
    {loading && <p role="status" className="text-base text-[var(--cd-muted)]">{copy.audioLoading}</p>}
    {url && <>
      <audio ref={audioRef} src={url} controls preload="metadata" className="w-full" aria-label={copy.aiVoice} onPlay={() => window.dispatchEvent(new Event('cramdesk-stop-reading'))} onError={() => setError(copy.audioError)} />
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-base">{copy.speed}<select value={speed} onChange={event => setSpeed(Number(event.target.value))} className="min-h-11 rounded-xl border border-[var(--cd-line)] bg-white px-2">{[0.75, 1, 1.25, 1.5].map(value => <option value={value} key={value}>{value}×</option>)}</select></label>
        <a href={url} download="cramdesk-lesson.mp3" className="inline-flex min-h-11 items-center text-base font-semibold text-[var(--cd-brand)] underline underline-offset-4">{copy.download}</a>
      </div>
    </>}
    {error && <p role="alert" className="text-base text-red-800">{error}</p>}
  </section>
}
