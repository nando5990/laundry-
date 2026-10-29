import { CalendarCheck, Leaf, Package, Scale, Sparkles } from 'lucide-react'

const ITEMS = [
  {
    icon: Package,
    title: 'Doorstep pickup & delivery',
    body: 'Scheduled windows at your address — no Saturday spent at the laundromat.',
  },
  {
    icon: Leaf,
    title: 'Wash & fold with preferences',
    body: 'Detergent, softener, and fold style controls travel with every order.',
  },
  {
    icon: Sparkles,
    title: 'Specialty care quoted',
    body: 'Comforters, delicates, and bulk items are quoted separately — no surprises.',
  },
  {
    icon: Scale,
    title: 'Transparent pricing rules',
    body: 'Per-lb rates and minimums on-site. Final charge settles after weight.',
  },
  {
    icon: CalendarCheck,
    title: 'First Pickup Special',
    body: '10% off your first order, up to $15 — eligibility rules stated clearly.',
  },
]

export function ValueStack() {
  return (
    <section className="section-pad mx-auto max-w-6xl py-16 md:py-20">
      <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
        What’s included
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Premium convenience for busy households — not the cheapest pound, the
        laundry day you get back.
      </p>
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map((item) => (
          <li key={item.title} className="flex gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-teal/15 text-teal-dark">
              <item.icon className="size-5" aria-hidden />
            </span>
            <div>
              <h3 className="font-display text-lg font-semibold text-navy">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
