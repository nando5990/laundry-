import { ZipChecker } from '@/components/marketing/ZipChecker'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { DEMO_SERVICE_ZIPS } from '@/demo/zips'

export function ServiceAreasPage() {
  const byCity = DEMO_SERVICE_ZIPS.reduce<Record<string, typeof DEMO_SERVICE_ZIPS>>(
    (acc, z) => {
      acc[z.city] = acc[z.city] ? [...acc[z.city], z] : [z]
      return acc
    },
    {},
  )

  return (
    <>
      <PageMeta
        title="Service areas — FreshFold"
        description="FreshFold demo service ZIPs for Canton, Stoughton, and sample Brockton and Mattapan coverage in Massachusetts."
      />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-20">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-navy md:text-5xl">
          Service areas
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Working launch geography: Canton and Stoughton, plus selected Brockton
          and Mattapan ZIP codes. Use the checker below — results reflect demo
          data only.
        </p>

        <div className="mt-10">
          <ZipChecker id="areas-zip" />
        </div>

        <div className="mt-14">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-bold text-navy">
              Demo ZIP list
            </h2>
            <Badge variant="demo">Configurable sample data</Badge>
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {Object.entries(byCity).map(([city, zips]) => (
              <div key={city}>
                <h3 className="font-display text-lg font-semibold text-navy">
                  {city}
                </h3>
                <ul className="mt-3 space-y-2">
                  {zips.map((z) => (
                    <li
                      key={z.zip}
                      className="flex items-baseline justify-between gap-4 text-sm"
                    >
                      <span className="font-medium text-dark">{z.zip}</span>
                      <span className="text-muted">{z.note ?? 'Launch ZIP'}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted">
            Exact launch ZIP list is still a Phase 1 polish item. Out-of-area
            checks show an honest unavailable message — no fake waitlist.
          </p>
        </div>
      </section>
    </>
  )
}
