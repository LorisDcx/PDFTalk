'use client'

import { useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Check, Download, FilePlus2, Loader2, RotateCcw, Trash2, UploadCloud } from 'lucide-react'
import type { PdfTool } from '@/lib/pdf-tools'

function localizeError(message: string, locale: 'fr' | 'en') {
  if (locale === 'fr') return message
  const direct: Record<string, string> = {
    'Indique au moins une page.': 'Enter at least one page.',
    'Utilise des pages comme 1-3, 5, 8.': 'Enter pages like 1-3, 5, 8.',
    'Ajoute un fichier pour commencer.': 'Add a file to get started.',
    'Ce fichier dépasse 40 Mo. Essaie un PDF plus petit pour le traiter dans ton navigateur.': 'This file exceeds 40 MB. Try a smaller PDF for browser processing.',
    'Ce fichier ne semble pas être un PDF valide.': 'This does not appear to be a valid PDF.',
    'Ce PDF ne peut pas être ouvert. Il est peut-être protégé par un mot de passe ou endommagé.': 'This PDF cannot be opened. It may be password-protected or damaged.',
    'Chaque image doit faire moins de 20 Mo.': 'Each image must be under 20 MB.',
    'Utilise uniquement des images JPG ou PNG.': 'Use JPG or PNG images only.',
    'Ajoute au moins deux PDF à fusionner.': 'Add at least two PDFs to merge.',
    'Choisis une rotation de 90°, 180° ou 270°.': 'Choose a 90°, 180° or 270° rotation.',
    'Saisis un texte de 1 à 60 caractères.': 'Enter text between 1 and 60 characters.',
    'Ce texte contient des caractères non pris en charge. Essaie un texte latin simple.': 'This text has unsupported characters. Try simple Latin text.',
  }
  if (direct[message]) return direct[message]
  return message.replace(/^Choisis des pages entre 1 et (\d+)\.$/, 'Choose pages between 1 and $1.').replace(/^La page (\d+) apparaît deux fois\.$/, 'Page $1 appears twice.')
}

