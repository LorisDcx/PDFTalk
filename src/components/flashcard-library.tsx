'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Download, FileText, Layers3, Loader2, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'
import { studyFlowCopy } from '@/lib/study-flow-locales'
import { adaptiveStudyCopy } from '@/lib/adaptive-study-locales'
import { isCardDue, scheduleReview, selectStudyCards, type ProgressMap, type ReviewRating } from '@/lib/study-scheduler'
import { readStudyProgress, STUDY_PROGRESS_EVENT, writeStudyProgress } from '@/lib/study-progress-storage'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

type Card = { id: string; question: string; answer: string; sourceRef?: string; orderIndex: number }
type CardSet = { documentId: string; documentName: string; createdAt: string; cards: Card[] }
type Phase = 'loading' | 'ready' | 'error'

function csvCell(value: string) {
  const safe = /^[\s\u0000-\u001f]*[=+@-]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

function sourcePage(sourceRef?: string) {
  const match = sourceRef?.match(/^Page\s+(\d+)/i)
  return match ? Number(match[1]) : null
}

function relativeDate(dueAt: number, language: string, now = Date.now()) {
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto', style: 'short' })
  if (dueAt <= now) return formatter.format(0, 'minute')
  const minutes = Math.max(1, Math.round((dueAt - now) / 60_000))
  if (minutes < 60) return formatter.format(minutes, 'minute')
  if (minutes < 1_440) return formatter.format(Math.ceil(minutes / 60), 'hour')
  return formatter.format(Math.ceil(minutes / 1_440), 'day')
}

export function FlashcardLibrary() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const locale = language as StudyPdfLocale
  const copy = studyFlowCopy[locale] || studyFlowCopy.en
  const adaptive = adaptiveStudyCopy[locale] || adaptiveStudyCopy.en

  const [sets, setSets] = useState<CardSet[]>([])
  const [progress, setProgress] = useState<ProgressMap>({})
  const [phase, setPhase] = useState<Phase>('loading')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [studyIds, setStudyIds] = useState<string[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [retryCounts, setRetryCounts] = useState<Record<string, number>>({})
  const [sessionRatings, setSessionRatings] = useState<Record<ReviewRating, number>>({ again: 0, hard: 0, good: 0, easy: 0 })
  const [confirmAction, setConfirmAction] = useState<'reset' | 'delete' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const initialSelectionHandled = useRef(false)
  const cardHeadingRef = useRef<HTMLHeadingElement>(null)
  const rateCardRef = useRef<(rating: ReviewRating) => void>(() => {})
  const selectedSet = sets.find(set => set.documentId === selectedId)
  const activeCard = selectedSet?.cards.find(card => card.id === studyIds[cardIndex])
  const activeCardId = activeCard?.id
  const userId = user?.id

  useEffect(() => {
    const updateTime = () => setNow(Date.now())
    const timer = window.setInterval(updateTime, 60_000)
    window.addEventListener('focus', updateTime)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', updateTime) }
  }, [])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?redirect=%2Fflashcards')
  }, [authLoading, router, user])

  const loadSets = useCallback(async () => {
    if (!user) return
    setPhase('loading')
    try {
      const supabase = createClient()
      const { data: documents, error: documentsError } = await supabase.from('documents')
        .select('id, file_name').eq('user_id', user.id)
      if (documentsError) throw documentsError
      if (!documents?.length) {
        setSets([])
        setProgress({})
        setPhase('ready')
        return
      }

      const cards: Array<{ id: string; question: string; answer: string; source_ref: string | null; document_id: string; created_at: string; order_index: number }> = []
      for (let offset = 0; ; offset += 500) {
        const { data: page, error } = await supabase.from('flashcards')
          .select('id, question, answer, source_ref, document_id, created_at, order_index')
          .in('document_id', documents.map(document => document.id))
          .order('created_at', { ascending: false })
          .order('id', { ascending: false })
          .range(offset, offset + 499)
        if (error) throw error
        cards.push(...(page || []))
        if (!page || page.length < 500) break
      }

      const grouped = new Map<string, CardSet>()
      for (const document of documents) grouped.set(document.id, { documentId: document.id, documentName: document.file_name, createdAt: '', cards: [] })
      for (const card of cards) {
        const set = grouped.get(card.document_id)
        if (!set) continue
        if (!set.createdAt) set.createdAt = card.created_at
        set.cards.push({ id: card.id, question: card.question, answer: card.answer, sourceRef: card.source_ref || undefined, orderIndex: card.order_index })
      }
      const savedSets = [...grouped.values()].filter(set => set.cards.length)
        .map(set => ({ ...set, cards: [...set.cards].sort((a, b) => a.orderIndex - b.orderIndex) }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      setSets(savedSets)
      setProgress(readStudyProgress(user.id, cards.map(card => card.id)))
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

  useEffect(() => {
    if (!user) return
    const refresh = () => setProgress(readStudyProgress(user.id, sets.flatMap(set => set.cards.map(card => card.id))))
    window.addEventListener(STUDY_PROGRESS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(STUDY_PROGRESS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [sets, user])

  const totalCards = sets.reduce((sum, set) => sum + set.cards.length, 0)
  const filteredSets = useMemo(() => sets
    .filter(set => set.documentName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    .sort((a, b) => {
      const dueA = a.cards.filter(card => isCardDue(progress[card.id], now)).length
      const dueB = b.cards.filter(card => isCardDue(progress[card.id], now)).length
      return dueB - dueA || b.createdAt.localeCompare(a.createdAt)
    }), [sets, search, progress, now])
  const dueTotal = sets.reduce((sum, set) => sum + set.cards.filter(card => isCardDue(progress[card.id], now)).length, 0)
  const deckDue = selectedSet?.cards.filter(card => isCardDue(progress[card.id], now)).length ?? 0
  const deckNew = selectedSet?.cards.filter(card => !progress[card.id]).length ?? 0

  function beginStudy(set: CardSet, includeFuture = false) {
    const selected = selectStudyCards(set.cards, progress, now, 20, includeFuture)
    if (!selected.length) return
    setSelectedId(set.documentId)
    setStudyIds(selected.map(card => card.id))
    setCardIndex(0)
    setRevealed(false)
    setFinished(false)
    setRetryCounts({})
    setSessionRatings({ again: 0, hard: 0, good: 0, easy: 0 })
    setSaveError(false)
  }

  function rateCard(rating: ReviewRating) {
    if (!activeCardId || !userId || !revealed || finished) return
    const next = { ...progress, [activeCardId]: scheduleReview(progress[activeCardId], rating) }
    setProgress(next)
    if (!writeStudyProgress(userId, next)) setSaveError(true)
    setSessionRatings(previous => ({ ...previous, [rating]: previous[rating] + 1 }))
    const queue = [...studyIds]
    if (rating === 'again' && (retryCounts[activeCardId] || 0) < 2) {
      queue.splice(Math.min(cardIndex + 3, queue.length), 0, activeCardId)
      setRetryCounts(previous => ({ ...previous, [activeCardId]: (previous[activeCardId] || 0) + 1 }))
    }
    setStudyIds(queue)
    setRevealed(false)
    if (cardIndex + 1 < queue.length) setCardIndex(cardIndex + 1)
    else setFinished(true)
  }

  useEffect(() => { rateCardRef.current = rateCard })

  useEffect(() => {
    if (!studyIds.length || finished || confirmAction) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, button, a, [contenteditable="true"], [role="dialog"]')) return
      if (!revealed && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault()
        setRevealed(true)
      } else if (revealed && ['1', '2', '3', '4'].includes(event.key)) {
        event.preventDefault()
        rateCardRef.current((['again', 'hard', 'good', 'easy'] as const)[Number(event.key) - 1])
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [confirmAction, finished, revealed, studyIds.length])

  useEffect(() => {
    if (!studyIds.length || finished) return
    const frame = requestAnimationFrame(() => cardHeadingRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [cardIndex, finished, studyIds.length])

  function clearProgress(set: CardSet) {
    const next = { ...progress }
    for (const card of set.cards) delete next[card.id]
    setProgress(next)
    if (user && !writeStudyProgress(user.id, next)) setSaveError(true)
  }

  async function confirmSetAction() {
    if (!selectedSet || !confirmAction) return
    setActionError(null)
    if (confirmAction === 'reset') {
      clearProgress(selectedSet)
      setConfirmAction(null)
      toast({ title: adaptive.resetDone })
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
      window.dispatchEvent(new Event('cramdesk:flashcards-changed'))
      toast({ title: adaptive.deleteDone })
    } catch (error) {
      console.error('Could not delete flashcards:', error)
      setActionError(copy.deleteFailed)
    } finally {
      setDeleting(false)
    }
  }

  function exportSet(set: CardSet) {
    const csv = ['Question,Answer', ...set.cards.map(card => `${csvCell(card.question)},${csvCell(card.answer)}`)].join('\n')
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `flashcards-${set.documentName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9À-ÿ_-]+/g, '-')}.csv`
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
  }

  function backToSet() { setStudyIds([]); setFinished(false); setRevealed(false) }
  function backToLibrary() { setSelectedId(null); backToSet(); window.history.replaceState(null, '', '/flashcards') }

  if (authLoading || !user || phase === 'loading') return <div role="status" className="flex min-h-[60vh] items-center justify-center gap-3 text-[var(--cd-muted)]"><Loader2 className="size-5 animate-spin" />{t('processing')}</div>
  if (phase === 'error') return <div role="alert" className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="font-editorial text-3xl">{copy.loadFailed}</h1><Button onClick={() => void loadSets()} className="mt-6 min-h-11">{copy.retry}</Button></div>

  return <div lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-[calc(100vh-4rem)] bg-[var(--cd-paper)] px-4 py-8 text-[var(--cd-ink)] sm:px-8 sm:py-12">
    <div className="mx-auto max-w-6xl">
      {saveError && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-800">{adaptive.saveFailed}</p>}
      {selectedSet ? <>
        <button type="button" onClick={studyIds.length ? backToSet : backToLibrary} className="inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-[var(--cd-brand)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)]"><ArrowLeft className="size-4" />{t('back')}</button>
        {studyIds.length ? <div className="mx-auto max-w-2xl">
          {finished ? <section className="mt-8 rounded-3xl border border-[var(--cd-line)] bg-white p-7 text-center sm:p-12"><CheckCircle2 className="mx-auto size-10 text-[#637e5d]" aria-hidden="true" /><h1 className="font-editorial mt-5 text-4xl">{adaptive.reviewComplete}</h1><p className="mt-3 text-base text-[var(--cd-muted)]">{sessionRatings.again + sessionRatings.hard + sessionRatings.good + sessionRatings.easy} {adaptive.sessionCount}</p><div className="mt-5 flex justify-center gap-5 text-sm"><span>{adaptive.again} : {sessionRatings.again}</span><span>{adaptive.good} : {sessionRatings.good}</span><span>{adaptive.easy} : {sessionRatings.easy}</span></div><div className="mt-8 flex flex-wrap justify-center gap-3">{sessionRatings.again + sessionRatings.hard > 0 && <Link href={`/documents/${selectedSet.documentId}?view=tools&quiz=cards`} className="inline-flex min-h-11 items-center rounded-xl bg-[var(--cd-brand)] px-5 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)]">{adaptive.priorityQuiz}<ArrowRight className="ms-2 size-4" /></Link>}<Button onClick={() => beginStudy(selectedSet, true)} className="min-h-11 bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]"><RotateCcw className="me-2 size-4" />{copy.studyAgain}</Button><Button variant="outline" onClick={backToSet} className="min-h-11">{t('back')}</Button></div></section> : <>
            <div className="mt-4 flex items-end justify-between gap-4"><div className="min-w-0"><p className="truncate text-sm text-[var(--cd-muted)]">{selectedSet.documentName}</p><h1 className="font-editorial mt-1 text-3xl sm:text-4xl">{copy.openCards}</h1></div><span className="shrink-0 text-sm font-bold tabular-nums">{cardIndex + 1} / {studyIds.length}</span></div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#efdcd3]" role="progressbar" aria-label={copy.openCards} aria-valuenow={cardIndex + 1} aria-valuemin={0} aria-valuemax={studyIds.length}><div className="h-full bg-[var(--cd-brand)] transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${((cardIndex + 1) / studyIds.length) * 100}%` }} /></div>
            <section key={`${activeCard?.id}-${cardIndex}-${revealed}`} className={`study-card-motion mt-6 rounded-3xl border border-[var(--cd-line)] bg-white p-6 sm:p-9 ${revealed ? 'study-card-reveal' : ''}`} aria-live="polite"><p className="text-sm font-bold uppercase tracking-widest text-[var(--cd-brand)]">{revealed ? t('answer') : t('question')}</p><h2 ref={cardHeadingRef} tabIndex={-1} className="font-editorial mt-5 min-h-32 text-2xl leading-snug outline-none sm:text-3xl">{revealed ? activeCard?.answer : activeCard?.question}</h2>{revealed && activeCard?.sourceRef && <div className="mt-5 border-s-2 border-[#d7ac99] ps-4"><p className="text-sm leading-6 text-[var(--cd-muted)]">{copy.source} · {activeCard.sourceRef}</p>{sourcePage(activeCard.sourceRef) && <Link href={`/documents/${selectedSet.documentId}?view=tools&page=${sourcePage(activeCard.sourceRef)}`} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--cd-brand)] underline-offset-4 hover:underline">{adaptive.sourceLink}<ArrowRight className="ms-1 size-4" /></Link>}</div>}{!revealed && <Button onClick={() => setRevealed(true)} className="mt-7 min-h-12 bg-[var(--cd-brand)] px-6 text-white hover:bg-[var(--cd-brand-hover)]">{copy.reveal}</Button>}</section>
            {revealed && activeCard && <div className="mt-6"><p className="text-base font-semibold">{copy.markCard}</p><p className="mt-1 text-sm leading-6 text-[var(--cd-muted)]">{adaptive.ratingHint}</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{(['again', 'hard', 'good', 'easy'] as const).map((rating, ratingIndex) => <button key={rating} type="button" onClick={() => rateCard(rating)} aria-keyshortcuts={String(ratingIndex + 1)} className="min-h-20 rounded-xl border border-[var(--cd-line)] bg-white px-3 py-3 text-start transition-[border-color,background-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--cd-brand)] hover:bg-[#fff4ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)] motion-reduce:transform-none motion-reduce:transition-none"><span className="block text-base font-bold">{adaptive[rating]}</span><span className="mt-1 block text-xs text-[var(--cd-muted)]">{relativeDate(scheduleReview(progress[activeCard.id], rating, now).dueAt, language, now)}</span></button>)}</div></div>}
            <p className="mt-6 text-sm text-[var(--cd-muted)]">{adaptive.keyboardHint}</p>
          </>}
        </div> : <>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4"><div className="min-w-0"><p className="text-sm font-bold uppercase tracking-widest text-[var(--cd-brand)]">{copy.savedCards}</p><h1 className="font-editorial mt-2 break-words text-3xl sm:text-5xl">{selectedSet.documentName.replace(/\.pdf$/i, '')}</h1><p className="mt-3 text-base text-[var(--cd-muted)]">{selectedSet.cards.length} {t('cards')}</p></div><Button variant="outline" onClick={() => exportSet(selectedSet)} className="min-h-11"><Download className="me-2 size-4" />{t('exportCSV')}</Button></div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-[var(--cd-line)] bg-white p-5"><p className="text-sm text-[var(--cd-muted)]">{adaptive.dueToday}</p><p className="font-editorial mt-1 text-3xl">{deckDue}</p></div><div className="rounded-2xl border border-[var(--cd-line)] bg-white p-5"><p className="text-sm text-[var(--cd-muted)]">{adaptive.newCards}</p><p className="font-editorial mt-1 text-3xl">{deckNew}</p></div></div>
          <p className="mt-5 text-sm text-[var(--cd-muted)]">{adaptive.reviewLimit} {adaptive.localProgress}</p>
          <div className="mt-6 flex flex-wrap gap-3">{deckDue > 0 ? <Button onClick={() => beginStudy(selectedSet)} className="min-h-12 bg-[var(--cd-brand)] px-6 text-white hover:bg-[var(--cd-brand-hover)]">{adaptive.startReview}<ArrowRight className="ms-2 size-4" /></Button> : <><p role="status" className="w-full text-base text-[var(--cd-muted)]">{adaptive.noDue}</p><Button onClick={() => beginStudy(selectedSet, true)} className="min-h-12 bg-[var(--cd-brand)] px-6 text-white hover:bg-[var(--cd-brand-hover)]">{adaptive.reviewAll}</Button></>}<Link href={`/documents/${selectedSet.documentId}?view=tools&quiz=cards`} className="inline-flex min-h-12 items-center rounded-xl border border-[var(--cd-line)] bg-white px-5 text-sm font-bold text-[var(--cd-brand)] hover:border-[var(--cd-brand)]">{adaptive.priorityQuiz}</Link></div>
          <div className="mt-10 divide-y divide-[var(--cd-line)] rounded-2xl border border-[var(--cd-line)] bg-white px-5">{selectedSet.cards.map((card, index) => <article key={card.id} className="py-5"><div className="flex items-start gap-4"><span className="w-7 shrink-0 text-sm font-bold tabular-nums text-[var(--cd-brand)]">{String(index + 1).padStart(2, '0')}</span><div className="min-w-0"><h2 className="text-base font-bold leading-6">{card.question}</h2><p className="mt-2 text-base leading-6 text-[var(--cd-muted)]">{card.answer}</p>{card.sourceRef && <p className="mt-2 text-sm text-[var(--cd-muted)]">{copy.source} · {card.sourceRef}</p>}{progress[card.id] && <p className="mt-2 text-sm font-medium text-[var(--cd-brand)]">{adaptive.nextReview} : {relativeDate(progress[card.id].dueAt, language, now)}</p>}</div></div></article>)}</div>
          <div className="mt-7 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setConfirmAction('reset')} className="min-h-11"><RotateCcw className="me-2 size-4" />{copy.resetProgress}</Button><Button variant="outline" onClick={() => setConfirmAction('delete')} className="min-h-11 text-red-700"><Trash2 className="me-2 size-4" />{copy.deleteCards}</Button></div>
        </>}
      </> : <>
        <p className="text-sm font-bold uppercase tracking-widest text-[var(--cd-brand)]">{copy.savedCards}</p><h1 className="font-editorial mt-2 text-4xl sm:text-5xl">{t('flashcards')}</h1><p className="mt-3 text-base text-[var(--cd-muted)]">{sets.length} {t('myDocuments')} · {totalCards} {t('cards')}</p>
        {sets.length ? <><div className="mt-8 rounded-2xl border border-[var(--cd-line)] bg-white p-5 sm:flex sm:items-center sm:justify-between sm:gap-6"><div className="flex items-center gap-3"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[var(--cd-brand)]"><BookOpen className="size-5" /></span><div><p className="text-sm text-[var(--cd-muted)]">{adaptive.dueToday}</p><p className="font-editorial text-3xl">{dueTotal}</p></div></div><p className="mt-3 max-w-sm text-sm leading-6 text-[var(--cd-muted)] sm:mt-0">{adaptive.reviewLimit}</p></div><label className="mt-8 flex max-w-xl items-center gap-3 rounded-xl border border-[var(--cd-line)] bg-white px-4"><Search className="size-5 text-[var(--cd-muted)]" /><span className="sr-only">{t('search')}</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('search')} className="min-h-12 min-w-0 flex-1 bg-transparent text-base outline-none" /></label>{filteredSets.length ? <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredSets.map(set => { const due = set.cards.filter(card => isCardDue(progress[card.id], now)).length; return <button key={set.documentId} type="button" onClick={() => setSelectedId(set.documentId)} className="min-h-44 rounded-2xl border border-[var(--cd-line)] bg-white p-6 text-start transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--cd-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)] motion-reduce:transform-none motion-reduce:transition-none"><div className="flex items-start justify-between gap-3"><span className="flex size-10 items-center justify-center rounded-xl bg-[#fff0e6] text-[var(--cd-brand)]"><Layers3 className="size-5" /></span><span className="text-sm font-bold text-[var(--cd-brand)]">{due} {adaptive.dueToday}</span></div><h2 className="font-editorial mt-5 line-clamp-2 text-2xl">{set.documentName.replace(/\.pdf$/i, '')}</h2><p className="mt-3 text-sm text-[var(--cd-muted)]">{set.cards.length} {t('cards')}</p></button> })}</div> : <p className="mt-8 text-base text-[var(--cd-muted)]">{t('noResults')}</p>}</> : <div className="mt-10 rounded-2xl border border-[var(--cd-line)] bg-white p-8 text-center"><FileText className="mx-auto size-9 text-[var(--cd-brand)]" /><h2 className="font-editorial mt-4 text-3xl">{t('noFlashcards')}</h2><p className="mx-auto mt-3 max-w-md text-base leading-7 text-[var(--cd-muted)]">{t('generateFromDocs')}</p><Link href="/documents" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white">{t('viewMyDocuments')}<ArrowRight className="size-4" /></Link></div>}
      </>}
      <Dialog open={confirmAction !== null} onOpenChange={open => { if (!open && !deleting) { setConfirmAction(null); setActionError(null) } }}>
        <DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="max-w-md rounded-2xl border-[var(--cd-line)] bg-[var(--cd-paper)]"><DialogHeader><DialogTitle className="font-editorial text-2xl">{confirmAction === 'delete' ? copy.deleteCards : copy.resetProgress}</DialogTitle><DialogDescription className="text-base leading-6">{confirmAction === 'delete' ? copy.deleteConfirm : copy.resetConfirm}</DialogDescription></DialogHeader>{actionError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-base text-red-800">{actionError}</p>}<DialogFooter className="gap-2 sm:gap-2"><Button variant="outline" onClick={() => setConfirmAction(null)} disabled={deleting} className="min-h-11">{t('cancel')}</Button><Button onClick={() => void confirmSetAction()} disabled={deleting} className="min-h-11 bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]">{deleting && <Loader2 className="me-2 size-4 animate-spin" />}{confirmAction === 'delete' ? copy.deleteCards : copy.resetProgress}</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  </div>
}
