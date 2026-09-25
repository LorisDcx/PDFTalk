import Link from 'next/link'
import { ArrowRight, FileStack } from 'lucide-react'
import { FAQJsonLd, WebPageJsonLd } from '@/components/json-ld'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { PdfToolkit } from '@/components/pdf-toolkit'
import { pdfToolPages, pdfToolPath } from '@/lib/pdf-tool-pages'

const content = {
  fr: {
    eyebrow: 'Atelier PDF gratuit · Sans inscription',
    title: <>Tes PDF, <span className="italic text-[#b84432]">prêts pour travailler.</span></>,
    lead: 'Fusionne, extrais, réorganise et annote tes documents de cours. Visualise les pages, choisis-les au clic et télécharge le résultat, gratuitement dans ton navigateur.',
    action: 'Choisir un outil PDF',
    note: 'Aucun transfert : tes fichiers restent sur ton appareil.',
    method: 'L’essentiel du PDF, sans détour.',
    steps: [
      ['01', 'Choisis une tâche', 'Commence par l’action dont tu as besoin, sans créer de compte.'],
      ['02', 'Organise les pages', 'Vois les miniatures, choisis les pages utiles et change leur ordre sans saisir de numéros.'],
      ['03', 'Télécharge le résultat', 'Récupère un nouveau PDF, puis continue tes révisions.'],
    ],
    studyTitle: 'Un PDF propre. Puis un cours compris.',
    studyText: 'Une fois les bonnes pages rassemblées, importe ton document dans CramDesk pour l’expliquer, le résumer et t’entraîner. Cette étape est facultative et distincte des outils gratuits.',
    studyAction: 'Découvrir le studio',
    faqTitle: 'Questions fréquentes',
    faqs: [
      { question: 'Les outils PDF sont-ils vraiment gratuits ?', answer: 'Oui. Fusion, extraction, réorganisation, rotation, pagination, filigrane, nettoyage des métadonnées standards et conversion JPG/PNG en PDF fonctionnent sans compte ni abonnement.' },
      { question: 'Mes fichiers sont-ils envoyés sur un serveur ?', answer: 'Non. Ces huit outils traitent les fichiers localement dans ton navigateur. Le document généré est téléchargé sur ton appareil.' },
      { question: 'Puis-je compresser un PDF ou faire de l’OCR ?', answer: 'Ces opérations ne sont pas proposées ici : une compression utile ou la reconnaissance de texte ne peuvent pas être garanties par les opérations locales actuelles.' },
      { question: 'Le retrait des métadonnées anonymise-t-il mon PDF ?', answer: 'Non. Il efface les champs standards comme l’auteur et le titre. Le contenu visible, les annotations et d’autres données intégrées peuvent subsister : vérifie le résultat avant de le partager.' },
    ],
  },
  en: {
    eyebrow: 'Free PDF workspace · No account',
    title: <>Your PDFs, <span className="italic text-[#b84432]">ready to study.</span></>,
    lead: 'Merge, extract, reorder and annotate your course documents. Preview pages, choose them with a click and download the result for free in your browser.',
    action: 'Choose a PDF tool',
    note: 'No upload: your files stay on your device.',
    method: 'The PDF essentials, without friction.',
    steps: [
      ['01', 'Choose a task', 'Start with what you need, without creating an account.'],
      ['02', 'Organize your pages', 'See thumbnails, choose useful pages and change their order without typing page numbers.'],
      ['03', 'Download the result', 'Get a new PDF and carry on studying.'],
    ],
    studyTitle: 'A tidy PDF. Then a course you understand.',
    studyText: 'Once the right pages are together, bring your document into CramDesk to explain, summarize and practice it. This optional step is separate from the free tools.',
    studyAction: 'Explore the studio',
    faqTitle: 'Frequently asked questions',
    faqs: [
      { question: 'Are the PDF tools really free?', answer: 'Yes. Merge, extract, reorder, rotate, page numbers, watermark, standard metadata clearing and JPG/PNG to PDF work without an account or subscription.' },
      { question: 'Are my files uploaded to a server?', answer: 'No. These eight tools process files locally in your browser. The finished PDF downloads to your device.' },
      { question: 'Can I compress a PDF or run OCR?', answer: 'Those operations are not offered here: useful compression and text recognition cannot be guaranteed by the current local operations.' },
      { question: 'Does removing metadata anonymize my PDF?', answer: 'No. It clears standard fields such as author and title. Visible content, annotations and other embedded data may remain: inspect the result before sharing.' },
    ],
  },
}

