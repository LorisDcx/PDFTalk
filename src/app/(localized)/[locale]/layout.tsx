import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../../globals.css'
import { AuthProvider } from '@/components/auth-provider'
import { LanguageProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/toaster'
import { SEO_LOCALES, type SeoLocale } from '@/lib/seo-locales'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://cramdesk.com'),
  icons: { icon: '/logo.png', apple: '/logo.png' },
  manifest: '/site.webmanifest',
}

export default async function LocalizedLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const language = SEO_LOCALES.includes(locale as SeoLocale) ? locale : 'en'
  return (
    <html lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} data-scroll-behavior="smooth">
      <body className={inter.className} style={language === 'ar' ? { fontFamily: 'Tahoma, Arial, sans-serif' } : undefined}>
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
