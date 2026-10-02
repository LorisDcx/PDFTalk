'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
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
import { medicalFlashcardsPath } from '@/lib/medical-decks'
import { blogIndexPath } from '@/lib/blog-content'
import { headerLabels } from '@/lib/header-labels'
import { learnLabels } from '@/lib/learning-copy'

const navigationCopy: Record<StudyPdfLocale, {
  free: string; pdf: string; explore: string; cards: string; freeCards: string; medicalCards: string; planner: string
  study: string; how: string; pricing: string; login: string; trial: string
  account: string; open: string; close: string; language: string; app: string
}> = {
  fr: { free: 'Outils gratuits', pdf: 'Outils PDF', explore: 'Explorer un PDF', cards: 'Flashcards', freeCards: 'Flashcards gratuites', medicalCards: 'Flashcards médecine', planner: 'Planifier ses révisions', study: 'Réviser', how: 'Comment ça marche', pricing: 'Tarifs', login: 'Connexion', trial: 'Essayer gratuitement', account: 'Compte', open: 'Ouvrir le menu', close: 'Fermer le menu', language: 'Langue', app: 'Espace de travail' },
  en: { free: 'Free tools', pdf: 'PDF tools', explore: 'Explore a PDF', cards: 'Flashcards', freeCards: 'Free flashcards', medicalCards: 'Medical flashcards', planner: 'Study planner', study: 'Study', how: 'How it works', pricing: 'Plans', login: 'Sign in', trial: 'Start free trial', account: 'Account', open: 'Open menu', close: 'Close menu', language: 'Language', app: 'Workspace' },
  es: { free: 'Herramientas gratis', pdf: 'Herramientas PDF', explore: 'Explorar un PDF', cards: 'Tarjetas', freeCards: 'Tarjetas gratis', medicalCards: 'Tarjetas de medicina', planner: 'Planificar el estudio', study: 'Estudiar', how: 'Cómo funciona', pricing: 'Precios', login: 'Iniciar sesión', trial: 'Probar gratis', account: 'Cuenta', open: 'Abrir menú', close: 'Cerrar menú', language: 'Idioma', app: 'Espacio de trabajo' },
  de: { free: 'Kostenlose Tools', pdf: 'PDF-Werkzeuge', explore: 'PDF erkunden', cards: 'Karteikarten', freeCards: 'Kostenlose Karteikarten', medicalCards: 'Medizin-Karteikarten', planner: 'Lernen planen', study: 'Lernen', how: 'So funktioniert es', pricing: 'Preise', login: 'Anmelden', trial: 'Kostenlos testen', account: 'Konto', open: 'Menü öffnen', close: 'Menü schließen', language: 'Sprache', app: 'Arbeitsbereich' },
  it: { free: 'Strumenti gratuiti', pdf: 'Strumenti PDF', explore: 'Esplora un PDF', cards: 'Flashcard', freeCards: 'Flashcard gratuite', medicalCards: 'Flashcard di medicina', planner: 'Pianifica lo studio', study: 'Studiare', how: 'Come funziona', pricing: 'Prezzi', login: 'Accedi', trial: 'Prova gratis', account: 'Account', open: 'Apri menu', close: 'Chiudi menu', language: 'Lingua', app: 'Area di lavoro' },
  pt: { free: 'Ferramentas grátis', pdf: 'Ferramentas PDF', explore: 'Explorar um PDF', cards: 'Cartões', freeCards: 'Cartões gratuitos', medicalCards: 'Cartões de medicina', planner: 'Planear revisões', study: 'Estudar', how: 'Como funciona', pricing: 'Preços', login: 'Entrar', trial: 'Experimentar grátis', account: 'Conta', open: 'Abrir menu', close: 'Fechar menu', language: 'Idioma', app: 'Área de trabalho' },
  zh: { free: '免费工具', pdf: 'PDF 工具', explore: '探索 PDF', cards: '记忆卡片', freeCards: '免费记忆卡片', medicalCards: '医学记忆卡片', planner: '复习计划', study: '学习', how: '使用方法', pricing: '价格', login: '登录', trial: '免费试用', account: '账户', open: '打开菜单', close: '关闭菜单', language: '语言', app: '学习空间' },
  ja: { free: '無料ツール', pdf: 'PDFツール', explore: 'PDFを調べる', cards: 'フラッシュカード', freeCards: '無料フラッシュカード', medicalCards: '医学フラッシュカード', planner: '学習計画', study: '学習する', how: '使い方', pricing: '料金', login: 'ログイン', trial: '無料で試す', account: 'アカウント', open: 'メニューを開く', close: 'メニューを閉じる', language: '言語', app: '学習スペース' },
  ar: { free: 'أدوات مجانية', pdf: 'أدوات PDF', explore: 'استكشف PDF', cards: 'بطاقات', freeCards: 'بطاقات مجانية', medicalCards: 'بطاقات الطب', planner: 'خطط للمراجعة', study: 'المراجعة', how: 'كيف يعمل', pricing: 'الأسعار', login: 'تسجيل الدخول', trial: 'جرّب مجانًا', account: 'الحساب', open: 'فتح القائمة', close: 'إغلاق القائمة', language: 'اللغة', app: 'مساحة الدراسة' },
}


