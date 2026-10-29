import { SectionMedia } from '@/components/marketing/SectionMedia'
import { Badge } from '@/components/ui/badge'
import { FIRST_PICKUP_SPECIAL } from '@/demo/pricing'

export function OfferCallout() {
  return (
    <section className="border-y border-border bg-white py-14">
      <div className="section-pad mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-3xl font-bold text-navy">
              {FIRST_PICKUP_SPECIAL.name}
            </h2>
            <Badge variant="demo">Promo rules</Badge>
          </div>
          <p className="mt-3 max-w-2xl text-lg text-navy">
            Save {FIRST_PICKUP_SPECIAL.discountPercent}% on your first completed
            order — up to ${FIRST_PICKUP_SPECIAL.maxDiscountDollars}.
          </p>
          <ul className="mt-6 max-w-2xl space-y-2 text-sm text-muted">
            {FIRST_PICKUP_SPECIAL.rules.map((rule) => (
              <li key={rule} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-teal" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
        <SectionMedia
          src="/images/offer-first-pickup.jpg"
          alt="Soft blush towels ready for a first FreshFold pickup"
          className="aspect-[4/3]"
        />
      </div>
    </section>
  )
}
