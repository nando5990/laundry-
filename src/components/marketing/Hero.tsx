import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/constants'

export function Hero() {
  return (
    <section className="relative min-h-[min(92vh,54rem)] overflow-hidden text-navy">
      {/* Dominant full-bleed branded visual plane */}
      <img
        src="/images/freshfold-hero.png"
        alt="FreshFold laundry bag and delivery van with Book, Pickup, Clean, and Deliver steps"
        className="absolute inset-0 h-full w-full object-cover object-[center_28%] sm:object-center"
        fetchPriority="high"
      />
      {/* Soft left scrim so Grand Slam copy stays readable over the scene */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-[#fff5f8]/92 via-[#fff5f8]/72 to-[#fff5f8]/35 sm:bg-gradient-to-r sm:from-[#fff5f8] sm:via-[#fff5f8]/88 sm:to-transparent sm:via-35%"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-8 size-56 rounded-full bg-teal/15 blur-3xl"
      />

      <div className="section-pad relative mx-auto flex max-w-6xl flex-col justify-center py-20 md:py-28 lg:min-h-[min(92vh,54rem)]">
        <p className="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-7xl">
          {BRAND.name}
        </p>
        <h1 className="animate-fade-up-delay mt-5 max-w-xl font-display text-3xl font-bold leading-tight text-balance text-navy sm:text-4xl md:text-5xl">
          {BRAND.tagline}
        </h1>
        <p className="animate-fade-up-delay-2 mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg">
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
    </section>
  )
}
