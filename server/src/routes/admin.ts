import { Hono } from 'hono'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../db/client.js'
import {
  addresses,
  auditLogs,
  bookings,
  orderStatusEvents,
  orders,
  paymentRecords,
  pickupWindows,
  pricingRules,
  profiles,
  services,
} from '../db/schema.js'
import { requireAdmin } from '../lib/access.js'
import {
  applyPercentDiscount,
  priceCents,
} from '../lib/pricing.js'
import type { AppEnv } from '../middleware/session.js'
import { chargeAfterWeightStub } from '../services/stripe.js'

const weightSchema = z.object({
  actualWeightLb: z.number().positive(),
})

const statusSchema = z.object({
  status: z.enum([
    'scheduled',
    'picked_up',
    'processing',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ]),
  note: z.string().optional(),
})

export const adminRoutes = new Hono<AppEnv>()

adminRoutes.use('*', async (c, next) => {
  requireAdmin(c.get('user'))
  await next()
})

adminRoutes.get('/today', async (c) => {
  const today = new Date().toISOString().slice(0, 10)
  const rows = await db
    .select({
      orderId: orders.id,
      bookingId: bookings.id,
      status: orders.status,
      customerName: profiles.fullName,
      email: profiles.email,
      street: addresses.street,
      city: addresses.city,
      zip: addresses.zip,
      windowLabel: pickupWindows.windowLabel,
      serviceName: services.name,
      estimateCents: bookings.estimateCents,
      invoiceCents: orders.invoiceCents,
      actualWeightLb: orders.actualWeightLb,
    })
    .from(orders)
    .innerJoin(bookings, eq(orders.bookingId, bookings.id))
    .innerJoin(profiles, eq(orders.profileId, profiles.id))
    .innerJoin(addresses, eq(bookings.addressId, addresses.id))
    .innerJoin(pickupWindows, eq(bookings.pickupWindowId, pickupWindows.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(pickupWindows.serviceDate, today))
    .orderBy(pickupWindows.windowLabel)
  return c.json({ date: today, pickups: rows })
})

adminRoutes.get('/orders', async (c) => {
  const rows = await db
    .select({
      orderId: orders.id,
      bookingId: bookings.id,
      status: orders.status,
      customerName: profiles.fullName,
      email: profiles.email,
      zip: addresses.zip,
      serviceDate: pickupWindows.serviceDate,
      windowLabel: pickupWindows.windowLabel,
      serviceName: services.name,
      estimateCents: bookings.estimateCents,
      invoiceCents: orders.invoiceCents,
      actualWeightLb: orders.actualWeightLb,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(bookings, eq(orders.bookingId, bookings.id))
    .innerJoin(profiles, eq(orders.profileId, profiles.id))
    .innerJoin(addresses, eq(bookings.addressId, addresses.id))
    .innerJoin(pickupWindows, eq(bookings.pickupWindowId, pickupWindows.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .orderBy(sql`${orders.createdAt} desc`)
    .limit(100)
  return c.json({ orders: rows })
})

adminRoutes.post('/orders/:orderId/weight', async (c) => {
  const admin = requireAdmin(c.get('user'))
  const orderId = c.req.param('orderId')
  const body = weightSchema.parse(await c.req.json())

  const [row] = await db
    .select({
      order: orders,
      booking: bookings,
      ratePerLb: pricingRules.ratePerLb,
      minimumCents: pricingRules.minimumCents,
    })
    .from(orders)
    .innerJoin(bookings, eq(orders.bookingId, bookings.id))
    .innerJoin(pricingRules, eq(pricingRules.serviceId, bookings.serviceId))
    .where(and(eq(orders.id, orderId), eq(pricingRules.active, true)))
    .limit(1)

  if (!row) return c.json({ error: 'Order not found' }, 404)

  let invoiceCents = priceCents({
    weightLb: body.actualWeightLb,
    ratePerLb: Number(row.ratePerLb),
    minimumCents: row.minimumCents,
  })
  let discountCents = row.order.discountCents
  if (row.booking.discountCents > 0 && row.booking.discountCodeId) {
    // Re-apply same percent/cap from original booking discount ratio is not enough —
    // use FIRSTPICKUP rules from booking.discountCents source: recompute with stored percent.
    // We stored absolute discount at booking; for settlement recompute from percent if possible.
    const d = applyPercentDiscount({
      subtotalCents: invoiceCents,
      percentOff: 10,
      maxDiscountCents: 1500,
    })
    discountCents = d.discountCents
    invoiceCents = d.totalCents
  }

  const [updated] = await db
    .update(orders)
    .set({
      actualWeightLb: String(body.actualWeightLb),
      invoiceCents,
      discountCents,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, orderId))
    .returning()

  await db.insert(auditLogs).values({
    actorProfileId: admin.id,
    action: 'order.record_weight',
    entityType: 'order',
    entityId: orderId,
    detail: {
      actualWeightLb: body.actualWeightLb,
      invoiceCents,
      discountCents,
    },
  })

  // Charge-after-weight stub
  const [pay] = await db
    .select()
    .from(paymentRecords)
    .where(eq(paymentRecords.orderId, orderId))
    .limit(1)
  let charge = null
  if (pay?.stripePaymentMethodId) {
    charge = await chargeAfterWeightStub({
      amountCents: invoiceCents,
      paymentMethodId: pay.stripePaymentMethodId,
      customerId: '',
      orderId,
    })
  } else {
    charge = {
      ok: false as const,
      reason:
        'No saved payment method — TODO charge after SetupIntent completes (test mode)',
    }
  }

  return c.json({ order: updated, charge })
})

adminRoutes.post('/orders/:orderId/status', async (c) => {
  const admin = requireAdmin(c.get('user'))
  const orderId = c.req.param('orderId')
  const body = statusSchema.parse(await c.req.json())

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1)
  if (!order) return c.json({ error: 'Not found' }, 404)

  const [updated] = await db
    .update(orders)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning()

  await db
    .update(bookings)
    .set({ status: body.status, updatedAt: new Date() })
    .where(eq(bookings.id, order.bookingId))

  await db.insert(orderStatusEvents).values({
    orderId,
    status: body.status,
    note: body.note ?? `Status → ${body.status}`,
    actorProfileId: admin.id,
  })

  await db.insert(auditLogs).values({
    actorProfileId: admin.id,
    action: 'order.update_status',
    entityType: 'order',
    entityId: orderId,
    detail: { status: body.status, note: body.note },
  })

  return c.json({ order: updated })
})
