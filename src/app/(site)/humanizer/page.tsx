import type { Metadata } from 'next'
import { CheckCircle2, FileText, Languages, PenLine } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'Reformuler un texte pour le rendre plus clair | CramDesk',
  description: 'Réécris un brouillon avec un style plus naturel et plus lisible, sans changer les faits ni le sens. Relis toujours le résultat avant utilisation.',
  alternates: { canonical: '/humanizer' },
  openGraph: {
    title: 'Reformuler un texte pour le rendre plus clair | CramDesk',
    description: 'Un outil de réécriture pour améliorer la clarté, le rythme et le ton de tes textes.',
    url: 'https://cramdesk.com/humanizer',
  },
}

const faqs = [
  {
    question: 'Que fait l’outil de reformulation ?',
    answer: 'Il propose une nouvelle version de ton texte, avec des phrases plus fluides et un ton adapté. Tu gardes le contrôle de la version finale.',
  },
  {
    question: 'Le sens et les faits sont-ils préservés ?',
    answer: 'C’est l’objectif de la réécriture, mais une IA peut se tromper. Compare toujours le résultat à ton texte original avant de le partager.',
  },
  {
    question: 'Le résultat garantit-il un score dans un détecteur d’IA ?',
    answer: 'Non. Aucun outil ne peut garantir le comportement d’un détecteur. La fonction sert à améliorer la qualité de rédaction, pas à certifier une origine humaine.',
  },
  {
    question: 'Combien de crédits sont inclus ?',
    answer: 'Starter inclut 5 réécritures par mois, Student 10 et Graduate 20. Chaque génération consomme un crédit.',
  },
]

export default function HumanizerPage() {
  return (
    <>
      <WebPageJsonLd title="Reformuler un texte pour le rendre plus clair" description="Améliore la lisibilité et le ton de tes brouillons avec CramDesk." url="https://cramdesk.com/humanizer" />
      <FAQJsonLd faqs={faqs} />
      <FeaturePageShell>
        <FeatureHero
          eyebrow="Atelier de rédaction"
          icon={PenLine}
          title={<>Un texte plus clair, <span className="italic text-[#c25334]">toujours ta voix.</span></>}
          description="Colle un brouillon et reçois une proposition de reformulation plus fluide. Compare, ajuste et garde les phrases qui disent vraiment ce que tu voulais écrire."
          primaryAction={{ label: 'Essayer la reformulation', href: '/signup' }}
          secondaryAction={{ label: 'Voir les crédits', href: '/#pricing' }}
          note="Une proposition à relire, jamais une garantie de détection"
          preview={<div className="overflow-hidden rounded-[1.8rem] border border-[#edd9ce] bg-white shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)]">
            <div className="flex items-center gap-3 border-b border-[#f0dfd5] bg-[#fffdf9] px-6 py-4"><span className="flex size-9 items-center justify-center rounded-xl bg-[#ffe0d1] text-[#b84432]"><PenLine className="size-4" aria-hidden="true" /></span><span className="text-sm font-bold">Atelier de réécriture</span></div>
            <div className="p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#a18d9d]">Brouillon</p>
              <p className="mt-3 rounded-xl bg-[#f8f5f7] p-4 text-sm leading-7 text-[#786d77]">Ce sujet présente plusieurs éléments qu’il est important de prendre en considération.</p>
              <div className="my-5 flex items-center gap-3"><span className="h-px flex-1 bg-[#efdcd3]" /><span className="font-editorial italic text-[#9b6b8d]">une autre formulation</span><span className="h-px flex-1 bg-[#efdcd3]" /></div>
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">Proposition</p>
              <p className="mt-3 rounded-xl border border-[#f0d5ca] bg-[#fcf7fa] p-4 text-sm leading-7 text-[#3e333e]">Pour comprendre ce sujet, il faut regarder plusieurs aspects.</p>
              <p className="mt-5 text-xs leading-5 text-[#8e828d]">Exemple illustratif · Vérifie le sens avant utilisation.</p>
            </div>
          </div>}
        />

        <section className="border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="Réécrire avec discernement" title={<>Une aide pour formuler, <span className="italic text-[#c25334]">pas pour décider à ta place.</span></>} description="L’outil propose une version à retravailler. Tu choisis les passages utiles et tu vérifies chaque fait avant de rendre un texte." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <FeatureCard icon={PenLine} index="01" title="Allège les phrases">Une nouvelle formulation peut rendre un passage dense plus facile à lire.</FeatureCard>
              <FeatureCard icon={FileText} index="02" title="Préserve ton intention">Compare la proposition au brouillon et rétablis toute nuance perdue.</FeatureCard>
              <FeatureCard icon={Languages} index="03" title="Adapte le ton">Choisis un style approprié au contexte, puis réécris ce qui ne te ressemble pas.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <FeatureSectionHeading eyebrow="Avant de partager" title={<>Le dernier mot <span className="italic text-[#c25334]">t’appartient.</span></>} description="Relis la version proposée comme tu relirais le travail d’un camarade : vérifie les noms, les chiffres, les citations et le niveau de langue attendu." />
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">Ta vérification finale</p>
              {['Le sens est-il resté le même ?', 'Les faits et les références sont-ils exacts ?', 'Le ton te ressemble-t-il ?'].map(item => <p key={item} className="flex gap-3 border-t border-[#f3e3da] py-4 text-sm font-medium leading-6 text-[#5c505d]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#7f9b76]" aria-hidden="true" />{item}</p>)}
            </div>
          </div>
        </section>

        <FeatureFaq items={faqs} />
        <FeatureCta eyebrow="Écrire avec plus d’aisance" title={<>Une meilleure phrase commence par <span className="italic text-[#ffcfad]">une première version.</span></>} description="Apporte ton brouillon. Repars avec une proposition à adapter et à vérifier." action={{ label: 'Essayer CramDesk', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
