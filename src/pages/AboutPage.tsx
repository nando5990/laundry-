import { ReviewsSection } from '@/components/marketing/ReviewsSection'
import { PageMeta } from '@/components/seo/PageMeta'

export function AboutPage() {
  return (
    <>
      <PageMeta
        title="About — FreshFold"
        description="FreshFold is an asset-light laundry pickup and delivery brand for Massachusetts households and light commercial accounts."
      />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-20">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-navy md:text-5xl">
          About FreshFold
        </h1>
        <div className="mt-8 max-w-2xl space-y-5 text-muted leading-relaxed">
          <p>
            FreshFold exists so busy people in Massachusetts never have to give
            up a Saturday to laundry. Our Grand Slam Offer is simple:{' '}
            <strong className="font-semibold text-navy">
              Get Your Laundry Day Back.
            </strong>
          </p>
          <p>
            We’re asset-light by design. FreshFold owns the customer
            relationship — brand, scheduling, preferences, and care. Contracted
            processing partners wash and finish. Drivers handle last-mile pickup
            and delivery.
          </p>
          <p>
            We position for premium convenience on the South Shore and Greater
            Boston fringe — not as a commodity “cheapest pound” service.
          </p>
          <p className="text-sm">
            Team bios and verified reviews will appear here when available. This
            Phase 1 site does not invent testimonials or staff profiles.
          </p>
        </div>
      </section>
      <ReviewsSection />
    </>
  )
}
