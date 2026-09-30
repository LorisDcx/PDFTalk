import type { Metadata } from 'next'
import { MedicalFlashcardsLandingPage } from '@/components/medical-flashcards-landing-page'
import { medicalFlashcardsAlternates } from '@/lib/medical-decks'

export const metadata: Metadata = {
  title: 'Flashcards médecine gratuites : anatomie et physiologie | CramDesk',
  description: 'Révise l’anatomie et la physiologie avec 40 flashcards gratuites, modifiables et sans inscription. Méthode de rappel actif pour les étudiants en médecine.',
  alternates: { canonical: '/flashcards-medecine', languages: medicalFlashcardsAlternates() },
  openGraph: { title: 'Flashcards médecine gratuites | CramDesk', description: 'Deux jeux de 20 cartes en anatomie et physiologie, à réviser sans compte.', url: 'https://www.cramdesk.com/flashcards-medecine' },
}

export default function Page() { return <MedicalFlashcardsLandingPage locale="fr" /> }
