import { useState } from 'react'

import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveDemoForm } from '@/demo/forms'
import { CONTACT } from '@/lib/constants'

export function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveDemoForm('contact', form)
    setStatus('saved')
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <>
      <PageMeta
        title="Contact — FreshFold"
        description="Contact FreshFold. Phase 1 contact form is demo-only and is not submitted to a backend."
      />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-20">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-navy md:text-5xl">
          Contact
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Reach us with questions about service areas, pricing, or commercial
          accounts. Live email delivery arrives with Resend in Phase 2.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-display text-xl font-semibold text-navy">
              Channels
            </h2>
            <dl className="mt-4 space-y-4 text-sm">
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="font-medium text-navy">{CONTACT.email}</dd>
              </div>
              <div>
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium text-navy">{CONTACT.phone}</dd>
              </div>
              <div>
                <dt className="text-muted">Hours</dt>
                <dd className="font-medium text-navy">{CONTACT.hours}</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs text-muted">
              TODO: replace placeholder phone and email with verified public
              contacts before go-live.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-semibold text-navy">
                Send a message
              </h2>
              <Badge variant="demo">Demo — not submitted to backend</Badge>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-name">Name</Label>
              <Input
                id="contact-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Email</Label>
              <Input
                id="contact-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <Button type="submit">Save demo message</Button>
            {status === 'saved' && (
              <p className="text-sm text-success" role="status">
                Saved locally as demo data — not emailed or stored on a server.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}
