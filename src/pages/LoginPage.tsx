import { Link } from 'react-router-dom'

import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  return (
    <>
      <PageMeta
        title="Log in — FreshFold"
        description="FreshFold customer login. Phase 1 is a UI shell — Supabase Auth wires up in Phase 2."
      />
      <section className="section-pad mx-auto flex max-w-md flex-col py-14 md:py-24">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-3xl font-extrabold text-navy">
          Log in
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="demo">Phase 2 — Auth shell only</Badge>
        </div>
        <p className="mt-4 text-sm text-muted">
          Customer accounts and Supabase Auth arrive in Phase 2. This form does
          not authenticate or create sessions.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input id="login-email" type="email" placeholder="you@example.com" disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" disabled />
          </div>
          <Button type="button" disabled className="w-full">
            Sign in (coming in Phase 2)
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Want to try the demo booking flow?{' '}
          <Link to="/book" className="font-semibold text-teal hover:underline">
            Book a pickup
          </Link>
        </p>
      </section>
    </>
  )
}
