import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  Sparkles, 
  Zap,
  Target,
  CheckCircle,
  ArrowRight,
  Brain,
  FileText,
  Trophy
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Quiz Generator from PDF & Notes | CramDesk',
  description: 'Generate quizzes automatically from your PDFs and notes. Test your knowledge with AI-created multiple choice questions and track your progress.',
  keywords: ['AI quiz generator', 'quiz from PDF', 'automatic quiz', 'study quiz', 'MCQ generator', 'test generator'],
  alternates: {
    canonical: '/quiz',
  },
  openGraph: {
    title: 'AI Quiz Generator from PDF & Notes | CramDesk',
    description: 'Generate quizzes automatically from your PDFs and notes.',
    url: 'https://cramdesk.com/quiz',
  },
}

const faqItems = [
  {
    question: 'How does the AI quiz generator work?',
    answer: 'Upload your document or paste text, and our AI analyzes it to create relevant multiple-choice questions with correct answers and distractors.',
  },
  {
    question: 'What types of questions are generated?',
    answer: 'We generate multiple-choice questions (MCQ) with 4 options each. The AI creates realistic wrong answers based on the content.',
  },
  {
    question: 'How many questions can I generate?',
    answer: 'Starter plan allows 20 questions per generation, Student plan 50, and Graduate plan up to 100 questions per generation.',
  },
  {
    question: 'Can I see my quiz results?',
    answer: 'Yes! After taking a quiz, you get a detailed score breakdown showing which questions you got right and wrong.',
  },
]

export default function QuizPage() {
  return (
    <>
      <WebPageJsonLd
        title="AI Quiz Generator from PDF & Notes"
        description="Generate quizzes automatically from your PDFs and notes."
        url="https://cramdesk.com/quiz"
      />
      <FAQJsonLd faqs={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">Test Your Knowledge</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-orange-500 bg-clip-text text-transparent">
                Generate Quizzes Automatically from Your Content
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Turn any PDF or notes into interactive quizzes. 
                Test yourself with AI-generated questions and track your progress.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/signup">
                    Create Quiz <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link href="/#pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use AI Quizzes?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Instant Quizzes</h3>
                  <p className="text-muted-foreground">
                    Generate complete quizzes in seconds from any document.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Smart Questions</h3>
                  <p className="text-muted-foreground">
                    AI creates relevant questions that test real understanding.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Trophy className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
                  <p className="text-muted-foreground">
                    See your scores and identify areas that need more study.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Active Recall</h3>
                  <p className="text-muted-foreground">
                    The most effective study method backed by science.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Any Subject</h3>
                  <p className="text-muted-foreground">
                    Works with any topic from any PDF or text content.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Realistic Distractors</h3>
                  <p className="text-muted-foreground">
                    Wrong answers are plausible, making questions more challenging.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-2">{item.question}</h3>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Test Yourself?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create your first AI quiz in under a minute.
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/signup">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </>
  )
}
