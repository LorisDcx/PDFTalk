'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Globe2, Menu, X } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { useAuth } from '@/components/auth-provider'
import { localizedLandings } from '@/lib/seo-locales'
import { STUDY_PDF_LOCALES, studyPdfCopy, studyPdfPath, type StudyPdfLocale } from '@/lib/study-pdf-locales'

const labels: Record<Exclude<StudyPdfLocale, 'fr' | 'en'>, { studio: string; tool: string; how: string; plans: string; menu: string; account: string }> = {
  es: { studio: 'Espacio de estudio', tool: 'Explorar un PDF', how: 'Cómo funciona', plans: 'Precios', menu: 'Menú', account: 'Mi espacio' },
  de: { studio: 'Lernbereich', tool: 'PDF durchsuchen', how: 'So funktioniert es', plans: 'Preise', menu: 'Menü', account: 'Mein Bereich' },
  it: { studio: 'Spazio di studio', tool: 'Esplora un PDF', how: 'Come funziona', plans: 'Prezzi', menu: 'Menu', account: 'Il mio spazio' },
  pt: { studio: 'Espaço de estudo', tool: 'Explorar um PDF', how: 'Como funciona', plans: 'Preços', menu: 'Menu', account: 'O meu espaço' },
  zh: { studio: '学习空间', tool: '搜索 PDF', how: '使用方法', plans: '价格', menu: '菜单', account: '我的空间' },
  ja: { studio: '学習スペース', tool: 'PDFを検索', how: '使い方', plans: '料金', menu: 'メニュー', account: 'マイスペース' },
  ar: { studio: 'مساحة الدراسة', tool: 'استكشف ملف PDF', how: 'كيف يعمل', plans: 'الأسعار', menu: 'القائمة', account: 'مساحتي' },
}

export function PublicSiteHeader({ locale }: { locale: StudyPdfLocale }) {
  if (locale === 'fr' || locale === 'en') return <Navbar publicLocale={locale} />
  return <InternationalHeader locale={locale} />
}

function InternationalHeader({ locale }: { locale: Exclude<StudyPdfLocale, 'fr' | 'en'> }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const c = labels[locale]
  const home = `/${locale}`
  const onTool = pathname.endsWith('/extract-text-from-pdf')
  const links = [
    { href: `${home}#studio`, label: c.studio },
    { href: studyPdfPath(locale), label: c.tool },
    { href: `${home}#how-it-works`, label: c.how },
    { href: `${home}#pricing`, label: c.plans },
  ]

  return <header dir={locale === 'ar' ? 'rtl' : 'ltr'} className="sticky top-0 z-50 border-b border-[var(--cd-line)] bg-[var(--cd-paper)]/95 backdrop-blur-xl">
    <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
      <Link href={home} className="inline-flex shrink-0 items-center gap-2.5" aria-label="CramDesk">
        <Image src="/logo.png" width={36} height={36} alt="" className="size-9 rounded-xl" />
        <span dir="ltr" className="font-editorial text-[1.65rem] leading-none tracking-[-.045em] text-[var(--cd-ink)]">CramDesk<span className="text-[var(--cd-brand)]">.</span></span>
      </Link>

      <nav aria-label={c.menu} className="hidden items-center gap-1 rounded-full border border-[var(--cd-line)] bg-white p-1 xl:flex">
        {links.map(link => <Link key={link.href} href={link.href} className="inline-flex min-h-10 items-center rounded-full px-4 text-xs font-bold text-[#625563] hover:bg-[#fff5ef] hover:text-[var(--cd-brand)]">{link.label}</Link>)}
      </nav>

      <div className="hidden shrink-0 items-center gap-3 xl:flex">
        <details className="group relative"><summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 rounded-full px-3 text-xs font-bold text-[#625563] hover:bg-[#fff5ef]"><Globe2 className="size-4" />{studyPdfCopy[locale].name}<span aria-hidden="true">⌄</span></summary><div className="absolute end-0 z-30 mt-2 max-h-80 min-w-40 overflow-auto rounded-xl border border-[var(--cd-line)] bg-white p-2 shadow-lg">{STUDY_PDF_LOCALES.map(item => <Link key={item} href={onTool ? studyPdfPath(item) : item === 'fr' ? '/' : `/${item}`} lang={item} className="block min-h-11 rounded-lg px-3 py-2 text-sm hover:bg-[#fff0e6]">{studyPdfCopy[item].name}</Link>)}</div></details>
        {!isLoading && (user ? <Link href="/dashboard" className="inline-flex min-h-10 items-center rounded-full bg-[var(--cd-brand)] px-5 text-xs font-bold text-white">{c.account}</Link> : <><Link href="/login" className="px-2 text-xs font-bold text-[#5a4d59] hover:text-[var(--cd-brand)]">{localizedLandings[locale].login}</Link><Link href="/signup" className="inline-flex min-h-10 items-center rounded-full bg-[var(--cd-brand)] px-5 text-xs font-bold text-white">{localizedLandings[locale].start}</Link></>)}
      </div>

      <button type="button" aria-label={c.menu} aria-expanded={menuOpen} aria-controls="international-mobile-menu" onClick={() => setMenuOpen(value => !value)} className="inline-flex size-11 items-center justify-center rounded-full border border-[var(--cd-line)] bg-white text-[var(--cd-ink)] xl:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
    </div>
    {menuOpen && <div id="international-mobile-menu" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-[var(--cd-line)] bg-[var(--cd-paper)] px-5 py-4 xl:hidden"><nav aria-label={c.menu} className="mx-auto grid max-w-7xl gap-1">
      {links.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 text-base font-semibold text-[var(--cd-ink)] hover:bg-white">{link.label}</Link>)}
      <details className="mt-2 rounded-xl border border-[var(--cd-line)] bg-white"><summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 px-4 text-base font-semibold"><Globe2 className="size-4" />{studyPdfCopy[locale].name}</summary><div className="grid max-h-64 overflow-auto border-t border-[var(--cd-line)] p-2">{STUDY_PDF_LOCALES.map(item => <Link key={item} href={onTool ? studyPdfPath(item) : item === 'fr' ? '/' : `/${item}`} lang={item} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-lg px-3 text-base hover:bg-[#fff0e6]">{studyPdfCopy[item].name}</Link>)}</div></details>
      {!isLoading && (user ? <Link href="/dashboard" className="mt-2 flex min-h-12 items-center justify-center rounded-xl bg-[var(--cd-brand)] px-4 font-bold text-white">{c.account}</Link> : <div className="mt-2 grid grid-cols-2 gap-2"><Link href="/login" className="flex min-h-12 items-center justify-center rounded-xl border border-[var(--cd-line)] bg-white px-3 font-bold">{localizedLandings[locale].login}</Link><Link href="/signup" className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--cd-brand)] px-3 font-bold text-white">{localizedLandings[locale].start}</Link></div>)}
    </nav></div>}
  </header>
}
