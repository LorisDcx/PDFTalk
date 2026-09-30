import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CuratedDeckPage } from '@/components/curated-deck-page'
import { EditorialFooter } from '@/components/editorial-footer'
import { LocalePreference } from '@/components/locale-preference'
import { PublicSiteHeader } from '@/components/public-site-header'
import { CURATED_DECK_IDS, curatedDeckAlternates, curatedDeckCopy, curatedDeckPath, type CuratedDeckId } from '@/lib/curated-decks'
import { SEO_LOCALES, type SeoLocale } from '@/lib/seo-locales'

export function generateStaticParams() { return SEO_LOCALES.flatMap(locale => CURATED_DECK_IDS.map(slug => ({ locale, slug }))) }

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale) || !CURATED_DECK_IDS.includes(slug as CuratedDeckId)) return {}
  const current = locale as SeoLocale
  const deck = curatedDeckCopy[current].deck[slug as CuratedDeckId]
  const path = curatedDeckPath(current, slug as CuratedDeckId)
  return { title: `${deck.title} | CramDesk Flashcards`, description: `${deck.description} ${deck.cards.length} ${curatedDeckCopy[current].cards}. ${curatedDeckCopy[current].intro}`, alternates: { canonical: path, languages: curatedDeckAlternates(slug as CuratedDeckId) }, openGraph: { title: `${deck.title} | CramDesk Flashcards`, description: deck.description, url: `https://www.cramdesk.com${path}` } }
}

export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale) || !CURATED_DECK_IDS.includes(slug as CuratedDeckId)) notFound()
  const current = locale as SeoLocale
  return <><LocalePreference locale={current} /><PublicSiteHeader locale={current} /><CuratedDeckPage locale={current} id={slug as CuratedDeckId} /><EditorialFooter locale={current} /></>
}
