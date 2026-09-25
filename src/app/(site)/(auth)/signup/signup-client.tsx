'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Check, CheckCircle2, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { formatFileSize } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { AuthFrame } from '../auth-frame'
import { getAuthCopy } from '../auth-copy'
import { PasswordField, authButtonClass, authInputClass } from '../form-parts'

interface PendingDocument {
  name: string
  size: number
  type: string
}

export default function SignupClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingDoc, setPendingDoc] = useState<PendingDocument | null>(null)
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const copy = getAuthCopy(language)
  const supabase = createClient()
  const isDemo = searchParams.get('demo') === 'true'

  useEffect(() => {
    if (!isDemo) return
    try {
      const stored = sessionStorage.getItem('pendingDocument')
      if (!stored) return
      const parsed = JSON.parse(stored) as PendingDocument
      if (typeof parsed.name === 'string' && typeof parsed.size === 'number' && parsed.type === 'application/pdf') {
        const frame = requestAnimationFrame(() => setPendingDoc(parsed))
        return () => cancelAnimationFrame(frame)
      }
    } catch {
      // An old or malformed draft should not prevent account creation.
    }
  }, [isDemo])

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsLoading(true)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { name },
        },
      })

      if (authError) {
        setFormError(authError.message)
        toast({ title: t('signupFailed'), description: authError.message, variant: 'destructive' })
        return
      }

      if (authData.user && authData.session) {
        // The database trigger creates the profile and starts the trial.
        await supabase.from('analytics_events').insert({
          user_id: authData.user.id,
          event_type: 'signup',
          event_data: { source: 'web' },
        })
      }

      if (pendingDoc) sessionStorage.setItem('processPendingDocument', 'true')

      if (!authData.session) {
        setConfirmationEmail(email)
        return
      }

      toast({ title: t('accountCreated'), description: pendingDoc ? t('documentWillBeAnalyzed') : t('trialStarted') })
      router.push('/dashboard')
      router.refresh()
    } catch {
      setFormError(t('unexpectedError'))
      toast({ title: t('error'), description: t('unexpectedError'), variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  if (confirmationEmail) {
    return (
      <AuthFrame>
        <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#e9f3e9] text-[#3b8662]"><CheckCircle2 className="size-7" aria-hidden="true" /></div>
        <h2 className="font-editorial text-[clamp(2.4rem,3.5vw,3.45rem)] leading-[1.08] tracking-[-.045em]">{t('confirmEmailTitle')}</h2>
        <p className="mt-4 text-sm leading-7 text-[#817480]">{t('confirmEmailDesc')}</p>
        <p className="mt-5 break-all rounded-2xl border border-[#ead9cf] bg-[#fff5ee] px-4 py-3 text-sm font-semibold text-[#a84431]">{confirmationEmail}</p>
        {pendingDoc && <p className="mt-4 text-sm text-[#6f6170]">{t('documentReadyToAnalyze')} · {pendingDoc.name}</p>}
        <Button asChild className={`mt-7 ${authButtonClass}`}><Link href="/login">{t('signIn')}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></Link></Button>
      </AuthFrame>
    )
  }

  return (
    <AuthFrame>
      {pendingDoc && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#dce8db] bg-[#f1f7ee] p-3.5" role="status">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#4e8666]"><FileText className="size-5" aria-hidden="true" /></span>
          <div className="min-w-0 flex-1"><p className="text-xs font-bold text-[#3d7454]">{t('documentReadyToAnalyze')}</p><p className="truncate text-sm text-[#5b685b]">{pendingDoc.name}</p></div>
          <span className="shrink-0 text-xs text-[#74816f]">{formatFileSize(pendingDoc.size)}</span>
        </div>
      )}

      <div className="mb-7">
        <span className="inline-flex rounded-full bg-[#ffe9df] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#ae4731]">{t('freeTrial')}</span>
        <h2 className="font-editorial mt-5 text-[clamp(2.35rem,3.5vw,3.35rem)] leading-[1.08] tracking-[-.045em] text-[#33252b]">{pendingDoc ? t('createYourAccount') : t('createMyAccount')}</h2>
        <p className="mt-3 text-sm leading-6 text-[#817480]">{pendingDoc ? t('signupToSeeAnalysis') : t('trialDescription')}</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name" className="text-sm font-semibold text-[#51434e]">{t('name')}</Label>
          <Input id="signup-name" name="name" type="text" autoComplete="name" placeholder={t('yourName')} value={name} onChange={event => setName(event.target.value)} disabled={isLoading} className={authInputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email" className="text-sm font-semibold text-[#51434e]">{t('email')}</Label>
          <Input id="signup-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} required disabled={isLoading} className={authInputClass} />
        </div>
        <PasswordField id="signup-password" label={t('password')} value={password} onChange={setPassword} autoComplete="new-password" minLength={8} hint={t('minCharacters')} disabled={isLoading} />

        <div className="flex flex-wrap gap-2 pt-1 text-xs text-[#61725e]">
          {[copy.benefitOne, copy.benefitTwo].map(item => <span key={item} className="inline-flex items-center gap-1.5 rounded-full bg-[#eef5e9] px-3 py-1.5"><Check className="size-3.5" aria-hidden="true" />{item}</span>)}
        </div>

        <div className="flex items-start gap-3 pt-1">
          <input id="signup-terms" name="terms" type="checkbox" checked={acceptedTerms} onChange={event => setAcceptedTerms(event.target.checked)} required disabled={isLoading} className="mt-1 size-4 shrink-0 rounded border-[#bdaaba] accent-[#a84431] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]" />
          <label htmlFor="signup-terms" className="text-xs leading-5 text-[#817480]">
            {copy.acceptTerms}{' '}
            <Link href="/terms" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#ae4731] underline-offset-4 hover:underline">{copy.terms}</Link>{' '}
            {copy.and}{' '}
            <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#ae4731] underline-offset-4 hover:underline">{copy.privacy}</Link>
          </label>
        </div>

        {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}

        <Button type="submit" disabled={isLoading} className={authButtonClass}>
          {isLoading ? <><Loader2 className="me-2 size-4 animate-spin" aria-hidden="true" />{t('creating')}</> : <>{pendingDoc ? t('createAndAnalyze') : t('createMyAccount')}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></>}
        </Button>
      </form>

      <div className="mt-6 border-t border-[#f0dfd5] pt-5 text-center text-sm text-[#817480]">
        {t('alreadyHaveAccount')}{' '}
        <Link href="/login" className="font-semibold text-[#ae4731] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]">{t('signIn')}</Link>
      </div>
    </AuthFrame>
  )
}
