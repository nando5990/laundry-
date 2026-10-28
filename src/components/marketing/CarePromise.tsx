import { Badge } from '@/components/ui/badge'
import { CARE_PROMISE } from '@/demo/pricing'

export function CarePromise() {
  return (
    <div className="border-l-4 border-teal bg-white py-6 pl-6 pr-4">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-xl font-bold text-navy">
          {CARE_PROMISE.title}
        </h3>
        <Badge variant="muted">Legal copy TBD</Badge>
      </div>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {CARE_PROMISE.summary}
      </p>
      <ul className="mt-4 space-y-2 text-sm text-muted">
        {CARE_PROMISE.bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-navy" />
            {b}
          </li>
        ))}
      </ul>
    </div>
  )
}
