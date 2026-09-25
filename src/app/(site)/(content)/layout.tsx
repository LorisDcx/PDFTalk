import Link from 'next/link'
import { Navbar } from '@/components/navbar'

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <footer className="border-t border-[#f0dfd5] bg-[#fffaf5] px-5 py-8 text-sm text-[#776a76]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <Link href="/" className="font-editorial text-xl text-[#33252b]">CramDesk<span className="text-[#d05a39]">.</span></Link>
          <nav className="flex flex-wrap gap-5" aria-label="Liens du pied de page">
            <Link href="/flashcards-gratuites" className="hover:text-[#b84432]">Flashcards gratuites</Link>
            <Link href="/privacy" className="hover:text-[#b84432]">Confidentialité</Link>
            <Link href="/contact" className="hover:text-[#b84432]">Contact</Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
