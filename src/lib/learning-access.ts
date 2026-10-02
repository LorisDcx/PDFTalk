import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { checkUserUsage, deductPages } from '@/lib/usage'
import { usageFailureResponse } from '@/lib/usage-response'

export async function checkLearningAccess(pages = 1) {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { response: NextResponse.json({ code: 'unauthorized' }, { status: 401 }) } as const
  const usage = await checkUserUsage(supabase, user.id, pages)
  if (!usage.allowed) return { response: usageFailureResponse(usage) } as const
  return { supabase, user, pages, response: null } as const
}

export async function chargeLearningGeneration(access: Awaited<ReturnType<typeof checkLearningAccess>>) {
  if (access.response) return access.response
  if (access.pages === 0) return null
  const charge = await deductPages(access.supabase, access.user.id, access.pages)
  return charge.success ? null : NextResponse.json({ code: charge.code }, { status: charge.code === 'quota_exceeded' ? 403 : 503 })
}
