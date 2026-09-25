'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/lib/i18n'
import { AuthFrame } from '../auth-frame'
import { getAuthCopy } from '../auth-copy'
import { PasswordField, authButtonClass, authInputClass } from '../form-parts'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const copy = getAuthCopy(language)
  const supabase = createClient()

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setFormError(error.message)
        toast({ title: t('loginFailed'), description: error.message, variant: 'destructive' })
        return
      }

      if (sessionStorage.getItem('pendingDocument')) {
        sessionStorage.setItem('processPendingDocument', 'true')
      }

      const requestedPath = new URLSearchParams(window.location.search).get('redirect')
      const destination = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') && !requestedPath.includes('\\')
        ? requestedPath
        : '/dashboard'
      router.push(destination)
      router.refresh()
    } catch {
      setFormError(t('unexpectedError'))
      toast({ title: t('error'), description: t('unexpectedError'), variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFrame>
      <div className="mb-8">
        <span className="inline-flex rounded-full bg-[#ffe9df] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#ae4731]">{t('login')}</span>
        <h2 className="font-editorial mt-5 text-[clamp(2.4rem,3.5vw,3.45rem)] leading-[1.08] tracking-[-.045em] text-[#33252b]">{t('welcomeBack')}</h2>
        <p className="mt-3 text-sm leading-6 text-[#817480]">{t('signInToContinue')}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="login-email" className="text-sm font-semibold text-[#51434e]">{t('email')}</Label>
          <Input id="login-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} required disabled={isLoading} className={authInputClass} />
        </div>

        <div>
          <PasswordField id="login-password" label={t('password')} value={password} onChange={setPassword} disabled={isLoading} autoComplete="current-password" />
          <div className="mt-2 text-end"><Link href="/forgot-password" className="rounded-sm text-xs font-semibold text-[#ae4731] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]">{copy.forgotLink}</Link></div>
        </div>

        {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

        <Button type="submit" disabled={isLoading} className={authButtonClass}>
          {isLoading ? <><Loader2 className="me-2 size-4 animate-spin" aria-hidden="true" />{t('signingIn')}</> : <>{t('signIn')}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></>}
        </Button>
      </form>

      <div className="mt-8 border-t border-[#f0dfd5] pt-6 text-center text-sm text-[#817480]">
        {t('noAccount')}{' '}
        <Link href="/signup" className="font-semibold text-[#ae4731] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]">{t('startFreeTrial')}</Link>
      </div>
    </AuthFrame>
  )
}