const copy = {
  fr: {
    tools: [
      ['merge', 'Fusionner', 'Rassembler plusieurs PDF dans l’ordre choisi.'],
      ['extract', 'Extraire', 'Créer un PDF avec les pages choisies.'],
      ['organize', 'Réorganiser', 'Changer l’ordre ou retirer des pages.'],
      ['rotate', 'Tourner', 'Redresser une ou plusieurs pages.'],
      ['number', 'Numéroter', 'Ajouter un numéro discret en bas de page.'],
      ['watermark', 'Filigrane', 'Ajouter un texte léger sur chaque page.'],
      ['metadata', 'Métadonnées', 'Effacer les champs PDF standards.'],
      ['images', 'Images en PDF', 'Assembler des JPG et PNG dans un PDF A4.'],
    ] as const,
    title: 'Choisis une action', intro: 'Un seul outil à la fois. Tes fichiers restent sur cet appareil.', add: 'Ajouter des fichiers', drop: 'Choisis tes fichiers', selected: 'Fichiers sélectionnés', pageCount: 'pages détectées', checking: 'Vérification du fichier…', unit: 'Mo', pages: 'Pages à garder', order: 'Ordre des pages', rotatePages: 'Pages à tourner (vide = toutes)', examples: 'Exemple : 1-3, 5', orderHelp: 'Indique le nouvel ordre. Les pages absentes seront retirées.', watermark: 'Texte du filigrane', watermarkPlaceholder: 'COPIE DE TRAVAIL', angle: 'Rotation', start: 'Créer le PDF', working: 'Traitement en cours…', ready: 'Ton PDF est prêt et a été téléchargé.', reset: 'Recommencer', remove: 'Retirer', up: 'Monter', down: 'Descendre', privacy: 'Traitement local, sans compte, sans quota et sans envoi de fichier.', metadataNote: 'Seuls les champs PDF standards sont retirés. Cela ne masque pas le texte ni les données visibles dans les pages.', limits: 'PDF de 40 Mo maximum par fichier ; JPG/PNG de 20 Mo maximum. Les PDF protégés par mot de passe ne sont pas pris en charge.', failure: 'Le traitement a échoué. Vérifie le fichier et réessaie.', available: 'outils disponibles', choose: 'Sélectionne un outil pour commencer.', output: 'Le fichier sera téléchargé automatiquement.',
  },
  en: {
    tools: [
      ['merge', 'Merge', 'Combine PDFs in the order you choose.'],
      ['extract', 'Extract', 'Create a PDF from selected pages.'],
      ['organize', 'Reorder', 'Change page order or remove pages.'],
      ['rotate', 'Rotate', 'Straighten one or more pages.'],
      ['number', 'Page numbers', 'Add subtle numbers at the bottom.'],
      ['watermark', 'Watermark', 'Add light text to every page.'],
      ['metadata', 'Metadata', 'Clear standard PDF metadata fields.'],
      ['images', 'Images to PDF', 'Combine JPG and PNG images into an A4 PDF.'],
    ] as const,
    title: 'Choose a task', intro: 'One tool at a time. Your files stay on this device.', add: 'Add files', drop: 'Choose files', selected: 'Selected files', pageCount: 'pages detected', checking: 'Checking file…', unit: 'MB', pages: 'Pages to keep', order: 'New page order', rotatePages: 'Pages to rotate (blank = all)', examples: 'Example: 1-3, 5', orderHelp: 'Enter the new order. Omitted pages will be removed.', watermark: 'Watermark text', watermarkPlaceholder: 'DRAFT COPY', angle: 'Rotation', start: 'Create PDF', working: 'Processing…', ready: 'Your PDF is ready and has been downloaded.', reset: 'Start over', remove: 'Remove', up: 'Move up', down: 'Move down', privacy: 'Processed locally, no account, no quota and no file upload.', metadataNote: 'Only standard PDF fields are cleared. Text or information visible on the pages is not hidden.', limits: 'Maximum 40 MB per PDF or 20 MB per JPG/PNG. Password-protected PDFs are not supported.', failure: 'Processing failed. Check the file and try again.', available: 'available tools', choose: 'Select a tool to get started.', output: 'The file will download automatically.',
  },
}

