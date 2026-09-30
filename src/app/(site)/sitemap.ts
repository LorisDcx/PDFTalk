import type { MetadataRoute } from 'next'
import { SEO_LOCALES } from '@/lib/seo-locales'
import { pdfToolPages, pdfToolPath } from '@/lib/pdf-tool-pages'
import { STUDY_PDF_LOCALES, studyPdfPath } from '@/lib/study-pdf-locales'
import { PDF_EXTRA_LOCALES, pdfHubPath } from '@/lib/pdf-tool-locales'
import { BLOG_IDS, blogAlternates, blogArticlePath, blogIndexPath } from '@/lib/blog-content'

const baseUrl = 'https://www.cramdesk.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPaths = [
    '/', '/pour-etudiants', '/fiches-revision', '/quiz-pdf',
    '/flashcards-landing', '/quiz', '/pdf', '/resume', '/humanizer',
    '/planificateur-revisions', '/calculateur-moyenne', '/flashcards-gratuites',
    '/outils-pdf', '/en/pdf-tools', '/en/free-flashcards', '/contact', '/privacy', '/terms',
    '/blog/how-to-turn-pdf-into-flashcards', '/compare/quizlet-alternative',
    '/use-cases/medical-students', '/use-cases/language-learning', '/use-cases/law-students',
  ]

  const toolPaths = pdfToolPages.flatMap(page => [pdfToolPath(page, 'fr'), pdfToolPath(page, 'en')])
  const standardPaths = [...publicPaths, ...toolPaths, ...STUDY_PDF_LOCALES.map(studyPdfPath), ...PDF_EXTRA_LOCALES.map(pdfHubPath), ...SEO_LOCALES.map(locale => `/${locale}`)]
  const blogPaths = STUDY_PDF_LOCALES.flatMap(locale => [
    { url: `${baseUrl}${blogIndexPath(locale)}`, alternates: { languages: Object.fromEntries(Object.entries(blogAlternates()).map(([language, path]) => [language, `${baseUrl}${path}`])) } },
    ...BLOG_IDS.map(id => ({ url: `${baseUrl}${blogArticlePath(locale, id)}`, alternates: { languages: Object.fromEntries(Object.entries(blogAlternates(id)).map(([language, path]) => [language, `${baseUrl}${path}`])) } })),
  ])
  return [...standardPaths.map(path => ({ url: `${baseUrl}${path === '/' ? '' : path}` })), ...blogPaths]
}
