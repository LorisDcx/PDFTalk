import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Download, FileText, Layers, RotateCcw, Shuffle, Sparkles } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'AI Flashcards Generator for Studying Faster | CramDesk',
  description: 'Create study flashcards from readable course PDFs. Review key concepts, practise active recall and export your cards.',
  keywords: ['AI flashcards', 'flashcard generator', 'study flashcards', 'PDF to flashcards', 'automatic flashcards', 'active recall'],
  alternates: { canonical: '/flashcards-landing' },
  openGraph: {
    title: 'AI Flashcards Generator for Studying Faster | CramDesk',
    description: 'Create study flashcards from readable course PDFs.',
    url: 'https://cramdesk.com/flashcards-landing',
  },
}

const faqItems = [
  {
    question: 'How does the AI flashcard generator work?',
    answer: 'Upload a PDF with selectable text, open the processed document, and generate question-and-answer cards based on its extracted content.',
  },
  {
    question: 'How many flashcards can I generate?',
    answer: 'The Starter, Student, and Graduate plans allow up to 50, 100, and 200 cards per generation respectively, subject to your page allowance.',
  },
  {
    question: 'Can I export or edit my flashcards?',
    answer: 'You can export a set as CSV and edit it in a spreadsheet or another compatible study tool. In-place editing of generated cards is not currently available.',
  },
  {
    question: 'Will scanned PDFs work?',
    answer: 'The PDF needs selectable text. Image-only scans may not be readable. Check generated cards against the source before relying on them.',
  },
]

export default function FlashcardsPage() {
  return (
    <>
      <WebPageJsonLd title="AI Flashcards Generator for Studying Faster" description="Create study flashcards from readable course PDFs." url="https://cramdesk.com/flashcards-landing" />
      <FAQJsonLd faqs={faqItems} />
      <FeaturePageShell locale="en">
        <FeatureHero
          eyebrow="PDF to flashcards"
          icon={Layers}
          title={<>Make room for <span className="italic text-[#c25334]">active recall.</span></>}
          description="Turn the key ideas in a readable course PDF into question-and-answer cards. Flip through a set, check your answers, and practise again at your own pace."
          primaryAction={{ label: 'Create my flashcards', href: '/signup' }}
          secondaryAction={{ label: 'See the study flow', href: '#study-flow' }}
          note="7-day trial · No payment card required · Export as CSV"
          preview={<div className="relative min-h-[435px] rounded-[1.8rem] border border-[#dfd0de] bg-[#f7e8f2] p-5 shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)] sm:p-7">
            <div aria-hidden="true" className="absolute inset-x-10 top-10 h-[76%] rotate-[-6deg] rounded-[1.5rem] border border-[#e9dce7] bg-[#fdf9fb] shadow-lg" />
            <div aria-hidden="true" className="absolute inset-x-9 top-8 h-[78%] rotate-[4deg] rounded-[1.5rem] border border-[#e5d6e2] bg-[#fffdf9] shadow-lg" />
            <div className="relative flex min-h-[365px] flex-col rounded-[1.45rem] border border-[#e4dbe2] bg-white p-6 shadow-xl sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.13em] text-[#926787]"><Layers className="size-4" aria-hidden="true" /> Biology</span>
                <span className="rounded-full bg-[#ffe5d5] px-3 py-1 text-[11px] font-semibold text-[#af4a34]">Example card</span>
              </div>
              <div className="flex flex-1 flex-col justify-center py-10 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[.23em] text-[#a77f9c]">Question</p>
                <h2 className="font-editorial mx-auto mt-4 max-w-sm text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.14] tracking-[-.035em]">What does the cell membrane control?</h2>
                <div className="mx-auto mt-6 h-px w-20 bg-[#d7bfce]" />
                <p className="mt-5 text-[10px] font-bold uppercase tracking-[.23em] text-[#a77f9c]">Answer</p>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#675a67]">The exchange of substances between a cell and its environment.</p>
              </div>
              <div className="flex items-center justify-between border-t border-[#f3e3da] pt-5 text-xs font-semibold text-[#8f7788]"><span>03 / 20</span><span className="inline-flex items-center gap-1.5 text-[#ae4731]"><RotateCcw className="size-3.5" aria-hidden="true" /> Review again</span></div>
            </div>
          </div>}
        />

        <section id="study-flow" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="From PDF to practice" title={<>Make a set, <span className="italic text-[#c25334]">then use it.</span></>} description="The cards give you questions to answer from memory. Check each one against the original course when precision matters." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <FeatureCard icon={FileText} index="01" title="Upload a readable PDF">Choose course notes or an article saved as a PDF with selectable text.</FeatureCard>
              <FeatureCard icon={Sparkles} index="02" title="Generate a card set">CramDesk creates questions and concise answers from the extracted document text.</FeatureCard>
              <FeatureCard icon={RotateCcw} index="03" title="Practise recall">Reveal an answer, mark how it went, and return to cards that need more work.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <FeatureSectionHeading eyebrow="Study your way" title={<>A card set you can <span className="italic text-[#c25334]">keep using.</span></>} description="Review in the browser, change the order to avoid memorising a sequence, or take the set into a compatible tool as CSV." />
              <Link href="/quiz" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#ae4731] underline decoration-[#e5b9a4] underline-offset-4 hover:text-[#963326]">Explore practice quizzes<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">With a flashcard set</p>
              {[
                { icon: CheckCircle2, title: 'Mark your confidence', detail: 'Track which cards felt easy or difficult in study mode.' },
                { icon: Shuffle, title: 'Shuffle and restart', detail: 'Change the order and go through the set again.' },
                { icon: Download, title: 'Export as CSV', detail: 'Take question-and-answer pairs into a compatible study app.' },
              ].map(({ icon: Icon, title, detail }) => <div key={title} className="flex gap-4 border-t border-[#f3e3da] py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe5d5] text-[#c25334]"><Icon className="size-4" aria-hidden="true" /></span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#796e79]">{detail}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <FeatureFaq items={faqItems} eyebrow="Good to know" title="Frequently asked questions" />
        <FeatureCta eyebrow="Ready to remember more?" title={<>Turn your next PDF into <span className="italic text-[#ffcfad]">questions worth answering.</span></>} description="Generate a card set from a readable course PDF and start practising active recall." action={{ label: 'Try CramDesk free', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
