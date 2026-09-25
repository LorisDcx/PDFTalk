import type { Metadata } from 'next'
import LandingPage from '@/components/landing-page'
import { languageAlternates } from '@/lib/seo-locales'

export const metadata: Metadata = {
  title: 'CramDesk | PDF en fiches de révision, flashcards et quiz',
  description: 'Transforme un PDF de cours en résumé structuré, flashcards et quiz pour réviser activement. Essai de 7 jours sans carte bancaire.',
  alternates: { canonical: '/', languages: languageAlternates },
  openGraph: {
    title: 'CramDesk | Révise tes PDF avec des fiches, flashcards et quiz',
    description: 'Importe ton cours PDF, comprends l’essentiel et entraîne-toi avec des cartes et des quiz.',
    url: 'https://cramdesk.com/',
  },
}

export default function Page() {
  return <LandingPage />
}
