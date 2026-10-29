import { Link } from 'react-router-dom'

import { HowItWorksSteps } from '@/components/marketing/HowItWorksSteps'
import { PageMeta } from '@/components/seo/PageMeta'
import { Button } from '@/components/ui/button'

export function HowItWorksPage() {
  return (
    <>
      <PageMeta
        title="How it works — FreshFold"
        description="Schedule doorstep pickup or partner drop-off where offered, we wash and finish with your preferences, then return folded laundry."
      />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
              FreshFold
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-navy md:text-5xl">
              How FreshFold works
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              An asset-light model: we own your experience end-to-end while
              processing partners handle the wash. Start with doorstep pickup
              or drop off at a partner location where offered — then get
              reliability without laundry-day chaos.
            </p>
          </div>
          <img
            src="/images/freshfold-hero.png"
            alt="FreshFold branded graphic: Book, Pickup, Clean, Deliver with laundry bag and van"
            className="h-auto w-full object-contain"
          />
        </div>
      </section>
      <HowItWorksSteps />
      <section className="section-pad mx-auto max-w-6xl py-14">
        <h2 className="font-display text-2xl font-bold text-navy">
          What you control
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            'Doorstep pickup or partner drop-off (where offered)',
            'Handoff day and window',
            'Detergent and softener preferences',
            'Fold style',
            'Order notes for special handling',
          ].map((item) => (
            <li
              key={item}
              className="border-l-2 border-teal pl-4 text-sm text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
        <Button asChild className="mt-10">
          <Link to="/book">Book a pickup</Link>
        </Button>
      </section>
    </>
  )
}
