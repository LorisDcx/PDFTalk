import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileText, MessageCircle, MessageSquare, Search, Send, Sparkles } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'Chat with PDF – Summarize & Ask Questions | CramDesk',
  description: 'Upload a readable course PDF, review a structured summary and ask questions about its extracted text.',
  keywords: ['chat with PDF', 'PDF AI', 'PDF summarizer', 'ask PDF questions', 'document AI', 'PDF analysis'],
  alternates: { canonical: '/pdf' },
  openGraph: {
    title: 'Chat with PDF – Summarize & Ask Questions | CramDesk',
    description: 'Ask questions about a readable course PDF.',
    url: 'https://cramdesk.com/pdf',
  },
}

const faqItems = [
  {
    question: 'How does Chat with PDF work?',
    answer: 'Upload a PDF with selectable text, open the processed document, and ask a question in everyday language. CramDesk uses text extracted from your document to compose an answer.',
  },
  {
    question: 'Can I use a scanned PDF?',
    answer: 'The PDF needs selectable text. An image-only scan may not contain enough readable content for analysis or chat.',
  },
  {
    question: 'Can I trust every answer?',
    answer: 'No. AI can overlook a passage or answer incorrectly, even when it uses the extracted document. Check important claims against the original PDF.',
  },
  {
    question: 'Is there a page limit?',
    answer: 'Paid plans allow up to 100, 200, or 500 pages per PDF, depending on the plan. Monthly page allowances also apply.',
  },
]

export default function PDFPage() {
  return (
    <>
      <WebPageJsonLd title="Chat with PDF – Summarize & Ask Questions" description="Ask questions about a readable course PDF." url="https://cramdesk.com/pdf" />
      <FAQJsonLd faqs={faqItems} />
      <FeaturePageShell locale="en">
        <FeatureHero
          eyebrow="Chat with your PDF"
          icon={MessageSquare}
          title={<>A question about your PDF? <span className="italic text-[#c25334]">Start with the source.</span></>}
          description="Upload a readable course PDF, get an overview, and ask about the concepts that need another explanation. Your document stays at the centre of the conversation."
          primaryAction={{ label: 'Ask my first question', href: '/signup' }}
          secondaryAction={{ label: 'See how it works', href: '#how-it-works' }}
          note="7-day trial · No payment card required · Selectable-text PDFs"
          preview={<div className="rotate-[1deg] overflow-hidden rounded-[1.8rem] border border-[#edd9ce] bg-white shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#f0dfd5] bg-[#fffdf9] px-5 py-4 sm:px-6">
              <span className="inline-flex min-w-0 items-center gap-2 truncate text-sm font-bold"><FileText className="size-4 shrink-0 text-[#bc6b50]" aria-hidden="true" /> Cell biology.pdf</span>
              <span className="shrink-0 rounded-full bg-[#eef4e9] px-3 py-1 text-[11px] font-semibold text-[#5a805e]">Example</span>
            </div>
            <div className="space-y-5 p-5 sm:p-7">
              <div className="rounded-2xl border border-[#eee7eb] bg-[#fbf7f9] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#98748f]">From the document</p>
                <p className="mt-2 font-editorial text-xl leading-snug text-[#423244]">The cell membrane regulates exchanges between the cell and its environment.</p>
              </div>
              <div className="ms-7 rounded-2xl rounded-tr-sm bg-[#6b3f60] px-5 py-4 text-sm leading-6 text-white">What does the membrane actually do?</div>
              <div className="me-7 rounded-2xl rounded-tl-sm border border-[#e9e3e7] bg-[#fffdf9] px-5 py-4 text-sm leading-6 text-[#514653]">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#78496a]"><Sparkles className="size-3.5" aria-hidden="true" /> CramDesk</div>
                It acts as a selective boundary: some substances can pass through, while others need transport proteins.
              </div>
              <div className="flex items-center justify-between rounded-full border border-[#ead9cf] bg-white px-5 py-3 text-xs text-[#9b9099]">Ask about this document <Send className="size-3.5 text-[#bc6b50]" aria-hidden="true" /></div>
              <p className="text-[11px] leading-5 text-[#978b96]">Illustrative answer. Always verify details in your PDF.</p>
            </div>
          </div>}
        />

        <section id="how-it-works" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="A clearer reading flow" title={<>Read, ask, <span className="italic text-[#c25334]">understand.</span></>} description="Use the generated overview to orient yourself, then ask focused questions about the parts that remain unclear." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <FeatureCard icon={FileText} index="01" title="Add a readable PDF">Upload a course document whose text can be selected. CramDesk extracts the text before analysis.</FeatureCard>
              <FeatureCard icon={MessageCircle} index="02" title="Ask a specific question">Ask for a definition, explanation, or comparison grounded in the extracted document.</FeatureCard>
              <FeatureCard icon={Search} index="03" title="Check the original">Return to the PDF for exact wording, diagrams, numbers, and any nuance that matters.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <FeatureSectionHeading eyebrow="Keep learning" title={<>An answer is useful when it leads to <span className="italic text-[#c25334]">better questions.</span></>} description="Work through your material one concept at a time. A conversation can clarify a passage before you turn it into notes or a practice question." />
              <Link href="/resume" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#ae4731] underline decoration-[#e5b9a4] underline-offset-4 hover:text-[#963326]">Explore PDF summaries<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">In your study workspace</p>
              {[
                ['Start with a summary', 'Find the main ideas before going deep.'],
                ['Ask what is unclear', 'Try a focused question about a term or relationship.'],
                ['Verify the source', 'Use the PDF as the final reference.'],
              ].map(([title, detail]) => <div key={title} className="flex gap-4 border-t border-[#f3e3da] py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe5d5] text-[#c25334]"><CheckCircle2 className="size-4" aria-hidden="true" /></span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#796e79]">{detail}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <FeatureFaq items={faqItems} eyebrow="Good to know" title="Frequently asked questions" />
        <FeatureCta eyebrow="Ready to understand more?" title={<>Make your next PDF <span className="italic text-[#ffcfad]">a conversation starter.</span></>} description="Upload a readable course PDF, review the overview, and ask your first question." action={{ label: 'Try CramDesk free', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
