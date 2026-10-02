'use client'

import Link from 'next/link'
import { ArrowUpRight, Clock3, Layers3 } from 'lucide-react'
import { useAuth } from './auth-provider'
import { getPlanLimits, PLANS, type PlanId } from '@/lib/plans'
import { getTrialDaysRemaining, isSameUtcDay } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

export function UsageCard() {
  const { profile } = useAuth()
  const { language, t } = useLanguage()

  if (!profile) return null

  const oldToNewPlanMap: Record<string, PlanId> = {
    basic: 'starter',
    growth: 'student',
    pro: 'graduate',
    intense: 'graduate',
  }
  const currentPlanId = profile.current_plan
    ? (oldToNewPlanMap[profile.current_plan] || profile.current_plan) as PlanId
    : null
  const isTrial = profile.subscription_status === 'trialing'
  const pagesLimit = isTrial ? 200 : getPlanLimits(currentPlanId).pagesPerMonth
  const pagesUsed = isTrial
    ? isSameUtcDay(profile.trial_usage_reset_at)
      ? profile.trial_pages_processed_today
      : 0
    : profile.pages_processed_this_month
  const usagePercentage = Math.min(Math.max(Math.round((pagesUsed / pagesLimit) * 100), 0), 100)
  const trialDays = profile.trial_end_at ? getTrialDaysRemaining(profile.trial_end_at) : 0
  const planName = isTrial ? t('freeTrial') : currentPlanId && PLANS[currentPlanId] ? PLANS[currentPlanId].name : t('freeTrial')
  const format = new Intl.NumberFormat(language)

  return (
    <aside aria-label={t('usageThisMonth')} className="usage-meter flex flex-wrap items-center gap-x-5 gap-y-3 rounded-xl border border-[var(--cd-line)] bg-white px-4 py-3 text-[var(--cd-ink)]">
      <Layers3 className="size-5 shrink-0 text-[var(--cd-brand)]" aria-hidden="true" />
      <span className="text-sm font-semibold">{planName}</span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm text-[var(--cd-muted)]"><strong className="font-semibold tabular-nums text-[var(--cd-ink)]">{format.format(pagesUsed)} / {format.format(pagesLimit)}</strong> {t(isTrial ? 'pagesToday' : 'pagesThisMonth')}</p>
        <div role="progressbar" aria-label={t('pagesProcessed')} aria-valuenow={Math.min(pagesUsed, pagesLimit)} aria-valuemin={0} aria-valuemax={pagesLimit} className="h-1.5 w-28 overflow-hidden rounded-full bg-[var(--cd-paper)]"><div className="h-full rounded-full bg-[var(--cd-brand)]" style={{ width: `${usagePercentage}%` }} /></div>
        {usagePercentage >= 80 && <span className="text-sm text-[var(--cd-brand)]">{t(usagePercentage >= 100 ? 'monthlyLimitReached' : 'monthlyLimitAlmostReached')}</span>}
        {isTrial && <span className="inline-flex items-center gap-1.5 text-sm text-[var(--cd-muted)]"><Clock3 className="size-4" aria-hidden="true" />{trialDays} {t('daysRemainingInTrial')}</span>}
      </div>
      <Link href="/billing" className="inline-flex min-h-11 items-center gap-1 text-sm text-[var(--cd-muted)] hover:text-[var(--cd-brand)]">{t('manage')}<ArrowUpRight className="size-4" aria-hidden="true" /></Link>
    </aside>
  )
}