export function PdfToolkit({ locale = 'fr' }: { locale?: 'fr' | 'en' }) {
  const c = copy[locale]
  const [tool, setTool] = useState<PdfTool>('merge')
  const [files, setFiles] = useState<File[]>([])
  const [pageCount, setPageCount] = useState<number | null>(null)
  const [validating, setValidating] = useState(false)
  const [pages, setPages] = useState('')
  const [angle, setAngle] = useState(90)
  const [watermark, setWatermark] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const multi = tool === 'merge' || tool === 'images'
  const label = c.tools.find(item => item[0] === tool)?.[1]

  function selectTool(next: PdfTool) {
    setTool(next)
    setFiles([])
    setPageCount(null)
    setPages('')
    setError('')
    setSuccess(false)
    if (input.current) input.current.value = ''
  }

  async function addFiles(incoming: FileList | null) {
    if (!incoming) return
    const accepted = Array.from(incoming)
    const valid = accepted.every(file => tool === 'images' ? ['image/jpeg', 'image/png'].includes(file.type) : file.name.toLowerCase().endsWith('.pdf'))
    if (!valid) { setError(tool === 'images' ? (locale === 'fr' ? 'JPG et PNG uniquement.' : 'JPG and PNG only.') : (locale === 'fr' ? 'PDF uniquement.' : 'PDF files only.')); return }
    setValidating(true)
    try {
      if (tool !== 'images') {
        const { loadPdf } = await import('@/lib/pdf-tools')
        for (const file of accepted) {
          const pdf = await loadPdf(file)
          if (!multi) setPageCount(pdf.getPageCount())
        }
      } else if (accepted.some(file => file.size > 20 * 1024 * 1024)) {
        throw new Error('Chaque image doit faire moins de 20 Mo.')
      }
      setFiles(current => multi ? [...current, ...accepted] : accepted.slice(0, 1))
      setError('')
      setSuccess(false)
    } catch (cause) {
      setError(cause instanceof Error ? localizeError(cause.message, locale) : c.failure)
    } finally {
      setValidating(false)
    }
    if (input.current) input.current.value = ''
  }

  function moveFile(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= files.length) return
    setFiles(current => {
      const next = [...current]
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setSuccess(false)
  }

  async function process() {
    setError('')
    setSuccess(false)
    setBusy(true)
    try {
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
      const { runPdfTool } = await import('@/lib/pdf-tools')
      const bytes = await runPdfTool(tool, files, { pages, angle, text: watermark })
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      const base = files[0]?.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9À-ÿ_-]+/g, '-') || 'document'
      anchor.download = `${base}-${tool}.pdf`
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
      setSuccess(true)
    } catch (cause) {
      setError(cause instanceof Error ? localizeError(cause.message, locale) : c.failure)
    } finally {
      setBusy(false)
    }
  }

  return <section id="outil" className="scroll-mt-24 border-y border-[#eadbd2] bg-[#fff9f5] px-5 py-16 sm:px-8 lg:py-24" aria-labelledby="toolkit-heading">
    <div className="mx-auto max-w-6xl">
      <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b84432]">8 {c.available}</p><h2 id="toolkit-heading" className="font-editorial mt-3 text-4xl text-[#33252b] sm:text-5xl">{c.title}</h2><p className="mt-4 text-base leading-7 text-[#726667]">{c.intro}</p></div>
      <div className="mt-10 grid gap-6 lg:grid-cols-[310px_minmax(0,1fr)] lg:items-start">
        <div role="group" aria-label={c.title} className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
          {c.tools.map(([id, name, description]) => <button key={id} type="button" onClick={() => selectTool(id)} aria-pressed={tool === id} className={`min-h-16 rounded-xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b84432] sm:p-4 ${tool === id ? 'border-[#b84432] bg-[#fff0e7] text-[#823427]' : 'border-[#e8dcd4] bg-white text-[#403539] hover:border-[#d29a83]'}`}><span className="block text-sm font-bold sm:text-base">{name}</span><span className="mt-1 hidden text-sm leading-5 opacity-75 lg:block">{description}</span></button>)}
        </div>
        <div className="rounded-3xl border border-[#e9dcd3] bg-white p-5 sm:p-8">
          <div className="border-b border-[#ede2db] pb-6"><h3 className="font-editorial text-3xl text-[#33252b]">{label}</h3><p className="mt-2 text-base leading-7 text-[#73686a]">{c.tools.find(item => item[0] === tool)?.[2]}</p></div>
          <div className="mt-6">
            <input ref={input} type="file" accept={tool === 'images' ? 'image/jpeg,image/png' : 'application/pdf,.pdf'} multiple={multi} onChange={event => void addFiles(event.target.files)} className="sr-only" aria-label={c.add} />
            <button type="button" onClick={() => input.current?.click()} disabled={busy || validating} className="flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#d8b8a8] bg-[#fffaf6] px-5 py-6 text-center text-[#a44331] transition hover:bg-[#fff2ea] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b84432] disabled:opacity-50">{validating ? <Loader2 className="size-7 animate-spin" aria-hidden="true" /> : <UploadCloud className="size-7" aria-hidden="true" />}<span className="mt-3 font-bold">{validating ? c.checking : files.length ? c.add : c.drop}</span><span className="mt-1 text-sm text-[#796d6b]">{tool === 'images' ? 'JPG · PNG' : 'PDF'}</span></button>
          </div>
          {files.length > 0 && <div className="mt-6"><h4 className="text-sm font-bold text-[#463a3c]">{c.selected} · {files.length}{pageCount !== null && !multi ? ` · ${pageCount} ${c.pageCount}` : ''}</h4><ol className="mt-3 space-y-2">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex min-h-12 items-center gap-2 rounded-xl border border-[#eee4df] px-3 py-2"><FilePlus2 className="size-4 shrink-0 text-[#b84432]" aria-hidden="true" /><span className="min-w-0 flex-1 truncate text-sm" title={file.name}>{file.name}</span><span className="shrink-0 text-xs text-[#8b7b78]">{(file.size / 1024 / 1024).toFixed(1)} {c.unit}</span>{multi && <div className="flex shrink-0"><button type="button" onClick={() => moveFile(index, -1)} disabled={index === 0} aria-label={`${c.up} ${file.name}`} className="grid size-11 place-items-center disabled:opacity-30"><ArrowUp className="size-4" /></button><button type="button" onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} aria-label={`${c.down} ${file.name}`} className="grid size-11 place-items-center disabled:opacity-30"><ArrowDown className="size-4" /></button></div>}<button type="button" onClick={() => { setFiles(current => current.filter((_, item) => item !== index)); setPageCount(null); setSuccess(false) }} aria-label={`${c.remove} ${file.name}`} className="grid size-11 shrink-0 place-items-center text-[#8a5c55]"><Trash2 className="size-4" /></button></li>)}</ol></div>}
          {(tool === 'extract' || tool === 'organize' || tool === 'rotate') && <div className="mt-6"><label htmlFor="pdf-pages" className="block text-sm font-bold text-[#463a3c]">{tool === 'extract' ? c.pages : tool === 'organize' ? c.order : c.rotatePages}</label><input id="pdf-pages" value={pages} onChange={event => setPages(event.target.value)} placeholder={c.examples} className="mt-2 min-h-12 w-full rounded-xl border border-[#d8ccc7] bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-[#b84432]" /><p className="mt-2 text-sm text-[#776c6b]">{tool === 'organize' ? c.orderHelp : c.examples}</p></div>}
          {tool === 'rotate' && <div className="mt-5"><label htmlFor="pdf-angle" className="block text-sm font-bold">{c.angle}</label><select id="pdf-angle" value={angle} onChange={event => setAngle(Number(event.target.value))} className="mt-2 min-h-12 w-full rounded-xl border border-[#d8ccc7] bg-white px-4 text-base">{[90, 180, 270].map(value => <option key={value} value={value}>{value}°</option>)}</select></div>}
          {tool === 'watermark' && <div className="mt-6"><label htmlFor="pdf-watermark" className="block text-sm font-bold">{c.watermark}</label><input id="pdf-watermark" value={watermark} maxLength={60} onChange={event => setWatermark(event.target.value)} placeholder={c.watermarkPlaceholder} className="mt-2 min-h-12 w-full rounded-xl border border-[#d8ccc7] bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-[#b84432]" /></div>}
          {tool === 'metadata' && <p className="mt-6 rounded-xl bg-[#fff1e7] p-4 text-sm leading-6 text-[#754e42]">{c.metadataNote}</p>}
          {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
          {success && <p role="status" className="mt-6 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"><Check className="size-4" />{c.ready}</p>}
          <div className="mt-7 flex flex-wrap items-center gap-4"><button type="button" onClick={() => void process()} disabled={busy || validating || files.length === 0} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b84432] px-7 text-sm font-bold text-white hover:bg-[#963326] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b84432] disabled:cursor-not-allowed disabled:opacity-50">{busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}{busy ? c.working : c.start}</button>{files.length > 0 && <button type="button" onClick={() => { setFiles([]); setPageCount(null); setError(''); setSuccess(false) }} className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#745d56]"><RotateCcw className="size-4" />{c.reset}</button>}</div>
          <p className="mt-4 text-sm leading-6 text-[#807374]">{files.length ? c.output : c.choose}</p>
        </div>
      </div>
      <div className="mt-8 grid gap-2 text-sm leading-6 text-[#706666] sm:grid-cols-2"><p>{c.privacy}</p><p>{c.limits}</p></div>
    </div>
  </section>
}
