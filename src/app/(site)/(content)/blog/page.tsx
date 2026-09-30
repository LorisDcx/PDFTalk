import type { Metadata } from 'next'
import { BlogIndex } from '@/components/blog-pages'
import { LocalePreference } from '@/components/locale-preference'
import { blogAlternates, blogCopy } from '@/lib/blog-content'

export const metadata: Metadata = {
  title: blogCopy.fr.indexTitle,
  description: blogCopy.fr.indexDescription,
  alternates: { canonical: '/blog', languages: blogAlternates() },
  openGraph: { title: blogCopy.fr.indexTitle, description: blogCopy.fr.indexDescription, url: 'https://www.cramdesk.com/blog' },
}

export default function Page() { return <><LocalePreference locale="fr" /><BlogIndex locale="fr" /></> }
