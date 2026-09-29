import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, FileStack } from 'lucide-react'
import { PublicSiteHeader } from '@/components/public-site-header'
import { LocalePreference } from '@/components/locale-preference'
import { PdfToolkit } from '@/components/pdf-toolkit'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { PDF_EXTRA_LOCALES, pdfHubCopy, pdfHubPath, pdfHubWorkflow, translatedTools, type ExtraPdfLocale } from '@/lib/pdf-tool-locales'
import { STUDY_PDF_LOCALES, studyPdfCopy, studyPdfPath } from '@/lib/study-pdf-locales'

function validLocale(value: string): value is ExtraPdfLocale {
  return PDF_EXTRA_LOCALES.includes(value as ExtraPdfLocale)
}

export function generateStaticParams() {
  return PDF_EXTRA_LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!validLocale(locale)) return {}
  const c = pdfHubCopy[locale]
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: pdfHubPath(locale),
      languages: Object.fromEntries(STUDY_PDF_LOCALES.map(item => [item, pdfHubPath(item)])),
    },
    openGraph: { title: c.title, description: c.description, url: `https://cramdesk.com${pdfHubPath(locale)}` },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!validLocale(locale)) notFound()
  const c = pdfHubCopy[locale]
  const workflow = pdfHubWorkflow[locale]
  return <>
    <LocalePreference locale={locale} />
    <WebPageJsonLd title={c.title} description={c.description} url={`https://cramdesk.com${pdfHubPath(locale)}`} />
    <FAQJsonLd faqs={[{ question: c.faqOne, answer: c.faqAnswerOne }, { question: c.faqTwo, answer: c.faqAnswerTwo }]} />
    <PublicSiteHeader locale={locale} />
    <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--cd-paper)] text-[var(--cd-ink)]">
      <section className="px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24"><div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_.8fr]">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{c.eyebrow}</p>
          <h1 className={`mt-5 max-w-3xl text-[clamp(3.25rem,6.5vw,6rem)] leading-[1.02] tracking-[-.05em] ${locale === 'ar' ? 'font-semibold' : 'font-editorial'}`}>{c.heading}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--cd-muted)]">{c.intro}</p>
          <a href="#outil" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--cd-brand)] px-7 text-sm font-bold text-white hover:opacity-90">{c.choose}<ArrowRight className="size-4" /></a>
          <p className="mt-4 text-sm text-[var(--cd-muted)]">{c.privacy}</p>
        </div>
        <div className="border-s-2 border-[#d9a58e] ps-7 text-[#514145] sm:ps-10"><FileStack className="size-10 text-[var(--cd-brand)]" aria-hidden="true" /><p className={`mt-6 text-3xl leading-snug ${locale === 'ar' ? 'font-semibold' : 'font-editorial'}`}>{c.choose}</p><div className="mt-7 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-[#fff0e6] px-3 py-2">PDF</span><span className="rounded-full bg-[#fff0e6] px-3 py-2">JPG / PNG</span><span className="rounded-full bg-[#fff0e6] px-3 py-2">{c.eyebrow}</span></div></div>
      </div></section>
      <PdfToolkit locale={locale} />
      <section className="border-y border-[var(--cd-line)] bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><h2 className={`max-w-2xl text-4xl leading-tight ${locale === 'ar' ? 'font-semibold' : 'font-editorial'}`}>{c.choose}</h2><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{translatedTools[locale].map(([id, name, description]) => <a key={id} href={`${pdfHubPath(locale)}?tool=${id}#outil`} className="flex min-h-36 flex-col justify-between rounded-2xl border border-[var(--cd-line)] bg-[#fffaf6] p-5 hover:border-[var(--cd-brand)] hover:bg-[#fff3ea]"><span className="text-lg font-bold">{name}</span><span className="mt-5 flex items-end justify-between gap-2 text-sm leading-6 text-[var(--cd-muted)]">{description}<ArrowRight className="size-4 shrink-0 text-[var(--cd-brand)]" /></span></a>)}</div></div></section>
      <section className="px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto max-w-6xl"><h2 className={`max-w-3xl text-4xl leading-tight ${locale === 'ar' ? 'font-semibold' : 'font-editorial'}`}>{workflow.title}</h2><div className="mt-10 grid gap-8 border-t border-[var(--cd-line)] pt-8 md:grid-cols-3">{workflow.steps.map((step, index) => <div key={step}><span className="font-editorial text-3xl text-[var(--cd-brand)]">0{index + 1}</span><p className="mt-3 max-w-sm text-base leading-7 text-[var(--cd-muted)]">{step}</p></div>)}</div></div></section>
      <section className="bg-[#fff0e6] px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">CramDesk</p><h2 className={`${locale === 'ar' ? 'font-semibold' : 'font-editorial'} mt-3 max-w-xl text-4xl sm:text-5xl`}>{c.studyTitle}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-[var(--cd-muted)]">{c.studyText}</p></div><Link href={`/${locale}#studio`} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#d8a996] bg-white px-6 text-sm font-bold text-[var(--cd-brand)]">{c.studyAction}<ArrowRight className="size-4" /></Link></div></section>
      <section className="px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto max-w-4xl"><h2 className={`${locale === 'ar' ? 'font-semibold' : 'font-editorial'} text-4xl`}>{c.faqTitle}</h2><div className="mt-8 divide-y divide-[var(--cd-line)] border-y border-[var(--cd-line)]">{[[c.faqOne, c.faqAnswerOne], [c.faqTwo, c.faqAnswerTwo]].map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold">{question}<span className="text-2xl font-normal text-[var(--cd-brand)] group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-2 pt-2 text-base leading-7 text-[var(--cd-muted)]">{answer}</p></details>)}</div><Link href={studyPdfPath(locale)} className="mt-7 inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--cd-brand)] underline underline-offset-4">{studyPdfCopy[locale].eyebrow}<ArrowRight className="size-4" /></Link></div></section>
    </main>
    <footer lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="border-t border-[var(--cd-line)] bg-white px-5 py-9 text-sm text-[var(--cd-muted)] sm:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5"><Link href={`/${locale}`} className="font-editorial text-2xl text-[var(--cd-ink)]">CramDesk<span className="text-[var(--cd-brand)]">.</span></Link><Link href={studyPdfPath(locale)} className="hover:text-[var(--cd-brand)]">{c.studyAction}</Link><p>© {new Date().getFullYear()} CramDesk</p></div></footer>
  </>
}
