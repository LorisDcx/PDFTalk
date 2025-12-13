import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  Target, 
  Brain, 
  Trophy,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Quiz PDF en ligne | Teste tes connaissances avec l\'IA | Cramdesk',
  description: 'Génère des quiz automatiquement à partir de tes PDF. L\'IA crée des QCM personnalisés pour tester tes connaissances et identifier tes lacunes.',
  keywords: ['quiz PDF', 'QCM en ligne', 'test connaissances', 'quiz révision', 'générateur quiz'],
  alternates: {
    canonical: '/quiz-pdf',
  },
}

const faqs = [
  {
    question: 'Comment créer un quiz à partir de mon PDF ?',
    answer: 'Uploade ton PDF, clique sur "Générer un quiz", et l\'IA crée automatiquement des questions à choix multiples basées sur le contenu de ton document.',
  },
  {
    question: 'Combien de questions sont générées ?',
    answer: 'Par défaut, l\'IA génère 10 à 20 questions selon la longueur de ton document. Tu peux ajuster ce nombre selon tes besoins.',
  },
  {
    question: 'Les quiz sont-ils adaptés à mon niveau ?',
    answer: 'L\'IA génère des questions variées couvrant différents niveaux de difficulté. Tu peux voir ton score et identifier les points à retravailler.',
  },
  {
    question: 'Puis-je refaire le quiz plusieurs fois ?',
    answer: 'Oui ! Tu peux refaire le quiz autant de fois que tu veux. Les questions sont mélangées à chaque tentative pour un meilleur apprentissage.',
  },
]

export default function QuizPdfPage() {
  return (
    <>
      <WebPageJsonLd 
        title="Quiz PDF en ligne"
        description="Génère des quiz automatiquement à partir de tes PDF"
        url="https://cramdesk.com/quiz-pdf"
      />
      <FAQJsonLd faqs={faqs} />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero */}
        <section className="container max-w-6xl py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Target className="h-4 w-4" />
            <span className="text-sm font-medium">Quiz IA</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Génère des <span className="text-primary">quiz</span> depuis tes PDF
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            L'IA analyse ton cours et crée des QCM personnalisés pour tester tes connaissances.
            Identifie tes lacunes et révise efficacement.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500" asChild>
              <Link href="/register">
                Créer mon premier quiz
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="container max-w-6xl py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Des quiz intelligents pour mieux apprendre
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Questions intelligentes</h3>
                <p className="text-sm text-muted-foreground">
                  L'IA comprend ton cours et génère des questions pertinentes sur les points clés.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Suivi de progression</h3>
                <p className="text-sm text-muted-foreground">
                  Vois ton score et identifie les sujets à retravailler pour progresser.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="font-semibold mb-2">Améliore ta mémoire</h3>
                <p className="text-sm text-muted-foreground">
                  Le testing effect prouvé : tester ses connaissances améliore la mémorisation.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits */}
        <section className="container max-w-6xl py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Pourquoi utiliser les quiz Cramdesk ?
              </h2>
              
              <div className="space-y-4">
                {[
                  'Questions générées automatiquement en 30 secondes',
                  'Basées sur le contenu exact de ton cours',
                  'Correction immédiate avec explications',
                  'Refais le quiz autant de fois que tu veux',
                  'Identifie tes points faibles rapidement',
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6 text-center bg-primary/5">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">10-20</p>
                <p className="text-sm text-muted-foreground">questions par quiz</p>
              </Card>
              <Card className="p-6 text-center bg-orange-500/5">
                <Sparkles className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">30s</p>
                <p className="text-sm text-muted-foreground">pour générer</p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container max-w-4xl py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Questions fréquentes
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <Card key={i} className="p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container max-w-4xl py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à tester tes connaissances ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Crée ton premier quiz gratuitement. Aucune carte bancaire requise.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500" asChild>
            <Link href="/auth">
              Commencer gratuitement
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </>
  )
}
