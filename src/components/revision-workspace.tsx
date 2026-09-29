'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, BookOpenText, Check, ChevronDown, Download, FileText, Loader2, RotateCcw, Search, Trash2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'
import { studyFlowCopy } from '@/lib/study-flow-locales'
import { adaptiveStudyCopy } from '@/lib/adaptive-study-locales'
import { revisionSpaceCopy } from '@/lib/revision-space-locales'
import { isCardDue, scheduleReview, selectStudyCards, type ProgressMap, type ReviewRating } from '@/lib/study-scheduler'
import { readStudyProgress, STUDY_PROGRESS_EVENT, writeStudyProgress } from '@/lib/study-progress-storage'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

type Card = { id: string; documentId: string; question: string; answer: string; sourceRef?: string; orderIndex: number }
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

function relativeDate(dueAt: number, language: string, now: number) {
  const formatter = new Intl.RelativeTimeFormat(language, { numeric: 'auto', style: 'short' })
  if (dueAt <= now) return formatter.format(0, 'minute')
  const minutes = Math.max(1, Math.round((dueAt - now) / 60_000))
  if (minutes < 60) return formatter.format(minutes, 'minute')
  if (minutes < 1_440) return formatter.format(Math.ceil(minutes / 60), 'hour')
  return formatter.format(Math.ceil(minutes / 1_440), 'day')
}

