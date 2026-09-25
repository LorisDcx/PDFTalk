import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calculator, CheckCircle2, Target, Zap } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { GradeCalculator } from '@/components/grade-calculator'

export const metadata: Metadata = {
  title: 'Calculateur de moyenne gratuit avec coefficients | CramDesk',
  description: 'Calcule gratuitement ta moyenne pondérée sur 20 et la note à obtenir au prochain devoir pour atteindre ton objectif. Avec coefficients, scénarios et sans inscription.',
  keywords: ['calculateur de moyenne', 'moyenne avec coefficients', 'note à obtenir', 'calcul moyenne sur 20', 'objectif moyenne examen'],
  alternates: { canonical: '/calculateur-moyenne' },
  openGraph: {
    title: 'Calculateur de moyenne gratuit avec coefficients | CramDesk',
    description: 'Ta moyenne actuelle et la note à viser au prochain devoir, sans inscription.',
    url: 'https://cramdesk.com/calculateur-moyenne',
  },
}

const faqs = [
  { question: 'Comment calculer une moyenne avec coefficients ?', answer: 'Multiplie chaque note par son coefficient, additionne ces produits, puis divise par la somme des coefficients. Le calculateur effectue cette opération automatiquement.' },
  { question: 'Comment connaître la note nécessaire au prochain devoir ?', answer: 'Ajoute tes notes actuelles, choisis la moyenne visée et le coefficient du prochain devoir. Le résultat indique la note nécessaire, ou signale si l’objectif est déjà assuré ou impossible en un seul devoir.' },
  { question: 'Puis-je utiliser des notes décimales ?', answer: 'Oui. Tu peux saisir une virgule ou un point, par exemple 13,5 ou 13.5. Les notes doivent être comprises entre 0 et 20.' },
  { question: 'Faut-il créer un compte ?', answer: 'Non. Le calculateur est gratuit et fonctionne directement dans ton navigateur. Les notes saisies ne sont pas envoyées au serveur.' },
]

export default function GradeCalculatorPage() {
  return <>
    <WebPageJsonLd title="Calculateur de moyenne gratuit avec coefficients" description="Calcule ta moyenne sur 20 et la note à viser au prochain devoir." url="https://cramdesk.com/calculateur-moyenne" />
    <FAQJsonLd faqs={faqs} />
    <FeaturePageShell>
      <section className="relative overflow-hidden px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24"><div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-[#ffe9da] opacity-75 blur-[110px]" /><div className="relative mx-auto max-w-4xl"><p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f1cfbd] bg-[#fff0e6] px-4 py-2 text-xs font-bold text-[#b84432]"><Calculator className="size-4" aria-hidden="true" />Outil gratuit · Résultat instantané</p><h1 className="font-editorial text-[clamp(3.25rem,7vw,7rem)] leading-[1.02] tracking-[-.055em] text-[#33252b]">Ta moyenne, <span className="italic text-[#c25334]">et la suite à viser.</span></h1><p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#74696a] sm:text-xl">Ajoute tes notes et leurs coefficients. Vois ta moyenne actuelle, puis découvre la note qu’il te faudrait au prochain devoir pour atteindre ton objectif.</p><div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="#calculateur" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#b84432] px-7 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(161,52,38,.7)] transition hover:bg-[#973326]">Calculer ma moyenne <ArrowRight className="size-4" aria-hidden="true" /></Link><Link href="/planificateur-revisions" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border border-[#e8d5ca] bg-white px-7 text-sm font-bold text-[#7f4839] hover:bg-[#fff5ee]">Planifier mes révisions</Link></div><p className="mt-5 text-xs text-[#8f7e7c]">Gratuit, sans compte et sans stockage de tes notes.</p></div></section>

      <GradeCalculator />

      <section className="border-t border-[#f0dfd6] bg-[#fff4eb] px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Aller plus loin</p><h2 className="font-editorial mt-4 max-w-3xl text-4xl leading-tight text-[#33252b] sm:text-5xl">Le chiffre aide. La méthode fait progresser.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{[
        { icon: Calculator, title: 'Voir ta situation', text: 'Une moyenne pondérée tient compte des coefficients réels de chaque devoir.' },
        { icon: Target, title: 'Fixer une cible réaliste', text: 'La note à viser indique si ton prochain devoir peut suffire à atteindre l’objectif.' },
        { icon: Zap, title: 'Préparer la prochaine étape', text: 'Un planning de révisions t’aide ensuite à répartir les chapitres et les rappels actifs.' },
      ].map(item => <article key={item.title} className="rounded-[1.4rem] border border-[#efdcd0] bg-white p-6 sm:p-7"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffe7d8] text-[#b84432]"><item.icon className="size-5" aria-hidden="true" /></span><h3 className="mt-6 text-lg font-bold text-[#3f3033]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#756a69]">{item.text}</p></article>)}</div></div></section>

      <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Questions fréquentes</p><h2 className="font-editorial mt-4 text-4xl leading-tight text-[#33252b] sm:text-5xl">Pour bien calculer.</h2><p className="mt-5 flex items-center gap-2 text-sm text-[#857879]"><CheckCircle2 className="size-4 text-[#c25334]" aria-hidden="true" />Les notes restent sur ton appareil.</p></div><div className="space-y-3">{faqs.map(faq => <details key={faq.question} className="group rounded-[1.2rem] border border-[#efdcd0] bg-white p-5 sm:p-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#403234] marker:hidden sm:text-base">{faq.question}<span className="text-2xl font-light text-[#b84432] transition group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-[#786b6b]">{faq.answer}</p></details>)}</div></div></section>
    </FeaturePageShell>
  </>
}
