import type { Metadata } from 'next'
import { PdfToolsLanding } from '@/components/pdf-tools-landing'
import { STUDY_PDF_LOCALES } from '@/lib/study-pdf-locales'
import { pdfHubPath } from '@/lib/pdf-tool-locales'

export const metadata: Metadata = {
  title: 'Free PDF Tools: Merge, Extract, Rotate | CramDesk',
  description: 'Eight free PDF tools with no account: merge, extract, reorder, rotate, page numbers, watermark, clear metadata and convert images. All processed on your device.',
  alternates: { canonical: '/en/pdf-tools', languages: Object.fromEntries(STUDY_PDF_LOCALES.map(locale => [locale, pdfHubPath(locale)])) },
  openGraph: { title: 'Free PDF Tools | CramDesk', description: 'Eight PDF tools in your browser. No account or file upload.', url: 'https://cramdesk.com/en/pdf-tools' },
}

export default function Page() { return <PdfToolsLanding locale="en" /> }
