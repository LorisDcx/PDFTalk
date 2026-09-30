import type { Metadata } from 'next'
import { FreeFlashcardsLandingPage } from '@/components/free-flashcards-landing-page'
import { freeFlashcardsAlternates } from '@/lib/curated-decks'

export const metadata: Metadata = {
  title: 'Flashcards gratuites sans inscription | Créer et réviser | CramDesk',
  description: 'Révise des flashcards gratuites en biologie, chimie, maths et plus, ou crée ton propre jeu. Sans inscription : tes cartes restent sur ton appareil.',
  keywords: ['flashcards gratuites', 'créer des flashcards', 'cartes mémoire en ligne', 'flashcards sans inscription', 'rappel actif'],
  alternates: { canonical: '/flashcards-gratuites', languages: freeFlashcardsAlternates() },
  openGraph: { title: 'Flashcards gratuites sans inscription | CramDesk', description: 'Choisis une matière, révise et crée tes cartes mémoire gratuites.', url: 'https://www.cramdesk.com/flashcards-gratuites' },
}

export default function Page() { return <FreeFlashcardsLandingPage locale="fr" /> }