'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage, withAuthTimeout } from '@/lib/supabase/auth-request'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/lib/i18n'
import { authHref } from '@/lib/auth-navigation'
import { AuthFrame } from '../auth-frame'
import { getAuthCopy } from '../auth-copy'
import { PasswordField, authButtonClass, authInputClass, authTitleClass } from '../form-parts'

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
      const { error } = await withAuthTimeout(supabase.auth.signInWithPassword({ email: email.trim(), password }))
      if (error) {
        const message = getAuthErrorMessage(error, language, t('unexpectedError'))
        setFormError(message)
        toast({ title: t('loginFailed'), description: message, variant: 'destructive' })
        return
      }

      try {
        if (sessionStorage.getItem('pendingDocument')) sessionStorage.setItem('processPendingDocument', 'true')
      } catch { /* Storage restrictions must not block a successful login. */ }

      const requestedPath = new URLSearchParams(window.location.search).get('redirect')
      const destination = requestedPath?.startsWith('/') && !requestedPath.startsWith('//') && !requestedPath.includes('\\')
        ? requestedPath
        : '/dashboard'
      router.push(destination)
      router.refresh()
    } catch (error) {
      const message = getAuthErrorMessage(error, language, t('unexpectedError'))
      setFormError(message)
      toast({ title: t('error'), description: message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthFrame>
      <div className="mb-3">
        <h1 className={authTitleClass}>{t('welcomeBack')}</h1>
        <p className="mt-1 text-base leading-6 text-[var(--cd-muted)]">{t('signInToContinue')}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-2.5">
        <div className="space-y-1">
          <Label htmlFor="login-email" className="text-sm font-semibold text-[#51434e]">{t('email')}</Label>
          <Input id="login-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} required disabled={isLoading} className={authInputClass} />
        </div>

        <div>
          <PasswordField id="login-password" label={t('password')} value={password} onChange={setPassword} disabled={isLoading} autoComplete="current-password" />
          <div className="mt-2 text-end"><Link href={authHref('/forgot-password', language)} className="inline-flex min-h-11 items-center rounded-sm text-sm font-semibold text-[#ae4731] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]">{copy.forgotLink}</Link></div>
        </div>

        {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

        <Button type="submit" disabled={isLoading} className={authButtonClass}>
          {isLoading ? <><Loader2 className="me-2 size-4 animate-spin" aria-hidden="true" />{t('signingIn')}</> : <>{t('signIn')}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></>}
        </Button>
      </form>

      <div className="mt-3 border-t border-[var(--cd-line)] pt-2 text-center text-sm text-[var(--cd-muted)]">
        {t('noAccount')}{' '}
        <Link href={authHref('/signup', language)} className="inline-flex min-h-11 items-center justify-center rounded-sm font-semibold text-[#ae4731] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]">{t('startFreeTrial')}</Link>
      </div>
    </AuthFrame>
  )
}
