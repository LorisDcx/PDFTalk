import type { MetadataRoute } from 'next'
import { SEO_LOCALES } from '@/lib/seo-locales'

const baseUrl = 'https://cramdesk.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPaths = [
    '/', '/pour-etudiants', '/fiches-revision', '/quiz-pdf',
    '/flashcards-landing', '/quiz', '/pdf', '/resume', '/humanizer',
    '/planificateur-revisions', '/calculateur-moyenne', '/flashcards-gratuites',
    '/en/free-flashcards', '/contact', '/privacy', '/terms',
  ]

  return [...publicPaths, ...SEO_LOCALES.map(locale => `/${locale}`)]
    .map(path => ({ url: `${baseUrl}${path === '/' ? '' : path}` }))
}
