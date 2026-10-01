import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions générales d’utilisation | CramDesk',
  description: 'Consulte les conditions d’utilisation de CramDesk : compte, outils de révision, abonnement, responsabilités et utilisation du service.',
  alternates: { canonical: '/terms' },
  openGraph: { title: 'Conditions générales d’utilisation | CramDesk', description: 'Les conditions d’utilisation du service de révision CramDesk.', url: '/terms' },
}

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children
}
