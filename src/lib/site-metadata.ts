import type { Metadata } from 'next'

export const siteMetadata: Metadata = {
  title: 'CramDesk | PDF en fiches de révision, flashcards et quiz',
  description: 'Transforme tes cours PDF en fiches claires, flashcards et quiz. Comprends l’essentiel et entraîne-toi pendant un essai de 7 jours.',
  keywords: ['révision', 'flashcards', 'quiz', 'fiches de révision', 'étudiant', 'cours PDF', 'IA', 'cramdesk', 'réviser PDF'],
  authors: [{ name: 'CramDesk' }],
  creator: 'CramDesk',
  publisher: 'CramDesk',
  metadataBase: new URL('https://www.cramdesk.com'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.cramdesk.com',
    siteName: 'CramDesk',
    title: 'CramDesk | Révise tes PDF avec des fiches, flashcards et quiz',
    description: 'Importe tes cours PDF, comprends l’essentiel et entraîne-toi avec des cartes et des quiz.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CramDesk : du PDF à la révision active' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CramDesk | PDF en fiches de révision, flashcards et quiz',
    description: 'Transforme tes cours PDF en fiches claires, flashcards et quiz pour réviser activement.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/flame-logo.png',
    shortcut: '/flame-logo.png',
    apple: '/flame-logo.png',
    other: [
      { rel: 'icon', url: '/flame-logo.png', sizes: '256x256' },
      { rel: 'icon', url: '/flame-logo.png', sizes: '512x512' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ebHXmc3bop6UAKkNwRXDllTMWIeHcHEInsoJeYxrNA4',
  },
}
