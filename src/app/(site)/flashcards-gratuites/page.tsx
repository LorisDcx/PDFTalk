import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Layers3 } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { FreeFlashcards } from '@/components/free-flashcards'

export const metadata: Metadata = {
  title: 'Flashcards gratuites sans inscription | Créer et réviser | CramDesk',
  description: 'Crée tes flashcards en ligne gratuitement, révise en rappel actif et exporte ton jeu. Sans inscription : tes cartes restent sur ton appareil.',
  keywords: ['flashcards gratuites', 'créer des flashcards', 'cartes mémoire en ligne', 'flashcards sans inscription', 'rappel actif'],
  alternates: { canonical: '/flashcards-gratuites', languages: { fr: '/flashcards-gratuites', en: '/en/free-flashcards' } },
  openGraph: { title: 'Flashcards gratuites sans inscription | CramDesk', description: 'Crée, révise et exporte tes cartes mémoire dans ton navigateur.', url: 'https://cramdesk.com/flashcards-gratuites' },
}

const faqs = [
  { question: 'Les flashcards sont-elles vraiment gratuites ?', answer: 'Oui. Tu peux créer jusqu’à 40 cartes par jeu, les réviser et les exporter sans compte ni carte bancaire. La génération automatique depuis un PDF fait partie du studio CramDesk.' },
  { question: 'Où sont enregistrées mes cartes ?', answer: 'Dans le stockage local de ce navigateur. Elles ne sont pas envoyées à CramDesk. Exporte ton jeu pour en garder une copie ou l’utiliser sur un autre appareil.' },
  { question: 'Comment fonctionne la révision ?', answer: 'Lis la question et tente de répondre de mémoire avant de révéler la réponse. Si tu choisis « À revoir », la carte revient plus tard dans la session.' },
]

export default function FreeFlashcardsPage() {
  return <>
    <WebPageJsonLd title="Flashcards gratuites sans inscription" description="Crée et révise des cartes mémoire gratuites dans ton navigateur." url="https://cramdesk.com/flashcards-gratuites" />
    <FAQJsonLd faqs={faqs} />
    <FeaturePageShell>
      <section className="relative overflow-hidden px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24"><div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-[#ffe9da] opacity-75 blur-[110px]" /><div className="relative mx-auto max-w-4xl"><p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f1cfbd] bg-[#fff0e6] px-4 py-2 text-xs font-bold text-[#b84432]"><Layers3 className="size-4" aria-hidden="true" />Outil gratuit · Sans inscription</p><h1 className="font-editorial text-[clamp(3.25rem,7vw,7rem)] leading-[1.02] tracking-[-.055em] text-[#33252b]">Crée tes cartes. <span className="italic text-[#c25334]">Retrouve la réponse.</span></h1><p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#74696a] sm:text-xl">Écris une question et sa réponse, puis teste-toi sans regarder. Les cartes que tu ne connais pas reviennent pendant la session.</p><Link href="#outil" className="mt-9 inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#b84432] px-7 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(161,52,38,.7)] transition hover:bg-[#973326]">Créer mes flashcards <ArrowRight className="size-4" aria-hidden="true" /></Link><p className="mt-5 text-xs text-[#8f7e7c]">Gratuit, sans compte et sans envoi de tes cartes au serveur.</p></div></section>
      <FreeFlashcards locale="fr" />
      <section className="border-t border-[#f0dfd5] bg-[#fff4ed] px-5 py-20 sm:px-8"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Pour aller plus loin</p><h2 className="font-editorial mt-4 max-w-3xl text-4xl leading-tight text-[#33252b] sm:text-5xl">La bonne carte arrive au bon moment.</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{[{ title: 'Une idée par carte', text: 'Une question précise est plus simple à retrouver de mémoire qu’un paragraphe entier.' }, { title: 'Réponse cachée', text: 'Essaie de répondre avant de retourner la carte : le rappel actif révèle ce que tu maîtrises vraiment.' }, { title: 'Retour sur les hésitations', text: 'Les cartes marquées « À revoir » repassent pendant la session jusqu’à ce que tu les retrouves.' }].map(item => <article key={item.title} className="rounded-[1.4rem] border border-[#efdcd0] bg-white p-6"><h3 className="font-editorial text-2xl text-[#33252b]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#756a69]">{item.text}</p></article>)}</div><p className="mt-8 text-sm text-[#756a69]">Tu prépares une date d’examen ? <Link href="/planificateur-revisions" className="font-bold text-[#b84432] underline-offset-4 hover:underline">Crée aussi ton planning de révisions gratuit.</Link></p></div></section>
      <section className="px-5 py-20 sm:px-8"><div className="mx-auto max-w-4xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Questions fréquentes</p><h2 className="font-editorial mt-4 text-4xl text-[#33252b] sm:text-5xl">Avant de commencer.</h2><div className="mt-8 space-y-3">{faqs.map(faq => <details key={faq.question} className="group rounded-[1.2rem] border border-[#efdcd0] bg-white p-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-[#403234] marker:hidden">{faq.question}<span className="text-2xl font-light text-[#b84432] transition group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-[#786b6b]">{faq.answer}</p></details>)}</div></div></section>
    </FeaturePageShell>
  </>
}
