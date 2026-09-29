'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Download, FileText, Layers3, Loader2, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'
import { studyFlowCopy } from '@/lib/study-flow-locales'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

type CardStatus = 'new' | 'success' | 'hard' | 'failed'
type Card = { id: string; question: string; answer: string; sourceRef?: string }
type CardSet = { documentId: string; documentName: string; createdAt: string; cards: Card[] }

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

export function FlashcardLibrary() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const c = studyFlowCopy[language as StudyPdfLocale] || studyFlowCopy.en
  const [sets, setSets] = useState<CardSet[]>([])
  const [statuses, setStatuses] = useState<Record<string, CardStatus>>({})
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [studyIds, setStudyIds] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'reset' | 'delete' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const initialSelectionHandled = useRef(false)
  const selectedSet = sets.find(set => set.documentId === selectedId)
  const activeCard = selectedSet?.cards.find(card => card.id === studyIds[index])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [authLoading, router, user])

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cramdesk-flashcard-statuses') || '{}')
      if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
        queueMicrotask(() => setStatuses(saved))
      }
    } catch { /* Invalid local progress must not hide saved cards. */ }
  }, [])

  const loadSets = useCallback(async () => {
    if (!user) return
    setPhase('loading')
    try {
      const supabase = createClient()
      const { data: documents, error: documentsError } = await supabase.from('documents')
        .select('id, file_name').eq('user_id', user.id)
      if (documentsError) throw documentsError
      if (!documents?.length) { setSets([]); setPhase('ready'); return }
      const cards: Array<{ id: string; question: string; answer: string; source_ref: string | null; document_id: string; created_at: string }> = []
      for (let offset = 0; ; offset += 500) {
        const { data: page, error: cardsError } = await supabase.from('flashcards')
          .select('id, question, answer, source_ref, document_id, created_at')
          .in('document_id', documents.map(document => document.id))
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
          .range(offset, offset + 499)
        if (cardsError) throw cardsError
        cards.push(...(page || []))
        if (!page || page.length < 500) break
      }
      const grouped = new Map<string, CardSet>()
      for (const document of documents) {
        grouped.set(document.id, { documentId: document.id, documentName: document.file_name, createdAt: '', cards: [] })
      }
      for (const card of cards) {
        const set = grouped.get(card.document_id)
        if (!set) continue
        if (!set.createdAt) set.createdAt = card.created_at
        set.cards.push({ id: card.id, question: card.question, answer: card.answer, sourceRef: card.source_ref || undefined })
      }
      const savedSets = [...grouped.values()].filter(set => set.cards.length > 0)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      setSets(savedSets)
      setPhase('ready')
      if (!initialSelectionHandled.current) {
        initialSelectionHandled.current = true
        const requestedId = new URLSearchParams(window.location.search).get('document')
        if (requestedId && savedSets.some(set => set.documentId === requestedId)) setSelectedId(requestedId)
      }
    } catch (error) {
      console.error('Could not load flashcard library:', error)
      setPhase('error')
    }
  }, [user])

  useEffect(() => {
    if (!user) return
    let active = true
    queueMicrotask(() => { if (active) void loadSets() })
    return () => { active = false }
  }, [loadSets, user])

  const filteredSets = useMemo(() => sets.filter(set => set.documentName.toLocaleLowerCase().includes(search.toLocaleLowerCase())), [sets, search])
  const totalCards = sets.reduce((sum, set) => sum + set.cards.length, 0)

  function mark(cardId: string, status: CardStatus) {
    const next = { ...statuses, [cardId]: status }
    setStatuses(next)
    try { localStorage.setItem('cramdesk-flashcard-statuses', JSON.stringify(next)) }
    catch (error) { console.error('Could not save flashcard progress:', error) }
  }

  function clearProgress(set: CardSet) {
    const next = { ...statuses }
    for (const card of set.cards) delete next[card.id]
    setStatuses(next)
    try { localStorage.setItem('cramdesk-flashcard-statuses', JSON.stringify(next)) }
    catch (error) { console.error('Could not save flashcard progress:', error) }
  }

  async function confirmSetAction() {
    if (!selectedSet || !confirmAction) return
    setActionError(null)
    if (confirmAction === 'reset') {
      clearProgress(selectedSet)
      setConfirmAction(null)
      toast({ title: c.resetProgress })
      return
    }
    setDeleting(true)
    try {
      const { data, error } = await createClient().from('flashcards')
        .delete().eq('document_id', selectedSet.documentId).select('id')
      if (error || !data?.length) throw error || new Error('No cards deleted')
      clearProgress(selectedSet)
      setSelectedId(null)
      setConfirmAction(null)
      window.history.replaceState(null, '', '/flashcards')
      await loadSets()
      toast({ title: c.deleteCards })
    } catch (error) {
      console.error('Could not delete flashcards:', error)
      setActionError(c.deleteFailed)
    } finally {
      setDeleting(false)
    }
  }

  function beginStudy(set: CardSet) {
    setSelectedId(set.documentId)
    setStudyIds(shuffle(set.cards.map(card => card.id)))
    setIndex(0)
    setRevealed(false)
    setFinished(false)
  }

  function advance() {
    if (index + 1 < studyIds.length) {
      setIndex(index + 1)
      setRevealed(false)
    } else {
      setFinished(true)
    }
  }

  function exportSet(set: CardSet) {
    const csv = ['Question,Answer', ...set.cards.map(card => `"${card.question.replace(/"/g, '""')}","${card.answer.replace(/"/g, '""')}"`)].join('\n')
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `flashcards-${set.documentName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9À-ÿ_-]+/g, '-')}.csv`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  if (authLoading || phase === 'loading') return <div role="status" className="flex min-h-[60vh] items-center justify-center gap-3 text-[var(--cd-muted)]"><Loader2 className="size-5 animate-spin" />{t('processing')}</div>
  if (phase === 'error') return <div role="alert" className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="font-editorial text-3xl">{c.loadFailed}</h1><Button onClick={() => void loadSets()} className="mt-6 min-h-11">{c.retry}</Button></div>

  const backToSet = () => { setStudyIds([]); setFinished(false); setRevealed(false) }
  const backToLibrary = () => { setSelectedId(null); backToSet(); window.history.replaceState(null, '', '/flashcards') }

  return <main lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-[calc(100vh-4rem)] bg-[var(--cd-paper)] px-4 py-8 text-[var(--cd-ink)] sm:px-8 sm:py-12">
    <div className="mx-auto max-w-6xl">
      {selectedSet ? <>
        <button type="button" onClick={studyIds.length ? backToSet : backToLibrary} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--cd-brand)] hover:underline"><ArrowLeft className="size-4" />{t('back')}</button>
        {studyIds.length ? <div className="mx-auto max-w-2xl">
          {finished ? <section className="mt-8 rounded-3xl border border-[var(--cd-line)] bg-white p-8 text-center sm:p-12"><CheckCircle2 className="mx-auto size-10 text-[#637e5d]" /><h1 className="font-editorial mt-5 text-4xl">{c.finished}</h1><p className="mt-3 text-[var(--cd-muted)]">{selectedSet.cards.length} {t('cards')}</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button onClick={() => beginStudy(selectedSet)} className="min-h-11 bg-[var(--cd-brand)] text-white"><RotateCcw className="me-2 size-4" />{c.studyAgain}</Button><Button variant="outline" onClick={backToSet} className="min-h-11">{t('back')}</Button></div></section> : <>
            <div className="mt-4 flex items-end justify-between gap-4"><div><p className="text-sm text-[var(--cd-muted)]">{selectedSet.documentName}</p><h1 className="font-editorial mt-1 text-3xl sm:text-4xl">{c.openCards}</h1></div><span className="text-sm font-bold tabular-nums">{index + 1} / {studyIds.length}</span></div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#efdcd3]"><div className="h-full bg-[var(--cd-brand)]" style={{ width: `${((index + 1) / studyIds.length) * 100}%` }} /></div>
            <section className="mt-6 rounded-3xl border border-[var(--cd-line)] bg-white p-6 sm:p-9"><p className="text-xs font-bold uppercase tracking-widest text-[var(--cd-brand)]">{revealed ? t('answer') : t('question')}</p><p className="font-editorial mt-5 min-h-32 text-2xl leading-snug sm:text-3xl">{revealed ? activeCard?.answer : activeCard?.question}</p>{revealed && activeCard?.sourceRef && <p className="mt-5 border-s-2 border-[#d7ac99] ps-4 text-sm leading-6 text-[var(--cd-muted)]">{c.source} · {activeCard.sourceRef}</p>}{!revealed && <Button onClick={() => setRevealed(true)} className="mt-6 min-h-11 bg-[var(--cd-brand)] text-white">{c.reveal}</Button>}</section>
            {revealed && activeCard && <div className="mt-5"><p className="mb-3 text-sm font-semibold">{c.markCard}</p><div className="grid grid-cols-3 gap-2">{(['failed', 'hard', 'success'] as const).map(status => <button key={status} type="button" aria-pressed={statuses[activeCard.id] === status} onClick={() => mark(activeCard.id, status)} className={`min-h-12 rounded-xl border px-2 text-sm font-bold ${statuses[activeCard.id] === status ? 'border-[var(--cd-brand)] bg-[#fff0e6] text-[var(--cd-brand)]' : 'border-[var(--cd-line)] bg-white'}`}>{t(`status${status[0].toUpperCase()}${status.slice(1)}`)}</button>)}</div></div>}
            <div className="mt-7 flex justify-between gap-3"><Button variant="outline" onClick={() => { setIndex(Math.max(0, index - 1)); setRevealed(false) }} disabled={index === 0} className="min-h-11">{t('previous')}</Button><Button onClick={advance} disabled={!revealed} className="min-h-11 bg-[var(--cd-brand)] text-white">{index + 1 === studyIds.length ? c.finished : t('next')}<ArrowRight className="ms-2 size-4" /></Button></div>
          </>}
        </div> : <>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[var(--cd-brand)]">{c.savedCards}</p><h1 className="font-editorial mt-2 break-words text-3xl sm:text-5xl">{selectedSet.documentName.replace(/\.pdf$/i, '')}</h1><p className="mt-3 text-[var(--cd-muted)]">{selectedSet.cards.length} {t('cards')}</p></div><Button variant="outline" onClick={() => exportSet(selectedSet)} className="min-h-11"><Download className="me-2 size-4" />{t('exportCSV')}</Button></div>
          <div className="mt-8 flex flex-wrap gap-3"><Button onClick={() => beginStudy(selectedSet)} className="min-h-12 bg-[var(--cd-brand)] px-6 text-white">{c.openCards}<ArrowRight className="ms-2 size-4" /></Button><Link href={`/documents/${selectedSet.documentId}?view=tools&quiz=cards`} className="inline-flex min-h-12 items-center rounded-xl border border-[var(--cd-line)] bg-white px-5 text-sm font-bold text-[var(--cd-brand)]">{c.quizInDocument}</Link></div>
          <div className="mt-10 divide-y divide-[var(--cd-line)] rounded-2xl border border-[var(--cd-line)] bg-white px-5">{selectedSet.cards.map((card, cardIndex) => <article key={card.id} className="py-5"><div className="flex items-start gap-4"><span className="w-7 shrink-0 text-sm font-bold tabular-nums text-[var(--cd-brand)]">{String(cardIndex + 1).padStart(2, '0')}</span><div className="min-w-0"><h2 className="text-base font-bold leading-6">{card.question}</h2><p className="mt-2 text-sm leading-6 text-[var(--cd-muted)]">{card.answer}</p>{card.sourceRef && <p className="mt-2 text-xs text-[var(--cd-muted)]">{c.source} · {card.sourceRef}</p>}</div></div></article>)}</div>
          <div className="mt-7 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setConfirmAction('reset')} className="min-h-11"><RotateCcw className="me-2 size-4" />{c.resetProgress}</Button><Button variant="outline" onClick={() => setConfirmAction('delete')} className="min-h-11 text-red-700"><Trash2 className="me-2 size-4" />{c.deleteCards}</Button></div>
        </>}
      </> : <>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--cd-brand)]">{c.savedCards}</p><h1 className="font-editorial mt-2 text-4xl sm:text-5xl">{t('flashcards')}</h1><p className="mt-3 text-base text-[var(--cd-muted)]">{sets.length} {t('myDocuments')} · {totalCards} {t('cards')}</p>
        {sets.length ? <><label className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-[var(--cd-line)] bg-white px-4"><Search className="size-5 text-[var(--cd-muted)]" /><span className="sr-only">{t('search')}</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('search')} className="min-h-12 min-w-0 flex-1 bg-transparent text-base outline-none" /></label>{filteredSets.length ? <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredSets.map(set => {
          const mastered = set.cards.filter(card => statuses[card.id] === 'success').length
          return <button key={set.documentId} type="button" onClick={() => setSelectedId(set.documentId)} className="min-h-44 rounded-2xl border border-[var(--cd-line)] bg-white p-6 text-start transition hover:border-[var(--cd-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)]"><div className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#fff0e6] text-[var(--cd-brand)]"><Layers3 className="size-5" /></span><span className="text-xs font-bold text-[var(--cd-muted)]">{set.cards.length} {t('cards')}</span></div><h2 className="font-editorial mt-5 line-clamp-2 text-2xl">{set.documentName.replace(/\.pdf$/i, '')}</h2><p className="mt-3 text-sm text-[var(--cd-muted)]">{mastered} / {set.cards.length} {t('statusSuccess')}</p></button>
        })}</div> : <p className="mt-8 text-[var(--cd-muted)]">{t('noResults')}</p>}</> : <div className="mt-10 rounded-2xl border border-[var(--cd-line)] bg-white p-8 text-center"><FileText className="mx-auto size-9 text-[var(--cd-brand)]" /><h2 className="font-editorial mt-4 text-3xl">{t('noFlashcards')}</h2><p className="mx-auto mt-3 max-w-md text-base leading-7 text-[var(--cd-muted)]">{t('generateFromDocs')}</p><Link href="/documents" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white">{t('viewMyDocuments')}<ArrowRight className="size-4" /></Link></div>}
      </>}
      <Dialog open={confirmAction !== null} onOpenChange={(open) => { if (!open && !deleting) { setConfirmAction(null); setActionError(null) } }}>
        <DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="max-w-md rounded-2xl border-[var(--cd-line)] bg-[var(--cd-paper)]">
          <DialogHeader><DialogTitle className="font-editorial text-2xl">{confirmAction === 'delete' ? c.deleteCards : c.resetProgress}</DialogTitle><DialogDescription className="text-base leading-6">{confirmAction === 'delete' ? c.deleteConfirm : c.resetConfirm}</DialogDescription></DialogHeader>
          {actionError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{actionError}</p>}
          <DialogFooter className="gap-2 sm:gap-2"><Button variant="outline" onClick={() => setConfirmAction(null)} disabled={deleting} className="min-h-11">{t('cancel')}</Button><Button onClick={() => void confirmSetAction()} disabled={deleting} className="min-h-11 bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]">{deleting && <Loader2 className="me-2 size-4 animate-spin" />}{confirmAction === 'delete' ? c.deleteCards : c.resetProgress}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </main>
}
