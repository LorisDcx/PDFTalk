export interface PDFExtractResult {
  text: string
  numPages: number
  pages: { pageNumber: number; text: string }[]
  info: { title?: string; author?: string; subject?: string; keywords?: string }
  isScannedOrImageBased?: boolean
  warning?: string
}

export type PDFExtractionErrorCode = 'pdf_password_protected' | 'pdf_invalid' | 'pdf_too_complex' | 'pdf_processing_unavailable'

export class PDFExtractionError extends Error {
  readonly code: PDFExtractionErrorCode

  constructor(code: PDFExtractionErrorCode, message: string) {
    super(message)
    this.name = 'PDFExtractionError'
    this.code = code
  }
}

function cleanPDFText(text: string) {
  return text
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ')
    .replace(/\ufffd/g, '')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n').map(line => line.trim()).join('\n')
    .trim()
}

type PositionedText = { str: string; x: number; y: number; width: number }

function textInReadingOrder(items: PositionedText[]) {
  items.sort((a, b) => Math.abs(b.y - a.y) < 5 ? a.x - b.x : b.y - a.y)
  const lines: PositionedText[][] = []
  for (const item of items) {
    const current = lines.at(-1)
    if (current && Math.abs(current[0].y - item.y) < 5) current.push(item)
    else lines.push([item])
  }
  return cleanPDFText(lines.map(line => {
    line.sort((a, b) => a.x - b.x)
    let value = ''
    let lastRight = 0
    for (const item of line) {
      const gap = item.x - lastRight
      if (value && gap > 50) value += '\t'
      else if (value && gap > 10) value += ' '
      value += item.str
      lastRight = item.x + item.width
    }
    return value
  }).join('\n'))
}

export async function extractTextFromPDF(buffer: Buffer): Promise<PDFExtractResult> {
  try {
    // Use the same modern PDF.js engine as the browser page preview.
    // PDF.js uses a fake worker on the server. Import it so Next bundles the
    // handler; its default relative worker path points into .next/server/chunks.
    await import('pdfjs-dist/legacy/build/pdf.worker.mjs')
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
      stopAtErrors: true,
    })
    try {
      const document = await loadingTask.promise
      if (document.numPages > 500) throw new Error('Document exceeds the 500-page processing limit.')
      const pages: PDFExtractResult['pages'] = []
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber++) {
        const page = await document.getPage(pageNumber)
        const content = await page.getTextContent()
        const items: PositionedText[] = []
        for (const item of content.items) {
          if ('str' in item && item.str.trim()) {
            items.push({ str: item.str, x: item.transform[4], y: item.transform[5], width: item.width || 0 })
          }
        }
        pages.push({ pageNumber, text: textInReadingOrder(items) })
        page.cleanup()
      }
      const text = pages.map(page => page.text).filter(Boolean).join('\n\n')
      const averageChars = text.replace(/\s+/g, '').length / document.numPages
      const emptyPages = pages.filter(page => !page.text).length
      const isScannedOrImageBased = averageChars < 100 || emptyPages > 0
      const metadata = await document.getMetadata().catch(() => null)
      const info = metadata?.info as Record<string, unknown> | undefined
      return {
        text, numPages: document.numPages, pages,
        info: {
          title: typeof info?.Title === 'string' ? info.Title : undefined,
          author: typeof info?.Author === 'string' ? info.Author : undefined,
          subject: typeof info?.Subject === 'string' ? info.Subject : undefined,
          keywords: typeof info?.Keywords === 'string' ? info.Keywords : undefined,
        },
        isScannedOrImageBased,
        warning: isScannedOrImageBased
          ? text ? `${emptyPages || 'Some'} page${emptyPages === 1 ? '' : 's'} may contain scanned or image-only content. Text extraction may be incomplete.`
            : 'No selectable text was found. Use a PDF with selectable text.'
          : undefined,
      }
    } finally {
      await loadingTask.destroy()
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (message.includes('500-page')) throw error
    if (/password|encrypted/i.test(message)) throw new PDFExtractionError('pdf_password_protected', 'This PDF is password-protected. Please provide an unencrypted version.')
    if (/invalid|corrupt|format|structure/i.test(message)) throw new PDFExtractionError('pdf_invalid', 'This PDF appears to be corrupted or invalid. Please try a different file.')
    if (/memory|heap/i.test(message)) throw new PDFExtractionError('pdf_too_complex', 'This PDF is too complex to process. Please try a simpler document.')
    console.error('PDF extraction failed:', error)
    throw new PDFExtractionError('pdf_processing_unavailable', 'PDF processing is temporarily unavailable. Please try again later.')
  }
}

/** Preserve page references and sample every page when a document exceeds the AI budget. */
export function prepareDocumentText(result: PDFExtractResult, maxChars = 400_000) {
  const pages = result.pages.length ? result.pages : [{ pageNumber: 1, text: result.text }]
  const totalChars = pages.reduce((sum, page) => sum + page.text.length, 0)
  const sampled = totalChars > maxChars
  const perPage = sampled ? Math.max(120, Math.floor((maxChars - pages.length * 24) / pages.length)) : Infinity
  const text = pages.map(page => {
    const content = page.text.length > perPage
      ? `${page.text.slice(0, Math.ceil(perPage / 2))}\n[…]\n${page.text.slice(-Math.floor(perPage / 2))}`
      : page.text
    return `[[PAGE ${page.pageNumber}]]\n${content}`
  }).join('\n\n')
  const notices = [
    sampled ? `[PARTIAL EXCERPTS FROM EACH PAGE — ${pages.length} PAGES]` : '',
    result.isScannedOrImageBased ? '[[SOURCE_GAPS]]' : '',
  ].filter(Boolean).join('\n')
  return { text: notices ? `${notices}\n${text}` : text, sampled }
}
