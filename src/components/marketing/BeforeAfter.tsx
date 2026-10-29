import { SectionMedia } from '@/components/marketing/SectionMedia'

export function BeforeAfter() {
  return (
    <section className="section-pad mx-auto max-w-6xl py-16 md:py-20">
      <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
        Your weekend, rewritten
      </h2>
      <p className="mt-3 max-w-xl text-muted">
        Swap laundry-day friction for a scheduled doorstep handoff.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <div>
          <SectionMedia
            src="/images/before-laundry-chaos.jpg"
            alt="Overflowing laundry basket waiting at home"
            className="aspect-[5/3] mb-5"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            Before
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-navy">
            Laundry owns the day
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Sorting piles that never shrink</li>
            <li>Machines, detergent runs, waiting rooms</li>
            <li>Folding that eats the evening</li>
          </ul>
        </div>
        <div>
          <SectionMedia
            src="/images/after-freshfold-return.jpg"
            alt="Neatly folded towels returned clean and ready"
            className="aspect-[5/3] mb-5"
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">
            After FreshFold
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-navy">
            Laundry day is gone
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Bags at the door on your window</li>
            <li>Professional wash & fold with your prefs</li>
            <li>Clean laundry returned — weekend free</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
