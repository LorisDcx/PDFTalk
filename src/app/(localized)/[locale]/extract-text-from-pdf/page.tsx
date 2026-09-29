import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StudyPdfInspector } from '@/components/study-pdf-inspector'
import { STUDY_PDF_LOCALES, studyPdfCopy, studyPdfPath, type StudyPdfLocale } from '@/lib/study-pdf-locales'

function validLocale(value: string): value is StudyPdfLocale {
  return value !== 'fr' && STUDY_PDF_LOCALES.includes(value as StudyPdfLocale)
}

export function generateStaticParams() {
  return STUDY_PDF_LOCALES.filter(locale => locale !== 'fr').map(locale => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  if (!validLocale(locale)) return {}
  const copy = studyPdfCopy[locale]
  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical: studyPdfPath(locale),
      languages: Object.fromEntries(STUDY_PDF_LOCALES.map(item => [item, studyPdfPath(item)])),
    },
    openGraph: { title: copy.title, description: copy.description, url: `https://cramdesk.com${studyPdfPath(locale)}` },
  }
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!validLocale(locale)) notFound()
  return <StudyPdfInspector locale={locale} />
}
