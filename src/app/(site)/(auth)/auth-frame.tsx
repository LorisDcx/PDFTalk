'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Check, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { authBackLabels, authHomeHref, authLocaleFromSearch } from '@/lib/auth-navigation'
import { HtmlLanguage } from '@/components/locale-preference'
import { getAuthCopy } from './auth-copy'

const subscribeHydration = () => () => {}
const clientHydrated = () => true
const serverHydrated = () => false

export function AuthFrame({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useLanguage()
  const hydrated = useSyncExternalStore(subscribeHydration, clientHydrated, serverHydrated)
  const requestedLocale = hydrated ? authLocaleFromSearch(window.location.search) : null
  const copy = getAuthCopy(language)
  const home = authHomeHref(language)
  const backLabel = authBackLabels[language]

  useEffect(() => {
    const locale = authLocaleFromSearch(window.location.search)
    if (locale) {
      try { setLanguage(locale) } catch { /* The URL also works when preference storage is blocked. */ }
    }
  }, [setLanguage])

  // Never briefly offer a French return link while the original locale loads.
  if (!hydrated || (requestedLocale && requestedLocale !== language)) {
    return <main role="status" aria-label="CramDesk" aria-busy="true" className="flex min-h-dvh items-center justify-center bg-[var(--cd-paper)] text-[var(--cd-brand)]"><Loader2 className="size-6 animate-spin motion-reduce:animate-none" aria-hidden="true" /></main>
  }

  return (
    <div className="auth-shell min-h-dvh bg-[var(--cd-paper)] text-[var(--cd-ink)]" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <HtmlLanguage locale={language} />
      <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex min-h-14 shrink-0 items-center justify-between gap-2 border-b border-[var(--cd-line)] py-1">
          <Link href={home} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]" aria-label="CramDesk">
            <Image src="/flame-logo.png" width={40} height={40} alt="" className="size-9" />
            <span dir="ltr" className="font-editorial text-2xl leading-none tracking-[-.035em]">CramDesk<span className="text-[var(--cd-brand)]">.</span></span>
          </Link>
          <Link href={home} className="inline-flex min-h-11 items-center justify-center gap-1 rounded-xl px-2 text-sm font-semibold text-[var(--cd-brand)] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">
            <span>{backLabel}</span><ArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-6 py-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12">
          <section className="hidden lg:block" aria-labelledby="auth-story-title">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">{copy.eyebrow}</p>
            <h2 id="auth-story-title" className="font-editorial mt-4 max-w-xl text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.06] tracking-[-.045em]">
              {copy.headline}{' '}<em className="font-normal text-[var(--cd-brand)]">{copy.headlineAccent}</em>
            </h2>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--cd-muted)]">{copy.introduction}</p>
            <ul className="mt-6 grid gap-3 text-base text-[var(--cd-muted)]">
              {[copy.benefitOne, copy.benefitTwo, copy.benefitThree].map(item => (
                <li key={item} className="flex items-center gap-2"><Check className="size-4 shrink-0" aria-hidden="true" />{item}</li>
              ))}
            </ul>
          </section>

          <section className="auth-panel mx-auto w-full max-w-[480px] rounded-3xl border border-[var(--cd-line)] bg-[var(--cd-surface)] p-3 sm:p-6" aria-label="CramDesk">
            {children}
          </section>
        </main>
      </div>
    </div>
  )
}
