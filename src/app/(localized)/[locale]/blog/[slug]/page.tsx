import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogArticlePage } from '@/components/blog-pages'
import { ArticleJsonLd } from '@/components/json-ld'
import { LocalePreference } from '@/components/locale-preference'
import { PublicSiteHeader } from '@/components/public-site-header'
import { EditorialFooter } from '@/components/editorial-footer'
import { blogAlternates, blogArticleFromSlug, blogArticlePath, blogCopy, BLOG_IDS } from '@/lib/blog-content'
import { SEO_LOCALES, type SeoLocale } from '@/lib/seo-locales'

export function generateStaticParams() { return SEO_LOCALES.flatMap(locale => BLOG_IDS.map(id => ({ locale, slug: blogCopy[locale].articles[id].slug }))) }
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale)) return {}
  const current = locale as SeoLocale
  const id = blogArticleFromSlug(current, slug)
  if (!id) return {}
  const article = blogCopy[current].articles[id]
  return { title: article.title, description: article.description, alternates: { canonical: blogArticlePath(current, id), languages: blogAlternates(id) }, openGraph: { type: 'article', title: article.title, description: article.description, url: `https://www.cramdesk.com${blogArticlePath(current, id)}`, images: ['/og-image.png'] } }
}
export default async function Page({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  if (!SEO_LOCALES.includes(locale as SeoLocale)) notFound()
  const current = locale as SeoLocale
  const id = blogArticleFromSlug(current, slug)
  if (!id) notFound()
  const article = blogCopy[current].articles[id]
  return <><LocalePreference locale={current} /><ArticleJsonLd headline={article.title} description={article.description} authorName="CramDesk" authorType="Organization" datePublished="2026-09-30T12:00:00+02:00" url={`https://www.cramdesk.com${blogArticlePath(current, id)}`} image="https://www.cramdesk.com/og-image.png" /><PublicSiteHeader locale={current} /><BlogArticlePage locale={current} id={id} /><EditorialFooter locale={current} /></>
}
