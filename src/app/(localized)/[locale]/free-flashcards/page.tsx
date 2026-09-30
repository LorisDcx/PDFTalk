import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FreeFlashcardsLandingPage } from '@/components/free-flashcards-landing-page'
import { curatedDeckCopy, freeFlashcardsAlternates, freeFlashcardsPath } from '@/lib/curated-decks'
import { PDF_EXTRA_LOCALES, type ExtraPdfLocale } from '@/lib/pdf-tool-locales'

export function generateStaticParams() { return PDF_EXTRA_LOCALES.map(locale => ({ locale })) }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!PDF_EXTRA_LOCALES.includes(locale as ExtraPdfLocale)) return {}
  const current = locale as ExtraPdfLocale
  const c = curatedDeckCopy[current]
  const path = freeFlashcardsPath(current)
  return { title: `${c.title} | CramDesk`, description: c.intro, alternates: { canonical: path, languages: freeFlashcardsAlternates() }, openGraph: { title: `${c.title} | CramDesk`, description: c.intro, url: `https://www.cramdesk.com${path}` } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!PDF_EXTRA_LOCALES.includes(locale as ExtraPdfLocale)) notFound()
  const current = locale as ExtraPdfLocale
  return <FreeFlashcardsLandingPage locale={current} />
}
