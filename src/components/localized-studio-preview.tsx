'use client'

import { useState } from 'react'
import { ArrowRight, BookOpenText, CheckCircle2, FileQuestion, FileText, Layers3 } from 'lucide-react'
import { landingExperienceCopy } from '@/lib/landing-experience-locales'
import type { SeoLocale } from '@/lib/seo-locales'

type Tab = 'summary' | 'flashcards' | 'quiz'

export function LocalizedStudioPreview({ locale }: { locale: SeoLocale }) {
  const c = landingExperienceCopy[locale].studio
  const [tab, setTab] = useState<Tab>('summary')
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizChoice, setQuizChoice] = useState<number | null>(null)
  const tabs = [
    { id: 'summary' as const, label: c.tabs[0], icon: BookOpenText },
    { id: 'flashcards' as const, label: c.tabs[1], icon: Layers3 },
    { id: 'quiz' as const, label: c.tabs[2], icon: FileQuestion },
  ]

  return <div id="studio" className="relative mx-auto max-w-6xl scroll-mt-28">
    <div className="overflow-hidden rounded-[1.4rem] border border-[#ddc9bd] bg-white shadow-[0_18px_50px_-40px_rgba(59,34,56,.36)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee8ed] bg-[#fffdf9] px-5 py-4 sm:px-7">
        <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-2xl bg-[#ffe0d1] text-[#b84432]"><FileText className="size-5" /></span><div><p className="text-sm font-bold text-[#2b2430]">{c.file}</p><p className="text-xs text-[#837a84]">{c.ready}</p></div></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-[#e5eedf] bg-[#f3f8ee] px-3 py-1.5 text-xs font-semibold text-[#456d43]"><span className="size-1.5 rounded-full bg-[#6a9a64]" />{c.demo}</span>
      </div>
      <div className="grid md:grid-cols-[190px_1fr]">
        <aside className="hidden border-e border-[#eee8ed] bg-[#fcf9fb] p-5 md:block">
          <p className="mb-6 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#a095a1]">{c.workspace}</p>
          <p className="rounded-xl bg-[#ead9e5] px-3 py-3 text-sm font-bold text-[#653657]"><BookOpenText className="me-2 inline size-4" />{c.documents}</p>
          <p className="mt-6 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#a095a1]">{c.study}</p>
          <div className="mt-3 space-y-2"><p className="px-3 py-2 text-sm text-[#796e7b]"><Layers3 className="me-2 inline size-4" />{c.cards}</p><p className="px-3 py-2 text-sm text-[#796e7b]"><FileQuestion className="me-2 inline size-4" />{c.tabs[2]}</p></div>
        </aside>
        <div className="min-w-0 p-5 sm:p-8">
          <div className="mb-7 flex flex-col justify-between gap-5 border-b border-[#eee8ed] pb-6 sm:flex-row sm:items-end">
            <div><p className="mb-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#8e6282]">{c.chapter}</p><h3 className="font-editorial text-3xl leading-tight text-[#33252b] sm:text-4xl">{c.topic}</h3></div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={c.demo}>{tabs.map(item => <button key={item.id} type="button" aria-pressed={tab === item.id} onClick={() => setTab(item.id)} className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 ${tab === item.id ? 'bg-[#b84432] text-white shadow-sm' : 'bg-[#f7f3f6] text-[#6f6470] hover:bg-[#ece3ea]'}`}><item.icon className="size-3.5" />{item.label}</button>)}</div>
          </div>
          {tab === 'summary' && <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr]">
            <div><p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">{c.summaryLabel}</p><p className="max-w-lg text-base leading-8 text-[#4e4550]">{c.summary}</p><div className="mt-6 space-y-3">{c.keyIdeas.map(item => <p key={item} className="flex gap-3 rounded-xl bg-[#faf7f9] p-3 text-sm leading-6 text-[#5b505d]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#718e65]" />{item}</p>)}</div></div>
            <div className="rounded-[1.2rem] border border-[#e9e3e8] bg-[#fcfaf9] p-5"><div className="mb-5 flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#a18d9d]">{c.sourceLabel}</span><FileText className="size-4 text-[#9d8799]" /></div><p className="border-s-2 border-[#c25334] ps-4 text-sm leading-7 text-[#554b52]">{c.source}</p><p className="mt-6 text-xs leading-5 text-[#857b85]">{c.sourceNote}</p></div>
          </div>}
          {tab === 'flashcards' && <div className="mx-auto max-w-2xl py-2 text-center"><p className="mb-4 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">{c.cardLabel}</p><div className="flex min-h-44 flex-col items-center justify-center rounded-[1.4rem] border border-[#e9dae5] bg-[#fbf4f8] px-6 py-8"><p className="font-editorial text-2xl leading-snug text-[#352837] sm:text-3xl">{showAnswer ? c.cardAnswer : c.cardQuestion}</p></div><button type="button" onClick={() => setShowAnswer(value => !value)} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#b84432] px-5 py-3 text-sm font-bold text-white hover:bg-[#963326]">{showAnswer ? c.hide : c.reveal}<ArrowRight className="size-4" /></button></div>}
          {tab === 'quiz' && <div className="mx-auto max-w-2xl py-1"><p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">{c.quizLabel}</p><h4 className="font-editorial text-2xl leading-snug text-[#352837] sm:text-3xl">{c.quizQuestion}</h4><div className="mt-5 grid gap-2.5">{c.quizAnswers.map((answer, index) => <button key={answer} type="button" aria-pressed={quizChoice === index} onClick={() => setQuizChoice(index)} className={`flex min-h-11 items-center gap-3 rounded-xl border px-4 py-3 text-start text-sm font-medium transition ${quizChoice === index ? index === 0 ? 'border-[#8baa80] bg-[#f1f7ee] text-[#3d663d]' : 'border-[#d9a8ba] bg-[#fcf1f5] text-[#754157]' : 'border-[#e9e2e7] bg-white text-[#544b55] hover:border-[#b89caf]'}`}><span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-xs" dir="ltr">{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div>{quizChoice !== null && <p role="status" className="mt-3 text-sm text-[#6a5f6b]">{quizChoice === 0 ? c.correct : c.incorrect}</p>}</div>}
        </div>
      </div>
    </div>
  </div>
}
