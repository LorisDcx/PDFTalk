import { NextResponse } from 'next/server'
import type { UsageCheckResult } from './usage'

export function usageFailureResponse(usage: UsageCheckResult) {
  const serviceUnavailable = usage.error === 'database_schema_missing' || usage.error === 'usage_check_failed'
  const status = serviceUnavailable ? 503 : usage.error === 'profile_not_found' ? 404 : 403
  const error = serviceUnavailable
    ? 'Le traitement est temporairement indisponible. Réessaie plus tard.'
    : usage.error === 'subscription_expired'
      ? 'La période d’essai ou l’abonnement a expiré.'
      : usage.error === 'profile_not_found'
        ? 'Profil introuvable. Reconnecte-toi puis réessaie.'
        : `Quota insuffisant : ${usage.pagesRequired} page(s) nécessaires, ${usage.pagesRemaining} restante(s).`

  return NextResponse.json({
    error,
    code: usage.error,
    pagesRequired: usage.pagesRequired,
    pagesRemaining: usage.pagesRemaining,
  }, { status })
}
