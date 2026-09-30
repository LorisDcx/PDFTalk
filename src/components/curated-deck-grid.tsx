'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, BookOpen, Search } from 'lucide-react'
import { CURATED_DECK_IDS, curatedDeckCopy, curatedDeckPath } from '@/lib/curated-decks'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

export function CuratedDeckGrid({ locale }: { locale: StudyPdfLocale }) {
  const [query, setQuery] = useState('')
  const c = curatedDeckCopy[locale]
  const matches = CURATED_DECK_IDS.filter(id => `${c.deck[id].title} ${c.deck[id].description}`.toLocaleLowerCase(locale).includes(query.trim().toLocaleLowerCase(locale)))

  return <section id="jeux" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="scroll-mt-24 border-y border-[var(--cd-line)] bg-white px-5 py-16 sm:px-8 sm:py-20">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">CramDesk · Free</p><h2 className="font-editorial mt-3 max-w-2xl text-4xl leading-tight text-[var(--cd-ink)] sm:text-5xl">{c.title}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{c.intro}</p></div>
        <label className="relative block min-w-0 sm:w-64"><span className="sr-only">{c.search}</span><Search aria-hidden="true" className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-[var(--cd-muted)]" /><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={c.search} className="min-h-12 w-full rounded-full border border-[var(--cd-line)] bg-[#fffaf5] ps-11 pe-4 text-base text-[var(--cd-ink)] outline-none transition focus:border-[var(--cd-brand)] focus:ring-2 focus:ring-[#f6d5c5]" /></label>
      </div>
      {matches.length ? <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{matches.map((id, index) => {
        const deck = c.deck[id]
        return <Link key={id} href={curatedDeckPath(locale, id)} className="group flex min-h-60 flex-col rounded-[1.5rem] border border-[var(--cd-line)] bg-[#fffaf5] p-6 shadow-[0_14px_35px_-28px_rgba(120,49,35,.35)] transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1.5 hover:border-[#d6a68f] hover:shadow-[0_22px_45px_-27px_rgba(120,49,35,.38)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] motion-reduce:transform-none motion-reduce:transition-none" aria-label={`${deck.title} · ${deck.cards.length} ${c.cards}`}>
          <span className="flex items-center justify-between"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffebe0] text-[var(--cd-brand)]"><BookOpen className="size-5" aria-hidden="true" /></span><span className="font-editorial text-2xl text-[#bd9e91]">{String(index + 1).padStart(2, '0')}</span></span>
          <span className="font-editorial mt-7 text-2xl leading-tight text-[var(--cd-ink)]">{deck.title}</span><span className="mt-2 flex-1 text-sm leading-6 text-[var(--cd-muted)]">{deck.description}</span>
          <span className="mt-6 flex items-center justify-between border-t border-[var(--cd-line)] pt-4 text-sm font-bold text-[var(--cd-brand)]"><span>{deck.cards.length} {c.cards}</span><span className="inline-flex items-center gap-1">{c.start}<ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" aria-hidden="true" /></span></span>
        </Link>
      })}</div> : <p role="status" className="mt-9 rounded-2xl border border-[var(--cd-line)] bg-[#fffaf5] p-8 text-center text-base text-[var(--cd-muted)]">{c.noResults}</p>}
    </div>
  </section>
}
