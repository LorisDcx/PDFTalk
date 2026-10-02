'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { spokenText } from '@/lib/learning-voice'
import type { LearningCopy } from '@/lib/learning-copy'

export function LearningReader({ text, language, copy }: { text: string; language: string; copy: LearningCopy }) {
  const [reading, setReading] = useState(false)
  const [paused, setPaused] = useState(false)
  const [error, setError] = useState(false)
  const active = useRef(false)
  useEffect(() => {
    const stopOther = () => { if (active.current) { active.current = false; window.speechSynthesis?.cancel(); setReading(false); setPaused(false) } }
    window.addEventListener('cramdesk-stop-reading', stopOther)
    return () => { window.removeEventListener('cramdesk-stop-reading', stopOther); if (active.current) { active.current = false; window.speechSynthesis?.cancel() } }
  }, [])
  const stop = () => { active.current = false; window.speechSynthesis?.cancel(); setReading(false); setPaused(false) }
  const start = () => {
    if (!window.speechSynthesis) { setError(true); return }
    window.dispatchEvent(new Event('cramdesk-stop-reading'))
    stop(); setError(false); active.current = true; setReading(true)
    // Short utterances avoid browser timeouts on long lessons.
    const chunks = spokenText(text).match(/[\s\S]{1,220}(?:\s|$)|[\s\S]{1,220}/g) || []
    const speak = (index: number) => {
      if (!active.current) return
      if (index >= chunks.length) { stop(); return }
      const utterance = new SpeechSynthesisUtterance(chunks[index])
      utterance.lang = language; utterance.rate = 0.95
      utterance.onend = () => speak(index + 1)
      utterance.onerror = event => { if (active.current && !['canceled', 'interrupted'].includes(event.error)) { stop(); setError(true) } }
      window.speechSynthesis.speak(utterance)
    }
    speak(0)
  }
  return <div className="space-y-2">
    <p className="text-base text-[var(--cd-muted)]">{copy.browserHint}</p>
    <div className="flex flex-wrap gap-3">
      {!reading ? <Button type="button" variant="outline" onClick={start} className="min-h-11 h-auto whitespace-normal">{copy.browserRead}</Button> : <>
        <Button type="button" variant="outline" className="min-h-11" onClick={() => { if (paused) window.speechSynthesis.resume(); else window.speechSynthesis.pause(); setPaused(!paused) }}>{paused ? copy.resume : copy.pause}</Button>
        <Button type="button" variant="ghost" className="min-h-11" onClick={stop}>{copy.stop}</Button>
      </>}
    </div>
    {reading && <p role="status" className="text-base">{paused ? copy.pause : copy.reading}</p>}
    {error && <p role="alert" className="text-base text-red-800">{copy.browserError}</p>}
  </div>
}
