# FreshFold API access policies (RLS-equivalent)

Postgres is the source of truth. We do **not** rely on Supabase RLS. Authorization is enforced in the Hono API using the session cookie → `sessions` → `profiles.role`.

## Roles

| Role | Phase 2 |
| --- | --- |
| `customer` | Own data only |
| `admin` | Privileged ops |
| `driver` / `partner` | Reserved (Phase 3) — denied on admin routes |

## Policies

### Public (anonymous)
- `GET /health`
- `GET /catalog/*` (zones, services, windows, specialty)
- `POST /bookings/quote` (estimate only; no writes)
- `POST /auth/signup`, `POST /auth/login`

### Customer (authenticated, own `profile_id`)
- `GET /auth/me`, `POST /auth/logout`
- `POST /bookings` — ZIP must be in `service_zones`; window capacity atomic; estimate server-side
- `GET /bookings/mine`, `GET /bookings/:orderId` — own orders only
- `GET/PUT /portal/preferences` — own row only

### Admin
- `GET /admin/today`, `GET /admin/orders`
- `POST /admin/orders/:id/weight` — recalculate invoice server-side (`MAX(weight×rate, min)` ± First Pickup rules)
- `POST /admin/orders/:id/status` — append `order_status_events` + `audit_logs`

### Denied
- Cross-customer reads/writes
- Client-supplied invoice totals
- Driver/partner dashboards (Phase 3)

## Storage
Delivery proofs (Phase 3) should use local or S3-shaped object storage with signed URLs — not implemented in Phase 2 beyond schema readiness.
