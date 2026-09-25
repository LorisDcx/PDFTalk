import Link from 'next/link'
import { ArrowRight, Check, LockKeyhole } from 'lucide-react'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { WebPageJsonLd } from '@/components/json-ld'
import { PdfToolkit } from '@/components/pdf-toolkit'
import { pdfToolPages, pdfToolPath, type PdfToolPage } from '@/lib/pdf-tool-pages'

export function PdfToolDetailPage({ page, locale }: { page: PdfToolPage; locale: 'fr' | 'en' }) {
  const c = page[locale]
  const related = pdfToolPages.filter(item => item.id !== page.id).slice(0, 4)
  const english = locale === 'en'
  return <FeaturePageShell locale={locale}>
    <WebPageJsonLd title={c.title} description={c.description} url={`https://cramdesk.com${pdfToolPath(page, locale)}`} />
    <section className="border-b border-[var(--cd-line)] bg-[var(--cd-paper)] px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <nav aria-label={english ? 'Breadcrumb' : 'Fil d’Ariane'} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#766b70]">
          <Link href={english ? '/en' : '/'} className="hover:text-[var(--cd-brand)]">{english ? 'Home' : 'Accueil'}</Link><span aria-hidden="true">/</span>
          <Link href={english ? '/en/pdf-tools' : '/outils-pdf'} className="hover:text-[var(--cd-brand)]">{english ? 'PDF tools' : 'Outils PDF'}</Link><span aria-hidden="true">/</span><span aria-current="page" className="font-semibold text-[var(--cd-ink)]">{c.name}</span>
        </nav>
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_320px] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{english ? 'Free PDF tool · No account' : 'Outil PDF gratuit · Sans inscription'}</p>
            <h1 className="font-editorial mt-4 max-w-3xl text-[clamp(2.9rem,5.5vw,5.2rem)] leading-[1.04] tracking-[-.05em] text-[var(--cd-ink)]">{c.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#675e63]">{c.intro}</p>
            <a href="#outil" className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)]">{english ? 'Open the free tool' : 'Ouvrir l’outil gratuit'}<ArrowRight className="size-4" /></a>
          </div>
          <div className="border-l-2 border-[#d9a58e] pl-6 text-sm leading-7 text-[#685d61]">
            <LockKeyhole className="size-6 text-[var(--cd-brand)]" aria-hidden="true" />
            <p className="mt-4 font-bold text-[var(--cd-ink)]">{english ? 'Your files stay on your device' : 'Tes fichiers restent sur ton appareil'}</p>
            <p className="mt-1">{english ? 'Processing happens in this browser. No account, quota or file upload.' : 'Le traitement se fait dans ce navigateur. Pas de compte, de quota ni d’envoi de fichier.'}</p>
          </div>
        </div>
      </div>
    </section>
    <PdfToolkit key={page.id} locale={locale} initialTool={page.id} focused />
    <section className="px-5 py-16 sm:px-8 lg:py-20"><div className="mx-auto max-w-6xl">
      <h2 className="font-editorial text-4xl text-[var(--cd-ink)]">{english ? 'How it works' : 'Comment ça marche'}</h2>
      <ol className="mt-8 grid gap-4 md:grid-cols-3">{c.steps.map((step, index) => <li key={step} className="rounded-2xl border border-[var(--cd-line)] bg-white p-6"><span className="font-editorial text-3xl text-[var(--cd-brand)]">0{index + 1}</span><p className="mt-4 text-base leading-7 text-[#554b50]">{step}</p></li>)}</ol>
      <div className="mt-10 grid gap-8 border-t border-[var(--cd-line)] pt-9 md:grid-cols-2">
        <div><h2 className="font-editorial text-3xl text-[var(--cd-ink)]">{english ? 'Useful for' : 'Utile pour'}</h2><ul className="mt-4 space-y-3">{c.uses.map(use => <li key={use} className="flex gap-3 text-base leading-7 text-[#62575d]"><Check className="mt-1 size-4 shrink-0 text-[var(--cd-brand)]" />{use}</li>)}</ul></div>
        <div><h2 className="font-editorial text-3xl text-[var(--cd-ink)]">{english ? 'Good to know' : 'Bon à savoir'}</h2><p className="mt-4 text-base leading-7 text-[#62575d]">{c.tip}</p><h3 className="mt-6 font-bold text-[var(--cd-ink)]">{c.question}</h3><p className="mt-2 text-base leading-7 text-[#62575d]">{c.answer}</p></div>
      </div>
    </div></section>
    <section className="border-t border-[var(--cd-line)] bg-white px-5 py-14 sm:px-8"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-end justify-between gap-4"><h2 className="font-editorial text-3xl text-[var(--cd-ink)]">{english ? 'Other free PDF tools' : 'Autres outils PDF gratuits'}</h2><Link href={english ? '/en/pdf-tools' : '/outils-pdf'} className="inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--cd-brand)] hover:underline">{english ? 'All tools' : 'Tous les outils'} <ArrowRight className="size-4" /></Link></div><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{related.map(item => <Link key={item.id} href={pdfToolPath(item, locale)} className="flex min-h-20 items-center justify-between gap-3 rounded-xl border border-[var(--cd-line)] p-4 font-semibold text-[var(--cd-ink)] transition hover:border-[var(--cd-brand)] hover:bg-[#fff8f3] focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)]">{item[locale].name}<ArrowRight className="size-4 shrink-0 text-[var(--cd-brand)]" /></Link>)}</div></div></section>
  </FeaturePageShell>
}
