import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'

import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiFetch } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

type OrderRow = {
  orderId: string
  status: string
  customerName: string
  email: string
  zip: string
  serviceDate: string
  windowLabel: string
  serviceName: string
  estimateCents: number
  invoiceCents: number | null
  actualWeightLb: string | null
}

const STATUSES = [
  'scheduled',
  'picked_up',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const

export function AdminPage() {
  const { user, loading, apiOnline } = useAuth()
  const [today, setToday] = useState<OrderRow[]>([])
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [weights, setWeights] = useState<Record<string, string>>({})
  const [flash, setFlash] = useState('')

  async function load() {
    const t = await apiFetch<{ pickups: OrderRow[] }>('/admin/today')
    if (t.ok) setToday(t.data.pickups as unknown as OrderRow[])
    const o = await apiFetch<{ orders: OrderRow[] }>('/admin/orders')
    if (o.ok) setOrders(o.data.orders)
  }

  useEffect(() => {
    if (user?.role === 'admin') void load()
  }, [user])

  if (loading) {
    return <p className="section-pad mx-auto max-w-5xl py-16 text-muted">Loading…</p>
  }
  if (!apiOnline) {
    return (
      <section className="section-pad mx-auto max-w-xl py-16">
        <Badge variant="demo">API offline</Badge>
        <h1 className="mt-3 font-display text-3xl font-bold text-navy">Admin</h1>
        <p className="mt-3 text-muted">Start Postgres + API to use admin tools.</p>
      </section>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/app" replace />

  async function setStatus(orderId: string, status: string) {
    setFlash('')
    const res = await apiFetch(`/admin/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    })
    if (!res.ok) setFlash(res.error)
    else {
      setFlash(`Updated ${orderId.slice(0, 8)}… → ${status}`)
      await load()
    }
  }

  async function recordWeight(orderId: string) {
    setFlash('')
    const lb = Number(weights[orderId])
    if (!lb || lb <= 0) {
      setFlash('Enter a positive weight in lb')
      return
    }
    const res = await apiFetch<{
      order: { invoiceCents: number }
      charge: { reason?: string }
    }>(`/admin/orders/${orderId}/weight`, {
      method: 'POST',
      body: JSON.stringify({ actualWeightLb: lb }),
    })
    if (!res.ok) setFlash(res.error)
    else {
      setFlash(
        `Invoice $${(res.data.order.invoiceCents / 100).toFixed(2)}. ${res.data.charge?.reason ?? ''}`,
      )
      await load()
    }
  }

  return (
    <>
      <PageMeta
        title="Admin — FreshFold"
        description="Today’s pickups, orders, weight, and status updates."
      />
      <section className="section-pad mx-auto max-w-5xl py-12 md:py-16">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-display text-3xl font-extrabold text-navy">
            Admin
          </h1>
          <Badge>Phase 2 MVP</Badge>
        </div>
        <p className="mt-2 text-sm text-muted">
          Server-side pricing & status only. No driver GPS.
        </p>
        <Button asChild className="mt-4" size="sm" variant="secondary">
          <Link to="/app">Customer portal</Link>
        </Button>
        {flash && (
          <p className="mt-4 rounded-md border border-border bg-white px-3 py-2 text-sm">
            {flash}
          </p>
        )}

        <h2 className="mt-10 font-display text-xl font-bold text-navy">
          Today’s pickups
        </h2>
        {today.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No pickups scheduled for today.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {today.map((p) => (
              <li key={p.orderId} className="border-b border-border py-3 text-sm">
                <strong>{p.windowLabel}</strong> — {p.customerName} · {p.zip} ·{' '}
                {p.serviceName} · {p.status}
              </li>
            ))}
          </ul>
        )}

        <h2 className="mt-12 font-display text-xl font-bold text-navy">
          Orders
        </h2>
        <ul className="mt-4 space-y-6">
          {orders.map((o) => (
            <li
              key={o.orderId}
              className="border-l-4 border-navy bg-white py-4 pl-4"
            >
              <p className="font-display font-semibold text-navy">
                {o.serviceDate} {o.windowLabel} · {o.customerName}
              </p>
              <p className="mt-1 text-sm text-muted">
                {o.email} · {o.zip} · {o.serviceName} · status{' '}
                <strong className="text-navy">{o.status}</strong>
              </p>
              <p className="mt-1 text-sm text-muted">
                Est ${(o.estimateCents / 100).toFixed(2)}
                {o.invoiceCents != null &&
                  ` · Invoice $${(o.invoiceCents / 100).toFixed(2)}`}
                {o.actualWeightLb && ` · ${o.actualWeightLb} lb`}
              </p>
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <select
                  className="h-10 rounded-md border border-border bg-white px-2 text-sm"
                  defaultValue={o.status}
                  onChange={(e) => void setStatus(o.orderId, e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Input
                  className="w-28"
                  placeholder="Weight lb"
                  value={weights[o.orderId] ?? ''}
                  onChange={(e) =>
                    setWeights({ ...weights, [o.orderId]: e.target.value })
                  }
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => void recordWeight(o.orderId)}
                >
                  Record weight
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
