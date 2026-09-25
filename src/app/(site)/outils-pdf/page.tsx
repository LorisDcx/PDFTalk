import type { Metadata } from 'next'
import { PdfToolsLanding } from '@/components/pdf-tools-landing'

export const metadata: Metadata = {
  title: 'Outils PDF gratuits : fusionner, extraire, tourner | CramDesk',
  description: '8 outils PDF gratuits sans compte : fusionner, extraire, réorganiser, tourner, numéroter, ajouter un filigrane, effacer les métadonnées et convertir des images. Traitement local.',
  alternates: { canonical: '/outils-pdf', languages: { fr: '/outils-pdf', en: '/en/pdf-tools' } },
  openGraph: { title: 'Outils PDF gratuits | CramDesk', description: 'Huit outils PDF dans ton navigateur, sans inscription ni envoi de fichier.', url: 'https://cramdesk.com/outils-pdf' },
}

export default function Page() { return <PdfToolsLanding locale="fr" /> }
