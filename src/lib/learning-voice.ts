export const maxVoiceSeconds = 60
export const maxVoiceBytes = 44 + 48000 * 2 * maxVoiceSeconds

export function encodeVoiceWav(samples: Float32Array, sampleRate: number) {
  const length = Math.min(samples.length, sampleRate * maxVoiceSeconds)
  const buffer = new ArrayBuffer(44 + length * 2)
  const view = new DataView(buffer)
  const word = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)) }
  word(0, 'RIFF'); view.setUint32(4, buffer.byteLength - 8, true); word(8, 'WAVE'); word(12, 'fmt ')
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true)
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true)
  view.setUint16(32, 2, true); view.setUint16(34, 16, true); word(36, 'data'); view.setUint32(40, length * 2, true)
  for (let i = 0; i < length; i++) { const value = Math.max(-1, Math.min(1, samples[i])); view.setInt16(44 + i * 2, value * (value < 0 ? 32768 : 32767), true) }
  return buffer
}

// Validate actual PCM duration instead of trusting a duration supplied by the client.
export function voiceWavSeconds(buffer: ArrayBuffer): number | null {
  if (buffer.byteLength < 44 || buffer.byteLength > maxVoiceBytes) return null
  const view = new DataView(buffer)
  const word = (offset: number, value: string) => [...value].every((char, index) => view.getUint8(offset + index) === char.charCodeAt(0))
  if (!word(0, 'RIFF') || !word(8, 'WAVE') || !word(12, 'fmt ') || !word(36, 'data') ||
      view.getUint32(4, true) !== buffer.byteLength - 8 || view.getUint32(16, true) !== 16 ||
      view.getUint16(20, true) !== 1 || view.getUint16(22, true) !== 1 || view.getUint16(34, true) !== 16 || view.getUint16(32, true) !== 2) return null
  const sampleRate = view.getUint32(24, true)
  const bytes = view.getUint32(40, true)
  if (![16000, 22050, 24000, 32000, 44100, 48000].includes(sampleRate) || bytes !== buffer.byteLength - 44 || bytes % 2 || view.getUint32(28, true) !== sampleRate * 2) return null
  const seconds = bytes / (sampleRate * 2)
  return seconds >= 0.25 && seconds <= maxVoiceSeconds ? seconds : null
}

export function spokenText(markdown: string) {
  return markdown.replace(/```[\s\S]*?```/g, '').replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#*_`>]/g, '').trim()
}
