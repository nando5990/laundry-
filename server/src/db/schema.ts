import {
  boolean,
  date,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', [
  'customer',
  'admin',
  'driver',
  'partner',
])

export const bookingStatusEnum = pgEnum('booking_status', [
  'draft',
  'scheduled',
  'picked_up',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled',
])

export const paymentStatusEnum = pgEnum('payment_status', [
  'none',
  'setup_pending',
  'method_saved',
  'authorized',
  'settled',
  'failed',
  'refunded',
])

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 40 }),
  role: userRoleEnum('role').notNull().default('customer'),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const addresses = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 80 }).default('Home'),
  street: varchar('street', { length: 255 }).notNull(),
  unit: varchar('unit', { length: 80 }),
  city: varchar('city', { length: 120 }).notNull(),
  state: varchar('state', { length: 2 }).notNull().default('MA'),
  zip: varchar('zip', { length: 10 }).notNull(),
  isDefault: boolean('is_default').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const serviceZones = pgTable(
  'service_zones',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    zip: varchar('zip', { length: 10 }).notNull(),
    city: varchar('city', { length: 120 }).notNull(),
    active: boolean('active').notNull().default(true),
    note: text('note'),
  },
  (t) => [uniqueIndex('service_zones_zip_uidx').on(t.zip)],
)

export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 40 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  description: text('description'),
  active: boolean('active').notNull().default(true),
})

export const pricingRules = pgTable('pricing_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => services.id, { onDelete: 'cascade' }),
  ratePerLb: numeric('rate_per_lb', { precision: 10, scale: 2 }).notNull(),
  minimumCents: integer('minimum_cents').notNull(),
  active: boolean('active').notNull().default(true),
})

export const specialtyItems = pgTable('specialty_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 40 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  quoteOnly: boolean('quote_only').notNull().default(true),
  active: boolean('active').notNull().default(true),
})

export const laundryPreferences = pgTable('laundry_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' })
    .unique(),
  detergent: varchar('detergent', { length: 80 }).notNull().default('hypoallergenic'),
  softener: varchar('softener', { length: 80 }).notNull().default('none'),
  foldStyle: varchar('fold_style', { length: 80 }).notNull().default('standard'),
  notes: text('notes'),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const pickupWindows = pgTable(
  'pickup_windows',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    serviceDate: date('service_date').notNull(),
    windowLabel: varchar('window_label', { length: 80 }).notNull(),
    capacity: integer('capacity').notNull().default(8),
    bookedCount: integer('booked_count').notNull().default(0),
    active: boolean('active').notNull().default(true),
  },
  (t) => [
    uniqueIndex('pickup_windows_date_label_uidx').on(
      t.serviceDate,
      t.windowLabel,
    ),
  ],
)

export const discountCodes = pgTable('discount_codes', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: varchar('code', { length: 40 }).notNull().unique(),
  description: text('description'),
  percentOff: integer('percent_off').notNull(),
  maxDiscountCents: integer('max_discount_cents').notNull(),
  firstOrderOnly: boolean('first_order_only').notNull().default(true),
  active: boolean('active').notNull().default(true),
})

export const bookings = pgTable('bookings', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'restrict' }),
  addressId: uuid('address_id')
    .notNull()
    .references(() => addresses.id, { onDelete: 'restrict' }),
  serviceId: uuid('service_id')
    .notNull()
    .references(() => services.id),
  pickupWindowId: uuid('pickup_window_id')
    .notNull()
    .references(() => pickupWindows.id),
  status: bookingStatusEnum('status').notNull().default('scheduled'),
  estimatedBags: integer('estimated_bags').notNull().default(2),
  estimatedWeightLb: numeric('estimated_weight_lb', {
    precision: 10,
    scale: 2,
  }),
  estimateCents: integer('estimate_cents').notNull(),
  discountCodeId: uuid('discount_code_id').references(() => discountCodes.id),
  discountCents: integer('discount_cents').notNull().default(0),
  preferencesSnapshot: jsonb('preferences_snapshot').$type<{
    detergent: string
    softener: string
    foldStyle: string
    notes?: string
  }>(),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  bookingId: uuid('booking_id')
    .notNull()
    .references(() => bookings.id, { onDelete: 'cascade' })
    .unique(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id),
  status: bookingStatusEnum('status').notNull().default('scheduled'),
  actualWeightLb: numeric('actual_weight_lb', { precision: 10, scale: 2 }),
  invoiceCents: integer('invoice_cents'),
  discountCents: integer('discount_cents').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  kind: varchar('kind', { length: 40 }).notNull(), // wash_fold | specialty
  serviceId: uuid('service_id').references(() => services.id),
  specialtyItemId: uuid('specialty_item_id').references(
    () => specialtyItems.id,
  ),
  description: text('description'),
  quantity: numeric('quantity', { precision: 10, scale: 2 }),
  unitCents: integer('unit_cents'),
  lineCents: integer('line_cents'),
})

export const orderStatusEvents = pgTable('order_status_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  status: bookingStatusEnum('status').notNull(),
  note: text('note'),
  actorProfileId: uuid('actor_profile_id').references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const paymentRecords = pgTable('payment_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id),
  status: paymentStatusEnum('status').notNull().default('none'),
  stripeSetupIntentId: varchar('stripe_setup_intent_id', { length: 255 }),
  stripePaymentMethodId: varchar('stripe_payment_method_id', { length: 255 }),
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeEventId: varchar('stripe_event_id', { length: 255 }).unique(),
  amountCents: integer('amount_cents'),
  meta: jsonb('meta'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const discountRedemptions = pgTable('discount_redemptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  discountCodeId: uuid('discount_code_id')
    .notNull()
    .references(() => discountCodes.id),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id),
  orderId: uuid('order_id').references(() => orders.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const businessSettings = pgTable('business_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 80 }).notNull().unique(),
  value: jsonb('value').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorProfileId: uuid('actor_profile_id').references(() => profiles.id),
  action: varchar('action', { length: 120 }).notNull(),
  entityType: varchar('entity_type', { length: 80 }),
  entityId: uuid('entity_id'),
  detail: jsonb('detail'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const sessions = pgTable('sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id')
    .notNull()
    .references(() => profiles.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})
