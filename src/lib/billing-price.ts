import type Stripe from 'stripe'

type PriceForValidation = Pick<Stripe.Price, 'active' | 'currency' | 'unit_amount' | 'recurring' | 'type' | 'transform_quantity'>

export function matchesPublishedMonthlyPrice(price: PriceForValidation, publishedPriceEuros: number): boolean {
  return price.active &&
    price.type === 'recurring' &&
    price.currency.toLowerCase() === 'eur' &&
    price.unit_amount === Math.round(publishedPriceEuros * 100) &&
    price.recurring?.interval === 'month' &&
    price.recurring.interval_count === 1 &&
    price.transform_quantity == null
}
