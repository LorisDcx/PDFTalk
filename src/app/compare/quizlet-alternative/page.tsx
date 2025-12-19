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

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <section className="py-16 px-4">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Quizlet alternative</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                The Quizlet alternative that turns your PDFs into notes and quizzes
              </h1>
              <p className="text-muted-foreground text-lg">
                Cramdesk instantly converts your course PDFs into notes, flashcards, and MCQs. No more manual typing—focus on learning.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Try 7 days free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/#pricing">See plans</Link>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {points.map((p) => (
                <Card key={p.title} className="border-border/60">
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
          </div>
        </section>

        <section id="how-to" className="py-12 px-4 bg-muted/30">
          <div className="container max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">How to create flashcards from a PDF</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">1. Upload</p>
                  <p>Drop your PDF or click to upload your course file.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">2. Generate</p>
                  <p>AI creates notes, flashcards, and MCQs automatically.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">3. Study</p>
                  <p>Review cards, replay quizzes, export if needed.</p>
                </CardContent>
              </Card>
            </div>
            <Button asChild size="lg">
              <Link href="/signup">Start for free</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
