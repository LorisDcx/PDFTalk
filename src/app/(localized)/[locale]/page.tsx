import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, BookOpenText, CheckCircle2, FileQuestion, FileText, Layers3 } from 'lucide-react'
import { LocalePreference } from '@/components/locale-preference'
import { FAQJsonLd } from '@/components/json-ld'
import { DemoUpload } from '@/components/demo-upload'
import { PublicSiteHeader } from '@/components/public-site-header'
import { localizedLandings, SEO_LOCALES, languageAlternates, type SeoLocale } from '@/lib/seo-locales'
import { studyPdfCopy, studyPdfPath } from '@/lib/study-pdf-locales'
import { pdfHubCopy, pdfHubPath, translatedTools } from '@/lib/pdf-tool-locales'
import { PLANS } from '@/lib/plans'
import { landingPricingCopy } from '@/lib/landing-pricing-locales'

const baseUrl = 'https://cramdesk.com'

function isSeoLocale(value: string): value is SeoLocale {
  return SEO_LOCALES.includes(value as SeoLocale)
}

export function generateStaticParams() {
  return SEO_LOCALES.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!isSeoLocale(locale)) return {}
  const content = localizedLandings[locale]
  const path = `/${locale}`
  const openGraphLocale: Record<SeoLocale, string> = {
    en: 'en_US', es: 'es_ES', de: 'de_DE', it: 'it_IT',
    pt: 'pt_PT', zh: 'zh_CN', ja: 'ja_JP', ar: 'ar_SA',
  }
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: path, languages: languageAlternates },
    openGraph: {
      type: 'website', locale: openGraphLocale[locale], url: `${baseUrl}${path}`, siteName: 'CramDesk',
      title: content.title, description: content.description,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CramDesk study workspace' }],
    },
    twitter: { card: 'summary_large_image', title: content.title, description: content.description, images: ['/og-image.png'] },
    robots: { index: true, follow: true },
  }
}

