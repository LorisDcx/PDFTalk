'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, CreditCard, FolderOpen, GraduationCap, LayoutDashboard, LogOut, Menu, PenTool, Settings, X } from 'lucide-react'
import { useAuth } from './auth-provider'
import { Avatar, AvatarFallback } from './ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { LanguageSelector } from './language-selector'
import { TrialCountdown } from './trial-countdown'
import { useLanguage } from '@/lib/i18n'
import { pdfHubPath } from '@/lib/pdf-tool-locales'
import { studyPdfPath, type StudyPdfLocale } from '@/lib/study-pdf-locales'
import { freeFlashcardsPath } from '@/lib/curated-decks'

const navigationCopy: Record<StudyPdfLocale, {
  free: string; pdf: string; explore: string; cards: string; freeCards: string; planner: string
  study: string; how: string; pricing: string; login: string; trial: string
  account: string; open: string; close: string; language: string; app: string
}> = {
  fr: { free: 'Outils gratuits', pdf: 'Outils PDF', explore: 'Explorer un PDF', cards: 'Flashcards', freeCards: 'Flashcards gratuites', planner: 'Planifier ses révisions', study: 'Réviser', how: 'Comment ça marche', pricing: 'Tarifs', login: 'Connexion', trial: 'Essayer gratuitement', account: 'Compte', open: 'Ouvrir le menu', close: 'Fermer le menu', language: 'Langue', app: 'Espace de travail' },
  en: { free: 'Free tools', pdf: 'PDF tools', explore: 'Explore a PDF', cards: 'Flashcards', freeCards: 'Free flashcards', planner: 'Study planner', study: 'Study', how: 'How it works', pricing: 'Plans', login: 'Sign in', trial: 'Start free trial', account: 'Account', open: 'Open menu', close: 'Close menu', language: 'Language', app: 'Workspace' },
  es: { free: 'Herramientas gratis', pdf: 'Herramientas PDF', explore: 'Explorar un PDF', cards: 'Tarjetas', freeCards: 'Tarjetas gratis', planner: 'Planificar el estudio', study: 'Estudiar', how: 'Cómo funciona', pricing: 'Precios', login: 'Iniciar sesión', trial: 'Probar gratis', account: 'Cuenta', open: 'Abrir menú', close: 'Cerrar menú', language: 'Idioma', app: 'Espacio de trabajo' },
  de: { free: 'Kostenlose Tools', pdf: 'PDF-Werkzeuge', explore: 'PDF erkunden', cards: 'Karteikarten', freeCards: 'Kostenlose Karteikarten', planner: 'Lernen planen', study: 'Lernen', how: 'So funktioniert es', pricing: 'Preise', login: 'Anmelden', trial: 'Kostenlos testen', account: 'Konto', open: 'Menü öffnen', close: 'Menü schließen', language: 'Sprache', app: 'Arbeitsbereich' },
  it: { free: 'Strumenti gratuiti', pdf: 'Strumenti PDF', explore: 'Esplora un PDF', cards: 'Flashcard', freeCards: 'Flashcard gratuite', planner: 'Pianifica lo studio', study: 'Studiare', how: 'Come funziona', pricing: 'Prezzi', login: 'Accedi', trial: 'Prova gratis', account: 'Account', open: 'Apri menu', close: 'Chiudi menu', language: 'Lingua', app: 'Area di lavoro' },
  pt: { free: 'Ferramentas grátis', pdf: 'Ferramentas PDF', explore: 'Explorar um PDF', cards: 'Cartões', freeCards: 'Cartões gratuitos', planner: 'Planear revisões', study: 'Estudar', how: 'Como funciona', pricing: 'Preços', login: 'Entrar', trial: 'Experimentar grátis', account: 'Conta', open: 'Abrir menu', close: 'Fechar menu', language: 'Idioma', app: 'Área de trabalho' },
  zh: { free: '免费工具', pdf: 'PDF 工具', explore: '探索 PDF', cards: '记忆卡片', freeCards: '免费记忆卡片', planner: '复习计划', study: '学习', how: '使用方法', pricing: '价格', login: '登录', trial: '免费试用', account: '账户', open: '打开菜单', close: '关闭菜单', language: '语言', app: '学习空间' },
  ja: { free: '無料ツール', pdf: 'PDFツール', explore: 'PDFを調べる', cards: 'フラッシュカード', freeCards: '無料フラッシュカード', planner: '学習計画', study: '学習する', how: '使い方', pricing: '料金', login: 'ログイン', trial: '無料で試す', account: 'アカウント', open: 'メニューを開く', close: 'メニューを閉じる', language: '言語', app: '学習スペース' },
  ar: { free: 'أدوات مجانية', pdf: 'أدوات PDF', explore: 'استكشف PDF', cards: 'بطاقات', freeCards: 'بطاقات مجانية', planner: 'خطط للمراجعة', study: 'المراجعة', how: 'كيف يعمل', pricing: 'الأسعار', login: 'تسجيل الدخول', trial: 'جرّب مجانًا', account: 'الحساب', open: 'فتح القائمة', close: 'إغلاق القائمة', language: 'اللغة', app: 'مساحة الدراسة' },
}

