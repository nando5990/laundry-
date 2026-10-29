import { SectionMedia } from '@/components/marketing/SectionMedia'

const STEPS = [
  {
    step: '01',
    title: 'Schedule pickup',
    body: 'Choose a plan, confirm your address in a service ZIP, and pick a doorstep window that fits your week.',
    image: '/images/laundry-basket.jpg',
    alt: 'Laundry basket ready for scheduled FreshFold pickup',
  },
  {
    step: '02',
    title: 'We wash & finish',
    body: 'Your laundry goes to a contracted processing partner. Preferences for detergent, softener, and fold style are followed.',
    image: '/images/wash-step.jpg',
    alt: 'Detergent measured for a careful home wash cycle',
  },
  {
    step: '03',
    title: 'Folded delivery',
    body: 'Clean, folded laundry returns on your delivery window — Saturday stays yours.',
    image: '/images/towels-stack.jpg',
    alt: 'Neatly folded towels ready for delivery',
  },
]

export function HowItWorksSteps() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="section-pad mx-auto max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
          How it works
        </h2>
        <p className="mt-3 max-w-xl text-muted">
          Three steps. No machines. No folding piles on the couch.
        </p>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {STEPS.map((item) => (
            <li key={item.step}>
              <SectionMedia
                src={item.image}
                alt={item.alt}
                className="aspect-[4/3] mb-5"
              />
              <p className="font-display text-sm font-bold tracking-widest text-teal">
                {item.step}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-navy">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
