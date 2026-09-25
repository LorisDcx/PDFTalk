'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useLanguage } from '@/lib/i18n'
import { AuthFrame } from '../auth-frame'
import { getAuthCopy } from '../auth-copy'
import { PasswordField, authButtonClass } from '../form-parts'

type ResetState = 'checking' | 'ready' | 'invalid' | 'updated'

export default function ResetPasswordPage() {
  const [state, setState] = useState<ResetState>('checking')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const { language, t } = useLanguage()
  const copy = getAuthCopy(language)

  useEffect(() => {
    let active = true
    const hasRedirectError = new URLSearchParams(window.location.search).has('error')

    createClient().auth.getUser().then(({ data: { user }, error }) => {
      if (active) setState(user && !error && !hasRedirectError ? 'ready' : 'invalid')
    }).catch(() => {
      if (active) setState('invalid')
    })

    return () => { active = false }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    if (password !== confirmation) {
      setFormError(copy.passwordMismatch)
      return
    }
    setIsSaving(true)
    try {
      const { error } = await createClient().auth.updateUser({ password })
      if (error) {
        setFormError(error.message)
        return
      }
      setState('updated')
    } catch {
      setFormError(t('unexpectedError'))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AuthFrame>
      {state === 'checking' && (
        <div className="flex min-h-[20rem] flex-col items-center justify-center gap-4 text-[#ae4731]" role="status" aria-live="polite">
          <Loader2 className="size-7 animate-spin" aria-hidden="true" />
          <span className="text-sm font-medium">{t('processing')}</span>
        </div>
      )}

      {state === 'invalid' && (
        <div role="alert">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#f7e8ed] text-[#9f5365]"><LockKeyhole className="size-7" aria-hidden="true" /></div>
          <h2 className="font-editorial text-[clamp(2.4rem,3.5vw,3.45rem)] leading-[1.08] tracking-[-.045em]">{copy.invalidTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-[#817480]">{copy.invalidDescription}</p>
          <Button asChild className={`mt-7 ${authButtonClass}`}><Link href="/forgot-password">{copy.requestNewLink}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></Link></Button>
        </div>
      )}

      {state === 'updated' && (
        <div role="status">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#e9f3e9] text-[#3b8662]"><CheckCircle2 className="size-7" aria-hidden="true" /></div>
          <h2 className="font-editorial text-[clamp(2.4rem,3.5vw,3.45rem)] leading-[1.08] tracking-[-.045em]">{copy.updatedTitle}</h2>
          <p className="mt-4 text-sm leading-7 text-[#817480]">{copy.updatedDescription}</p>
          <Button asChild className={`mt-7 ${authButtonClass}`}><Link href="/dashboard">{t('dashboard')}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></Link></Button>
        </div>
      )}

      {state === 'ready' && (
        <>
          <Link href="/login" className="mb-7 inline-flex items-center gap-2 rounded-full text-xs font-semibold text-[#ae4731] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]"><ArrowLeft className="size-4" aria-hidden="true" />{copy.backToLogin}</Link>
          <div className="mb-8">
            <span className="inline-flex rounded-full bg-[#ffe9df] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.16em] text-[#ae4731]">{copy.forgotLink}</span>
            <h2 className="font-editorial mt-5 text-[clamp(2.4rem,3.5vw,3.45rem)] leading-[1.08] tracking-[-.045em]">{copy.resetTitle}</h2>
            <p className="mt-3 text-sm leading-7 text-[#817480]">{copy.resetDescription}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <PasswordField id="new-password" label={copy.newPassword} value={password} onChange={setPassword} autoComplete="new-password" minLength={8} disabled={isSaving} />
            <PasswordField id="confirm-password" label={copy.confirmPassword} value={confirmation} onChange={setConfirmation} autoComplete="new-password" minLength={8} disabled={isSaving} />
            {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
            <Button type="submit" disabled={isSaving} className={authButtonClass}>
              {isSaving ? <><Loader2 className="me-2 size-4 animate-spin" aria-hidden="true" />{copy.updatingPassword}</> : <>{copy.updatePassword}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></>}
            </Button>
          </form>
        </>
      )}
    </AuthFrame>
  )
}
