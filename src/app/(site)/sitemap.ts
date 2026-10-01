import type { MetadataRoute } from 'next'
import { languageAlternates } from '@/lib/seo-locales'
import { pdfToolPages, pdfToolPath } from '@/lib/pdf-tool-pages'
import { STUDY_PDF_LOCALES, studyPdfPath } from '@/lib/study-pdf-locales'
import { pdfHubPath } from '@/lib/pdf-tool-locales'
import { BLOG_IDS, blogAlternates } from '@/lib/blog-content'
import { CURATED_DECK_IDS, curatedDeckAlternates, freeFlashcardsAlternates } from '@/lib/curated-decks'
import { medicalFlashcardsAlternates } from '@/lib/medical-decks'

const baseUrl = 'https://www.cramdesk.com'

function absolute(path: string) {
  return `${baseUrl}${path === '/' ? '' : path}`
}

function localizedPages(paths: Record<string, string>): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(Object.entries(paths).map(([language, path]) => [language, absolute(path)]))
  // x-default is a fallback, not an additional page. Each translation lists the same group.
  return [...new Set(Object.values(paths))].map(path => ({ url: absolute(path), alternates: { languages } }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPaths = [
    '/pour-etudiants', '/fiches-revision', '/quiz-pdf',
    '/flashcards-landing', '/quiz', '/pdf', '/resume', '/humanizer',
    '/planificateur-revisions', '/calculateur-moyenne',
    '/contact', '/privacy', '/terms',
    '/blog/how-to-turn-pdf-into-flashcards', '/compare/quizlet-alternative',
    '/use-cases/language-learning', '/use-cases/law-students',
  ]

  const homePages = localizedPages(languageAlternates)
  const pdfHubs = localizedPages(Object.fromEntries(STUDY_PDF_LOCALES.map(locale => [locale, pdfHubPath(locale)])))
  const studyPages = localizedPages(Object.fromEntries(STUDY_PDF_LOCALES.map(locale => [locale, studyPdfPath(locale)])))
  // Individual PDF tools currently have French and English pages only.
  const toolPages = pdfToolPages.flatMap(page => localizedPages({ fr: pdfToolPath(page, 'fr'), en: pdfToolPath(page, 'en') }))
  const blogPages = [
    ...localizedPages(blogAlternates()),
    ...BLOG_IDS.flatMap(id => localizedPages(blogAlternates(id))),
  ]
  const cardPages = [
    ...localizedPages(freeFlashcardsAlternates()),
    ...localizedPages(medicalFlashcardsAlternates()),
    ...CURATED_DECK_IDS.flatMap(id => localizedPages(curatedDeckAlternates(id))),
  ]
  // No synthetic lastModified date: a rebuild is not a content update.
  return [...publicPaths.map(path => ({ url: absolute(path) })), ...homePages, ...pdfHubs, ...studyPages, ...toolPages, ...blogPages, ...cardPages]
}
