import type { Metadata } from 'next'
import { PdfToolsLanding } from '@/components/pdf-tools-landing'
import { STUDY_PDF_LOCALES } from '@/lib/study-pdf-locales'
import { pdfHubPath } from '@/lib/pdf-tool-locales'

export const metadata: Metadata = {
  title: 'Outils PDF gratuits : fusionner, extraire, tourner | CramDesk',
  description: '8 outils PDF gratuits sans compte : fusionner, extraire, réorganiser, tourner, numéroter, ajouter un filigrane, effacer les métadonnées et convertir des images. Traitement local.',
  alternates: { canonical: '/outils-pdf', languages: Object.fromEntries(STUDY_PDF_LOCALES.map(locale => [locale, pdfHubPath(locale)])) },
  openGraph: { title: 'Outils PDF gratuits | CramDesk', description: 'Huit outils PDF dans ton navigateur, sans inscription ni envoi de fichier.', url: 'https://www.cramdesk.com/outils-pdf' },
}

export default function Page() { return <PdfToolsLanding locale="fr" /> }
