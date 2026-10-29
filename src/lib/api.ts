const API_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(
  /\/$/,
  '',
)

export function apiConfigured() {
  return Boolean(API_URL)
}

export function apiBase() {
  return API_URL ?? ''
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; demoFallback: boolean; error: string; status?: number }

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  if (!API_URL) {
    return {
      ok: false,
      demoFallback: true,
      error: 'VITE_API_URL not set — using Phase 1 demo mode',
    }
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })
    const text = await res.text()
    const data = text ? (JSON.parse(text) as unknown) : null
    if (!res.ok) {
      const err =
        data && typeof data === 'object' && 'error' in data
          ? String((data as { error: string }).error)
          : `HTTP ${res.status}`
      return { ok: false, demoFallback: false, error: err, status: res.status }
    }
    return { ok: true, data: data as T }
  } catch (e) {
    return {
      ok: false,
      demoFallback: true,
      error:
        e instanceof Error
          ? `API unreachable (${e.message}) — demo fallback`
          : 'API unreachable — demo fallback',
    }
  }
}

export type SessionUser = {
  id: string
  email: string
  fullName: string
  role: 'customer' | 'admin' | 'driver' | 'partner'
}
