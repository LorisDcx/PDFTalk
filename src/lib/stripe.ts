import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 3.99,
    pagesPerMonth: 300,
    maxPagesPerDocument: 50,
    documentHistory: 30,
    // Feature keys for i18n translation
    featureKeys: [
      'planFeaturePages300',
      'planFeatureFlashcards',
      'planFeatureQuiz',
      'planFeatureSlides',
      'planFeatureChat',
      'planFeatureHistory',
    ],
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  student: {
    id: 'student',
    name: 'Student',
    price: 7.99,
    pagesPerMonth: 800,
    maxPagesPerDocument: 100,
    documentHistory: 100,
    featureKeys: [
      'planFeaturePages800',
      'planFeatureAllStarter',
      'planFeatureDetailedGen',
      'planFeaturePriority',
      'planFeatureHistoryExtended',
    ],
    stripePriceId: process.env.STRIPE_STUDENT_PRICE_ID,
  },
  intense: {
    id: 'intense',
    name: 'Intense',
    price: 12.99,
    pagesPerMonth: 99999, // "unlimited" fair use
    maxPagesPerDocument: 200,
    documentHistory: -1, // unlimited
    featureKeys: [
      'planFeaturePagesUnlimited',
      'planFeatureAllStudent',
      'planFeatureMaxPages200',
      'planFeatureAdvancedGen',
      'planFeaturePriorityMax',
    ],
    stripePriceId: process.env.STRIPE_INTENSE_PRICE_ID,
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlanLimits(planId: PlanId | string | null) {
  if (!planId) return PLANS.starter // Default to starter for trial
  
  // Map old plan IDs to new ones for backwards compatibility
  const oldToNewPlanMap: Record<string, PlanId> = {
    'basic': 'starter',
    'growth': 'student', 
    'pro': 'intense',
    'graduate': 'intense',
  }
  
  const mappedPlanId = oldToNewPlanMap[planId] || planId
  return PLANS[mappedPlanId as PlanId] || PLANS.starter
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
