'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, GripVertical, Loader2, RotateCw } from 'lucide-react'
import type { PDFDocumentLoadingTask, PDFDocumentProxy } from 'pdfjs-dist'
import type { PdfTool } from '@/lib/pdf-tools'

const PAGE_BATCH = 18

const labels = {
  fr: {
    title: 'Aperçu des pages', original: 'Aperçu du document original',
    extract: 'Toutes les pages sont gardées au départ. Clique sur celles à exclure.', organize: 'Glisse les pages pour changer leur ordre, ou utilise les flèches. Clique pour retirer ou réintégrer une page.',
    rotate: 'Toutes les pages sont sélectionnées au départ. Clique pour exclure celles à laisser telles quelles.',
    selected: 'pages gardées', rotateSelected: 'pages à tourner', all: 'Tout sélectionner', none: 'Tout retirer',
    loading: 'Création des aperçus…', error: 'Impossible d’afficher les miniatures. Le traitement du PDF reste disponible.',
    previous: 'Pages précédentes', next: 'Pages suivantes', page: 'Page', of: 'sur', moveLeft: 'Déplacer avant', moveRight: 'Déplacer après',
    included: 'incluse', excluded: 'retirée', rotated: 'à tourner', unchanged: 'inchangée',
  },
  en: {
    title: 'Page preview', original: 'Original document preview',
    extract: 'All pages are kept at first. Click any you want to exclude.', organize: 'Drag pages to reorder them, or use the arrows. Click to remove or restore a page.',
    rotate: 'All pages are selected at first. Click any you want to leave unchanged.',
    selected: 'pages kept', rotateSelected: 'pages to rotate', all: 'Select all', none: 'Clear selection',
    loading: 'Creating previews…', error: 'Could not display thumbnails. PDF processing is still available.',
    previous: 'Previous pages', next: 'Next pages', page: 'Page', of: 'of', moveLeft: 'Move before', moveRight: 'Move after',
    included: 'included', excluded: 'removed', rotated: 'to rotate', unchanged: 'unchanged',
  },
}

