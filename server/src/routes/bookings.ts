import { Hono } from 'hono'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import { db, sql as pg } from '../db/client.js'
import {
  addresses,
  auditLogs,
  bookings,
  discountCodes,
  discountRedemptions,
  orderItems,
  orderStatusEvents,
  orders,
  paymentRecords,
  pickupWindows,
  pricingRules,
  serviceZones,
  services,
} from '../db/schema.js'
import { requireUser } from '../lib/access.js'
import {
  applyPercentDiscount,
  estimateWeightFromBags,
  priceCents,
} from '../lib/pricing.js'
import type { AppEnv } from '../middleware/session.js'
import { sendBookingConfirmation } from '../services/email.js'
import { createSetupIntent } from '../services/stripe.js'

const quoteSchema = z.object({
  serviceCode: z.enum(['one-time', 'weekly', 'express']),
  estimatedBags: z.number().int().min(1).max(20),
  applyFirstPickup: z.boolean().optional(),
  estimatedWeightLb: z.number().positive().optional(),
})

const createSchema = z.object({
  serviceCode: z.enum(['one-time', 'weekly', 'express']),
  estimatedBags: z.number().int().min(1).max(20),
  applyFirstPickup: z.boolean().default(true),
  pickupWindowId: z.string().uuid(),
  address: z.object({
    street: z.string().min(1),
    unit: z.string().optional(),
    city: z.string().min(1),
    state: z.string().length(2).default('MA'),
    zip: z.string().regex(/^\d{5}$/),
  }),
  preferences: z.object({
    detergent: z.string(),
    softener: z.string(),
    foldStyle: z.string(),
    notes: z.string().optional(),
  }),
  notes: z.string().optional(),
  createSetupIntent: z.boolean().optional(),
})

export const bookingRoutes = new Hono<AppEnv>()

bookingRoutes.post('/quote', async (c) => {
  const body = quoteSchema.parse(await c.req.json())
  const [svc] = await db
    .select({
      id: services.id,
      code: services.code,
      name: services.name,
      ratePerLb: pricingRules.ratePerLb,
      minimumCents: pricingRules.minimumCents,
    })
    .from(services)
    .innerJoin(pricingRules, eq(pricingRules.serviceId, services.id))
    .where(eq(services.code, body.serviceCode))
    .limit(1)
  if (!svc) return c.json({ error: 'Unknown service' }, 404)

  const weight =
    body.estimatedWeightLb ?? estimateWeightFromBags(body.estimatedBags)
  const subtotal = priceCents({
    weightLb: weight,
    ratePerLb: Number(svc.ratePerLb),
    minimumCents: svc.minimumCents,
  })

  let discountCents = 0
  let totalCents = subtotal
  if (body.applyFirstPickup !== false) {
    const [code] = await db
      .select()
      .from(discountCodes)
      .where(
        and(
          eq(discountCodes.code, 'FIRSTPICKUP'),
          eq(discountCodes.active, true),
        ),
      )
      .limit(1)
    if (code) {
      const d = applyPercentDiscount({
        subtotalCents: subtotal,
        percentOff: code.percentOff,
        maxDiscountCents: code.maxDiscountCents,
      })
      discountCents = d.discountCents
      totalCents = d.totalCents
    }
  }

  return c.json({
    service: svc,
    estimatedWeightLb: weight,
    subtotalCents: subtotal,
    discountCents,
    totalCents,
    note: 'Estimate only — final invoice settles after actual weight (server-side).',
  })
})

