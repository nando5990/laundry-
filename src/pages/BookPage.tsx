import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  BOOKING_STEPS,
  type BookingDraft,
  type BookingStep,
  DEMO_PICKUP_DAYS,
  DEMO_PICKUP_WINDOWS,
  DETERGENT_OPTIONS,
  EMPTY_BOOKING,
  FOLD_OPTIONS,
  SOFTENER_OPTIONS,
} from '@/demo/booking'
import {
  FIRST_PICKUP_SPECIAL,
  formatMoney,
  PRICING_PLANS,
} from '@/demo/pricing'
import { isDemoServiceZip, lookupDemoZip, normalizeZip } from '@/demo/zips'
import { cn } from '@/lib/utils'

function stepIndex(step: BookingStep) {
  return BOOKING_STEPS.findIndex((s) => s.id === step)
}

export function BookPage() {
  const [step, setStep] = useState<BookingStep>('service')
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_BOOKING)
  const [errors, setErrors] = useState<string[]>([])

  const plan = useMemo(
    () => PRICING_PLANS.find((p) => p.id === draft.planId)!,
    [draft.planId],
  )

  const zipMatch = lookupDemoZip(draft.zip)

  function update<K extends keyof BookingDraft>(key: K, value: BookingDraft[K]) {
    setDraft((d) => ({ ...d, [key]: value }))
    setErrors([])
  }

  function validateCurrent(): string[] {
    switch (step) {
      case 'service':
        return draft.planId ? [] : ['Choose a service plan.']
      case 'address': {
        const next: string[] = []
        if (!draft.fullName.trim()) next.push('Name is required.')
        if (!draft.email.trim()) next.push('Email is required.')
        if (!draft.street.trim()) next.push('Street address is required.')
        if (!draft.city.trim()) next.push('City is required.')
        if (normalizeZip(draft.zip).length !== 5) next.push('Enter a 5-digit ZIP.')
        else if (!isDemoServiceZip(draft.zip))
          next.push(
            'That ZIP is outside our demo service area. Try a Canton, Stoughton, or sample Brockton/Mattapan ZIP.',
          )
        return next
      }
      case 'schedule': {
        const next: string[] = []
        if (!draft.pickupDay) next.push('Choose a pickup day.')
        if (!draft.pickupWindow) next.push('Choose a pickup window.')
        return next
      }
      default:
        return []
    }
  }

  function goNext() {
    const nextErrors = validateCurrent()
    if (nextErrors.length) {
      setErrors(nextErrors)
      return
    }
    const i = stepIndex(step)
    if (i < BOOKING_STEPS.length - 1) {
      setStep(BOOKING_STEPS[i + 1].id)
      setErrors([])
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function goBack() {
    const i = stepIndex(step)
    if (i > 0) {
      setStep(BOOKING_STEPS[i - 1].id)
      setErrors([])
    }
  }

  return (
    <>
      <PageMeta
        title="Book pickup — FreshFold"
        description="Demo booking flow for FreshFold laundry pickup. Multi-step through review; payment is Phase 2 and does not charge."
      />
      <section className="section-pad mx-auto max-w-3xl py-10 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
            FreshFold
          </p>
          <Badge variant="demo">Demo booking</Badge>
        </div>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-navy md:text-4xl">
          Book a pickup
        </h1>
        <p className="mt-3 text-muted">
          Walk through service, address, schedule, preferences, and review.
          Payment is marked Phase 2 and will not charge a card.
        </p>

        <ol className="mt-8 flex flex-wrap gap-2">
          {BOOKING_STEPS.map((s, i) => {
            const active = s.id === step
            const done = stepIndex(step) > i
            return (
              <li
                key={s.id}
                className={cn(
                  'rounded-md px-2.5 py-1 text-xs font-semibold',
                  active && 'bg-teal text-white',
                  done && !active && 'bg-navy/10 text-navy',
                  !active && !done && 'bg-off-white text-muted',
                )}
              >
                {i + 1}. {s.label}
              </li>
            )
          })}
        </ol>

        {errors.length > 0 && (
          <ul
            className="mt-6 space-y-1 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-dark"
            role="alert"
          >
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}

        <div className="mt-8 space-y-6">
          {step === 'service' && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">
                Choose your service
              </h2>
              <div className="space-y-3">
                {PRICING_PLANS.map((p) => (
                  <label
                    key={p.id}
                    className={cn(
                      'flex cursor-pointer gap-4 border-l-4 p-4 transition-colors',
                      draft.planId === p.id
                        ? 'border-teal bg-teal/5'
                        : 'border-border bg-white hover:bg-off-white',
                    )}
                  >
                    <input
                      type="radio"
                      name="plan"
                      className="mt-1"
                      checked={draft.planId === p.id}
                      onChange={() => update('planId', p.id)}
                    />
                    <span>
                      <span className="block font-display font-semibold text-navy">
                        {p.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {formatMoney(p.ratePerLb)}/lb · min{' '}
                        {formatMoney(p.minimum)}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bags">Estimated bags</Label>
                <Select
                  value={draft.estimatedBags}
                  onValueChange={(v) => update('estimatedBags', v)}
                >
                  <SelectTrigger id="bags">
                    <SelectValue placeholder="Bags" />
                  </SelectTrigger>
                  <SelectContent>
                    {['1', '2', '3', '4', '5+'].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n} bag{n === '1' ? '' : 's'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted">
                  Estimate only — final charge uses actual weight.
                </p>
              </div>
              <label className="flex items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={draft.applyFirstPickup}
                  onChange={(e) =>
                    update('applyFirstPickup', e.target.checked)
                  }
                />
                <span>
                  Apply {FIRST_PICKUP_SPECIAL.name} (
                  {FIRST_PICKUP_SPECIAL.discountPercent}% up to $
                  {FIRST_PICKUP_SPECIAL.maxDiscountDollars}) — shown for
                  reference in demo; not charged here.
                </span>
              </label>
            </div>
          )}

          {step === 'address' && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">
                Pickup address
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={draft.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={draft.email}
                    onChange={(e) => update('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={draft.phone}
                    onChange={(e) => update('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    value={draft.street}
                    onChange={(e) => update('street', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit (optional)</Label>
                  <Input
                    id="unit"
                    value={draft.unit}
                    onChange={(e) => update('unit', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={draft.city}
                    onChange={(e) => update('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="book-zip">ZIP</Label>
                  <Input
                    id="book-zip"
                    inputMode="numeric"
                    maxLength={5}
                    value={draft.zip}
                    onChange={(e) =>
                      update('zip', normalizeZip(e.target.value))
                    }
                  />
                  {zipMatch && (
                    <p className="text-xs text-success">
                      {zipMatch.zip} is in demo service area ({zipMatch.city}
                      ).
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 'schedule' && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">
                Pickup schedule
              </h2>
              <p className="text-sm text-muted">
                Demo windows only — live capacity calendars arrive in Phase 2.
                No GPS or live driver tracking.
              </p>
              <div className="space-y-2">
                <Label>Pickup day</Label>
                <Select
                  value={draft.pickupDay}
                  onValueChange={(v) => update('pickupDay', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_PICKUP_DAYS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pickup window</Label>
                <Select
                  value={draft.pickupWindow}
                  onValueChange={(v) => update('pickupWindow', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select window" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEMO_PICKUP_WINDOWS.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 'preferences' && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">
                Laundry preferences
              </h2>
              <div className="space-y-2">
                <Label>Detergent</Label>
                <Select
                  value={draft.detergent}
                  onValueChange={(v) => update('detergent', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DETERGENT_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Softener</Label>
                <Select
                  value={draft.softener}
                  onValueChange={(v) => update('softener', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SOFTENER_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fold style</Label>
                <Select
                  value={draft.foldStyle}
                  onValueChange={(v) => update('foldStyle', v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FOLD_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Gate code, specialty items to quote, etc."
                  value={draft.notes}
                  onChange={(e) => update('notes', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold text-navy">
                Review your demo booking
              </h2>
              <dl className="divide-y divide-border border-y border-border text-sm">
                {[
                  ['Plan', plan.name],
                  ['Rate', `${formatMoney(plan.ratePerLb)}/lb · min ${formatMoney(plan.minimum)}`],
                  ['Bags (est.)', draft.estimatedBags],
                  [
                    'First Pickup Special',
                    draft.applyFirstPickup
                      ? `${FIRST_PICKUP_SPECIAL.discountPercent}% up to $${FIRST_PICKUP_SPECIAL.maxDiscountDollars} (demo reference)`
                      : 'Not applied',
                  ],
                  ['Name', draft.fullName],
                  ['Email', draft.email],
                  ['Phone', draft.phone || '—'],
                  [
                    'Address',
                    `${draft.street}${draft.unit ? `, ${draft.unit}` : ''}, ${draft.city} ${draft.zip}`,
                  ],
                  ['Pickup', `${draft.pickupDay}, ${draft.pickupWindow}`],
                  [
                    'Preferences',
                    `${DETERGENT_OPTIONS.find((o) => o.value === draft.detergent)?.label}, ${SOFTENER_OPTIONS.find((o) => o.value === draft.softener)?.label}, ${FOLD_OPTIONS.find((o) => o.value === draft.foldStyle)?.label}`,
                  ],
                  ['Notes', draft.notes || '—'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid grid-cols-[8rem_1fr] gap-4 py-3 sm:grid-cols-[10rem_1fr]"
                  >
                    <dt className="font-medium text-muted">{label}</dt>
                    <dd className="text-navy">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-muted">
                Specialty items: request a quote — not auto-priced in Phase 1.
              </p>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-xl font-bold text-navy">
                  Payment
                </h2>
                <Badge variant="demo">Phase 2 demo — do not charge</Badge>
              </div>
              <div className="rounded-md border border-warning/40 bg-warning/10 p-5">
                <p className="font-medium text-navy">
                  No payment is collected on this site.
                </p>
                <p className="mt-2 text-sm text-muted">
                  Live Stripe SetupIntent / settlement-after-weight arrives in
                  Phase 2. Card fields below are disabled placeholders so you
                  can see the flow without any charge risk.
                </p>
              </div>
              <div className="space-y-3 opacity-60">
                <div className="space-y-2">
                  <Label>Card number</Label>
                  <Input disabled placeholder="•••• •••• •••• ••••" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Expiry</Label>
                    <Input disabled placeholder="MM / YY" />
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <Input disabled placeholder="•••" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-success">
                Demo complete — your review details stayed in this browser
                session only. Nothing was charged or emailed.
              </p>
              <Button asChild variant="secondary">
                <Link to="/">Back to home</Link>
              </Button>
            </div>
          )}
        </div>

        {step !== 'payment' && (
          <div className="mt-10 flex flex-wrap justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={goBack}
              disabled={step === 'service'}
            >
              Back
            </Button>
            <Button type="button" onClick={goNext}>
              {step === 'review' ? 'Continue to payment demo' : 'Continue'}
            </Button>
          </div>
        )}
      </section>
    </>
  )
}