export function Navbar({ publicLocale }: { publicLocale?: StudyPdfLocale } = {}) {
  const { user, profile, signOut, isLoading } = useAuth()
  const pathname = usePathname()
  const { t, language } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const locale = (publicLocale ?? language) as StudyPdfLocale
  const c = navigationCopy[locale]
  const home = locale === 'fr' ? '/' : `/${locale}`
  const toolsHref = pdfHubPath(locale)
  const freeLinks = [
    { href: toolsHref, label: c.pdf },
    { href: studyPdfPath(locale), label: c.explore },
    { href: freeFlashcardsPath(locale), label: c.freeCards },
    ...(locale === 'fr' ? [{ href: '/planificateur-revisions', label: c.planner }] : []),
  ]
  const studioHref = `${home}${locale === 'fr' ? '#produit' : '#studio'}`
  const pricingHref = `${home}#pricing`
  const publicCardsHref = freeFlashcardsPath(locale)
  const mobileFreeLinks = user ? freeLinks : freeLinks.filter(link => link.href !== studyPdfPath(locale) && link.href !== publicCardsHref)
  const publicLinks = [
    { href: studioHref, label: c.study, active: pathname === home },
    { href: studyPdfPath(locale), label: c.explore, active: pathname === studyPdfPath(locale) },
    { href: publicCardsHref, label: c.cards, active: pathname === publicCardsHref },
    { href: pricingHref, label: c.pricing, active: false },
  ]
  const appLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/documents', label: t('documents'), icon: FolderOpen },
    { href: '/flashcards', label: t('flashcards'), icon: GraduationCap },
    { href: '/writer', label: t('writer'), icon: PenTool },
  ]
  const activeAppLink = (href: string) => href === '/dashboard' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
  const freeActive = pathname === toolsHref || pathname.startsWith(`${toolsHref}/`)
  const initials = (profile?.name || user?.email || 'U').slice(0, 2).toUpperCase()
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--cd-line)] bg-[var(--cd-paper)]/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[4.75rem] max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:px-8">
        <Link href={home} className="inline-flex shrink-0 items-center gap-2.5" aria-label="CramDesk — accueil">
          <Image src="/flame-logo.png" width={44} height={44} alt="" className="size-11 rounded-xl" />
          <span dir="ltr" className="font-editorial text-[1.65rem] leading-none tracking-[-.045em] text-[var(--cd-ink)]">CramDesk<span className="text-[var(--cd-brand)]">.</span></span>
        </Link>

        {isLoading ? <span className="hidden h-10 w-72 animate-pulse rounded-xl bg-[#f1e9e3] xl:block" /> : (
          <nav className="hidden items-center justify-center gap-1 xl:flex" aria-label={user ? c.app : c.study}>
            {user ? appLinks.map(link => <Link key={link.href} href={link.href} aria-current={activeAppLink(link.href) ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors ${activeAppLink(link.href) ? 'bg-[#fff0e6] text-[var(--cd-brand)]' : 'text-[var(--cd-ink)] hover:bg-white hover:text-[var(--cd-brand)]'}`}>{link.label}</Link>) : publicLinks.map(link => <Link key={link.href} href={link.href} aria-current={link.active ? 'page' : undefined} className={`inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors ${link.active ? 'bg-[#fff0e6] text-[var(--cd-brand)]' : 'text-[var(--cd-ink)] hover:bg-white hover:text-[var(--cd-brand)]'}`}>{link.label}</Link>)}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className={`inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-semibold outline-none hover:bg-white hover:text-[var(--cd-brand)] focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] ${freeActive ? 'bg-[#fff0e6] text-[var(--cd-brand)]' : 'text-[var(--cd-ink)]'}`}>{c.free}<ChevronDown className="size-4" /></DropdownMenuTrigger>
              <DropdownMenuContent align="start" sideOffset={8} className="w-72 rounded-xl border-[var(--cd-line)] bg-white p-2"><DropdownMenuLabel className="px-3 py-2 text-xs font-bold uppercase tracking-[.12em] text-[var(--cd-muted)]">{c.free}</DropdownMenuLabel>{freeLinks.map(link => <DropdownMenuItem key={link.href} asChild><Link href={link.href} className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium">{link.label}</Link></DropdownMenuItem>)}</DropdownMenuContent>
            </DropdownMenu>
          </nav>
        )}

        <div className="hidden items-center justify-end gap-2 xl:flex">
          {!isLoading && <LanguageSelector currentLocale={publicLocale} label={c.language} />}
          {!isLoading && user ? <>
            {profile?.subscription_status !== 'active' && <TrialCountdown />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild><button type="button" aria-label={c.account} className="rounded-full p-1 outline-offset-2 focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)]"><Avatar className="size-9 border border-[var(--cd-line)]"><AvatarFallback className="bg-[#fff0e6] text-xs font-bold text-[var(--cd-brand)]">{initials}</AvatarFallback></Avatar></button></DropdownMenuTrigger>
              <DropdownMenuContent className="w-60" align="end">
                <DropdownMenuLabel className="font-normal"><p className="truncate text-sm font-bold">{profile?.name || c.account}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/billing"><CreditCard className="mr-2 size-4" />{t('billing')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 size-4" />{t('settings')}</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => void signOut()} className="text-red-700"><LogOut className="mr-2 size-4" />{t('logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </> : !isLoading ? <>
            <Link href="/login" className="inline-flex min-h-11 items-center px-2 text-sm font-semibold text-[var(--cd-ink)] hover:text-[var(--cd-brand)]">{c.login}</Link>
            <Link href="/signup" className="inline-flex min-h-11 items-center rounded-xl bg-[var(--cd-brand)] px-4 text-sm font-semibold text-white hover:bg-[var(--cd-brand-hover)]">{c.trial}</Link>
          </> : null}
        </div>

        <button type="button" aria-label={menuOpen ? c.close : c.open} aria-expanded={menuOpen} aria-controls="main-mobile-menu" onClick={() => setMenuOpen(value => !value)} className="inline-flex size-11 items-center justify-center rounded-xl border border-[var(--cd-line)] bg-white text-[var(--cd-ink)] xl:hidden">{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button>
      </div>

      {menuOpen && <div id="main-mobile-menu" className="max-h-[calc(100dvh-4.75rem)] overflow-y-auto border-t border-[var(--cd-line)] bg-[var(--cd-paper)] px-4 py-4 shadow-lg xl:hidden"><div className="mx-auto max-w-[1280px] space-y-5">
        <div className="flex min-h-12 items-center justify-between rounded-xl bg-white px-4"><span className="text-sm font-semibold text-[var(--cd-muted)]">{c.language}</span><LanguageSelector currentLocale={publicLocale} label={c.language} /></div>
        {user ? <nav aria-label={c.app} className="grid gap-1">{appLinks.map(link => <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={activeAppLink(link.href) ? 'page' : undefined} className={`flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold ${activeAppLink(link.href) ? 'bg-[#fff0e6] text-[var(--cd-brand)]' : 'text-[var(--cd-ink)] hover:bg-white'}`}><link.icon className="size-5" />{link.label}</Link>)}</nav> : <nav aria-label={c.study} className="grid gap-1">{publicLinks.map(link => <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={link.active ? 'page' : undefined} className={`flex min-h-12 items-center rounded-xl px-4 text-base font-semibold ${link.active ? 'bg-[#fff0e6] text-[var(--cd-brand)]' : 'text-[var(--cd-ink)] hover:bg-white'}`}>{link.label}</Link>)}</nav>}
        <nav aria-label={c.free} className="border-t border-[var(--cd-line)] pt-4"><p className="px-4 pb-2 text-xs font-bold uppercase tracking-[.14em] text-[var(--cd-muted)]">{c.free}</p><div className="grid gap-1">{mobileFreeLinks.map(link => <Link key={link.href} href={link.href} onClick={closeMenu} className="flex min-h-12 items-center rounded-xl px-4 text-base font-medium text-[var(--cd-ink)] hover:bg-white">{link.label}</Link>)}</div></nav>
        {user ? <div className="grid gap-1 border-t border-[var(--cd-line)] pt-4"><p className="truncate px-4 pb-2 text-sm text-[var(--cd-muted)]">{user.email}</p><Link href="/billing" onClick={closeMenu} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold text-[var(--cd-ink)] hover:bg-white"><CreditCard className="size-5" />{t('billing')}</Link><Link href="/settings" onClick={closeMenu} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold text-[var(--cd-ink)] hover:bg-white"><Settings className="size-5" />{t('settings')}</Link><button type="button" onClick={() => { void signOut(); closeMenu() }} className="flex min-h-12 items-center gap-3 rounded-xl px-4 text-left text-base font-semibold text-red-700"><LogOut className="size-5" />{t('logout')}</button></div> : <div className="grid gap-2 border-t border-[var(--cd-line)] pt-4 sm:grid-cols-2"><Link href="/login" onClick={closeMenu} className="flex min-h-12 items-center justify-center rounded-xl border border-[var(--cd-line)] bg-white text-sm font-semibold text-[var(--cd-brand)]">{c.login}</Link><Link href="/signup" onClick={closeMenu} className="flex min-h-12 items-center justify-center rounded-xl bg-[var(--cd-brand)] text-sm font-semibold text-white">{c.trial}</Link></div>}
      </div></div>}
    </header>
  )
}
