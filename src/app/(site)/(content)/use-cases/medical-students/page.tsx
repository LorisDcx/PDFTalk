import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd, HowToJsonLd } from '@/components/json-ld'
import { Stethoscope, Sparkles, CheckCircle2, BookOpen, ArrowRight, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Medical study: AI flashcards and quizzes from PDFs | Cramdesk',
  description:
    'Generate medical study notes, flashcards, and MCQ quizzes from your lecture PDFs. AI workflow for med students and exams.',
  keywords: ['medical flashcards', 'medical quiz', 'mcq medicine', 'med school study', 'ai study notes'],
  alternates: {
    canonical: '/use-cases/medical-students',
  },
  openGraph: {
    title: 'Medical study: AI flashcards and quizzes from PDFs | Cramdesk',
    description:
      'Create summaries, flashcards, and MCQ quizzes from your medicine PDFs. Built for med students.',
    url: 'https://cramdesk.com/use-cases/medical-students',
  },
}

const faqItems = [
  {
    question: 'How do I turn a medical PDF into study notes?',
    answer:
      'Upload your PDF; Cramdesk extracts key concepts (pathologies, physiology, treatments) and builds structured notes.',
  },
  {
    question: 'Can it generate MCQ quizzes?',
    answer:
      'Yes. The AI creates multiple-choice questions with realistic distractors to train for exams.',
  },
  {
    question: 'What about long PDFs?',
    answer:
      'Student/Graduate plans handle long PDFs (200–500 pages) with optimized processing time.',
  },
]

const benefits = [
  {
    title: 'Clear medical notes',
    desc: 'Structured by pathology, symptoms, diagnosis, and treatment. Export-ready.',
    icon: <BookOpen className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Exam-style quizzes',
    desc: 'Auto-generated MCQs with corrections to target weak spots.',
    icon: <CheckCircle2 className="h-5 w-5 text-primary" />,
  },
  {
    title: 'Time saver',
    desc: 'No retyping notes—focus on memorization and practice.',
    icon: <Clock className="h-5 w-5 text-primary" />,
  },
]

export default function MedecineUseCasePage() {
  return (
    <>
      <WebPageJsonLd
        title="Medical study: AI flashcards and quizzes from PDFs"
        description="Generate medical notes and MCQ quizzes from your PDFs."
        url="https://cramdesk.com/use-cases/medical-students"
      />
      <HowToJsonLd
        name="Create medical flashcards from a PDF"
        description="Turn a medical lecture PDF into structured notes and MCQ quizzes with Cramdesk."
        url="https://cramdesk.com/use-cases/medical-students#how-to"
        steps={[
          { name: 'Upload your PDF', text: 'Drop your medical lecture PDF or click to upload it.' },
          { name: 'Generate', text: 'Cramdesk AI extracts key concepts and builds notes plus MCQs.' },
          { name: 'Review', text: 'Study, replay quizzes, and export if needed.' },
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
              <Stethoscope className="h-4 w-4" />
              <span>Medical study</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Turn your medical PDFs into notes and MCQ quizzes in minutes
            </h1>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              Upload your PDFs and AI builds structured notes plus quizzes for med school exams.
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
              Why med students choose Cramdesk
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
            <h2 className="text-2xl font-bold">Simple workflow</h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">1. Import PDF</p>
                  <p>AI reads the lecture, detects key sections (symptoms, diagnosis, treatment).</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">2. Notes + quizzes</p>
                  <p>Concise notes plus corrected MCQs for effective review.</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold text-foreground">3. Train</p>
                  <p>Spot weak areas, replay quizzes, export if needed.</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-center">
              <Button asChild size="lg" className="btn-press px-6 py-3">
                <Link href="/signup">Start studying</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
