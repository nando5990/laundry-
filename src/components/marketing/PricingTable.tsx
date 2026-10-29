import { Link } from 'react-router-dom'
import { CalendarDays, Gauge, Sparkles, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  formatMoney,
  PRICING_PLANS,
  SPECIALTY_ITEMS,
  type PricingPlan,
} from '@/demo/pricing'
import { cn } from '@/lib/utils'

const PLAN_ICONS: Record<PricingPlan['id'], LucideIcon> = {
  'one-time': Sparkles,
  weekly: CalendarDays,
  express: Zap,
}

export function PricingTable() {
  return (
    <div className="space-y-10">
      <div className="grid items-stretch gap-5 md:grid-cols-3 md:gap-6">
        {PRICING_PLANS.map((plan) => {
          const featured = plan.id === 'weekly'
          const Icon = PLAN_ICONS[plan.id]

          return (
            <div
              key={plan.id}
              className={cn(
                'relative flex flex-col rounded-3xl border bg-white p-6 shadow-[0_10px_28px_rgba(232,121,154,0.10)]',
                featured
                  ? 'border-teal ring-2 ring-teal/25 md:-translate-y-1 md:shadow-[0_16px_40px_rgba(232,121,154,0.18)]'
                  : 'border-border',
              )}
            >
              {plan.badge && (
                <Badge
                  className={cn(
                    'absolute -top-3 right-5',
                    featured && 'bg-teal text-white',
                  )}
                >
                  {plan.badge}
                </Badge>
              )}

              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'inline-flex size-10 shrink-0 items-center justify-center rounded-xl',
                    featured
                      ? 'bg-teal text-white'
                      : 'bg-petal text-teal-dark',
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="font-display text-xl font-bold leading-snug text-navy">
                  {plan.name}
                </h3>
              </div>

              <p className="mt-5 font-display text-4xl font-extrabold tracking-tight text-navy">
                {formatMoney(plan.ratePerLb)}
                <span className="ml-1 text-base font-medium text-muted">
                  /lb
                </span>
              </p>
              <p className="mt-1 text-sm font-medium text-muted">
                Minimum {formatMoney(plan.minimum)}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                {plan.description}
              </p>

              <Button
                asChild
                className="mt-6 w-full"
                variant={featured ? 'default' : 'secondary'}
                size="lg"
              >
                <Link to="/book">
                  {featured ? 'Choose weekly' : 'Select plan'}
                </Link>
              </Button>
            </div>
          )
        })}
      </div>

      <p className="flex items-start gap-2 rounded-2xl border border-border bg-white/80 px-4 py-3 text-sm text-muted">
        <Gauge className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
        <span>
          <span className="font-semibold text-navy">How billing works: </span>
          You book a plan and a pickup or drop-off window now. Final charge
          settles after actual weight at intake — never a surprise add-on for
          the listed wash & fold rate.
        </span>
      </p>

      <div>
        <h3 className="font-display text-2xl font-bold text-navy">
          Specialty items
        </h3>
        <p className="mt-2 text-sm text-muted">
          Quoted separately — request a quote during booking or via contact.
        </p>
        <ul className="mt-6 overflow-hidden rounded-2xl border border-border bg-white divide-y divide-border">
          {SPECIALTY_ITEMS.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-4 py-4 text-sm"
            >
              <span className="font-medium text-navy">{item.name}</span>
              <span className="shrink-0 font-semibold text-teal-dark">
                {item.note}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
