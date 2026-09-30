import Link from 'next/link'
import { blogIndexPath, blogCopy } from '@/lib/blog-content'
import { landingExperienceCopy } from '@/lib/landing-experience-locales'
import { pdfHubPath } from '@/lib/pdf-tool-locales'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'
import { curatedDeckCopy, freeFlashcardsPath } from '@/lib/curated-decks'

export function EditorialFooter({ locale }: { locale: StudyPdfLocale }) {
  const home = locale === 'fr' ? '/' : `/${locale}`
  const labels = locale === 'fr'
    ? { home: 'Accueil', tools: 'Outils PDF gratuits', privacy: 'Confidentialité', contact: 'Contact' }
    : { home: landingExperienceCopy[locale].footer.studio, tools: landingExperienceCopy[locale].footer.tools, privacy: landingExperienceCopy[locale].footer.privacy, contact: landingExperienceCopy[locale].footer.contact }
  return <footer lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="border-t border-[var(--cd-line)] bg-white px-5 py-10 text-sm text-[var(--cd-muted)] sm:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-7"><div><Link href={home} dir="ltr" className="font-editorial text-2xl text-[var(--cd-ink)]">CramDesk<span className="text-[var(--cd-brand)]">.</span></Link><p className="mt-2">© {new Date().getFullYear()} CramDesk</p></div><nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label={blogCopy[locale].eyebrow}><Link href={home} className="hover:text-[var(--cd-brand)]">{labels.home}</Link><Link href={blogIndexPath(locale)} className="hover:text-[var(--cd-brand)]">{blogCopy[locale].eyebrow}</Link><Link href={freeFlashcardsPath(locale)} className="hover:text-[var(--cd-brand)]">{curatedDeckCopy[locale].title}</Link><Link href={pdfHubPath(locale)} className="hover:text-[var(--cd-brand)]">{labels.tools}</Link><Link href="/privacy" className="hover:text-[var(--cd-brand)]">{labels.privacy}</Link><Link href="/contact" className="hover:text-[var(--cd-brand)]">{labels.contact}</Link><a href="https://www.3h36agency.fr/realisations/cramdesk" className="hover:text-[var(--cd-brand)]">3h36 Agency</a></nav></div></footer>
}
