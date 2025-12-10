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
          title: '1. Objet',
          content: `Les présentes CGU régissent l'utilisation de PDFTalk, service d'aide à la révision pour étudiants. En créant un compte, vous acceptez ces conditions.`
        },
        {
          title: '2. Le service PDFTalk',
          content: `PDFTalk permet de :

• Uploader des cours au format PDF
• Générer automatiquement des flashcards de révision
• Créer des quiz QCM pour tester ses connaissances
• Obtenir des résumés structurés
• Générer des présentations
• Discuter avec le contenu de vos documents

Le service utilise l'intelligence artificielle pour analyser et transformer vos cours.`
        },
        {
          title: '3. Inscription et compte',
          content: `Pour utiliser PDFTalk :

• Vous devez avoir au moins 13 ans
• Créer un compte avec une adresse email valide
• Garder vos identifiants confidentiels
• Ne pas partager votre compte

Vous êtes responsable de l'activité sur votre compte.`
        },
        {
          title: '4. Utilisation du service',
          content: `Vous vous engagez à :

• Uploader uniquement des documents dont vous avez les droits
• Ne pas utiliser le service à des fins illégales
• Ne pas tenter de contourner les limites du service
• Respecter les droits d'auteur

PDFTalk est un outil d'aide à la révision. Les contenus générés ne remplacent pas vos cours et peuvent contenir des erreurs.`
        },
        {
          title: '5. Abonnements',
          content: `• Essai gratuit : 7 jours sur tous les plans
• Facturation : mensuelle, à date anniversaire
• Annulation : possible à tout moment, effective à la fin de la période
• Remboursement : non applicable pour les périodes entamées

Les prix peuvent évoluer avec un préavis de 30 jours.`
        },
        {
          title: '6. Propriété intellectuelle',
          content: `• Vos documents : vous restez propriétaire de vos cours
• Contenus générés : vous pouvez les utiliser librement pour vos révisions
• PDFTalk : le service, son code et son design nous appartiennent
• Licence : vous nous accordez le droit de traiter vos documents pour fournir le service`
        },
        {
          title: '7. Responsabilité',
          content: `PDFTalk est fourni "en l'état". Nous ne garantissons pas :

• L'exactitude à 100% des contenus générés par l'IA
• La disponibilité permanente du service
• L'adéquation aux examens spécifiques

Vérifiez toujours les informations générées avec vos cours originaux.`
        },
        {
          title: '8. Résiliation',
          content: `• Par vous : suppression du compte depuis les paramètres
• Par nous : en cas de violation des CGU, avec préavis

La résiliation entraîne la suppression de vos données.`
        },
        {
          title: '9. Contact',
          content: `Questions sur les CGU : contact@pdftalk.fr

Droit applicable : droit français
Juridiction : tribunaux compétents de Paris`
        }
      ]
    },
    en: {
      title: 'Terms of Service',
      lastUpdate: 'Last updated: December 2024',
      sections: [
        {
          title: '1. Purpose',
          content: `These Terms govern the use of PDFTalk, a study aid service for students. By creating an account, you accept these terms.`
        },
        {
          title: '2. The PDFTalk service',
          content: `PDFTalk allows you to:

• Upload courses in PDF format
• Automatically generate revision flashcards
• Create MCQ quizzes to test your knowledge
• Get structured summaries
• Generate presentations
• Chat with your document content

The service uses artificial intelligence to analyze and transform your courses.`
        },
        {
          title: '3. Registration and account',
          content: `To use PDFTalk:

• You must be at least 13 years old
• Create an account with a valid email address
• Keep your credentials confidential
• Do not share your account

You are responsible for activity on your account.`
        },
        {
          title: '4. Use of service',
          content: `You agree to:

• Only upload documents you have rights to
• Not use the service for illegal purposes
• Not attempt to bypass service limits
• Respect copyright

PDFTalk is a study aid tool. Generated content does not replace your courses and may contain errors.`
        },
        {
          title: '5. Subscriptions',
          content: `• Free trial: 7 days on all plans
• Billing: monthly, on anniversary date
• Cancellation: possible at any time, effective at end of period
• Refund: not applicable for started periods

Prices may change with 30 days notice.`
        },
        {
          title: '6. Intellectual property',
          content: `• Your documents: you remain owner of your courses
• Generated content: you can use freely for your studies
• PDFTalk: the service, code and design belong to us
• License: you grant us the right to process your documents to provide the service`
        },
        {
          title: '7. Liability',
          content: `PDFTalk is provided "as is". We do not guarantee:

• 100% accuracy of AI-generated content
• Permanent service availability
• Suitability for specific exams

Always verify generated information with your original courses.`
        },
        {
          title: '8. Termination',
          content: `• By you: account deletion from settings
• By us: in case of Terms violation, with notice

Termination results in deletion of your data.`
        },
        {
          title: '9. Contact',
          content: `Questions about Terms: contact@pdftalk.fr

Applicable law: French law
Jurisdiction: Paris courts`
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
