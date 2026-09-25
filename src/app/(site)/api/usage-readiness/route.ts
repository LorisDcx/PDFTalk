import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { checkUserUsage } from '@/lib/usage'
import { usageFailureResponse } from '@/lib/usage-response'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return NextResponse.json({ error: 'Connexion requise.' }, { status: 401 })

  const usage = await checkUserUsage(supabase, user.id, 1)
  if (!usage.allowed) return usageFailureResponse(usage)

  return NextResponse.json({ ready: true, pagesRemaining: usage.pagesRemaining }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
