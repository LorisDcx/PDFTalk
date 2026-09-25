import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BookOpenText, CheckCircle2, FileText, ListChecks, Search, Sparkles } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'AI Text Summarizer – Notes, PDFs & Articles | CramDesk',
  description: 'Summarize readable course PDFs with AI. Review a structured overview and check important facts in your original document.',
  keywords: ['AI summarizer', 'text summarizer', 'PDF summary', 'document summarizer', 'notes summary', 'article summarizer'],
  alternates: { canonical: '/resume' },
  openGraph: {
    title: 'AI Text Summarizer – Notes, PDFs & Articles | CramDesk',
    description: 'Summarize readable course PDFs with AI.',
    url: 'https://cramdesk.com/resume',
  },
}

const faqItems = [
  {
    question: 'How does the AI summarizer work?',
    answer: 'CramDesk extracts selectable text from an uploaded PDF and generates a structured overview. Very long documents may be shortened before analysis.',
  },
  {
    question: 'What is included in a summary?',
    answer: 'The document workspace includes a structured overview, key ideas, and a simpler explanation. The level of detail depends on the source document.',
  },
  {
    question: 'Can I summarize scanned pages?',
    answer: 'The PDF must contain selectable text. Image-only scans may not be readable because this workflow does not reliably extract text from images.',
  },
  {
    question: 'Are the summaries always accurate?',
    answer: 'No. AI-generated summaries can miss nuance or contain mistakes. Keep the original PDF nearby and verify important facts, examples, and figures.',
  },
]

export default function ResumePage() {
  return (
    <>
      <WebPageJsonLd title="AI Text Summarizer – Notes, PDFs & Articles" description="Summarize readable course PDFs with AI." url="https://cramdesk.com/resume" />
      <FAQJsonLd faqs={faqItems} />
      <FeaturePageShell locale="en">
        <FeatureHero
          eyebrow="AI PDF summarizer"
          icon={ListChecks}
          title={<>A long course PDF, <span className="italic text-[#c25334]">a clearer starting point.</span></>}
          description="Turn a readable PDF into a structured study overview. Find the main ideas quickly, then go back to the source whenever a detail matters."
          primaryAction={{ label: 'Summarize a PDF', href: '/signup' }}
          secondaryAction={{ label: 'See the method', href: '#method' }}
          note="7-day trial · No payment card required · Selectable-text PDFs"
          preview={<div className="-rotate-[1deg] overflow-hidden rounded-[1.8rem] border border-[#edd9ce] bg-white shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#f0dfd5] bg-[#fffdf9] px-5 py-4 sm:px-6">
              <span className="inline-flex items-center gap-2 text-sm font-bold"><BookOpenText className="size-4 text-[#bc6b50]" aria-hidden="true" /> Study summary</span>
              <span className="rounded-full bg-[#ffe5d5] px-3 py-1 text-[11px] font-semibold text-[#af4a34]">Example</span>
            </div>
            <div className="p-5 sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9d718f]">Biology · Cell structures</p>
              <h2 className="font-editorial mt-3 text-3xl leading-tight">The cell membrane</h2>
              <p className="mt-4 border-l-2 border-[#b08ba4] pl-4 text-sm leading-7 text-[#625765]">A selective boundary that separates the cell from its surroundings and helps control exchanges.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e4ebdf] bg-[#f2f6ee] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#64816b]">Key idea 01</p><p className="mt-2 text-sm font-semibold text-[#435b47]">Phospholipid bilayer</p></div>
                <div className="rounded-2xl border border-[#eadce7] bg-[#faf1f7] p-4"><p className="text-[10px] font-bold uppercase tracking-wider text-[#a07293]">Key idea 02</p><p className="mt-2 text-sm font-semibold text-[#674f63]">Selective transport</p></div>
              </div>
              <div className="mt-6 flex items-start gap-3 border-t border-[#f3e3da] pt-5 text-sm leading-6 text-[#756a76]"><Sparkles className="mt-0.5 size-4 shrink-0 text-[#9c6b8c]" aria-hidden="true" /> In simpler words: the membrane acts like a gate that lets some materials through.</div>
              <p className="mt-5 text-[11px] leading-5 text-[#978b96]">Illustrative summary. Verify details in your course PDF.</p>
            </div>
          </div>}
        />

        <section id="method" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="From document to overview" title={<>Find the thread, <span className="italic text-[#c25334]">then follow it.</span></>} description="A summary is a map of the source, not a replacement for reading the passages you need to know well." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <FeatureCard icon={FileText} index="01" title="Upload your course PDF">Choose a PDF with selectable text so CramDesk can extract its contents.</FeatureCard>
              <FeatureCard icon={ListChecks} index="02" title="Review the structure">Read the key points and simpler explanation to spot the main concepts.</FeatureCard>
              <FeatureCard icon={Search} index="03" title="Return to the details">Check examples, exact terms, and figures against your original document.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <FeatureSectionHeading eyebrow="Study with intent" title={<>A summary helps you decide <span className="italic text-[#c25334]">what to revisit.</span></>} description="Use the overview to name the concepts you understand, flag the ones you do not, and create a focused revision session." />
              <Link href="/flashcards-landing" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#ae4731] underline decoration-[#e5b9a4] underline-offset-4 hover:text-[#963326]">Explore PDF flashcards<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">A useful way to review</p>
              {[
                ['Read the overview', 'Get oriented before memorising details.'],
                ['Mark what is unclear', 'Keep a short list of concepts to revisit.'],
                ['Test your understanding', 'Turn the key ideas into flashcards or practice questions.'],
              ].map(([title, detail]) => <div key={title} className="flex gap-4 border-t border-[#f3e3da] py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe5d5] text-[#c25334]"><CheckCircle2 className="size-4" aria-hidden="true" /></span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#796e79]">{detail}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <FeatureFaq items={faqItems} eyebrow="Good to know" title="Frequently asked questions" />
        <FeatureCta eyebrow="Ready for a clearer view?" title={<>Start with a summary, <span className="italic text-[#ffcfad]">study with a plan.</span></>} description="Upload a readable PDF and use its overview to guide your next revision session." action={{ label: 'Try CramDesk free', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
