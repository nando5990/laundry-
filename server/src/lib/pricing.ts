/**
 * Server-side pricing only. Client totals are never trusted.
 * Estimate when weight unknown: MAX(estimatedWeight × rate, minimum).
 * Settlement after actual weight uses the same formula.
 */
export function priceCents(params: {
  weightLb: number
  ratePerLb: number
  minimumCents: number
}): number {
  const raw = Math.round(params.weightLb * params.ratePerLb * 100)
  return Math.max(raw, params.minimumCents)
}

export function applyPercentDiscount(params: {
  subtotalCents: number
  percentOff: number
  maxDiscountCents: number
}): { discountCents: number; totalCents: number } {
  const uncapped = Math.round(
    (params.subtotalCents * params.percentOff) / 100,
  )
  const discountCents = Math.min(uncapped, params.maxDiscountCents)
  return {
    discountCents,
    totalCents: Math.max(0, params.subtotalCents - discountCents),
  }
}

/** Rough bag → lb estimate for booking quotes when weight is unknown. */
export function estimateWeightFromBags(bags: number): number {
  const n = Math.max(1, bags)
  return n * 15
}
