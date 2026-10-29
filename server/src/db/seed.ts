import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'

import { db, sql } from './client.js'
import { pricingRules, profiles, services } from './schema.js'

const DEMO_ZIPS = [
  { zip: '02021', city: 'Canton', note: 'Launch ZIP' },
  { zip: '02072', city: 'Stoughton', note: 'Launch ZIP' },
  { zip: '02301', city: 'Brockton', note: 'Sample launch ZIP' },
  { zip: '02302', city: 'Brockton', note: 'Sample launch ZIP' },
  { zip: '02126', city: 'Mattapan', note: 'Sample launch ZIP' },
]

const WINDOW_LABELS = [
  '8:00–10:00 AM',
  '10:00 AM–12:00 PM',
  '12:00–2:00 PM',
  '2:00–4:00 PM',
  '4:00–6:00 PM',
]

function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setUTCDate(x.getUTCDate() + n)
  return x
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const [admin] = await db
    .insert(profiles)
    .values({
      email: 'admin@freshfold.example',
      passwordHash,
      fullName: 'FreshFold Admin',
      phone: '(781) 555-0100',
      role: 'admin',
    })
    .onConflictDoNothing()
    .returning()

  const [customer] = await db
    .insert(profiles)
    .values({
      email: 'customer@freshfold.example',
      passwordHash,
      fullName: 'Casey Customer',
      phone: '(781) 555-0199',
      role: 'customer',
    })
    .onConflictDoNothing()
    .returning()

  // If onConflict skipped returning, look up existing
  const adminRow =
    admin ??
    (
      await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, 'admin@freshfold.example'))
    )[0]
  const customerRow =
    customer ??
    (
      await db
        .select()
        .from(profiles)
        .where(eq(profiles.email, 'customer@freshfold.example'))
    )[0]

  for (const z of DEMO_ZIPS) {
    await sql`
      INSERT INTO service_zones (zip, city, active, note)
      VALUES (${z.zip}, ${z.city}, true, ${z.note})
      ON CONFLICT (zip) DO UPDATE SET city = EXCLUDED.city, note = EXCLUDED.note, active = true
    `
  }

  const serviceDefs = [
    {
      code: 'one-time',
      name: 'One-time wash & fold',
      description: 'Catch-up wash & fold',
      rate: '2.99',
      minCents: 8999,
    },
    {
      code: 'weekly',
      name: 'Weekly plan',
      description: 'Recurring pickup at a lower rate',
      rate: '2.69',
      minCents: 7999,
    },
    {
      code: 'express',
      name: 'Express',
      description: 'Faster turnaround',
      rate: '3.29',
      minCents: 9999,
    },
  ]

  for (const s of serviceDefs) {
    await sql`
      INSERT INTO services (code, name, description, active)
      VALUES (${s.code}, ${s.name}, ${s.description}, true)
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description
    `
    const [svc] = await db
      .select()
      .from(services)
      .where(eq(services.code, s.code))
    const existingRule = await db
      .select()
      .from(pricingRules)
      .where(eq(pricingRules.serviceId, svc.id))
    if (!existingRule.length) {
      await db.insert(pricingRules).values({
        serviceId: svc.id,
        ratePerLb: s.rate,
        minimumCents: s.minCents,
        active: true,
      })
    }
  }

  const specialties = [
    { code: 'comforter', name: 'Comforters & duvets' },
    { code: 'delicates', name: 'Delicates & specialty garments' },
    { code: 'rugs', name: 'Small rugs' },
    { code: 'bulk', name: 'Commercial / bulk bags' },
  ]
  for (const sp of specialties) {
    await sql`
      INSERT INTO specialty_items (code, name, quote_only, active)
      VALUES (${sp.code}, ${sp.name}, true, true)
      ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name
    `
  }

  await sql`
    INSERT INTO discount_codes (code, description, percent_off, max_discount_cents, first_order_only, active)
    VALUES ('FIRSTPICKUP', 'First Pickup Special — 10% up to $15', 10, 1500, true, true)
    ON CONFLICT (code) DO UPDATE SET percent_off = 10, max_discount_cents = 1500, active = true
  `

  const today = new Date()
  for (let d = 1; d <= 14; d++) {
    const day = addDays(today, d)
    // Skip Sundays (0)
    if (day.getUTCDay() === 0) continue
    for (const label of WINDOW_LABELS) {
      await sql`
        INSERT INTO pickup_windows (service_date, window_label, capacity, booked_count, active)
        VALUES (${isoDate(day)}::date, ${label}, 8, 0, true)
        ON CONFLICT (service_date, window_label) DO NOTHING
      `
    }
  }

  const brandValue = JSON.stringify({
    name: 'FreshFold',
    region: 'Massachusetts',
    carePromise:
      'If something isn’t right, contact us within 48 hours of delivery.',
  })
  await sql`
    INSERT INTO business_settings (key, value)
    VALUES ('brand', ${brandValue}::jsonb)
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `

  console.log('Seed complete')
  console.log('Admin:    admin@freshfold.example / password123')
  console.log('Customer: customer@freshfold.example / password123')
  console.log(`Admin id: ${adminRow?.id}`)
  console.log(`Customer id: ${customerRow?.id}`)

  await sql.end()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
