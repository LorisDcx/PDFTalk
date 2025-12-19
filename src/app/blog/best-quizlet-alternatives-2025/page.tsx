import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Sparkles, Star, ShieldCheck, Clock3, Waves, Flame, BookOpen } from 'lucide-react'
import { ArticleJsonLd, FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'

export const metadata: Metadata = {
  title: 'Best Quizlet alternatives in 2025: AI flashcards & study tools compared',
  description:
    'Looking for the best Quizlet alternative? Compare AI flashcards, PDF-to-quiz, spaced repetition, and privacy-friendly tools students love in 2025.',
  keywords: [
    'quizlet alternative',
    'quizlet alternatives 2025',
    'ai flashcards',
    'study tools',
    'pdf to quiz',
    'spaced repetition',
  ],
  openGraph: {
    title: 'Best Quizlet alternatives in 2025',
    description:
      'Roundup of the best Quizlet alternatives with AI flashcards, PDF-to-quiz, spaced repetition, and privacy-focused study tools.',
    url: 'https://cramdesk.com/blog/best-quizlet-alternatives-2025',
  },
  alternates: {
    canonical: 'https://cramdesk.com/blog/best-quizlet-alternatives-2025',
  },
}

const faqs = [
  {
    question: 'What is the best Quizlet alternative in 2025?',
    answer:
      'For PDF-based studying with AI flashcards and quizzes, Cramdesk stands out. For traditional SRS decks, Anki remains popular. Brainscape is solid for spaced repetition on mobile.',
  },
  {
    question: 'Which alternative is best for turning PDFs into flashcards?',
    answer:
      'Cramdesk lets you upload any PDF and instantly generate flashcards, quizzes, and summaries—ideal for lecture notes, handouts, and textbooks.',
  },
  {
    question: 'Are these alternatives free?',
    answer:
      'Most offer free tiers with limits. Cramdesk has a free trial, Anki is free on desktop, and Brainscape offers limited free decks with paid upgrades.',
  },
  {
    question: 'Do these tools work offline?',
    answer:
      'Anki works offline. Cramdesk and Brainscape are web-first with syncing; offline export is possible via downloads or print for some features.',
  },
]

const picks = [
  {
    name: 'Cramdesk (AI-first)',
    highlight: 'Best for PDFs → flashcards/quizzes in minutes',
    bullets: [
      'Upload PDFs and auto-generate flashcards, quizzes, summaries',
      'AI humanizer for essay rewrites and clearer phrasing',
      'Spaced repetition mode + quiz practice from the same source',
      'Privacy controls and GDPR-ready hosting',
    ],
  },
  {
    name: 'Anki',
    highlight: 'Best for power users and offline SRS',
    bullets: [
      'Fully offline desktop app with deep customization',
      'Community decks, templates, add-ons',
      'Steep learning curve; mobile app is paid on iOS',
    ],
  },
  {
    name: 'Brainscape',
    highlight: 'Best for mobile-first spaced repetition',
    bullets: [
      'Clean mobile UX, confidence-based grading',
      'Great for language vocab and quick drills',
      'Less flexible for importing PDFs or rich media',
    ],
  },
  {
    name: 'Notion + Flashcard add-ons',
    highlight: 'Best for teams and note-linking',
    bullets: [
      'Great for collaborative notes and linking concepts',
      'Requires integrations to become a flashcard app',
    ],
  },
]

export default function BestQuizletAlternatives2025Page() {
  const todayIso = new Date().toISOString().split('T')[0]

  return (
    <>
      <WebPageJsonLd
        title="Best Quizlet alternatives in 2025: AI flashcards & study tools compared"
        description="Looking for the best Quizlet alternative? Compare AI flashcards, PDF-to-quiz, spaced repetition, and privacy-friendly tools students love in 2025."
        url="https://cramdesk.com/blog/best-quizlet-alternatives-2025"
      />
      <ArticleJsonLd
        headline="Best Quizlet alternatives in 2025"
        description="Roundup of the best Quizlet alternatives with AI flashcards, PDF-to-quiz, spaced repetition, and privacy-focused study tools."
        authorName="Cramdesk Team"
        datePublished={todayIso}
        url="https://cramdesk.com/blog/best-quizlet-alternatives-2025"
        image="https://cramdesk.com/og.png"
        keywords={['quizlet alternative', 'ai flashcards', 'study tools 2025']}
      />
      <FAQJsonLd faqs={faqs} />

      <main className="relative z-10 px-3 md:px-4 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-orange-500/5" />
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container max-w-6xl space-y-10 md:space-y-12 relative">
          <header className="section-card p-6 md:p-10 text-center bg-background/80 border border-border/60 shadow-lg shadow-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,115,29,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_30%)]" />
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary animate-fade-in-down">
              <Sparkles className="h-4 w-4" />
              Updated for 2025
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mt-4 animate-fade-in-up">
              Best Quizlet alternatives in 2025
            </h1>
            <p className="text-muted-foreground text-lg mt-3 max-w-3xl mx-auto animate-fade-in-up">
              We compared the most useful study tools for students who need fast flashcards, quizzes, and spaced repetition, especially when your content lives in PDFs. If you want the full breakdown of features, see our{' '}
              <Link href="/compare/quizlet-alternative" className="text-primary hover:underline">Quizlet alternative comparison</Link>.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mt-4 animate-fade-in-up">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Privacy-friendly options</span>
              <span className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> 7 min read</span>
              <span className="flex items-center gap-2"><Star className="h-4 w-4" /> AI + SRS picks</span>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3 animate-fade-in-up">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground text-sm font-semibold hover:brightness-110 transition btn-press">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/compare/quizlet-alternative" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                Full comparison
              </Link>
            </div>
          </header>

          <section className="section-card p-6 md:p-8 space-y-6 bg-background/80 border border-border/60 shadow-md shadow-primary/5">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <Waves className="h-4 w-4" />
              At a glance
            </div>
            <h2 className="text-2xl font-semibold">Top picks at a glance</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {picks.map((pick) => (
                <div key={pick.name} className="p-5 rounded-xl border border-border/60 bg-gradient-to-br from-background/70 via-background to-primary/5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
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

          <section className="section-card p-6 md:p-8 space-y-4 bg-background/80 border border-border/60 shadow-md shadow-primary/5">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <BookOpen className="h-4 w-4" />
              How to choose
            </div>
            <h2 className="text-2xl font-semibold">How to choose a Quizlet alternative</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Pick based on your source material and workflow: if most of your content is inside PDFs (slides, handouts, cases), choose a tool that can ingest PDFs and build flashcards or quizzes instantly. If you already have structured decks, pure SRS apps may suffice. For PDF-heavy courses, try the{' '}
                <Link href="/use-cases/medical-students" className="text-primary hover:underline">medical students workflow</Link> or the{' '}
                <Link href="/use-cases/law-students" className="text-primary hover:underline">law briefs workflow</Link>.
              </p>
              <p>
                Also evaluate exporting, privacy, and collaboration. Some tools work offline; others focus on sync and collaboration. Finally, look for AI helpers that reduce manual copy-paste—see how Cramdesk turns PDFs into quizzes in the{' '}
                <Link href="/use-cases/language-learning" className="text-primary hover:underline">language learning</Link> or{' '}
                <Link href="/use-cases/medical-students" className="text-primary hover:underline">med school</Link> pages.
              </p>
            </div>
          </section>

          <section className="section-card p-6 md:p-8 space-y-6 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 border border-primary/20 shadow-lg shadow-primary/15">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <Flame className="h-4 w-4" />
              Featured
            </div>
            <h2 className="text-2xl font-semibold">Cramdesk: fastest from PDF to flashcards & quizzes</h2>
            <div className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Cramdesk is built for students who live in PDFs. Upload a file and get flashcards, quizzes, and summaries in minutes. You can humanize long explanations, extract key terms, and practice with spaced repetition.
              </p>
              <ul className="space-y-2 list-disc list-inside">
                <li>PDF ingestion → flashcards, quizzes, summaries automatically</li>
                <li>Spaced repetition practice plus quick quiz mode</li>
                <li>AI humanizer to rewrite dense passages</li>
                <li>Privacy-aware: GDPR-ready hosting and export options</li>
              </ul>
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-primary-foreground/90">
                Tip: start with one PDF chapter, generate flashcards, then switch to quiz mode for rapid recall.
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground text-sm font-semibold hover:brightness-110 transition btn-press">
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/compare/quizlet-alternative" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
                See full comparison
              </Link>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="section-card p-6 bg-background/80 border border-border/60 shadow-md shadow-primary/5 space-y-3">
              <h2 className="text-xl font-semibold">Anki: offline and highly customizable</h2>
              <p className="text-muted-foreground leading-relaxed">
                Anki is unbeatable for offline study and granular control. Add-ons and templates make it powerful, but setup takes time. It is best if you already have structured notes or CSVs. Importing PDFs is possible but manual.
              </p>
            </div>
            <div className="section-card p-6 bg-background/80 border border-border/60 shadow-md shadow-primary/5 space-y-3">
              <h2 className="text-xl font-semibold">Brainscape: mobile-friendly spaced repetition</h2>
              <p className="text-muted-foreground leading-relaxed">
                Brainscape shines for mobile vocab drilling with confidence ratings. It is lighter on customization and PDF ingestion, so it’s better for simple term-definition decks than heavy lecture notes.
              </p>
            </div>
            <div className="section-card p-6 bg-background/80 border border-border/60 shadow-md shadow-primary/5 space-y-3 md:col-span-2">
              <h2 className="text-xl font-semibold">Notion + flashcard add-ons</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you already organize everything in Notion, adding a flashcard integration can work. It excels at linked notes and team collaboration, but it is slower than AI-first tools for creating quizzes from PDFs.
              </p>
            </div>
          </section>

          <section className="section-card p-6 md:p-8 bg-background/80 border border-border/60 shadow-md shadow-primary/5 space-y-4">
            <h2 className="text-2xl font-semibold">Recommendations by use case</h2>
            <ul className="space-y-2 text-muted-foreground list-disc list-inside leading-relaxed">
              <li><strong>Medical/law students:</strong> Cramdesk for PDF-to-quiz + spaced repetition.</li>
              <li><strong>Language learners:</strong> Brainscape for vocab drills; Cramdesk for idioms extracted from readings.</li>
              <li><strong>Power users/offline:</strong> Anki.</li>
              <li><strong>Team collaboration:</strong> Notion + add-ons.</li>
            </ul>
          </section>

          <section className="section-card p-6 md:p-8 bg-gradient-to-r from-primary/5 via-background to-orange-500/5 border border-primary/20 shadow-lg shadow-primary/15 space-y-4">
            <h2 className="text-2xl font-semibold">Next steps</h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-primary-foreground text-sm font-semibold hover:brightness-110 transition btn-press">
                Try Cramdesk free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/use-cases/medical-students" className="text-sm text-primary hover:underline">Medical students</Link>
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
