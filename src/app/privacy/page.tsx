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
          title: '1. Collecte des données',
          content: `Nous collectons les données suivantes :
          - Informations de compte (email, nom)
          - Documents PDF que vous uploadez pour analyse
          - Données d'utilisation et analytiques
          
          Vos documents sont traités de manière sécurisée et ne sont jamais partagés avec des tiers.`
        },
        {
          title: '2. Utilisation des données',
          content: `Nous utilisons vos données pour :
          - Fournir nos services d'analyse de documents
          - Améliorer notre IA et nos algorithmes
          - Vous contacter concernant votre compte
          - Assurer la sécurité de la plateforme`
        },
        {
          title: '3. Stockage et sécurité',
          content: `Vos données sont stockées de manière sécurisée avec :
          - Chiffrement SSL/TLS pour toutes les transmissions
          - Stockage chiffré pour les documents
          - Accès restreint aux données personnelles
          - Suppression automatique des documents après 30 jours`
        },
        {
          title: '4. Vos droits',
          content: `Conformément au RGPD, vous avez le droit de :
          - Accéder à vos données personnelles
          - Rectifier vos données
          - Supprimer vos données
          - Exporter vos données
          
          Contactez-nous à privacy@pdftalk.app pour exercer ces droits.`
        },
        {
          title: '5. Cookies',
          content: `Nous utilisons des cookies essentiels pour :
          - Maintenir votre session de connexion
          - Mémoriser vos préférences de langue
          - Analyser l'utilisation du site (analytics anonymisés)`
        },
        {
          title: '6. Contact',
          content: `Pour toute question concernant cette politique, contactez-nous :
          Email : privacy@pdftalk.app`
        }
      ]
    },
    en: {
      title: 'Privacy Policy',
      lastUpdate: 'Last updated: December 2024',
      sections: [
        {
          title: '1. Data Collection',
          content: `We collect the following data:
          - Account information (email, name)
          - PDF documents you upload for analysis
          - Usage data and analytics
          
          Your documents are processed securely and never shared with third parties.`
        },
        {
          title: '2. Data Usage',
          content: `We use your data to:
          - Provide our document analysis services
          - Improve our AI and algorithms
          - Contact you about your account
          - Ensure platform security`
        },
        {
          title: '3. Storage and Security',
          content: `Your data is stored securely with:
          - SSL/TLS encryption for all transmissions
          - Encrypted storage for documents
          - Restricted access to personal data
          - Automatic document deletion after 30 days`
        },
        {
          title: '4. Your Rights',
          content: `Under GDPR, you have the right to:
          - Access your personal data
          - Rectify your data
          - Delete your data
          - Export your data
          
          Contact us at privacy@pdftalk.app to exercise these rights.`
        },
        {
          title: '5. Cookies',
          content: `We use essential cookies to:
          - Maintain your login session
          - Remember your language preferences
          - Analyze site usage (anonymized analytics)`
        },
        {
          title: '6. Contact',
          content: `For any questions about this policy, contact us:
          Email: privacy@pdftalk.app`
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
