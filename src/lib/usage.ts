import { SupabaseClient } from '@supabase/supabase-js'
import { getPlanLimits } from './stripe'

export interface UsageCheckResult {
  allowed: boolean
  pagesRemaining: number
  pagesRequired: number
  currentUsage: number
  limit: number
  error?: string
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
  const isInTrial = trialEndAt > now
  const hasActiveSubscription = profile.subscription_status === 'active'

  // If no active subscription and trial expired, deny access
  if (!hasActiveSubscription && !isInTrial) {
    return {
      allowed: false,
      pagesRemaining: 0,
      pagesRequired,
      currentUsage,
      limit: 0,
      error: 'subscription_expired'
    }
  }

  // Get plan limits
  const planLimits = getPlanLimits(profile.current_plan)
  const limit = planLimits.pagesPerMonth

  const pagesRemaining = Math.max(0, limit - currentUsage)
  const allowed = pagesRemaining >= pagesRequired

  return {
    allowed,
    pagesRemaining,
    pagesRequired,
    currentUsage,
    limit,
    error: allowed ? undefined : 'insufficient_pages'
  }
}

/**
 * Deduct pages from user's monthly quota
 */
export async function deductPages(
  supabase: SupabaseClient,
  userId: string,
  pages: number
): Promise<{ success: boolean; newUsage: number; error?: string }> {
  // Get current usage
  const { data: profile, error: fetchError } = await supabase
    .from('users')
    .select('pages_processed_this_month')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, newUsage: 0, error: 'Failed to fetch user profile' }
  }

  const currentUsage = profile.pages_processed_this_month || 0
  const newUsage = currentUsage + pages

  // Update usage
  const { error: updateError } = await supabase
    .from('users')
    .update({ pages_processed_this_month: newUsage })
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
