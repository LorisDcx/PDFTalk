import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Layers3 } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { FreeFlashcards } from '@/components/free-flashcards'

export const metadata: Metadata = {
  title: 'Free Flashcards Online, No Sign-Up | CramDesk',
  description: 'Create free flashcards, practice active recall, and export your deck. No account needed. Your cards stay in your browser.',
  keywords: ['free flashcards', 'flashcard maker', 'flashcards without signup', 'online flashcards', 'active recall'],
  alternates: { canonical: '/en/free-flashcards', languages: { fr: '/flashcards-gratuites', en: '/en/free-flashcards' } },
  openGraph: { title: 'Free Flashcards Online, No Sign-Up | CramDesk', description: 'Create, study, and export flashcards in your browser.', url: 'https://cramdesk.com/en/free-flashcards', locale: 'en_US' },
}

const faqs = [
  { question: 'Are these flashcards really free?', answer: 'Yes. Create up to 40 cards per deck, study them, and export your deck without an account or payment card. Automatic cards from a PDF are available separately in the CramDesk studio.' },
  { question: 'Where are my cards saved?', answer: 'In this browser’s local storage. They are not sent to CramDesk. Export your deck to keep a backup or use it on another device.' },
  { question: 'How does the study session work?', answer: 'Read the question and try to answer from memory before revealing the answer. Cards marked “Review again” come back later in the session.' },
]

export default function EnglishFreeFlashcardsPage() {
  return <>
    <WebPageJsonLd title="Free flashcards online, no sign-up" description="Create and study free flashcards in your browser." url="https://cramdesk.com/en/free-flashcards" />
    <FAQJsonLd faqs={faqs} />
    <FeaturePageShell locale="en">
      <section className="relative overflow-hidden px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24"><div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-[#ffe9da] opacity-75 blur-[110px]" /><div className="relative mx-auto max-w-4xl"><p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f1cfbd] bg-[#fff0e6] px-4 py-2 text-xs font-bold text-[#b84432]"><Layers3 className="size-4" aria-hidden="true" />Free tool · No sign-up</p><h1 className="font-editorial text-[clamp(3.25rem,7vw,7rem)] leading-[1.02] tracking-[-.055em] text-[#33252b]">Make a card. <span className="italic text-[#c25334]">Recall the answer.</span></h1><p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#74696a] sm:text-xl">Write your own questions and answers, then test yourself without peeking. Cards you miss return later in the session.</p><Link href="#outil" className="mt-9 inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#b84432] px-7 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(161,52,38,.7)] transition hover:bg-[#973326]">Create free flashcards <ArrowRight className="size-4" aria-hidden="true" /></Link><p className="mt-5 text-xs text-[#8f7e7c]">Free, no account, and no card data sent to a server.</p></div></section>
      <FreeFlashcards locale="en" />
      <section className="border-t border-[#f0dfd5] bg-[#fff4ed] px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Study better</p><h2 className="font-editorial mt-4 max-w-3xl text-4xl leading-tight text-[#33252b] sm:text-5xl">A useful card makes you think.</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{[{ title: 'One idea per card', text: 'A focused question is easier to retrieve from memory than a whole paragraph.' }, { title: 'Answer hidden', text: 'Try to answer before flipping: active recall shows what you really know.' }, { title: 'Repeat the hard ones', text: 'Cards marked “Review again” return until you can recall them.' }].map(item => <article key={item.title} className="rounded-[1.4rem] border border-[#efdcd0] bg-white p-6"><h3 className="font-editorial text-2xl text-[#33252b]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#756a69]">{item.text}</p></article>)}</div></div></section>
      <section className="px-5 py-20 sm:px-8"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Frequently asked questions</p><h2 className="font-editorial mt-4 text-4xl text-[#33252b] sm:text-5xl">Before you start.</h2><div className="mt-8 space-y-3">{faqs.map(faq => <details key={faq.question} className="group rounded-[1.2rem] border border-[#efdcd0] bg-white p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#403234] marker:hidden">{faq.question}<span className="text-2xl font-light text-[#b84432] transition group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-[#786b6b]">{faq.answer}</p></details>)}</div></div></section>
    </FeaturePageShell>
  </>
}
