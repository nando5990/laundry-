import { Link } from 'react-router-dom'

import { SectionMedia } from '@/components/marketing/SectionMedia'
import { Button } from '@/components/ui/button'
import { DEMO_SERVICE_ZIPS } from '@/demo/zips'

export function ServiceAreasPreview() {
  const cities = [...new Set(DEMO_SERVICE_ZIPS.map((z) => z.city))]

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="section-pad mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-navy md:text-4xl">
            Service areas
          </h2>
          <p className="mt-3 max-w-xl text-muted">
            Launching in Canton and Stoughton, with sample coverage in Brockton
            and Mattapan. Exact ZIP list may still change.
          </p>
          <ul className="mt-8 flex flex-wrap gap-3">
            {cities.map((city) => (
              <li
                key={city}
                className="border-b-2 border-teal px-1 pb-1 font-display text-lg font-semibold text-navy"
              >
                {city}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-8" variant="secondary">
            <Link to="/service-areas">Check your ZIP</Link>
          </Button>
        </div>
        <SectionMedia
          src="/images/home-bedroom.jpg"
          alt="Homey bedroom with fresh linens in the FreshFold service region"
          className="aspect-[5/4]"
        />
      </div>
    </section>
  )
}
