import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd, HowToJsonLd } from '@/components/json-ld'
import { CheckCircle2, ArrowRight, Sparkles, BookOpen, Gauge, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quizlet Alternative with AI Flashcards & Quizzes | Cramdesk',
  description:
    'Generate flashcards, study notes, and quizzes automatically from PDFs. A Quizlet alternative with AI, built for students.',
  keywords: [
    'quizlet alternative',
    'ai flashcards',
    'quiz from pdf',
    'study notes',
    'flashcard generator',
  ],
  alternates: {
    canonical: '/compare/quizlet-alternative',
  },
  openGraph: {
    title: 'Quizlet Alternative with AI Flashcards & Quizzes | Cramdesk',
    description:
      'Generate flashcards, study notes, and quizzes automatically from PDFs. A Quizlet alternative with AI, built for students.',
    url: 'https://cramdesk.com/compare/quizlet-alternative',
  },
}

const faqItems = [
  {
    question: 'Why pick Cramdesk over Quizlet?',
    answer:
      'Cramdesk auto-generates notes, flashcards, and quizzes from your PDFs with AI, optimized for students and a 7-day trial.',
  },
  {
    question: 'Can I import my PDF courses?',
    answer:
      'Yes. Upload your PDF and the AI extracts key points to create flashcards and quizzes tuned to your level.',
  },
  {
    question: 'Are there limits?',
    answer:
      'Plans start at €3.99 with generous quotas. Longer PDFs and advanced quizzes are included from the Student plan.',
  },
]

const points = [
  {
    title: 'AI generation in your language',
    desc: 'Flashcards and quizzes built from your PDFs with clean phrasing—no awkward translations.',
    icon: <Sparkles className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Notes & quizzes in one click',
    desc: 'Summaries, structured notes, MCQs, and flashcards in one workflow.',
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Speed & study focus',
    desc: 'Clear flow, CSV export, and quick resume to stay in revision mode.',
    icon: <Gauge className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Security & compliance',
    desc: 'Data hosted in Europe, encrypted, and privacy-focused for your study materials.',
    icon: <ShieldCheck className="h-5 w-5 text-primary" />,
  },
]

export default function QuizletAlternativePage() {
  return (
    <>
      <WebPageJsonLd
        title="Quizlet alternative with AI flashcards & quizzes"
        description="Generate flashcards, notes, and quizzes automatically from your PDFs."
        url="https://cramdesk.com/compare/quizlet-alternative"
      />
      <HowToJsonLd
        name="Create AI flashcards from a PDF"
        description="Three simple steps to turn any PDF into flashcards and quizzes with Cramdesk."
        url="https://cramdesk.com/compare/quizlet-alternative#how-to"
        steps={[
          { name: 'Upload your PDF', text: 'Drop your course PDF or click to upload it.' },
          { name: 'Generate', text: 'Cramdesk AI extracts key points and creates notes, flashcards, and MCQs.' },
          { name: 'Review & export', text: 'Study, replay quizzes, and export cards if needed.' },
        ]}
      />
      <FAQJsonLd faqs={faqItems} />

      <main className="relative z-10 px-3 md:px-4 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-orange-500/5" />
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container max-w-6xl space-y-10 md:space-y-12 relative">
          <section className="section-card p-6 md:p-10 text-center bg-background/80 border border-border/60 shadow-lg shadow-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,115,29,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_30%)]" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
              <BookOpen className="h-4 w-4" />
              <span>Quizlet alternative</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              The Quizlet alternative that turns your PDFs into notes and quizzes
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Cramdesk instantly converts your course PDFs into notes, flashcards, and MCQs. No more manual typing—focus on learning.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="btn-press px-6 py-3">
                <Link href="/signup">
                  Try 7 days free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-press px-6 py-3">
                <Link href="/#pricing">See plans</Link>
              </Button>
            </div>
          </section>

          <section className="section-card p-6 md:p-8 bg-background/80 border border-border/60 shadow-md shadow-primary/10 space-y-6">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <Sparkles className="h-4 w-4" />
              Why switch to Cramdesk
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {points.map((p) => (
                <Card key={p.title} className="border-border/60 bg-gradient-to-br from-background/80 via-background to-primary/5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      {p.icon}
                      <h3 className="font-semibold">{p.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{p.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="how-to" className="section-card p-6 md:p-8 bg-gradient-to-r from-primary/5 via-background to-orange-500/5 border border-primary/20 shadow-lg shadow-primary/15 space-y-6 text-center">
            <h2 className="text-2xl font-bold">How to create flashcards from a PDF</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">1. Upload</p>
                  <p>Drop your PDF or click to upload your course file.</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">2. Generate</p>
                  <p>AI creates notes, flashcards, and MCQs automatically.</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">3. Study</p>
                  <p>Review cards, replay quizzes, export if needed.</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button asChild size="lg" className="btn-press px-6 py-3">
                <Link href="/signup">Start for free</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
