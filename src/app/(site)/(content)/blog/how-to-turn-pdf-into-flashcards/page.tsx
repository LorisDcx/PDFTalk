import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles, Star, ShieldCheck, Clock3, ListChecks, Flame, BookOpen } from 'lucide-react'
import { ArticleJsonLd, FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'How to turn a readable PDF into flashcards | CramDesk',
  description: 'A practical guide to making flashcards and quizzes from a PDF with selectable text, including how to check AI-generated cards against the source.',
  keywords: ['pdf to flashcards', 'ai flashcards', 'convert pdf to quiz', 'study faster pdf', 'cramdesk guide'],
  openGraph: {
    title: 'How to turn a PDF into flashcards in minutes',
    description: 'Learn how to turn a readable PDF into flashcards and quizzes, then verify each card against your course.',
    url: 'https://www.cramdesk.com/blog/how-to-turn-pdf-into-flashcards',
  },
  alternates: {
    canonical: 'https://www.cramdesk.com/blog/how-to-turn-pdf-into-flashcards',
  },
}

const faqs = [
  {
    question: 'Can I use any PDF format?',
    answer: 'Use a PDF with selectable text. Image-only scans need OCR before CramDesk can analyze their contents.',
  },
  {
    question: 'Do I need to clean the PDF first?',
    answer: 'If the PDF is readable (not scanned), no. For scans, use OCR first to improve accuracy.',
  },
  {
    question: 'Can I export the flashcards?',
    answer: 'You can study in-app, replay quizzes, and export CSV if needed.',
  },
]

const steps = [
  {
    title: 'Upload your PDF',
    desc: 'Choose a PDF with selectable text. Check the extracted content carefully if your course has columns or tables.',
  },
  {
    title: 'Generate flashcards & quizzes',
    desc: 'AI extracts key terms, definitions, and creates recall questions automatically.',
  },
  {
    title: 'Review & iterate',
    desc: 'Review the generated answers against your course, replay a quiz, and export your cards as CSV if needed.',
  },
]

const tips = [
  'Chunk large PDFs by chapter to stay focused and get faster results.',
  'Check each generated answer against the quoted passage from the PDF.',
  'Use quiz mode to find concepts you need to review again.',
]

export default function HowToPdfFlashcardsPage() {
  return (
    <>
      <WebPageJsonLd
        title="How to turn a PDF into flashcards in minutes"
        description="Step-by-step guide to create flashcards and quizzes from a PDF with selectable text."
        url="https://www.cramdesk.com/blog/how-to-turn-pdf-into-flashcards"
      />
      <ArticleJsonLd
        headline="How to turn a PDF into flashcards in minutes"
        description="Step-by-step guide to create flashcards and quizzes from a PDF with selectable text."
        authorName="Cramdesk Team"
        url="https://www.cramdesk.com/blog/how-to-turn-pdf-into-flashcards"
        image="https://www.cramdesk.com/og.png"
        keywords={['pdf to flashcards', 'ai flashcards', 'quiz from pdf']}
      />
      <FAQJsonLd faqs={faqs} />

      <main className="relative z-10 px-3 md:px-4 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-orange-500/5" />
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container max-w-6xl space-y-10 md:space-y-12 relative">
          <header className="section-card p-6 md:p-10 text-center bg-background/80 border border-border/60 shadow-lg shadow-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,115,29,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_30%)]" />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary animate-fade-in-down">
              <Sparkles className="h-4 w-4" />
              Step-by-step guide
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 animate-fade-in-up">
              How to turn a PDF into flashcards in minutes
            </h1>
            <p className="text-muted-foreground text-lg mt-3 max-w-3xl mx-auto animate-fade-in-up">
              Upload, generate, and study—no manual copy-paste. Ideal for lecture slides, case studies, and vocab lists.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mt-4 animate-fade-in-up">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Works with most PDFs</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> 6 min read</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4" /> AI + quizzes</span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in-up">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground text-sm font-semibold hover:brightness-110 transition btn-press">
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/compare/quizlet-alternative" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                See Quizlet alternative
              </Link>
            </div>
          </header>

          <section className="section-card p-6 md:p-8 space-y-6 bg-background/80 border border-border/60 shadow-md shadow-primary/5">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <ListChecks className="h-4 w-4" />
              Quick method
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <div key={step.title} className="p-5 rounded-xl border border-border/60 bg-gradient-to-br from-background/80 via-background to-primary/5 shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section-card p-6 md:p-8 space-y-4 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 border border-primary/20 shadow-lg shadow-primary/15">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <Flame className="h-4 w-4" />
              Best practices
            </div>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <ul className="list-disc list-inside space-y-2">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground text-sm font-semibold hover:brightness-110 transition btn-press">
                Try Cramdesk free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/en/medical-flashcards" className="text-sm text-primary hover:underline">Med students</Link>
              <Link href="/use-cases/language-learning" className="text-sm text-primary hover:underline">Language learning</Link>
              <Link href="/use-cases/law-students" className="text-sm text-primary hover:underline">Law students</Link>
            </div>
          </section>

          <section className="section-card p-6 md:p-8 bg-background/80 border border-border/60 shadow-md shadow-primary/5 space-y-4">
            <h2 className="text-2xl font-semibold">FAQ</h2>
            <div className="divide-y divide-border/60 rounded-xl border border-border/60 bg-background/70">
              {faqs.map((faq) => (
                <div key={faq.question} className="p-4 space-y-1">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
