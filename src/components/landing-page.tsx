'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, BookOpenText, Calculator, CalendarDays, Check, CheckCircle2, ChevronRight,
  FileQuestion, FileText, Globe2, Layers3, LockKeyhole, MessageCircle,
  MousePointer2, Sparkles, Upload,
} from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { DemoUpload } from '@/components/demo-upload'
import { LocalePreference } from '@/components/locale-preference'
import { FAQJsonLd, OrganizationJsonLd, ProductJsonLd } from '@/components/json-ld'

type PreviewTab = 'summary' | 'flashcards' | 'quiz'

const previewTabs = [
  { id: 'summary' as const, label: 'Synthèse', icon: BookOpenText },
  { id: 'flashcards' as const, label: 'Flashcards', icon: Layers3 },
  { id: 'quiz' as const, label: 'Quiz', icon: FileQuestion },
]

const plans = [
  { name: 'Starter', price: '3,99 €', pages: '300 pages / mois', detail: 'Pour préparer un cours ou un examen.', points: ['100 pages par PDF', '50 flashcards par génération', '20 questions par quiz'] },
  { name: 'Student', price: '7,99 €', pages: '800 pages / mois', detail: 'Pour suivre plusieurs matières.', points: ['200 pages par PDF', '100 flashcards par génération', '50 questions par quiz'], featured: true },
  { name: 'Graduate', price: '12,99 €', pages: '10 000 pages / mois', detail: 'Pour les gros volumes de lecture.', points: ['500 pages par PDF', '200 flashcards par génération', '100 questions par quiz'] },
]

const questions = [
  ['Les PDF scannés fonctionnent-ils ?', 'CramDesk a besoin de texte sélectionnable. Un document constitué uniquement d’images peut ne pas être lisible.'],
  ['Puis-je réviser dans une autre langue ?', 'L’interface est disponible en neuf langues. Tu peux choisir la langue des flashcards et des quiz générés.'],
  ['Puis-je annuler mon abonnement ?', 'Oui. Tu peux gérer et annuler ton abonnement depuis ton espace de facturation.'],
]

