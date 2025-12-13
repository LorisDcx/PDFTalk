import { SupabaseClient } from '@supabase/supabase-js'
import { getPlanLimits } from './stripe'

// Trial daily limits to prevent abuse
export const TRIAL_DAILY_LIMIT = 200 // pages per day during trial
export const TRIAL_DAILY_DOCS_LIMIT = 10 // documents per day during trial

export interface UsageCheckResult {
  allowed: boolean
  pagesRemaining: number
  pagesRequired: number
  currentUsage: number
  limit: number
  error?: string
  // Trial-specific info
  isInTrial?: boolean
  dailyUsage?: number
  dailyLimit?: number
}

/**
 * Check if user has enough pages remaining for an operation
 */
export async function checkUserUsage(
  supabase: SupabaseClient,
  userId: string,
  pagesRequired: number
): Promise<UsageCheckResult> {
  // Get user profile
  const { data: profile, error } = await supabase
    .from('users')
    .select('current_plan, subscription_status, trial_end_at, pages_processed_this_month, usage_reset_at')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return {
      allowed: false,
      pagesRemaining: 0,
      pagesRequired,
      currentUsage: 0,
      limit: 0,
      error: 'User profile not found'
    }
  }

  // Check if usage needs to be reset (new month)
  const usageResetAt = new Date(profile.usage_reset_at)
  const now = new Date()
  const shouldResetUsage = usageResetAt.getMonth() !== now.getMonth() || 
                           usageResetAt.getFullYear() !== now.getFullYear()

  let currentUsage = profile.pages_processed_this_month || 0

  // Reset usage if it's a new month
  if (shouldResetUsage) {
    await supabase
      .from('users')
      .update({ 
        pages_processed_this_month: 0,
        usage_reset_at: now.toISOString()
      })
      .eq('id', userId)
    currentUsage = 0
  }

  // Check trial status
  const trialEndAt = new Date(profile.trial_end_at)
  const isTrialingStatus = profile.subscription_status === 'trialing'
  const isInTrialWindow = trialEndAt > now
  const isInTrial = isTrialingStatus || (isInTrialWindow && !profile.subscription_status)
  const hasActiveSubscription = profile.subscription_status === 'active' || isTrialingStatus

  // If no active subscription and trial expired, deny access
  if (!hasActiveSubscription && !isInTrial) {
    return {
      allowed: false,
      pagesRemaining: 0,
      pagesRequired,
      currentUsage,
      limit: 0,
      error: 'subscription_expired',
      isInTrial: false
    }
  }

  // Get plan limits
  const planLimits = getPlanLimits(profile.current_plan)
  const limit = planLimits.pagesPerMonth

  // For trial users, also check daily limit
  if (isInTrial) {
    // Check if we need to reset daily usage (stored in docs_processed_this_month as daily counter during trial)
    // We use a simple approach: check if usage_reset_at is from today
    const lastReset = new Date(profile.usage_reset_at)
    const isNewDay = lastReset.toDateString() !== now.toDateString()
    
    // If it's a new day during trial, reset the daily counter
    if (isNewDay) {
      await supabase
        .from('users')
        .update({ 
          docs_processed_this_month: 0, // Use as daily pages counter during trial
          usage_reset_at: now.toISOString()
        })
        .eq('id', userId)
    }

    // Get daily usage (we'll use docs_processed_this_month as daily counter during trial)
    const { data: dailyProfile } = await supabase
      .from('users')
      .select('docs_processed_this_month')
      .eq('id', userId)
      .single()
    
    const dailyUsage = isNewDay ? 0 : (dailyProfile?.docs_processed_this_month || 0)
    
    // Check daily limit for trial users
    if (dailyUsage + pagesRequired > TRIAL_DAILY_LIMIT) {
      return {
        allowed: false,
        pagesRemaining: Math.max(0, TRIAL_DAILY_LIMIT - dailyUsage),
        pagesRequired,
        currentUsage,
        limit: TRIAL_DAILY_LIMIT,
        error: 'daily_limit_reached',
        isInTrial: true,
        dailyUsage,
        dailyLimit: TRIAL_DAILY_LIMIT
      }
    }

    return {
      allowed: true,
      pagesRemaining: TRIAL_DAILY_LIMIT - dailyUsage,
      pagesRequired,
      currentUsage,
      limit: TRIAL_DAILY_LIMIT,
      isInTrial: true,
      dailyUsage,
      dailyLimit: TRIAL_DAILY_LIMIT
    }
  }

  // For subscribed users, use monthly limits
  const pagesRemaining = Math.max(0, limit - currentUsage)
  const allowed = pagesRemaining >= pagesRequired

  return {
    allowed,
    pagesRemaining,
    pagesRequired,
    currentUsage,
    limit,
    error: allowed ? undefined : 'insufficient_pages',
    isInTrial: false
  }
}

