import { CalendarDays, Shirt, Truck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const STEPS: {
  step: string
  title: string
  body: string
  image: string
  alt: string
  Icon: LucideIcon
}[] = [
  {
    step: '01',
    title: 'Schedule handoff',
    body: 'Choose doorstep pickup or partner drop-off where offered, confirm your ZIP, and pick a window that fits your week.',
    image: '/images/how-it-works/step-01-pickup.png',
    alt: 'FreshFold courier scheduling a doorstep laundry pickup',
    Icon: CalendarDays,
  },
  {
    step: '02',
    title: 'We wash & finish',
    body: 'Your laundry goes to a contracted processing partner. Preferences for detergent, softener, and fold style are followed.',
    image: '/images/how-it-works/step-02-wash.png',
    alt: 'FreshFold partner folding towels after wash and finish',
    Icon: Shirt,
  },
  {
    step: '03',
    title: 'Folded delivery',
    body: 'Clean, folded laundry returns on your delivery window — Saturday stays yours.',
    image: '/images/how-it-works/step-03-deliver.png',
    alt: 'FreshFold courier delivering neatly folded laundry',
    Icon: Truck,
  },
]

export function HowItWorksSteps() {
  return (
    <section className="bg-petal/60 py-16 md:py-20">
      <div className="section-pad relative mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
          How it works
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Three steps. Doorstep or drop-off where offered — no folding piles
          on the couch.
        </p>

        {/* Dotted connector path (desktop) */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-[12%] right-[12%] top-[11.5rem] z-0 hidden h-24 md:block"
          viewBox="0 0 1000 100"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M40 70 C 180 10, 320 10, 500 55 S 820 100, 960 40"
            stroke="#E8799A"
            strokeWidth="2.5"
            strokeDasharray="6 10"
            strokeLinecap="round"
            opacity="0.55"
          />
        </svg>

        <ol className="relative z-10 mt-12 grid gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
          {STEPS.map((item) => (
            <li key={item.step} className="flex">
              <article className="flex w-full flex-col overflow-hidden rounded-3xl border border-blush bg-white shadow-[0_10px_30px_rgba(232,121,154,0.12)]">
                <div className="relative bg-petal/40 px-3 pt-3">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="mx-auto h-auto w-full max-h-56 object-contain sm:max-h-64"
                    loading="lazy"
                  />
                  {/* Soft wave into white content */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-white"
                    style={{
                      clipPath:
                        'ellipse(75% 100% at 50% 100%)',
                    }}
                  />
                </div>

                <div className="relative -mt-2 flex flex-1 flex-col px-5 pb-6 pt-1">
                  <span className="mb-3 inline-flex size-10 items-center justify-center rounded-xl bg-teal text-white shadow-sm shadow-teal/25">
                    <item.Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-bold text-navy">
                    <span className="text-teal">{item.step}</span>{' '}
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.body}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
