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
        <div
          aria-hidden
          className="relative min-h-56 overflow-hidden rounded-2xl bg-gradient-to-br from-petal via-blush to-teal/40"
        >
          <div className="absolute inset-6 rounded-xl border border-white/50 bg-white/25" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="font-display text-2xl font-bold text-navy">
              Doorstep in. Folded out.
            </p>
            <p className="mt-2 text-sm text-navy/70">
              South Shore & Greater Boston fringe
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
