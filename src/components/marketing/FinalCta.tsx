import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function FinalCta() {
  return (
    <section className="hero-atmosphere py-16 text-white md:py-20">
      <div className="section-pad mx-auto max-w-6xl text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">
          Ready to get your laundry day back?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Check your ZIP, pick a plan, and walk through the demo booking flow.
          Payment is Phase 2 — you won’t be charged here.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/book">Book pickup</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/pricing">View pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
