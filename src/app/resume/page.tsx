import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  Sparkles, 
  Zap,
  FileText,
  CheckCircle,
  ArrowRight,
  Clock,
  ListChecks,
  BookOpen
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Text Summarizer – Notes, PDFs & Articles | CramDesk',
  description: 'Summarize any text or document instantly with AI. Get concise, accurate summaries of notes, PDFs, articles, and more.',
  keywords: ['AI summarizer', 'text summarizer', 'PDF summary', 'document summarizer', 'notes summary', 'article summarizer'],
  alternates: {
    canonical: '/resume',
  },
  openGraph: {
    title: 'AI Text Summarizer – Notes, PDFs & Articles | CramDesk',
    description: 'Summarize any text or document instantly with AI.',
    url: 'https://cramdesk.com/resume',
  },
}

const faqItems = [
  {
    question: 'How does the AI summarizer work?',
    answer: 'Our AI reads your entire document and extracts the most important points, creating a concise summary that captures the key information.',
  },
  {
    question: 'What length are the summaries?',
    answer: 'You can choose different summary lengths from brief bullet points to detailed summaries. The AI adapts to your needs.',
  },
  {
    question: 'Does it work with all document types?',
    answer: 'Yes! We support PDFs, and you can also paste text directly. Works great for articles, research papers, textbooks, and notes.',
  },
  {
    question: 'Are the summaries accurate?',
    answer: 'Our AI is trained to identify and preserve key information. It maintains the original meaning while condensing the content.',
  },
]

export default function ResumePage() {
  return (
    <>
      <WebPageJsonLd
        title="AI Text Summarizer – Notes, PDFs & Articles"
        description="Summarize any text or document instantly with AI."
        url="https://cramdesk.com/resume"
      />
      <FAQJsonLd faqs={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <ListChecks className="h-4 w-4" />
                <span className="text-sm font-medium">AI Summarization</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-orange-500 bg-clip-text text-transparent">
                Summarize Any Text or Document Instantly
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transform long documents into concise summaries. 
                Save hours of reading with AI-powered summarization.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/signup">
                    Summarize Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 px-4">
          <div className="container max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Use AI Summaries?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Clock className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Save Time</h3>
                  <p className="text-muted-foreground">
                    Get the key points in seconds instead of reading for hours.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
                  <p className="text-muted-foreground">
                    Upload and get your summary in under a minute.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <ListChecks className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Key Points</h3>
                  <p className="text-muted-foreground">
                    AI identifies and extracts the most important information.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Any Document</h3>
                  <p className="text-muted-foreground">
                    Works with PDFs, articles, notes, research papers, and more.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <BookOpen className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Study Faster</h3>
                  <p className="text-muted-foreground">
                    Review summaries before exams to refresh your memory quickly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Accurate</h3>
                  <p className="text-muted-foreground">
                    AI preserves the original meaning while condensing content.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Save Time?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Summarize your first document in under a minute.
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
