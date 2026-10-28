import { REVIEWS_ENABLED } from '@/lib/constants'

/**
 * Mounted in layout but hidden until verified customer reviews exist.
 * Do not show fake testimonials or star ratings.
 */
export function ReviewsSection() {
  if (!REVIEWS_ENABLED) {
    return (
      <section
        className="hidden"
        aria-hidden="true"
        data-reviews-enabled="false"
      >
        {/* Verified reviews placeholder — enable via REVIEWS_ENABLED */}
      </section>
    )
  }

  return (
    <section className="section-pad mx-auto max-w-6xl py-16">
      <h2 className="font-display text-3xl font-bold text-navy">
        Customer reviews
      </h2>
      <p className="mt-3 text-muted">
        Reviews will appear here once verified customer feedback is available.
      </p>
    </section>
  )
}
