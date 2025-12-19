import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd, HowToJsonLd } from '@/components/json-ld'
import { Scale, Sparkles, CheckCircle2, BookOpen, ArrowRight, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Law study: summaries, briefs, and quizzes from PDFs | Cramdesk',
  description:
    'Generate law summaries, briefs, and quizzes from your course PDFs. AI workflow for law students.',
  keywords: ['law summaries', 'law flashcards', 'law quizzes', 'case briefs', 'ai study law'],
  alternates: {
    canonical: '/use-cases/law-students',
  },
  openGraph: {
    title: 'Law study: summaries, briefs, and quizzes from PDFs | Cramdesk',
    description:
      'Create summaries, briefs, and quizzes from your law PDFs. Built for law students.',
    url: 'https://cramdesk.com/use-cases/law-students',
  },
}

const faqItems = [
  {
    question: 'Can it generate case briefs?',
    answer:
      'Yes. The AI structures facts, rule, holding, and analysis so you can review cases faster.',
  },
  {
    question: 'What about practical cases?',
    answer:
      'Import the statement and notes: the AI builds step-by-step outlines (issue, rules, solution) plus recall quizzes.',
  },
  {
    question: 'Are long documents supported?',
    answer:
      'Student/Graduate plans handle long PDFs with optimized extraction without altering layout.',
  },
]

const benefits = [
  {
    title: 'Structured summaries',
    desc: 'Notes by topic: definitions, principles, key cases, exceptions.',
    icon: <BookOpen className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Recall quizzes',
    desc: 'MCQs to check elements, exceptions, and key dates.',
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Time saver',
    desc: 'Import your PDF, get ready-to-study briefs and quizzes.',
    icon: <Clock className="h-5 w-5 text-primary" />,
  },
]

export default function LawStudentsUseCasePage() {
  return (
    <>
      <WebPageJsonLd
        title="Law study: summaries, briefs, and quizzes"
        description="Generate law summaries, briefs, and quizzes from your PDFs."
        url="https://cramdesk.com/use-cases/law-students"
      />
      <HowToJsonLd
        name="Create law briefs and quizzes from a PDF"
        description="Turn a law course PDF into structured briefs and MCQ quizzes."
        url="https://cramdesk.com/use-cases/law-students#how-to"
        steps={[
          { name: 'Upload your PDF', text: 'Drop your law course or case PDF or click to upload it.' },
          { name: 'Generate', text: 'Cramdesk AI extracts rules, holdings, and builds briefs plus MCQs.' },
          { name: 'Review', text: 'Study summaries, replay quizzes, and export if needed.' },
        ]}
      />
      <FAQJsonLd faqs={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <section className="py-16 px-4">
          <div className="container max-w-5xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Scale className="h-4 w-4" />
                <span className="text-sm font-medium">Law study</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Turn your law PDFs into briefs and quizzes
              </h1>
              <p className="text-muted-foreground text-lg">
                AI structures key notions and generates MCQs to review civil, criminal, public law, and more.
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
            <h2 className="text-2xl font-bold">Quick method</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">1. Import PDF</p>
                  <p>Extracts notions, cases, and relevant articles.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">2. Briefs + quizzes</p>
                  <p>Summaries plus recall MCQs to memorize faster.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">3. Review</p>
                  <p>Replay quizzes, export if needed.</p>
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