type HeaderLink = { href: string; label: string }

function navClass(active = false) {
  return `inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] ${active ? 'bg-[#fff0e6] text-[var(--cd-brand)]' : 'text-[var(--cd-ink)] hover:bg-white hover:text-[var(--cd-brand)]'}`
}

function HeaderDropdown({ label, links, active, open, onOpenChange }: { label: string; links: HeaderLink[]; active: boolean; open: boolean; onOpenChange: (open: boolean) => void }) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const focusFirst = useRef(false)
  const hoverOpened = useRef(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current) }
  const scheduleClose = () => {
    cancelClose()
    if (hoverOpened.current) closeTimer.current = setTimeout(() => onOpenChange(false), 200)
  }
  useEffect(() => {
    if (!open) return
    if (focusFirst.current) {
      contentRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
      focusFirst.current = false
    }
    const closeOutside = (event: Event) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) onOpenChange(false)
    }
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      onOpenChange(false)
      if (rootRef.current?.contains(document.activeElement)) triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('focusin', closeOutside)
    document.addEventListener('keydown', onEscape)
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('focusin', closeOutside)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open, onOpenChange])

  return <div ref={rootRef} className="relative" onPointerLeave={scheduleClose}>
    <button ref={triggerRef} type="button" className={navClass(active)} aria-expanded={open} aria-controls={panelId}
      onPointerEnter={event => {
        if (event.pointerType !== 'mouse') return
        cancelClose()
        if (!open) { hoverOpened.current = true; onOpenChange(true) }
      }}
      onClick={() => {
        cancelClose()
        // A click keeps a menu already revealed by hover available until dismissal.
        if (!open || !hoverOpened.current) onOpenChange(!open)
        hoverOpened.current = false
      }}
      onKeyDown={event => {
        cancelClose()
        hoverOpened.current = false
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          if (open) contentRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()
          else { focusFirst.current = true; onOpenChange(true) }
        }
      }}>
      {label}<ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
    </button>
    {open && <div id={panelId} ref={contentRef} className="absolute start-0 top-full z-50 w-64 pt-3" onPointerEnter={cancelClose}
      onKeyDown={() => { cancelClose(); hoverOpened.current = false }}>
      <div className="rounded-2xl border border-[var(--cd-line)] bg-white p-2 shadow-[0_16px_40px_-20px_rgba(51,37,43,.2)]">
      {links.map(link => {
        // Native fragment navigation also works when the current route is unchanged.
        const Destination = link.href.includes('#') ? 'a' : Link
        return <Destination key={link.href} href={link.href} onClick={() => onOpenChange(false)} className="flex min-h-11 items-center rounded-xl px-3 text-sm font-medium text-[var(--cd-ink)] hover:bg-[#fff0e6] hover:text-[var(--cd-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">{link.label}</Destination>
      })}
      </div>
    </div>}
  </div>
}

