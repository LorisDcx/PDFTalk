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

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <section className="py-16 px-4">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Languages className="h-4 w-4" />
                <span className="text-sm font-medium">Language learning</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Turn your language PDFs into vocab flashcards and quizzes
              </h1>
              <p className="text-muted-foreground text-lg">
                AI extracts vocabulary, expressions, and conjugations to create ready-to-study cards.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link href="/signup">
                    Start free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/#pricing">See plans</Link>
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {benefits.map((b) => (
                <Card key={b.title} className="border-border/60">
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
          </div>
        </section>

        <section id="how-to" className="py-12 px-4 bg-muted/30">
          <div className="container max-w-4xl mx-auto text-center space-y-4">
            <h2 className="text-2xl font-bold">Simple study plan</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">1. Import PDF</p>
                  <p>AI detects vocabulary, expressions, and key verbs.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">2. Flashcards + quizzes</p>
                  <p>Cards with translations/definitions plus vocab quizzes.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">3. Review</p>
                  <p>Spaced reminders, CSV export, replay tests.</p>
                </CardContent>
              </Card>
            </div>
            <Button asChild size="lg">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
