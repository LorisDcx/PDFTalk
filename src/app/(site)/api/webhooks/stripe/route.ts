import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

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
  const supabase = createAdminClient()
  const customerId = session.customer as string
  const subscriptionId = session.subscription as string

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const priceId = subscription.items.data[0].price.id

  // Determine plan from price ID
  const plan = getPlanFromPriceId(priceId)
  if (!plan) throw new Error('Unknown Stripe price')

  // Update user - reset usage counters on new subscription
  const { error } = await supabase
    .from('users')
    .update({
      subscription_id: subscriptionId,
      subscription_status: subscription.status === 'trialing' ? 'trialing' : 'active',
      ...(subscription.trial_end ? { trial_end_at: new Date(subscription.trial_end * 1000).toISOString() } : {}),
      current_plan: plan,
      // Reset usage on new subscription
      pages_processed_this_month: 0,
      docs_processed_this_month: 0,
      usage_reset_at: new Date().toISOString(),
    } as any)
    .eq('stripe_customer_id', customerId)
    .select()

  if (error) throw error

  // Track event
  await supabase.from('analytics_events').insert({
    event_type: 'subscription_created',
    event_data: { plan, price_id: priceId, customer_id: customerId },
  } as any)
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()
  const customerId = subscription.customer as string
  const priceId = subscription.items.data[0].price.id
  const plan = getPlanFromPriceId(priceId)
  if (!plan) throw new Error('Unknown Stripe price')

  const status: 'active' | 'canceled' | 'past_due' | 'trialing' =
    subscription.status === 'active' ? 'active' :
    subscription.status === 'trialing' ? 'trialing' :
    subscription.status === 'canceled' ? 'canceled' : 'past_due'

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: status,
      current_plan: subscription.status === 'canceled' ? null : plan,
      ...(subscription.trial_end ? { trial_end_at: new Date(subscription.trial_end * 1000).toISOString() } : {}),
    } as any)
    .eq('stripe_customer_id', customerId)
  if (error) throw error
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = createAdminClient()
  const customerId = subscription.customer as string

  const { error } = await supabase
    .from('users')
    .update({
      subscription_id: null,
      subscription_status: null,
      current_plan: null,
    } as any)
    .eq('stripe_customer_id', customerId)
  if (error) throw error

  // Track event
  await supabase.from('analytics_events').insert({
    event_type: 'subscription_canceled',
    event_data: { subscription_id: subscription.id },
  } as any)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const supabase = createAdminClient()
  const customerId = invoice.customer as string

  // Reset monthly usage on successful payment (new billing cycle)
  if (invoice.billing_reason === 'subscription_cycle') {
    const { error } = await supabase
      .from('users')
      .update({
        pages_processed_this_month: 0,
        docs_processed_this_month: 0,
        usage_reset_at: new Date().toISOString(),
      } as any)
      .eq('stripe_customer_id', customerId)
    if (error) throw error
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = createAdminClient()
  const customerId = invoice.customer as string

  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'past_due',
    } as any)
    .eq('stripe_customer_id', customerId)
  if (error) throw error

  // Track event
  await supabase.from('analytics_events').insert({
    event_type: 'payment_failed',
    event_data: { invoice_id: invoice.id },
  } as any)
}

function getPlanFromPriceId(priceId: string): 'starter' | 'student' | 'graduate' | null {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_STUDENT_PRICE_ID) return 'student'
  if (priceId === process.env.STRIPE_GRADUATE_PRICE_ID) return 'graduate'
  // Legacy mapping for older env vars (basic/growth/pro or intense)
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_GROWTH_PRICE_ID) return 'student'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'graduate'
  return null
}
