'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Mic, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { encodeVoiceWav, maxVoiceSeconds } from '@/lib/learning-voice'
import { learningError, type LearningCopy } from '@/lib/learning-copy'

type Capture = { context: AudioContext; stream: MediaStream; node: AudioWorkletNode; source: MediaStreamAudioSourceNode; chunks: Float32Array[]; samples: number }
const worklet = `class VoiceCapture extends AudioWorkletProcessor {
  constructor() { super(); this.chunk = new Float32Array(2048); this.offset = 0; }
  process(inputs) { const audio = inputs[0]?.[0]; if (audio) for (const value of audio) {
    this.chunk[this.offset++] = value;
    if (this.offset === this.chunk.length) { this.port.postMessage(this.chunk); this.offset = 0; }
  } return true; }
} registerProcessor('voice-capture', VoiceCapture);`

export function LearningMicrophone({ copy, disabled, onText, onUsage, onBusy }: { copy: LearningCopy; disabled: boolean; onText: (text: string) => void; onUsage: () => void; onBusy: (busy: boolean) => void }) {
  const [state, setState] = useState<'idle' | 'permission' | 'recording' | 'transcribing'>('idle')
  const [seconds, setSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const capture = useRef<Capture | null>(null)
  const busy = useRef(false)
  const alive = useRef(true)
  const controller = useRef<AbortController | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const stopTracks = (value: Capture) => { value.node.port.onmessage = null; value.source.disconnect(); value.node.disconnect(); value.stream.getTracks().forEach(track => track.stop()); void value.context.close() }
  useEffect(() => { alive.current = true; return () => {
    alive.current = false
    if (timer.current) clearInterval(timer.current)
    controller.current?.abort()
    if (capture.current) stopTracks(capture.current)
  } }, [])

  const finish = async (cancel = false) => {
    const value = capture.current
    if (!value) return
    capture.current = null
    if (timer.current) clearInterval(timer.current)
    stopTracks(value)
    if (cancel) { busy.current = false; setState('idle'); onBusy(false); return }
    setState('transcribing')
    const samples = new Float32Array(value.samples)
    let offset = 0
    for (const chunk of value.chunks) { samples.set(chunk, offset); offset += chunk.length }
    const energy = samples.reduce((total, sample) => total + sample * sample, 0) / Math.max(1, samples.length)
    const abort = new AbortController()
    controller.current = abort
    try {
      if (samples.length < value.context.sampleRate / 4 || energy < 0.000009) { setError(copy.micEmpty); return }
      const response = await fetch('/api/learn/transcribe', { method: 'POST', headers: { 'Content-Type': 'audio/wav' }, body: encodeVoiceWav(samples, value.context.sampleRate), signal: abort.signal })
      const result = await response.json()
      if (!alive.current) return
      if (!response.ok) { setError(learningError(result.code, copy)); return }
      onText(result.text)
      onUsage()
    } catch { if (alive.current) setError(copy.micError) }
    finally { busy.current = false; if (alive.current) { setState('idle'); onBusy(false) } }
  }

  const start = async () => {
    if (busy.current || disabled) return
    if (!navigator.mediaDevices?.getUserMedia || typeof AudioWorkletNode === 'undefined') { setError(copy.micUnsupported); return }
    busy.current = true
    onBusy(true)
    setState('permission'); setError(null); setSeconds(0)
    let stream: MediaStream | null = null
    let context: AudioContext | null = null
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } })
      if (!alive.current) { stream.getTracks().forEach(track => track.stop()); return }
      context = new AudioContext({ sampleRate: 24000 })
      await context.resume()
      const url = URL.createObjectURL(new Blob([worklet], { type: 'text/javascript' }))
      try { await context.audioWorklet.addModule(url) } finally { URL.revokeObjectURL(url) }
      if (!alive.current) { stream.getTracks().forEach(track => track.stop()); void context.close(); return }
      const source = context.createMediaStreamSource(stream)
      const node = new AudioWorkletNode(context, 'voice-capture')
      const value: Capture = { context, stream, node, source, chunks: [], samples: 0 }
      capture.current = value
      node.port.onmessage = event => {
        if (capture.current !== value) return
        const remaining = context!.sampleRate * maxVoiceSeconds - value.samples
        const chunk = (event.data as Float32Array).slice(0, remaining)
        if (chunk.length) { value.chunks.push(chunk); value.samples += chunk.length }
      }
      source.connect(node); node.connect(context.destination)
      setState('recording')
      const started = Date.now()
      timer.current = setInterval(() => {
        const elapsed = Math.min(maxVoiceSeconds, Math.floor((Date.now() - started) / 1000))
        setSeconds(elapsed)
        if (elapsed >= maxVoiceSeconds) void finish()
      }, 250)
    } catch (reason) {
      stream?.getTracks().forEach(track => track.stop())
      if (context && context.state !== 'closed') void context.close()
      busy.current = false
      if (alive.current) { setState('idle'); onBusy(false); setError(reason instanceof DOMException && ['NotAllowedError', 'PermissionDeniedError'].includes(reason.name) ? copy.micDenied : copy.micError) }
    }
  }
  return <div className="space-y-2">
    <details className="text-sm text-[var(--cd-muted)]"><summary className="flex min-h-11 cursor-pointer items-center">{copy.micDetails}</summary><p className="pb-3 text-base leading-7">{copy.micHint}</p></details>
    <div className="flex flex-wrap gap-3">
      {state === 'recording' ? <>
        <Button type="button" variant="outline" onClick={() => void finish()} className="min-h-11 h-auto gap-2 whitespace-normal"><Square className="size-4 shrink-0" />{copy.micStop} · {seconds} / 60 s</Button>
        <Button type="button" variant="ghost" onClick={() => void finish(true)} className="min-h-11">{copy.micCancel}</Button>
      </> : <Button type="button" variant="outline" disabled={disabled || state !== 'idle'} onClick={() => void start()} className="min-h-11 h-auto gap-2 whitespace-normal">
        {state === 'idle' ? <Mic className="size-4 shrink-0" /> : <Loader2 className="size-4 shrink-0 animate-spin" />}{state === 'permission' ? copy.micPermission : state === 'transcribing' ? copy.micLoading : copy.micStart}
      </Button>}
    </div>
    {state !== 'idle' && <p role="status" className="text-base">{state === 'recording' ? copy.micRecording : state === 'permission' ? copy.micPermission : copy.micLoading}</p>}
    {error && <p role="alert" className="text-base text-red-800">{error}</p>}
  </div>
}
