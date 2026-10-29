import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { formatMoney, RETAIL_ADDONS } from '@/demo/pricing'

export function ShopAccessories() {
  return (
    <section className="space-y-6" aria-labelledby="shop-accessories-heading">
      <div>
        <h3
          id="shop-accessories-heading"
          className="font-display text-2xl font-bold text-navy"
        >
          Shop accessories
        </h3>
        <p className="mt-2 text-sm text-muted">
          Fixed-price retail add-ons — separate from wash & fold by the pound.
        </p>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2">
        {RETAIL_ADDONS.map((item) => (
          <li
            key={item.id}
            className="flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-[0_10px_28px_rgba(232,121,154,0.08)] sm:flex-row"
          >
            <div className="shrink-0 bg-petal/40 p-4 sm:w-40">
              <img
                src={item.image}
                alt={item.imageAlt}
                className="mx-auto h-36 w-auto object-contain sm:h-full sm:max-h-44"
                loading="lazy"
              />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="font-display text-lg font-bold leading-snug text-navy">
                {item.name}
              </p>
              <p className="mt-2 font-display text-2xl font-extrabold text-teal-dark">
                {formatMoney(item.price)}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                {item.description}
              </p>
              <Button asChild className="mt-4 w-full sm:w-auto" variant="secondary">
                <Link to="/book">Add with booking</Link>
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
