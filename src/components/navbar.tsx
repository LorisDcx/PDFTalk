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
import { pdfToolPages, pdfToolPath } from '@/lib/pdf-tool-pages'

export function Navbar({ publicLocale }: { publicLocale?: 'fr' | 'en' } = {}) {
  const { user, profile, signOut, isLoading } = useAuth()
  const pathname = usePathname()
  const { t, language } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const english = publicLocale ? publicLocale === 'en' : language !== 'fr'
  const toolLocale = english ? 'en' : 'fr'
  const toolsHref = english ? '/en/pdf-tools' : '/outils-pdf'
  const studyLinks = english ? [
    { href: '/en#studio', label: 'The studio', description: 'See the study workspace' },
    { href: '/en/free-flashcards', label: 'Free flashcards', description: 'Practice active recall' },
    { href: '/en#how-it-works', label: 'How it works', description: 'From PDF to practice' },
  ] : [
    { href: '/#produit', label: 'Le studio', description: 'Découvrir l’espace de travail' },
    { href: '/flashcards-gratuites', label: 'Flashcards gratuites', description: 'Réviser par rappel actif' },
    { href: '/planificateur-revisions', label: 'Planifier ses révisions', description: 'Organiser son travail' },
    { href: '/calculateur-moyenne', label: 'Calculer sa moyenne', description: 'Suivre ses résultats' },
  ]
  const loginLabel = english ? 'Sign in' : 'Connexion'
  const trialLabel = english ? 'Start free trial' : 'Essayer gratuitement'

  const appLinks = [
    { href: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/documents', label: t('documents'), icon: FolderOpen },
    { href: '/flashcards', label: t('flashcards'), icon: GraduationCap },
    { href: '/writer', label: t('writer'), icon: PenTool },
    { href: '/billing', label: t('billing'), icon: CreditCard },
  ]

  const initials = (profile?.name || user?.email || 'U').slice(0, 2).toUpperCase()

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0dfd5] bg-[#fffaf5]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8">
        <Link href={english ? '/en' : '/'} className="inline-flex shrink-0 items-center gap-2.5" aria-label={english ? 'CramDesk — home' : 'CramDesk — accueil'}>
          <Image src="/logo.png" width={36} height={36} alt="" className="size-9 rounded-xl shadow-sm" />
          <span className="font-editorial text-[1.65rem] leading-none tracking-[-.045em] text-[#33252b]">CramDesk<span className="text-[#d05a39]">.</span></span>
        </Link>

        {isLoading ? <span className="hidden h-8 w-48 animate-pulse rounded-full bg-[#f1e9ef] xl:block" /> : user ? (
          <nav className="hidden items-center gap-1 rounded-full border border-[#f0dfd5] bg-white p-1 xl:flex" aria-label="Navigation de l’application">
            {appLinks.map(link => <Link key={link.href} href={link.href} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition ${pathname === link.href ? 'bg-[#fff0e6] text-[#b84432]' : 'text-[#776c77] hover:bg-[#fff5ef] hover:text-[#463244]'}`}><link.icon className="size-3.5" />{link.label}</Link>)}
          </nav>
        ) : (
          <nav className="hidden items-center gap-1 rounded-full border border-[#f0dfd5] bg-white p-1 xl:flex" aria-label={english ? 'Main navigation' : 'Navigation principale'}>
            <DropdownMenu modal={false}><DropdownMenuTrigger className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold text-[#625563] outline-none transition hover:bg-[#fff5ef] hover:text-[#b84432] focus-visible:ring-2 focus-visible:ring-[#b84432] data-[state=open]:bg-[#fff0e6] data-[state=open]:text-[#b84432]">{english ? 'Study' : 'Réviser'}<ChevronDown className="size-3.5" /></DropdownMenuTrigger><DropdownMenuContent align="start" sideOffset={10} className="w-72 rounded-2xl border-[#eadbd2] bg-white p-2 shadow-xl">{studyLinks.map(link => <DropdownMenuItem key={link.href} asChild className="flex-col items-start rounded-xl p-0 focus:bg-[#fff3eb]"><Link href={link.href} className="flex min-h-16 flex-col items-start justify-center px-4 py-3"><span className="text-sm font-bold text-[#382c32]">{link.label}</span><span className="mt-0.5 text-xs text-[#81767a]">{link.description}</span></Link></DropdownMenuItem>)}</DropdownMenuContent></DropdownMenu>
            <DropdownMenu modal={false}><DropdownMenuTrigger className="inline-flex min-h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold text-[#625563] outline-none transition hover:bg-[#fff5ef] hover:text-[#b84432] focus-visible:ring-2 focus-visible:ring-[#b84432] data-[state=open]:bg-[#fff0e6] data-[state=open]:text-[#b84432]">{english ? 'PDF tools' : 'Outils PDF'}<ChevronDown className="size-3.5" /></DropdownMenuTrigger><DropdownMenuContent align="start" sideOffset={10} className="w-[min(580px,calc(100vw-40px))] rounded-2xl border-[#eadbd2] bg-white p-3 shadow-xl"><div className="grid grid-cols-2 gap-1">{pdfToolPages.map(page => <DropdownMenuItem key={page.id} asChild className="flex-col items-start rounded-xl p-0 focus:bg-[#fff3eb]"><Link href={pdfToolPath(page, toolLocale)} className="flex min-h-16 flex-col items-start justify-center px-3 py-2.5"><span className="text-sm font-bold text-[#382c32]">{page[toolLocale].name}</span><span className="mt-0.5 max-w-full truncate text-xs text-[#81767a]">{page[toolLocale].steps[0]}</span></Link></DropdownMenuItem>)}</div><div className="mt-2 border-t border-[#efe4dd] pt-2"><DropdownMenuItem asChild className="rounded-xl p-0 focus:bg-[#fff3eb]"><Link href={toolsHref} className="block px-3 py-2.5 text-sm font-bold text-[#a83e2a]">{english ? 'View all PDF tools →' : 'Voir tous les outils PDF →'}</Link></DropdownMenuItem></div></DropdownMenuContent></DropdownMenu>
            <Link href={english ? '/en#how-it-works' : '/#comment-ca-marche'} className="inline-flex min-h-10 items-center rounded-full px-4 text-xs font-bold text-[#625563] transition hover:bg-[#fff5ef] hover:text-[#b84432]">{english ? 'How it works' : 'Comment ça marche'}</Link>
            <Link href={english ? '/en#pricing' : '/#pricing'} className="inline-flex min-h-10 items-center rounded-full px-4 text-xs font-bold text-[#625563] transition hover:bg-[#fff5ef] hover:text-[#b84432]">{english ? 'Plans' : 'Tarifs'}</Link>
          </nav>
        )}

        <div className="ml-auto hidden shrink-0 items-center gap-3 xl:flex">
          {!isLoading && <LanguageSelector />}
          {user ? <>
            {profile?.subscription_status === 'active' ? <span className="rounded-full border border-[#e2d4df] bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#ae4731]">{profile.current_plan}</span> : <TrialCountdown />}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label="Ouvrir le menu du compte" className="rounded-full outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#b84432]"><Avatar className="size-9 border border-[#e7cec0]"><AvatarFallback className="bg-[#fff0e6] text-xs font-bold text-[#b84432]">{initials}</AvatarFallback></Avatar></button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal"><p className="truncate text-sm font-bold">{profile?.name || 'Utilisateur'}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/dashboard"><LayoutDashboard className="mr-2 size-4" />{t('dashboard')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/billing"><CreditCard className="mr-2 size-4" />{t('billing')}</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/settings"><Settings className="mr-2 size-4" />{t('settings')}</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-700"><LogOut className="mr-2 size-4" />{t('logout')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </> : !isLoading ? <>
            <Link href="/login" className="px-2 text-xs font-bold text-[#5a4d59] hover:text-[#b84432]">{loginLabel}</Link>
            <Link href="/signup" className="inline-flex min-h-10 items-center rounded-full bg-[#b84432] px-5 text-xs font-bold text-white transition hover:bg-[#963326]">{trialLabel}</Link>
          </> : null}
        </div>

        <button type="button" aria-label={menuOpen ? (english ? 'Close menu' : 'Fermer le menu') : (english ? 'Open menu' : 'Ouvrir le menu')} aria-expanded={menuOpen} aria-controls="main-mobile-menu" onClick={() => setMenuOpen(!menuOpen)} className="ml-auto inline-flex size-10 items-center justify-center rounded-full border border-[#e6dce3] bg-white text-[#4b3848] xl:hidden">
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {menuOpen && <div id="main-mobile-menu" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-[#f0dfd5] bg-[#fffaf5] px-5 py-5 shadow-xl xl:hidden">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between rounded-xl bg-[#fff0e6] px-4 py-2"><span className="text-xs font-bold text-[#766a75]">{english ? 'Language' : 'Langue'}</span><LanguageSelector /></div>
          {user ? <>
            <p className="mb-3 truncate px-3 text-xs font-semibold text-[#8b808c]">{user.email}</p>
            <nav className="grid gap-1" aria-label="Navigation de l’application">{appLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold ${pathname === link.href ? 'bg-[#fff0e6] text-[#b84432]' : 'text-[#625563] hover:bg-[#fff0e6]'}`}><link.icon className="size-4" />{link.label}</Link>)}</nav>
            <div className="my-4 h-px bg-[#f0dfd5]" />
            <Link href="/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-[#625563]"><Settings className="size-4" />{t('settings')}</Link>
            <button type="button" onClick={() => { signOut(); setMenuOpen(false) }} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-red-700"><LogOut className="size-4" />{t('logout')}</button>
          </> : <>
            <nav className="grid gap-1" aria-label={english ? 'Main navigation' : 'Navigation principale'}>
              <details className="group rounded-xl"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl px-4 text-sm font-bold text-[#493a43] hover:bg-[#fff0e6]">{english ? 'Study' : 'Réviser'}<ChevronDown className="size-4 transition group-open:rotate-180" /></summary><div className="grid gap-0.5 pb-2 pl-3">{studyLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-4 text-sm text-[#625563] hover:bg-[#fff0e6]">{link.label}</Link>)}</div></details>
              <details className="group rounded-xl"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl px-4 text-sm font-bold text-[#493a43] hover:bg-[#fff0e6]">{english ? 'PDF tools' : 'Outils PDF'}<ChevronDown className="size-4 transition group-open:rotate-180" /></summary><div className="grid gap-0.5 pb-2 pl-3">{pdfToolPages.map(page => <Link key={page.id} href={pdfToolPath(page, toolLocale)} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-4 text-sm text-[#625563] hover:bg-[#fff0e6]">{page[toolLocale].name}</Link>)}<Link href={toolsHref} onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-[#a83e2a] hover:bg-[#fff0e6]">{english ? 'All PDF tools' : 'Tous les outils PDF'}</Link></div></details>
              <Link href={english ? '/en#how-it-works' : '/#comment-ca-marche'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 text-sm font-bold text-[#493a43] hover:bg-[#fff0e6]">{english ? 'How it works' : 'Comment ça marche'}</Link>
              <Link href={english ? '/en#pricing' : '/#pricing'} onClick={() => setMenuOpen(false)} className="flex min-h-12 items-center rounded-xl px-4 text-sm font-bold text-[#493a43] hover:bg-[#fff0e6]">{english ? 'Plans' : 'Tarifs'}</Link>
            </nav>
            <div className="mt-4 grid gap-2 border-t border-[#f0dfd5] pt-4 sm:grid-cols-2">
              <Link href="/login" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center justify-center rounded-full border border-[#dfd1dc] bg-white text-sm font-bold text-[#b84432]">{loginLabel}</Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="flex min-h-11 items-center justify-center rounded-full bg-[#b84432] text-sm font-bold text-white">{trialLabel}</Link>
            </div>
          </>}
        </div>
      </div>}
    </header>
  )
}
