'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { DemoUpload } from '@/components/demo-upload'
import { useLanguage } from '@/lib/i18n'
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
  const { t } = useLanguage()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-12 md:py-20 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
        <div className="container max-w-6xl text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm mb-6 bg-background animate-fade-in-down">
            <Zap className="h-4 w-4 mr-2 text-primary animate-pulse" />
            {t('heroTagline')}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 animate-fade-in-up stagger-1">
            {t('heroTitle')}
            <br />
            <span className="gradient-text">{t('heroTitleHighlight')}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up stagger-2">
            {t('heroDescription')}
          </p>
          
          {/* Demo Upload Zone */}
          <div className="mb-8">
            <DemoUpload />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up stagger-4">
            <Button size="lg" asChild className="btn-press hover-lift">
              <Link href="/signup">
                {t('freeTrial7Days')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="btn-press">
              <Link href="#features">{t('discover')}</Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-4 animate-fade-in stagger-5">
            {t('noCreditCard')}
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4 animate-fade-in-up">
            {t('featuresTitle')}
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            {t('featuresSubtitle')}
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FileSearch className="h-6 w-6" />}
              title={t('featureExecutiveSummary')}
              description={t('featureExecutiveSummaryDesc')}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title={t('featureRiskAnalysis')}
              description={t('featureRiskAnalysisDesc')}
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title={t('featureQuestionsToAsk')}
              description={t('featureQuestionsToAskDesc')}
            />
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title={t('featureEasyReading')}
              description={t('featureEasyReadingDesc')}
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title={t('featureInstantProcessing')}
              description={t('featureInstantProcessingDesc')}
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title={t('featureDocComparison')}
              description={t('featureDocComparisonDesc')}
            />
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {t('useCasesTitle')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <UseCaseCard
              title={t('useCaseContracts')}
              description={t('useCaseContractsDesc')}
              items={['Service agreements', 'NDAs', 'Employment contracts', 'Partnership deals']}
            />
            <UseCaseCard
              title={t('useCaseQuotes')}
              description={t('useCaseQuotesDesc')}
              items={['Vendor quotes', 'Project proposals', 'Pricing documents', 'RFP responses']}
            />
            <UseCaseCard
              title={t('useCaseTerms')}
              description={t('useCaseTermsDesc')}
              items={['Terms of service', 'Privacy policies', 'CGV documents', 'Compliance docs']}
            />
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 px-4">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">{t('pricingTitle')}</h2>
          <p className="text-muted-foreground mb-8">
            {t('pricingSubtitle')}
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <PricingCard
              name="Basic"
              price="3.99"
              pages="150"
              highlighted={false}
              popularText={t('popular')}
              perMonthText={t('perMonth')}
              pagesPerMonthText={t('pagesPerMonth')}
            />
            <PricingCard
              name="Growth"
              price="12.99"
              pages="600"
              highlighted={true}
              popularText={t('popular')}
              perMonthText={t('perMonth')}
              pagesPerMonthText={t('pagesPerMonth')}
            />
            <PricingCard
              name="Pro"
              price="20.99"
              pages="1,500"
              highlighted={false}
              popularText={t('popular')}
              perMonthText={t('perMonth')}
              pagesPerMonthText={t('pagesPerMonth')}
            />
          </div>
          
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">{t('startFreeTrial')}</Link>
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
            © {new Date().getFullYear()} PDFTalk. {t('allRightsReserved')}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">{t('privacy')}</Link>
            <Link href="/terms" className="hover:text-foreground">{t('terms')}</Link>
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

function PricingCard({ name, price, pages, highlighted, popularText, perMonthText, pagesPerMonthText }: { 
  name: string; price: string; pages: string; highlighted: boolean;
  popularText: string; perMonthText: string; pagesPerMonthText: string;
}) {
  return (
    <Card className={`card-hover ${highlighted ? 'border-primary shadow-lg scale-105' : ''}`}>
      <CardContent className="p-6 text-center">
        {highlighted && (
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full mb-3 animate-pulse-soft">
            {popularText}
          </span>
        )}
        <h3 className="font-semibold text-lg">{name}</h3>
        <div className="my-4">
          <span className="text-3xl font-bold gradient-text">{price}€</span>
          <span className="text-muted-foreground">{perMonthText}</span>
        </div>
        <p className="text-sm text-muted-foreground">{pages} {pagesPerMonthText}</p>
      </CardContent>
    </Card>
  )
}
