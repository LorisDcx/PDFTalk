import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BlogArticlePage } from '@/components/blog-pages'
import { ArticleJsonLd } from '@/components/json-ld'
import { LocalePreference } from '@/components/locale-preference'
import { blogAlternates, blogArticleFromSlug, blogArticlePath, blogCopy, BLOG_IDS } from '@/lib/blog-content'

export function generateStaticParams() { return BLOG_IDS.map(id => ({ slug: blogCopy.fr.articles[id].slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const id = blogArticleFromSlug('fr', slug)
  if (!id) return {}
  const article = blogCopy.fr.articles[id]
  return { title: article.title, description: article.description, alternates: { canonical: blogArticlePath('fr', id), languages: blogAlternates(id) }, openGraph: { type: 'article', title: article.title, description: article.description, url: `https://www.cramdesk.com${blogArticlePath('fr', id)}`, images: ['/og-image.png'] } }
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const id = blogArticleFromSlug('fr', slug)
  if (!id) notFound()
  const article = blogCopy.fr.articles[id]
  return <><LocalePreference locale="fr" /><ArticleJsonLd headline={article.title} description={article.description} authorName="CramDesk" authorType="Organization" datePublished="2026-09-30T12:00:00+02:00" url={`https://www.cramdesk.com${blogArticlePath('fr', id)}`} image="https://www.cramdesk.com/og-image.png" /><BlogArticlePage locale="fr" id={id} /></>
}
