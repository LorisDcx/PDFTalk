import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact et assistance | CramDesk',
  description: 'Contacte CramDesk pour une question sur tes révisions, signaler un problème ou obtenir de l’aide avec ton compte et ton abonnement.',
  alternates: { canonical: '/contact' },
  openGraph: { title: 'Contact et assistance | CramDesk', description: 'Une question ou un problème avec CramDesk ? Contacte notre assistance.', url: '/contact' },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