/**
 * Deduct pages from user's monthly quota (and daily quota during trial)
 */
export async function deductPages(
  supabase: SupabaseClient,
  userId: string,
  pages: number
): Promise<{ success: boolean; newUsage: number; error?: string }> {
  // Get current usage and trial status
  const { data: profile, error: fetchError } = await supabase
    .from('users')
    .select('pages_processed_this_month, docs_processed_this_month, trial_end_at, subscription_status')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newUsage: 0, error: 'Failed to fetch user profile' }
  }

  const currentUsage = profile.pages_processed_this_month || 0
  const newUsage = currentUsage + pages

  // Check if user is in trial (no subscription and trial not expired)
  const now = new Date()
  const trialEndAt = new Date(profile.trial_end_at)
  const isInTrial = trialEndAt > now && !profile.subscription_status

  // Update usage - both monthly and daily (for trial)
  const updateData: any = { pages_processed_this_month: newUsage }
  
  if (isInTrial) {
    // Also update daily counter during trial
    const currentDailyUsage = profile.docs_processed_this_month || 0
    updateData.docs_processed_this_month = currentDailyUsage + pages
  }

  const { error: updateError } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)

  if (updateError) {
    return { success: false, newUsage: currentUsage, error: 'Failed to update usage' }
  }

  return { success: true, newUsage }
}

/**
 * Calculate page cost for different operations
 */
export function calculatePageCost(operation: 'flashcards' | 'quiz' | 'slides', count: number): number {
  switch (operation) {
    case 'flashcards':
      // 5 flashcards = 1 page
      return Math.ceil(count / 5)
    case 'quiz':
      // 5 questions = 1 page
      return Math.ceil(count / 5)
    case 'slides':
      // 1 slide = 1 page
      return count
    default:
      return count
  }
}

export interface HumanizerUsageResult {
  allowed: boolean
  creditsRemaining: number
  creditsUsed: number
  creditsLimit: number
  error?: string
}

/**
 * Check if user has humanizer credits remaining
 */
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
    return {
      allowed: false,
      creditsRemaining: 0,
      creditsUsed: 0,
      creditsLimit: 0,
      error: 'User profile not found'
    }
  }

  // Check if usage needs to be reset (new month)
  const usageResetAt = new Date(profile.usage_reset_at)
  const now = new Date()
  const shouldResetUsage = usageResetAt.getMonth() !== now.getMonth() || 
                           usageResetAt.getFullYear() !== now.getFullYear()

  let creditsUsed = profile.humanizer_uses_this_month || 0

  if (shouldResetUsage) {
    await supabase
      .from('users')
      .update({ 
        humanizer_uses_this_month: 0,
        usage_reset_at: now.toISOString()
      })
      .eq('id', userId)
    creditsUsed = 0
  }

  // Check trial/subscription status
  const trialEndAt = new Date(profile.trial_end_at)
  const isInTrial = trialEndAt > now && !profile.subscription_status
  const hasActiveSubscription = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  if (!hasActiveSubscription && !isInTrial) {
    return {
      allowed: false,
      creditsRemaining: 0,
      creditsUsed,
      creditsLimit: 0,
      error: 'subscription_expired'
    }
  }

  // Trial users get 2 humanizer credits
  if (isInTrial) {
    const trialLimit = 2
    const creditsRemaining = Math.max(0, trialLimit - creditsUsed)
    return {
      allowed: creditsRemaining > 0,
      creditsRemaining,
      creditsUsed,
      creditsLimit: trialLimit,
      error: creditsRemaining > 0 ? undefined : 'humanizer_limit_reached'
    }
  }

  // Get plan limits
  const planLimits = getPlanLimits(profile.current_plan)
  const creditsLimit = planLimits.humanizerCredits || 5
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed)

  return {
    allowed: creditsRemaining > 0,
    creditsRemaining,
    creditsUsed,
    creditsLimit,
    error: creditsRemaining > 0 ? undefined : 'humanizer_limit_reached'
  }
}

/**
 * Deduct one humanizer credit from user's monthly quota
 */
export async function deductHumanizerCredit(
  supabase: SupabaseClient,
  userId: string
): Promise<{ success: boolean; newUsage: number; error?: string }> {
  const { data: profile, error: fetchError } = await supabase
    .from('users')
    .select('humanizer_uses_this_month')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newUsage: 0, error: 'Failed to fetch user profile' }
  }

  const currentUsage = profile.humanizer_uses_this_month || 0
  const newUsage = currentUsage + 1

  const { error: updateError } = await supabase
    .from('users')
    .update({ humanizer_uses_this_month: newUsage })
    .eq('id', userId)

  if (updateError) {
    return { success: false, newUsage: currentUsage, error: 'Failed to update usage' }
  }

  return { success: true, newUsage }
}
