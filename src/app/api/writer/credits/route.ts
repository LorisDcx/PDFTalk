import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { checkHumanizerUsage } from '@/lib/usage'

export async function GET() {
  try {
    const supabase = createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const usage = await checkHumanizerUsage(supabase, user.id)

    return NextResponse.json({
      creditsRemaining: usage.creditsRemaining,
      creditsUsed: usage.creditsUsed,
      creditsLimit: usage.creditsLimit,
      allowed: usage.allowed,
      error: usage.error,
    })
  } catch (error: any) {
    console.error('Writer credits error:', error?.message || error)
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 })
  }
}
