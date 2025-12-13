import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  GraduationCap, 
  FileText, 
  Brain, 
  Clock, 
  Target,
  Sparkles,
  CheckCircle,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Cramdesk pour Étudiants | Révise tes cours PDF efficacement',
  description: 'L\'outil parfait pour les étudiants : transforme tes PDF de cours en fiches de révision, flashcards et quiz en 2 minutes. Gagne du temps et réussis tes examens.',
  keywords: ['étudiant', 'révision', 'cours PDF', 'examens', 'fiches de révision', 'flashcards étudiant'],
  alternates: {
    canonical: '/pour-etudiants',
  },
}

const faqs = [
  {
    question: 'Comment Cramdesk aide les étudiants à réviser ?',
    answer: 'Cramdesk utilise l\'IA pour analyser tes PDF de cours et générer automatiquement des fiches de révision structurées, des flashcards pour mémoriser, et des quiz pour tester tes connaissances.',
  },
  {
    question: 'Combien de temps faut-il pour créer des fiches de révision ?',
    answer: 'Moins de 2 minutes ! Tu uploades ton PDF, tu choisis ce que tu veux (fiches, flashcards ou quiz), et Cramdesk génère tout automatiquement.',
  },
  {
    question: 'Est-ce que Cramdesk fonctionne pour tous les types de cours ?',
    answer: 'Oui, Cramdesk fonctionne pour tous les domaines : droit, médecine, économie, sciences, langues, histoire, etc. L\'IA s\'adapte au contenu de tes cours.',
  },
  {
    question: 'Y a-t-il une version gratuite pour les étudiants ?',
    answer: 'Oui ! Tu peux tester Cramdesk gratuitement avec 50 pages offertes. Ensuite, nos forfaits étudiants commencent à seulement 3,99€/mois.',
  },
]

export default function PourEtudiantsPage() {
  return (
    <>
      <WebPageJsonLd 
        title="Cramdesk pour Étudiants"
        description="L'outil parfait pour les étudiants"
        url="https://cramdesk.com/pour-etudiants"
      />
      <FAQJsonLd faqs={faqs} />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero */}
        <section className="container max-w-6xl py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <GraduationCap className="h-4 w-4" />
            <span className="text-sm font-medium">Pour les étudiants</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Révise <span className="text-primary">2x plus vite</span> avec l'IA
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Transforme tes cours PDF en fiches, flashcards et quiz en 2 minutes. 
            Fini les heures perdues à réécrire tes notes.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500" asChild>
              <Link href="/auth">
                Essayer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/pricing">Voir les tarifs étudiants</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="container max-w-6xl py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Tout ce dont tu as besoin pour réussir
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fiches de révision</h3>
                <p className="text-sm text-muted-foreground">
                  Génère des fiches structurées avec les points clés de tes cours en quelques clics.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">Flashcards intelligentes</h3>
                <p className="text-sm text-muted-foreground">
                  Mémorise efficacement avec des flashcards générées automatiquement depuis tes PDF.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-emerald-500" />
                </div>
                <h3 className="font-semibold mb-2">Quiz personnalisés</h3>
                <p className="text-sm text-muted-foreground">
                  Teste tes connaissances avec des quiz adaptés au contenu de tes cours.
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
                Pourquoi les étudiants adorent Cramdesk
              </h2>
              
              <div className="space-y-4">
                {[
                  'Gagne des heures de préparation',
                  'Révise n\'importe où sur ton téléphone',
                  'Mémorise mieux avec la répétition espacée',
                  'Identifie tes points faibles avec les quiz',
                  'Compatible avec tous tes cours PDF',
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
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">2 min</p>
                <p className="text-sm text-muted-foreground">pour créer tes fiches</p>
              </Card>
              <Card className="p-6 text-center bg-orange-500/5">
                <Sparkles className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-3xl font-bold">50+</p>
                <p className="text-sm text-muted-foreground">pages gratuites</p>
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
            Prêt à réviser plus efficacement ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Rejoins les milliers d'étudiants qui utilisent Cramdesk pour réussir leurs examens.
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
