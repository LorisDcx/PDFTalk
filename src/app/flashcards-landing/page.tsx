import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  Sparkles, 
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Layers,
  Clock
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Flashcards Generator for Studying Faster | CramDesk',
  description: 'Create smart flashcards from any text or PDF automatically. Our AI generates study-ready flashcards in seconds to help you learn faster.',
  keywords: ['AI flashcards', 'flashcard generator', 'study flashcards', 'PDF to flashcards', 'automatic flashcards', 'spaced repetition'],
  alternates: {
    canonical: '/flashcards-landing',
  },
  openGraph: {
    title: 'AI Flashcards Generator for Studying Faster | CramDesk',
    description: 'Create smart flashcards from any text or PDF automatically.',
    url: 'https://cramdesk.com/flashcards-landing',
  },
}

const faqItems = [
  {
    question: 'How does the AI flashcard generator work?',
    answer: 'Upload your PDF or paste text, and our AI analyzes the content to extract key concepts, definitions, and facts. It then creates question-answer pairs optimized for learning.',
  },
  {
    question: 'How many flashcards can I generate?',
    answer: 'Starter plan allows 50 flashcards per generation, Student plan 100, and Graduate plan up to 200 flashcards per generation.',
  },
  {
    question: 'Can I edit the generated flashcards?',
    answer: 'Yes! All generated flashcards can be reviewed, edited, and customized before you start studying.',
  },
  {
    question: 'What formats are supported?',
    answer: 'We support PDF documents, and you can also paste text directly. The AI works with any educational content.',
  },
]

export default function FlashcardsPage() {
  return (
    <>
      <WebPageJsonLd
        title="AI Flashcards Generator for Studying Faster"
        description="Create smart flashcards from any text or PDF automatically."
        url="https://cramdesk.com/flashcards-landing"
      />
      <FAQJsonLd faqs={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Layers className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Learning</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-orange-500 bg-clip-text text-transparent">
                Create Smart Flashcards from Any Text or PDF
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transform your study materials into effective flashcards instantly. 
                Our AI extracts key concepts and creates perfect question-answer pairs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/signup">
                    Generate Flashcards <ArrowRight className="ml-2 h-5 w-5" />
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
            <h2 className="text-3xl font-bold text-center mb-12">Why Use AI Flashcards?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Instant Generation</h3>
                  <p className="text-muted-foreground">
                    Create hundreds of flashcards in seconds, not hours of manual work.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Smart Extraction</h3>
                  <p className="text-muted-foreground">
                    AI identifies the most important concepts and creates effective questions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <BookOpen className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Study Mode</h3>
                  <p className="text-muted-foreground">
                    Built-in study mode with progress tracking and spaced repetition.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Save Hours</h3>
                  <p className="text-muted-foreground">
                    Focus on learning instead of creating. Let AI do the heavy lifting.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Layers className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Any Subject</h3>
                  <p className="text-muted-foreground">
                    Works with any topic: science, history, languages, medicine, and more.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Customizable</h3>
                  <p className="text-muted-foreground">
                    Edit, add, or remove cards. Full control over your study materials.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Study Smarter?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students creating flashcards with AI.
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
