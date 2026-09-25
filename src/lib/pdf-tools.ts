import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib'

export type PdfTool = 'merge' | 'extract' | 'organize' | 'rotate' | 'number' | 'watermark' | 'metadata' | 'images'

export function parsePages(input: string, count: number, allowDuplicates = false): number[] {
  if (!input.trim()) throw new Error('Indique au moins une page.')
  const pages: number[] = []
  for (const part of input.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/)
    if (!match) throw new Error('Utilise des pages comme 1-3, 5, 8.')
    const from = Number(match[1])
    const to = match[2] ? Number(match[2]) : from
    if (from < 1 || to > count || from > to) throw new Error(`Choisis des pages entre 1 et ${count}.`)
    for (let page = from; page <= to; page++) {
      if (!allowDuplicates && pages.includes(page - 1)) throw new Error(`La page ${page} apparaît deux fois.`)
      pages.push(page - 1)
    }
  }
  return pages
}

export async function loadPdf(file: File): Promise<PDFDocument> {
  if (file.size > 40 * 1024 * 1024) throw new Error('Ce fichier dépasse 40 Mo. Essaie un PDF plus petit pour le traiter dans ton navigateur.')
  const bytes = new Uint8Array(await file.arrayBuffer())
  if (String.fromCharCode(...bytes.slice(0, 5)) !== '%PDF-') throw new Error('Ce fichier ne semble pas être un PDF valide.')
  try {
    const pdf = await PDFDocument.load(bytes)
    if (!pdf.getPageCount()) throw new Error('Ce PDF ne contient aucune page.')
    return pdf
  } catch {
    throw new Error('Ce PDF ne peut pas être ouvert. Il est peut-être protégé par un mot de passe ou endommagé.')
  }
}

export async function runPdfTool(tool: PdfTool, files: File[], options: { pages?: string; angle?: number; text?: string }): Promise<Uint8Array> {
  if (!files.length) throw new Error('Ajoute un fichier pour commencer.')
  if (tool === 'images') {
    const pdf = await PDFDocument.create()
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) throw new Error('Chaque image doit faire moins de 20 Mo.')
      const bytes = new Uint8Array(await file.arrayBuffer())
      const image = file.type === 'image/png' ? await pdf.embedPng(bytes) : file.type === 'image/jpeg' ? await pdf.embedJpg(bytes) : null
      if (!image) throw new Error('Utilise uniquement des images JPG ou PNG.')
      const page = pdf.addPage([595.28, 841.89])
      const scale = Math.min(535.28 / image.width, 781.89 / image.height)
      const width = image.width * scale
      const height = image.height * scale
      page.drawImage(image, { x: (595.28 - width) / 2, y: (841.89 - height) / 2, width, height })
    }
    return pdf.save()
  }

  if (tool === 'merge') {
    if (files.length < 2) throw new Error('Ajoute au moins deux PDF à fusionner.')
    const output = await PDFDocument.create()
    for (const file of files) {
      const source = await loadPdf(file)
      const pages = await output.copyPages(source, source.getPageIndices())
      pages.forEach(page => output.addPage(page))
    }
    return output.save()
  }

  const source = await loadPdf(files[0])
  const count = source.getPageCount()
  if (tool === 'extract' || tool === 'organize') {
    const selected = parsePages(options.pages || '', count)
    const output = await PDFDocument.create()
    const pages = await output.copyPages(source, selected)
    pages.forEach(page => output.addPage(page))
    return output.save()
  }

  if (tool === 'rotate') {
    const selected = options.pages?.trim() ? parsePages(options.pages, count) : source.getPageIndices()
    const angle = options.angle || 90
    if (![90, 180, 270].includes(angle)) throw new Error('Choisis une rotation de 90°, 180° ou 270°.')
    selected.forEach(index => {
      const page = source.getPage(index)
      page.setRotation(degrees((page.getRotation().angle + angle) % 360))
    })
  } else if (tool === 'number') {
    const font = await source.embedFont(StandardFonts.Helvetica)
    source.getPages().forEach((page, index) => {
      const text = String(index + 1)
      const size = 10
      page.drawText(text, { x: (page.getWidth() - font.widthOfTextAtSize(text, size)) / 2, y: 18, size, font, color: rgb(0.28, 0.24, 0.24) })
    })
  } else if (tool === 'watermark') {
    const text = (options.text || '').trim()
    if (!text || text.length > 60) throw new Error('Saisis un texte de 1 à 60 caractères.')
    const font = await source.embedFont(StandardFonts.Helvetica)
    try { font.encodeText(text) } catch { throw new Error('Ce texte contient des caractères non pris en charge. Essaie un texte latin simple.') }
    source.getPages().forEach(page => {
      const size = Math.min(42, (page.getWidth() - 80) / Math.max(1, font.widthOfTextAtSize(text, 1)))
      page.drawText(text, { x: (page.getWidth() - font.widthOfTextAtSize(text, size)) / 2, y: page.getHeight() / 2, size, font, color: rgb(0.72, 0.23, 0.17), opacity: 0.22 })
    })
  } else if (tool === 'metadata') {
    source.setTitle('')
    source.setAuthor('')
    source.setSubject('')
    source.setKeywords([])
    source.setCreator('')
    source.setProducer('')
  }
  return source.save()
}
