import type { Metadata } from 'next'
import { PdfToolsLanding } from '@/components/pdf-tools-landing'

export const metadata: Metadata = {
  title: 'Free PDF Tools: Merge, Extract, Rotate | CramDesk',
  description: 'Eight free PDF tools with no account: merge, extract, reorder, rotate, page numbers, watermark, clear metadata and convert images. All processed on your device.',
  alternates: { canonical: '/en/pdf-tools', languages: { fr: '/outils-pdf', en: '/en/pdf-tools' } },
  openGraph: { title: 'Free PDF Tools | CramDesk', description: 'Eight PDF tools in your browser. No account or file upload.', url: 'https://cramdesk.com/en/pdf-tools' },
}

export default function Page() { return <PdfToolsLanding locale="en" /> }
