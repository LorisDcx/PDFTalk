export const PLANS = {
  starter: {
    id: 'starter', name: 'Starter', price: 3.99,
    pagesPerMonth: 300, maxPagesPerDocument: 100,
    maxFlashcardsPerGen: 50, maxQuizQuestions: 20,
    humanizerCredits: 5, documentHistory: 30,
    featureKeys: ['planFeaturePages300', 'planFeatureFlashcards50', 'planFeatureQuiz20', 'planFeatureSlides', 'planFeatureChat', 'planFeatureHistory'],
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID,
  },
  student: {
    id: 'student', name: 'Student', price: 7.99,
    pagesPerMonth: 800, maxPagesPerDocument: 200,
    maxFlashcardsPerGen: 100, maxQuizQuestions: 50,
    humanizerCredits: 10, documentHistory: 100,
    featureKeys: ['planFeaturePages800', 'planFeatureAllStarter', 'planFeatureFlashcards100', 'planFeatureQuiz50', 'planFeaturePriority'],
    stripePriceId: process.env.STRIPE_STUDENT_PRICE_ID,
  },
  graduate: {
    id: 'graduate', name: 'Graduate', price: 12.99,
    pagesPerMonth: 10000, maxPagesPerDocument: 500,
    maxFlashcardsPerGen: 200, maxQuizQuestions: 100,
    humanizerCredits: 20, documentHistory: -1,
    featureKeys: ['planFeaturePagesUnlimited', 'planFeatureAllStudent', 'planFeatureFlashcards200', 'planFeatureQuiz100', 'planFeaturePriorityMax'],
    stripePriceId: process.env.STRIPE_GRADUATE_PRICE_ID,
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlanLimits(planId: PlanId | string | null) {
  const legacy: Record<string, PlanId> = {
    basic: 'starter', growth: 'student', pro: 'graduate', intense: 'graduate',
  }
  const mapped = planId ? legacy[planId] || planId : 'starter'
  return PLANS[mapped as PlanId] || PLANS.starter
}
