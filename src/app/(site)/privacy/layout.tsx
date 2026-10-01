import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité | CramDesk',
  description: 'Découvre comment CramDesk traite les données de ton compte, tes documents PDF et tes révisions, ainsi que tes droits sur ces données.',
  alternates: { canonical: '/privacy' },
  openGraph: { title: 'Politique de confidentialité | CramDesk', description: 'Données personnelles, documents et droits des utilisateurs de CramDesk.', url: '/privacy' },
}

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children
}
