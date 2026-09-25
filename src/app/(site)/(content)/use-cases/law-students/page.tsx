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

      <main className="relative z-10 px-3 md:px-4 py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-orange-500/5" />
        <div className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

        <div className="container max-w-6xl space-y-10 md:space-y-12 relative">
          <section className="section-card p-6 md:p-10 text-center bg-background/80 border border-border/60 shadow-lg shadow-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(255,115,29,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.08),transparent_30%)]" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 text-sm font-medium">
              <Scale className="h-4 w-4" />
              <span>Law study</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Turn your law PDFs into briefs and quizzes
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              AI structures key notions and generates MCQs to review civil, criminal, public law, and more.
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
              Why law students pick Cramdesk
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
            <h2 className="text-2xl font-bold">Quick method</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">1. Import PDF</p>
                  <p>Extracts notions, cases, and relevant articles.</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">2. Briefs + quizzes</p>
                  <p>Summaries plus recall MCQs to memorize faster.</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">3. Review</p>
                  <p>Replay quizzes, export if needed.</p>
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