const featureTones = [
  { card: 'bg-[#fbe5d8]', icon: 'bg-white/80 text-[#c25334]' },
  { card: 'bg-[#e9ecf2]', icon: 'bg-white/80 text-[#526584]' },
  { card: 'bg-[#ecf0e7]', icon: 'bg-white/80 text-[#637e5d]' },
] as const

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isSeoLocale(locale)) notFound()
  const content = localizedLandings[locale]
  const rtl = locale === 'ar'
  const displayClass = rtl ? 'font-semibold' : 'font-editorial'
  const freeTools = locale === 'en'
    ? { eyebrow: '8 free PDF tools', heading: 'Prepare your PDF before you study.', intro: 'Merge, extract or reorder pages directly in your browser. No account, upload or usage quota.', action: 'Open the free PDF tools', privacy: 'Your files stay on your device.', tasks: ['Merge PDFs', 'Extract pages', 'Organize pages'] }
    : { ...pdfHubCopy[locale], action: pdfHubCopy[locale].choose, tasks: translatedTools[locale].slice(0, 3).map(([, name]) => name) }
  const pricing = landingPricingCopy[locale]

  return (
    <>
      <LocalePreference locale={locale} />
      <FAQJsonLd faqs={content.faqs} />
      <PublicSiteHeader locale={locale} />
      <main lang={locale} dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen overflow-hidden bg-[#fffaf5] text-[#33252b]">

      <section className="border-b border-[var(--cd-line)] bg-[var(--cd-paper)] px-5 pb-12 pt-8 text-center sm:px-8 sm:pb-20 sm:pt-16">
        <div className="mx-auto max-w-6xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{content.eyebrow}</p>
          <h1 className={`${displayClass} mx-auto max-w-4xl text-[clamp(2.65rem,6.7vw,6rem)] leading-[1.03] tracking-[-.05em]`}>{content.heading}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#655a62] sm:text-lg">{content.intro}</p>
          <div className="mx-auto mt-6 max-w-2xl rounded-[1.5rem] border border-[#efdcd0] bg-white p-4 text-start sm:mt-8 sm:p-6">
            <p className="mb-3 px-1 text-base font-bold text-[#3b2e34]">{studyPdfCopy[locale].choose}</p>
            <DemoUpload locale={locale} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#756b70]">
            <p>{content.pricingText}</p>
            <Link href={studyPdfPath(locale)} className="inline-flex min-h-11 items-center gap-1 font-semibold text-[#8d3e31] underline underline-offset-4">{studyPdfCopy[locale].eyebrow}<ArrowRight className="size-4" /></Link>
          </div>
        </div>
        <div id="studio" className="mx-auto mt-20 max-w-5xl scroll-mt-24 rounded-[1.7rem] border border-[#edd9ce] bg-white text-start shadow-[0_18px_50px_-40px_rgba(59,34,56,.36)] sm:mt-24">
          <div className="flex items-center gap-3 border-b border-[#eee8ed] px-5 py-4 sm:px-7">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-[#ffe0d1] text-[#b84432]"><FileText className="size-5" /></span>
            <div><p className="text-sm font-bold">Document.pdf</p><p className="text-xs text-[#837a84]">{content.steps[0]}</p></div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-3 sm:p-7">
            {content.features.map((feature, index) => {
              const tone = featureTones[index]
              const Icon = index === 0 ? BookOpenText : index === 1 ? Layers3 : FileQuestion
              return <article key={feature.title} className={`rounded-[1.3rem] p-5 ${tone.card}`}>
                <span className={`flex size-10 items-center justify-center rounded-xl ${tone.icon}`}><Icon className="size-5" /></span>
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.18em] text-[#968493]">0{index + 1}</p>
                <h2 className="mt-2 text-lg font-bold text-[#3d303d]">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6e6370]">{feature.description}</p>
              </article>
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-24 sm:px-8 lg:py-[7.5rem]" aria-labelledby="features-title">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">CramDesk</p>
          <h2 id="features-title" className={`${displayClass} max-w-3xl text-4xl leading-[1.08] tracking-[-.04em] sm:text-6xl`}>{content.featuresTitle}</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {content.features.map((feature, index) => {
              const Icon = index === 0 ? BookOpenText : index === 1 ? Layers3 : CheckCircle2
              return <article key={feature.title} className="rounded-[1.4rem] border border-[#ebe2e9] bg-white p-7">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffe5d5] text-[#c25334]"><Icon className="size-5" /></span>
                <h3 className="mt-7 text-xl font-bold text-[#3d303d]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6e6370]">{feature.description}</p>
              </article>
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--cd-line)] bg-[#fff1e7] px-5 py-20 sm:px-8 lg:py-28" aria-labelledby="free-tools-title">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_.9fr] lg:gap-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{freeTools.eyebrow}</p>
            <h2 id="free-tools-title" className={`${displayClass} mt-5 text-4xl leading-[1.1] tracking-[-.04em] sm:text-5xl`}>{freeTools.heading}</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-[var(--cd-muted)]">{freeTools.intro}</p>
            <Link href={pdfHubPath(locale)} className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white hover:opacity-90">{freeTools.action}<ArrowRight className="size-4" /></Link>
            <p className="mt-4 text-sm text-[var(--cd-muted)]">{freeTools.privacy}</p>
          </div>
          <div className="rounded-[1.6rem] border border-[#efd8ca] bg-white p-5 shadow-[0_24px_65px_-45px_rgba(132,58,35,.3)] sm:p-7">
            <div className="flex items-center gap-3 border-b border-[var(--cd-line)] pb-5"><span className="flex size-10 items-center justify-center rounded-xl bg-[#ffe5d5] text-[var(--cd-brand)]"><FileText className="size-5" /></span><span className="text-sm font-bold">Document.pdf</span></div>
            <div className="mt-4 grid gap-3">{freeTools.tasks.map((task, index) => <div key={task} className="flex items-center gap-4 rounded-xl bg-[#fff9f5] px-4 py-4"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#ffe5d5] text-xs font-bold text-[var(--cd-brand)]">0{index + 1}</span><span className="text-sm font-semibold">{task}</span><CheckCircle2 className="ms-auto size-4 text-[#637e5d]" /></div>)}</div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">01 → 03</p>
          <h2 className={`${displayClass} text-4xl leading-[1.08] tracking-[-.04em] sm:text-6xl`}>{content.stepsTitle}</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">{content.steps.map((step, index) => <li key={step} className="rounded-[1.2rem] border border-[#ebe2e9] bg-white p-6 text-sm leading-7 text-[#6a5e6b]"><span className="font-editorial text-3xl text-[#c25334]">0{index + 1}</span><p className="mt-4">{step}</p></li>)}</ol>
        </div>
      </section>

      <section id="pricing" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff9f5] px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-3xl"><p className="mb-5 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">CramDesk</p><h2 className={`${displayClass} text-4xl leading-[1.08] tracking-[-.04em] sm:text-6xl`}>{content.pricingTitle}</h2><p className="mt-5 text-lg leading-8 text-[#706671]">{content.pricingText}</p></div>
          <div className="grid gap-4 lg:grid-cols-3">{Object.values(PLANS).map((plan, index) => {
            const featured = plan.id === 'student'
            return <article key={plan.id} className={`relative flex flex-col rounded-[1.5rem] border p-7 sm:p-8 ${featured ? 'border-[#d18068] bg-[#b84432] text-white shadow-[0_22px_45px_-28px_rgba(76,33,64,.7)]' : 'border-[#efdcd0] bg-white text-[#33252b]'}`}>
              {featured && <span className="absolute end-6 top-6 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em]">{pricing.featured}</span>}
              <h3 className="text-lg font-bold">{plan.name}</h3><p className={`mt-2 min-h-11 text-sm leading-6 ${featured ? 'text-[#ffe3d7]' : 'text-[#7c717c]'}`}>{pricing.details[index]}</p>
              <p className="font-editorial mt-6 text-5xl leading-none">{new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(plan.price)}<span className={`ms-1 text-sm font-sans font-medium ${featured ? 'text-[#e2cddd]' : 'text-[#8b818b]'}`}>/ {pricing.monthly}</span></p>
              <p className={`mt-3 text-sm font-bold ${featured ? 'text-[#ffe1d5]' : 'text-[#c25334]'}`}>{new Intl.NumberFormat(locale).format(plan.pagesPerMonth)} {pricing.pagesMonthly}</p>
              <div className={`my-7 h-px ${featured ? 'bg-white/20' : 'bg-[#f0dfd5]'}`} />
              <ul className="flex-1 space-y-3">{[[plan.maxPagesPerDocument, pricing.pagesDocument], [plan.maxFlashcardsPerGen, pricing.flashcards], [plan.maxQuizQuestions, pricing.quizQuestions]].map(([limit, label]) => <li key={label} className={`flex gap-2.5 text-sm ${featured ? 'text-[#fff0e8]' : 'text-[#635864]'}`}><CheckCircle2 className="size-4 shrink-0 text-current" />{limit} {label}</li>)}</ul>
              <Link href="/signup" className={`mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold ${featured ? 'bg-white text-[#b84432] hover:bg-[#ffebe1]' : 'border border-[#e7cec0] text-[#b84432] hover:bg-[#ffebe1]'}`}>{pricing.start}<ArrowRight className="size-4" /></Link>
            </article>
          })}</div>
          <p className="mt-7 max-w-4xl text-sm leading-6 text-[#817681]">{content.disclaimer}</p>
        </div>
      </section>

      <section className="border-t border-[#f0dfd5] px-5 py-24 sm:px-8" aria-labelledby="faq-title">
        <div className="mx-auto max-w-6xl">
          <h2 id="faq-title" className={`${displayClass} text-4xl leading-tight sm:text-5xl`}>{content.faqTitle}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">{content.faqs.map(faq => <article key={faq.question} className="rounded-[1.3rem] border border-[#ebe2e9] bg-white p-6"><h3 className="font-bold text-[#3d303d]">{faq.question}</h3><p className="mt-3 text-sm leading-7 text-[#756a76]">{faq.answer}</p></article>)}</div>
          <p className="mt-8 text-sm leading-6 text-[#807581]">{content.disclaimer}</p>
        </div>
      </section>
      <footer className="border-t border-[#f0dfd5] bg-white px-5 py-9 text-sm text-[#807581] sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5"><span dir="ltr" className="font-editorial text-2xl text-[#3d2b3b]">CramDesk<span className="text-[#d05a39]">.</span></span><p>© {new Date().getFullYear()} CramDesk</p><div className="flex gap-5"><Link href="/privacy" className="hover:text-[#b84432]">Privacy</Link><Link href="/terms" className="hover:text-[#b84432]">Terms</Link><Link href="/contact" className="hover:text-[#b84432]">Contact</Link></div></div>
      </footer>
      </main>
    </>
  )
}
