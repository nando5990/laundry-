import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

type BookingRow = {
  booking: {
    id: string
    estimateCents: number
    status: string
    estimatedBags: number
  }
  order: {
    id: string
    status: string
    invoiceCents: number | null
    actualWeightLb: string | null
  }
  serviceName: string
  windowDate: string
  windowLabel: string
  street: string
  city: string
  zip: string
}

export function AppPortalPage() {
  const { user, loading, apiOnline } = useAuth()
  const [rows, setRows] = useState<BookingRow[]>([])
  const [prefs, setPrefs] = useState({
    detergent: 'hypoallergenic',
    softener: 'none',
    foldStyle: 'standard',
    notes: '',
  })
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    void (async () => {
      const list = await apiFetch<{ bookings: BookingRow[] }>('/bookings/mine')
      if (list.ok) setRows(list.data.bookings)
      const p = await apiFetch<{
        preferences: typeof prefs
      }>('/portal/preferences')
      if (p.ok) {
        setPrefs({
          detergent: p.data.preferences.detergent,
          softener: p.data.preferences.softener,
          foldStyle: p.data.preferences.foldStyle,
          notes: p.data.preferences.notes ?? '',
        })
      }
    })()
  }, [user])

  if (loading) {
    return <p className="section-pad mx-auto max-w-4xl py-16 text-muted">Loading…</p>
  }
  if (!apiOnline) {
    return (
      <section className="section-pad mx-auto max-w-xl py-16">
        <Badge variant="demo">API offline</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy">
          Customer portal
        </h1>
        <p className="mt-3 text-muted">
          Start the Phase 2 API (`npm run api`) with Postgres migrated, then
          refresh. Marketing pages still work in demo mode.
        </p>
        <Button asChild className="mt-6" variant="secondary">
          <Link to="/book">Demo book flow</Link>
        </Button>
      </section>
    )
  }
  if (!user) return <Navigate to="/login" replace />

  async function savePrefs(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setError('')
    const res = await apiFetch('/portal/preferences', {
      method: 'PUT',
      body: JSON.stringify(prefs),
    })
    if (!res.ok) setError(res.error)
    else setMsg('Preferences saved.')
  }

  const upcoming = rows.filter((r) =>
    ['scheduled', 'picked_up', 'processing', 'out_for_delivery'].includes(
      r.order.status,
    ),
  )
  const history = rows.filter((r) =>
    ['delivered', 'cancelled'].includes(r.order.status),
  )

  return (
    <>
      <PageMeta
        title="My FreshFold — portal"
        description="Upcoming pickups, order history, and laundry preferences."
      />
      <section className="section-pad mx-auto max-w-4xl py-12 md:py-16">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">
          Hi, {user.fullName}
        </h1>
        <p className="mt-2 text-sm text-muted">{user.email}</p>
        {user.role === 'admin' && (
          <Button asChild className="mt-4" size="sm" variant="secondary">
            <Link to="/admin">Open admin</Link>
          </Button>
        )}

        <div className="mt-10">
          <h2 className="font-display text-xl font-bold text-navy">
            Upcoming pickup
          </h2>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-muted">
              No upcoming orders.{' '}
              <Link to="/book" className="text-teal font-semibold">
                Book a pickup
              </Link>
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {upcoming.map((r) => (
                <li
                  key={r.order.id}
                  className="border-l-4 border-teal bg-white py-4 pl-4"
                >
                  <p className="font-display font-semibold text-navy">
                    {r.windowDate} · {r.windowLabel}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {r.serviceName} · {r.street}, {r.city} {r.zip}
                  </p>
                  <p className="mt-1 text-sm">
                    Status:{' '}
                    <span className="font-medium text-navy">
                      {r.order.status}
                    </span>
                    {' · '}
                    Estimate ${(r.booking.estimateCents / 100).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-12">
          <h2 className="font-display text-xl font-bold text-navy">
            Order history
          </h2>
          {history.length === 0 ? (
            <p className="mt-3 text-sm text-muted">No completed orders yet.</p>
          ) : (
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {history.map((r) => (
                <li key={r.order.id} className="py-3 text-sm">
                  <span className="font-medium text-navy">{r.windowDate}</span>
                  {' — '}
                  {r.serviceName} · {r.order.status}
                  {r.order.invoiceCents != null &&
                    ` · $${(r.order.invoiceCents / 100).toFixed(2)}`}
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={savePrefs} className="mt-12 max-w-md space-y-3">
          <h2 className="font-display text-xl font-bold text-navy">
            Preferences
          </h2>
          <div className="space-y-2">
            <Label>Detergent</Label>
            <Input
              value={prefs.detergent}
              onChange={(e) =>
                setPrefs({ ...prefs, detergent: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Softener</Label>
            <Input
              value={prefs.softener}
              onChange={(e) => setPrefs({ ...prefs, softener: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Fold style</Label>
            <Input
              value={prefs.foldStyle}
              onChange={(e) =>
                setPrefs({ ...prefs, foldStyle: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={prefs.notes}
              onChange={(e) => setPrefs({ ...prefs, notes: e.target.value })}
            />
          </div>
          <Button type="submit">Save preferences</Button>
          {msg && <p className="text-sm text-success">{msg}</p>}
          {error && <p className="text-sm text-warning">{error}</p>}
        </form>
      </section>
    </>
  )
}
