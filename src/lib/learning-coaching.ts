import { createHmac } from 'node:crypto'
import { createAdminClient } from './supabase/admin'
import { getPlanLimits } from './plans'

export function coachingDailyLimit(plan: string | null, trial: boolean) {
  return trial ? 10 : getPlanLimits(plan).includedCoachingPerDay
}

export function coachingSlotId(userId: string, day: string, slot: number, secret: string) {
  const hex = createHmac('sha256', secret).update(`cramdesk-coaching-v1:${userId}:${day}:${slot}`).digest('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}

/** The existing event table's primary key reserves a daily slot atomically,
 * across server instances. Slots count attempts once the AI call starts. */
export async function reserveIncludedCoaching(userId: string, now = new Date()) {
  try {
    const admin = createAdminClient()
    const { data: profile, error } = await admin.from('users').select('current_plan, subscription_status, trial_end_at').eq('id', userId).single()
    if (error || !profile) return { code: 'service_unavailable' } as const
    const trial = profile.subscription_status === 'trialing' && new Date(profile.trial_end_at) > now
    if (!trial && profile.subscription_status !== 'active') return { code: 'subscription_expired' } as const
    const limit = coachingDailyLimit(profile.current_plan, trial)
    const day = now.toISOString().slice(0, 10)
    const resetAt = new Date(`${day}T00:00:00.000Z`); resetAt.setUTCDate(resetAt.getUTCDate() + 1)
    const ids = Array.from({ length: limit }, (_, index) => coachingSlotId(userId, day, index, process.env.SUPABASE_SERVICE_ROLE_KEY!))
    const { data: used, error: readError } = await admin.from('analytics_events').select('id').in('id', ids)
    if (readError) return { code: 'service_unavailable' } as const
    const occupied = new Set((used || []).map(event => event.id))
    for (const id of ids) {
      if (occupied.has(id)) continue
      const { error: insertError } = await admin.from('analytics_events').insert({ id, user_id: userId, event_type: 'learning_coaching_included', event_data: { day } })
      if (!insertError) return { code: null, limit, remaining: Math.max(0, limit - occupied.size - 1), resetAt: resetAt.toISOString() } as const
      if (insertError.code !== '23505') return { code: 'service_unavailable' } as const
      occupied.add(id)
    }
    return { code: 'learning_daily_limit', limit, remaining: 0, resetAt: resetAt.toISOString() } as const
  } catch {
    return { code: 'service_unavailable' } as const
  }
}
