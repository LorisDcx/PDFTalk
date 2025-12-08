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

export default function BillingPage() {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Handle success/canceled from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    
    if (success === 'true') {
      // Refresh profile to get updated subscription data
      refreshProfile()
      toast({
        title: 'Paiement réussi !',
        description: 'Votre abonnement est maintenant actif. Merci !',
      })
      // Clean URL
      router.replace('/billing')
    } else if (canceled === 'true') {
      toast({
        title: 'Paiement annulé',
        description: 'Vous pouvez réessayer quand vous le souhaitez.',
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

      // Redirect to Stripe Checkout
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

  return (
    <div className="container max-w-5xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Billing</h1>
        <p className="text-muted-foreground">Manage your subscription and billing</p>
      </div>

      {/* Current Status */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Current Plan</h3>
              <p className="text-muted-foreground">
                {hasActiveSubscription ? (
                  <>You are on the <span className="font-medium text-foreground">{PLANS[profile.current_plan!].name}</span> plan</>
                ) : isInTrial ? (
                  <>You have <span className="font-medium text-foreground">{trialDays} days</span> left in your trial</>
                ) : (
                  'Your trial has expired'
                )}
              </p>
            </div>
            {hasActiveSubscription && (
              <Button variant="outline" onClick={handleManageSubscription} disabled={isLoading === 'manage'}>
                {isLoading === 'manage' ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Manage Subscription'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {(Object.entries(PLANS) as [PlanId, typeof PLANS[PlanId]][]).map(([planId, plan]) => {
          const isCurrentPlan = profile?.current_plan === planId && hasActiveSubscription
          const isPopular = planId === 'growth'

          return (
            <Card key={planId} className={isPopular ? 'border-primary shadow-md relative' : ''}>
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary">Most Popular</Badge>
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {plan.name}
                  {isCurrentPlan && <Crown className="h-5 w-5 text-primary" />}
                </CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">{plan.price}€</span>
                  <span className="text-muted-foreground">/month</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{feature}</span>
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
                    'Current Plan'
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-1">Can I upgrade or downgrade?</h3>
            <p className="text-sm text-muted-foreground">
              Yes! You can change your plan anytime. Changes take effect immediately, and we'll prorate the billing.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">What happens if I exceed my limit?</h3>
            <p className="text-sm text-muted-foreground">
              You'll receive a notification and can upgrade your plan or wait for the monthly reset.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Can I cancel anytime?</h3>
            <p className="text-sm text-muted-foreground">
              Absolutely. Cancel anytime from the billing portal. You'll keep access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-1">Do you offer refunds?</h3>
            <p className="text-sm text-muted-foreground">
              We offer a 7-day free trial so you can try before you buy. Refunds are handled on a case-by-case basis.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