function StudioPreview() {
  const [tab, setTab] = useState<PreviewTab>('summary')
  const [showAnswer, setShowAnswer] = useState(false)
  const [quizChoice, setQuizChoice] = useState<number | null>(null)

  return (
    <div id="produit" className="relative mx-auto max-w-6xl scroll-mt-28">
      <div className="relative overflow-hidden rounded-[1.4rem] border border-[#ddc9bd] bg-white shadow-[0_18px_50px_-40px_rgba(59,34,56,.36)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee8ed] bg-[#fffdf9] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-[#ffe0d1] text-[#b84432]"><FileText className="size-5" /></span>
            <div>
              <p className="text-sm font-bold text-[#2b2430]">Biologie cellulaire.pdf</p>
              <p className="text-xs text-[#837a84]">Document prêt à réviser</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e5eedf] bg-[#f3f8ee] px-3 py-1.5 text-xs font-semibold text-[#456d43]"><span className="size-1.5 rounded-full bg-[#6a9a64]" /> Aperçu interactif</span>
        </div>
        <div className="grid md:grid-cols-[190px_1fr]">
          <aside className="hidden border-r border-[#eee8ed] bg-[#fcf9fb] p-5 md:block">
            <p className="mb-6 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#a095a1]">Mon espace</p>
            <p className="rounded-xl bg-[#ead9e5] px-3 py-3 text-sm font-bold text-[#653657]"><BookOpenText className="mr-2 inline size-4" /> Documents</p>
            <p className="mt-6 px-3 text-[10px] font-bold uppercase tracking-[.2em] text-[#a095a1]">Réviser</p>
            <div className="mt-3 space-y-2">
              <p className="px-3 py-2 text-sm text-[#796e7b]"><Layers3 className="mr-2 inline size-4" /> Cartes</p>
              <p className="px-3 py-2 text-sm text-[#796e7b]"><FileQuestion className="mr-2 inline size-4" /> Quiz</p>
            </div>
          </aside>
          <div className="min-w-0 p-5 sm:p-8">
            <div className="mb-7 flex flex-col justify-between gap-5 border-b border-[#eee8ed] pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#8e6282]">Chapitre 04 · Sciences</p>
                <h3 className="font-editorial text-3xl leading-tight text-[#33252b] sm:text-4xl">La membrane cellulaire</h3>
              </div>
              <div className="flex flex-wrap gap-1.5" aria-label="Choisir un aperçu">
                {previewTabs.map(item => <button
                  key={item.id}
                  type="button"
                  aria-pressed={tab === item.id}
                  onClick={() => setTab(item.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition sm:px-4 ${tab === item.id ? 'bg-[#b84432] text-white shadow-sm' : 'bg-[#f7f3f6] text-[#6f6470] hover:bg-[#ece3ea]'}`}
                ><item.icon className="size-3.5" />{item.label}</button>)}
              </div>
            </div>
            {tab === 'summary' && <div className="grid gap-7 lg:grid-cols-[1.15fr_.85fr]">
              <div>
                <p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">L’essentiel en clair</p>
                <p className="max-w-lg text-base leading-8 text-[#4e4550]">La membrane cellulaire sépare la cellule de son environnement et régule les échanges. Sa structure souple repose sur une bicouche de phospholipides.</p>
                <div className="mt-6 space-y-3">
                  {['Une barrière sélective protège l’intérieur de la cellule.', 'Les protéines membranaires aident certaines molécules à traverser.'].map(item => <p key={item} className="flex gap-3 rounded-xl bg-[#faf7f9] p-3 text-sm leading-6 text-[#5b505d]"><CheckCircle2 className="mt-1 size-4 shrink-0 text-[#718e65]" />{item}</p>)}
                </div>
              </div>
              <div className="rounded-[1.2rem] border border-[#e9e3e8] bg-[#fcfaf9] p-5">
                <div className="mb-5 flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-[.18em] text-[#a18d9d]">Extrait de démonstration</span><FileText className="size-4 text-[#9d8799]" /></div>
                <p className="border-l-2 border-[#c25334] pl-4 text-sm leading-7 text-[#554b52]">« La membrane plasmique est formée d’une bicouche de phospholipides. Elle sépare le milieu intracellulaire du milieu extérieur et participe aux échanges. »</p>
                <p className="mt-6 text-xs leading-5 text-[#857b85]">La synthèse reste liée au texte du cours pour que tu puisses vérifier chaque notion.</p>
              </div>
            </div>}
            {tab === 'flashcards' && <div className="mx-auto max-w-2xl py-2 text-center">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">Révision active · Carte 01</p>
              <div className="flex min-h-44 flex-col items-center justify-center rounded-[1.4rem] border border-[#e9dae5] bg-[#fbf4f8] px-6 py-8">
                <p className="font-editorial text-2xl leading-snug text-[#352837] sm:text-3xl">{showAnswer ? 'Elle contrôle les échanges entre la cellule et son environnement.' : 'Quel est le rôle principal de la membrane cellulaire ?'}</p>
              </div>
              <button type="button" onClick={() => setShowAnswer(!showAnswer)} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b84432] px-5 py-3 text-sm font-bold text-white hover:bg-[#963326]">{showAnswer ? 'Revoir la question' : 'Voir la réponse'} <ArrowRight className="size-4" /></button>
            </div>}
            {tab === 'quiz' && <div className="mx-auto max-w-2xl py-1">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-[.2em] text-[#bb765f]">Vérifie ce que tu retiens · Question 01</p>
              <h4 className="font-editorial text-2xl leading-snug text-[#352837] sm:text-3xl">Quelle structure forme la barrière de la membrane ?</h4>
              <div className="mt-5 grid gap-2.5">
                {['Une bicouche de phospholipides', 'Une seule couche de protéines', 'Une paroi de cellulose'].map((answer, index) => <button key={answer} type="button" onClick={() => setQuizChoice(index)} className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${quizChoice === index ? index === 0 ? 'border-[#8baa80] bg-[#f1f7ee] text-[#3d663d]' : 'border-[#d9a8ba] bg-[#fcf1f5] text-[#754157]' : 'border-[#e9e2e7] bg-white text-[#544b55] hover:border-[#b89caf]'}`}><span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-current text-xs">{String.fromCharCode(65 + index)}</span>{answer}</button>)}
              </div>
              {quizChoice !== null && <p className="mt-3 text-sm text-[#6a5f6b]">{quizChoice === 0 ? 'Exact. La bicouche est la base de cette barrière.' : 'Pas tout à fait. Relis le passage sur la bicouche de phospholipides.'}</p>}
            </div>}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-5 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">{children}</p>
}

export default function LandingPage() {
  return <>
    <OrganizationJsonLd />
    <ProductJsonLd />
    <FAQJsonLd faqs={questions.map(([question, answer]) => ({ question, answer }))} />
    <LocalePreference locale="fr" />
    <div className="min-h-screen overflow-hidden bg-[#fffaf5] text-[#33252b]">
      <Navbar />
      <main>
        <section id="essayer" className="relative scroll-mt-20 border-b border-[var(--cd-line)] bg-[var(--cd-paper)] px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(380px,.86fr)] lg:gap-16">
            <div>
              <p className="mb-6 text-xs font-bold uppercase tracking-[.22em] text-[var(--cd-brand)]">CramDesk · ton espace de révision</p>
              <h1 className="font-editorial text-[clamp(3.2rem,6vw,6rem)] leading-[1.04] tracking-[-.055em] text-[var(--cd-ink)]">Ton PDF mérite mieux <span className="italic text-[var(--cd-brand)]">qu’une relecture.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-[#655a62] sm:text-lg">Importe ton cours et passe directement à l’essentiel : une synthèse claire, des réponses liées au document, puis des cartes et des quiz pour retenir.</p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <a href="#deposer-pdf" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--cd-brand)] px-6 text-sm font-bold text-white transition-colors hover:bg-[var(--cd-brand-hover)] lg:hidden"><Upload className="size-4" /> Déposer mon PDF</a>
                <Link href="#produit" className="inline-flex items-center gap-2 text-sm font-semibold text-[#664957] underline decoration-[#cbb1c3] underline-offset-8 hover:text-[#b84432]">Voir le résultat <ArrowRight className="size-4" /></Link>
              </div>
              <p className="mt-7 text-xs font-medium text-[#756b70]">7 jours d’essai sans carte bancaire · PDF avec texte sélectionnable</p>
            </div>
            <div id="deposer-pdf" className="scroll-mt-24 rounded-[1.5rem] border border-[#efdcd0] bg-white p-4 shadow-[0_28px_70px_-44px_rgba(61,36,56,.4)] sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-3 px-1"><p className="text-sm font-bold text-[#3b2e34]">Commence avec ton cours</p><span className="rounded-full bg-[#f4f7ef] px-2.5 py-1 text-xs font-semibold text-[#58744f]">Étape 1 sur 2</span></div>
              <DemoUpload />
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf5] px-5 py-16 sm:px-8 lg:py-24">
          <div className="mx-auto max-w-6xl"><div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><SectionEyebrow>Un espace pour comprendre et réviser</SectionEyebrow><h2 className="font-editorial text-3xl sm:text-4xl">Après l’import, tout est au même endroit.</h2></div><p className="max-w-sm text-sm leading-6 text-[#756b73]">Consulte le résumé, interroge ton document et teste ta compréhension à ton rythme.</p></div><StudioPreview /></div>
        </section>

        <section className="border-y border-[#f0dfd5] bg-white px-5 py-7 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-semibold text-[#746a76] sm:justify-between sm:text-sm">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="size-4 text-[#7b9a72]" /> Fiches, cartes et quiz au même endroit</span>
            <span className="inline-flex items-center gap-2"><Globe2 className="size-4 text-[#94708a]" /> Interface en 9 langues</span>
            <span className="inline-flex items-center gap-2"><LockKeyhole className="size-4 text-[#94708a]" /> Documents accessibles depuis ton compte</span>
          </div>
        </section>

        <section id="comment-ca-marche" className="scroll-mt-24 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.95fr_1.05fr] lg:gap-20">
            <div>
              <SectionEyebrow>Une autre façon de travailler</SectionEyebrow>
              <h2 className="font-editorial max-w-lg text-5xl leading-[1.08] tracking-[-.045em] sm:text-6xl">Relire, c’est bien.<br /><span className="italic text-[#c25334]">Retenir</span>, c’est mieux.</h2>
              <p className="mt-7 max-w-lg text-lg leading-8 text-[#706671]">Quand les cours s’accumulent, une synthèse claire et quelques questions bien ciblées aident à passer de la lecture à la pratique.</p>
              <Link href="#essayer" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#71405f] underline decoration-[#cbb1c3] underline-offset-8 hover:text-[#4b263e]">Essayer avec mon cours <ArrowUpRight className="size-4" /></Link>
            </div>
            <div className="space-y-3">
              {[
                { n: '01', icon: Upload, title: 'Importe ton cours', text: 'Choisis un PDF qui contient du texte sélectionnable. Ton document reste disponible dans ta bibliothèque.' },
                { n: '02', icon: Sparkles, title: 'Vois l’essentiel', text: 'Lis une synthèse structurée, puis retrouve les passages importants dans ta source.' },
                { n: '03', icon: MousePointer2, title: 'Passe à la pratique', text: 'Révise avec des flashcards et teste ta compréhension avec un quiz.' },
              ].map(step => <div key={step.n} className="flex gap-5 rounded-[1.3rem] border border-[#ebe3e9] bg-white p-5 shadow-[0_10px_28px_-25px_rgba(58,32,55,.35)] sm:p-6"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffe5d5] text-[#c25334]"><step.icon className="size-5" /></span><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9a8194]">Étape {step.n}</p><h3 className="mt-1 text-lg font-bold text-[#332837]">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#756b76]">{step.text}</p></div></div>)}
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#fff2e9] px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 max-w-3xl">
              <SectionEyebrow>Dans CramDesk</SectionEyebrow>
              <h2 className="font-editorial text-5xl leading-[1.08] tracking-[-.045em] sm:text-6xl">Quatre moments pour<br /><span className="italic text-[#c25334]">mieux apprendre.</span></h2>
              <p className="mt-5 text-lg leading-8 text-[#706671]">Chaque outil suit le même cours et répond à une question simple : qu’est-ce que je dois comprendre, retenir ou revoir ?</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="min-h-72 rounded-[1.6rem] bg-[#fbe5d8] p-7 sm:p-9"><div className="flex size-11 items-center justify-center rounded-2xl bg-white/80 text-[#c25334]"><BookOpenText className="size-5" /></div><h3 className="font-editorial mt-8 text-3xl">Comprendre.</h3><p className="mt-2 max-w-sm text-sm leading-7 text-[#6d5e6b]">Une synthèse et une explication plus simple pour saisir les notions clés avant de mémoriser.</p><div className="mt-6 max-w-md rounded-2xl border border-white/80 bg-white/75 p-4 text-sm text-[#695969] shadow-sm"><span className="font-bold text-[#c25334]">L’idée clé</span><p className="mt-1">Une membrane souple régule les échanges de la cellule avec son environnement.</p></div></article>
              <article className="min-h-72 rounded-[1.6rem] bg-[#e9ecf2] p-7 sm:p-9"><div className="flex size-11 items-center justify-center rounded-2xl bg-white/80 text-[#526584]"><Layers3 className="size-5" /></div><h3 className="font-editorial mt-8 text-3xl">Mémoriser.</h3><p className="mt-2 max-w-sm text-sm leading-7 text-[#596473]">Des flashcards question-réponse pour pratiquer le rappel actif, à ton rythme.</p><div className="mt-6 max-w-md rounded-2xl border border-white/80 bg-white/75 p-4 text-sm text-[#526075] shadow-sm"><span className="font-bold">Question 01</span><p className="mt-1">Quel est le rôle de la membrane cellulaire ?</p></div></article>
              <article className="min-h-72 rounded-[1.6rem] bg-[#ecf0e7] p-7 sm:p-9"><div className="flex size-11 items-center justify-center rounded-2xl bg-white/80 text-[#637e5d]"><FileQuestion className="size-5" /></div><h3 className="font-editorial mt-8 text-3xl">Te tester.</h3><p className="mt-2 max-w-sm text-sm leading-7 text-[#63705f]">Des quiz créés depuis ton document pour repérer les passages à reprendre.</p><div className="mt-6 max-w-md rounded-2xl border border-white/80 bg-white/75 p-4 text-sm text-[#5b6f55] shadow-sm"><span className="font-bold">À toi de jouer</span><p className="mt-1">Choisis une réponse et vois ce qu’il faut revoir.</p></div></article>
              <article className="min-h-72 rounded-[1.6rem] bg-[#f5eade] p-7 sm:p-9"><div className="flex size-11 items-center justify-center rounded-2xl bg-white/80 text-[#986c51]"><MessageCircle className="size-5" /></div><h3 className="font-editorial mt-8 text-3xl">Approfondir.</h3><p className="mt-2 max-w-sm text-sm leading-7 text-[#806c5d]">Pose une question sur le cours et reçois une réponse fondée sur le texte extrait.</p><div className="mt-6 max-w-md rounded-2xl border border-white/80 bg-white/75 p-4 text-sm text-[#806b5e] shadow-sm"><span className="font-bold">Dans le chat</span><p className="mt-1">« Peux-tu m’expliquer la bicouche simplement ? »</p></div></article>
            </div>
          </div>
        </section>

        <section id="outils-gratuits" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff1e7] px-5 py-20 sm:px-8 lg:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#efcdbb] bg-white/70 px-4 py-2 text-xs font-bold text-[#b84432]"><CalendarDays className="size-4" aria-hidden="true" /> Outils gratuits · Sans compte</span>
              <h2 className="font-editorial mt-6 text-5xl leading-[1.06] tracking-[-.045em] text-[#33252b] sm:text-6xl">Ton examen a une date. <span className="italic text-[#c25334]">Tes révisions aussi.</span></h2>
              <p className="mt-6 max-w-lg text-base leading-8 text-[#756968]">Indique tes matières et tes disponibilités. Notre planificateur répartit les chapitres et les rappels actifs, puis te laisse exporter ton calendrier.</p>
              <Link href="/planificateur-revisions" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#b84432] px-6 text-sm font-bold text-white shadow-[0_12px_28px_-15px_rgba(161,52,38,.7)] transition hover:-translate-y-0.5 hover:bg-[#963326]">Créer mon planning gratuit <ArrowRight className="size-4" aria-hidden="true" /></Link>
              <div className="mt-8 max-w-lg border-t border-[#e9cdbd] pt-6">
                <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#b84432]"><Calculator className="size-5" aria-hidden="true" /></span><div><p className="font-editorial text-2xl text-[#33252b]">Et la moyenne à viser ?</p><p className="mt-1 text-sm leading-6 text-[#756968]">Calcule ta moyenne avec coefficients et la note nécessaire au prochain devoir.</p><Link href="/calculateur-moyenne" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#b84432] underline-offset-4 hover:underline">Calculer ma moyenne <ArrowRight className="size-4" aria-hidden="true" /></Link></div></div>
              </div>
              <div className="mt-6 max-w-lg border-t border-[#e9cdbd] pt-6">
                <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#b84432]"><Layers3 className="size-5" aria-hidden="true" /></span><div><p className="font-editorial text-2xl text-[#33252b]">Et les notions à retenir ?</p><p className="mt-1 text-sm leading-6 text-[#756968]">Crée tes propres flashcards et retrouve les réponses par rappel actif.</p><Link href="/flashcards-gratuites" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#b84432] underline-offset-4 hover:underline">Créer des flashcards gratuites <ArrowRight className="size-4" aria-hidden="true" /></Link></div></div>
              </div>
              <div className="mt-6 max-w-lg border-t border-[#e9cdbd] pt-6"><p className="font-editorial text-2xl text-[#33252b]">Un PDF à préparer ?</p><p className="mt-1 text-sm leading-6 text-[#756968]">Fusionne, extrais ou réorganise tes pages dans ton navigateur, sans compte.</p><Link href="/outils-pdf" className="mt-3 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-[#b84432] underline-offset-4 hover:underline">Ouvrir les outils PDF gratuits <ArrowRight className="size-4" aria-hidden="true" /></Link></div>
              <p className="mt-5 text-xs text-[#887674]">Sans inscription ni carte bancaire. Tes données restent dans ton navigateur.</p>
            </div>
            <div className="rotate-[1deg] rounded-[1.8rem] border border-[#efd8ca] bg-white p-5 shadow-[0_30px_75px_-45px_rgba(132,58,35,.3)] sm:p-8">
              <div className="flex items-center justify-between border-b border-[#f0dfd5] pb-5"><div><p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#b45438]">Exemple de planning</p><h3 className="font-editorial mt-1 text-3xl text-[#33252b]">Cette semaine</h3></div><span className="flex size-12 items-center justify-center rounded-2xl bg-[#ffe6d6] text-[#b84432]"><CalendarDays className="size-6" aria-hidden="true" /></span></div>
              <div className="mt-5 space-y-3">{[
                ['Lun', 'Comprendre le chapitre 01', 'Biologie', 'bg-[#e97743]'],
                ['Mer', 'Rappel actif sans notes', 'Biologie', 'bg-[#b84432]'],
                ['Ven', 'Quiz et points à reprendre', 'Biologie', 'bg-[#7f9e76]'],
              ].map(([day, task, subject, color]) => <div key={day} className="flex items-center gap-4 rounded-xl bg-[#fff9f5] px-4 py-3"><span className="font-editorial w-10 shrink-0 text-xl text-[#b45438]">{day}</span><span className={`size-2 shrink-0 rounded-full ${color}`} /><div><p className="text-sm font-bold text-[#49383b]">{task}</p><p className="mt-0.5 text-xs text-[#8a7978]">{subject}</p></div></div>)}</div>
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-[#f3f7ee] px-4 py-3 text-sm font-semibold text-[#59764e]"><CheckCircle2 className="size-4" aria-hidden="true" /> Tu avances, séance après séance.</div>
            </div>
          </div>
        </section>


        <section id="pricing" className="scroll-mt-24 border-y border-[#f0dfd5] bg-[#fff9f5] px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-6xl"><div className="mb-12 max-w-3xl"><SectionEyebrow>Tarifs clairs</SectionEyebrow><h2 className="font-editorial text-5xl leading-[1.08] tracking-[-.045em] sm:text-6xl">À chaque rythme, <span className="italic text-[#c25334]">son espace.</span></h2><p className="mt-5 text-lg leading-8 text-[#706671]">Commence avec 7 jours d’essai sans carte bancaire. Choisis ensuite le volume qui te convient.</p></div>
            <div className="grid gap-4 lg:grid-cols-3">{plans.map(plan => <article key={plan.name} className={`relative flex flex-col rounded-[1.5rem] border p-7 sm:p-8 ${plan.featured ? 'border-[#d18068] bg-[#b84432] text-white shadow-[0_22px_45px_-28px_rgba(76,33,64,.7)]' : 'border-[#efdcd0] bg-white text-[#33252b]'}`}>{plan.featured && <span className="absolute right-6 top-6 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-white">Équilibré</span>}<h3 className="text-lg font-bold">{plan.name}</h3><p className={`mt-2 min-h-11 text-sm leading-6 ${plan.featured ? 'text-[#ffe3d7]' : 'text-[#7c717c]'}`}>{plan.detail}</p><p className="font-editorial mt-6 text-5xl leading-none">{plan.price}<span className={`ml-1 text-sm font-sans font-medium ${plan.featured ? 'text-[#e2cddd]' : 'text-[#8b818b]'}`}>/ mois</span></p><p className={`mt-3 text-sm font-bold ${plan.featured ? 'text-[#ffe1d5]' : 'text-[#c25334]'}`}>{plan.pages}</p><div className={`my-7 h-px ${plan.featured ? 'bg-white/20' : 'bg-[#f0dfd5]'}`} /><ul className="flex-1 space-y-3">{plan.points.map(point => <li key={point} className={`flex gap-2.5 text-sm ${plan.featured ? 'text-[#fff0e8]' : 'text-[#635864]'}`}><Check className="size-4 shrink-0" />{point}</li>)}</ul><Link href="/signup" className={`mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-full text-sm font-bold transition ${plan.featured ? 'bg-white text-[#b84432] hover:bg-[#ffebe1]' : 'border border-[#e7cec0] text-[#b84432] hover:bg-[#ffebe1]'}`}>Commencer l’essai <ChevronRight className="size-4" /></Link></article>)}</div>
            <p className="mt-7 max-w-4xl text-sm leading-6 text-[#817681]">Les générations utilisent le quota de pages de ton forfait. Les contenus créés par l’IA peuvent contenir des erreurs : vérifie les informations importantes dans ton PDF.</p>
          </div>
        </section>

        <section className="px-5 py-24 sm:px-8 lg:py-32"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20"><div><SectionEyebrow>Questions fréquentes</SectionEyebrow><h2 className="font-editorial text-5xl leading-[1.08] tracking-[-.045em] sm:text-6xl">Avant de te <span className="italic text-[#c25334]">lancer.</span></h2></div><div className="space-y-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-[1.2rem] border border-[#ebe2e9] bg-white p-5 sm:p-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#3a2e3b] marker:hidden sm:text-base">{question}<span className="text-2xl font-light text-[#c25334] transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-xl text-sm leading-7 text-[#776d78]">{answer}</p></details>)}</div></div></section>

        <section className="px-5 pb-20 sm:px-8 lg:pb-28"><div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 rounded-[1.8rem] bg-[#b84432] px-8 py-11 text-white sm:px-11 lg:flex-row lg:items-center lg:py-14"><div><h2 className="font-editorial max-w-xl text-4xl leading-tight sm:text-5xl">Ton cours peut devenir<br /><span className="italic text-[#ffe0d0]">ta meilleure révision.</span></h2><p className="mt-4 text-sm text-[#f0d5ca]">Essaie CramDesk pendant 7 jours, sans carte bancaire.</p></div><Link href="#essayer" className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#b84432] transition hover:bg-[#ffebe1]">Importer mon PDF <ArrowRight className="size-4" /></Link></div></section>
      </main>
      <footer className="border-t border-[#f0dfd5] bg-white px-5 py-12 text-sm text-[#807581] sm:px-8"><div className="mx-auto grid max-w-6xl gap-9 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]"><div><Link href="/" className="font-editorial text-3xl text-[#33252b]">CramDesk<span className="text-[#d05a39]">.</span></Link><p className="mt-3 max-w-sm leading-6">Un espace plus clair pour comprendre ton cours et t’entraîner à ton rythme.</p></div><div><p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#493b3e]">Explorer</p><nav className="flex flex-col gap-2"><Link href="#produit" className="hover:text-[#b84432]">Le studio</Link><Link href="/planificateur-revisions" className="hover:text-[#b84432]">Planificateur gratuit</Link><Link href="/calculateur-moyenne" className="hover:text-[#b84432]">Calculateur de moyenne</Link><Link href="/flashcards-gratuites" className="hover:text-[#b84432]">Flashcards gratuites</Link><Link href="/fiches-revision" className="hover:text-[#b84432]">Fiches de révision</Link><Link href="/quiz-pdf" className="hover:text-[#b84432]">Quiz PDF</Link><Link href="/pour-etudiants" className="hover:text-[#b84432]">Pour les étudiants</Link><Link href="#pricing" className="hover:text-[#b84432]">Tarifs</Link></nav></div><div><p className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-[#493b3e]">CramDesk</p><nav className="flex flex-col gap-2"><Link href="/privacy" className="hover:text-[#b84432]">Confidentialité</Link><Link href="/terms" className="hover:text-[#b84432]">Conditions</Link><Link href="/contact" className="hover:text-[#b84432]">Contact</Link></nav></div></div><div className="mx-auto mt-10 max-w-6xl border-t border-[#f3e3da] pt-6 text-xs">© {new Date().getFullYear()} CramDesk</div></footer>
    </div>
  </>
}
