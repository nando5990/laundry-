import { createHash, randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { eq, and, gt } from 'drizzle-orm'

import { db } from '../db/client.js'
import { profiles, sessions } from '../db/schema.js'

const SESSION_DAYS = 14
export const SESSION_COOKIE = 'ff_session'

export type AuthUser = {
  id: string
  email: string
  fullName: string
  role: 'customer' | 'admin' | 'driver' | 'partner'
}

export function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createSession(profileId: string) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS)
  await db.insert(sessions).values({
    profileId,
    tokenHash: hashToken(token),
    expiresAt,
  })
  return { token, expiresAt }
}

export async function destroySession(token: string) {
  await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)))
}

export async function resolveSession(
  token: string | undefined,
): Promise<AuthUser | null> {
  if (!token) return null
  const rows = await db
    .select({
      id: profiles.id,
      email: profiles.email,
      fullName: profiles.fullName,
      role: profiles.role,
      expiresAt: sessions.expiresAt,
    })
    .from(sessions)
    .innerJoin(profiles, eq(sessions.profileId, profiles.id))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1)
  const row = rows[0]
  if (!row) return null
  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    role: row.role,
  }
}

export function sessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: 'Lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  }
}
