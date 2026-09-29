'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, Download, FileSearch, Loader2, Search, UploadCloud } from 'lucide-react'
import { STUDY_PDF_LOCALES, studyPdfCopy, studyPdfCopyFailure, studyPdfPath, type StudyPdfLocale } from '@/lib/study-pdf-locales'

type PageText = { number: number; text: string }
type Status = 'empty' | 'loading' | 'ready' | 'error'

function normalized(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()
}

export function StudyPdfInspector({ locale }: { locale: StudyPdfLocale }) {
  const c = studyPdfCopy[locale]
  const input = useRef<HTMLInputElement>(null)
  const blobUrl = useRef<string | null>(null)
  const [status, setStatus] = useState<Status>('empty')
  const [fileName, setFileName] = useState('')
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pages, setPages] = useState<PageText[]>([])
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [shown, setShown] = useState(12)
  const [copied, setCopied] = useState(false)
  const [dragging, setDragging] = useState(false)

  useEffect(() => () => { if (blobUrl.current) URL.revokeObjectURL(blobUrl.current) }, [])

  const readable = pages.filter(page => page.text.trim()).length
  const pageLabel = (number: number) => locale === 'zh' ? `第 ${number} 页` : locale === 'ja' ? `${number}ページ` : `${c.page} ${number}`
  const text = useMemo(() => pages.map(page => `${locale === 'zh' ? `第 ${page.number} 页` : locale === 'ja' ? `${page.number}ページ` : `${c.page} ${page.number}`}\n${page.text}`).join('\n\n'), [pages, locale, c.page])
  const wordCount = useMemo(() => {
    if (!pages.length) return 0
    const segmenter = new Intl.Segmenter(locale, { granularity: 'word' })
    let count = 0
    for (const page of pages) for (const part of segmenter.segment(page.text)) if (part.isWordLike) count++
    return count
  }, [pages, locale])
  const indexedPages = useMemo(() => pages.map(page => ({ page, searchText: normalized(page.text) })), [pages])
  const matching = useMemo(() => {
    const term = normalized(query.trim())
    return indexedPages.filter(item => !term || item.searchText.includes(term)).map(item => item.page)
  }, [indexedPages, query])
  const formatted = (value: number) => new Intl.NumberFormat(locale).format(value)

  async function inspect(file?: File) {
    if (!file) return
    setError('')
    setQuery('')
    setShown(12)
    setCopied(false)
    setPages([])
    setProgress({ current: 0, total: 0 })
    setFileName(file.name)
    if (file.size > 40 * 1024 * 1024) { setError(c.tooLarge); setStatus('error'); return }
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError(c.invalid); setStatus('error'); return
    }
    setStatus('loading')
    let task: import('pdfjs-dist').PDFDocumentLoadingTask | undefined
    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      if (new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') throw new Error('invalid-pdf')
      const pdfjs = await import('pdfjs-dist')
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()
      task = pdfjs.getDocument({ data: bytes, stopAtErrors: true })
      const pdf = await task.promise
      if (pdf.numPages > 500) throw new Error('page-limit')
      setProgress({ current: 0, total: pdf.numPages })
      const result: PageText[] = []
      for (let number = 1; number <= pdf.numPages; number++) {
        const page = await pdf.getPage(number)
        const content = await page.getTextContent()
        const chunks: string[] = []
        for (const item of content.items) {
          if ('str' in item && item.str.trim()) chunks.push(item.str + (item.hasEOL ? '\n' : ' '))
        }
        result.push({ number, text: chunks.join('').replace(/[^\S\n]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim() })
        page.cleanup()
        if (number === 1 || number % 5 === 0 || number === pdf.numPages) setProgress({ current: number, total: pdf.numPages })
      }
      if (blobUrl.current) URL.revokeObjectURL(blobUrl.current)
      blobUrl.current = URL.createObjectURL(file)
      setPdfUrl(blobUrl.current)
      setPages(result)
      setStatus('ready')
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : ''
      setError(message === 'invalid-pdf' ? c.invalid : message === 'page-limit' ? c.limit : /password|encrypted/i.test(message) ? c.protected : c.failure)
      setStatus('error')
    } finally {
      if (task) await task.destroy().catch(() => undefined)
      if (input.current) input.current.value = ''
    }
  }

  function downloadText() {
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${fileName.replace(/\.pdf$/i, '') || 'course'}-text.txt`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch { setError(studyPdfCopyFailure[locale]) }
  }

  function excerpt(page: PageText) {
    const source = page.text.replace(/\s+/g, ' ')
    if (!source) return c.imageOnly
    const index = normalized(source).indexOf(normalized(query.trim()))
    const start = index > 80 ? index - 75 : 0
    return `${start ? '…' : ''}${source.slice(start, start + 260)}${source.length > start + 260 ? '…' : ''}`
  }

  return <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--cd-paper)] text-[var(--cd-ink)]">
    <header className="border-b border-[var(--cd-line)] bg-[var(--cd-surface)] px-5 sm:px-8"><div className="mx-auto flex min-h-18 max-w-6xl flex-wrap items-center justify-between gap-3 py-3">
      <Link href={locale === 'fr' ? '/' : `/${locale}`} className="inline-flex items-center gap-2"><Image src="/logo.png" alt="" width={34} height={34} className="size-9 rounded-xl" /><span dir="ltr" className="font-editorial text-2xl">CramDesk<span className="text-[var(--cd-brand)]">.</span></span></Link>
      <nav className="flex items-center gap-2 text-sm font-semibold"><Link href={locale === 'fr' ? '/' : `/${locale}`} className="inline-flex min-h-11 items-center rounded-xl px-3 hover:bg-[var(--cd-paper)]">{c.home}</Link><details className="group relative"><summary className="flex min-h-11 cursor-pointer list-none items-center rounded-xl border border-[var(--cd-line)] px-3 marker:hidden">{c.name} ⌄</summary><div className="absolute end-0 z-20 mt-2 max-h-72 min-w-40 overflow-auto rounded-xl border border-[var(--cd-line)] bg-white p-2 shadow-lg">{STUDY_PDF_LOCALES.map(item => <Link key={item} href={studyPdfPath(item)} lang={item} className="block min-h-11 rounded-lg px-3 py-2 hover:bg-[var(--cd-paper)]">{studyPdfCopy[item].name}</Link>)}</div></details></nav>
    </div></header>

    <section className="px-5 pb-8 pt-12 sm:px-8 sm:pt-16"><div className="mx-auto max-w-5xl"><p className="text-sm font-bold uppercase tracking-[.14em] text-[var(--cd-brand)]">{c.eyebrow}</p><h1 className="font-editorial mt-4 max-w-4xl text-[clamp(2.6rem,6vw,5.2rem)] leading-[1.06] tracking-[-.045em]">{c.heading}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--cd-muted)]">{c.intro}</p></div></section>

    <section className="px-5 pb-14 sm:px-8"><div className="mx-auto max-w-5xl rounded-3xl border border-[var(--cd-line)] bg-[var(--cd-surface)] p-5 sm:p-8">
      <input ref={input} type="file" accept=".pdf,application/pdf" className="sr-only" aria-label={c.choose} onChange={event => void inspect(event.target.files?.[0])} />
      <button type="button" onClick={() => input.current?.click()} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); if (status !== 'loading') void inspect(event.dataTransfer.files?.[0]) }} disabled={status === 'loading'} className={`flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-6 text-center transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)] disabled:cursor-wait ${dragging ? 'border-[var(--cd-brand)] bg-[#fff0e7]' : 'border-[#d9b7a6] bg-[#fffaf6] hover:bg-[#fff3e9]'}`}>
        {status === 'loading' ? <Loader2 className="size-8 animate-spin text-[var(--cd-brand)]" /> : <UploadCloud className="size-8 text-[var(--cd-brand)]" />}
        <span className="mt-3 text-base font-bold">{status === 'loading' ? `${c.checking} · ${progress.current}/${progress.total || '…'}` : status === 'ready' ? c.newFile : c.drop}</span><span className="mt-1 text-sm text-[var(--cd-muted)]">{c.limit}</span>
      </button>
      <p className="mt-3 text-sm leading-6 text-[var(--cd-muted)]">{c.privacy}</p>
      {status === 'empty' && <p role="status" className="mt-6 text-base text-[var(--cd-muted)]">{c.empty}</p>}
      {status === 'loading' && <div role="status" aria-live="polite" className="mt-6"><div className="h-2 overflow-hidden rounded-full bg-[#eee4dd]"><div className="h-full rounded-full bg-[var(--cd-brand)] transition-[width]" style={{ width: `${progress.total ? Math.round(progress.current / progress.total * 100) : 5}%` }} /></div></div>}
      {status === 'error' && <p role="alert" className="mt-6 rounded-xl border border-[#e8c9bd] bg-[#fff6f1] p-4 text-base text-[#863c2c]">{error}</p>}
      {status === 'ready' && <div className="mt-8" aria-live="polite">
        <div className="flex flex-wrap items-center gap-2 text-base font-bold text-[#366747]"><Check className="size-5" />{c.ready}<span className="font-normal text-[var(--cd-muted)]">{fileName}</span></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-4">{[[pages.length, pages.length === 1 ? c.page : c.pages], [readable, c.readable], [pages.length - readable, c.imageOnly], [wordCount, c.words]].map(([value, label]) => <div key={label} className="rounded-2xl border border-[var(--cd-line)] bg-[var(--cd-paper)] p-4"><strong className="font-editorial block text-3xl">{formatted(Number(value))}</strong><span className="mt-1 block text-sm text-[var(--cd-muted)]">{label}</span></div>)}</div>
        {readable === 0 ? <p role="alert" className="mt-6 rounded-xl border border-[#e8c9bd] bg-[#fff6f1] p-4 text-base leading-7 text-[#863c2c]">{c.noText}</p> : readable < pages.length ? <p role="status" className="mt-6 rounded-xl border border-[#e8c9bd] bg-[#fff6f1] p-4 text-base leading-7 text-[#863c2c]">{c.partial}</p> : null}
        {readable > 0 && <div className="mt-7 flex flex-wrap gap-3"><button type="button" onClick={() => void copyText()} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[var(--cd-line)] px-4 text-base font-semibold hover:bg-[var(--cd-paper)]">{copied ? <Check className="size-4" /> : <FileSearch className="size-4" />}{copied ? c.copied : c.copy}</button><button type="button" onClick={downloadText} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--cd-brand)] px-4 text-base font-semibold text-white hover:opacity-90"><Download className="size-4" />{c.download}</button></div>}
        {error && <p role="alert" className="mt-4 text-base text-[#863c2c]">{error}</p>}
        <div className="mt-10 border-t border-[var(--cd-line)] pt-7"><label htmlFor="study-pdf-search" className="block text-base font-bold">{c.searchLabel}</label><div className="mt-2 flex min-h-12 items-center gap-3 rounded-xl border border-[var(--cd-line)] bg-white px-4 focus-within:border-[var(--cd-brand)]"><Search className="size-5 shrink-0 text-[var(--cd-muted)]" /><input id="study-pdf-search" type="search" value={query} onChange={event => { setQuery(event.target.value); setShown(12) }} placeholder={c.searchPlaceholder} className="min-w-0 flex-1 bg-transparent py-3 text-base outline-none" /></div><p role="status" className="mt-3 text-sm text-[var(--cd-muted)]">{formatted(matching.length)} {matching.length === 1 ? c.resultOne : c.resultCount}</p></div>
        {matching.length === 0 ? <p className="mt-6 text-base text-[var(--cd-muted)]">{c.searchEmpty}</p> : <div className="mt-5 grid gap-3">{matching.slice(0, shown).map(page => <article key={page.number} className="rounded-xl border border-[var(--cd-line)] bg-[var(--cd-paper)] p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-base font-bold">{pageLabel(page.number)}</h2>{pdfUrl && <a href={`${pdfUrl}#page=${page.number}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-base font-semibold text-[var(--cd-brand)] hover:bg-white">{c.openPage}<ArrowUpRight className="size-4" /></a>}</div><p className="mt-2 break-words text-base leading-7 text-[var(--cd-muted)]">{excerpt(page)}</p></article>)}</div>}
        {matching.length > shown && <button type="button" onClick={() => setShown(value => value + 24)} className="mt-5 min-h-11 rounded-xl border border-[var(--cd-line)] px-4 text-base font-semibold hover:bg-[var(--cd-paper)]">{c.more}</button>}
      </div>}
    </div></section>

    <section className="border-y border-[var(--cd-line)] bg-white px-5 py-14 sm:px-8"><div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2"><div><h2 className="font-editorial text-3xl">{c.chapterTitle}</h2><p className="mt-3 text-base leading-7 text-[var(--cd-muted)]">{c.chapterText}</p></div><div><h2 className="font-editorial text-3xl">{c.nextTitle}</h2><p className="mt-3 text-base leading-7 text-[var(--cd-muted)]">{c.nextText}</p><Link href={locale === 'fr' ? '/#produit' : `/${locale}#studio`} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--cd-brand)] underline underline-offset-4">{c.nextAction}<ArrowUpRight className="size-4" /></Link></div></div></section>
    <section className="px-5 py-14 sm:px-8"><div className="mx-auto max-w-5xl"><h2 className="font-editorial text-3xl">{c.faqTitle}</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{[[c.faqOne, c.faqAnswerOne], [c.faqTwo, c.faqAnswerTwo]].map(([question, answer]) => <article key={question} className="rounded-xl border border-[var(--cd-line)] bg-white p-5"><h3 className="text-base font-bold">{question}</h3><p className="mt-3 text-base leading-7 text-[var(--cd-muted)]">{answer}</p></article>)}</div></div></section>
  </main>
}
