import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api$', '/api/', '/auth$', '/auth/'],
    },
    // Auth screens and private routes may be crawled so their noindex can be read.
    // Authentication, not robots.txt, protects student documents.
    sitemap: 'https://www.cramdesk.com/sitemap.xml',
  }
}
