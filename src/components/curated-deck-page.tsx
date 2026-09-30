import Link from 'next/link'
import { ArrowLeft, Layers3 } from 'lucide-react'
import { FreeFlashcards } from '@/components/free-flashcards'
import { curatedDeckCopy, freeFlashcardsPath, type CuratedDeckId } from '@/lib/curated-decks'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

const backLabel: Record<StudyPdfLocale, string> = {
  fr: 'Tous les jeux', en: 'All decks', es: 'Todos los juegos', de: 'Alle Kartensets',
  it: 'Tutti i mazzi', pt: 'Todos os conjuntos', zh: '全部卡组', ja: 'すべてのセット', ar: 'كل المجموعات',
}
const deckNote: Record<StudyPdfLocale, string> = {
  fr: 'Un jeu de départ à adapter à ton cours et à ton niveau.', en: 'A starter deck to adapt to your course and level.', es: 'Un juego inicial que puedes adaptar a tu curso y nivel.', de: 'Ein Starterset, das du an deinen Kurs und dein Niveau anpassen kannst.', it: 'Un mazzo iniziale da adattare al tuo corso e al tuo livello.', pt: 'Um conjunto inicial que podes adaptar ao teu curso e nível.', zh: '基础卡组，可根据课程和程度调整。', ja: '授業とレベルに合わせて編集できる入門セットです。', ar: 'مجموعة أولية يمكنك تكييفها مع مقررك ومستواك.',
}
const previewHeading: Record<StudyPdfLocale, string> = {
  fr: 'Aperçu des questions', en: 'Questions in this deck', es: 'Preguntas del juego', de: 'Fragen in diesem Set', it: 'Domande del mazzo', pt: 'Perguntas do conjunto', zh: '卡组问题预览', ja: '収録されている質問', ar: 'أسئلة المجموعة',
}

export function CuratedDeckPage({ locale, id }: { locale: StudyPdfLocale; id: CuratedDeckId }) {
  const c = curatedDeckCopy[locale]
  const deck = c.deck[id]
  return <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#fffaf5] text-[var(--cd-ink)]">
    <section className="px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-20"><div className="mx-auto max-w-6xl">
      <Link href={freeFlashcardsPath(locale)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--cd-brand)] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]"><ArrowLeft className={`size-4 ${locale === 'ar' ? 'rotate-180' : ''}`} aria-hidden="true" />{backLabel[locale]}</Link>
      <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[.14em] text-[var(--cd-brand)]"><span className="inline-flex items-center gap-2 rounded-full border border-[#edcdbd] bg-[#fff0e6] px-4 py-2"><Layers3 className="size-4" aria-hidden="true" />CramDesk · Free</span><span>{deck.cards.length} {c.cards}</span></div>
      <h1 className="font-editorial mt-6 max-w-4xl break-words text-[clamp(2.5rem,7vw,5.7rem)] leading-[1.02] tracking-[-.05em]">{deck.title}</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--cd-muted)]">{deck.description} {deckNote[locale]}</p>
      <a href="#outil" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#983b2b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none">{c.start}</a>
    </div></section>
    <FreeFlashcards key={`${locale}-${id}`} locale={locale} deckId={id} initialCards={deck.cards} studyFirst />
    <section className="border-t border-[var(--cd-line)] bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-4xl"><h2 className="font-editorial text-3xl sm:text-4xl">{previewHeading[locale]}</h2><div className="mt-7 space-y-3">{deck.cards.map(([question, answer], index) => <details key={question} className="group rounded-2xl border border-[var(--cd-line)] bg-[#fffaf5] p-5"><summary className="flex cursor-pointer list-none items-start gap-4 text-base font-semibold leading-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]"><span className="font-editorial text-xl text-[var(--cd-brand)]">{String(index + 1).padStart(2, '0')}</span><span className="flex-1">{question}</span><span aria-hidden="true" className="text-[var(--cd-brand)] transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span></summary><p className="mt-4 border-t border-[var(--cd-line)] pt-4 text-base leading-7 text-[var(--cd-muted)]">{answer}</p></details>)}</div></div></section>
  </main>
}
