import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/constants'

export function Hero() {
  return (
    <section className="hero-atmosphere relative overflow-hidden text-navy">
      <div className="section-pad relative mx-auto grid max-w-6xl items-center gap-8 py-12 md:gap-10 md:py-16 lg:grid-cols-2 lg:gap-12 lg:py-20 lg:min-h-[min(88vh,48rem)]">
        <div className="relative z-10 max-w-xl">
          <p className="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl md:text-6xl">
            {BRAND.name}
          </p>
          <h1 className="animate-fade-up-delay mt-5 font-display text-3xl font-bold leading-tight text-balance text-navy sm:text-4xl md:text-5xl">
            {BRAND.tagline}
          </h1>
          <p className="animate-fade-up-delay-2 mt-5 text-base leading-relaxed text-muted sm:text-lg">
            {BRAND.supportSentence}
          </p>
          <div className="animate-fade-up-delay-2 mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/book">Book your first pickup</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/how-it-works">See how it works</Link>
            </Button>
          </div>
        </div>

        <div className="animate-fade-up-delay relative flex w-full items-center justify-center">
          <img
            src="/images/freshfold-hero.png"
            alt="FreshFold laundry bag and delivery van with Book, Pickup, Clean, and Deliver steps"
            className="h-auto w-full max-w-full object-contain"
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  )
}
