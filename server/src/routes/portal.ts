import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../db/client.js'
import { laundryPreferences } from '../db/schema.js'
import { requireUser } from '../lib/access.js'
import type { AppEnv } from '../middleware/session.js'

const prefsSchema = z.object({
  detergent: z.string().min(1),
  softener: z.string().min(1),
  foldStyle: z.string().min(1),
  notes: z.string().optional(),
})

export const portalRoutes = new Hono<AppEnv>()

portalRoutes.get('/preferences', async (c) => {
  const user = requireUser(c.get('user'))
  const [prefs] = await db
    .select()
    .from(laundryPreferences)
    .where(eq(laundryPreferences.profileId, user.id))
    .limit(1)
  return c.json({
    preferences: prefs ?? {
      detergent: 'hypoallergenic',
      softener: 'none',
      foldStyle: 'standard',
      notes: '',
    },
  })
})

portalRoutes.put('/preferences', async (c) => {
  const user = requireUser(c.get('user'))
  const body = prefsSchema.parse(await c.req.json())
  const existing = await db
    .select()
    .from(laundryPreferences)
    .where(eq(laundryPreferences.profileId, user.id))
    .limit(1)
  if (existing.length) {
    const [updated] = await db
      .update(laundryPreferences)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(laundryPreferences.profileId, user.id))
      .returning()
    return c.json({ preferences: updated })
  }
  const [created] = await db
    .insert(laundryPreferences)
    .values({ profileId: user.id, ...body })
    .returning()
  return c.json({ preferences: created })
})
