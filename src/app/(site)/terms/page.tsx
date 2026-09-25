'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FeaturePageShell } from '@/components/feature-page-shell'
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
          content: `Les présentes CGU régissent l'utilisation de Cramdesk, service d'aide à la révision pour étudiants. En créant un compte, vous acceptez ces conditions.`
        },
        {
          title: '2. Le service Cramdesk',
          content: `Cramdesk permet de :

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
          content: `Pour utiliser Cramdesk :

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

Cramdesk est un outil d'aide à la révision. Les contenus générés ne remplacent pas vos cours et peuvent contenir des erreurs.`
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
• Cramdesk : le service, son code et son design nous appartiennent
• Licence : vous nous accordez le droit de traiter vos documents pour fournir le service`
        },
        {
          title: '7. Responsabilité',
          content: `Cramdesk est fourni "en l'état". Nous ne garantissons pas :

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
          content: `Questions sur les CGU : contact.cramdesk@gmail.com

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
          content: `These Terms govern the use of Cramdesk, a study aid service for students. By creating an account, you accept these terms.`
        },
        {
          title: '2. The Cramdesk service',
          content: `Cramdesk allows you to:

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
          content: `To use Cramdesk:

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

Cramdesk is a study aid tool. Generated content does not replace your courses and may contain errors.`
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
• Cramdesk: the service, code and design belong to us
• License: you grant us the right to process your documents to provide the service`
        },
        {
          title: '7. Liability',
          content: `Cramdesk is provided "as is". We do not guarantee:

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
          content: `Questions about Terms: contact.cramdesk@gmail.com

Applicable law: French law
Jurisdiction: Paris courts`
        }
      ]
    }
  }

  const currentContent = content[language as 'fr' | 'en'] || content.en

  return (
    <FeaturePageShell locale={language === 'fr' ? 'fr' : 'en'} syncLocale={false}>
      <div className="relative px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-48 size-[560px] rounded-full bg-[#ffe9da] opacity-70 blur-[110px]" />
        <div className="relative mx-auto max-w-6xl">
          <Link href="/" className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#e8dce5] bg-white px-4 py-2 text-sm font-semibold text-[#67435d] transition hover:border-[#bfa8b8] hover:bg-[#fff4ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]">
            <ArrowLeft className="size-4" aria-hidden="true" />{t('back')}
          </Link>
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">{language === 'fr' ? 'Informations légales' : 'Legal information'}</p>
          <h1 className="font-editorial max-w-4xl text-[clamp(3rem,6vw,5.5rem)] leading-[1.02] tracking-[-.055em]">{currentContent.title}</h1>
          <p className="mt-5 text-sm text-[#807581]">{currentContent.lastUpdate}</p>

          <div className="mt-12 grid items-start gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-16">
            <aside className="hidden lg:sticky lg:top-24 lg:block">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">{language === 'fr' ? 'Sommaire' : 'Contents'}</p>
              <nav aria-label={language === 'fr' ? 'Sommaire des conditions d’utilisation' : 'Terms of service contents'} className="space-y-1 border-l border-[#e6dae3] pl-4">
                {currentContent.sections.map((section, i) => <a key={i} href={`#section-${i + 1}`} className="block py-1.5 text-sm leading-5 text-[#796d79] transition hover:text-[#b84432] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]">{section.title}</a>)}
              </nav>
            </aside>
            <div className="space-y-4">
              {currentContent.sections.map((section, i) => (
                <section id={`section-${i + 1}`} key={i} className="scroll-mt-24 rounded-[1.35rem] border border-[#ebe2e8] bg-white p-6 shadow-[0_14px_38px_-34px_rgba(58,32,55,.35)] sm:p-8">
                  <h2 className="font-editorial text-2xl leading-snug text-[#352936] sm:text-[1.7rem]">{section.title}</h2>
                  <div className="mt-4 whitespace-pre-line text-sm leading-7 text-[#6f6470] sm:text-[15px]">{section.content}</div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </FeaturePageShell>
  )
}
