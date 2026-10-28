import { Link } from 'react-router-dom'

import { BeforeAfter } from '@/components/marketing/BeforeAfter'
import { ExperienceBlock } from '@/components/marketing/ExperienceBlock'
import { FaqAccordion } from '@/components/marketing/FaqAccordion'
import { FinalCta } from '@/components/marketing/FinalCta'
import { Hero } from '@/components/marketing/Hero'
import { HowItWorksSteps } from '@/components/marketing/HowItWorksSteps'
import { OfferCallout } from '@/components/marketing/OfferCallout'
import { PricingTable } from '@/components/marketing/PricingTable'
import { ReviewsSection } from '@/components/marketing/ReviewsSection'
import { ServiceAreasPreview } from '@/components/marketing/ServiceAreasPreview'
import { ValueStack } from '@/components/marketing/ValueStack'
import { ZipChecker } from '@/components/marketing/ZipChecker'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'

export function HomePage() {
  return (
    <>
      <PageMeta
        title="FreshFold — Get Your Laundry Day Back"
        description="FreshFold laundry pickup and delivery for Canton, Stoughton, and select Greater Boston ZIPs. Scheduled pickup, wash & fold, folded delivery."
      />
      <Hero />

      <section className="section-pad mx-auto max-w-6xl -mt-8 relative z-10 pb-4 md:-mt-12">
        <ZipChecker id="home-zip" />
      </section>

      <HowItWorksSteps />
      <ExperienceBlock />

      <section className="bg-off-white py-16 md:py-20">
        <div className="section-pad mx-auto max-w-6xl">
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Per-pound rates with clear minimums. Specialty items quoted
            separately. Final charge settles after weight.
          </p>
          <div className="mt-10">
            <PricingTable />
          </div>
        </div>
      </section>

      <ValueStack />
      <BeforeAfter />
      <OfferCallout />
      <ServiceAreasPreview />
      <ReviewsSection />

      <section className="section-pad mx-auto max-w-6xl py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-bold text-navy">
              Questions, answered
            </h2>
            <p className="mt-2 text-muted">Offer, pricing, Care Promise, and areas.</p>
          </div>
          <Button asChild variant="secondary">
            <Link to="/faq">View all FAQ</Link>
          </Button>
        </div>
        <div className="mt-8">
          <FaqAccordion limit={5} />
        </div>
      </section>

      <FinalCta />
    </>
  )
}
