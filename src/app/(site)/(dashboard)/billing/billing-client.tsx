'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { PLANS, PlanId } from '@/lib/plans'
import { Loader2, Check, Crown } from 'lucide-react'
import { getTrialDaysRemaining, isTrialExpired } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

export default function BillingPage() {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t } = useLanguage()

  // Handle success/canceled from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    
    if (success === 'true') {
      // Refresh profile to get updated subscription data
      refreshProfile()
      toast({
        title: t('paymentSuccess'),
        description: t('paymentSuccessDesc'),
      })
      // Clean URL
      router.replace('/billing')
    } else if (canceled === 'true') {
      toast({
        title: t('paymentCanceled'),
        description: t('paymentCanceledDesc'),
        variant: 'destructive',
      })
      router.replace('/billing')
    }
  }, [searchParams, refreshProfile, toast, router, t])

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleSubscribe = async (planId: PlanId) => {
    setIsLoading(planId)

    try {
      const response = await fetch('/api/billing/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Check if plan was switched (no redirect needed)
      if (data.switched) {
        toast({
          title: t('planSwitched'),
          description: t('planSwitchedDesc'),
        })
        refreshProfile()
        return
      }

      // Redirect to Stripe Checkout for new subscription
      window.location.assign(data.url)
    } catch (error: unknown) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  const handleManageSubscription = async () => {
    setIsLoading('manage')

    try {
      const response = await fetch('/api/billing/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      window.location.assign(data.url)
    } catch (error: unknown) {
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(null)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const isInTrial = profile?.subscription_status === 'trialing' && !!profile.trial_end_at && !isTrialExpired(profile.trial_end_at)
  const trialDays = profile?.trial_end_at ? getTrialDaysRemaining(profile.trial_end_at) : 0
  const hasActiveSubscription = profile?.subscription_status === 'active'
  
  // Map old plan names to new ones for backwards compatibility
  const getPlanName = (planId: string | null | undefined): string => {
    if (!planId) return 'Starter'
    // Map old plan names to new ones
    const planMapping: Record<string, string> = {
      'basic': 'Starter',
      'growth': 'Student', 
      'pro': 'Graduate',
      'starter': 'Starter',
      'student': 'Student',
      'graduate': 'Graduate',
      // Legacy name
      'intense': 'Graduate',
    }
    return planMapping[planId] || planId
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fffaf5] px-4 py-8 text-[#33252b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
      <div className="mb-9">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#b45438]">{t('billing')}</p>
        <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">{t('billingTitle')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#776d78]">{t('billingSubtitle')}</p>
      </div>

      {/* Current Status */}
      <Card className="mb-9 overflow-hidden rounded-[1.5rem] border-[#b84432] bg-[#b84432] text-white shadow-[0_20px_45px_-30px_rgba(75,40,67,.6)]">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div>
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[.18em] text-[#ead3e3]">{t('currentPlan')}</p>
              <h2 className="font-editorial text-2xl leading-snug sm:text-3xl">
                {hasActiveSubscription ? (
                  <>{t('youAreOnPlan')} {getPlanName(profile.current_plan)}</>
                ) : isInTrial ? (
                  <>{trialDays} {t('daysLeftInTrial')}</>
                ) : (
                  t('trialHasExpired')
                )}
              </h2>
            </div>
            {hasActiveSubscription && (
              <Button variant="outline" className="min-h-11 border-white/30 bg-white text-[#b84432] hover:bg-[#fff2e9]" onClick={handleManageSubscription} disabled={isLoading === 'manage'}>
                {isLoading === 'manage' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t('manageSubscription')
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {(Object.entries(PLANS) as [PlanId, typeof PLANS[PlanId]][]).map(([planId, plan]) => {
          // Map old plan IDs to new ones for comparison
          const oldToNewPlanMap: Record<string, string> = {
            'basic': 'starter', 'growth': 'student', 'pro': 'graduate', 'intense': 'graduate'
          }
          const currentPlanMapped = profile?.current_plan ? (oldToNewPlanMap[profile.current_plan] || profile.current_plan) : null
          const isCurrentPlan = currentPlanMapped === planId && hasActiveSubscription
          const isPopular = planId === 'student'

          return (
            <Card key={planId} className={`relative flex flex-col rounded-[1.5rem] p-1 ${isPopular ? 'border-[#b84432] bg-[#b84432] text-white shadow-[0_22px_45px_-28px_rgba(76,33,64,.6)]' : 'border-[#ead9cf] bg-white text-[#33252b] shadow-sm'}`}>
              {isPopular && (
                <div className="absolute -top-3 right-5">
                  <Badge className="border-white/20 bg-[#ffe0d1] text-[#b84432] hover:bg-[#ffe0d1]">{t('mostPopular')}</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  {plan.name}
                  {isCurrentPlan && <Crown className={`h-5 w-5 ${isPopular ? 'text-white' : 'text-[#b84432]'}`} />}
                </CardTitle>
                <CardDescription className={isPopular ? 'text-[#f0d5ca]' : 'text-[#776d78]'}>
                  <span className={`font-editorial text-4xl ${isPopular ? 'text-white' : 'text-[#33252b]'}`}>{plan.price}€</span>
                  <span className="ml-1">{t('perMonth')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {/* Pages highlight */}
                {(() => {
                  const displayLimit = new Intl.NumberFormat('fr-FR').format(plan.pagesPerMonth)
                  return (
                    <div className={`mb-3 rounded-xl border p-3 text-center ${isPopular ? 'border-white/20 bg-white/10' : 'border-[#efdcd0] bg-[#fff2e9]'}`}>
                      <span className={`font-editorial text-3xl ${isPopular ? 'text-white' : 'text-[#b84432]'}`}>{displayLimit}</span>
                      <span className={`ml-1 text-sm ${isPopular ? 'text-[#f0d5ca]' : 'text-[#776d78]'}`}>{t('pagesPerMonth')}</span>
                    </div>
                  )
                })()}

                {/* Humanizer credits */}
                <div className={`mb-5 rounded-xl border p-3 text-center ${isPopular ? 'border-white/20 bg-white/10' : 'border-[#efdcd0] bg-[#fbf8fa]'}`}>
                  <span className={`text-sm font-semibold ${isPopular ? 'text-white' : 'text-[#33252b]'}`}>
                    {plan.humanizerCredits} {t('humanizer')} · {t('perMonth')}
                  </span>
                </div>
                
                <ul className="space-y-3">
                  {plan.featureKeys.map((featureKey, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${isPopular ? 'text-[#edcedf]' : 'text-[#718d6d]'}`} />
                      <span>{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className={`min-h-11 w-full ${isPopular ? 'bg-white text-[#b84432] hover:bg-[#ffebe1]' : 'border-[#e4c4b6] bg-white text-[#b84432] hover:bg-[#ffebe1]'}`}
                  variant={isPopular ? 'default' : 'outline'}
                  disabled={isCurrentPlan || isLoading === planId}
                  onClick={() => handleSubscribe(planId)}
                >
                  {isLoading === planId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isCurrentPlan ? (
                    t('currentPlanBadge')
                  ) : (
                    t('subscribe')
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="mt-14">
        <h2 className="font-editorial mb-6 text-3xl">{t('faqTitle')}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.2rem] border border-[#ead9cf] bg-white p-5">
            <h3 className="mb-2 font-semibold">{t('faqUpgrade')}</h3>
            <p className="text-sm leading-6 text-[#776d78]">
              {t('faqUpgradeAnswer')}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[#ead9cf] bg-white p-5">
            <h3 className="mb-2 font-semibold">{t('faqExceed')}</h3>
            <p className="text-sm leading-6 text-[#776d78]">
              {t('faqExceedAnswer')}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[#ead9cf] bg-white p-5">
            <h3 className="mb-2 font-semibold">{t('faqCancel')}</h3>
            <p className="text-sm leading-6 text-[#776d78]">
              {t('faqCancelAnswer')}
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-[#ead9cf] bg-white p-5">
            <h3 className="mb-2 font-semibold">{t('faqRefunds')}</h3>
            <p className="text-sm leading-6 text-[#776d78]">
              {t('faqRefundsAnswer')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
