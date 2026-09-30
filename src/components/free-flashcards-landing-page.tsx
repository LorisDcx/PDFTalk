import { CuratedDeckGrid } from '@/components/curated-deck-grid'
import { CuratedDeckHero } from '@/components/curated-deck-hero'
import { EditorialFooter } from '@/components/editorial-footer'
import { FreeFlashcards } from '@/components/free-flashcards'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { LocalePreference } from '@/components/locale-preference'
import { PublicSiteHeader } from '@/components/public-site-header'
import { curatedDeckCopy, freeFlashcardsPath } from '@/lib/curated-decks'
import { freeFlashcardsLanding } from '@/lib/free-flashcards-landing'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

export function FreeFlashcardsLandingPage({ locale }: { locale: StudyPdfLocale }) {
  const c = freeFlashcardsLanding[locale]
  const deckCopy = curatedDeckCopy[locale]
  return <>
    <WebPageJsonLd title={deckCopy.title} description={deckCopy.intro} url={`https://www.cramdesk.com${freeFlashcardsPath(locale)}`} />
    <FAQJsonLd faqs={[...c.faqs]} />
    <LocalePreference locale={locale} />
    <PublicSiteHeader locale={locale} />
    <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#fffaf5] text-[var(--cd-ink)]">
      <CuratedDeckHero locale={locale} />
      <CuratedDeckGrid locale={locale} />
      <div className="pt-16"><FreeFlashcards locale={locale} /></div>
      <section className="border-t border-[var(--cd-line)] bg-[#fff4ed] px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{c.howEyebrow}</p><h2 className="font-editorial mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">{c.howTitle}</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{c.steps.map(step => <article key={step.title} className="rounded-[1.4rem] border border-[var(--cd-line)] bg-white p-6"><h3 className="font-editorial text-2xl">{step.title}</h3><p className="mt-3 text-base leading-7 text-[var(--cd-muted)]">{step.text}</p></article>)}</div></div></section>
      <section className="px-5 py-20 sm:px-8"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{c.faqEyebrow}</p><h2 className="font-editorial mt-4 text-4xl sm:text-5xl">{c.faqTitle}</h2><div className="mt-8 space-y-3">{c.faqs.map(faq => <details key={faq.question} className="group rounded-[1.2rem] border border-[var(--cd-line)] bg-white p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">{faq.question}<span aria-hidden="true" className="text-2xl font-light text-[var(--cd-brand)] transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span></summary><p className="mt-4 text-base leading-7 text-[var(--cd-muted)]">{faq.answer}</p></details>)}</div></div></section>
    </main>
    <EditorialFooter locale={locale} />
  </>
}