export function RevisionWorkspace() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const locale = language as StudyPdfLocale
  const copy = studyFlowCopy[locale] || studyFlowCopy.en
  const adaptive = adaptiveStudyCopy[locale] || adaptiveStudyCopy.en
  const space = revisionSpaceCopy[locale] || revisionSpaceCopy.en
  const cardLabel = (count: number) => count === 1 ? space.cardSingular : t('cards')

  const [sets, setSets] = useState<CardSet[]>([])
  const [progress, setProgress] = useState<ProgressMap>({})
  const [phase, setPhase] = useState<Phase>('loading')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [studyIds, setStudyIds] = useState<string[]>([])
  const [sessionOpen, setSessionOpen] = useState(false)
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)
  const [retryCounts, setRetryCounts] = useState<Record<string, number>>({})
  const [sessionRatings, setSessionRatings] = useState<Record<ReviewRating, number>>({ again: 0, hard: 0, good: 0, easy: 0 })
  const [lastDifficultDocumentId, setLastDifficultDocumentId] = useState<string | null>(null)
  const [confirmAction, setConfirmAction] = useState<'reset' | 'delete' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [saveError, setSaveError] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const initialSelectionHandled = useRef(false)
  const cardHeadingRef = useRef<HTMLHeadingElement>(null)
  const rateCardRef = useRef<(rating: ReviewRating) => void>(() => {})

  const userId = user?.id
  const allCards = useMemo(() => sets.flatMap(set => set.cards), [sets])
  const selectedSet = sets.find(set => set.documentId === selectedId)
  const activeCard = allCards.find(card => card.id === studyIds[cardIndex])
  const activeCardId = activeCard?.id
  const activeSet = sets.find(set => set.documentId === activeCard?.documentId)

  useEffect(() => {
    const update = () => setNow(Date.now())
    const timer = window.setInterval(update, 60_000)
    window.addEventListener('focus', update)
    return () => { window.clearInterval(timer); window.removeEventListener('focus', update) }
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
      const documentIds = documents.map(document => document.id)
      for (let start = 0; start < documentIds.length; start += 100) {
        const batchIds = documentIds.slice(start, start + 100)
        for (let offset = 0; ; offset += 500) {
          const { data: page, error } = await supabase.from('flashcards')
            .select('id, question, answer, source_ref, document_id, created_at, order_index')
            .in('document_id', batchIds)
            .order('created_at', { ascending: false })
            .order('id', { ascending: false })
            .range(offset, offset + 499)
          if (error) throw error
          cards.push(...(page || []))
          if (!page || page.length < 500) break
        }
      }

      const grouped = new Map<string, CardSet>()
      for (const document of documents) grouped.set(document.id, { documentId: document.id, documentName: document.file_name, createdAt: '', cards: [] })
      for (const card of cards) {
        const set = grouped.get(card.document_id)
        if (!set) continue
        if (!set.createdAt) set.createdAt = card.created_at
        set.cards.push({ id: card.id, documentId: card.document_id, question: card.question, answer: card.answer, sourceRef: card.source_ref || undefined, orderIndex: card.order_index })
      }
      const savedSets = [...grouped.values()].filter(set => set.cards.length)
        .map(set => ({ ...set, cards: [...set.cards].sort((a, b) => a.orderIndex - b.orderIndex) }))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      setSets(savedSets)
      setProgress(readStudyProgress(user.id, cards.map(card => card.id)))
      setPhase('ready')
      if (!initialSelectionHandled.current) {
        initialSelectionHandled.current = true
        const requested = new URLSearchParams(window.location.search).get('document')
        if (requested && savedSets.some(set => set.documentId === requested)) setSelectedId(requested)
      }
    } catch (error) {
      console.error('Could not load revision space:', error)
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
    const refresh = () => setProgress(readStudyProgress(user.id, allCards.map(card => card.id)))
    window.addEventListener(STUDY_PROGRESS_EVENT, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(STUDY_PROGRESS_EVENT, refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [allCards, user])

  const dueTotal = allCards.filter(card => isCardDue(progress[card.id], now)).length
  const newTotal = allCards.filter(card => !progress[card.id]).length
  const practicedToday = allCards.filter(card => progress[card.id] && new Date(progress[card.id].lastReviewedAt).toDateString() === new Date(now).toDateString()).length
  const deckDue = selectedSet?.cards.filter(card => isCardDue(progress[card.id], now)).length ?? 0
  const deckNew = selectedSet?.cards.filter(card => !progress[card.id]).length ?? 0
  const filteredSets = useMemo(() => sets.filter(set => set.documentName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
    .sort((a, b) => {
      const dueA = a.cards.filter(card => isCardDue(progress[card.id], now)).length
      const dueB = b.cards.filter(card => isCardDue(progress[card.id], now)).length
      return dueB - dueA || b.createdAt.localeCompare(a.createdAt)
    }), [sets, search, progress, now])

  function beginStudy(set?: CardSet, includeFuture = false) {
    const candidates = set?.cards || allCards
    const selected = selectStudyCards(candidates, progress, now, 20, includeFuture)
    if (!selected.length) return
    setStudyIds(selected.map(card => card.id))
    setCardIndex(0)
    setRevealed(false)
    setFinished(false)
    setRetryCounts({})
    setSessionRatings({ again: 0, hard: 0, good: 0, easy: 0 })
    setLastDifficultDocumentId(null)
    setSaveError(false)
    setSessionOpen(true)
  }

  function rateCard(rating: ReviewRating) {
    if (!activeCardId || !userId || !revealed || finished) return
    const next = { ...progress, [activeCardId]: scheduleReview(progress[activeCardId], rating) }
    setProgress(next)
    if (!writeStudyProgress(userId, next)) setSaveError(true)
    setSessionRatings(previous => ({ ...previous, [rating]: previous[rating] + 1 }))
    if ((rating === 'again' || rating === 'hard') && activeCard) setLastDifficultDocumentId(activeCard.documentId)
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
    if (!sessionOpen || !studyIds.length || finished || confirmAction) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, button, a, [contenteditable="true"]')) return
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
  }, [confirmAction, finished, revealed, sessionOpen, studyIds.length])

  useEffect(() => {
    if (!sessionOpen || !studyIds.length || finished) return
    const frame = requestAnimationFrame(() => cardHeadingRef.current?.focus())
    return () => cancelAnimationFrame(frame)
  }, [cardIndex, finished, revealed, sessionOpen, studyIds.length])

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
      setStudyIds([])
      setSessionOpen(false)
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

  function openSet(set: CardSet) {
    setSelectedId(set.documentId)
    window.history.replaceState(null, '', `/flashcards?document=${encodeURIComponent(set.documentId)}`)
  }

  function backToLibrary() {
    setSelectedId(null)
    window.history.replaceState(null, '', '/flashcards')
  }

  function endSession() {
    setSessionOpen(false)
    setStudyIds([])
    setFinished(false)
    setRevealed(false)
  }

  if (authLoading || !user || phase === 'loading') return <div role="status" className="flex min-h-[60vh] items-center justify-center gap-3 text-base text-[var(--cd-muted)]"><Loader2 className="size-5 animate-spin motion-reduce:animate-none" />{t('processing')}</div>
  if (phase === 'error') return <div role="alert" className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="font-editorial text-3xl text-[var(--cd-ink)]">{copy.loadFailed}</h1><Button onClick={() => void loadSets()} className="mt-6 min-h-11 bg-[var(--cd-brand)] text-white">{copy.retry}</Button></div>

  return <div lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-[calc(100vh-4rem)] bg-[var(--cd-paper)] px-4 py-8 text-[var(--cd-ink)] sm:px-8 sm:py-12">
    <div className="mx-auto max-w-5xl">
      {saveError && <p role="alert" className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-800">{adaptive.saveFailed}</p>}
      {selectedSet ? <>
        <button type="button" onClick={backToLibrary} className="inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-semibold text-[var(--cd-brand)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)]"><ArrowLeft className="size-4" />{space.courses}</button>
        <header className="mt-5 border-b border-[var(--cd-line)] pb-9 sm:pb-12">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">{space.eyebrow}</p>
          <h1 className="font-editorial mt-3 max-w-3xl break-words text-4xl leading-tight sm:text-5xl">{selectedSet.documentName.replace(/\.pdf$/i, '')}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{space.deckLead}</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-base"><span><strong className="font-semibold text-[var(--cd-ink)]">{deckDue}</strong> · {adaptive.dueToday}</span><span><strong className="font-semibold text-[var(--cd-ink)]">{deckNew}</strong> · {adaptive.newCards}</span><span>{selectedSet.cards.length} {cardLabel(selectedSet.cards.length)}</span></div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={() => studyIds.length && !finished ? setSessionOpen(true) : beginStudy(selectedSet, deckDue === 0)} className="min-h-12 bg-[var(--cd-brand)] px-6 text-white hover:bg-[var(--cd-brand-hover)]">{studyIds.length && !finished ? space.resume : deckDue ? space.startToday : space.practiceAnyway}<ArrowRight className="ms-2 size-4" /></Button>
            <Link href={`/documents/${selectedSet.documentId}?view=tools&quiz=cards`} className="inline-flex min-h-12 items-center rounded-xl border border-[var(--cd-line)] bg-white px-5 text-sm font-bold text-[var(--cd-ink)] hover:border-[var(--cd-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)]">{adaptive.priorityQuiz}</Link>
            <Link href={`/documents/${selectedSet.documentId}`} className="inline-flex min-h-12 items-center rounded-xl px-4 text-sm font-semibold text-[var(--cd-brand)] hover:underline">{space.openCourse}</Link>
          </div>
          <p className="mt-5 text-sm text-[var(--cd-muted)]">{adaptive.localProgress}</p>
        </header>

        <section aria-labelledby="course-questions-title" className="py-10">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 id="course-questions-title" className="font-editorial text-3xl sm:text-4xl">{space.browse}</h2><p className="mt-2 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{space.browseLead}</p></div><Button variant="outline" onClick={() => exportSet(selectedSet)} className="min-h-11 border-[var(--cd-line)] bg-white"><Download className="me-2 size-4" />{t('exportCSV')}</Button></div>
          <div className="mt-6 divide-y divide-[var(--cd-line)] overflow-hidden rounded-2xl border border-[var(--cd-line)] bg-white">
            {selectedSet.cards.map((card, index) => <details key={card.id} className="group px-5 py-1 sm:px-7"><summary className="flex min-h-16 cursor-pointer list-none items-center gap-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)] [&::-webkit-details-marker]:hidden"><span className="w-7 shrink-0 text-sm font-bold tabular-nums text-[var(--cd-brand)]">{String(index + 1).padStart(2, '0')}</span><span className="min-w-0 flex-1 break-words text-base font-semibold leading-6">{card.question}</span><ChevronDown className="size-4 shrink-0 text-[var(--cd-muted)] transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none" /></summary><div className="ms-11 border-t border-[var(--cd-line)] pb-6 pt-5"><p className="max-w-3xl text-base leading-7">{card.answer}</p>{card.sourceRef && <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--cd-muted)]">{copy.source} · {card.sourceRef}</p>}{sourcePage(card.sourceRef) && <Link href={`/documents/${card.documentId}?page=${sourcePage(card.sourceRef)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--cd-brand)] hover:underline">{space.openPdf}<ArrowRight className="ms-1 size-4" /></Link>}{progress[card.id] && <p className="mt-2 text-sm text-[var(--cd-muted)]">{adaptive.nextReview} : {relativeDate(progress[card.id].dueAt, language, now)}</p>}</div></details>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setConfirmAction('reset')} className="min-h-11 border-[var(--cd-line)] bg-white"><RotateCcw className="me-2 size-4" />{copy.resetProgress}</Button><Button variant="outline" onClick={() => setConfirmAction('delete')} className="min-h-11 border-[var(--cd-line)] bg-white text-red-700"><Trash2 className="me-2 size-4" />{copy.deleteCards}</Button></div>
        </section>
      </> : <>
        <header className="grid gap-8 border-b border-[var(--cd-line)] pb-10 sm:pb-12 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
          <div><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">{space.eyebrow}</p><h1 className="font-editorial mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl lg:text-6xl">{sets.length && dueTotal === 0 ? space.readyTitle : space.homeTitle}</h1><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{sets.length && dueTotal === 0 ? space.readyLead : space.homeLead}</p>{sets.length > 0 && <div className="mt-7 flex flex-wrap items-center gap-4"><Button onClick={() => studyIds.length && !finished ? setSessionOpen(true) : beginStudy(undefined, dueTotal === 0)} className="min-h-12 bg-[var(--cd-brand)] px-6 text-white hover:bg-[var(--cd-brand-hover)]">{studyIds.length && !finished ? space.resume : dueTotal ? space.startToday : space.practiceAnyway}<ArrowRight className="ms-2 size-4" /></Button><span className="text-sm text-[var(--cd-muted)]">{adaptive.reviewLimit}</span></div>}</div>
          {sets.length > 0 && <div className="grid grid-cols-3 gap-4 border-t border-[var(--cd-line)] pt-5 lg:grid-cols-1 lg:gap-3 lg:border-s lg:border-t-0 lg:py-1 lg:ps-7"><div><p className="font-editorial text-3xl tabular-nums sm:text-4xl">{dueTotal}</p><p className="mt-1 text-xs leading-5 text-[var(--cd-muted)] sm:text-sm">{adaptive.dueToday}</p></div><div><p className="font-editorial text-3xl tabular-nums sm:text-4xl">{newTotal}</p><p className="mt-1 text-xs leading-5 text-[var(--cd-muted)] sm:text-sm">{adaptive.newCards}</p></div><div><p className="font-editorial text-3xl tabular-nums sm:text-4xl">{practicedToday}</p><p className="mt-1 text-xs leading-5 text-[var(--cd-muted)] sm:text-sm">{space.practicedToday}</p></div></div>}
        </header>

        <section aria-labelledby="courses-title" className="py-10"><div className="flex flex-wrap items-end justify-between gap-5"><div><h2 id="courses-title" className="font-editorial text-3xl sm:text-4xl">{space.courses}</h2>{sets.length > 0 && <p className="mt-2 text-base text-[var(--cd-muted)]">{sets.length} {sets.length === 1 ? space.courseSingular : space.courseCount} · {allCards.length} {cardLabel(allCards.length)}</p>}</div>{sets.length > 4 && <label className="flex min-h-12 w-full max-w-xs items-center gap-3 rounded-xl border border-[var(--cd-line)] bg-white px-4 sm:w-auto"><Search className="size-4 text-[var(--cd-muted)]" /><span className="sr-only">{t('search')}</span><input value={search} onChange={event => setSearch(event.target.value)} placeholder={t('search')} className="min-w-0 flex-1 bg-transparent text-base outline-none" /></label>}</div>
          {sets.length ? filteredSets.length ? <div className="mt-6 divide-y divide-[var(--cd-line)] overflow-hidden rounded-2xl border border-[var(--cd-line)] bg-white">{filteredSets.map(set => { const due = set.cards.filter(card => isCardDue(progress[card.id], now)).length; return <button key={set.documentId} type="button" onClick={() => openSet(set)} className="group flex min-h-24 w-full items-center gap-4 px-5 py-5 text-start transition-colors duration-150 hover:bg-[#fff8f3] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--cd-brand)] motion-reduce:transition-none sm:px-7"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[var(--cd-brand)]"><BookOpenText className="size-5" /></span><span className="min-w-0 flex-1"><span className="block break-words font-editorial text-xl leading-7 sm:text-2xl">{set.documentName.replace(/\.pdf$/i, '')}</span><span className="mt-1 block text-sm text-[var(--cd-muted)]">{set.cards.length} {cardLabel(set.cards.length)}<span className="ms-3 font-semibold text-[var(--cd-brand)] sm:hidden">{due} {adaptive.dueToday}</span></span></span><span className="hidden shrink-0 text-end text-sm font-semibold text-[var(--cd-brand)] sm:block">{due} {adaptive.dueToday}</span><ArrowRight className="hidden size-4 shrink-0 text-[var(--cd-brand)] transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none sm:block" /></button> })}</div> : <p className="mt-6 text-base text-[var(--cd-muted)]">{t('noResults')}</p> : <div className="mt-6 rounded-2xl border border-[var(--cd-line)] bg-white p-8 sm:p-10"><FileText className="size-9 text-[var(--cd-brand)]" /><h3 className="font-editorial mt-5 text-3xl">{space.noCoursesTitle}</h3><p className="mt-3 max-w-xl text-base leading-7 text-[var(--cd-muted)]">{space.noCoursesLead}</p><Link href="/documents" className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--cd-brand)] px-6 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)]">{t('viewMyDocuments')}<ArrowRight className="size-4" /></Link></div>}
          {sets.length > 0 && <p className="mt-6 text-sm text-[var(--cd-muted)]">{adaptive.localProgress}</p>}
        </section>
      </>}
    </div>

    <Dialog open={sessionOpen} onOpenChange={setSessionOpen}>
      <DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} closeLabel={space.pause} className="left-0 top-0 block h-[100dvh] w-screen max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-none border-0 bg-[var(--cd-paper)] p-0 shadow-none data-[state=open]:animate-none data-[state=closed]:animate-none sm:rounded-none">
        <div className="flex min-h-[100dvh] flex-col">
          <header className="border-b border-[var(--cd-line)] bg-white px-5 py-4 pr-16 sm:px-8 sm:pr-16"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3"><div className="min-w-0"><DialogTitle className="font-editorial text-xl text-[var(--cd-ink)] sm:text-2xl">{space.sessionTitle}</DialogTitle><DialogDescription className="mt-1 max-w-[180px] truncate text-xs text-[var(--cd-muted)] sm:max-w-xs sm:text-sm">{finished ? space.finishLead : activeSet?.documentName}</DialogDescription></div><bdi dir="ltr" className="text-sm font-semibold tabular-nums text-[var(--cd-ink)]">{finished ? studyIds.length : cardIndex + 1} / {studyIds.length}</bdi></div></header>
          <div className="h-1 w-full bg-[#eadbd3]" role="progressbar" aria-label={space.sessionTitle} aria-valuemin={0} aria-valuemax={studyIds.length} aria-valuenow={finished ? studyIds.length : cardIndex}><div className="h-full bg-[var(--cd-brand)] transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${studyIds.length ? ((finished ? studyIds.length : cardIndex) / studyIds.length) * 100 : 0}%` }} /></div>
          {finished ? <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-12 text-center"><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#ebf1e8] text-[#496746]"><Check className="size-7" /></span><h2 className="font-editorial mt-6 text-4xl text-[var(--cd-ink)] sm:text-5xl">{adaptive.reviewComplete}</h2><p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[var(--cd-muted)]">{space.finishLead}</p><p className="mt-7 text-sm font-semibold text-[var(--cd-muted)]">{Object.values(sessionRatings).reduce((sum, count) => sum + count, 0)} {space.answerCount}</p><div className="mt-4 flex justify-center gap-5 text-sm"><span>{adaptive.again} · {sessionRatings.again}</span><span>{adaptive.hard} · {sessionRatings.hard}</span><span>{adaptive.good} · {sessionRatings.good}</span><span>{adaptive.easy} · {sessionRatings.easy}</span></div><div className="mt-9 flex flex-wrap justify-center gap-3">{lastDifficultDocumentId && <Link href={`/documents/${lastDifficultDocumentId}?view=tools&quiz=cards`} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--cd-brand)] px-6 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)]">{adaptive.priorityQuiz}<ArrowRight className="size-4" /></Link>}<Button variant="outline" onClick={endSession} className="min-h-12 border-[var(--cd-line)] bg-white px-6">{space.courses}</Button></div></div> : <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-8 sm:px-8 sm:py-12"><div className="mb-5"><p className="text-sm font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">{space.question} {cardIndex + 1}</p></div><section key={`${activeCardId}-${cardIndex}-${revealed}`} className={`study-card-motion rounded-3xl border border-[var(--cd-line)] bg-white px-5 py-7 sm:px-10 sm:py-12 ${revealed ? 'study-card-reveal' : ''}`}><p className="text-sm font-semibold text-[var(--cd-muted)]">{revealed ? t('answer') : space.thinkFirst}</p><h2 ref={cardHeadingRef} tabIndex={-1} className="font-editorial mt-5 min-h-24 break-words text-2xl leading-snug text-[var(--cd-ink)] outline-none sm:text-4xl">{revealed ? activeCard?.answer : activeCard?.question}</h2>{revealed && activeCard?.sourceRef && <details className="group/source mt-6 border-t border-[var(--cd-line)] pt-3"><summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[var(--cd-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)] [&::-webkit-details-marker]:hidden">{copy.source}<ChevronDown className="size-4 transition-transform group-open/source:rotate-180 motion-reduce:transition-none" /></summary><p className="mt-2 text-sm leading-6 text-[var(--cd-muted)]">{activeCard.sourceRef}</p>{sourcePage(activeCard.sourceRef) && <Link href={`/documents/${activeCard.documentId}?page=${sourcePage(activeCard.sourceRef)}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--cd-brand)] hover:underline">{space.openPdf}<ArrowRight className="ms-1 size-4" /></Link>}</details>}</section>{revealed && activeCard ? <div className="mt-7"><p className="text-base font-semibold text-[var(--cd-ink)]">{space.ratePrompt}</p><p className="mt-1 text-sm leading-6 text-[var(--cd-muted)]">{adaptive.ratingHint}</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{(['again', 'hard', 'good', 'easy'] as const).map((rating, index) => <button key={rating} type="button" onClick={() => rateCard(rating)} aria-keyshortcuts={String(index + 1)} className="min-h-20 rounded-xl border border-[var(--cd-line)] bg-white px-4 py-3 text-start transition-[border-color,background-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--cd-brand)] hover:bg-[#fff4ee] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)] motion-reduce:transform-none motion-reduce:transition-none"><span className="block text-base font-bold text-[var(--cd-ink)]">{adaptive[rating]}</span><span className="mt-1 block text-sm text-[var(--cd-muted)]">{relativeDate(scheduleReview(progress[activeCard.id], rating, now).dueAt, language, now)}</span></button>)}</div></div> : <Button onClick={() => setRevealed(true)} className="mt-7 min-h-12 self-start bg-[var(--cd-brand)] px-7 text-white hover:bg-[var(--cd-brand-hover)]">{space.showAnswer}<ArrowRight className="ms-2 size-4" /></Button>}</div>}
          <footer className="border-t border-[var(--cd-line)] px-5 py-4 text-sm text-[var(--cd-muted)] sm:px-8"><div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-2"><span>{adaptive.localProgress}</span><span>{finished ? space.pause : adaptive.keyboardHint}</span></div></footer>
        </div>
      </DialogContent>
    </Dialog>

    <Dialog open={confirmAction !== null} onOpenChange={open => { if (!open && !deleting) { setConfirmAction(null); setActionError(null) } }}><DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} closeLabel={t('cancel')} className="max-w-md rounded-2xl border-[var(--cd-line)] bg-[var(--cd-paper)]"><DialogHeader><DialogTitle className="font-editorial text-2xl">{confirmAction === 'delete' ? copy.deleteCards : copy.resetProgress}</DialogTitle><DialogDescription className="text-base leading-6">{confirmAction === 'delete' ? copy.deleteConfirm : copy.resetConfirm}</DialogDescription></DialogHeader>{actionError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-base text-red-800">{actionError}</p>}<DialogFooter className="gap-2 sm:gap-2"><Button variant="outline" onClick={() => setConfirmAction(null)} disabled={deleting} className="min-h-11">{t('cancel')}</Button><Button onClick={() => void confirmSetAction()} disabled={deleting} className="min-h-11 bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]">{deleting && <Loader2 className="me-2 size-4 animate-spin" />}{confirmAction === 'delete' ? copy.deleteCards : copy.resetProgress}</Button></DialogFooter></DialogContent></Dialog>
  </div>
}
