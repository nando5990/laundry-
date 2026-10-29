import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { BRAND } from '@/lib/constants'

export function Hero() {
  return (
    <section className="hero-atmosphere relative min-h-[min(92vh,52rem)] overflow-hidden text-navy">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 top-16 size-72 rounded-full bg-blush/80 blur-3xl animate-soft-pulse md:size-[26rem]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-8 size-56 rounded-full bg-teal/20 blur-3xl"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#fff5f8]/85" />
        <div className="absolute inset-8 rounded-[2rem] border border-white/70 bg-white/40 backdrop-blur-[2px]">
          <div className="absolute left-10 top-12 h-40 w-56 animate-float rounded-2xl bg-gradient-to-br from-white to-blush shadow-sm" />
          <div className="absolute left-28 top-36 h-36 w-52 rotate-[4deg] rounded-2xl bg-gradient-to-br from-teal/45 to-petal shadow-sm" />
          <div className="absolute bottom-16 left-16 right-16 h-24 rounded-full bg-teal/20 blur-xl" />
        </div>
      </div>

      <div className="section-pad relative mx-auto flex max-w-6xl flex-col justify-center py-20 md:py-28 lg:min-h-[min(92vh,52rem)]">
        <p className="animate-fade-up font-display text-4xl font-extrabold tracking-tight text-navy sm:text-5xl md:text-6xl lg:text-7xl">
          {BRAND.name}
        </p>
        <h1 className="animate-fade-up-delay mt-5 max-w-2xl font-display text-3xl font-bold leading-tight text-balance text-navy sm:text-4xl md:text-5xl">
          {BRAND.tagline}
        </h1>
        <p className="animate-fade-up-delay-2 mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
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
