import { useState } from 'react'

import { SectionMedia } from '@/components/marketing/SectionMedia'
import { PageMeta } from '@/components/seo/PageMeta'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { saveDemoForm } from '@/demo/forms'

export function CommercialPage() {
  const [status, setStatus] = useState<'idle' | 'saved'>('idle')
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    zip: '',
    volume: '',
    notes: '',
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    saveDemoForm('commercial', form)
    setStatus('saved')
    setForm({
      businessName: '',
      contactName: '',
      email: '',
      phone: '',
      zip: '',
      volume: '',
      notes: '',
    })
  }

  return (
    <>
      <PageMeta
        title="Commercial — FreshFold"
        description="Light commercial laundry pickup for salons, clinics, offices, and short-term rentals in Massachusetts. Demo inquiry form only."
      />
      <section className="section-pad mx-auto max-w-6xl py-14 md:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
              FreshFold
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-navy md:text-5xl">
              Commercial laundry
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Reliable pickup windows for light commercial accounts — salons,
              clinics, offices, and short-term rentals — without commodity
              pricing pressure.
            </p>
          </div>
          <SectionMedia
            src="/images/commercial-linens.jpg"
            alt="Clean bathroom with folded towels ready for light commercial accounts"
            className="aspect-[5/4]"
          />
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: 'Scheduled reliability',
              body: 'Recurring windows that fit your open hours.',
            },
            {
              title: 'Preference controls',
              body: 'Fold style and handling notes per account.',
            },
            {
              title: 'Quoted specialty & volume',
              body: 'Bulk and specialty items priced with a real quote.',
            },
          ].map((item) => (
            <li key={item.title}>
              <h2 className="font-display text-lg font-semibold text-navy">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </li>
          ))}
        </ul>

        <form
          onSubmit={onSubmit}
          className="mt-14 max-w-xl space-y-4 border-t border-border pt-10"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-2xl font-bold text-navy">
              Commercial inquiry
            </h2>
            <Badge variant="demo">Demo — not submitted to backend</Badge>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="biz">Business name</Label>
              <Input
                id="biz"
                required
                value={form.businessName}
                onChange={(e) =>
                  setForm({ ...form, businessName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cname">Contact name</Label>
              <Input
                id="cname"
                required
                value={form.contactName}
                onChange={(e) =>
                  setForm({ ...form, contactName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cemail">Email</Label>
              <Input
                id="cemail"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cphone">Phone</Label>
              <Input
                id="cphone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="czip">ZIP</Label>
              <Input
                id="czip"
                inputMode="numeric"
                maxLength={5}
                value={form.zip}
                onChange={(e) =>
                  setForm({
                    ...form,
                    zip: e.target.value.replace(/\D/g, '').slice(0, 5),
                  })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="volume">Approximate weekly volume</Label>
              <Input
                id="volume"
                placeholder="e.g. 4–6 bags / week"
                value={form.volume}
                onChange={(e) => setForm({ ...form, volume: e.target.value })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cnotes">Notes</Label>
              <Textarea
                id="cnotes"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit">Save demo inquiry</Button>
          {status === 'saved' && (
            <p className="text-sm text-success" role="status">
              Inquiry saved locally as demo data — not emailed or stored on a
              server. Phase 2 will route inquiries to ops.
            </p>
          )}
        </form>
      </section>
    </>
  )
}
