'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, FileText, Layers3, Sparkles } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { localizedLandings } from '@/lib/seo-locales'
import { getAuthCopy } from './auth-copy'

export function AuthFrame({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const copy = getAuthCopy(language)
  const backLabel = language === 'fr' ? 'Retour au site' : localizedLandings[language]?.home ?? 'Back to site'

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fdfaf6] text-[#28212c]">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-28 size-[38rem] rounded-full bg-[#ffe0ce]/45 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-48 bottom-[-16rem] size-[42rem] rounded-full bg-[#e8eee6]/65 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1440px] flex-col px-5 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 border-b border-[#eadfe4] py-5 sm:py-6">
          <Link href="/" className="group inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-4" aria-label="CramDesk — accueil">
            <Image src="/logo.png" width={44} height={44} alt="" className="size-11 rounded-[15px] shadow-[0_8px_20px_-9px_rgba(160,62,37,.45)] transition-transform group-hover:-rotate-6" />
            <span className="font-editorial text-[1.75rem] leading-none tracking-[-.035em]">CramDesk<span className="text-[#d05a39]">.</span></span>
          </Link>
          <Link href="/" aria-label={backLabel} className="inline-flex items-center gap-1.5 rounded-full border border-[#efdacf] bg-white/70 px-4 py-2 text-xs font-semibold text-[#754f42] transition hover:border-[#d9aa93] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] sm:text-sm">
            <span className="hidden sm:inline">{backLabel}</span>
            <ArrowRight className="size-4 -rotate-45" aria-hidden="true" />
          </Link>
        </header>

        <main className="grid flex-1 items-center gap-8 py-9 sm:py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,490px)] lg:gap-12 xl:gap-24 xl:py-16">
          <section className="hidden lg:block lg:self-center" aria-labelledby="auth-story-title">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f4d4c4] bg-[#fff0e6] px-4 py-2 text-[11px] font-bold uppercase tracking-[.16em] text-[#b84432]">
              <Sparkles className="size-3.5" aria-hidden="true" />{copy.eyebrow}
            </div>
            <h1 id="auth-story-title" className="font-editorial mt-5 max-w-[780px] text-[clamp(2.8rem,5.3vw,6rem)] leading-[1.02] tracking-[-.055em] sm:mt-7">
              {copy.headline}<br className="hidden sm:block" />{' '}
              <em className="font-editorial font-normal text-[#ae4731]">{copy.headlineAccent}</em>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#776d76] sm:text-base sm:leading-8 lg:mt-7">{copy.introduction}</p>

            <ul className="mt-8 hidden flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#584953] sm:flex lg:mt-9">
              {[copy.benefitOne, copy.benefitTwo, copy.benefitThree].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#e7f1e8] text-[#367f5d]"><Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" /></span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="relative mt-10 hidden max-w-[690px] rounded-[2rem] border border-white/60 bg-[#ffe3d4] p-4 shadow-[0_28px_70px_-42px_rgba(71,40,65,.4)] lg:block xl:mt-12" aria-label={copy.previewTitle}>
              <div aria-hidden="true" className="absolute -right-4 -top-5 flex size-14 rotate-12 items-center justify-center rounded-2xl border border-white bg-[#ebf3e9] text-[#3a805d] shadow-lg"><Sparkles className="size-6" /></div>
              <div className="rounded-[1.45rem] border border-[#ede7e5] bg-[#fffdf9] p-5">
                <div className="flex items-center justify-between gap-3 border-b border-[#eee7e6] pb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[#ffe9df] text-[#ae4731]"><Layers3 className="size-4" aria-hidden="true" /></span>
                    <span className="text-sm font-bold text-[#342832]">{copy.previewTitle}</span>
                  </div>
                  <div aria-hidden="true" className="flex gap-1.5"><i className="size-2 rounded-full bg-[#efd4c5]" /><i className="size-2 rounded-full bg-[#e7e9d9]" /><i className="size-2 rounded-full bg-[#f2e0d4]" /></div>
                </div>
                <div className="grid gap-3 pt-4 sm:grid-cols-[1.1fr_.9fr]">
                  <div className="rounded-2xl border border-[#eee8e8] bg-[#faf7f5] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-[#f2d8c8] text-[#ae4731]"><FileText className="size-5" aria-hidden="true" /></span>
                      <div className="min-w-0"><p className="truncate text-xs font-bold text-[#4b3444]">{copy.previewSource}</p><span className="text-[10px] font-semibold uppercase tracking-wider text-[#a58a9a]">PDF</span></div>
                    </div>
                    <div aria-hidden="true" className="mt-5 space-y-2"><div className="h-2 w-4/5 rounded-full bg-[#e3d6dc]" /><div className="h-2 w-full rounded-full bg-[#eae2e4]" /><div className="h-2 w-3/5 rounded-full bg-[#eae2e4]" /></div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-1 items-center justify-between rounded-2xl border border-[#dfebde] bg-[#eef5e9] px-4 py-3 text-sm font-semibold text-[#466a50]"><span>{copy.previewResult}</span><Check className="size-4" aria-hidden="true" /></div>
                    <div className="flex flex-1 items-center justify-between rounded-2xl border border-[#f1d9cb] bg-[#fff0e6] px-4 py-3 text-sm font-semibold text-[#9f4f3b]"><span>{copy.previewPractice}</span><ArrowRight className="size-4" aria-hidden="true" /></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="w-full rounded-[1.75rem] border border-[#ece2e5] bg-white/95 p-6 shadow-[0_30px_80px_-42px_rgba(77,43,69,.37)] sm:mx-auto sm:max-w-[540px] sm:p-9 lg:max-w-none lg:p-10" aria-label="CramDesk account">
            {children}
          </section>
        </main>
        <footer className="hidden items-center justify-between gap-4 border-t border-[#eadfe4] py-5 text-xs text-[#9c8e99] sm:flex">
          <span>© {new Date().getFullYear()} CramDesk</span><span>{copy.noCard}</span>
        </footer>
      </div>
    </div>
  )
}
