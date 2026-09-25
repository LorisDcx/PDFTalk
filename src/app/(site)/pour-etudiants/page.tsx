import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BookOpenText, CheckCircle2, FileQuestion, FileText, GraduationCap, Layers3 } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'Cramdesk pour Étudiants | Révise tes cours PDF efficacement',
  description: 'Transforme tes PDF de cours en fiches de révision, flashcards et quiz. Comprends les idées clés et entraîne-toi à ton rythme.',
  keywords: ['étudiant', 'révision', 'cours PDF', 'examens', 'fiches de révision', 'flashcards étudiant'],
  alternates: { canonical: '/pour-etudiants' },
}

const faqs = [
  {
    question: 'Comment CramDesk aide les étudiants à réviser ?',
    answer: 'Tu importes un PDF de cours contenant du texte sélectionnable. CramDesk en propose une synthèse structurée, puis tu peux générer des flashcards et des quiz à partir du document.',
  },
  {
    question: 'Combien de temps faut-il pour créer des fiches de révision ?',
    answer: 'Le temps dépend de la longueur et de la complexité du PDF. Après son analyse, la synthèse est disponible dans ton espace de travail.',
  },
  {
    question: 'Est-ce que CramDesk fonctionne pour toutes les matières ?',
    answer: 'Tu peux importer des cours de différentes matières si le PDF contient du texte sélectionnable. Vérifie toujours les points importants dans le document d’origine : une IA peut omettre une nuance.',
  },
  {
    question: 'Y a-t-il une version gratuite pour les étudiants ?',
    answer: 'Oui. L’essai dure 7 jours, sans carte bancaire, avec une limite quotidienne de 200 pages. Les forfaits commencent ensuite à 3,99 € par mois.',
  },
]

const tools = [
  { icon: BookOpenText, title: 'Comprendre l’essentiel', text: 'Une synthèse structurée aide à retrouver les idées principales avant de reprendre le cours en détail.', href: '/fiches-revision', link: 'Découvrir les fiches' },
  { icon: Layers3, title: 'Se faire réciter', text: 'Transforme les notions de ton PDF en questions et réponses à revoir sous forme de flashcards.', href: '/flashcards-landing', link: 'Découvrir les flashcards' },
  { icon: FileQuestion, title: 'Vérifier ce qu’on sait', text: 'Génère un quiz depuis le document et repère les points qui méritent une nouvelle lecture.', href: '/quiz-pdf', link: 'Découvrir les quiz' },
]

export default function PourEtudiantsPage() {
  return (
    <>
      <WebPageJsonLd title="CramDesk pour étudiants" description="Un espace de révision pour travailler des cours PDF avec des fiches, des flashcards et des quiz." url="https://cramdesk.com/pour-etudiants" />
      <FAQJsonLd faqs={faqs} />
      <FeaturePageShell>
        <FeatureHero
          eyebrow="Pour les étudiants"
          icon={GraduationCap}
          title={<>Ton cours, <span className="italic text-[#c25334]">prêt à réviser.</span></>}
          description="Rassemble tes PDF de cours dans un même espace. Repère les idées clés, crée des flashcards et teste-toi avec un quiz quand tu es prêt."
          primaryAction={{ label: 'Essayer gratuitement', href: '/signup' }}
          secondaryAction={{ label: 'Voir les tarifs', href: '/#pricing' }}
          note="7 jours d’essai · Sans carte bancaire · PDF avec texte sélectionnable"
          preview={<div className="overflow-hidden rounded-[1.8rem] border border-[#edd9ce] bg-white shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)]">
            <div className="flex items-center gap-3 border-b border-[#f0dfd5] bg-[#fffdf9] px-5 py-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#ffe0d1] text-[#b84432]"><FileText className="size-5" aria-hidden="true" /></span>
              <div><p className="text-sm font-bold">Cours de biologie.pdf</p><p className="text-xs text-[#8b7d89]">Un cours, plusieurs façons de le travailler</p></div>
            </div>
            <div className="p-5 sm:p-7">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">Ton espace de révision</p>
              <div className="space-y-2.5">
                {[
                  { icon: BookOpenText, title: 'Fiche de révision', detail: 'Les points clés à comprendre', n: '01' },
                  { icon: Layers3, title: 'Flashcards', detail: 'Les notions à mémoriser', n: '02' },
                  { icon: FileQuestion, title: 'Quiz', detail: 'Les connaissances à vérifier', n: '03' },
                ].map(item => <div key={item.n} className="flex items-center gap-3 rounded-2xl border border-[#eee5eb] bg-[#fcf9fb] p-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f1e5ee] text-[#744465]"><item.icon className="size-[18px]" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><p className="text-sm font-bold">{item.title}</p><p className="text-xs text-[#877c87]">{item.detail}</p></div>
                  <span className="font-editorial text-xl text-[#bfa8b8]">{item.n}</span>
                </div>)}
              </div>
              <p className="mt-5 text-xs leading-5 text-[#8e828d]">Aperçu illustratif · Compare toujours les réponses avec ton cours.</p>
            </div>
          </div>}
        />

        <section className="border-y border-[#f0dfd5] bg-white px-5 py-7 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-10 gap-y-4 text-xs font-semibold text-[#746a76] sm:justify-between sm:text-sm">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#7b9a72]" aria-hidden="true" /> Fiches, flashcards et quiz au même endroit</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#7b9a72]" aria-hidden="true" /> Ton PDF reste accessible dans ton espace</span>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="Une méthode souple" title={<>Passe de la lecture à la <span className="italic text-[#c25334]">pratique.</span></>} description="Tu choisis comment travailler chaque chapitre. Une synthèse pour retrouver le fil, des cartes pour t’interroger, puis un quiz pour faire le point." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {tools.map((item, index) => <div key={item.title} className="flex flex-col">
                <FeatureCard icon={item.icon} index={`0${index + 1}`} title={item.title}>{item.text}</FeatureCard>
                <Link href={item.href} className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-bold text-[#ae4731] underline decoration-[#e5b9a4] underline-offset-4 hover:text-[#963326]">{item.link}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
              </div>)}
            </div>
          </div>
        </section>

        <section className="bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <FeatureSectionHeading eyebrow="Quand les cours s’accumulent" title={<>Une base claire pour <span className="italic text-[#c25334]">chaque matière.</span></>} description="Cours magistral, article ou support de TD : importe les PDF qui contiennent du texte lisible et retrouve-les dans ta bibliothèque. Tu gardes la main sur ce que tu révises et sur ce que tu vérifies dans la source." />
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">Un cycle de révision simple</p>
              {[
                ['01', 'Importer', 'Ajoute un PDF avec du texte sélectionnable.'],
                ['02', 'Comprendre', 'Lis la synthèse et reviens au passage d’origine.'],
                ['03', 'T’entraîner', 'Utilise cartes et quiz pour revoir les notions.'],
              ].map(([number, title, detail]) => <div key={number} className="flex gap-4 border-b border-[#f3e3da] py-5 last:border-b-0 last:pb-0">
                <span className="font-editorial text-2xl text-[#9c7090]">{number}</span><div><p className="font-bold">{title}</p><p className="mt-1 text-sm leading-6 text-[#796e79]">{detail}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <FeatureFaq items={faqs} />
        <FeatureCta eyebrow="Commencer à réviser" title={<>Ton prochain cours mérite <span className="italic text-[#ffcfad]">mieux qu’un surlignage.</span></>} description="Importe un PDF et construis une séance de révision autour de son contenu." action={{ label: 'Créer mon espace gratuit', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
