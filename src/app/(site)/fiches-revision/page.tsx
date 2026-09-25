import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BookOpenText, CheckCircle2, FileText, ListChecks, Search, Sparkles } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'Générateur de Fiches de Révision IA | Cramdesk',
  description: 'Crée des fiches de révision structurées à partir de tes cours PDF. Repère les idées clés et prépare tes séances de révision.',
  keywords: ['fiches de révision', 'générateur fiches', 'résumé cours', 'fiche synthèse', 'révision IA'],
  alternates: { canonical: '/fiches-revision' },
}

const faqs = [
  {
    question: 'Comment créer une fiche de révision avec CramDesk ?',
    answer: 'Importe un PDF contenant du texte sélectionnable. CramDesk l’analyse et affiche une synthèse structurée dans ton espace de travail. Tu peux ensuite copier les passages utiles pour tes propres notes.',
  },
  {
    question: 'Que contient la fiche générée ?',
    answer: 'La synthèse rassemble les idées principales et les notions à retenir. Selon le document, elle peut aussi signaler des points à vérifier et proposer des questions pour t’entraîner.',
  },
  {
    question: 'Puis-je modifier les fiches générées ?',
    answer: 'Tu peux copier le contenu dans ton éditeur de notes et l’adapter. Garde ton PDF sous la main pour corriger une éventuelle erreur ou ajouter une nuance importante.',
  },
  {
    question: 'Combien de pages puis-je analyser ?',
    answer: 'L’essai de 7 jours permet de traiter jusqu’à 200 pages par jour. Les forfaits incluent ensuite 300 à 10 000 pages par mois, avec une limite par PDF selon le forfait.',
  },
]

export default function FichesRevisionPage() {
  return (
    <>
      <WebPageJsonLd title="Générateur de fiches de révision IA" description="Crée une synthèse structurée à partir d’un cours PDF lisible." url="https://cramdesk.com/fiches-revision" />
      <FAQJsonLd faqs={faqs} />
      <FeaturePageShell>
        <FeatureHero
          eyebrow="Fiches de révision"
          icon={BookOpenText}
          title={<>Les idées clés, <span className="italic text-[#c25334]">sans repartir de zéro.</span></>}
          description="Importe un cours PDF et retrouve une synthèse structurée pour préparer tes révisions. Tu peux ensuite approfondir les passages importants dans le document d’origine."
          primaryAction={{ label: 'Créer ma première fiche', href: '/signup' }}
          secondaryAction={{ label: 'Voir comment ça marche', href: '#methode' }}
          note="7 jours d’essai · Aucune carte bancaire requise · PDF avec texte sélectionnable"
          preview={<div className="rotate-[1deg] overflow-hidden rounded-[1.8rem] border border-[#edd9ce] bg-white shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)]">
            <div className="flex items-center justify-between border-b border-[#f0dfd5] bg-[#fffdf9] px-6 py-4">
              <span className="inline-flex items-center gap-2 text-sm font-bold"><FileText className="size-4 text-[#bc6b50]" aria-hidden="true" /> Fiche de révision</span>
              <span className="rounded-full bg-[#ffe5d5] px-3 py-1 text-[11px] font-semibold text-[#af4a34]">Aperçu</span>
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#a17498]">Biologie cellulaire · Chapitre 04</p>
              <h2 className="font-editorial mt-3 text-3xl leading-tight">La membrane cellulaire</h2>
              <p className="mt-5 border-l-2 border-[#b08ba4] pl-4 text-sm leading-7 text-[#625765]">Elle sépare la cellule de son environnement et régule les échanges avec celui-ci.</p>
              <div className="mt-7 space-y-3">
                {['Barrière sélective', 'Bicouche de phospholipides', 'Rôle des protéines membranaires'].map(item => <p key={item} className="flex items-center gap-3 rounded-xl bg-[#faf6f9] px-4 py-3 text-sm text-[#554954]"><CheckCircle2 className="size-4 shrink-0 text-[#7f9b76]" aria-hidden="true" />{item}</p>)}
              </div>
              <p className="mt-6 text-xs leading-5 text-[#8e828d]">Exemple illustratif. Vérifie les détails dans ton cours.</p>
            </div>
          </div>}
        />

        <section id="methode" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="Du document à la fiche" title={<>Trois gestes, <span className="italic text-[#c25334]">un cours plus lisible.</span></>} description="La fiche sert de point de départ : elle aide à repérer les notions, mais ne remplace pas les explications du cours original." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <FeatureCard icon={FileText} index="01" title="Ajoute ton PDF">Importe un document contenant du texte sélectionnable depuis ton ordinateur.</FeatureCard>
              <FeatureCard icon={Sparkles} index="02" title="Lis la synthèse">CramDesk organise les points principaux et les notions à reprendre.</FeatureCard>
              <FeatureCard icon={Search} index="03" title="Vérifie les détails">Retourne au PDF pour les exemples, les chiffres et les nuances du cours.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <FeatureSectionHeading eyebrow="Révision active" title={<>Une fiche pour <span className="italic text-[#c25334]">commencer à retenir.</span></>} description="Les notes les plus utiles sont celles que tu retravailles. Relis la synthèse, reformule les concepts avec tes mots, puis teste-toi sur les points encore hésitants." />
              <Link href="/quiz-pdf" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#ae4731] underline decoration-[#e5b9a4] underline-offset-4 hover:text-[#963326]">Découvrir les quiz PDF<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <p className="mb-5 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">Dans une synthèse CramDesk</p>
              {[
                ['Points clés', 'Repère les informations centrales du cours.'],
                ['Notions à éclaircir', 'Note ce qui mérite une deuxième lecture.'],
                ['Questions pour réviser', 'Transforme la lecture en entraînement.'],
              ].map(([title, detail]) => <div key={title} className="flex gap-4 border-t border-[#f3e3da] py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#ffe5d5] text-[#c25334]"><ListChecks className="size-4" aria-hidden="true" /></span>
                <div><h3 className="font-bold">{title}</h3><p className="mt-1 text-sm leading-6 text-[#796e79]">{detail}</p></div>
              </div>)}
            </div>
          </div>
        </section>

        <FeatureFaq items={faqs} />
        <FeatureCta eyebrow="Prêt à commencer ?" title={<>Transforme ton prochain cours en <span className="italic text-[#ffcfad]">point de départ.</span></>} description="Importe un PDF, découvre sa synthèse et construis tes propres fiches de révision." action={{ label: 'Essayer gratuitement', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
