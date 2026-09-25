import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { HtmlLanguage, LocalePreference } from '@/components/locale-preference'

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>
type Action = { label: string; href: string }

export function FeaturePageShell({ children, locale = 'fr', syncLocale = true }: { children: ReactNode; locale?: 'fr' | 'en'; syncLocale?: boolean }) {
  const english = locale === 'en'
  return <>
    {syncLocale ? <LocalePreference locale={locale} /> : <HtmlLanguage locale={locale} />}
    <Navbar />
    <main lang={locale} className="min-h-screen overflow-hidden bg-[#fffaf5] text-[#33252b]">{children}</main>
    <footer className="border-t border-[#f0dfd5] bg-white px-5 py-9 text-sm text-[#807581] sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5">
        <Link href={english ? '/en' : '/'} className="font-editorial text-2xl text-[#3d2b3b]">CramDesk<span className="text-[#d05a39]">.</span></Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label={english ? 'Footer navigation' : 'Navigation de pied de page'}>
          <Link href={english ? '/en' : '/'} className="hover:text-[#b84432]">{english ? 'Home' : 'Accueil'}</Link>
          <Link href="/privacy" className="hover:text-[#b84432]">{english ? 'Privacy' : 'Confidentialité'}</Link>
          <Link href="/terms" className="hover:text-[#b84432]">{english ? 'Terms' : 'Conditions'}</Link>
          <Link href="/contact" className="hover:text-[#b84432]">Contact</Link>
        </nav>
        <p>© {new Date().getFullYear()} CramDesk</p>
      </div>
    </footer>
  </>
}

export function FeatureHero({
  eyebrow, icon: IconComponent, title, description, primaryAction, secondaryAction, preview, note,
}: {
  eyebrow: string
  icon: Icon
  title: ReactNode
  description: string
  primaryAction: Action
  secondaryAction?: Action
  preview: ReactNode
  note?: string
}) {
  return (
    <section className="relative px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:pt-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-52 -top-52 size-[650px] rounded-full bg-[#ffe9da] opacity-80 blur-[110px]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_.95fr] lg:gap-16">
        <div>
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#ead8e6] bg-[#ffebe1] px-4 py-2 text-xs font-bold text-[#ae4731]">
            <IconComponent className="size-3.5" aria-hidden={true} />{eyebrow}
          </p>
          <h1 className="font-editorial max-w-[720px] text-[clamp(3.3rem,6vw,6.25rem)] leading-[.98] tracking-[-.06em]">{title}</h1>
          <p className="mt-7 max-w-xl text-base leading-8 text-[#6e6470] sm:text-lg">{description}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={primaryAction.href} className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#b84432] px-7 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(72,31,59,.7)] transition hover:-translate-y-0.5 hover:bg-[#963326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-2">
              {primaryAction.label}<ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            {secondaryAction && <Link href={secondaryAction.href} className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border border-[#e7d3c8] bg-white px-7 py-3.5 text-sm font-bold text-[#483648] transition hover:border-[#ae8fa4] hover:bg-[#fff4ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]">{secondaryAction.label}</Link>}
          </div>
          {note && <p className="mt-5 text-xs font-medium leading-5 text-[#8d828d]">{note}</p>}
        </div>
        <div className="relative">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[#f4dfed] via-[#f9eff2] to-[#e8e6ef] opacity-80 blur-2xl" />
          <div className="relative">{preview}</div>
        </div>
      </div>
    </section>
  )
}

export function FeatureSectionHeading({
  eyebrow, title, description, centered = false, id,
}: {
  eyebrow: string
  title: ReactNode
  description?: string
  centered?: boolean
  id?: string
}) {
  return (
    <div className={centered ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">{eyebrow}</p>
      <h2 id={id} className="font-editorial text-[clamp(2.3rem,4vw,4.25rem)] leading-[1.08] tracking-[-.045em]">{title}</h2>
      {description && <p className="mt-5 text-base leading-8 text-[#716673]">{description}</p>}
    </div>
  )
}

export function FeatureCard({ icon: IconComponent, title, children, index }: { icon: Icon; title: string; children: ReactNode; index?: string }) {
  return (
    <article className="rounded-[1.4rem] border border-[#ebe3e9] bg-white p-6 shadow-[0_12px_35px_-30px_rgba(58,32,55,.35)] sm:p-7">
      <div className="mb-7 flex items-center justify-between">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffe5d5] text-[#c25334]"><IconComponent className="size-5" aria-hidden={true} /></span>
        {index && <span className="font-editorial text-2xl text-[#c7b7c2]">{index}</span>}
      </div>
      <h3 className="text-lg font-bold text-[#332837]">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#756b76]">{children}</p>
    </article>
  )
}

export function FeatureFaq({ items, eyebrow = 'À savoir', title = 'Questions fréquentes' }: { items: ReadonlyArray<{ question: string; answer: string }>; eyebrow?: string; title?: ReactNode }) {
  return (
    <section aria-labelledby="feature-faq-title" className="px-5 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-4xl">
        <FeatureSectionHeading id="feature-faq-title" eyebrow={eyebrow} title={title} />
        <div className="mt-9 space-y-3">
          {items.map(item => (
            <details key={item.question} className="group rounded-[1.2rem] border border-[#e9e0e6] bg-white px-5 py-5 open:border-[#cdb6c6] sm:px-6">
              <summary className="cursor-pointer list-none pr-8 font-semibold text-[#342a35] marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">{item.question}<span aria-hidden="true" className="font-editorial text-2xl font-normal leading-none text-[#8c6680] group-open:rotate-45">+</span></span>
              </summary>
              <p className="mt-4 max-w-3xl border-t border-[#f0eaee] pt-4 text-sm leading-7 text-[#716673]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function FeatureCta({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description: string; action: Action }) {
  return (
    <section className="px-5 pb-20 sm:px-8 lg:pb-28">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-[#33252b] px-6 py-14 text-center text-white sm:px-10 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-32 size-72 rounded-full bg-[#8a5b7e]/30 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 -right-16 size-80 rounded-full bg-[#8a5b7e]/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[.23em] text-[#d8b6cf]">{eyebrow}</p>
          <h2 className="font-editorial mt-5 text-[clamp(2.6rem,5vw,4.5rem)] leading-[1.04] tracking-[-.04em]">{title}</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#d2c4d0]">{description}</p>
          <Link href={action.href} className="mt-8 inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#4b2d42] transition hover:-translate-y-0.5 hover:bg-[#f9eef5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#33252b]">
            {action.label}<ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
