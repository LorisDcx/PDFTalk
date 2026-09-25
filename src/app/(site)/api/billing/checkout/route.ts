import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createCheckoutSession, createStripeCustomer, stripe } from '@/lib/stripe'
import { PLANS, PlanId } from '@/lib/plans'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

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
      .select('stripe_customer_id, subscription_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    const admin = createAdminClient()

    // Create Stripe customer if doesn't exist
    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await createStripeCustomer(user.email!, user.user_metadata?.name)
      customerId = customer.id

      // Save customer ID
      const { error: customerError } = await admin
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
      if (customerError) throw customerError
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Check if user has an active subscription - if so, switch plans instead of creating new
    if (profile.subscription_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(profile.subscription_id)
        
        // Only switch if subscription is active or trialing
        if (subscription.status === 'active' || subscription.status === 'trialing') {
          // Update the subscription to the new plan
          // proration_behavior: 'create_prorations' will credit unused time and charge for new plan
          await stripe.subscriptions.update(profile.subscription_id, {
            items: [{
              id: subscription.items.data[0].id,
              price: plan.stripePriceId,
            }],
            proration_behavior: 'create_prorations', // Credit unused time, charge difference
            billing_cycle_anchor: 'unchanged', // Keep same billing date
          })

          // Update plan in database
          const { error: planError } = await admin
            .from('users')
            .update({ 
              current_plan: planId,
            })
            .eq('id', user.id)
          if (planError) throw planError

          return NextResponse.json({ 
            switched: true, 
            message: 'Plan switched successfully',
            newPlan: planId 
          })
        }
      } catch (subError) {
        // Do not create a second subscription when the existing one could not be checked.
        throw subError
      }
    }

    // Create checkout session for new subscription
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
