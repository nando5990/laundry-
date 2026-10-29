import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'

import { sessionMiddleware, type AppEnv } from './middleware/session.js'
import { adminRoutes } from './routes/admin.js'
import { authRoutes } from './routes/auth.js'
import { bookingRoutes } from './routes/bookings.js'
import { catalogRoutes } from './routes/catalog.js'
import { portalRoutes } from './routes/portal.js'

const app = new Hono<AppEnv>()

const origin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.use(
  '*',
  cors({
    origin,
    credentials: true,
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  }),
)

app.use('*', sessionMiddleware)

app.get('/health', (c) =>
  c.json({
    ok: true,
    service: 'freshfold-api',
    phase: 2,
    stripe: Boolean(process.env.STRIPE_SECRET_KEY),
    resend: Boolean(process.env.RESEND_API_KEY),
  }),
)

app.route('/auth', authRoutes)
app.route('/catalog', catalogRoutes)
app.route('/bookings', bookingRoutes)
app.route('/portal', portalRoutes)
app.route('/admin', adminRoutes)

app.onError((err, c) => {
  if (err instanceof ZodError) {
    return c.json({ error: 'Validation failed', issues: err.issues }, 400)
  }
  const status = (err as Error & { status?: number }).status
  if (status === 401) return c.json({ error: 'Unauthorized' }, 401)
  if (status === 403) return c.json({ error: 'Forbidden' }, 403)
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }
  console.error(err)
  return c.json({ error: err.message || 'Server error' }, 500)
})

const port = Number(process.env.PORT ?? 8787)

console.log(`FreshFold API listening on http://localhost:${port}`)
console.log(`CORS origin: ${origin}`)
console.log(
  `Stripe: ${process.env.STRIPE_SECRET_KEY ? 'configured (test/live per key)' : 'stubbed — set STRIPE_SECRET_KEY'}`,
)
console.log(
  `Resend: ${process.env.RESEND_API_KEY ? 'configured' : 'logging only — set RESEND_API_KEY'}`,
)

serve({ fetch: app.fetch, port })
