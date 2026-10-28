import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DEMO_SERVICE_ZIPS,
  lookupDemoZip,
  normalizeZip,
} from '@/demo/zips'

type Result =
  | { status: 'idle' }
  | { status: 'invalid' }
  | { status: 'available'; city: string; zip: string; note?: string }
  | { status: 'unavailable'; zip: string }

interface ZipCheckerProps {
  compact?: boolean
  id?: string
}

export function ZipChecker({ compact = false, id = 'zip' }: ZipCheckerProps) {
  const [value, setValue] = useState('')
  const [result, setResult] = useState<Result>({ status: 'idle' })

  function check(e: React.FormEvent) {
    e.preventDefault()
    const zip = normalizeZip(value)
    if (zip.length !== 5) {
      setResult({ status: 'invalid' })
      return
    }
    const match = lookupDemoZip(zip)
    if (match) {
      setResult({
        status: 'available',
        city: match.city,
        zip: match.zip,
        note: match.note,
      })
    } else {
      setResult({ status: 'unavailable', zip })
    }
  }

  return (
    <div
      className={
        compact
          ? 'w-full'
          : 'rounded-lg border border-border bg-white p-6 md:p-8'
      }
    >
      {!compact && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <h2 className="font-display text-2xl font-bold text-navy">
            Check your ZIP
          </h2>
          <Badge variant="demo">Demo ZIP list</Badge>
        </div>
      )}
      <p className={`text-sm text-muted ${compact ? 'mb-3' : 'mb-5'}`}>
        Enter a 5-digit ZIP to see if it’s in our Phase 1 demo service area
        (Canton, Stoughton, and sample Brockton / Mattapan ZIPs).
      </p>

      <form
        onSubmit={check}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor={id}>ZIP code</Label>
          <Input
            id={id}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="e.g. 02021"
            value={value}
            onChange={(e) => {
              setValue(normalizeZip(e.target.value))
              setResult({ status: 'idle' })
            }}
            aria-describedby={`${id}-result`}
          />
        </div>
        <Button type="submit" className="sm:mb-0">
          Check availability
        </Button>
      </form>

      <div id={`${id}-result`} className="mt-4 min-h-12" aria-live="polite">
        {result.status === 'invalid' && (
          <p className="text-sm text-warning">Enter a valid 5-digit ZIP code.</p>
        )}
        {result.status === 'available' && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-success">
              Good news — {result.zip} ({result.city}) is in our demo service
              area.
            </p>
            {result.note && (
              <p className="text-xs text-muted">{result.note}.</p>
            )}
            <Button asChild size="sm">
              <Link to="/book">Continue to book</Link>
            </Button>
          </div>
        )}
        {result.status === 'unavailable' && (
          <p className="text-sm text-muted">
            We’re not picking up in {result.zip} yet. FreshFold is launching in
            Canton, Stoughton, and select Brockton / Mattapan ZIPs. Check back
            as we expand — this message is honest, not a waitlist signup.
          </p>
        )}
      </div>

      {!compact && (
        <p className="mt-6 text-xs text-muted">
          Demo ZIPs:{' '}
          {DEMO_SERVICE_ZIPS.map((z) => `${z.zip} (${z.city})`).join(' · ')}
        </p>
      )}
    </div>
  )
}
