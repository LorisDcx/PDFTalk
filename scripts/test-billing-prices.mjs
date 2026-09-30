import assert from 'node:assert/strict'
import { matchesPublishedMonthlyPrice } from '../src/lib/billing-price.ts'

const monthlyPrice = {
  active: true,
  currency: 'eur',
  unit_amount: 799,
  recurring: { interval: 'month', interval_count: 1 },
  type: 'recurring',
  transform_quantity: null,
}

assert.equal(matchesPublishedMonthlyPrice(monthlyPrice, 7.99), true)
for (const wrongPrice of [
  { ...monthlyPrice, unit_amount: 999 },
  { ...monthlyPrice, currency: 'usd' },
  { ...monthlyPrice, active: false },
  { ...monthlyPrice, recurring: { interval: 'year', interval_count: 1 } },
  { ...monthlyPrice, recurring: { interval: 'month', interval_count: 3 } },
  { ...monthlyPrice, type: 'one_time', recurring: null },
  { ...monthlyPrice, transform_quantity: { divide_by: 2, round: 'up' } },
]) {
  assert.equal(matchesPublishedMonthlyPrice(wrongPrice, 7.99), false)
}

console.log('Stripe prices must match the published monthly EUR plans')
