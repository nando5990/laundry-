import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '../db/client.js'
import { profiles } from '../db/schema.js'
import {
  createSession,
  destroySession,
  hashPassword,
  SESSION_COOKIE,
  sessionCookieOptions,
  verifyPassword,
} from '../lib/auth.js'
import type { AppEnv } from '../middleware/session.js'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1),
  phone: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const authRoutes = new Hono<AppEnv>()

authRoutes.post('/signup', async (c) => {
  const body = signupSchema.parse(await c.req.json())
  const existing = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.email, body.email.toLowerCase()))
    .limit(1)
  if (existing.length) {
    return c.json({ error: 'Email already registered' }, 409)
  }
  const passwordHash = await hashPassword(body.password)
  const [user] = await db
    .insert(profiles)
    .values({
      email: body.email.toLowerCase(),
      passwordHash,
      fullName: body.fullName,
      phone: body.phone,
      role: 'customer',
    })
    .returning()

  const { token, expiresAt } = await createSession(user.id)
  setCookie(c, SESSION_COOKIE, token, sessionCookieOptions(expiresAt))
  return c.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  })
})

authRoutes.post('/login', async (c) => {
  const body = loginSchema.parse(await c.req.json())
  const [user] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, body.email.toLowerCase()))
    .limit(1)
  if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }
  const { token, expiresAt } = await createSession(user.id)
  setCookie(c, SESSION_COOKIE, token, sessionCookieOptions(expiresAt))
  return c.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  })
})

authRoutes.post('/logout', async (c) => {
  const token = getCookie(c, SESSION_COOKIE)
  if (token) await destroySession(token)
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
  return c.json({ ok: true })
})

authRoutes.get('/me', async (c) => {
  const user = c.get('user')
  if (!user) return c.json({ user: null })
  return c.json({ user })
})
