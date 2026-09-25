import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PdfToolDetailPage } from '@/components/pdf-tool-detail-page'
import { findPdfToolPage, pdfToolPages, pdfToolPath } from '@/lib/pdf-tool-pages'

type Props = { params: Promise<{ slug: string }> }
export const dynamicParams = false
export function generateStaticParams() { return pdfToolPages.map(page => ({ slug: page.en.slug })) }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findPdfToolPage((await params).slug, 'en')
  if (!page) return {}
  const { title, description } = page.en
  return { title: `${title} | CramDesk`, description, alternates: { canonical: pdfToolPath(page, 'en'), languages: { fr: pdfToolPath(page, 'fr'), en: pdfToolPath(page, 'en') } }, openGraph: { title, description, url: `https://cramdesk.com${pdfToolPath(page, 'en')}` } }
}
export default async function Page({ params }: Props) {
  const page = findPdfToolPage((await params).slug, 'en')
  if (!page) notFound()
  return <PdfToolDetailPage page={page} locale="en" />
}
