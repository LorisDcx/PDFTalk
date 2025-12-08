import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 3.99,
    pagesPerMonth: 150,
    maxPagesPerDocument: 20,
    documentHistory: 30,
    features: [
      'Up to 150 pages/month',
      'Max 20 pages per document',
      'Summary & Key Clauses',
      'Risks & Questions',
      'Easy Reading Mode',
      '30 documents history',
    ],
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    price: 12.99,
    pagesPerMonth: 600,
    maxPagesPerDocument: 60,
    documentHistory: 200,
    features: [
      'Up to 600 pages/month',
      'Max 60 pages per document',
      'Everything in Basic',
      'Multi-document comparison (2 PDFs)',
      'Priority processing',
      'Custom prompt presets',
      '200 documents history',
    ],
    stripePriceId: process.env.STRIPE_GROWTH_PRICE_ID,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 20.99,
    pagesPerMonth: 1500,
    maxPagesPerDocument: 100,
    documentHistory: -1, // unlimited
    features: [
      'Up to 1,500 pages/month',
      'Max 100 pages per document',
      'Everything in Growth',
      'Multi-document comparison (3 PDFs)',
      'Team access (5 seats)',
      'API access',
      'Priority support',
      'Unlimited history',
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlanLimits(planId: PlanId | null) {
  if (!planId) return PLANS.basic // Default to basic for trial
  return PLANS[planId] || PLANS.basic
}

export async function createCheckoutSession(
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session
}

export async function createStripeCustomer(email: string, name?: string) {
  const customer = await stripe.customers.create({
    email,
    name,
  })

  return customer
}
