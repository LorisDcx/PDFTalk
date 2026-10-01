import Link from 'next/link'
import { ArrowRight, ArrowUpRight, BookOpenText, HeartPulse } from 'lucide-react'
import { EditorialFooter } from '@/components/editorial-footer'
import { WebPageJsonLd } from '@/components/json-ld'
import { LocalePreference } from '@/components/locale-preference'
import { PublicSiteHeader } from '@/components/public-site-header'
import { LandingBackdrop } from '@/components/landing-backdrop'
import { curatedDeckCopy, curatedDeckPath, freeFlashcardsPath } from '@/lib/curated-decks'
import { MEDICAL_DECK_IDS, medicalFlashcardsPath } from '@/lib/medical-decks'
import { medicalFlashcardsCopy } from '@/lib/medical-flashcards-copy'
import { studyPdfPath, type StudyPdfLocale } from '@/lib/study-pdf-locales'

export function MedicalFlashcardsLandingPage({ locale }: { locale: StudyPdfLocale }) {
  const c = medicalFlashcardsCopy[locale]
  const decks = curatedDeckCopy[locale].deck
  const preview = decks['human-anatomy'].cards[0]
  return <>
    <WebPageJsonLd title={c.title} description={c.intro} url={`https://www.cramdesk.com${medicalFlashcardsPath(locale)}`} />
    <LocalePreference locale={locale} />
    <PublicSiteHeader locale={locale} />
    <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--cd-paper)] text-[var(--cd-ink)]">
      <section className="landing-hero px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20"><LandingBackdrop /><div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
        <div>
        <Link href={freeFlashcardsPath(locale)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--cd-brand)] underline-offset-4 hover:underline"><span aria-hidden="true">{locale === 'ar' ? '→' : '←'}</span>{c.back}</Link>
        <p className="mt-8 flex w-fit items-center gap-2 rounded-full border border-[var(--cd-line)] bg-white px-4 py-2 text-xs font-bold uppercase tracking-[.1em] text-[var(--cd-brand)]"><HeartPulse aria-hidden="true" className="size-4" />{c.eyebrow}</p>
        <h1 className="font-editorial mt-7 max-w-4xl text-[clamp(3rem,5vw,5.7rem)] leading-[1.04] tracking-[-.05em]">{c.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--cd-muted)]">{c.intro}</p>
        <a href="#jeux-medecine" className="cd-press mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)]">{c.choose}<ArrowRight aria-hidden="true" className={`size-4 ${locale === 'ar' ? 'rotate-180' : ''}`} /></a>
        </div>
        <Link href={curatedDeckPath(locale, 'human-anatomy')} className="cd-lift group relative block rounded-[var(--cd-radius-panel)] border border-[var(--cd-line)] bg-white p-7 shadow-[0_25px_50px_-38px_rgba(83,41,30,.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] sm:p-9">
          <span className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[.12em] text-[var(--cd-brand)]"><span>{decks['human-anatomy'].title}</span><span dir="ltr">01 / 20</span></span>
          <span className="font-editorial mt-10 block text-3xl leading-tight">{preview[0]}</span>
          <span className="mt-8 block border-t border-[var(--cd-line)] pt-6 text-base leading-7 text-[var(--cd-muted)]">{preview[1]}</span>
          <span className="mt-8 flex items-center justify-end gap-2 text-sm font-bold text-[var(--cd-brand)]">{c.choose}<ArrowUpRight aria-hidden="true" className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" /></span>
        </Link>
      </div></section>

      <section id="jeux-medecine" className="scroll-mt-24 border-y border-[var(--cd-line)] bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl">
        <h2 className="font-editorial text-4xl sm:text-5xl">{c.sectionTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{MEDICAL_DECK_IDS.map((id, index) => <Link key={id} href={curatedDeckPath(locale, id)} className="cd-lift group flex min-h-72 flex-col rounded-[var(--cd-radius-panel)] border border-[var(--cd-line)] bg-[var(--cd-paper)] p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">
          <span className="font-editorial text-2xl text-[var(--cd-brand)]">0{index + 1}</span>
          <h3 className="font-editorial mt-6 text-3xl">{decks[id].title}</h3>
          <p className="mt-3 flex-1 text-base leading-7 text-[var(--cd-muted)]">{decks[id].description}</p>
          <span className="mt-8 flex items-center justify-between border-t border-[var(--cd-line)] pt-5 text-sm font-bold text-[var(--cd-brand)]"><span>{decks[id].cards.length} {curatedDeckCopy[locale].cards}</span><ArrowUpRight aria-hidden="true" className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" /></span>
        </Link>)}</div>
      </div></section>

      <section className="px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><h2 className="font-editorial max-w-3xl text-4xl leading-tight sm:text-5xl">{c.methodTitle}</h2><ol className="mt-9 grid gap-4 md:grid-cols-3">{c.method.map((step, index) => <li key={step} className="border-t-2 border-[var(--cd-brand)] pt-5"><span className="font-editorial text-3xl text-[var(--cd-brand)]">0{index + 1}</span><p className="mt-4 text-base leading-7 text-[var(--cd-muted)]">{step}</p></li>)}</ol></div></section>

      <section className="bg-[#fff0e6] px-5 py-16 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-7 md:flex-row md:items-end md:justify-between"><div><h2 className="font-editorial text-4xl sm:text-5xl">{c.nextTitle}</h2><p className="mt-5 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{c.nextText}</p></div><Link href={studyPdfPath(locale)} className="cd-press inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)]">{c.pdfAction}<ArrowRight aria-hidden="true" className={`size-4 ${locale === 'ar' ? 'rotate-180' : ''}`} /></Link></div></section>

      <section className="px-5 py-20 sm:px-8"><div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2"><div><h2 className="font-editorial text-4xl">{c.sourceTitle}</h2><p className="mt-5 max-w-xl text-base leading-7 text-[var(--cd-muted)]">{c.sourceText}</p><a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/preface" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[var(--cd-brand)] underline-offset-4 hover:underline"><BookOpenText aria-hidden="true" className="size-4" />OpenStax · Anatomy and Physiology 2e<ArrowUpRight aria-hidden="true" className="size-4" /></a></div><div><h2 className="font-editorial text-4xl">{c.faqTitle}</h2><div className="mt-5 space-y-3">{c.faqs.map(faq => <details key={faq.question} className="group rounded-2xl border border-[var(--cd-line)] bg-white p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold"><span>{faq.question}</span><span aria-hidden="true" className="text-xl text-[var(--cd-brand)] transition-transform group-open:rotate-45 motion-reduce:transition-none">+</span></summary><p className="mt-4 border-t border-[var(--cd-line)] pt-4 text-base leading-7 text-[var(--cd-muted)]">{faq.answer}</p></details>)}</div></div></div></section>
    </main>
    <EditorialFooter locale={locale} />
  </>
}
