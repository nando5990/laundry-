import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatMoney,
  PRICING_PLANS,
  SPECIALTY_ITEMS,
} from '@/demo/pricing'

export function PricingTable() {
  return (
    <div className="space-y-12">
      <div className="grid gap-6 md:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className="flex flex-col border-t-2 border-teal bg-white pt-6"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-display text-xl font-bold text-navy">
                {plan.name}
              </h3>
              {plan.badge && <Badge>{plan.badge}</Badge>}
            </div>
            <p className="mt-4 font-display text-4xl font-extrabold text-navy">
              {formatMoney(plan.ratePerLb)}
              <span className="text-base font-medium text-muted">/lb</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Minimum {formatMoney(plan.minimum)}
            </p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
              {plan.description}
            </p>
            <Button asChild className="mt-6 w-full" variant="secondary">
              <Link to="/book">Select plan</Link>
            </Button>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-display text-2xl font-bold text-navy">
          Specialty items
        </h3>
        <p className="mt-2 text-sm text-muted">
          Quoted separately — request a quote during booking or via contact.
        </p>
        <ul className="mt-6 divide-y divide-border border-y border-border">
          {SPECIALTY_ITEMS.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-4 text-sm"
            >
              <span className="font-medium text-navy">{item.name}</span>
              <span className="text-muted">{item.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
