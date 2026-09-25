'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, FileText, Trash2 } from 'lucide-react'
import type { PDFDocumentLoadingTask } from 'pdfjs-dist'

function FileCover({ file }: { file: File }) {
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    let task: PDFDocumentLoadingTask | null = null
    let objectUrl: string | null = null
    async function load() {
      if (file.type.startsWith('image/')) {
        objectUrl = URL.createObjectURL(file)
        if (active) setPreview(objectUrl)
        return
      }
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
      task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) })
      const document = await task.promise
      const page = await document.getPage(1)
      const natural = page.getViewport({ scale: 1 })
      const viewport = page.getViewport({ scale: 150 / natural.width })
      const canvas = window.document.createElement('canvas')
      canvas.width = Math.ceil(viewport.width)
      canvas.height = Math.ceil(viewport.height)
      const context = canvas.getContext('2d')
      if (!context) return
      await page.render({ canvas, canvasContext: context, viewport }).promise
      if (active) setPreview(canvas.toDataURL('image/png'))
      await task.destroy()
      task = null
    }
    void load().catch(() => {})
    return () => {
      active = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      if (task) void task.destroy()
    }
  }, [file])

  return <div className="flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-[#f4efeb]">{preview ? <Image src={preview} alt="" width={150} height={200} unoptimized className="max-h-full max-w-full object-contain" /> : <FileText className="size-8 text-[#a5958e]" aria-hidden="true" />}</div>
}

export function PdfFileQueue({ files, pageCount, multi, locale, onMove, onRemove }: {
  files: File[]
  pageCount: number | null
  multi: boolean
  locale: 'fr' | 'en'
  onMove: (index: number, direction: -1 | 1) => void
  onRemove: (index: number) => void
}) {
  const english = locale === 'en'
  return <section className="mt-6" aria-label={english ? 'Selected files' : 'Fichiers sélectionnés'}>
    <h4 className="text-sm font-bold text-[#463a3c]">{english ? 'Selected files' : 'Fichiers sélectionnés'} · {files.length}{pageCount !== null && !multi ? ` · ${pageCount} ${english ? 'pages detected' : 'pages détectées'}` : ''}</h4>
    <ol className={multi ? 'mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3' : 'mt-3 space-y-2'}>
      {files.map((file, index) => <li key={`${file.name}-${file.lastModified}-${index}`} className={multi ? 'min-w-0 rounded-xl border border-[#eee4df] bg-white p-2' : 'flex min-h-12 min-w-0 items-center gap-3 rounded-xl border border-[#eee4df] px-3 py-2'}>
        {multi && <FileCover file={file} />}
        {!multi && <FileText className="size-5 shrink-0 text-[#b84432]" aria-hidden="true" />}
        <div className={multi ? 'mt-2 min-w-0 px-1' : 'min-w-0 flex-1'}><p className="truncate text-sm font-semibold text-[#403539]" title={file.name}>{multi ? `${index + 1}. ` : ''}{file.name}</p><p className="text-xs text-[#8b7b78]">{(file.size / 1024 / 1024).toFixed(1)} {english ? 'MB' : 'Mo'}</p></div>
        <div className={multi ? 'mt-2 flex items-center justify-between border-t border-[#eee4df] pt-1' : 'shrink-0'}>
          {multi && <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`${english ? 'Move before' : 'Déplacer avant'} ${file.name}`} className="grid size-11 place-items-center rounded-lg hover:bg-[#fff0e7] disabled:opacity-30"><ArrowLeft className="size-4" /></button>}
          {multi && <button type="button" onClick={() => onMove(index, 1)} disabled={index === files.length - 1} aria-label={`${english ? 'Move after' : 'Déplacer après'} ${file.name}`} className="grid size-11 place-items-center rounded-lg hover:bg-[#fff0e7] disabled:opacity-30"><ArrowRight className="size-4" /></button>}
          <button type="button" onClick={() => onRemove(index)} aria-label={`${english ? 'Remove' : 'Retirer'} ${file.name}`} className="grid size-11 place-items-center rounded-lg text-[#8a5c55] hover:bg-[#fff0e7]"><Trash2 className="size-4" /></button>
        </div>
      </li>)}
    </ol>
  </section>
}
