'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './auth-provider'
import { useLanguage } from '@/lib/i18n'
import { isSameUtcDay, isTrialExpired } from '@/lib/utils'
import { PLANS, PlanId } from '@/lib/plans'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Clock, Sparkles, TrendingUp, Zap, Crown, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  total: number
}

function getTimeRemaining(trialEndAt: Date | string): TimeRemaining {
  const now = new Date()
  const end = new Date(trialEndAt)
  if (Number.isNaN(end.getTime())) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  const total = Math.max(0, end.getTime() - now.getTime())
  
  return {
    days: Math.floor(total / (1000 * 60 * 60 * 24)),
    hours: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((total / (1000 * 60)) % 60),
    seconds: Math.floor((total / 1000) % 60),
    total
  }
}

function getRecommendedPlan(pagesUsed: number): { planId: PlanId; reason: string } {
  // An indicative monthly estimate from today's usage.
  const projectedMonthly = pagesUsed * 30
  
  if (projectedMonthly <= 300) {
    return { planId: 'starter', reason: 'lightUsage' }
  } else if (projectedMonthly <= 800) {
    return { planId: 'student', reason: 'regularUsage' }
  } else {
    return { planId: 'graduate', reason: 'heavyUsage' }
  }
}

export function TrialCountdown() {
  const { profile } = useAuth()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  // Don't show if user has active subscription
  const hasActiveSubscription = profile?.subscription_status === 'active'
  
  useEffect(() => {
    if (!profile?.trial_end_at || hasActiveSubscription) return

    const updateTime = () => {
      const expired = isTrialExpired(profile.trial_end_at)
      setIsExpired(expired)
      
      if (!expired) {
        setTimeRemaining(getTimeRemaining(profile.trial_end_at))
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [profile?.trial_end_at, hasActiveSubscription])

  // Auto-open dialog when trial expires
  useEffect(() => {
    if (!isExpired || hasActiveSubscription) return
    let active = true
    queueMicrotask(() => { if (active) setIsOpen(true) })
    return () => { active = false }
  }, [isExpired, hasActiveSubscription])

  if (!profile || hasActiveSubscription) return null

  const pagesUsed = isSameUtcDay(profile.trial_usage_reset_at)
    ? profile.trial_pages_processed_today || 0
    : 0
  const { planId: recommendedPlanId, reason } = getRecommendedPlan(pagesUsed)
  const recommendedPlan = PLANS[recommendedPlanId]
  const projectedMonthly = pagesUsed * 30

  const getPlanIcon = (planId: PlanId) => {
    switch (planId) {
      case 'starter': return <Zap className="h-5 w-5" />
      case 'student': return <TrendingUp className="h-5 w-5" />
      case 'graduate': return <Crown className="h-5 w-5" />
    }
  }

  return (
    <>
      {/* Clickable badge/countdown */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
          isExpired
            ? "border-[#ebc9c3] bg-[#fff1ef] text-[#9b4540]"
            : "border-[#e4c4b6] bg-[#fff0e6] text-[#b84432] hover:bg-[#ffe2d2]"
        )}
      >
        {isExpired ? (
          <>
            <AlertTriangle className="h-4 w-4" />
            <span>{t('trialExpired')}</span>
          </>
        ) : timeRemaining ? (
          <>
            <Clock className="h-4 w-4" />
            <span className="tabular-nums">
              {timeRemaining.days > 0 
                ? `${timeRemaining.days}${t('daysShort')} ${timeRemaining.hours}${t('hoursShort')}`
                : timeRemaining.hours > 0
                  ? `${timeRemaining.hours}${t('hoursShort')} ${timeRemaining.minutes}${t('minutesShort')}`
                  : `${timeRemaining.minutes}${t('minutesShort')} ${timeRemaining.seconds}${t('secondsShort')}`
              }
            </span>
          </>
        ) : (
          <span>{t('trial')}</span>
        )}
      </button>

      {/* Trial status dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-[#ead9cf] bg-[#fffaf5] sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "flex size-12 items-center justify-center rounded-2xl",
                isExpired 
                  ? "bg-[#a24a45]"
                  : "bg-[#b84432]"
              )}>
                {isExpired ? (
                  <AlertTriangle className="h-6 w-6 text-white" />
                ) : (
                  <Clock className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="font-editorial text-2xl">
                  {isExpired ? t('trialExpiredTitle') : t('trialStatusTitle')}
                </DialogTitle>
                <DialogDescription>
                  {isExpired ? t('trialExpiredDesc') : t('trialStatusDesc')}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Time remaining countdown */}
            {!isExpired && timeRemaining && (
              <div className="rounded-[1.2rem] border border-[#f0d5ca] bg-[#fff2e9] p-5 text-center">
                <p className="text-sm text-muted-foreground mb-2">{t('timeRemaining')}</p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="font-editorial tabular-nums text-4xl text-[#b84432]">
                      {timeRemaining.days}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('days')}</div>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">:</div>
                  <div className="text-center">
                    <div className="font-editorial tabular-nums text-4xl text-[#b84432]">
                      {String(timeRemaining.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('hours')}</div>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">:</div>
                  <div className="text-center">
                    <div className="font-editorial tabular-nums text-4xl text-[#b84432]">
                      {String(timeRemaining.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('minutes')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Today's trial usage */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('pagesToday')}</span>
                <span className="text-lg font-bold text-[#b84432]">{pagesUsed} / 200</span>
              </div>
              <Progress value={Math.min((pagesUsed / 200) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {t('projectedMonthlyUsage')}: ~{projectedMonthly} {t('pages')}
              </p>
            </div>

            {/* Recommended plan */}
            <div className="rounded-[1.2rem] border border-[#ead9cf] bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t('recommendedForYou')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#ffe0d1] text-[#b84432]">
                    {getPlanIcon(recommendedPlanId)}
                  </div>
                  <div>
                    <p className="font-semibold">{recommendedPlan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Intl.NumberFormat('fr-FR').format(recommendedPlan.pagesPerMonth)} {t('pagesPerMonth')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-editorial text-2xl">{recommendedPlan.price}€</p>
                  <p className="text-xs text-muted-foreground">/{t('month')}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                {t(reason)}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full bg-[#b84432] text-white hover:bg-[#963326]" size="lg">
                <Link href="/billing" onClick={() => setIsOpen(false)}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isExpired ? t('subscribeNow') : t('choosePlan')}
                </Link>
              </Button>
              {!isExpired && (
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  {t('continueTrial')}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
