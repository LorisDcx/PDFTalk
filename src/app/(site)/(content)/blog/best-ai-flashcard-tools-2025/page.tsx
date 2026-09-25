import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Sparkles, Star, ShieldCheck, Clock3, CheckCircle2, Zap, Flame, BookOpen } from 'lucide-react'
import { ArticleJsonLd, FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'Best AI flashcard tools in 2025: speed, quizzes, and SRS | Cramdesk',
  description: 'Ranking the best AI flashcard tools in 2025 for fast deck creation, quizzes, and spaced repetition. See when to use each tool.',
  keywords: ['ai flashcards', 'flashcard generator', 'quiz generator', 'spaced repetition 2025', 'best ai study tools'],
  openGraph: {
    title: 'Best AI flashcard tools in 2025',
    description: 'Top AI flashcard tools compared: speed, quizzes, SRS, and PDF handling.',
    url: 'https://cramdesk.com/blog/best-ai-flashcard-tools-2025',
  },
  alternates: {
    canonical: 'https://cramdesk.com/blog/best-ai-flashcard-tools-2025',
  },
}

const faqs = [
  {
    question: 'Which AI flashcard tool is fastest for PDFs?',
    answer: 'Cramdesk ingests PDFs and outputs flashcards/quizzes quickly. Others often require manual copy-paste.',
  },
  {
    question: 'Do these tools support spaced repetition?',
    answer: 'Cramdesk includes quiz practice; Anki/RemNote are strong for SRS; Brainscape focuses on confidence-based reps.',
  },
  {
    question: 'Are there free options?',
    answer: 'Anki is free on desktop; some tools have free trials or limited tiers. Cramdesk offers a free trial to start.',
  },
]

const picks = [
  {
    name: 'Cramdesk',
    highlight: 'Best for PDF → flashcards/quizzes in minutes',
    bullets: [
      'Uploads PDFs and auto-builds cards + quizzes',
      'Humanizer to rewrite dense passages',
      'Spaced repetition quiz mode',
    ],
  },
  {
    name: 'Anki',
    highlight: 'Best for offline + deep customization',
    bullets: ['Full SRS control', 'Add-ons ecosystem', 'Manual PDF handling'],
  },
  {
    name: 'Brainscape',
    highlight: 'Best mobile-first drilling',
    bullets: ['Confidence ratings', 'Great for vocab', 'Limited PDF ingestion'],
  },
  {
    name: 'Notion + add-ons',
    highlight: 'Best for collaborative notes',
    bullets: ['Linked notes', 'Team-friendly', 'Needs integrations for cards'],
  },
]

export default function BestAiFlashcardTools2025Page() {
  const todayIso = new Date().toISOString().split('T')[0]

  return (
    <>
      <WebPageJsonLd
        title="Best AI flashcard tools in 2025"
        description="Ranking the best AI flashcard tools in 2025 for fast deck creation, quizzes, and SRS."
        url="https://cramdesk.com/blog/best-ai-flashcard-tools-2025"
      />
      <ArticleJsonLd
        headline="Best AI flashcard tools in 2025"
        description="Top AI flashcard tools compared: speed, quizzes, SRS, and PDF handling."
        authorName="Cramdesk Team"
        datePublished={todayIso}
        url="https://cramdesk.com/blog/best-ai-flashcard-tools-2025"
        image="https://cramdesk.com/og.png"
        keywords={['ai flashcards', 'flashcard generator', 'quiz generator']}
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
              Updated for 2025
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 animate-fade-in-up">
              Best AI flashcard tools in 2025
            </h1>
            <p className="text-muted-foreground text-lg mt-3 max-w-3xl mx-auto animate-fade-in-up">
              Which AI flashcard app should you pick? We compare speed, PDF handling, quizzes, and spaced repetition so you can choose fast.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mt-4 animate-fade-in-up">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> PDF-friendly picks</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> 6 min read</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4" /> AI + SRS</span>
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
              <Zap className="h-4 w-4" />
              Top picks
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {picks.map((pick) => (
                <div key={pick.name} className="p-5 rounded-xl border border-border/60 bg-gradient-to-br from-background/80 via-background to-primary/5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-lg">{pick.name}</h3>
                      <p className="text-sm text-muted-foreground">{pick.highlight}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    {pick.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="section-card p-6 md:p-8 space-y-4 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 border border-primary/20 shadow-lg shadow-primary/15">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <BookOpen className="h-4 w-4" />
              How to choose
            </div>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Choose based on your inputs and workflow: if most of your content lives in PDFs, pick a tool that ingests PDFs and generates flashcards/quizzes automatically. If you already have decks, pure SRS tools can suffice.
              </p>
              <p>
                Also look at export, privacy, and collaboration. Test quiz quality and whether the tool supports spaced repetition. AI helpers should reduce manual copy-paste.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground text-sm font-semibold hover:brightness-110 transition btn-press">
                Try Cramdesk free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/use-cases/medical-students" className="text-sm text-primary hover:underline">Med students</Link>
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
