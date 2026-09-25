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
  const usagePercentage = Math.min(Math.round((pagesUsed / pagesLimit) * 100), 100)
  const trialDays = profile.trial_end_at ? getTrialDaysRemaining(profile.trial_end_at) : 0
  const planName = isTrial ? t('freeTrial') : currentPlanId && PLANS[currentPlanId] ? PLANS[currentPlanId].name : t('freeTrial')
  const format = new Intl.NumberFormat(language)

  return (
    <aside aria-label={t('usageThisMonth')} className="relative flex h-full min-h-[290px] flex-col overflow-hidden rounded-[28px] bg-[#33252b] p-6 text-white shadow-[0_24px_65px_-38px_rgba(43,34,48,0.8)] sm:p-7">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-[#7e5576]/30 blur-3xl" />
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl border border-white/15 bg-white/10">
            <Layers3 className="size-5 text-[#ebcddd]" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#d7bacd]">{t('currentPlan')}</p>
            <p className="font-medium text-white">{planName}</p>
          </div>
        </div>
        <Link href="/billing" aria-label={`${profile.subscription_status === 'active' ? t('manage') : t('upgrade')} · ${t('currentPlan')}`} className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="relative mt-auto pt-9">
        <p className="text-sm text-white/65">{t(isTrial ? 'pagesToday' : 'pagesThisMonth')}</p>
        <p className="mt-1 flex items-baseline gap-2">
          <span className="font-editorial text-5xl leading-none tracking-tight sm:text-[3.5rem]">{format.format(pagesUsed)}</span>
          <span className="text-sm text-white/60">/ {format.format(pagesLimit)}</span>
        </p>
        <div role="progressbar" aria-label={t('pagesProcessed')} aria-valuenow={pagesUsed} aria-valuemin={0} aria-valuemax={pagesLimit} className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-[#e9bfd5] transition-[width] duration-500" style={{ width: `${usagePercentage}%` }} />
        </div>
        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-white/65">
          <span>{usagePercentage >= 100 ? t('monthlyLimitReached') : usagePercentage >= 80 ? t('monthlyLimitAlmostReached') : t('pagesProcessed')}</span>
          {isTrial && <span className="inline-flex items-center gap-1.5 whitespace-nowrap"><Clock3 className="size-3.5" aria-hidden="true" />{trialDays} {t('daysRemainingInTrial')}</span>}
        </div>
      </div>
    </aside>
  )
}
