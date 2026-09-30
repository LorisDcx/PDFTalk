import Link from 'next/link'
import { ArrowRight, BookOpenText, CheckCircle2 } from 'lucide-react'
import { blogArticlePath, blogCopy, blogIndexPath, BLOG_IDS, type BlogArticleId } from '@/lib/blog-content'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

export function BlogIndex({ locale }: { locale: StudyPdfLocale }) {
  const c = blogCopy[locale]
  return <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--cd-paper)] text-[var(--cd-ink)]">
    <section className="border-b border-[var(--cd-line)] px-5 py-16 sm:px-8 lg:py-24"><div className="mx-auto max-w-6xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{c.eyebrow}</p><h1 className={`${locale === 'ar' ? 'font-semibold' : 'font-editorial'} mt-5 max-w-4xl text-5xl leading-[1.06] sm:text-6xl`}>{c.indexTitle}</h1><p className="mt-6 max-w-2xl text-base leading-8 text-[var(--cd-muted)]">{c.indexDescription}</p></div></section>
    <section className="px-5 py-14 sm:px-8 lg:py-20"><div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">{BLOG_IDS.map(id => { const article = c.articles[id]; return <article key={id} className="flex flex-col rounded-3xl border border-[var(--cd-line)] bg-white p-7 sm:p-9"><span className="flex size-11 items-center justify-center rounded-2xl bg-[#ffe5d5] text-[var(--cd-brand)]"><BookOpenText className="size-5" /></span><h2 className={`${locale === 'ar' ? 'font-semibold' : 'font-editorial'} mt-8 text-3xl leading-tight`}>{article.title}</h2><p className="mt-4 flex-1 text-base leading-7 text-[var(--cd-muted)]">{article.description}</p><Link href={blogArticlePath(locale, id)} className="mt-7 inline-flex min-h-11 items-center gap-2 font-bold text-[var(--cd-brand)] underline-offset-4 hover:underline">{c.read}<ArrowRight className="size-4" /></Link></article> })}</div></section>
  </main>
}

export function BlogArticlePage({ locale, id }: { locale: StudyPdfLocale; id: BlogArticleId }) {
  const c = blogCopy[locale]
  const article = c.articles[id]
  const relatedId = BLOG_IDS.find(other => other !== id)!
  return <main lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[var(--cd-paper)] text-[var(--cd-ink)]">
    <article className="px-5 pb-20 pt-10 sm:px-8 sm:pt-16"><div className="mx-auto max-w-3xl"><Link href={blogIndexPath(locale)} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--cd-brand)] underline-offset-4 hover:underline">← {c.back}</Link><p className="mt-10 text-xs font-bold uppercase tracking-[.18em] text-[var(--cd-brand)]">{c.eyebrow}</p><h1 className={`${locale === 'ar' ? 'font-semibold' : 'font-editorial'} mt-4 text-[clamp(2.6rem,6vw,4.5rem)] leading-[1.07] tracking-[-.035em]`}>{article.title}</h1><p className="mt-7 text-lg leading-8 text-[var(--cd-muted)]">{article.lead}</p><div className="mt-10 border-t border-[var(--cd-line)]">{article.sections.map(section => <section key={section.title} className="border-b border-[var(--cd-line)] py-9"><h2 className={`${locale === 'ar' ? 'font-semibold' : 'font-editorial'} text-3xl leading-tight`}>{section.title}</h2><p className="mt-4 text-base leading-8 text-[#514650]">{section.body}</p></section>)}</div><aside className="mt-10 flex gap-4 rounded-2xl bg-[#fff0e6] p-6"><CheckCircle2 className="mt-1 size-5 shrink-0 text-[var(--cd-brand)]" /><p className="text-base leading-7">{article.takeaway}</p></aside><div className="mt-12 flex flex-wrap gap-4"><Link href={`${locale === 'fr' ? '/' : `/${locale}`}#essayer`} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[var(--cd-brand)] px-6 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)]">{c.tryTool}<ArrowRight className="size-4" /></Link><Link href={blogArticlePath(locale, relatedId)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[var(--cd-line)] bg-white px-6 text-sm font-bold text-[var(--cd-brand)] hover:bg-[#fff5ee]">{c.articles[relatedId].title}<ArrowRight className="size-4" /></Link></div></div></article>
  </main>
}
