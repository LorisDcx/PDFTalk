'use client'

import { Progress } from './ui/progress'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { useAuth } from './auth-provider'
import { getPlanLimits, PLANS } from '@/lib/stripe'
import Link from 'next/link'
import { getTrialDaysRemaining, isTrialExpired } from '@/lib/utils'

export function UsageCard() {
  const { profile } = useAuth()

  if (!profile) return null

  const planLimits = getPlanLimits(profile.current_plan)
  const pagesUsed = profile.pages_processed_this_month
  const pagesLimit = planLimits.pagesPerMonth
  const usagePercentage = Math.min((pagesUsed / pagesLimit) * 100, 100)

  const isInTrial = profile.trial_end_at && !isTrialExpired(profile.trial_end_at) && !profile.subscription_status
  const trialDays = profile.trial_end_at ? getTrialDaysRemaining(profile.trial_end_at) : 0

  return (
    <Card className="animate-fade-in-up overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Utilisation ce mois</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Pages traitées</span>
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
              {trialDays} jours restants dans votre essai gratuit
            </p>
            <p className="text-xs text-amber-600/80 mt-1">
              Passez à un forfait payant pour conserver votre accès
            </p>
          </div>
        )}

        {usagePercentage >= 80 && (
          <div className="rounded-lg bg-amber-500/10 p-3 animate-fade-in">
            <p className="text-sm font-medium text-amber-600">
              {usagePercentage >= 100 ? 'Limite mensuelle atteinte' : 'Limite mensuelle bientôt atteinte'}
            </p>
            <p className="text-xs text-amber-600/80 mt-1">
              {usagePercentage >= 100 
                ? 'Passez à un forfait supérieur pour continuer' 
                : 'Envisagez de passer à un forfait supérieur'}
            </p>
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1 btn-press">
            <Link href="/billing">
              {profile.subscription_status === 'active' ? 'Gérer mon forfait' : 'Passer au forfait'}
            </Link>
          </Button>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Forfait actuel : <span className="font-medium">{profile.current_plan ? PLANS[profile.current_plan].name : 'Essai'}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
