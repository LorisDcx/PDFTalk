'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './auth-provider'
import { useLanguage } from '@/lib/i18n'
import { isTrialExpired } from '@/lib/utils'
import { PLANS, PlanId } from '@/lib/stripe'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
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
  // Based on 7-day trial usage, extrapolate to monthly
  const projectedMonthly = Math.ceil((pagesUsed / 7) * 30)
  
  if (projectedMonthly <= 150) {
    return { planId: 'starter', reason: 'lightUsage' }
  } else if (projectedMonthly <= 400) {
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
    if (isExpired && !hasActiveSubscription) {
      setIsOpen(true)
    }
  }, [isExpired, hasActiveSubscription])

  if (!profile || hasActiveSubscription) return null

  const pagesUsed = profile.pages_processed_this_month || 0
  const { planId: recommendedPlanId, reason } = getRecommendedPlan(pagesUsed)
  const recommendedPlan = PLANS[recommendedPlanId]
  const projectedMonthly = Math.ceil((pagesUsed / 7) * 30)

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
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer",
          "hover:scale-105 active:scale-95",
          isExpired
            ? "bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 animate-pulse"
            : "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:border-amber-500/50"
        )}
      >
        {isExpired ? (
          <>
            <AlertTriangle className="h-4 w-4" />
            <span>{t('trialExpired')}</span>
          </>
        ) : timeRemaining ? (
          <>
            <Clock className="h-4 w-4 animate-pulse" />
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                isExpired 
                  ? "bg-gradient-to-br from-red-500 to-red-600"
                  : "bg-gradient-to-br from-amber-500 to-orange-500"
              )}>
                {isExpired ? (
                  <AlertTriangle className="h-6 w-6 text-white" />
                ) : (
                  <Clock className="h-6 w-6 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl">
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
              <div className="text-center p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                <p className="text-sm text-muted-foreground mb-2">{t('timeRemaining')}</p>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {timeRemaining.days}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('days')}</div>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {String(timeRemaining.hours).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('hours')}</div>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">:</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                      {String(timeRemaining.minutes).padStart(2, '0')}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('minutes')}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Pages used during trial */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('pagesUsedDuringTrial')}</span>
                <span className="text-lg font-bold text-primary">{pagesUsed}</span>
              </div>
              <Progress value={Math.min((pagesUsed / 400) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                {t('projectedMonthlyUsage')}: ~{projectedMonthly} {t('pages')}
              </p>
            </div>

            {/* Recommended plan */}
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{t('recommendedForYou')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    {getPlanIcon(recommendedPlanId)}
                  </div>
                  <div>
                    <p className="font-semibold">{recommendedPlan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {recommendedPlan.pagesPerMonth} {t('pagesPerMonth')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{recommendedPlan.price}€</p>
                  <p className="text-xs text-muted-foreground">/{t('month')}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                {t(reason)}
              </p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2">
              <Button asChild className="w-full" size="lg">
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