function MobileGroup({ label, links, onNavigate }: { label: string; links: HeaderLink[]; onNavigate: () => void }) {
  return <details className="group border-b border-[var(--cd-line)]">
    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-2 text-base font-semibold text-[var(--cd-ink)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">
      {label}<ChevronDown className="size-4 opacity-60 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
    </summary>
    <div className="grid gap-1 pb-3 ps-3">
      {links.map(link => {
        const Destination = link.href.includes('#') ? 'a' : Link
        return <Destination key={link.href} href={link.href} onClick={onNavigate} className="flex min-h-11 items-center rounded-xl px-3 text-sm text-[var(--cd-muted)] hover:bg-white hover:text-[var(--cd-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">{link.label}</Destination>
      })}
    </div>
  </details>
}

export function Navbar({ publicLocale }: { publicLocale?: StudyPdfLocale } = {}) {
  const { user, profile, signOut, isLoading } = useAuth()
  const pathname = usePathname()
  const { t, language } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const setStudyOpen = useCallback((open: boolean) => setOpenDropdown(current => open ? 'study' : current === 'study' ? null : current), [])
  const setFreeOpen = useCallback((open: boolean) => setOpenDropdown(current => open ? 'free' : current === 'free' ? null : current), [])
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const locale = publicLocale ?? language
  const c = navigationCopy[locale]
  const labels = headerLabels[locale]
  const rtl = locale === 'ar'
  const home = locale === 'fr' ? '/' : `/${locale}`
  const toolsHref = pdfHubPath(locale)
  const cardsHref = freeFlashcardsPath(locale)
  const medicalHref = medicalFlashcardsPath(locale)
  const studyLinks: HeaderLink[] = [
    { href: '/apprendre', label: learnLabels[locale] },
    { href: `${home}${locale === 'fr' ? '#produit' : '#studio'}`, label: labels.studio },
    { href: blogIndexPath(locale), label: labels.guides },
    { href: `${home}#pricing`, label: c.pricing },
  ]
  const freeLinks: HeaderLink[] = [
    { href: toolsHref, label: c.pdf },
    { href: studyPdfPath(locale), label: c.explore },
    ...(locale === 'fr' ? [
      { href: '/planificateur-revisions', label: c.planner },
      { href: '/calculateur-moyenne', label: labels.average },
    ] : []),
  ]
  const appLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/documents', label: t('documents'), icon: FolderOpen },
    { href: '/apprendre', label: learnLabels[locale], icon: GraduationCap },
    { href: '/flashcards', label: t('flashcards'), icon: GraduationCap },
  ]
  const activePath = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const freeActive = freeLinks.some(link => activePath(link.href))
  const studyActive = pathname === home || activePath(blogIndexPath(locale))
  const cardsActive = activePath(cardsHref) || activePath(medicalHref)
  const initials = (profile?.name || user?.email || 'U').slice(0, 2).toUpperCase()
  const workspaceHeader = !!user && appLinks.some(link => activePath(link.href))
  const closeMenu = () => setMenuOpen(false)

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1280px)')
    const closeHiddenDropdown = () => { if (!desktop.matches) setOpenDropdown(null) }
    desktop.addEventListener('change', closeHiddenDropdown)
    return () => desktop.removeEventListener('change', closeHiddenDropdown)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (document.querySelector('[role="menu"][data-state="open"]')) return
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      // Radix menus live in a portal outside the header, including the language menu.
      if (event.target instanceof Element && event.target.closest('[role="menu"], [role="dialog"]')) return
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 1280px)')
    const onResize = () => { if (desktop.matches) setMenuOpen(false) }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    desktop.addEventListener('change', onResize)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      desktop.removeEventListener('change', onResize)
    }
  }, [menuOpen])

  return <header ref={headerRef} dir={rtl ? 'rtl' : 'ltr'} className="sticky top-0 z-50 border-b border-[var(--cd-line)] bg-[var(--cd-paper)]/95 backdrop-blur-xl">
    <div className={`mx-auto flex min-h-[4.5rem] ${workspaceHeader ? 'w-full max-w-[1800px]' : 'max-w-[1280px]'} items-center gap-3 px-4 sm:px-6 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] xl:gap-6 xl:px-8`}>
      <Link href={home} onClick={closeMenu} className="inline-flex min-h-11 w-fit shrink-0 items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]" aria-label="CramDesk">
        <Image src="/flame-logo.png" width={40} height={40} alt="" className="size-8 sm:size-10" />
        <span dir="ltr" className="font-editorial whitespace-nowrap text-[1.4rem] leading-none tracking-[-.045em] text-[var(--cd-ink)] sm:text-[1.65rem]">CramDesk<span className="text-[var(--cd-brand)]">.</span></span>
      </Link>

      <nav className="hidden items-center justify-center gap-1 xl:flex" aria-label={user ? c.app : c.study}>
        {user ? appLinks.map(link => <Link key={link.href} href={link.href} aria-current={activePath(link.href) ? 'page' : undefined} className={navClass(activePath(link.href))}>{link.label}</Link>) : <>
          <HeaderDropdown label={c.study} links={studyLinks} active={studyActive} open={openDropdown === 'study'} onOpenChange={setStudyOpen} />
          <Link href={cardsHref} aria-current={pathname === cardsHref ? 'page' : undefined} className={navClass(cardsActive)}>{c.cards}</Link>
        </>}
        <HeaderDropdown label={c.free} links={freeLinks} active={freeActive} open={openDropdown === 'free'} onOpenChange={setFreeOpen} />
      </nav>

      <div className="ms-auto flex shrink-0 items-center justify-end gap-2 xl:ms-0">
        <div className="hidden xl:block"><LanguageSelector currentLocale={publicLocale} label={c.language} /></div>
        {isLoading ? <span aria-hidden="true" className="h-11 w-20 animate-pulse rounded-full bg-[#f1e9e3] motion-reduce:animate-none" /> : user ? <>
          {profile?.subscription_status !== 'active' && <div className="hidden xl:block [&>button]:min-h-11 [&>button]:whitespace-nowrap"><TrialCountdown /></div>}
          <DropdownMenu dir={rtl ? 'rtl' : 'ltr'}>
            <DropdownMenuTrigger asChild>
              <button type="button" aria-label={c.account} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)]">
                <Avatar className="size-9 border border-[var(--cd-line)]"><AvatarFallback className="bg-[#fff0e6] text-xs font-bold text-[var(--cd-brand)]">{initials}</AvatarFallback></Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 rounded-2xl border-[var(--cd-line)] p-2" align="end" sideOffset={12}>
              <DropdownMenuLabel className="px-3 py-2 font-normal"><p className="truncate text-sm font-bold">{profile?.name || c.account}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild><Link href="/writer" onClick={closeMenu} className="min-h-11 rounded-xl px-3"><PenTool className="me-3 size-4" aria-hidden="true" />{t('writer')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/billing" onClick={closeMenu} className="min-h-11 rounded-xl px-3"><CreditCard className="me-3 size-4" aria-hidden="true" />{t('billing')}</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/settings" onClick={closeMenu} className="min-h-11 rounded-xl px-3"><Settings className="me-3 size-4" aria-hidden="true" />{t('settings')}</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { void signOut(); closeMenu() }} className="min-h-11 rounded-xl px-3 text-red-700"><LogOut className="me-3 size-4" aria-hidden="true" />{t('logout')}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </> : <>
          <Link href="/login" className="hidden min-h-11 shrink-0 items-center whitespace-nowrap px-2 text-sm font-semibold text-[var(--cd-ink)] hover:text-[var(--cd-brand)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] xl:inline-flex">{c.login}</Link>
          <Link href="/signup" title={c.trial} className="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-full bg-[var(--cd-brand)] px-4 text-sm font-semibold text-white hover:bg-[var(--cd-brand-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] focus-visible:ring-offset-2">{labels.trial}</Link>
        </>}
        <button ref={menuButtonRef} type="button" aria-label={menuOpen ? c.close : c.open} aria-expanded={menuOpen} aria-controls="main-mobile-menu" onClick={() => setMenuOpen(value => !value)} className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--cd-line)] bg-white text-[var(--cd-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] xl:hidden">{menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}</button>
      </div>
    </div>

    {menuOpen && <div id="main-mobile-menu" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-[var(--cd-line)] bg-[var(--cd-paper)] px-4 pb-5 shadow-sm xl:hidden">
      <div className="mx-auto max-w-[1280px]">
        <nav aria-label={user ? c.app : c.study}>
          {user ? appLinks.map(link => <Link key={link.href} href={link.href} onClick={closeMenu} aria-current={activePath(link.href) ? 'page' : undefined} className={`flex min-h-14 items-center gap-3 border-b border-[var(--cd-line)] px-2 text-base font-semibold ${activePath(link.href) ? 'text-[var(--cd-brand)]' : 'text-[var(--cd-ink)]'}`}><link.icon className="size-5" aria-hidden="true" />{link.label}</Link>) : <>
            <MobileGroup label={c.study} links={studyLinks} onNavigate={closeMenu} />
            <Link href={cardsHref} onClick={closeMenu} className={`flex min-h-14 items-center border-b border-[var(--cd-line)] px-2 text-base font-semibold ${cardsActive ? 'text-[var(--cd-brand)]' : 'text-[var(--cd-ink)]'}`}>{c.cards}</Link>
          </>}
          <MobileGroup label={c.free} links={freeLinks} onNavigate={closeMenu} />
        </nav>
        <div className="mt-3 flex min-h-12 items-center justify-between gap-3 px-2"><span className="text-sm text-[var(--cd-muted)]">{c.language}</span><LanguageSelector currentLocale={publicLocale} label={c.language} onLocaleChange={closeMenu} /></div>
        {!isLoading && !user && <Link href="/login" onClick={closeMenu} className="mt-2 flex min-h-11 items-center justify-center rounded-full border border-[var(--cd-line)] bg-white text-sm font-semibold text-[var(--cd-ink)]">{c.login}</Link>}
      </div>
    </div>}
  </header>
}
