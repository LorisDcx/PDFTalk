'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MailCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { getAuthErrorMessage, withAuthTimeout } from '@/lib/supabase/auth-request'
import { useLanguage } from '@/lib/i18n'
import { authHref } from '@/lib/auth-navigation'
import { AuthFrame } from '../auth-frame'
import { getAuthCopy } from '../auth-copy'
import { authButtonClass, authInputClass, authTitleClass } from '../form-parts'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const { language, t } = useLanguage()
  const copy = getAuthCopy(language)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormError(null)
    setIsSending(true)
    try {
      const supabase = createClient()
      const { error } = await withAuthTimeout(supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password/callback`,
      }))
      if (error) {
        setFormError(getAuthErrorMessage(error, language, t('unexpectedError')))
        return
      }
      setSent(true)
    } catch (error) {
      setFormError(getAuthErrorMessage(error, language, t('unexpectedError')))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <AuthFrame>
      {sent ? (
        <div role="status">
          <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-[#e9f3e9] text-[#3b8662]"><MailCheck className="size-7" aria-hidden="true" /></div>
          <h1 className={authTitleClass}>{copy.sentTitle}</h1>
          <p className="mt-4 text-sm leading-7 text-[#817480]">{copy.sentDescription}</p>
          <p className="mt-5 break-all rounded-2xl border border-[#ead9cf] bg-[#fff5ee] px-4 py-3 text-sm font-semibold text-[#a84431]">{email}</p>
          <Button asChild className={`mt-7 ${authButtonClass}`}><Link href={authHref('/login', language)}>{copy.backToLogin}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></Link></Button>
        </div>
      ) : (
        <>
          <Link href={authHref('/login', language)} className="mb-2 inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-semibold text-[#ae4731] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ae4731]"><ArrowLeft className="size-4" aria-hidden="true" />{copy.backToLogin}</Link>
          <div className="mb-3">
            <h1 className={authTitleClass}>{copy.forgotTitle}</h1>
            <p className="mt-1 text-base leading-6 text-[var(--cd-muted)]">{copy.forgotDescription}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="space-y-1">
              <Label htmlFor="recovery-email" className="text-sm font-semibold text-[#51434e]">{t('email')}</Label>
              <Input id="recovery-email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} required disabled={isSending} className={authInputClass} />
            </div>
            {formError && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>}
            <Button type="submit" disabled={isSending} className={authButtonClass}>
              {isSending ? <><Loader2 className="me-2 size-4 animate-spin" aria-hidden="true" />{copy.sendingLink}</> : <>{copy.sendLink}<ArrowRight className="ms-2 size-4" aria-hidden="true" /></>}
            </Button>
          </form>
        </>
      )}
    </AuthFrame>
  )
}
