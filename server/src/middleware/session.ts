import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'

import {
  resolveSession,
  SESSION_COOKIE,
  type AuthUser,
} from '../lib/auth.js'

export type AppEnv = {
  Variables: {
    user: AuthUser | null
  }
}

export const sessionMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, SESSION_COOKIE)
  const user = await resolveSession(token)
  c.set('user', user)
  await next()
})
