-- FreshFold Phase 2 — portable PostgreSQL schema (no Supabase-specific features)
-- Production hosts: Neon, RDS, self-hosted, or Supabase Postgres-as-host only.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE user_role AS ENUM ('customer', 'admin', 'driver', 'partner');
CREATE TYPE booking_status AS ENUM (
  'draft',
  'scheduled',
  'picked_up',
  'processing',
  'out_for_delivery',
  'delivered',
  'cancelled'
);
CREATE TYPE payment_status AS ENUM (
  'none',
  'setup_pending',
  'method_saved',
  'authorized',
  'settled',
  'failed',
  'refunded'
);

CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email varchar(255) NOT NULL UNIQUE,
  password_hash text NOT NULL,
  full_name varchar(255) NOT NULL,
  phone varchar(40),
  role user_role NOT NULL DEFAULT 'customer',
  stripe_customer_id varchar(255),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label varchar(80) DEFAULT 'Home',
  street varchar(255) NOT NULL,
  unit varchar(80),
  city varchar(120) NOT NULL,
  state varchar(2) NOT NULL DEFAULT 'MA',
  zip varchar(10) NOT NULL,
  is_default boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE service_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zip varchar(10) NOT NULL,
  city varchar(120) NOT NULL,
  active boolean NOT NULL DEFAULT true,
  note text
);
CREATE UNIQUE INDEX service_zones_zip_uidx ON service_zones (zip);

CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  name varchar(120) NOT NULL,
  description text,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE pricing_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  rate_per_lb numeric(10, 2) NOT NULL,
  minimum_cents integer NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE specialty_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  name varchar(120) NOT NULL,
  quote_only boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE laundry_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  detergent varchar(80) NOT NULL DEFAULT 'hypoallergenic',
  softener varchar(80) NOT NULL DEFAULT 'none',
  fold_style varchar(80) NOT NULL DEFAULT 'standard',
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pickup_windows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_date date NOT NULL,
  window_label varchar(80) NOT NULL,
  capacity integer NOT NULL DEFAULT 8,
  booked_count integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true
);
CREATE UNIQUE INDEX pickup_windows_date_label_uidx ON pickup_windows (service_date, window_label);

CREATE TABLE discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code varchar(40) NOT NULL UNIQUE,
  description text,
  percent_off integer NOT NULL,
  max_discount_cents integer NOT NULL,
  first_order_only boolean NOT NULL DEFAULT true,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  address_id uuid NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
  service_id uuid NOT NULL REFERENCES services(id),
  pickup_window_id uuid NOT NULL REFERENCES pickup_windows(id),
  status booking_status NOT NULL DEFAULT 'scheduled',
  estimated_bags integer NOT NULL DEFAULT 2,
  estimated_weight_lb numeric(10, 2),
  estimate_cents integer NOT NULL,
  discount_code_id uuid REFERENCES discount_codes(id),
  discount_cents integer NOT NULL DEFAULT 0,
  preferences_snapshot jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id),
  status booking_status NOT NULL DEFAULT 'scheduled',
  actual_weight_lb numeric(10, 2),
  invoice_cents integer,
  discount_cents integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  kind varchar(40) NOT NULL,
  service_id uuid REFERENCES services(id),
  specialty_item_id uuid REFERENCES specialty_items(id),
  description text,
  quantity numeric(10, 2),
  unit_cents integer,
  line_cents integer
);

CREATE TABLE order_status_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status booking_status NOT NULL,
  note text,
  actor_profile_id uuid REFERENCES profiles(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles(id),
  status payment_status NOT NULL DEFAULT 'none',
  stripe_setup_intent_id varchar(255),
  stripe_payment_method_id varchar(255),
  stripe_payment_intent_id varchar(255),
  stripe_event_id varchar(255) UNIQUE,
  amount_cents integer,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE discount_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  discount_code_id uuid NOT NULL REFERENCES discount_codes(id),
  profile_id uuid NOT NULL REFERENCES profiles(id),
  order_id uuid REFERENCES orders(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE business_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key varchar(80) NOT NULL UNIQUE,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_profile_id uuid REFERENCES profiles(id),
  action varchar(120) NOT NULL,
  entity_type varchar(80),
  entity_id uuid,
  detail jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
