import { CarePromise } from '@/components/marketing/CarePromise'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { PageMeta } from '@/components/seo/PageMeta'

export function FaqPage() {
  return (
    <>
      <PageMeta
        title="FAQ — FreshFold"
        description="Answers about FreshFold pricing, First Pickup Special, Care Promise, service areas, and the Phase 1 demo."
      />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-20">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-navy md:text-5xl">
          FAQ
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Offer, pricing, Care Promise, and service area questions — including
          what’s demo vs Phase 2.
        </p>
        <div className="mt-10">
          <FaqAccordion />
        </div>
        <div className="mt-14">
          <CarePromise />
        </div>
      </section>
    </>
  )
}
