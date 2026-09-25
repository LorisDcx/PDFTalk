import type { SupabaseClient } from '@supabase/supabase-js'
import { getPlanLimits } from './plans'
import { createAdminClient } from './supabase/admin'
import { isSameUtcDay } from './utils'

export const TRIAL_DAILY_LIMIT = 200
export const TRIAL_DAILY_DOCS_LIMIT = 10

export interface UsageCheckResult {
  allowed: boolean
  pagesRemaining: number
  pagesRequired: number
  currentUsage: number
  limit: number
  error?: string
  isInTrial?: boolean
  dailyUsage?: number
  dailyLimit?: number
}

function sameUtcMonth(a: Date, b: Date) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth()
}

function isTrial(profile: { subscription_status: string | null; trial_end_at: string }, now: Date) {
  return profile.subscription_status === 'trialing' && new Date(profile.trial_end_at) > now
}

export async function checkUserUsage(
  supabase: SupabaseClient,
  userId: string,
  pagesRequired: number
): Promise<UsageCheckResult> {
  const { data: profile, error } = await supabase
    .from('users')
    .select('current_plan, subscription_status, trial_end_at, pages_processed_this_month, usage_reset_at, trial_pages_processed_today, trial_usage_reset_at')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Usage profile query failed:', error)
    return { allowed: false, pagesRemaining: 0, pagesRequired, currentUsage: 0, limit: 0,
      error: error.code === '42703' || error.code === 'PGRST200' ? 'database_schema_missing' : 'usage_check_failed' }
  }
  if (!profile) {
    return { allowed: false, pagesRemaining: 0, pagesRequired, currentUsage: 0, limit: 0, error: 'profile_not_found' }
  }

  const now = new Date()
  const currentUsage = sameUtcMonth(new Date(profile.usage_reset_at), now)
    ? profile.pages_processed_this_month || 0 : 0
  const trial = isTrial(profile, now)

  if (!trial && profile.subscription_status !== 'active') {
    return { allowed: false, pagesRemaining: 0, pagesRequired, currentUsage, limit: 0, error: 'subscription_expired' }
  }

  if (trial) {
    const dailyUsage = isSameUtcDay(profile.trial_usage_reset_at, now)
      ? profile.trial_pages_processed_today || 0 : 0
    const pagesRemaining = Math.max(0, TRIAL_DAILY_LIMIT - dailyUsage)
    return {
      allowed: pagesRemaining >= pagesRequired,
      pagesRemaining,
      pagesRequired,
      currentUsage,
      limit: TRIAL_DAILY_LIMIT,
      error: pagesRemaining >= pagesRequired ? undefined : 'daily_limit_reached',
      isInTrial: true,
      dailyUsage,
      dailyLimit: TRIAL_DAILY_LIMIT,
    }
  }

  const limit = getPlanLimits(profile.current_plan).pagesPerMonth
  const pagesRemaining = Math.max(0, limit - currentUsage)
  return {
    allowed: pagesRemaining >= pagesRequired,
    pagesRemaining,
    pagesRequired,
    currentUsage,
    limit,
    error: pagesRemaining >= pagesRequired ? undefined : 'insufficient_pages',
    isInTrial: false,
  }
}

/** The database checks and increments quota in one atomic update. */
export async function deductPages(
  _supabase: SupabaseClient,
  userId: string,
  pages: number,
  document = false
): Promise<{ success: boolean; newUsage: number; error?: string }> {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('consume_pages', {
    p_user_id: userId,
    p_pages: pages,
    p_document: document,
  })
  if (error || data !== true) {
    return { success: false, newUsage: 0, error: error?.message || 'Quota exceeded' }
  }

  const { data: profile } = await admin.from('users')
    .select('pages_processed_this_month').eq('id', userId).single()
  return { success: true, newUsage: profile?.pages_processed_this_month || 0 }
}

export function calculatePageCost(operation: 'flashcards' | 'quiz' | 'slides', count: number): number {
  return operation === 'slides' ? count : Math.ceil(count / 5)
}

export interface HumanizerUsageResult {
  allowed: boolean
  creditsRemaining: number
  creditsUsed: number
  creditsLimit: number
  error?: string
}

export async function checkHumanizerUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<HumanizerUsageResult> {
  const { data: profile, error } = await supabase
    .from('users')
    .select('current_plan, subscription_status, trial_end_at, humanizer_uses_this_month, usage_reset_at')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return { allowed: false, creditsRemaining: 0, creditsUsed: 0, creditsLimit: 0, error: 'User profile not found' }
  }

  const now = new Date()
  const creditsUsed = sameUtcMonth(new Date(profile.usage_reset_at), now)
    ? profile.humanizer_uses_this_month || 0 : 0
  const trial = isTrial(profile, now)

  if (!trial && profile.subscription_status !== 'active') {
    return { allowed: false, creditsRemaining: 0, creditsUsed, creditsLimit: 0, error: 'subscription_expired' }
  }

  const creditsLimit = trial ? 2 : getPlanLimits(profile.current_plan).humanizerCredits
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed)
  return {
    allowed: creditsRemaining > 0,
    creditsRemaining,
    creditsUsed,
    creditsLimit,
    error: creditsRemaining > 0 ? undefined : 'humanizer_limit_reached',
  }
}

export async function deductHumanizerCredit(
  _supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; newUsage: number; error?: string }> {
  const admin = createAdminClient()
  const { data, error } = await admin.rpc('consume_humanizer_credit', { p_user_id: userId })
  if (error || data !== true) {
    return { success: false, newUsage: 0, error: error?.message || 'No humanizer credits remaining' }
  }
  const { data: profile } = await admin.from('users')
    .select('humanizer_uses_this_month').eq('id', userId).single()
  return { success: true, newUsage: profile?.humanizer_uses_this_month || 0 }
}
