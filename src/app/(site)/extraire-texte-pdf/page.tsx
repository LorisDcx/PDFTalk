import type { Metadata } from 'next'
import { StudyPdfInspector } from '@/components/study-pdf-inspector'
import { STUDY_PDF_LOCALES, studyPdfCopy, studyPdfPath } from '@/lib/study-pdf-locales'

const copy = studyPdfCopy.fr

export const metadata: Metadata = {
  title: copy.title,
  description: copy.description,
  alternates: {
    canonical: studyPdfPath('fr'),
    languages: Object.fromEntries(STUDY_PDF_LOCALES.map(locale => [locale, studyPdfPath(locale)])),
  },
  openGraph: { title: copy.title, description: copy.description, url: `https://cramdesk.com${studyPdfPath('fr')}` },
}

export default function Page() { return <StudyPdfInspector locale="fr" /> }
