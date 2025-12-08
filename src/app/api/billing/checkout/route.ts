import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createCheckoutSession, createStripeCustomer, PLANS, PlanId } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const { planId } = await request.json() as { planId: PlanId }

    if (!planId || !PLANS[planId]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const plan = PLANS[planId]
    
    if (!plan.stripePriceId) {
      return NextResponse.json({ error: 'Plan not configured' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    // Create Stripe customer if doesn't exist
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await createStripeCustomer(user.email!, user.user_metadata?.name)
      customerId = customer.id

      // Save customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Create checkout session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const session = await createCheckoutSession(
      customerId,
      plan.stripePriceId,
      `${appUrl}/billing?success=true`,
      `${appUrl}/billing?canceled=true`
    )

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
