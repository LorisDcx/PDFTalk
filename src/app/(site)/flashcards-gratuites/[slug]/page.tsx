import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CuratedDeckPage } from '@/components/curated-deck-page'
import { EditorialFooter } from '@/components/editorial-footer'
import { LocalePreference } from '@/components/locale-preference'
import { PublicSiteHeader } from '@/components/public-site-header'
import { CURATED_DECK_IDS, curatedDeckAlternates, curatedDeckCopy, curatedDeckPath, type CuratedDeckId } from '@/lib/curated-decks'

export function generateStaticParams() { return CURATED_DECK_IDS.map(slug => ({ slug })) }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  if (!CURATED_DECK_IDS.includes(slug as CuratedDeckId)) return {}
  const deck = curatedDeckCopy.fr.deck[slug as CuratedDeckId]
  const path = curatedDeckPath('fr', slug as CuratedDeckId)
  return { title: `Flashcards ${deck.title} gratuites | CramDesk`, description: `${deck.description} ${deck.cards.length} cartes gratuites pour réviser sans inscription.`, alternates: { canonical: path, languages: curatedDeckAlternates(slug as CuratedDeckId) }, openGraph: { title: `Flashcards ${deck.title} | CramDesk`, description: deck.description, url: `https://www.cramdesk.com${path}` } }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!CURATED_DECK_IDS.includes(slug as CuratedDeckId)) notFound()
  return <><LocalePreference locale="fr" /><PublicSiteHeader locale="fr" /><CuratedDeckPage locale="fr" id={slug as CuratedDeckId} /><EditorialFooter locale="fr" /></>
}
