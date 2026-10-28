import { PageMeta } from '@/components/seo/PageMeta'

export function TermsPage() {
  return (
    <>
      <PageMeta
        title="Terms — FreshFold"
        description="FreshFold terms of service draft placeholder. Counsel-approved copy required before live service."
      />
      <section className="section-pad mx-auto max-w-3xl py-14 md:py-20">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-navy">
          Terms of service
        </h1>
        <p className="mt-4 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-dark">
          Draft placeholder — TODO: replace with counsel-approved terms before
          live ordering. Care Promise legal wording is also pending owner review.
        </p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
          <p>
            This website is a Phase 1 marketing and demo experience for
            FreshFold. Booking, commercial, and contact flows do not create
            binding service contracts or charge payment methods.
          </p>
          <p>
            Pricing displayed is for informational purposes. Final charges in
            live service will be settled after actual laundry weight per the
            then-current terms and pricing rules.
          </p>
          <p>
            Service area availability is subject to change. Demo ZIP results are
            sample data and do not guarantee future coverage.
          </p>
        </div>
      </section>
    </>
  )
}
