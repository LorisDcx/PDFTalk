import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MedicalFlashcardsLandingPage } from '@/components/medical-flashcards-landing-page'
import { medicalFlashcardsCopy } from '@/lib/medical-flashcards-copy'
import { medicalFlashcardsAlternates, medicalFlashcardsPath } from '@/lib/medical-decks'
import { SEO_LOCALES, type SeoLocale } from '@/lib/seo-locales'

const seoTitles: Record<SeoLocale, string> = {
  en: 'Free medical flashcards: anatomy and physiology | CramDesk',
  es: 'Tarjetas de medicina gratis: anatomía y fisiología | CramDesk',
  de: 'Kostenlose Medizin-Karteikarten: Anatomie & Physiologie | CramDesk',
  it: 'Flashcard medicina gratis: anatomia e fisiologia | CramDesk',
  pt: 'Cartões de medicina grátis: anatomia e fisiologia | CramDesk',
  zh: '免费医学记忆卡片：人体解剖与生理 | CramDesk',
  ja: '無料の医学フラッシュカード：解剖学・生理学 | CramDesk',
  ar: 'بطاقات طب مجانية: التشريح والفسيولوجيا | CramDesk',
}

export function generateStaticParams() { return SEO_LOCALES.map(locale => ({ locale })) }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale)) return {}
  const current = locale as SeoLocale
  const c = medicalFlashcardsCopy[current]
  const path = medicalFlashcardsPath(current)
  return { title: seoTitles[current], description: c.intro, alternates: { canonical: path, languages: medicalFlashcardsAlternates() }, openGraph: { title: seoTitles[current], description: c.intro, url: `https://www.cramdesk.com${path}` } }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale)) notFound()
  return <MedicalFlashcardsLandingPage locale={locale as SeoLocale} />
}
