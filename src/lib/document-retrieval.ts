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

const PAGE_MARKER = /\[\[PAGE (\d+)\]\]/g

function pageMarkers(content: string) {
  return [...content.matchAll(PAGE_MARKER)].map(match => ({ start: match.index, page: Number(match[1]) }))
}

/** Only surface citations that are literally present in the stored source text. */
export function verifySourceQuote(content: string, quote: string) {
  const normalizedQuote = quote.replace(/\s+/g, ' ').normalize('NFKC').trim()
  if (normalizedQuote.length < 12 || normalizedQuote.length > 500) return null
  const markers = pageMarkers(content)
  const normalize = (text: string) => text.replace(/\s+/g, ' ').normalize('NFKC')
  if (!markers.length) return normalize(content).includes(normalizedQuote) ? { quote: quote.trim(), page: null } : null
  for (let index = 0; index < markers.length; index++) {
    const start = markers[index].start + `[[PAGE ${markers[index].page}]]`.length
    const end = markers[index + 1]?.start ?? content.length
    if (normalize(content.slice(start, end)).includes(normalizedQuote)) {
      return { quote: quote.trim(), page: markers[index].page }
    }
  }
  return null
}

/** Spread a fixed prompt budget over the whole document instead of only its opening. */
export function sampleDocumentSections(content: string, maxChars = 12_000) {
  if (content.length <= maxChars) return content
  const parts = 6
  const size = Math.floor(maxChars / parts)
  const excerpts = Array.from({ length: parts }, (_, index) => {
    const start = Math.floor((content.length - size) * index / (parts - 1))
    const marker = pageMarkers(content).findLast(item => item.start <= start)
    return `[${marker ? `Near page ${marker.page}` : `Excerpt ${index + 1}`} ]\n${content.slice(start, start + size)}`
  })
  return `Excerpts sampled across the document. Do not claim full coverage.\n\n${excerpts.join('\n\n')}`
}

/** Keep relevant passages from long PDFs in the model's context window. */
export function selectDocumentContext(content: string, question: string, maxChars = 15000) {
  if (content.length <= maxChars) return content

  const terms = [...new Set(words(question).filter(word => !STOP_WORDS.has(word)))].slice(-16)
  const chunkSize = Math.min(2600, Math.max(1200, Math.floor((maxChars - 1200) / 5)))
  const overlap = 200
  const chunks: { start: number; text: string; score: number }[] = []
  const markers = pageMarkers(content)
  for (let start = 0; start < content.length; start += chunkSize - overlap) {
    const text = content.slice(start, start + chunkSize)
    const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    const score = terms.reduce((total, term) => {
      const occurrences = normalized.split(term).length - 1
      const stem = term.length >= 6 ? term.slice(0, 5) : ''
      const relatedOccurrences = occurrences === 0 && stem ? normalized.split(stem).length - 1 : 0
      return total + Math.min(occurrences, 3) * Math.min(term.length, 10) + Math.min(relatedOccurrences, 2) * 2
    }, 0)
    chunks.push({ start, text, score })
  }

  const chosen = [chunks[0]]
  for (const chunk of [...chunks.slice(1)].sort((a, b) => b.score - a.score)) {
    if (chosen.length >= 5) break
    if (chunk.score > 0) chosen.push(chunk)
  }
  if (chosen.length === 1) {
    for (const index of [0.25, 0.5, 0.75, 1].map(fraction => Math.floor((chunks.length - 1) * fraction))) {
      if (!chosen.includes(chunks[index])) chosen.push(chunks[index])
    }
  }

  return `Selected excerpts from a longer PDF. If the answer is not in these excerpts, say you could not locate it in the available passages rather than inventing it.\n\n${chosen
    .sort((a, b) => a.start - b.start)
    .map(chunk => {
      const marker = markers.findLast(item => item.start <= chunk.start)
      return `[${marker ? `Starting near page ${marker.page}, ` : ''}excerpt around character ${chunk.start + 1}]\n${chunk.text}`
    })
    .join('\n\n')}`
}