bookingRoutes.post('/', async (c) => {
  const user = requireUser(c.get('user'))
  const body = createSchema.parse(await c.req.json())

  const [zone] = await db
    .select()
    .from(serviceZones)
    .where(
      and(
        eq(serviceZones.zip, body.address.zip),
        eq(serviceZones.active, true),
      ),
    )
    .limit(1)
  if (!zone) {
    return c.json(
      { error: 'ZIP not in an active service zone', zip: body.address.zip },
      400,
    )
  }

  const [svc] = await db
    .select({
      id: services.id,
      code: services.code,
      name: services.name,
      ratePerLb: pricingRules.ratePerLb,
      minimumCents: pricingRules.minimumCents,
    })
    .from(services)
    .innerJoin(pricingRules, eq(pricingRules.serviceId, services.id))
    .where(eq(services.code, body.serviceCode))
    .limit(1)
  if (!svc) return c.json({ error: 'Unknown service' }, 404)

  // Atomic capacity check — no double-book
  const claimedRows = await pg<{
    id: string
    service_date: string
    window_label: string
    booked_count: number
    capacity: number
  }[]>`
    UPDATE pickup_windows
    SET booked_count = booked_count + 1
    WHERE id = ${body.pickupWindowId}::uuid
      AND active = true
      AND booked_count < capacity
    RETURNING id, service_date, window_label, booked_count, capacity
  `

  if (!claimedRows.length) {
    return c.json(
      { error: 'Pickup window unavailable or at capacity' },
      409,
    )
  }
  const window = claimedRows[0]

  const weight = estimateWeightFromBags(body.estimatedBags)
  const subtotal = priceCents({
    weightLb: weight,
    ratePerLb: Number(svc.ratePerLb),
    minimumCents: svc.minimumCents,
  })

  let discountCodeId: string | null = null
  let discountCents = 0
  let estimateCents = subtotal

  if (body.applyFirstPickup) {
    const prior = await db
      .select({ id: discountRedemptions.id })
      .from(discountRedemptions)
      .innerJoin(
        discountCodes,
        eq(discountRedemptions.discountCodeId, discountCodes.id),
      )
      .where(
        and(
          eq(discountRedemptions.profileId, user.id),
          eq(discountCodes.code, 'FIRSTPICKUP'),
        ),
      )
      .limit(1)
    if (!prior.length) {
      const [code] = await db
        .select()
        .from(discountCodes)
        .where(eq(discountCodes.code, 'FIRSTPICKUP'))
        .limit(1)
      if (code) {
        const d = applyPercentDiscount({
          subtotalCents: subtotal,
          percentOff: code.percentOff,
          maxDiscountCents: code.maxDiscountCents,
        })
        discountCodeId = code.id
        discountCents = d.discountCents
        estimateCents = d.totalCents
      }
    }
  }

  const [address] = await db
    .insert(addresses)
    .values({
      profileId: user.id,
      street: body.address.street,
      unit: body.address.unit,
      city: body.address.city,
      state: body.address.state ?? 'MA',
      zip: body.address.zip,
      isDefault: true,
    })
    .returning()

  const [booking] = await db
    .insert(bookings)
    .values({
      profileId: user.id,
      addressId: address.id,
      serviceId: svc.id,
      pickupWindowId: window.id,
      status: 'scheduled',
      estimatedBags: body.estimatedBags,
      estimatedWeightLb: String(weight),
      estimateCents,
      discountCodeId,
      discountCents,
      preferencesSnapshot: body.preferences,
      notes: body.notes,
    })
    .returning()

  const [order] = await db
    .insert(orders)
    .values({
      bookingId: booking.id,
      profileId: user.id,
      status: 'scheduled',
      discountCents,
      invoiceCents: null,
    })
    .returning()

  await db.insert(orderItems).values({
    orderId: order.id,
    kind: 'wash_fold',
    serviceId: svc.id,
    description: `${svc.name} (estimate)`,
    quantity: String(weight),
    unitCents: Math.round(Number(svc.ratePerLb) * 100),
    lineCents: estimateCents,
  })

  await db.insert(orderStatusEvents).values({
    orderId: order.id,
    status: 'scheduled',
    note: 'Booking created',
    actorProfileId: user.id,
  })

  await db.insert(paymentRecords).values({
    orderId: order.id,
    profileId: user.id,
    status: 'none',
  })

  if (discountCodeId) {
    await db.insert(discountRedemptions).values({
      discountCodeId,
      profileId: user.id,
      orderId: order.id,
    })
  }

  await db.insert(auditLogs).values({
    actorProfileId: user.id,
    action: 'booking.create',
    entityType: 'booking',
    entityId: booking.id,
    detail: { orderId: order.id, zip: body.address.zip },
  })

  const pickupSummary = `${window.service_date} ${window.window_label}`
  const estimateLabel = `$${(estimateCents / 100).toFixed(2)} estimate`

  await sendBookingConfirmation({
    to: user.email,
    fullName: user.fullName,
    bookingId: booking.id,
    pickupSummary,
    estimateLabel,
  })

  let payment: Awaited<ReturnType<typeof createSetupIntent>> | null = null
  if (body.createSetupIntent !== false) {
    payment = await createSetupIntent({
      email: user.email,
      orderId: order.id,
    })
    if (payment.setupIntentId) {
      await db
        .update(paymentRecords)
        .set({
          status: 'setup_pending',
          stripeSetupIntentId: payment.setupIntentId,
          updatedAt: new Date(),
        })
        .where(eq(paymentRecords.orderId, order.id))
    }
  }

  return c.json(
    {
      booking,
      order,
      address,
      pickup: {
        date: window.service_date,
        window: window.window_label,
      },
      estimateCents,
      discountCents,
      payment: payment
        ? {
            stubbed: !payment.ok,
            reason: payment.reason,
            clientSecret: payment.clientSecret,
            setupIntentId: payment.setupIntentId,
          }
        : null,
    },
    201,
  )
})

bookingRoutes.get('/mine', async (c) => {
  const user = requireUser(c.get('user'))
  const rows = await db
    .select({
      booking: bookings,
      order: orders,
      serviceName: services.name,
      serviceCode: services.code,
      windowDate: pickupWindows.serviceDate,
      windowLabel: pickupWindows.windowLabel,
      street: addresses.street,
      city: addresses.city,
      zip: addresses.zip,
    })
    .from(bookings)
    .innerJoin(orders, eq(orders.bookingId, bookings.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .innerJoin(pickupWindows, eq(bookings.pickupWindowId, pickupWindows.id))
    .innerJoin(addresses, eq(bookings.addressId, addresses.id))
    .where(eq(bookings.profileId, user.id))
    .orderBy(sql`${bookings.createdAt} desc`)
  return c.json({ bookings: rows })
})

bookingRoutes.get('/:orderId', async (c) => {
  const user = requireUser(c.get('user'))
  const orderId = c.req.param('orderId')
  const [row] = await db
    .select({
      order: orders,
      booking: bookings,
      serviceName: services.name,
    })
    .from(orders)
    .innerJoin(bookings, eq(orders.bookingId, bookings.id))
    .innerJoin(services, eq(bookings.serviceId, services.id))
    .where(eq(orders.id, orderId))
    .limit(1)
  if (!row) return c.json({ error: 'Not found' }, 404)
  if (row.order.profileId !== user.id && user.role !== 'admin') {
    return c.json({ error: 'Forbidden' }, 403)
  }
  const events = await db
    .select()
    .from(orderStatusEvents)
    .where(eq(orderStatusEvents.orderId, orderId))
    .orderBy(orderStatusEvents.createdAt)
  return c.json({ ...row, events })
})
