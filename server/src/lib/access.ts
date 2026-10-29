/**
 * API-layer access control (RLS-equivalent).
 *
 * Policies:
 * - Anonymous: read public catalogs (zones, services, windows, pricing display)
 * - Customer: CRUD own profile/addresses/preferences; create bookings for self;
 *   read own bookings/orders/status events/payments; never read other customers
 * - Admin: list all bookings/orders; update status; record weight + invoice;
 *   write audit_logs
 * - Driver / partner: reserved for Phase 3 (denied in Phase 2 admin routes)
 *
 * Enforcement is always in route handlers / helpers — never trust client role claims.
 */
import type { AuthUser } from './auth.js'

export function requireUser(user: AuthUser | null): AuthUser {
  if (!user) {
    const err = new Error('Unauthorized')
    ;(err as Error & { status: number }).status = 401
    throw err
  }
  return user
}

export function requireAdmin(user: AuthUser | null): AuthUser {
  const u = requireUser(user)
  if (u.role !== 'admin') {
    const err = new Error('Forbidden')
    ;(err as Error & { status: number }).status = 403
    throw err
  }
  return u
}

export function assertOwner(
  user: AuthUser,
  ownerId: string,
  allowAdmin = true,
) {
  if (user.id === ownerId) return
  if (allowAdmin && user.role === 'admin') return
  const err = new Error('Forbidden')
  ;(err as Error & { status: number }).status = 403
  throw err
}
