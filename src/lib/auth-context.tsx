import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import { apiConfigured, apiFetch, type SessionUser } from '@/lib/api'

type AuthState = {
  user: SessionUser | null
  loading: boolean
  apiOnline: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(apiConfigured())
  const [apiOnline, setApiOnline] = useState(false)

  const refresh = useCallback(async () => {
    if (!apiConfigured()) {
      setLoading(false)
      setApiOnline(false)
      setUser(null)
      return
    }
    const health = await apiFetch<{ ok: boolean }>('/health')
    setApiOnline(health.ok)
    if (!health.ok) {
      setUser(null)
      setLoading(false)
      return
    }
    const me = await apiFetch<{ user: SessionUser | null }>('/auth/me')
    if (me.ok) setUser(me.data.user)
    else setUser(null)
    setLoading(false)
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const logout = useCallback(async () => {
    await apiFetch('/auth/logout', { method: 'POST' })
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, apiOnline, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth requires AuthProvider')
  return ctx
}
