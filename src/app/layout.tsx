import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { LanguageProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Cramdesk – Ton bureau d\'urgence pour réviser',
  description: 'Transforme tes cours PDF en fiches, flashcards et quiz en 2 minutes grâce à l\'IA. L\'outil parfait pour réviser efficacement.',
  keywords: ['révision', 'flashcards', 'quiz', 'fiches de révision', 'étudiant', 'cours PDF', 'IA', 'cramdesk', 'réviser PDF'],
  authors: [{ name: 'Cramdesk' }],
  creator: 'Cramdesk',
  publisher: 'Cramdesk',
  metadataBase: new URL('https://cramdesk.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://cramdesk.com',
    siteName: 'Cramdesk',
    title: 'Cramdesk – Ton bureau d\'urgence pour réviser',
    description: 'Transforme tes cours PDF en fiches, flashcards et quiz en 2 minutes grâce à l\'IA.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Cramdesk - Révise efficacement avec l\'IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cramdesk – Ton bureau d\'urgence pour réviser',
    description: 'Transforme tes cours PDF en fiches, flashcards et quiz en 2 minutes grâce à l\'IA.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
    other: [
      { rel: 'icon', url: '/logo.png', sizes: '256x256' },
      { rel: 'icon', url: '/logo.png', sizes: '512x512' },
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <meta
          name="google-site-verification"
          content="ebHXmc3bop6UAKkNwRXDllTMWIeHcHEInsoJeYxrNA4"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
