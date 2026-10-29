import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'

import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiConfigured, apiFetch } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'

export function LoginPage() {
  const { refresh, apiOnline, user } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('customer@freshfold.example')
  const [password, setPassword] = useState('password123')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) {
    return (
      <Navigate
        to={user.role === 'admin' ? '/admin' : '/app'}
        replace
      />
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!apiConfigured() || !apiOnline) {
      setError(
        'API offline. Start Postgres + `npm run api`, set VITE_API_URL, then retry.',
      )
      return
    }
    setBusy(true)
    const path = mode === 'login' ? '/auth/login' : '/auth/signup'
    const body =
      mode === 'login'
        ? { email, password }
        : { email, password, fullName: fullName || email.split('@')[0] }
    const res = await apiFetch<{ user: { role: string } }>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    setBusy(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    await refresh()
    navigate(res.data.user.role === 'admin' ? '/admin' : '/app')
  }

  return (
    <>
      <PageMeta
        title="Log in — FreshFold"
        description="Sign in to FreshFold. Phase 2 uses email/password sessions against the Node API + Postgres."
      />
      <section className="section-pad mx-auto flex max-w-md flex-col py-14 md:py-24">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-navy">
          {mode === 'login' ? 'Log in' : 'Create account'}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {apiOnline ? (
            <Badge>API connected</Badge>
          ) : (
            <Badge variant="demo">API offline — demo fallback</Badge>
          )}
        </div>
        <p className="mt-4 text-sm text-muted">
          Seeded demo: customer@freshfold.example / password123 (or
          admin@freshfold.example). Sessions are httpOnly cookies — not Supabase
          Auth.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="login-name">Full name</Label>
              <Input
                id="login-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-warning" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy
              ? 'Please wait…'
              : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
          </Button>
        </form>

        <button
          type="button"
          className="mt-4 text-sm font-semibold text-teal"
          onClick={() =>
            setMode((m) => (m === 'login' ? 'signup' : 'login'))
          }
        >
          {mode === 'login'
            ? 'Need an account? Sign up'
            : 'Already have an account? Log in'}
        </button>

        <p className="mt-6 text-center text-sm text-muted">
          Or use the{' '}
          <Link to="/book" className="font-semibold text-teal hover:underline">
            booking flow
          </Link>{' '}
          (API when online, demo labeled when not).
        </p>
      </section>
    </>
  )
}
