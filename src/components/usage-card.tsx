'use client'

import { Progress } from './ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useAuth } from './auth-provider'
import { getPlanLimits, PLANS, PlanId } from '@/lib/stripe'
import Link from 'next/link'
import { getTrialDaysRemaining, isTrialExpired } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

export function UsageCard() {
  const { profile } = useAuth()
  const { t } = useLanguage()

  if (!profile) return null

  // Map old plan IDs to new ones
  const oldToNewPlanMap: Record<string, PlanId> = {
    'basic': 'starter',
    'growth': 'student', 
    'pro': 'graduate',
    // Legacy name
    'intense': 'graduate',
  }
  const currentPlanId = profile.current_plan ? (oldToNewPlanMap[profile.current_plan] || profile.current_plan) as PlanId : null

  const planLimits = getPlanLimits(currentPlanId)
  const pagesUsed = profile.pages_processed_this_month
  const pagesLimit = planLimits.pagesPerMonth
  const usagePercentage = Math.min((pagesUsed / pagesLimit) * 100, 100)

  const isInTrial = profile.trial_end_at && !isTrialExpired(profile.trial_end_at) && !profile.subscription_status
  const trialDays = profile.trial_end_at ? getTrialDaysRemaining(profile.trial_end_at) : 0

  return (
    <Card className="animate-fade-in-up overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">{t('usageThisMonth')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">{t('pagesProcessed')}</span>
            <span className="font-medium">{pagesUsed} / {pagesLimit}</span>
          </div>
          <div className="relative">
            <Progress value={usagePercentage} className="h-2" />
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-primary/50 to-primary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        {isInTrial && (
          <div className="rounded-lg bg-amber-500/10 p-3 animate-pulse-soft">
            <p className="text-sm font-medium text-amber-600">
              {trialDays} {t('daysRemainingInTrial')}
            </p>
            <p className="text-xs text-amber-600/80 mt-1">
              {t('upgradeToKeepAccess')}
            </p>
          </div>
        )}

        {usagePercentage >= 80 && (
          <div className="rounded-lg bg-amber-500/10 p-3 animate-fade-in">
            <p className="text-sm font-medium text-amber-600">
              {usagePercentage >= 100 ? t('monthlyLimitReached') : t('monthlyLimitAlmostReached')}
            </p>
            <p className="text-xs text-amber-600/80 mt-1">
              {usagePercentage >= 100 
                ? t('upgradeToUnlock') 
                : t('considerUpgrading')}
            </p>
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1 btn-press">
            <Link href="/billing">
              {profile.subscription_status === 'active' ? t('manage') : t('upgrade')}
            </Link>
          </Button>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            {t('currentPlan')}: <span className="font-medium">{currentPlanId ? PLANS[currentPlanId].name : t('freeTrial')}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
