import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  Sparkles, 
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Brain,
  FileText,
  Target
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Humanizer – Make AI Text Sound Human | CramDesk',
  description: 'Transform AI-generated text into natural, human-like writing. Bypass AI detectors like GPTZero, Turnitin, and Originality.ai with our advanced humanizer.',
  keywords: ['AI humanizer', 'humanize AI text', 'bypass GPTZero', 'AI detection bypass', 'make AI text human', 'undetectable AI'],
  alternates: {
    canonical: '/humanizer',
  },
  openGraph: {
    title: 'AI Humanizer – Make AI Text Sound Human | CramDesk',
    description: 'Transform AI-generated text into natural, human-like writing that bypasses all AI detectors.',
    url: 'https://cramdesk.com/humanizer',
  },
}

const faqItems = [
  {
    question: 'How does the AI Humanizer work?',
    answer: 'Our humanizer uses advanced AI to rewrite text with natural language patterns, varying sentence structures, and human-like expressions that AI detectors cannot identify.',
  },
  {
    question: 'Will my text pass GPTZero and Turnitin?',
    answer: 'Yes! Our humanizer is specifically designed to bypass major AI detectors including GPTZero, Turnitin, Originality.ai, and others with a 95%+ success rate.',
  },
  {
    question: 'Does it preserve my original meaning?',
    answer: 'Absolutely. The humanizer maintains your core message and facts while transforming the writing style to appear naturally human.',
  },
  {
    question: 'How many credits do I get?',
    answer: 'Starter plan includes 5 humanizer credits/month, Student plan 10 credits, and Graduate plan 20 credits. Each use consumes 1 credit.',
  },
]

export default function HumanizerPage() {
  return (
    <>
      <WebPageJsonLd
        title="AI Humanizer – Make AI Text Sound Human"
        description="Transform AI-generated text into natural, human-like writing that bypasses all AI detectors."
        url="https://cramdesk.com/humanizer"
      />
      <FAQJsonLd faqs={faqItems} />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" />
          <div className="container max-w-6xl mx-auto relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Powered by GPT-4o</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-orange-500 bg-clip-text text-transparent">
                AI Humanizer that Makes Text Sound 100% Human
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transform AI-generated content into natural, undetectable human writing. 
                Bypass GPTZero, Turnitin, and all major AI detectors instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link href="/signup">
                    Try Free <ArrowRight className="ml-2 h-5 w-5" />
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
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Humanizer?</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Shield className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Bypass All Detectors</h3>
                  <p className="text-muted-foreground">
                    Works against GPTZero, Turnitin, Originality.ai, Copyleaks, and more.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Brain className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Natural Language</h3>
                  <p className="text-muted-foreground">
                    Adds human-like expressions, varied rhythms, and natural imperfections.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Target className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Preserves Meaning</h3>
                  <p className="text-muted-foreground">
                    Your original message stays intact while the writing style transforms.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Zap className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Instant Results</h3>
                  <p className="text-muted-foreground">
                    Get humanized text in seconds, not minutes. Fast and reliable.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <FileText className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Any Text Length</h3>
                  <p className="text-muted-foreground">
                    From short paragraphs to full essays, humanize any content length.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <Sparkles className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-semibold text-lg mb-2">GPT-4o Powered</h3>
                  <p className="text-muted-foreground">
                    Using the most advanced AI model for the best humanization quality.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="space-y-8">
              {[
                { step: '1', title: 'Paste Your AI Text', desc: 'Copy and paste any AI-generated content into the humanizer.' },
                { step: '2', title: 'Click Humanize', desc: 'Our AI analyzes and rewrites your text with human patterns.' },
                { step: '3', title: 'Get Undetectable Text', desc: 'Receive natural-sounding content that passes all AI detectors.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
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
            <h2 className="text-3xl font-bold mb-4">Ready to Humanize Your Text?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students using CramDesk to create undetectable content.
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
