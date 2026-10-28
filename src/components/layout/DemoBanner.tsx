import { DEMO_MODE } from '@/lib/constants'

export function DemoBanner() {
  if (!DEMO_MODE) return null

  return (
    <div className="bg-navy text-center text-xs font-medium tracking-wide text-white/90 sm:text-sm">
      <p className="section-pad mx-auto max-w-6xl py-2">
        Demo mode — sample data only. No live payments, messaging, or backend
        submissions.
      </p>
    </div>
  )
}
