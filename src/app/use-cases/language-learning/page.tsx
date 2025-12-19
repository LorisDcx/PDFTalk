import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd, HowToJsonLd } from '@/components/json-ld'
import { Languages, Sparkles, CheckCircle2, BookOpen, ArrowRight, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Language learning: AI flashcards & vocab quizzes from PDFs | Cramdesk',
  description:
    'Generate vocabulary flashcards and quizzes from your language-learning PDFs. Great for vocab, expressions, and conjugations.',
  keywords: ['vocabulary flashcards', 'vocab quiz', 'language learning AI', 'flashcards from pdf', 'study languages'],
  alternates: {
    canonical: '/use-cases/language-learning',
  },
  openGraph: {
    title: 'Language learning: AI flashcards & vocab quizzes from PDFs | Cramdesk',
    description:
      'Create vocab flashcards and quizzes automatically from your language course PDFs.',
    url: 'https://cramdesk.com/use-cases/language-learning',
  },
}

const faqItems = [
  {
    question: 'Can it generate vocabulary flashcards?',
    answer:
      'Yes. The AI extracts key words/expressions and builds flashcards with translations or definitions.',
  },
  {
    question: 'How about conjugation?',
    answer:
      'Add verb tables or lists and the AI will generate quizzes and reminder cards for key tenses.',
  },
  {
    question: 'Can I export and review?',
    answer:
      'You can review in-app, export CSV, and replay quizzes to reinforce memorization.',
  },
]

const benefits = [
  {
    title: 'Targeted flashcards',
    desc: 'Vocabulary, idioms, and key phrases extracted automatically.',
    icon: <BookOpen className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Quick quizzes',
    desc: 'MCQs and spaced reminders to retain long term.',
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Time saver',
    desc: 'Skip manual copy-paste: import your PDF and start studying.',
    icon: <Clock className="h-5 w-5 text-primary" />,
  },
]

export default function LanguesUseCasePage() {
  return (
    <>
      <WebPageJsonLd
        title="Language learning: AI flashcards & vocab quizzes"
        description="Generate vocab flashcards and quizzes from your PDFs."
        url="https://cramdesk.com/use-cases/language-learning"
      />
      <HowToJsonLd
        name="Create language flashcards from a PDF"
        description="Generate vocab flashcards and quizzes from any language-learning PDF."
        url="https://cramdesk.com/use-cases/language-learning#how-to"
        steps={[
          { name: 'Upload your PDF', text: 'Drop your language course PDF or click to upload it.' },
          { name: 'Generate', text: 'Cramdesk AI extracts vocab, idioms, and verbs to build cards and quizzes.' },
          { name: 'Review', text: 'Study the cards, replay quizzes, and export if needed.' },
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
              <Languages className="h-4 w-4" />
              <span>Language learning</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Turn your language PDFs into vocab flashcards and quizzes
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              AI extracts vocabulary, expressions, and conjugations to create ready-to-study cards and quizzes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" className="btn-press px-6 py-3">
                <Link href="/signup">
                  Start free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="btn-press px-6 py-3">
                <Link href="/compare/quizlet-alternative">See Quizlet alternative</Link>
              </Button>
            </div>
          </section>

          <section className="section-card p-6 md:p-8 bg-background/80 border border-border/60 shadow-md shadow-primary/10 space-y-6">
            <div className="flex items-center gap-2 text-sm uppercase tracking-wide text-primary font-semibold">
              <Sparkles className="h-4 w-4" />
              Why learners use Cramdesk
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {benefits.map((b) => (
                <Card key={b.title} className="border-border/60 bg-gradient-to-br from-background/80 via-background to-primary/5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
                  <CardContent className="p-5 space-y-2">
                    <div className="flex items-center gap-2">
                      {b.icon}
                      <h3 className="font-semibold">{b.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section id="how-to" className="section-card p-6 md:p-8 bg-gradient-to-r from-primary/5 via-background to-orange-500/5 border border-primary/20 shadow-lg shadow-primary/15 space-y-6 text-center">
            <h2 className="text-2xl font-bold">Simple study plan</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">1. Import PDF</p>
                  <p>AI detects vocabulary, expressions, and key verbs.</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">2. Flashcards + quizzes</p>
                  <p>Cards with translations/definitions plus vocab quizzes.</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">3. Review</p>
                  <p>Spaced reminders, CSV export, replay tests.</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button asChild size="lg" className="btn-press px-6 py-3">
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
