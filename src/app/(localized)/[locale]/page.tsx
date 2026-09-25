import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpenText, CheckCircle2, FileQuestion, FileText, Globe2, Layers3, Sparkles } from 'lucide-react'
import { LocalePreference } from '@/components/locale-preference'
import { FAQJsonLd } from '@/components/json-ld'
import { Navbar } from '@/components/navbar'
import { localizedLandings, SEO_LOCALES, languageAlternates, type SeoLocale } from '@/lib/seo-locales'

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

const studioLabels: Record<SeoLocale, string> = {
  en: 'See the studio', es: 'Ver el espacio', de: 'Studio ansehen',
  it: 'Scopri lo studio', pt: 'Ver o espaço', zh: '查看学习空间',
  ja: '学習スペースを見る', ar: 'استكشف مساحة الدراسة',
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!isSeoLocale(locale)) notFound()
  const content = localizedLandings[locale]
  const rtl = locale === 'ar'
  const displayClass = rtl ? 'font-semibold' : 'font-editorial'

  return (
    <main lang={locale} dir={rtl ? 'rtl' : 'ltr'} className="min-h-screen overflow-hidden bg-[#fffaf5] text-[#33252b]">
      <LocalePreference locale={locale} />
      <FAQJsonLd faqs={content.faqs} />
      {locale === 'en' ? <Navbar publicLocale="en" /> : <header className="border-b border-[#f0dfd5] bg-[#fffaf5]/95 px-5 sm:px-8">
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="inline-flex shrink-0 items-center gap-2.5" aria-label="CramDesk">
            <Image src="/logo.png" width={36} height={36} alt="" className="size-9 rounded-xl shadow-sm" />
            <span dir="ltr" className="font-editorial text-[1.65rem] leading-none tracking-[-.045em] text-[#33252b]">CramDesk<span className="text-[#d05a39]">.</span></span>
          </Link>
          <nav className="flex items-center gap-2 text-xs font-bold sm:gap-4 sm:text-sm" aria-label="Language and account">
            <details className="group relative">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-[#e7dce4] bg-white px-3 py-2 text-[#5f4d5b] marker:hidden sm:px-4"><Globe2 className="size-4" />{content.name}<span aria-hidden="true">⌄</span></summary>
              <div className="absolute end-0 z-30 mt-2 max-h-72 min-w-40 overflow-auto rounded-2xl border border-[#e7dce4] bg-white p-2 shadow-xl">
                <Link href="/" className="block rounded-xl px-3 py-2 hover:bg-[#fff0e6]">Français</Link>
                {SEO_LOCALES.map(item => <Link key={item} href={`/${item}`} lang={item} className="block rounded-xl px-3 py-2 hover:bg-[#fff0e6]">{localizedLandings[item].name}</Link>)}
              </div>
            </details>
            <Link href="/login" className="hidden text-[#635563] hover:text-[#b84432] sm:inline">{content.login}</Link>
            <Link href="/signup" className="hidden rounded-full bg-[#b84432] px-5 py-2.5 text-white hover:bg-[#963326] md:inline-flex">{content.start}</Link>
          </nav>
        </div>
      </header>}

      <section className="relative px-5 pb-24 pt-[4.25rem] text-center sm:px-8 sm:pt-24 lg:pb-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[580px] w-[800px] -translate-x-1/2 rounded-full bg-[#f8eef4] opacity-80 blur-[110px]" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8e6] bg-[#ffebe1] px-4 py-2 text-xs font-bold text-[#ae4731]"><Sparkles className="size-3.5" />{content.eyebrow}</p>
          <h1 className={`${displayClass} mx-auto max-w-4xl text-[clamp(3.2rem,7vw,7rem)] leading-[1.04] tracking-[-.05em]`}>{content.heading}</h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#6e6470] sm:text-xl">{content.intro}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup" className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-[#b84432] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(72,31,59,.7)] transition hover:-translate-y-0.5 hover:bg-[#963326] sm:w-auto">{content.start}<ArrowRight className="size-4" /></Link>
            <Link href="#studio" className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full border border-[#e7d3c8] bg-white px-7 py-3.5 text-sm font-bold text-[#483648] hover:border-[#ae8fa4] hover:bg-[#fff4ed] sm:w-auto">{studioLabels[locale]} <ArrowRight className="size-4" /></Link>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-xs leading-6 text-[#8d828d]">{content.pricingText}</p>
        </div>
        <div id="studio" className="relative mx-auto mt-20 max-w-5xl scroll-mt-24 rounded-[1.7rem] border border-[#edd9ce] bg-white text-start shadow-[0_36px_90px_-45px_rgba(59,34,56,.38)] sm:mt-24">
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

      <section id="how-it-works" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
        <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <p className="mb-5 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">01 → 03</p>
            <h2 className={`${displayClass} text-4xl leading-[1.08] tracking-[-.04em] sm:text-6xl`}>{content.stepsTitle}</h2>
            <ol className="mt-8 space-y-3">{content.steps.map((step, index) => <li key={step} className="flex gap-4 rounded-[1.2rem] border border-[#ebe2e9] bg-white p-5 text-sm leading-7 text-[#6a5e6b]"><span className="font-bold text-[#c25334]">0{index + 1}</span><span>{step}</span></li>)}</ol>
          </div>
          <div id="pricing" className="flex scroll-mt-24 flex-col justify-center rounded-[1.7rem] bg-[#b84432] p-8 text-white sm:p-10">
            <Sparkles className="size-7 text-[#eacfe1]" />
            <h2 className={`${displayClass} mt-7 text-3xl leading-tight sm:text-4xl`}>{content.pricingTitle}</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#f0d5ca]">{content.pricingText}</p>
            <Link href="/signup" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#b84432] hover:bg-[#ffebe1]">{content.start}<ArrowRight className="size-4" /></Link>
          </div>
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
  )
}
