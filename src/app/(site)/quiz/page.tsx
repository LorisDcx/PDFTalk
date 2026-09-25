import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BarChart3, CheckCircle2, FileText, ListChecks, RotateCcw, Search, Target } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'AI Quiz Generator from PDF & Notes | CramDesk',
  description: 'Generate multiple-choice practice quizzes from readable course PDFs. Test your understanding and review the questions you missed.',
  keywords: ['AI quiz generator', 'quiz from PDF', 'automatic quiz', 'study quiz', 'MCQ generator', 'test generator'],
  alternates: { canonical: '/quiz' },
  openGraph: {
    title: 'AI Quiz Generator from PDF & Notes | CramDesk',
    description: 'Create multiple-choice practice quizzes from readable course PDFs.',
    url: 'https://cramdesk.com/quiz',
  },
}

const faqItems = [
  {
    question: 'How does the AI quiz generator work?',
    answer: 'Upload a PDF with selectable text, open the processed document, and generate multiple-choice questions based on its extracted content.',
  },
  {
    question: 'What type of questions will I get?',
    answer: 'CramDesk creates multiple-choice questions with four answer options. AI-generated questions and options can be imperfect, so check surprising answers against your course PDF.',
  },
  {
    question: 'How many questions can I generate?',
    answer: 'The Starter, Student, and Graduate plans allow up to 20, 50, and 100 questions per generation respectively, subject to your page allowance.',
  },
  {
    question: 'Can I review my results?',
    answer: 'Yes. A completed quiz shows your score and the questions answered incorrectly, so you can revisit the underlying concepts.',
  },
]

export default function QuizPage() {
  return (
    <>
      <WebPageJsonLd title="AI Quiz Generator from PDF & Notes" description="Create multiple-choice practice quizzes from readable course PDFs." url="https://cramdesk.com/quiz" />
      <FAQJsonLd faqs={faqItems} />
      <FeaturePageShell locale="en">
        <FeatureHero
          eyebrow="PDF practice quizzes"
          icon={Target}
          title={<>Reading is a start. <span className="italic text-[#c25334]">Test what stayed.</span></>}
          description="Turn a readable course PDF into multiple-choice practice questions. Find out what you remember and which ideas deserve another look."
          primaryAction={{ label: 'Create a practice quiz', href: '/signup' }}
          secondaryAction={{ label: 'See how it works', href: '#practice' }}
          note="7-day trial · No payment card required · Questions use your PDF text"
          preview={<div className="rotate-[1deg] overflow-hidden rounded-[1.8rem] border border-[#edd9ce] bg-white shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)]">
            <div className="flex items-center justify-between border-b border-[#f0dfd5] bg-[#fffdf9] px-5 py-4 sm:px-6">
              <span className="inline-flex items-center gap-2 text-sm font-bold"><Target className="size-4 text-[#bc6b50]" aria-hidden="true" /> Practice quiz</span>
              <span className="rounded-full bg-[#ffe5d5] px-3 py-1 text-[11px] font-semibold text-[#af4a34]">Example</span>
            </div>
            <div className="p-5 sm:p-7">
              <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[.14em] text-[#9c7792]"><span>Biology · Cell structure</span><span>01 / 10</span></div>
              <div aria-hidden="true" className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f0e6ec]"><div className="h-full w-[10%] rounded-full bg-[#8f6380]" /></div>
              <h2 className="font-editorial mt-7 text-[1.7rem] leading-tight sm:text-3xl">Which structure helps regulate what enters and leaves a cell?</h2>
              <div className="mt-6 space-y-2.5">
                {[
                  ['A', 'The nucleus', false],
                  ['B', 'The cell membrane', true],
                  ['C', 'The ribosome', false],
                  ['D', 'The cytoplasm', false],
                ].map(([letter, answer, correct]) => <div key={letter as string} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium ${correct ? 'border-[#c6ddc4] bg-[#f0f7ed] text-[#456c4b]' : 'border-[#f0dfd5] bg-[#fffdf9] text-[#675c68]'}`}>
                  <span className={`flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${correct ? 'bg-[#dcefd9]' : 'bg-[#f4edf1]'}`}>{letter}</span>{answer}{correct && <CheckCircle2 className="ms-auto size-4 shrink-0" aria-hidden="true" />}
                </div>)}
              </div>
              <p className="mt-5 text-[11px] leading-5 text-[#978b96]">Illustrative question. Review generated answers against the source.</p>
            </div>
          </div>}
        />

        <section id="practice" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="From reading to recall" title={<>Three steps to see <span className="italic text-[#c25334]">what you know.</span></>} description="Practice works best when you compare your answers with the course itself, especially where an AI question feels ambiguous." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <FeatureCard icon={FileText} index="01" title="Add your PDF">Upload a course document with selectable text and let CramDesk extract the content.</FeatureCard>
              <FeatureCard icon={ListChecks} index="02" title="Generate a quiz">Choose a question count within your plan and answer the multiple-choice questions.</FeatureCard>
              <FeatureCard icon={RotateCcw} index="03" title="Review the misses">Use your score and incorrect answers to decide what to read again.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <FeatureSectionHeading eyebrow="Useful feedback" title={<>A score is a signal, <span className="italic text-[#c25334]">not the finish line.</span></>} description="The useful part is discovering which ideas you can explain and which ones need another pass through your notes." />
              <Link href="/flashcards-landing" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#ae4731] underline decoration-[#e5b9a4] underline-offset-4 hover:text-[#963326]">Explore PDF flashcards<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">After a quiz</p>
              {[
                { icon: BarChart3, title: 'See your score', detail: 'Get a clear count of correct and incorrect answers.' },
                { icon: Search, title: 'Inspect an error', detail: 'Compare a missed answer with the original passage.' },
                { icon: RotateCcw, title: 'Try again', detail: 'Return to the concepts that still feel uncertain.' },
              ].map(({ icon: Icon, title, detail }) => <div key={title} className="flex gap-4 border-t border-[#f3e3da] py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe5d5] text-[#c25334]"><Icon className="size-4" aria-hidden="true" /></span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#796e79]">{detail}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <FeatureFaq items={faqItems} eyebrow="Good to know" title="Frequently asked questions" />
        <FeatureCta eyebrow="Ready to practise?" title={<>See what stuck. <span className="italic text-[#ffcfad]">Know what to revisit.</span></>} description="Make a quiz from a readable course PDF and put your understanding to the test." action={{ label: 'Try CramDesk free', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
