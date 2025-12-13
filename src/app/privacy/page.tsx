'use client'

import Link from 'next/link'
import { Navbar } from '@/components/navbar'
import { FileText, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/i18n'

export default function PrivacyPage() {
  const { t, language } = useLanguage()

  const content = {
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdate: 'Dernière mise à jour : Décembre 2024',
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

• Données de compte : email, mot de passe (chiffré)
• Documents PDF : vos cours uploadés pour analyse
• Données générées : flashcards, quiz, résumés créés
• Données techniques : logs de connexion, préférences

Nous ne collectons PAS de données sensibles (santé, opinions, etc.).`
        },
        {
          title: '3. Utilisation des données',
          content: `Vos données sont utilisées exclusivement pour :

• Analyser vos PDF et générer les outils de révision
• Sauvegarder votre progression et vos créations
• Améliorer la qualité de notre IA
• Vous envoyer des notifications liées à votre compte

Nous ne vendons JAMAIS vos données à des tiers.`
        },
        {
          title: '4. Stockage et sécurité',
          content: `Vos données sont protégées par :

• Chiffrement SSL/TLS pour toutes les communications
• Stockage sécurisé sur des serveurs européens (Supabase)
• Accès restreint aux données personnelles
• Mots de passe hashés (non lisibles)

Vos PDF sont stockés de manière chiffrée et ne sont accessibles que par vous.`
        },
        {
          title: '5. Conservation des données',
          content: `• Données de compte : conservées tant que votre compte est actif
• Documents PDF : conservés jusqu'à suppression manuelle
• Flashcards et quiz : conservés localement dans votre navigateur

Vous pouvez supprimer votre compte et toutes vos données à tout moment depuis les paramètres.`
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

• Session : maintenir votre connexion
• Préférences : langue, thème

Aucun cookie publicitaire ou de tracking tiers.`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdate: 'Last updated: December 2024',
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

• Account data: email, password (encrypted)
• PDF documents: your courses uploaded for analysis
• Generated data: flashcards, quizzes, summaries created
• Technical data: connection logs, preferences

We do NOT collect sensitive data (health, opinions, etc.).`
        },
        {
          title: '3. Data usage',
          content: `Your data is used exclusively to:

• Analyze your PDFs and generate revision tools
• Save your progress and creations
• Improve the quality of our AI
• Send you account-related notifications

We NEVER sell your data to third parties.`
        },
        {
          title: '4. Storage and security',
          content: `Your data is protected by:

• SSL/TLS encryption for all communications
• Secure storage on European servers (Supabase)
• Restricted access to personal data
• Hashed passwords (not readable)

Your PDFs are stored encrypted and only accessible by you.`
        },
        {
          title: '5. Data retention',
          content: `• Account data: kept as long as your account is active
• PDF documents: kept until manual deletion
• Flashcards and quizzes: stored locally in your browser

You can delete your account and all data at any time from settings.`
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

• Session: maintain your login
• Preferences: language, theme

No advertising or third-party tracking cookies.`
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
            <span className="font-semibold">Cramdesk</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cramdesk. {t('allRightsReserved')}
          </p>
        </div>
      </footer>
    </div>
  )
}
