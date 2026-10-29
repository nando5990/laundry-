import { CarePromise } from '@/components/marketing/CarePromise'
import { OfferCallout } from '@/components/marketing/OfferCallout'
import { PricingTable } from '@/components/marketing/PricingTable'
import { SectionMedia } from '@/components/marketing/SectionMedia'
import { PageMeta } from '@/components/seo/PageMeta'

export function PricingPage() {
  return (
    <>
      <PageMeta
        title="Pricing — FreshFold"
        description="Wash & fold from $2.69–$3.29/lb with clear minimums. Shop accessories including Apple EarPods at $19.99. Specialty laundry items by quote."
      />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-20">
        <div className="grid items-end gap-8 lg:grid-cols-[1.5fr_0.7fr]">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
              FreshFold
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-navy md:text-5xl">
              Pricing
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Transparent per-pound rates and minimums for doorstep pickup or
              partner drop-off where offered. Final charge is settled after
              actual weight at intake — Phase 2 pricing runs server-side.
            </p>
          </div>
          <SectionMedia
            src="/images/pricing-by-weight.jpg"
            alt="Clean folded towels representing finished FreshFold laundry"
            className="aspect-[4/3]"
          />
        </div>
        <div className="mt-12">
          <PricingTable />
        </div>
      </section>
      <OfferCallout />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-16">
        <CarePromise />
      </section>
    </>
  )
}