export function PdfToolsLanding({ locale }: { locale: 'fr' | 'en' }) {
  const c = content[locale]
  const url = `https://cramdesk.com/${locale === 'fr' ? 'outils-pdf' : 'en/pdf-tools'}`
  return <FeaturePageShell locale={locale}>
    <WebPageJsonLd title={locale === 'fr' ? 'Outils PDF gratuits en ligne' : 'Free online PDF tools'} description={c.lead} url={url} />
    <FAQJsonLd faqs={c.faqs} />
    <section className="px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24"><div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_.8fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b84432]">{c.eyebrow}</p><h1 className="font-editorial mt-5 max-w-3xl text-[clamp(3.25rem,6.5vw,6rem)] leading-[1.02] tracking-[-.05em] text-[#33252b]">{c.title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#716666]">{c.lead}</p><a href="#outil" className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#b84432] px-7 text-sm font-bold text-white hover:bg-[#963326]">{c.action}<ArrowRight className="size-4" /></a><p className="mt-4 text-sm text-[#786c6c]">{c.note}</p></div><div className="border-l-2 border-[#d9a58e] pl-7 text-[#514145] sm:pl-10"><FileStack className="size-10 text-[#b84432]" /><p className="font-editorial mt-6 text-3xl leading-snug">8 {locale === 'fr' ? 'actions utiles, un seul espace de travail.' : 'useful actions, one workspace.'}</p><div className="mt-7 flex flex-wrap gap-2 text-sm"><span className="rounded-full bg-[#fff0e6] px-3 py-2">PDF</span><span className="rounded-full bg-[#fff0e6] px-3 py-2">JPG / PNG</span><span className="rounded-full bg-[#fff0e6] px-3 py-2">{locale === 'fr' ? 'Local' : 'On-device'}</span></div></div></div></section>
    <PdfToolkit locale={locale} />
    <section className="border-y border-[#eadbd2] bg-white px-5 py-16 sm:px-8"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b84432]">{locale === 'fr' ? 'Chaque besoin, son outil' : 'A tool for every task'}</p><h2 className="font-editorial mt-3 text-4xl text-[#33252b] sm:text-5xl">{locale === 'fr' ? 'Choisis directement ce que tu veux faire.' : 'Go straight to what you need.'}</h2></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{pdfToolPages.map(page => <Link key={page.id} href={pdfToolPath(page, locale)} className="group flex min-h-36 flex-col justify-between rounded-2xl border border-[#eadbd2] bg-[#fffaf6] p-5 transition hover:border-[#b84432] hover:bg-[#fff3ea] focus-visible:outline-2 focus-visible:outline-[#b84432]"><span className="text-lg font-bold text-[#3d3033]">{page[locale].name}</span><span className="mt-5 flex items-end justify-between gap-2 text-sm leading-6 text-[#726669]">{page[locale].uses[0]}<ArrowRight className="size-4 shrink-0 text-[#b84432] transition group-hover:translate-x-1" /></span></Link>)}</div></div></section>
    <section className="px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto max-w-6xl"><h2 className="font-editorial max-w-3xl text-4xl leading-tight text-[#33252b] sm:text-5xl">{c.method}</h2><div className="mt-10 grid gap-8 border-t border-[#e8dbd3] pt-8 md:grid-cols-3">{c.steps.map(([number, title, text]) => <div key={number}><span className="font-editorial text-3xl text-[#b84432]">{number}</span><h3 className="mt-3 text-lg font-bold text-[#3d3033]">{title}</h3><p className="mt-2 max-w-sm text-base leading-7 text-[#73686a]">{text}</p></div>)}</div></div></section>
    <section className="bg-[#fff0e6] px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#b84432]">CramDesk</p><h2 className="font-editorial mt-3 max-w-xl text-4xl text-[#33252b] sm:text-5xl">{c.studyTitle}</h2><p className="mt-4 max-w-2xl text-base leading-7 text-[#726566]">{c.studyText}</p></div><Link href={locale === 'fr' ? '/#produit' : '/en#studio'} className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full border border-[#d8a996] bg-white px-6 text-sm font-bold text-[#9c3c2b]">{c.studyAction}<ArrowRight className="size-4" /></Link></div></section>
    <section className="px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto max-w-4xl"><h2 className="font-editorial text-4xl text-[#33252b]">{c.faqTitle}</h2><div className="mt-8 divide-y divide-[#eadbd2] border-y border-[#eadbd2]">{c.faqs.map(item => <details key={item.question} className="group py-5"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-[#3c3033] marker:hidden">{item.question}<span className="text-2xl font-normal text-[#b84432] group-open:rotate-45">+</span></summary><p className="max-w-2xl pb-2 pt-2 text-base leading-7 text-[#73686a]">{item.answer}</p></details>)}</div></div></section>
  </FeaturePageShell>
}
