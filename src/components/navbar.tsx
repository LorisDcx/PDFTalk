'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './auth-provider'
import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { FileText, LogOut, Settings, CreditCard, LayoutDashboard, FolderOpen, Menu, X } from 'lucide-react'
import { Badge } from './ui/badge'
import { getTrialDaysRemaining, isTrialExpired } from '@/lib/utils'
import { useState } from 'react'

export function Navbar() {
  const { user, profile, signOut, isLoading } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  console.log('🧭 Navbar RENDER - isLoading:', isLoading, 'user:', !!user, 'pathname:', pathname)

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase()
    return email?.substring(0, 2).toUpperCase() || 'U'
  }

  const getTrialStatus = () => {
    if (!profile) return null
    if (profile.subscription_status === 'active') {
      return <Badge variant="success" className="text-xs">{profile.current_plan?.toUpperCase()}</Badge>
    }
    if (profile.trial_end_at && !isTrialExpired(profile.trial_end_at)) {
      const days = getTrialDaysRemaining(profile.trial_end_at)
      return <Badge variant="warning" className="text-xs">{days}j restants</Badge>
    }
    return <Badge variant="destructive" className="text-xs">Trial expiré</Badge>
  }

  const isActive = (path: string) => pathname === path

  // Navigation links for non-logged in users
  const publicLinks = [
    { href: '/#features', label: 'Fonctionnalités' },
    { href: '/#pricing', label: 'Tarifs' },
  ]

  // Navigation links for logged-in users
  const userLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/billing', label: 'Abonnement', icon: CreditCard },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo - always go to home */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">PDFTalk</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {isLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
          ) : user ? (
            <>
              {/* Logged in navigation */}
              <div className="flex items-center gap-1">
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(link.href)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="h-6 w-px bg-border" />

              {/* User menu */}
              <div className="flex items-center gap-3">
                {getTrialStatus()}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getInitials(profile?.name, user.email)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.name || 'Utilisateur'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/billing" className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Abonnement
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Paramètres
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            <>
              {/* Public navigation */}
              <div className="flex items-center gap-6">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild className="text-foreground hover:text-foreground">
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                  <Link href="/signup">Essai gratuit</Link>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-3 border-b">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(profile?.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{profile?.name || 'Utilisateur'}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  {getTrialStatus()}
                </div>
                {userLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md ${
                      isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground"
                >
                  <Settings className="h-4 w-4" />
                  Paramètres
                </Link>
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-red-600 w-full text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-muted-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-2 pt-3 border-t">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Connexion</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Essai gratuit</Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
