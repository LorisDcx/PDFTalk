import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  Sparkles, 
  Zap,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  FileText,
  Search,
  BookOpen
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Chat with PDF – Summarize & Ask Questions | CramDesk',
  description: 'Upload any PDF and chat with it using AI. Get instant summaries, ask questions, and extract key information from your documents.',
  keywords: ['chat with PDF', 'PDF AI', 'PDF summarizer', 'ask PDF questions', 'document AI', 'PDF analysis'],
  alternates: {
    canonical: '/pdf',
  },
  openGraph: {
    title: 'Chat with PDF – Summarize & Ask Questions | CramDesk',
    description: 'Upload any PDF and chat with it using AI.',
    url: 'https://cramdesk.com/pdf',
  },
}

const faqItems = [
  {
    question: 'How does Chat with PDF work?',
    answer: 'Upload your PDF and our AI reads and understands the entire document. You can then ask questions in natural language and get accurate answers based on the content.',
  },
  {
    question: 'What types of PDFs are supported?',
    answer: 'We support text-based PDFs including textbooks, research papers, reports, articles, and any document with readable text.',
  },
  {
    question: 'How accurate are the answers?',
    answer: 'Our AI provides answers directly from your document content, with references to specific sections. Accuracy depends on the clarity of the source material.',
  },
  {
    question: 'Is there a page limit?',
    answer: 'Starter plan supports up to 100 pages per document, Student plan 200 pages, and Graduate plan up to 500 pages per document.',
  },
]

export default function PDFPage() {
  return (
    <>
      <WebPageJsonLd
        title="Chat with PDF – Summarize & Ask Questions"
        description="Upload any PDF and chat with it using AI."
        url="https://cramdesk.com/pdf"
      />
      <FAQJsonLd faqs={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">AI Document Analysis</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-orange-500 bg-clip-text text-transparent">
                Analyze and Summarize Any PDF with AI
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Upload your documents and get instant summaries, ask questions, 
                and extract key information in seconds.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/signup">
                    Upload PDF <ArrowRight className="ml-2 h-5 w-5" />
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
            <h2 className="text-3xl font-bold text-center mb-12">What You Can Do</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <MessageSquare className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Ask Questions</h3>
                  <p className="text-muted-foreground">
                    Chat naturally with your PDF and get accurate answers instantly.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Instant Summaries</h3>
                  <p className="text-muted-foreground">
                    Get concise summaries of long documents in seconds.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Search className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Find Key Info</h3>
                  <p className="text-muted-foreground">
                    Extract specific information without reading the whole document.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <BookOpen className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Study Materials</h3>
                  <p className="text-muted-foreground">
                    Perfect for textbooks, research papers, and lecture notes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Large Documents</h3>
                  <p className="text-muted-foreground">
                    Handle documents up to 500 pages with Graduate plan.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">AI-Powered</h3>
                  <p className="text-muted-foreground">
                    Advanced AI understands context and provides relevant answers.
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
            <h2 className="text-3xl font-bold mb-4">Ready to Analyze Your PDFs?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Upload your first document and start chatting with AI.
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
