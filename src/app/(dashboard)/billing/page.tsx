'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { PLANS, PlanId } from '@/lib/stripe'
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
  }, [searchParams, refreshProfile, toast, router])

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
      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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

      window.location.href = data.url
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
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

  const isInTrial = profile?.trial_end_at && !isTrialExpired(profile.trial_end_at) && !profile.subscription_status
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
    <div className="container max-w-5xl py-4 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('billingTitle')}</h1>
        <p className="text-muted-foreground">{t('billingSubtitle')}</p>
      </div>

      {/* Current Status */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{t('currentPlan')}</h3>
              <p className="text-muted-foreground">
                {hasActiveSubscription ? (
                  <>{t('youAreOnPlan')} <span className="font-medium text-foreground">{getPlanName(profile.current_plan)}</span></>
                ) : isInTrial ? (
                  <><span className="font-medium text-foreground">{trialDays}</span> {t('daysLeftInTrial')}</>
                ) : (
                  t('trialHasExpired')
                )}
              </p>
            </div>
            {hasActiveSubscription && (
              <Button variant="outline" onClick={handleManageSubscription} disabled={isLoading === 'manage'}>
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
      <div className="grid md:grid-cols-3 gap-6">
        {(Object.entries(PLANS) as [PlanId, typeof PLANS[PlanId]][]).map(([planId, plan]) => {
          // Map old plan IDs to new ones for comparison
          const oldToNewPlanMap: Record<string, string> = {
            'basic': 'starter', 'growth': 'student', 'pro': 'graduate', 'intense': 'graduate'
          }
          const currentPlanMapped = profile?.current_plan ? (oldToNewPlanMap[profile.current_plan] || profile.current_plan) : null
          const isCurrentPlan = currentPlanMapped === planId && hasActiveSubscription
          const isPopular = planId === 'student'

          return (
            <Card key={planId} className={isPopular ? 'border-primary shadow-md relative' : ''}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">{t('mostPopular')}</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {isCurrentPlan && <Crown className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{plan.price}€</span>
                  <span className="text-muted-foreground">{t('perMonth')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Pages highlight */}
                {(() => {
                  const displayLimit = plan.pagesPerMonth >= 10000 ? '∞' : plan.pagesPerMonth
                  return (
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
                      <span className="text-2xl font-bold text-primary">{displayLimit}</span>
                      <span className="text-sm text-muted-foreground ml-1">{t('pagesPerMonth')}</span>
                    </div>
                  )
                })()}

                {/* Humanizer credits */}
                <div className="mb-4 p-3 rounded-lg bg-secondary/20 border border-secondary/30 text-center">
                  <span className="text-lg font-semibold text-foreground">
                    {plan.humanizerCredits} Humanizer credits / mois
                  </span>
                </div>
                
                <ul className="space-y-2">
                  {plan.featureKeys.map((featureKey, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
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
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">{t('faqTitle')}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-1">{t('faqUpgrade')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('faqUpgradeAnswer')}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">{t('faqExceed')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('faqExceedAnswer')}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">{t('faqCancel')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('faqCancelAnswer')}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">{t('faqRefunds')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('faqRefundsAnswer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
