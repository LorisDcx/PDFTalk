import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, FileQuestion, FileText, RotateCcw, Target, Trophy } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeatureCard, FeatureCta, FeatureFaq, FeatureHero, FeaturePageShell, FeatureSectionHeading } from '@/components/feature-page-shell'

export const metadata: Metadata = {
  title: 'Quiz PDF en ligne | Teste tes connaissances avec l’IA | Cramdesk',
  description: 'Génère des quiz automatiquement à partir de tes PDF. L’IA crée des QCM personnalisés pour tester tes connaissances et identifier les points à retravailler.',
  keywords: ['quiz PDF', 'QCM en ligne', 'test connaissances', 'quiz révision', 'générateur quiz'],
  alternates: { canonical: '/quiz-pdf' },
}

const faqs = [
  {
    question: 'Comment créer un quiz à partir de mon PDF ?',
    answer: 'Importe un PDF contenant du texte sélectionnable, ouvre son espace de travail et lance la génération d’un quiz. Les questions portent sur le contenu extrait du document.',
  },
  {
    question: 'Combien de questions sont générées ?',
    answer: 'Tu choisis le nombre de questions avant la génération. La limite par quiz dépend de ton forfait : 20 pour Starter, 50 pour Student et 100 pour Graduate.',
  },
  {
    question: 'Comment savoir ce que je dois retravailler ?',
    answer: 'Le quiz indique si chaque réponse est correcte et affiche ton résultat. Reprends les réponses manquées dans ton PDF pour vérifier l’explication et les nuances.',
  },
  {
    question: 'Puis-je refaire le quiz ?',
    answer: 'Oui, tu peux reprendre un quiz et générer de nouvelles questions depuis ton document. Relis toujours le PDF lorsque la formulation d’une question semble ambiguë.',
  },
]

export default function QuizPdfPage() {
  return (
    <>
      <WebPageJsonLd title="Quiz PDF en ligne" description="Génère des questions de révision à partir du texte de ton cours PDF." url="https://cramdesk.com/quiz-pdf" />
      <FAQJsonLd faqs={faqs} />
      <FeaturePageShell>
        <FeatureHero
          eyebrow="Quiz à partir d’un PDF"
          icon={FileQuestion}
          title={<>Le meilleur test : <span className="italic text-[#c25334]">ce que tu retiens.</span></>}
          description="Passe de la lecture à la pratique. CramDesk crée des questions depuis ton cours PDF pour vérifier ta compréhension et repérer les notions à reprendre."
          primaryAction={{ label: 'Créer mon premier quiz', href: '/signup' }}
          secondaryAction={{ label: 'Découvrir la méthode', href: '#methode' }}
          note="Questions générées depuis tes documents · Nombre de questions selon ton forfait"
          preview={<div className="overflow-hidden rounded-[1.8rem] border border-[#edd9ce] bg-white shadow-[0_35px_80px_-42px_rgba(59,34,56,.38)]">
            <div className="flex items-center justify-between border-b border-[#f0dfd5] bg-[#fffdf9] px-5 py-4 sm:px-7">
              <span className="inline-flex items-center gap-2 text-sm font-bold"><FileQuestion className="size-4 text-[#bc6b50]" aria-hidden="true" /> Quiz · Biologie cellulaire</span>
              <span className="rounded-full bg-[#ffe5d5] px-3 py-1 text-[11px] font-semibold text-[#af4a34]">Exemple</span>
            </div>
            <div className="p-5 sm:p-7">
              <div className="mb-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-[.16em] text-[#bb765f]"><span>Question 01</span><span>Révision active</span></div>
              <h2 className="font-editorial text-2xl leading-snug sm:text-3xl">Quelle structure forme la barrière principale de la membrane cellulaire ?</h2>
              <div className="mt-6 space-y-2.5">
                {[
                  { letter: 'A', answer: 'Une bicouche de phospholipides', right: true },
                  { letter: 'B', answer: 'Une seule couche de protéines' },
                  { letter: 'C', answer: 'Une paroi de cellulose' },
                ].map(option => <div key={option.letter} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${option.right ? 'border-[#bed2b7] bg-[#f2f8f0] text-[#436b41]' : 'border-[#ede5eb] text-[#6c606e]'}`}>
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold">{option.letter}</span>
                  <span className="flex-1">{option.answer}</span>
                  {option.right && <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />}
                </div>)}
              </div>
              <p className="mt-5 text-xs leading-5 text-[#8e828d]">Exemple illustratif. Vérifie les réponses dans ton cours.</p>
            </div>
          </div>}
        />

        <section id="methode" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff2e9] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <FeatureSectionHeading eyebrow="Une séance plus active" title={<>Lis, réponds, <span className="italic text-[#c25334]">reviens au cours.</span></>} description="Un quiz aide à voir ce que tu sais expliquer sans regarder tes notes. Le résultat te donne ensuite une direction pour ta prochaine lecture." />
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <FeatureCard icon={FileText} index="01" title="Importe un cours">Choisis un PDF avec du texte sélectionnable pour que son contenu puisse être analysé.</FeatureCard>
              <FeatureCard icon={Target} index="02" title="Réponds aux questions">Sélectionne le nombre de questions et avance dans le quiz à ton rythme.</FeatureCard>
              <FeatureCard icon={RotateCcw} index="03" title="Reprends les erreurs">Repère les réponses manquées et retourne aux passages importants du PDF.</FeatureCard>
            </div>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <FeatureSectionHeading eyebrow="Voir sa progression" title={<>Un score utile, <span className="italic text-[#c25334]">pas une fin en soi.</span></>} description="Le quiz affiche ton résultat et t’aide à repérer les questions ratées. Utilise-les pour approfondir le cours, puis retente une séance après avoir révisé." />
              <Link href="/fiches-revision" className="mt-7 inline-flex items-center gap-1.5 text-sm font-bold text-[#ae4731] underline decoration-[#e5b9a4] underline-offset-4 hover:text-[#963326]">Préparer une fiche avant le quiz<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
            </div>
            <div className="rounded-[1.6rem] border border-[#efdcd0] bg-white p-6 shadow-[0_22px_55px_-40px_rgba(59,34,56,.35)] sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-[#ffe5d5] text-[#c25334]"><Trophy className="size-5" aria-hidden="true" /></span>
              <h3 className="font-editorial mt-6 text-3xl">Un retour immédiat sur tes réponses.</h3>
              <p className="mt-4 text-sm leading-7 text-[#756b76]">Tu sais quelles questions t’ont posé problème. Pour comprendre pourquoi, confronte la correction au document d’origine et note les notions à revoir.</p>
              <div className="mt-6 border-t border-[#f3e3da] pt-5 text-xs font-semibold uppercase tracking-[.16em] text-[#986b8d]">Question → réponse → nouvelle lecture</div>
            </div>
          </div>
        </section>

        <FeatureFaq items={faqs} />
        <FeatureCta eyebrow="Passe à la pratique" title={<>Tes cours peuvent aussi <span className="italic text-[#ffcfad]">te poser des questions.</span></>} description="Importe un PDF, crée ton quiz et vois quelles notions méritent une seconde lecture." action={{ label: 'Essayer gratuitement', href: '/signup' }} />
      </FeaturePageShell>
    </>
  )
}
