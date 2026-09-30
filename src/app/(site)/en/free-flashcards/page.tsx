import type { Metadata } from 'next'
import { FreeFlashcardsLandingPage } from '@/components/free-flashcards-landing-page'
import { freeFlashcardsAlternates } from '@/lib/curated-decks'

export const metadata: Metadata = {
  title: 'Free Flashcards Online, No Sign-Up | CramDesk',
  description: 'Study free flashcards in biology, chemistry, math and more, or create your own deck. No account needed. Your cards stay in your browser.',
  keywords: ['free flashcards', 'flashcard maker', 'flashcards without signup', 'online flashcards', 'active recall'],
  alternates: { canonical: '/en/free-flashcards', languages: freeFlashcardsAlternates() },
  openGraph: { title: 'Free Flashcards Online, No Sign-Up | CramDesk', description: 'Choose a subject, study, and create free flashcards.', url: 'https://www.cramdesk.com/en/free-flashcards', locale: 'en_US' },
}

export default function Page() { return <FreeFlashcardsLandingPage locale="en" /> }