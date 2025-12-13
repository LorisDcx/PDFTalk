import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { 
  FileText, 
  Sparkles, 
  Zap,
  BookOpen,
  ListChecks,
  ArrowRight,
  CheckCircle
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Générateur de Fiches de Révision IA | Cramdesk',
  description: 'Crée des fiches de révision automatiquement à partir de tes PDF. L\'IA analyse ton cours et génère des fiches structurées en 2 minutes.',
  keywords: ['fiches de révision', 'générateur fiches', 'résumé cours', 'fiche synthèse', 'révision IA'],
  alternates: {
    canonical: '/fiches-revision',
  },
}

const faqs = [
  {
    question: 'Comment créer une fiche de révision avec Cramdesk ?',
    answer: '1. Uploade ton PDF de cours. 2. Clique sur "Générer une fiche". 3. L\'IA analyse le contenu et crée une fiche structurée avec les points clés, définitions et concepts importants.',
  },
  {
    question: 'Quelle est la qualité des fiches générées ?',
    answer: 'Nos fiches sont générées par une IA avancée qui comprend le contexte de ton cours. Elle extrait les informations essentielles et les organise de manière logique pour faciliter ta révision.',
  },
  {
    question: 'Puis-je modifier les fiches générées ?',
    answer: 'Oui ! Tu peux copier le contenu et le modifier selon tes besoins. Tu peux aussi régénérer la fiche avec des paramètres différents.',
  },
  {
    question: 'Combien de fiches puis-je créer ?',
    answer: 'Avec l\'essai gratuit, tu as 50 pages offertes. Ensuite, nos forfaits te permettent de traiter de 300 à des pages illimitées par mois.',
  },
]

export default function FichesRevisionPage() {
  return (
    <>
      <WebPageJsonLd 
        title="Générateur de Fiches de Révision IA"
        description="Crée des fiches de révision automatiquement"
        url="https://cramdesk.com/fiches-revision"
      />
      <FAQJsonLd faqs={faqs} />
      
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero */}
        <section className="container max-w-6xl py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <FileText className="h-4 w-4" />
            <span className="text-sm font-medium">Fiches de révision IA</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Génère des <span className="text-primary">fiches de révision</span> en 2 min
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            L'IA analyse ton PDF et crée automatiquement des fiches structurées 
            avec les points clés, définitions et concepts importants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-500" asChild>
              <Link href="/auth">
                Créer ma première fiche
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* How it works */}
        <section className="container max-w-6xl py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                1
              </div>
              <h3 className="font-semibold mb-2">Uploade ton PDF</h3>
              <p className="text-sm text-muted-foreground">
                Glisse-dépose ton cours PDF. On accepte jusqu'à 500 pages par document.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-orange-500">
                2
              </div>
              <h3 className="font-semibold mb-2">L'IA analyse</h3>
              <p className="text-sm text-muted-foreground">
                Notre IA lit et comprend ton cours pour en extraire l'essentiel.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-emerald-500">
                3
              </div>
              <h3 className="font-semibold mb-2">Récupère ta fiche</h3>
              <p className="text-sm text-muted-foreground">
                Ta fiche de révision est prête ! Copie-la ou exporte-la.
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container max-w-6xl py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Des fiches complètes et structurées
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: ListChecks, title: 'Points clés', desc: 'Les informations essentielles de ton cours' },
              { icon: BookOpen, title: 'Définitions', desc: 'Les termes importants expliqués clairement' },
              { icon: Zap, title: 'Concepts', desc: 'Les idées principales résumées' },
              { icon: Sparkles, title: 'Structure claire', desc: 'Organisation logique pour réviser efficacement' },
            ].map((feature, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
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
            Prêt à créer tes fiches de révision ?
          </h2>
          <p className="text-muted-foreground mb-8">
            50 pages gratuites pour tester. Aucune carte bancaire requise.
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
