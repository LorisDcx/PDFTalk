import { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://cramdesk.com'

const marketingRoutes: MetadataRoute.Sitemap = [
  {
    url: '/',
    priority: 1,
    changeFrequency: 'weekly',
  },
  { url: '/signup', priority: 0.7 },
  { url: '/login', priority: 0.4 },
  { url: '/contact', priority: 0.6 },
  { url: '/privacy', priority: 0.4, changeFrequency: 'yearly' },
  { url: '/terms', priority: 0.4, changeFrequency: 'yearly' },
  { url: '/pour-etudiants', priority: 0.7 },
  { url: '/fiches-revision', priority: 0.7 },
  { url: '/quiz-pdf', priority: 0.7 },
  { url: '/humanizer', priority: 0.85 },
  { url: '/flashcards-landing', priority: 0.85 },
  { url: '/quiz', priority: 0.85 },
  { url: '/pdf', priority: 0.85 },
  { url: '/resume', priority: 0.85 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return marketingRoutes.map((entry) => ({
    url: `${BASE_URL}${entry.url}`,
    lastModified,
    changeFrequency: entry.changeFrequency ?? 'monthly',
    priority: entry.priority ?? 0.5,
  }))
}
