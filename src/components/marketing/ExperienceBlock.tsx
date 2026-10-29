import { SectionMedia } from '@/components/marketing/SectionMedia'

export function ExperienceBlock() {
  return (
    <section className="section-pad mx-auto max-w-6xl py-16 md:py-20">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            Built for busy Massachusetts households
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            FreshFold owns the customer relationship — scheduling, preferences,
            and care. Washing happens with trusted processing partners; drivers
            handle last-mile pickup and delivery. You get premium convenience
            without the commodity “cheapest pound” feel.
          </p>
        </div>
        <div className="relative">
          <SectionMedia
            src="/images/experience-doorstep.jpg"
            alt="Crisp freshly made bed representing laundry day returned"
            className="aspect-[5/4]"
          />
          <p className="mt-4 font-display text-xl font-bold text-navy">
            Doorstep in. Folded out.
          </p>
          <p className="mt-1 text-sm text-muted">
            South Shore & Greater Boston fringe
          </p>
        </div>
      </div>
    </section>
  )
}
