export interface PricingPlan {
  id: 'one-time' | 'weekly' | 'express'
  name: string
  ratePerLb: number
  minimum: number
  description: string
  badge?: string
}

export interface SpecialtyItem {
  id: string
  name: string
  note: string
}

/** Fixed-price retail accessories — not laundry-by-weight. */
export interface RetailAddon {
  id: string
  name: string
  price: number
  description: string
  image: string
  imageAlt: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'one-time',
    name: 'One-time wash & fold',
    ratePerLb: 2.99,
    minimum: 89.99,
    description: 'Perfect for catching up. Final charge settled after weight at intake.',
  },
  {
    id: 'weekly',
    name: 'Weekly plan',
    ratePerLb: 2.69,
    minimum: 79.99,
    description: 'Recurring pickup window at a lower per-lb rate. Ideal for busy households.',
    badge: 'Best value',
  },
  {
    id: 'express',
    name: 'Express',
    ratePerLb: 3.29,
    minimum: 99.99,
    description: 'Faster turnaround when you need clean laundry sooner.',
  },
]

export const SPECIALTY_ITEMS: SpecialtyItem[] = [
  { id: 'comforter', name: 'Comforters & duvets', note: 'Request a quote' },
  { id: 'delicates', name: 'Delicates & specialty garments', note: 'Request a quote' },
  { id: 'rugs', name: 'Small rugs', note: 'Request a quote' },
  { id: 'bulk', name: 'Commercial / bulk bags', note: 'Request a quote' },
]

export const RETAIL_ADDONS: RetailAddon[] = [
  {
    id: 'apple-earpods-35mm',
    name: 'Apple iPhone EarPods Wired 3.5mm Headset',
    price: 19.99,
    description:
      'Wired EarPods with 3.5mm plug — a handy accessory add-on while you book laundry service. Fixed retail price; not charged by the pound.',
    image: '/images/apple-earpods-35mm.jpg',
    imageAlt: 'Apple EarPods wired headset with 3.5mm connector',
  },
]

export function getRetailAddon(id: string): RetailAddon | undefined {
  return RETAIL_ADDONS.find((item) => item.id === id)
}

/** First Pickup Special — promotional rules for Phase 1 display. */
export const FIRST_PICKUP_SPECIAL = {
  name: 'First Pickup Special',
  discountPercent: 10,
  maxDiscountDollars: 15,
  rules: [
    'One-time discount for your first completed FreshFold order',
    '10% off wash & fold, up to a maximum of $15',
    'Available only in active service ZIPs',
    'Cannot be combined with other promotions',
    'Applied at settlement after weight (Phase 2+); shown for reference in demo',
  ],
} as const

export const CARE_PROMISE = {
  title: 'Care Promise',
  summary:
    'If something isn’t right with your order, tell us within 48 hours of delivery. We’ll make it right with a rewash or credit where appropriate.',
  // TODO: finalize legal rewash / Care Promise wording with owner/counsel
  bullets: [
    'Professional wash & fold with your preference controls',
    'Report issues within 48 hours of delivery',
    'Rewash or credit evaluated case by case',
    'Final policy language pending legal review before live service',
  ],
} as const

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}
