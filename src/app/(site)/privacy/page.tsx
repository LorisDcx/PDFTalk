'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { useLanguage } from '@/lib/i18n'

export default function PrivacyPage() {
  const { t, language } = useLanguage()

  const content = {
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdate: 'Dernière mise à jour : Septembre 2026',
      sections: [
        {
          title: '1. Qui sommes-nous ?',
          content: `Cramdesk est un service d'aide à la révision pour étudiants. Nous utilisons l'intelligence artificielle pour transformer vos cours PDF en outils de révision (flashcards, quiz, résumés).

Responsable du traitement : Cramdesk
Contact : contact.cramdesk@gmail.com`
        },
        {
          title: '2. Données collectées',
          content: `Nous collectons uniquement les données nécessaires au fonctionnement du service :

• Données de compte : email, nom fourni et mot de passe haché par le service d’authentification
• Documents PDF importés et texte extrait pour l’analyse
• Contenus générés : synthèses, flashcards et quiz
• Données d’usage nécessaires au service : quotas, statut d’abonnement et préférences

Un PDF importé peut lui-même contenir des données personnelles. Évitez d’y inclure des informations sensibles dont l’analyse n’est pas nécessaire.`
        },
        {
          title: '3. Utilisation des données',
          content: `Vos données sont utilisées exclusivement pour :

• Analyser vos PDF et générer les outils de révision
• Sauvegarder votre progression et vos créations
• Gérer votre compte, vos quotas et votre abonnement
• Répondre aux demandes envoyées par le formulaire de contact

Nous ne vendons pas vos données à des tiers.`
        },
        {
          title: '4. Stockage et sécurité',
          content: `Vos données sont protégées par :

• Connexions protégées par HTTPS/TLS
• Stockage privé des PDF et règles d’accès par compte dans Supabase
• Mots de passe hachés par le service d’authentification

L’analyse des documents nécessite un traitement côté serveur et l’envoi du texte extrait au prestataire d’IA. Les utilisateurs ne peuvent pas consulter les documents d’un autre compte par l’interface du service.`
        },
        {
          title: '5. Conservation des données',
          content: `• Données de compte : conservées tant que votre compte est actif
• Documents PDF : conservés jusqu'à suppression manuelle
• Synthèses et flashcards : enregistrées avec le document dans votre compte ; certaines copies sont aussi conservées localement dans votre navigateur
• Quiz, présentations et progression locale : conservés dans le navigateur jusqu’à effacement de ses données

Vous pouvez supprimer un document ou demander la suppression de votre compte depuis les paramètres. Les données enregistrées uniquement dans votre navigateur doivent être effacées sur l’appareil concerné.`
        },
        {
          title: '6. Vos droits (RGPD)',
          content: `Conformément au RGPD, vous disposez des droits suivants :

• Accès : consulter vos données personnelles
• Rectification : corriger vos informations
• Suppression : effacer votre compte et données
• Portabilité : exporter vos données
• Opposition : refuser certains traitements

Pour exercer ces droits : contact.cramdesk@gmail.com`
        },
        {
          title: '7. Cookies',
          content: `Nous utilisons uniquement des cookies essentiels :

• Cookies de session : maintenir votre connexion
• Stockage local du navigateur : langue, outils de révision et progression

Le site ne dépose pas de cookie publicitaire ou de suivi tiers.`
        },
        {
          title: '8. Prestataires du service',
          content: `Le fonctionnement de CramDesk repose sur Supabase (authentification, base de données et fichiers), OpenAI (génération des contenus de révision), Stripe (paiements et abonnements) et Resend (envoi des messages de contact). Les données nécessaires à chaque fonction sont transmises au prestataire concerné. Pour connaître leurs lieux de traitement et durées de conservation applicables à votre configuration, contactez-nous.`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdate: 'Last updated: September 2026',
      sections: [
        {
          title: '1. Who are we?',
          content: `Cramdesk is a study aid service for students. We use artificial intelligence to transform your PDF courses into revision tools (flashcards, quizzes, summaries).

Data controller: Cramdesk
Contact: contact.cramdesk@gmail.com`
        },
        {
          title: '2. Data collected',
          content: `We only collect data necessary for the service:

• Account data: email, name provided, and a password hashed by the authentication service
• Uploaded PDFs and extracted text for analysis
• Generated content: summaries, flashcards and quizzes
• Service usage data: quotas, subscription status and preferences

An uploaded PDF may itself contain personal data. Avoid including sensitive information that does not need to be analyzed.`
        },
        {
          title: '3. Data usage',
          content: `Your data is used exclusively to:

• Analyze your PDFs and generate revision tools
• Save your progress and creations
• Manage your account, quotas and subscription
• Respond to requests sent through the contact form

We do not sell your data to third parties.`
        },
        {
          title: '4. Storage and security',
          content: `Your data is protected by:

• HTTPS/TLS connections
• Private PDF storage and account-based access rules in Supabase
• Passwords hashed by the authentication service

Document analysis requires server-side processing and sending extracted text to the AI provider. Users cannot access another account’s documents through the service interface.`
        },
        {
          title: '5. Data retention',
          content: `• Account data: kept as long as your account is active
• PDF documents: kept until manual deletion
• Summaries and flashcards: saved with the document in your account; some copies are also kept locally in your browser
• Quizzes, presentations and local progress: stored in your browser until its data is cleared

You can delete a document or request account deletion from settings. Data stored only in your browser must be cleared on the relevant device.`
        },
        {
          title: '6. Your rights (GDPR)',
          content: `Under GDPR, you have the following rights:

• Access: view your personal data
• Rectification: correct your information
• Deletion: erase your account and data
• Portability: export your data
• Opposition: refuse certain processing

To exercise these rights: contact.cramdesk@gmail.com`
        },
        {
          title: '7. Cookies',
          content: `We only use essential cookies:

• Session cookies: maintain your login
• Browser local storage: language, study tools and progress

The site does not set third-party advertising or tracking cookies.`
        },
        {
          title: '8. Service providers',
          content: `CramDesk uses Supabase (authentication, database and files), OpenAI (study-content generation), Stripe (payments and subscriptions), and Resend (contact-message delivery). The data needed for each feature is sent to the relevant provider. Contact us for details of processing locations and retention periods applicable to your configuration.`
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
              <nav aria-label={language === 'fr' ? 'Sommaire de la politique de confidentialité' : 'Privacy policy contents'} className="space-y-1 border-l border-[#e6dae3] pl-4">
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
