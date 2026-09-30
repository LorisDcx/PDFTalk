import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogIndex } from '@/components/blog-pages'
import { LocalePreference } from '@/components/locale-preference'
import { PublicSiteHeader } from '@/components/public-site-header'
import { EditorialFooter } from '@/components/editorial-footer'
import { blogAlternates, blogCopy, blogIndexPath } from '@/lib/blog-content'
import { SEO_LOCALES, type SeoLocale } from '@/lib/seo-locales'

export function generateStaticParams() { return SEO_LOCALES.map(locale => ({ locale })) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale)) return {}
  const c = blogCopy[locale as SeoLocale]
  return { title: c.indexTitle, description: c.indexDescription, alternates: { canonical: blogIndexPath(locale as SeoLocale), languages: blogAlternates() }, openGraph: { title: c.indexTitle, description: c.indexDescription, url: `https://www.cramdesk.com${blogIndexPath(locale as SeoLocale)}` } }
}
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale)) notFound()
  const current = locale as SeoLocale
  return <><LocalePreference locale={current} /><PublicSiteHeader locale={current} /><BlogIndex locale={current} /><EditorialFooter locale={current} /></>
}
