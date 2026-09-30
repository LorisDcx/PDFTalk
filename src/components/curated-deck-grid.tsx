'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, BookOpen, Search } from 'lucide-react'
import { CURATED_DECK_IDS, SPECIALIZED_DECK_IDS, curatedDeckCopy, curatedDeckPath } from '@/lib/curated-decks'
import { MEDICAL_DECK_IDS, medicalFlashcardsPath } from '@/lib/medical-decks'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

const categoryCopy: Record<StudyPdfLocale, { all: string; foundations: string; specialties: string; medicine: string; medicalGuide: string }> = {
  fr: { all: 'Tous les jeux', foundations: 'Fondamentaux', specialties: 'Spécialisations', medicine: 'Médecine', medicalGuide: 'Parcours médecine' },
  en: { all: 'All decks', foundations: 'Foundations', specialties: 'Specializations', medicine: 'Medicine', medicalGuide: 'Medical study hub' },
  es: { all: 'Todos los juegos', foundations: 'Fundamentos', specialties: 'Especializaciones', medicine: 'Medicina', medicalGuide: 'Ruta de medicina' },
  de: { all: 'Alle Sets', foundations: 'Grundlagen', specialties: 'Vertiefungen', medicine: 'Medizin', medicalGuide: 'Medizin-Lernpfad' },
  it: { all: 'Tutti i mazzi', foundations: 'Fondamenti', specialties: 'Specializzazioni', medicine: 'Medicina', medicalGuide: 'Percorso medicina' },
  pt: { all: 'Todos os conjuntos', foundations: 'Fundamentos', specialties: 'Especializações', medicine: 'Medicina', medicalGuide: 'Percurso de medicina' },
  zh: { all: '全部卡组', foundations: '基础知识', specialties: '专题进阶', medicine: '医学', medicalGuide: '医学学习路径' },
  ja: { all: 'すべて', foundations: '基礎', specialties: '専門分野', medicine: '医学', medicalGuide: '医学の学習ガイド' },
  ar: { all: 'كل المجموعات', foundations: 'الأساسيات', specialties: 'تخصصات', medicine: 'الطب', medicalGuide: 'مسار دراسة الطب' },
}

export function CuratedDeckGrid({ locale }: { locale: StudyPdfLocale }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<'all' | 'foundations' | 'specialties' | 'medicine'>('all')
  const c = curatedDeckCopy[locale]
  const labels = categoryCopy[locale]
  const isSpecialty = (id: typeof CURATED_DECK_IDS[number]) => SPECIALIZED_DECK_IDS.some(specialty => specialty === id)
  const isMedical = (id: typeof CURATED_DECK_IDS[number]) => MEDICAL_DECK_IDS.some(medical => medical === id)
  const normalizeSearch = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase(locale)
  const matches = CURATED_DECK_IDS.filter(id => {
    const matchesCategory = category === 'all' || (category === 'specialties' ? isSpecialty(id) : category === 'medicine' ? isMedical(id) : !isSpecialty(id) && !isMedical(id))
    const searchable = `${c.deck[id].title} ${c.deck[id].description} ${isMedical(id) ? labels.medicine : isSpecialty(id) ? labels.specialties : labels.foundations}`
    return matchesCategory && normalizeSearch(searchable).includes(normalizeSearch(query.trim()))
  })

  return <section id="jeux" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="scroll-mt-24 border-y border-[var(--cd-line)] bg-white px-5 py-16 sm:px-8 sm:py-20">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">CramDesk · Free</p><h2 className="font-editorial mt-3 max-w-2xl text-4xl leading-tight text-[var(--cd-ink)] sm:text-5xl">{c.title}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{c.intro}</p></div>
        <label className="relative block min-w-0 sm:w-64"><span className="sr-only">{c.search}</span><Search aria-hidden="true" className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-[var(--cd-muted)]" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={c.search} className="min-h-12 w-full rounded-full border border-[var(--cd-line)] bg-[#fffaf5] ps-11 pe-4 text-base text-[var(--cd-ink)] outline-none transition focus:border-[var(--cd-brand)] focus:ring-2 focus:ring-[#f6d5c5]" /></label>
      </div>
      <div role="group" aria-label={labels.all} className="mt-8 flex flex-wrap gap-2">{(['all', 'foundations', 'specialties', 'medicine'] as const).map(value => <button key={value} type="button" aria-pressed={category === value} onClick={() => setCategory(value)} className={`cd-press min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] ${category === value ? 'border-[var(--cd-brand)] bg-[var(--cd-brand)] text-white' : 'border-[var(--cd-line)] bg-[#fffaf5] text-[var(--cd-ink)] hover:border-[#d6a68f]'}`}>{labels[value]}</button>)}</div>
      {category === 'medicine' && <Link href={medicalFlashcardsPath(locale)} className="mt-5 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[var(--cd-brand)] underline-offset-4 hover:underline">{labels.medicalGuide}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>}
      {matches.length ? <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{matches.map((id, index) => {
        const deck = c.deck[id]
        return <Link key={id} href={curatedDeckPath(locale, id)} className="curated-grid-card group flex min-h-60 flex-col rounded-[1.5rem] border border-[var(--cd-line)] bg-[#fffaf5] p-6 shadow-[0_14px_35px_-28px_rgba(120,49,35,.35)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-[#d6a68f] hover:shadow-[0_22px_45px_-27px_rgba(120,49,35,.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] motion-reduce:transform-none motion-reduce:transition-none" style={{ animationDelay: `${Math.min(index, 5) * 45}ms` }} aria-label={`${deck.title} · ${deck.cards.length} ${c.cards}`}>
          <span className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffebe0] text-[var(--cd-brand)]"><BookOpen className="size-5" aria-hidden="true" /></span><span className="font-editorial text-2xl text-[#bd9e91]">{String(index + 1).padStart(2, '0')}</span></span>
          <span className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-[var(--cd-brand)]">{isMedical(id) ? labels.medicine : isSpecialty(id) ? labels.specialties : labels.foundations}</span><span className="font-editorial mt-2 text-2xl leading-tight text-[var(--cd-ink)]">{deck.title}</span><span className="mt-2 flex-1 text-base leading-6 text-[var(--cd-muted)]">{deck.description}</span>
          <span className="mt-6 flex items-center justify-between border-t border-[var(--cd-line)] pt-4 text-sm font-bold text-[var(--cd-brand)]"><span>{deck.cards.length} {c.cards}</span><span className="inline-flex items-center gap-1">{c.start}<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" /></span></span>
        </Link>
      })}</div> : <p role="status" className="mt-9 rounded-2xl border border-[var(--cd-line)] bg-[#fffaf5] p-8 text-center text-base text-[var(--cd-muted)]">{c.noResults}</p>}
    </div>
  </section>
}
