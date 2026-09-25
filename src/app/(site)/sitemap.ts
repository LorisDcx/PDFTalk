import type { MetadataRoute } from 'next'
import { SEO_LOCALES } from '@/lib/seo-locales'
import { pdfToolPages, pdfToolPath } from '@/lib/pdf-tool-pages'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://cramdesk.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPaths = [
    '/', '/pour-etudiants', '/fiches-revision', '/quiz-pdf',
    '/flashcards-landing', '/quiz', '/pdf', '/resume', '/humanizer',
    '/planificateur-revisions', '/calculateur-moyenne', '/flashcards-gratuites',
    '/outils-pdf', '/en/pdf-tools', '/en/free-flashcards', '/contact', '/privacy', '/terms',
    '/blog/best-quizlet-alternatives-2025', '/blog/how-to-turn-pdf-into-flashcards',
    '/blog/best-ai-flashcard-tools-2025', '/compare/quizlet-alternative',
    '/use-cases/medical-students', '/use-cases/language-learning', '/use-cases/law-students',
  ]

  const toolPaths = pdfToolPages.flatMap(page => [pdfToolPath(page, 'fr'), pdfToolPath(page, 'en')])
  return [...publicPaths, ...toolPaths, ...SEO_LOCALES.map(locale => `/${locale}`)]
    .map(path => ({ url: `${baseUrl}${path === '/' ? '' : path}` }))
}
