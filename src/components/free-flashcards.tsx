'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, Download, Plus, RotateCcw, Trash2, Upload } from 'lucide-react'

type Card = { id: string; question: string; answer: string }
type Locale = 'fr' | 'en'

const storageKey = 'cramdesk-free-flashcards-v1'
const maxCards = 40
const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-[#ead9cf] bg-white px-4 py-3 text-sm text-[#33252b] outline-none transition focus:border-[#c95b3e] focus:ring-2 focus:ring-[#f6d5c5]'

const copy = {
  fr: {
    title: 'Ton jeu de cartes', question: 'Question ou notion', answer: 'Réponse à retrouver',
    questionPlaceholder: 'Ex. Quel est le rôle des mitochondries ?', answerPlaceholder: 'Ex. Elles produisent l’énergie utilisable par la cellule.',
    add: 'Ajouter une carte', limit: '40 cartes maximum par jeu', saved: 'Sauvegardé sur cet appareil',
    createFirst: 'Crée ta première carte pour lancer une session.', review: 'Session de rappel actif',
    start: 'Commencer à réviser', restart: 'Recommencer', show: 'Voir la réponse', know: 'Je savais', again: 'À revoir',
    done: 'Bravo, toutes les cartes ont été retrouvées.', doneHint: 'Reviens plus tard pour vérifier ce qui tient vraiment en mémoire.',
    progress: (known: number, total: number) => `${known} / ${total} maîtrisées`,
    remaining: (count: number) => `${count} carte${count > 1 ? 's' : ''} à retrouver`,
    myCards: 'Mes cartes', empty: 'Ton jeu est vide pour le moment.', remove: 'Supprimer la carte',
    export: 'Exporter mon jeu', import: 'Importer un jeu', invalid: 'Le fichier doit contenir un jeu CramDesk valide (40 cartes maximum).',
    storageError: 'Enregistrement local indisponible. Exporte ton jeu avant de quitter cette page.',
    helper: 'Les cartes restent dans ce navigateur. Exporte le fichier pour les conserver ou les transférer.',
    ctaTitle: 'Ton cours contient déjà les réponses ?', ctaText: 'Le studio CramDesk peut créer des cartes automatiquement à partir de ton PDF.',
    cta: 'Découvrir la génération depuis un PDF',
  },
  en: {
    title: 'Your deck', question: 'Question or concept', answer: 'Answer to recall',
    questionPlaceholder: 'E.g. What do mitochondria do?', answerPlaceholder: 'E.g. They produce usable energy for the cell.',
    add: 'Add a card', limit: 'Up to 40 cards per deck', saved: 'Saved on this device',
    createFirst: 'Create your first card to start a study session.', review: 'Active recall session',
    start: 'Start studying', restart: 'Start again', show: 'Show answer', know: 'I knew it', again: 'Review again',
    done: 'Well done. You recalled every card.', doneHint: 'Come back later to see what you still remember.',
    progress: (known: number, total: number) => `${known} / ${total} mastered`,
    remaining: (count: number) => `${count} card${count === 1 ? '' : 's'} to recall`,
    myCards: 'My cards', empty: 'Your deck is empty for now.', remove: 'Remove card',
    export: 'Export my deck', import: 'Import a deck', invalid: 'This file must contain a valid CramDesk deck (up to 40 cards).',
    storageError: 'Local saving is unavailable. Export your deck before leaving this page.',
    helper: 'Cards stay in this browser. Export the file to keep or transfer them.',
    ctaTitle: 'Already have a PDF full of answers?', ctaText: 'CramDesk can turn your course PDF into flashcards automatically.',
    cta: 'Explore flashcards from a PDF',
  },
} as const

function validCards(value: unknown): value is Array<{ question: string; answer: string }> {
  return Array.isArray(value) && value.length <= maxCards && value.every(item =>
    item && typeof item.question === 'string' && typeof item.answer === 'string' &&
    item.question.trim().length > 0 && item.question.length <= 280 &&
    item.answer.trim().length > 0 && item.answer.length <= 600,
  )
}

export function FreeFlashcards({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const [cards, setCards] = useState<Card[]>([])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [importError, setImportError] = useState(false)
  const [queue, setQueue] = useState<string[]>([])
  const [known, setKnown] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [session, setSession] = useState<'idle' | 'active' | 'complete'>('idle')

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          const parsed: unknown = JSON.parse(stored)
          if (validCards(parsed)) setCards(parsed.map(item => ({ id: crypto.randomUUID(), question: item.question, answer: item.answer })))
        }
      } catch { setStorageError(true) }
      setHydrated(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(storageKey, JSON.stringify(cards)) }
    catch { window.setTimeout(() => setStorageError(true), 0) }
  }, [cards, hydrated])

  const resetSession = () => { setQueue([]); setKnown(0); setRevealed(false); setSession('idle') }

  const addCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuestion = question.trim()
    const nextAnswer = answer.trim()
    if (!nextQuestion || !nextAnswer || cards.length >= maxCards) return
    setCards(current => [...current, { id: crypto.randomUUID(), question: nextQuestion, answer: nextAnswer }])
    setQuestion('')
    setAnswer('')
    resetSession()
  }

  const exportDeck = () => {
    const payload = JSON.stringify(cards.map(({ question: front, answer: back }) => ({ question: front, answer: back })), null, 2)
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'cramdesk-flashcards.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const importDeck = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      if (file.size > 100_000) throw new Error('Too large')
      const parsed: unknown = JSON.parse(await file.text())
      if (!validCards(parsed)) throw new Error('Invalid deck')
      setCards(parsed.map(item => ({ id: crypto.randomUUID(), question: item.question.trim(), answer: item.answer.trim() })))
      setImportError(false)
      resetSession()
    } catch { setImportError(true) }
    event.target.value = ''
  }

  const currentCard = cards.find(card => card.id === queue[0])
  const startReview = () => { setQueue(cards.map(card => card.id)); setKnown(0); setRevealed(false); setSession('active') }
  const markKnown = () => {
    const remaining = queue.slice(1)
    setQueue(remaining)
    setKnown(current => current + 1)
    setRevealed(false)
    if (!remaining.length) setSession('complete')
  }
  const markAgain = () => { setQueue(current => [...current.slice(1), current[0]]); setRevealed(false) }

  return <section id="outil" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:pb-32">
    <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-10">
      <div className="rounded-[1.8rem] border border-[#efdcd0] bg-white p-5 shadow-[0_26px_65px_-45px_rgba(120,49,35,.25)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-[#b34c37]">CramDesk · Free</p><h2 className="font-editorial mt-1 text-3xl text-[#33252b]">{t.title}</h2></div><span className="rounded-full bg-[#fff0e6] px-3 py-1.5 text-xs font-bold text-[#b84432]">{cards.length}/{maxCards}</span></div>
        <form onSubmit={addCard} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-[#493b3e]">{t.question}<textarea value={question} onChange={event => setQuestion(event.target.value)} maxLength={280} placeholder={t.questionPlaceholder} rows={2} className={fieldClass} /></label>
          <label className="block text-sm font-semibold text-[#493b3e]">{t.answer}<textarea value={answer} onChange={event => setAnswer(event.target.value)} maxLength={600} placeholder={t.answerPlaceholder} rows={3} className={fieldClass} /></label>
          <button type="submit" disabled={!question.trim() || !answer.trim() || cards.length >= maxCards} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b84432] px-5 text-sm font-bold text-white transition hover:bg-[#973326] disabled:cursor-not-allowed disabled:opacity-50"><Plus className="size-4" aria-hidden="true" />{t.add}</button>
          <p className="text-center text-xs text-[#8b7a78]">{t.limit} · {t.saved}</p>
        </form>
        <div className="mt-8 border-t border-[#f0dfd5] pt-6"><div className="flex items-center justify-between gap-3"><h3 className="font-editorial text-2xl text-[#33252b]">{t.myCards}</h3><span className="text-xs text-[#8b7a78]">{cards.length}/{maxCards}</span></div>{cards.length ? <ol className="mt-4 max-h-[360px] space-y-2 overflow-auto pr-1">{cards.map((card, index) => <li key={card.id} className="flex items-start gap-3 rounded-xl border border-[#f0dfd5] bg-[#fffbf8] p-3.5"><span className="mt-0.5 text-xs font-bold text-[#b46e56]">{String(index + 1).padStart(2, '0')}</span><p className="min-w-0 flex-1 break-words text-sm font-semibold leading-6 text-[#47383a]">{card.question}</p><button type="button" aria-label={`${t.remove} ${index + 1}`} onClick={() => { setCards(current => current.filter(item => item.id !== card.id)); resetSession() }} className="rounded-lg p-1 text-[#a28e89] hover:bg-[#fce8df] hover:text-[#a73d31]"><Trash2 className="size-4" aria-hidden="true" /></button></li>)}</ol> : <p className="mt-4 rounded-xl bg-[#fff7f1] p-4 text-sm text-[#857572]">{t.empty}</p>}</div>
        <div className="mt-7 grid gap-2 sm:grid-cols-2"><button type="button" onClick={exportDeck} disabled={!cards.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ead7cc] bg-white px-4 text-xs font-bold text-[#a84431] hover:bg-[#fff5ee] disabled:opacity-40"><Download className="size-4" aria-hidden="true" />{t.export}</button><label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ead7cc] bg-white px-4 text-xs font-bold text-[#a84431] hover:bg-[#fff5ee]"><Upload className="size-4" aria-hidden="true" />{t.import}<input type="file" accept="application/json,.json" onChange={importDeck} className="sr-only" /></label></div>
        {importError && <p role="alert" className="mt-3 text-sm text-[#a73d31]">{t.invalid}</p>}
        {storageError && <p role="alert" className="mt-3 text-sm text-[#a73d31]">{t.storageError}</p>}
        <p className="mt-5 text-xs leading-5 text-[#8b7a78]">{t.helper}</p>
      </div>

      <div className="rounded-[1.8rem] border border-[#efdcd0] bg-[#fff4ed] p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-[#b34c37]">{t.review}</p><h2 className="font-editorial mt-1 text-3xl text-[#33252b]">{session === 'active' ? t.progress(known, cards.length) : session === 'complete' ? t.done : cards.length ? t.start : t.createFirst}</h2></div><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#b84432]"><RotateCcw className="size-5" aria-hidden="true" /></span></div>
        {session === 'active' && currentCard ? <>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.15em] text-[#a76a57]">{t.remaining(queue.length)}</p>
          <div aria-live="polite" className="mt-4 flex min-h-[300px] flex-col justify-between rounded-[1.4rem] bg-white p-7 shadow-[0_20px_45px_-35px_rgba(120,49,35,.35)] sm:min-h-[330px] sm:p-9"><div><span className="text-xs font-bold uppercase tracking-[.18em] text-[#b46e56]">{revealed ? t.answer : t.question}</span><p className="font-editorial mt-6 break-words text-3xl leading-snug text-[#33252b] sm:text-4xl">{revealed ? currentCard.answer : currentCard.question}</p></div><span className="mt-7 block h-1.5 w-20 rounded-full bg-[#e97743]" /></div>
          {revealed ? <div className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={markAgain} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#dfb5a2] bg-white px-3 text-sm font-bold text-[#a84431] hover:bg-[#fff7f1]"><RotateCcw className="size-4" aria-hidden="true" />{t.again}</button><button type="button" onClick={markKnown} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b84432] px-3 text-sm font-bold text-white hover:bg-[#973326]"><Check className="size-4" aria-hidden="true" />{t.know}</button></div> : <button type="button" onClick={() => setRevealed(true)} className="mt-5 min-h-12 w-full rounded-full bg-[#b84432] px-5 text-sm font-bold text-white hover:bg-[#973326]">{t.show}</button>}
        </> : <div className="mt-7 flex min-h-[365px] flex-col justify-center rounded-[1.4rem] border border-[#f0dfd5] bg-white p-7 text-center sm:p-10"><span className="font-editorial text-7xl text-[#c25334]">{session === 'complete' ? '✓' : '?'}</span><p className="font-editorial mt-5 text-3xl leading-tight text-[#33252b]">{session === 'complete' ? t.done : cards.length ? t.start : t.createFirst}</p>{session === 'complete' && <p className="mt-3 text-sm leading-6 text-[#7d6c69]">{t.doneHint}</p>}{cards.length > 0 && <button type="button" onClick={startReview} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b84432] px-6 text-sm font-bold text-white hover:bg-[#973326]">{session === 'complete' ? t.restart : t.start}<ArrowRight className="size-4" aria-hidden="true" /></button>}</div>}
        <div className="mt-7 rounded-[1.3rem] bg-[#33252b] p-6 text-white"><p className="font-editorial text-2xl">{t.ctaTitle}</p><p className="mt-2 text-sm leading-6 text-[#e5d5ce]">{t.ctaText}</p><Link href={locale === 'en' ? '/en#studio' : '/#produit'} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#ffd9c5] underline-offset-4 hover:underline">{t.cta}<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
      </div>
    </div>
  </section>
}
