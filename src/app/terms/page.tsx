'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { FileText, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

export default function TermsPage() {
  const { t, language } = useLanguage()

  const content = {
    fr: {
      title: 'Conditions Générales d\'Utilisation',
      lastUpdate: 'Dernière mise à jour : Décembre 2024',
      sections: [
        {
          title: '1. Acceptation des conditions',
          content: `En utilisant PDFTalk, vous acceptez les présentes conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.`
        },
        {
          title: '2. Description du service',
          content: `PDFTalk est une plateforme d'analyse de documents PDF par intelligence artificielle. Nous fournissons :
          - Résumés automatiques de documents
          - Analyse des risques et points d'attention
          - Version simplifiée des contenus complexes
          - Génération de flashcards et présentations
          - Chat interactif avec vos documents`
        },
        {
          title: '3. Compte utilisateur',
          content: `Pour utiliser PDFTalk, vous devez :
          - Créer un compte avec une adresse email valide
          - Fournir des informations exactes et à jour
          - Protéger vos identifiants de connexion
          - Nous informer de toute utilisation non autorisée
          
          Vous êtes responsable de toutes les activités sur votre compte.`
        },
        {
          title: '4. Utilisation acceptable',
          content: `Vous vous engagez à ne pas :
          - Utiliser le service à des fins illégales
          - Uploader des contenus malveillants ou illicites
          - Tenter de contourner les mesures de sécurité
          - Revendre ou redistribuer le service
          - Utiliser le service pour du harcèlement ou de la fraude`
        },
        {
          title: '5. Propriété intellectuelle',
          content: `- PDFTalk et son contenu sont protégés par le droit d'auteur
          - Vous conservez tous les droits sur vos documents
          - Les analyses générées peuvent être utilisées librement
          - Vous nous accordez une licence limitée pour traiter vos documents`
        },
        {
          title: '6. Abonnements et paiements',
          content: `- Période d'essai gratuite de 7 jours
          - Facturation mensuelle automatique
          - Annulation possible à tout moment
          - Pas de remboursement pour les périodes en cours
          - Prix susceptibles de changer avec préavis de 30 jours`
        },
        {
          title: '7. Limitation de responsabilité',
          content: `PDFTalk est fourni "tel quel". Nous ne garantissons pas :
          - L'exactitude des analyses générées
          - La disponibilité continue du service
          - L'adéquation à un usage particulier
          
          Notre responsabilité est limitée au montant de votre abonnement mensuel.`
        },
        {
          title: '8. Modifications',
          content: `Nous nous réservons le droit de modifier ces conditions. Les modifications importantes seront notifiées par email. L'utilisation continue du service vaut acceptation des nouvelles conditions.`
        },
        {
          title: '9. Contact',
          content: `Pour toute question concernant ces conditions :
          Email : legal@pdftalk.app`
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdate: 'Last updated: December 2024',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: `By using PDFTalk, you agree to these terms of service. If you do not accept these terms, please do not use our service.`
        },
        {
          title: '2. Service Description',
          content: `PDFTalk is an AI-powered PDF document analysis platform. We provide:
          - Automatic document summaries
          - Risk analysis and attention points
          - Simplified version of complex content
          - Flashcard and presentation generation
          - Interactive chat with your documents`
        },
        {
          title: '3. User Account',
          content: `To use PDFTalk, you must:
          - Create an account with a valid email address
          - Provide accurate and up-to-date information
          - Protect your login credentials
          - Notify us of any unauthorized use
          
          You are responsible for all activities on your account.`
        },
        {
          title: '4. Acceptable Use',
          content: `You agree not to:
          - Use the service for illegal purposes
          - Upload malicious or illicit content
          - Attempt to circumvent security measures
          - Resell or redistribute the service
          - Use the service for harassment or fraud`
        },
        {
          title: '5. Intellectual Property',
          content: `- PDFTalk and its content are protected by copyright
          - You retain all rights to your documents
          - Generated analyses can be used freely
          - You grant us a limited license to process your documents`
        },
        {
          title: '6. Subscriptions and Payments',
          content: `- 7-day free trial period
          - Automatic monthly billing
          - Cancellation possible at any time
          - No refunds for current periods
          - Prices subject to change with 30-day notice`
        },
        {
          title: '7. Limitation of Liability',
          content: `PDFTalk is provided "as is". We do not guarantee:
          - Accuracy of generated analyses
          - Continuous service availability
          - Suitability for a particular purpose
          
          Our liability is limited to the amount of your monthly subscription.`
        },
        {
          title: '8. Modifications',
          content: `We reserve the right to modify these terms. Significant changes will be notified by email. Continued use of the service constitutes acceptance of the new terms.`
        },
        {
          title: '9. Contact',
          content: `For any questions about these terms:
          Email: legal@pdftalk.app`
        }
      ]
    }
  }

  const currentContent = content[language as 'fr' | 'en'] || content.en

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container max-w-4xl py-12 px-4">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('back')}
          </Link>
        </Button>

        <h1 className="text-4xl font-bold mb-2">{currentContent.title}</h1>
        <p className="text-muted-foreground mb-8">{currentContent.lastUpdate}</p>

        <div className="space-y-8">
          {currentContent.sections.map((section, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t py-8 px-4">
        <div className="container max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span className="font-semibold">PDFTalk</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PDFTalk. {t('allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>
  )
}
