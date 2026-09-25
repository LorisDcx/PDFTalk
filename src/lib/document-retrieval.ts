const STOP_WORDS = new Set([
  'avec', 'dans', 'cette', 'comment', 'pourquoi', 'quoi', 'quelle', 'quelles', 'quel', 'quels',
  'est', 'sont', 'vous', 'nous', 'notre', 'votre', 'leur', 'leurs', 'cela', 'cette', 'document',
  'partie', 'explique', 'parle', 'peux', 'peut', 'faire', 'avoir', 'plus', 'moins', 'pdf',
  'what', 'where', 'when', 'which', 'about', 'this', 'that', 'these', 'those', 'your',
  'from', 'with', 'could', 'would', 'should', 'please', 'explain', 'document',
])

function words(value: string) {
  const normalized = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return normalized.match(/[\p{L}\p{N}]{3,}/gu) || []
}

/** Keep relevant passages from long PDFs in the model's context window. */
export function selectDocumentContext(content: string, question: string, maxChars = 15000) {
  if (content.length <= maxChars) return content

  const terms = [...new Set(words(question).filter(word => !STOP_WORDS.has(word)))].slice(-16)
  const chunkSize = Math.min(2600, Math.max(1200, Math.floor((maxChars - 1200) / 5)))
  const overlap = 200
  const chunks: { start: number; text: string; score: number }[] = []
  for (let start = 0; start < content.length; start += chunkSize - overlap) {
    const text = content.slice(start, start + chunkSize)
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const score = terms.reduce((total, term) => {
      const occurrences = normalized.split(term).length - 1
      return total + Math.min(occurrences, 3) * Math.min(term.length, 10)
    }, 0)
    chunks.push({ start, text, score })
  }

  const chosen = [chunks[0]]
  for (const chunk of [...chunks.slice(1)].sort((a, b) => b.score - a.score)) {
    if (chosen.length >= 5) break
    if (chunk.score > 0) chosen.push(chunk)
  }
  if (chosen.length === 1) {
    for (const index of [Math.floor(chunks.length / 2), chunks.length - 1]) {
      if (!chosen.includes(chunks[index])) chosen.push(chunks[index])
    }
  }

  return `Selected excerpts from a longer PDF. If the answer is not in these excerpts, say you could not locate it in the available passages rather than inventing it.\n\n${chosen
    .sort((a, b) => a.start - b.start)
    .map(chunk => `[Excerpt around character ${chunk.start + 1}]\n${chunk.text}`)
    .join('\n\n')}`
}
