import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, FileText, Sparkles } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { StudyPlanner } from '@/components/study-planner'

export const metadata: Metadata = {
  title: 'Planificateur de révisions gratuit | Planning avant examen | CramDesk',
  description: 'Crée gratuitement ton planning de révisions avant un examen. Répartis tes chapitres et tes rappels actifs selon tes jours disponibles, puis exporte le calendrier sans créer de compte.',
  keywords: ['planificateur de révisions', 'planning de révision gratuit', 'organiser ses révisions', 'calendrier révisions examen', 'planning étudiant'],
  alternates: { canonical: '/planificateur-revisions' },
  openGraph: {
    title: 'Planificateur de révisions gratuit | CramDesk',
    description: 'Un planning de révision personnalisé, exportable et sans inscription.',
    url: 'https://cramdesk.com/planificateur-revisions',
  },
}

const faqs = [
  { question: 'Le planificateur de révisions est-il gratuit ?', answer: 'Oui. Tu peux créer et exporter un planning sans compte ni carte bancaire. Les fonctions d’analyse de PDF de CramDesk sont proposées séparément.' },
  { question: 'Comment sont réparties les séances ?', answer: 'Le planning place les chapitres à découvrir sur les jours disponibles, puis réserve des créneaux pour te rappeler les notions sans notes et faire des quiz. Si le temps manque, il signale les chapitres non placés.' },
  { question: 'Puis-je modifier les horaires ?', answer: 'Oui. Le fichier calendrier propose des séances de 45 minutes à partir de 18 h. Après l’avoir importé dans ton agenda, tu peux déplacer chaque séance librement.' },
  { question: 'Mes matières sont-elles envoyées à CramDesk ?', answer: 'Non. Ce plan est calculé dans ton navigateur. Tu peux exporter les séances dans un fichier calendrier sur ton appareil.' },
]

export default function StudyPlannerPage() {
  return <>
    <WebPageJsonLd title="Planificateur de révisions gratuit" description="Crée un planning de révision personnalisé et exportable sans inscription." url="https://cramdesk.com/planificateur-revisions" />
    <FAQJsonLd faqs={faqs} />
    <FeaturePageShell>
      <section className="relative overflow-hidden px-5 pb-16 pt-16 text-center sm:px-8 sm:pb-20 sm:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-[#ffe9da] opacity-75 blur-[110px]" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#f1cfbd] bg-[#fff0e6] px-4 py-2 text-xs font-bold text-[#b84432]"><CalendarDays className="size-4" aria-hidden="true" />Outil gratuit · Sans inscription</p>
          <h1 className="font-editorial text-[clamp(3.25rem,7vw,7rem)] leading-[1.02] tracking-[-.055em] text-[#33252b]">Des révisions <span className="italic text-[#c25334]">qui tiennent dans ton agenda.</span></h1>
          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-[#74696a] sm:text-xl">L’examen approche ? Indique tes matières, les chapitres à couvrir et tes jours disponibles. Repars avec un plan concret, exportable dans ton calendrier.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row"><Link href="#outil" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full bg-[#b84432] px-7 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(161,52,38,.7)] transition hover:bg-[#973326]">Créer mon planning <ArrowRight className="size-4" aria-hidden="true" /></Link><Link href="/#produit" className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-full border border-[#e8d5ca] bg-white px-7 text-sm font-bold text-[#7f4839] hover:bg-[#fff5ee]">Découvrir CramDesk</Link></div>
          <p className="mt-5 text-xs text-[#8f7e7c]">Gratuit, sans compte et sans envoi de tes matières au serveur.</p>
        </div>
      </section>

      <StudyPlanner />

      <section className="border-t border-[#f0dfd6] bg-[#fff4eb] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Une méthode simple</p><h2 className="font-editorial mt-4 max-w-3xl text-4xl leading-tight text-[#33252b] sm:text-5xl">Un bon planning laisse de la place à la pratique.</h2><div className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            { icon: FileText, title: 'Découper le travail', text: 'Un chapitre devient une séance de 45 minutes. Si le volume dépasse tes disponibilités, le planning te le dit clairement.' },
            { icon: Sparkles, title: 'Revenir sans notes', text: 'Après une première lecture, les rappels actifs t’invitent à retrouver les idées importantes de mémoire.' },
            { icon: CheckCircle2, title: 'Tester avant l’examen', text: 'Les créneaux libres accueillent des quiz et la correction des points encore difficiles.' },
          ].map(item => <article key={item.title} className="rounded-[1.4rem] border border-[#efdcd0] bg-white p-6 sm:p-7"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffe7d8] text-[#b84432]"><item.icon className="size-5" aria-hidden="true" /></span><h3 className="mt-6 text-lg font-bold text-[#3f3033]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#756a69]">{item.text}</p></article>)}
        </div></div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#b84f36]">Questions fréquentes</p><h2 className="font-editorial mt-4 text-4xl leading-tight text-[#33252b] sm:text-5xl">Avant de te lancer.</h2><p className="mt-5 flex items-center gap-2 text-sm text-[#857879]"><Clock3 className="size-4 text-[#c25334]" aria-hidden="true" />Quelques minutes suffisent pour commencer.</p></div><div className="space-y-3">{faqs.map(faq => <details key={faq.question} className="group rounded-[1.2rem] border border-[#efdcd0] bg-white p-5 sm:p-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#403234] marker:hidden sm:text-base">{faq.question}<span className="text-2xl font-light text-[#b84432] transition group-open:rotate-45">+</span></summary><p className="mt-4 text-sm leading-7 text-[#786b6b]">{faq.answer}</p></details>)}</div></div></section>
    </FeaturePageShell>
  </>
}
