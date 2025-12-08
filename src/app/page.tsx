import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { DemoUpload } from '@/components/demo-upload'
import { 
  FileText, 
  Shield, 
  Zap, 
  MessageSquare, 
  BookOpen, 
  ArrowRight,
  CheckCircle,
  Clock,
  FileSearch
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
        <div className="container max-w-6xl text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-6 bg-background animate-fade-in-down">
            <Zap className="h-4 w-4 mr-2 text-primary animate-pulse" />
            Analyse de documents par IA
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up stagger-1">
            Comprenez n'importe quel PDF
            <br />
            <span className="gradient-text">en 2 minutes</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-2">
            Déposez vos contrats, devis et documents business. Obtenez des résumés instantanés, 
            une analyse des risques et des versions simplifiées.
          </p>
          
          {/* Demo Upload Zone */}
          <div className="mb-8">
            <DemoUpload />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-4">
            <Button size="lg" asChild className="btn-press hover-lift">
              <Link href="/signup">
                Essai gratuit 7 jours
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="btn-press">
              <Link href="#features">Découvrir</Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 animate-fade-in stagger-5">
            Sans carte bancaire • 7 jours gratuits
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in-up">
            Tout ce qu'il faut pour comprendre vos documents
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Arrêtez de passer des heures sur des documents complexes. L'IA fait le travail.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileSearch className="h-6 w-6" />}
              title="Executive Summary"
              description="Get 5-10 key bullet points covering the most important information in seconds."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Risk Analysis"
              description="Identify potential risks, unusual clauses, and points requiring attention."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Questions to Ask"
              description="Get suggested questions to clarify with the other party before signing."
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Easy Reading Mode"
              description="Complex legal language transformed into plain, simple English anyone can understand."
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Instant Processing"
              description="Upload your PDF and get results in under 60 seconds. No waiting around."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Document Comparison"
              description="Compare multiple versions to see exactly what changed between documents."
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Perfect for your business documents
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <UseCaseCard
              title="Contracts"
              description="Understand service agreements, NDAs, employment contracts, and partnership deals."
              items={['Service agreements', 'NDAs', 'Employment contracts', 'Partnership deals']}
            />
            <UseCaseCard
              title="Quotes & Proposals"
              description="Analyze vendor quotes, project proposals, and pricing documents quickly."
              items={['Vendor quotes', 'Project proposals', 'Pricing documents', 'RFP responses']}
            />
            <UseCaseCard
              title="Terms & Policies"
              description="Decode CGV, privacy policies, terms of service, and compliance documents."
              items={['Terms of service', 'Privacy policies', 'CGV documents', 'Compliance docs']}
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Tarification simple et transparente</h2>
          <p className="text-muted-foreground mb-8">
            Démarrez avec 7 jours d'essai gratuit. Choisissez ensuite le forfait adapté à vos besoins.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Basic"
              price="3.99"
              pages="150"
              highlighted={false}
            />
            <PricingCard
              name="Growth"
              price="12.99"
              pages="600"
              highlighted={true}
            />
            <PricingCard
              name="Pro"
              price="20.99"
              pages="1,500"
              highlighted={false}
            />
          </div>
          
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Start your free trial</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">PDFTalk</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDFTalk. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-0 shadow-sm card-hover group">
      <CardContent className="p-6">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

function UseCaseCard({ title, description, items }: { title: string; description: string; items: string[] }) {
  return (
    <div className="group">
      <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={item} className="flex items-center gap-2 text-sm group-hover:translate-x-1 transition-transform" style={{ transitionDelay: `${index * 50}ms` }}>
            <CheckCircle className="h-4 w-4 text-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function PricingCard({ name, price, pages, highlighted }: { name: string; price: string; pages: string; highlighted: boolean }) {
  return (
    <Card className={`card-hover ${highlighted ? 'border-primary shadow-lg scale-105' : ''}`}>
      <CardContent className="p-6 text-center">
        {highlighted && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full mb-3 animate-pulse-soft">
            Populaire
          </span>
        )}
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="my-4">
          <span className="text-3xl font-bold gradient-text">{price}€</span>
          <span className="text-muted-foreground">/mois</span>
        </div>
        <p className="text-sm text-muted-foreground">{pages} pages/mois</p>
      </CardContent>
    </Card>
  )
}
