'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/navbar'
import { DemoUpload } from '@/components/demo-upload'
import { useLanguage } from '@/lib/i18n'
import { 
  FileText, 
  Zap, 
  ArrowRight,
  CheckCircle,
  Clock,
  Layers,
  Presentation,
  Sparkles,
  Lock,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Target,
  MessageSquare,
  Brain,
  Play,
  Coins
} from 'lucide-react'

export default function LandingPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="blob blob-primary w-[600px] h-[600px] -top-[200px] -left-[200px] fixed" />
      <div className="blob blob-cyan w-[500px] h-[500px] top-[40%] -right-[150px] fixed" />
      
      {/* Noise overlay */}
      <div className="noise-overlay" />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 md:py-16 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <div className="section-card p-6 md:p-12 lg:p-16 relative z-10">
            <div className="text-center">
              <div className="inline-flex items-center rounded-full border bg-background px-4 py-1.5 text-sm mb-6 animate-fade-in-down">
                <Zap className="h-4 w-4 mr-2 text-primary animate-pulse" />
                {t('heroTagline')}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up">
                {t('heroTitle')}
                <br />
                <span className="gradient-text">{t('heroTitleHighlight')}</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up">
                {t('heroDescription')}
              </p>
              
              {/* Demo Upload Zone */}
              <div className="mb-10 animate-fade-in-up max-w-2xl mx-auto">
                <DemoUpload />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up">
                <Button size="lg" asChild className="btn-press hover-lift text-base px-8 py-6">
                  <Link href="/signup">
                    {t('freeTrial7Days')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="btn-press bg-background text-base px-8 py-6">
                  <Link href="#how-it-works">
                    <Play className="mr-2 h-5 w-5" />
                    {t('discover')}
                  </Link>
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                {t('noCreditCard')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-12 px-4 relative z-10">
        <div className="container max-w-5xl">
          <div className="section-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-8">
              {t('howItWorksTitle')}
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <StepCard 
                number="1" 
                title={t('step1Title')}
                description={t('step1Desc')}
              />
              <StepCard 
                number="2" 
                title={t('step2Title')}
                description={t('step2Desc')}
              />
              <StepCard 
                number="3" 
                title={t('step3Title')}
                description={t('step3Desc')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 relative z-10">
        <div className="container max-w-5xl">
          <div className="section-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-2">
              {t('featuresTitle')}
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-lg mx-auto">
              {t('featuresSubtitle')}
            </p>
            
            <div className="grid md:grid-cols-2 gap-5">
              <FeatureCard
                icon={<Layers className="h-5 w-5" />}
                title={t('featureFlashcards')}
                description={t('featureFlashcardsDesc')}
                highlighted
              />
              <FeatureCard
                icon={<Target className="h-5 w-5" />}
                title={t('featureQuiz')}
                description={t('featureQuizDesc')}
                highlighted
              />
              <FeatureCard
                icon={<Presentation className="h-5 w-5" />}
                title={t('featureSlides')}
                description={t('featureSlidesDesc')}
                highlighted
              />
              <FeatureCard
                icon={<MessageSquare className="h-5 w-5" />}
                title={t('featureChat')}
                description={t('featureChatDesc')}
                highlighted
              />
              <FeatureCard
                icon={<BookOpen className="h-5 w-5" />}
                title={t('featureExecutiveSummary')}
                description={t('featureExecutiveSummaryDesc')}
              />
              <FeatureCard
                icon={<Brain className="h-5 w-5" />}
                title={t('featureRiskAnalysis')}
                description={t('featureRiskAnalysisDesc')}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Credits explanation */}
      <section className="py-8 px-4 relative z-10">
        <div className="container max-w-5xl">
          <div className="section-card p-6 md:p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coins className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t('creditsTitle')}</span>
            </div>
            <p className="text-center text-muted-foreground text-sm mb-6">
              {t('creditsSubtitle')}
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <Layers className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{t('credits5Flashcards')}</p>
                <p className="text-xs text-muted-foreground">= 1 {t('page')}</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{t('credits5Questions')}</p>
                <p className="text-xs text-muted-foreground">= 1 {t('page')}</p>
              </div>
              <div className="p-4 rounded-lg bg-background/50 border border-border/50">
                <Presentation className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">{t('credits1Slide')}</p>
                <p className="text-xs text-muted-foreground">= 1 {t('page')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 px-4 relative z-10">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-3 gap-4">
            <div className="section-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">2 min</div>
              <div className="text-xs text-muted-foreground">{t('avgAnalysisTime')}</div>
            </div>
            <div className="section-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">500+</div>
              <div className="text-xs text-muted-foreground">{t('coursesAnalyzed')}</div>
            </div>
            <div className="section-card p-4 text-center">
              <div className="text-2xl font-bold text-primary">4.8/5</div>
              <div className="text-xs text-muted-foreground">{t('avgRating')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 px-4 relative z-10">
        <div className="container max-w-5xl">
          <div className="section-card p-6 md:p-8">
            <h2 className="text-2xl font-bold text-center mb-2">{t('pricingTitle')}</h2>
            <p className="text-muted-foreground text-center mb-8">
              {t('pricingSubtitle')}
            </p>
            
            <div className="grid md:grid-cols-3 gap-5">
              <PricingCard
                name="Starter"
                price="3.99"
                pages="150"
                description={t('planStarterDesc')}
                popularText={t('popular')}
                perMonthText={t('perMonth')}
              />
              <PricingCard
                name="Student"
                price="7.99"
                pages="400"
                description={t('planStudentDesc')}
                highlighted
                popularText={t('popular')}
                perMonthText={t('perMonth')}
              />
              <PricingCard
                name="Intense"
                price="12.99"
                pages="1000"
                description={t('planIntenseDesc')}
                popularText={t('popular')}
                perMonthText={t('perMonth')}
              />
            </div>
            
            {/* All plans include */}
            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-center text-sm font-medium mb-3">{t('allPlansInclude')}</p>
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> {t('flashcardsIncluded')}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> {t('quizIncluded')}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> {t('slidesIncluded')}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> {t('exportCsvIncluded')}</span>
                <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-primary" /> {t('chatPDF')}</span>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button size="lg" asChild>
                <Link href="/signup">{t('startFreeTrial')}</Link>
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                {t('noCreditCard')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 px-4 relative z-10">
        <div className="container max-w-5xl">
          <div className="section-card p-6 md:p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <span className="font-semibold">{t('securityTitle')}</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{t('securityEncryption')}</p>
                <p className="text-xs text-muted-foreground">{t('securityEncryptionDesc')}</p>
              </div>
              <div className="p-4">
                <ShieldCheck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{t('securityGDPR')}</p>
                <p className="text-xs text-muted-foreground">{t('securityGDPRDesc')}</p>
              </div>
              <div className="p-4">
                <GraduationCap className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">{t('securityPrivate')}</p>
                <p className="text-xs text-muted-foreground">{t('securityPrivateDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 px-4 relative z-10">
        <div className="container max-w-3xl">
          <div className="section-card p-8 text-center bg-gradient-to-br from-primary/5 via-background to-cyan-500/5">
            <h2 className="text-2xl font-bold mb-3">
              {t('ctaTitle')}
            </h2>
            <p className="text-muted-foreground mb-6">
              {t('ctaSubtitle')}
            </p>
            <Button size="lg" asChild className="btn-press hover-lift">
              <Link href="/signup">
                {t('startFreeTrial')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8 px-4 bg-background/80 backdrop-blur-sm">
        <div className="container max-w-5xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold">Cramdesk</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Cramdesk. {t('allRightsReserved')}
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">{t('privacy')}</Link>
              <Link href="/terms" className="hover:text-foreground">{t('terms')}</Link>
              <Link href="mailto:contact@cramdesk.fr" className="hover:text-foreground">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, highlighted }: { icon: React.ReactNode; title: string; description: string; highlighted?: boolean }) {
  return (
    <div className={`p-5 rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:shadow-sm transition-all duration-200 group ${highlighted ? 'ring-1 ring-primary/30 bg-gradient-to-br from-primary/5 to-cyan-500/5' : ''}`}>
      <div className={`h-10 w-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200 ${highlighted ? 'bg-gradient-to-br from-primary to-cyan-500 text-white' : 'bg-primary/10 text-primary'}`}>
        {icon}
      </div>
      <h3 className="font-semibold mb-1.5">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="text-center p-5 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all group">
      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
        {number}
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function PricingCard({ name, price, pages, description, highlighted, popularText, perMonthText }: { 
  name: string; price: string; pages: string; description: string; highlighted?: boolean;
  popularText: string; perMonthText: string;
}) {
  return (
    <Card className={`card-hover relative ${highlighted ? 'border-primary shadow-lg scale-105 z-10' : ''}`}>
      <CardContent className="p-6">
        {highlighted && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
            {popularText}
          </span>
        )}
        <div className="text-center mb-4">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="text-center mb-4">
          <span className="text-3xl font-bold gradient-text">{price}€</span>
          <span className="text-muted-foreground text-sm">{perMonthText}</span>
        </div>
        <div className="text-center p-3 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-2xl font-bold text-primary">{pages}</span>
          <span className="text-sm text-muted-foreground ml-1">pages/mois</span>
        </div>
      </CardContent>
    </Card>
  )
}
