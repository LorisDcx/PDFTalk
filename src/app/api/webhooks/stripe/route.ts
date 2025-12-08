import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Use service role for webhook - bypasses RLS
// Falls back to anon key if service role not available (will still work with proper RLS policies)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionUpdated(subscription)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription)
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentSucceeded(invoice)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        await handlePaymentFailed(invoice)
        break
      }
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0].price.id

  // Determine plan from price ID
  const plan = getPlanFromPriceId(priceId)

  // Update user
  const { error } = await supabase
    .from('users')
    .update({
      subscription_id: subscriptionId,
      subscription_status: 'active',
      current_plan: plan,
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Failed to update user after checkout:', error)
  }

  // Track event
  await supabase.from('analytics_events').insert({
    event_type: 'subscription_created',
    event_data: { plan, price_id: priceId },
  })
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0].price.id
  const plan = getPlanFromPriceId(priceId)

  let status: 'active' | 'canceled' | 'past_due' = 'active'
  if (subscription.status === 'canceled') status = 'canceled'
  if (subscription.status === 'past_due') status = 'past_due'

  await supabase
    .from('users')
    .update({
      subscription_status: status,
      current_plan: subscription.status === 'canceled' ? null : plan,
    })
    .eq('stripe_customer_id', customerId)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  await supabase
    .from('users')
    .update({
      subscription_id: null,
      subscription_status: null,
      current_plan: null,
    })
    .eq('stripe_customer_id', customerId)

  // Track event
  await supabase.from('analytics_events').insert({
    event_type: 'subscription_canceled',
    event_data: { subscription_id: subscription.id },
  })
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  // Reset monthly usage on successful payment (new billing cycle)
  if (invoice.billing_reason === 'subscription_cycle') {
    await supabase
      .from('users')
      .update({
        pages_processed_this_month: 0,
        docs_processed_this_month: 0,
        usage_reset_at: new Date().toISOString(),
      })
      .eq('stripe_customer_id', customerId)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string

  await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
    })
    .eq('stripe_customer_id', customerId)

  // Track event
  await supabase.from('analytics_events').insert({
    event_type: 'payment_failed',
    event_data: { invoice_id: invoice.id },
  })
}

function getPlanFromPriceId(priceId: string): 'basic' | 'growth' | 'pro' | null {
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) return 'basic'
  if (priceId === process.env.STRIPE_GROWTH_PRICE_ID) return 'growth'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return null
}
