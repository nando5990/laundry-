# FreshFold — Phase 1 site + Phase 2 booking MVP

Premium laundry pickup & delivery for Massachusetts (Canton, Stoughton, and sample Brockton / Mattapan ZIPs). **Brand: FreshFold only** (not Laundryr).

| Phase | What |
| --- | --- |
| **1** | Marketing site (demo-safe). Works with `npm run dev` alone. |
| **2** | Postgres + Hono API + auth, booking, portal, admin. Optional Stripe/Resend behind env flags. |

**Data platform:** plain **PostgreSQL** (Docker Compose locally). Schema is portable SQL — production can be Neon, RDS, self-hosted, or “Supabase Postgres-as-host only” if you choose. There is **no Supabase Auth / Supabase JS client**.

## Local URLs

| Service | URL |
| --- | --- |
| Vite marketing + portal UI | http://localhost:5173 |
| API health | http://localhost:8787/health |
| Customer portal (after login) | http://localhost:5173/app |
| Admin (after admin login) | http://localhost:5173/admin |

Phase 1 marketing pages still work if the API is down — `/book` falls back to labeled demo mode.

## Quick start (Phase 1 only)

```bash
npm install
cp .env.example .env
# leave VITE_API_URL unset (or stop the API) for pure demo
npm run dev
```

## Quick start (Phase 2 — Postgres + API + Vite)

```bash
# 1) Postgres
docker compose up -d postgres
# (or any Postgres 16+ and set DATABASE_URL)

# 2) API
cd server && npm install && cp .env.example .env
npm run db:setup          # migrate + seed
npm run dev               # http://localhost:8787

# 3) Web (repo root)
cd .. && npm install
cp .env.example .env      # includes VITE_API_URL=http://localhost:8787
npm run dev               # http://localhost:5173
```

Root helpers: `npm run api`, `npm run db:migrate`, `npm run db:seed`, `npm run db:up`.

### Seeded credentials

| Role | Email | Password |
| --- | --- | --- |
| Customer | `customer@freshfold.example` | `password123` |
| Admin | `admin@freshfold.example` | `password123` |

### Demo ZIPs (seeded `service_zones`)

`02021` Canton · `02072` Stoughton · `02301`/`02302` Brockton · `02126` Mattapan

## Env vars

### Web (`.env`)

| Var | Purpose |
| --- | --- |
| `VITE_DEMO_MODE` | Demo banner on marketing site |
| `VITE_API_URL` | Phase 2 API base (e.g. `http://localhost:8787`). If unset/unreachable → demo fallback |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Optional future Elements (test `pk_test_…`) |

### API (`server/.env`)

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `PORT` | Default `8787` |
| `CORS_ORIGIN` | Default `http://localhost:5173` |
| `SESSION_SECRET` | Session hardening note (tokens are random; cookie httpOnly) |
| `STRIPE_SECRET_KEY` | Optional test `sk_test_…` for SetupIntent; stubbed if missing |
| `STRIPE_WEBHOOK_SECRET` | TODO webhook idempotency |
| `RESEND_API_KEY` | Optional booking confirmation email; logs if missing |
| `EMAIL_FROM` | Resend from address |

## Architecture (Phase 2)

```text
src/                 Vite React marketing + /app + /admin
server/
  drizzle/           Portable SQL migrations
  src/db/            Drizzle schema, migrate, seed
  src/routes/        auth, catalog, bookings, portal, admin
  src/services/      Stripe + Resend (env-gated)
  docs/access-policies.md
docker-compose.yml   Local Postgres 16
```

**Pricing (server-only):** `MAX(weight_lb × rate_per_lb, minimum)` — estimate uses bag→lb heuristic when weight unknown; admin weight recording recalculates invoice. Client totals are never trusted.

**Auth:** email/password + httpOnly session cookies (`sessions` table). Not Supabase Auth.

**Access control:** API session role — see `server/docs/access-policies.md` (RLS-equivalent).

## Acceptance checklist (Phase 2)

- [x] Postgres schema + migrations for profiles/roles, addresses, zones, services, pricing, specialty, preferences, windows, bookings/orders, items, status events, payments stubs, discounts, business_settings, audit
- [x] API enforces customer-own vs admin; policies documented
- [x] Sign up / login / session; `/app` protected
- [x] Booking: ZIP eligibility, capacity (no double-book), create, server quote
- [x] `/book` uses API when `VITE_API_URL` healthy; labeled demo fallback otherwise
- [x] Customer portal: upcoming, history, preferences
- [x] Admin: today’s pickups, orders, weight→invoice, status
- [x] Stripe SetupIntent behind env (stub if missing); charge-after-weight TODO stub
- [x] Resend confirmation behind env (log if missing)

## Stripe / Resend

- Without keys: booking still works; payment payload shows stub reason; email is console-logged.
- With **test** Stripe secret: API creates SetupIntent (no live claim). Charge-after-weight remains stubbed until ops enable PaymentIntent + idempotent webhooks.
- Storage for delivery proofs: Phase 3 — use local/S3-shaped stubs then.

## Gaps

- Stripe Elements UI not wired (SetupIntent client_secret returned when keys exist)
- Webhook handler / idempotent `stripe_event_id` settlement not implemented
- Magic-link auth not implemented (password only)
- Driver / partner portals = Phase 3
- Recurring automation = Phase 4
- Exact launch ZIP list still owner-confirmed
- Legal pages / Care Promise counsel copy still TBD
