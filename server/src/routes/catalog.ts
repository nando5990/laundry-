import { Hono } from 'hono'
import { and, eq, gte, sql } from 'drizzle-orm'

import { db } from '../db/client.js'
import {
  pickupWindows,
  pricingRules,
  serviceZones,
  services,
  specialtyItems,
} from '../db/schema.js'
import type { AppEnv } from '../middleware/session.js'

export const catalogRoutes = new Hono<AppEnv>()

catalogRoutes.get('/zones', async (c) => {
  const zip = c.req.query('zip')
  if (zip) {
    const rows = await db
      .select()
      .from(serviceZones)
      .where(and(eq(serviceZones.zip, zip), eq(serviceZones.active, true)))
      .limit(1)
    if (!rows.length) {
      return c.json({
        available: false,
        zip,
        message:
          'We’re not picking up in this ZIP yet. Launch coverage is Canton, Stoughton, and select Brockton / Mattapan ZIPs.',
      })
    }
    return c.json({ available: true, zone: rows[0] })
  }
  const zones = await db
    .select()
    .from(serviceZones)
    .where(eq(serviceZones.active, true))
  return c.json({ zones })
})

catalogRoutes.get('/services', async (c) => {
  const rows = await db
    .select({
      id: services.id,
      code: services.code,
      name: services.name,
      description: services.description,
      ratePerLb: pricingRules.ratePerLb,
      minimumCents: pricingRules.minimumCents,
    })
    .from(services)
    .innerJoin(pricingRules, eq(pricingRules.serviceId, services.id))
    .where(and(eq(services.active, true), eq(pricingRules.active, true)))
  return c.json({ services: rows })
})

catalogRoutes.get('/specialty-items', async (c) => {
  const rows = await db
    .select()
    .from(specialtyItems)
    .where(eq(specialtyItems.active, true))
  return c.json({ items: rows })
})

catalogRoutes.get('/windows', async (c) => {
  const from = c.req.query('from') ?? new Date().toISOString().slice(0, 10)
  const rows = await db
    .select({
      id: pickupWindows.id,
      serviceDate: pickupWindows.serviceDate,
      windowLabel: pickupWindows.windowLabel,
      capacity: pickupWindows.capacity,
      bookedCount: pickupWindows.bookedCount,
      remaining: sql<number>`${pickupWindows.capacity} - ${pickupWindows.bookedCount}`,
    })
    .from(pickupWindows)
    .where(
      and(
        eq(pickupWindows.active, true),
        gte(pickupWindows.serviceDate, from),
        sql`${pickupWindows.bookedCount} < ${pickupWindows.capacity}`,
      ),
    )
    .orderBy(pickupWindows.serviceDate, pickupWindows.windowLabel)
  return c.json({ windows: rows })
})
