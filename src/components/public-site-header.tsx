import { Navbar } from '@/components/navbar'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

export function PublicSiteHeader({ locale }: { locale: StudyPdfLocale }) {
  return <Navbar publicLocale={locale} />
}