export function PdfPageGrid({
  file, pageCount, order, selected, tool, angle, locale, onToggle, onMove, onSelectAll, onSelectNone,
}: {
  file: File
  pageCount: number
  order: number[]
  selected: number[]
  tool: PdfTool
  angle: number
  locale: 'fr' | 'en'
  onToggle: (page: number) => void
  onMove: (from: number, to: number) => void
  onSelectAll: () => void
  onSelectNone: () => void
}) {
  const c = labels[locale]
  const [previewDocument, setPreviewDocument] = useState<PDFDocumentProxy | null>(null)
  const [thumbnails, setThumbnails] = useState<Record<number, string>>({})
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [batch, setBatch] = useState(0)
  const dragIndex = useRef<number | null>(null)
  const selectedSet = new Set(selected)
  const isEditable = tool === 'extract' || tool === 'organize' || tool === 'rotate'
  const orderedPages = tool === 'organize' ? order : Array.from({ length: pageCount }, (_, index) => index)
  const batchCount = Math.ceil(pageCount / PAGE_BATCH)
  const visiblePages = orderedPages.slice(batch * PAGE_BATCH, (batch + 1) * PAGE_BATCH)

  useEffect(() => {
    let active = true
    let task: PDFDocumentLoadingTask | null = null
    async function open() {
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
      task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
      const document = await task.promise
      if (!active) { await task?.destroy(); return }
      setPreviewDocument(document)
      setStatus('ready')
    }
    void open().catch(() => { if (active) setStatus('error') })
    return () => {
      active = false
      if (task) void task.destroy()
    }
  }, [file])

  useEffect(() => {
    if (!previewDocument) return
    let active = true
    async function renderPages() {
      for (const index of visiblePages) {
        if (!active) return
        if (thumbnails[index]) continue
        try {
          const page = await previewDocument!.getPage(index + 1)
          const natural = page.getViewport({ scale: 1 })
          const viewport = page.getViewport({ scale: 168 / natural.width })
          const canvas = document.createElement('canvas')
          canvas.width = Math.ceil(viewport.width)
          canvas.height = Math.ceil(viewport.height)
          const context = canvas.getContext('2d')
          if (!context) throw new Error('Canvas unavailable')
          await page.render({ canvas, canvasContext: context, viewport }).promise
          if (active) setThumbnails(current => ({ ...current, [index]: canvas.toDataURL('image/png') }))
          page.cleanup()
        } catch {
          if (active) setStatus('error')
          return
        }
      }
    }
    void renderPages()
    return () => { active = false }
    // Render only when the document or visible page batch changes; cached thumbnails avoid repeat work.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewDocument, batch, order])

  const instruction = tool === 'extract' ? c.extract : tool === 'organize' ? c.organize : tool === 'rotate' ? c.rotate : c.original
  return <div className="mt-8 border-t border-[var(--cd-line)] pt-7">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h4 className="font-editorial text-2xl text-[var(--cd-ink)]">{c.title}</h4><p className="mt-2 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{instruction}</p></div>
      {isEditable && <p role="status" className="rounded-full bg-[#fff0e7] px-4 py-2 text-sm font-bold text-[#963326]">{selected.length} / {pageCount} {tool === 'rotate' ? c.rotateSelected : c.selected}</p>}
    </div>

    {isEditable && <div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={onSelectAll} className="min-h-11 rounded-xl border border-[#d8b8a8] px-4 text-sm font-semibold text-[#823427] hover:bg-[#fff0e7]">{c.all}</button><button type="button" onClick={onSelectNone} className="min-h-11 rounded-xl border border-[#e8dcd4] px-4 text-sm font-semibold text-[#635557] hover:bg-[#f7f2ef]">{c.none}</button></div>}

    {status === 'loading' && <p role="status" className="mt-6 flex items-center gap-2 text-sm text-[var(--cd-muted)]"><Loader2 className="size-4 animate-spin" />{c.loading}</p>}
    {status === 'error' && <p role="alert" className="mt-6 rounded-xl border border-[#e9d6cb] bg-[#fff7f0] p-4 text-sm text-[#8a4a38]">{c.error}</p>}

    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {visiblePages.map((pageIndex, position) => {
        const included = selectedSet.has(pageIndex)
        const pageLabel = `${c.page} ${pageIndex + 1}`
        const stateLabel = tool === 'rotate' ? (included ? c.rotated : c.unchanged) : (included ? c.included : c.excluded)
        const orderedPosition = batch * PAGE_BATCH + position
        return <div key={pageIndex} draggable={tool === 'organize'} onDragStart={() => { dragIndex.current = orderedPosition }} onDragOver={event => { if (tool === 'organize') event.preventDefault() }} onDrop={event => { event.preventDefault(); if (dragIndex.current !== null) onMove(dragIndex.current, orderedPosition); dragIndex.current = null }} onDragEnd={() => { dragIndex.current = null }} className={`min-w-0 rounded-xl border p-2 ${included ? 'border-[#d7cbc4] bg-white' : 'border-[#dcc7bd] bg-[#f6efeb]'}`}>
          <button type="button" onClick={() => { if (isEditable) onToggle(pageIndex) }} disabled={!isEditable} aria-pressed={isEditable ? included : undefined} aria-label={`${pageLabel}, ${stateLabel}`} className={`group flex w-full flex-col items-center rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)] ${isEditable ? 'cursor-pointer' : 'cursor-default'}`}>
            <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-[#f1ede9]">
              {thumbnails[pageIndex] ? <Image src={thumbnails[pageIndex]} alt="" width={168} height={224} unoptimized className={`max-h-full max-w-full object-contain transition-transform ${tool === 'rotate' && included ? (angle === 90 ? 'rotate-90' : angle === 180 ? 'rotate-180' : '-rotate-90') : ''}`} /> : <span className="h-3/4 w-3/5 animate-pulse rounded bg-white" />}
              {isEditable && <span aria-hidden="true" className={`absolute right-2 top-2 grid size-6 place-items-center rounded-full text-xs font-bold ${included ? 'bg-[#b84432] text-white' : 'bg-white text-[#8e6a5f]'}`}>{included ? '✓' : '−'}</span>}
            </span>
            <span className="mt-2 w-full truncate px-1 text-sm font-bold text-[#413438]">{pageLabel}</span>
            <span className="mb-1 w-full px-1 text-xs text-[#75676a]">{stateLabel}</span>
          </button>
          {tool === 'organize' && <div className="mt-1 flex items-center justify-between border-t border-[#eee4df] pt-1"><button type="button" onClick={() => onMove(orderedPosition, orderedPosition - 1)} disabled={orderedPosition === 0} aria-label={`${c.moveLeft}, ${pageLabel}`} className="grid size-11 place-items-center rounded-lg hover:bg-[#fff0e7] disabled:opacity-30"><ArrowLeft className="size-4" /></button><GripVertical className="size-4 text-[#a99a96]" aria-hidden="true" /><button type="button" onClick={() => onMove(orderedPosition, orderedPosition + 1)} disabled={orderedPosition === pageCount - 1} aria-label={`${c.moveRight}, ${pageLabel}`} className="grid size-11 place-items-center rounded-lg hover:bg-[#fff0e7] disabled:opacity-30"><ArrowRight className="size-4" /></button></div>}
          {tool === 'rotate' && included && <div className="mt-1 flex items-center justify-center border-t border-[#eee4df] pt-2 text-xs font-semibold text-[#a44331]"><RotateCw className="mr-1 size-3" />{angle}°</div>}
        </div>
      })}
    </div>

    {batchCount > 1 && <nav aria-label={c.title} className="mt-6 flex items-center justify-between gap-3"><button type="button" disabled={batch === 0} onClick={() => setBatch(current => current - 1)} className="min-h-11 rounded-xl border border-[#e6d8d0] px-3 text-sm font-semibold disabled:opacity-40">{c.previous}</button><span className="text-sm tabular-nums text-[#776b6b]">{batch + 1} {c.of} {batchCount}</span><button type="button" disabled={batch === batchCount - 1} onClick={() => setBatch(current => current + 1)} className="min-h-11 rounded-xl border border-[#e6d8d0] px-3 text-sm font-semibold disabled:opacity-40">{c.next}</button></nav>}
  </div>
}
