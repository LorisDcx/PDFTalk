import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createCustomerPortalSession } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    // Create portal session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCustomerPortalSession(
      profile.stripe_customer_id,
      `${appUrl}/billing`
    )

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Portal error:', error)
    return NextResponse.json({ error: 'Failed to create portal session' }, { status: 500 })
  }
}
