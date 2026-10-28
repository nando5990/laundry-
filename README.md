# FreshFold — Phase 1 public site

Premium laundry pickup & delivery marketing site for Massachusetts (Canton, Stoughton, and sample Brockton / Mattapan ZIPs). **Brand: FreshFold only** (not Laundryr) on the customer-facing site.

Phase 1 is **demo-safe**: clearly marked sample data, no live Stripe / Supabase / Resend.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 + shadcn-style UI primitives
- React Router
- Netlify-ready (`netlify.toml` SPA redirects)
- Fonts: Manrope (display) + Inter (body)
- Colors: navy `#132238`, teal `#14B8A6`, off-white `#F8FAF9`, white `#FFFFFF`, dark `#182230`, muted `#667085`

## Setup

```bash
npm install
cp .env.example .env   # VITE_DEMO_MODE=true
npm run dev            # http://localhost:5173
```

```bash
npm run build          # production build → dist/
npm run preview        # preview production build
```

Deploy: connect the GitHub repo to Netlify (build command `npm run build`, publish `dist`).

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — Grand Slam hero, ZIP checker, how it works, experience, pricing, value stack, before/after, First Pickup offer, areas, FAQ, final CTA |
| `/how-it-works` | Pickup → process → deliver |
| `/pricing` | Plans, specialty quotes, First Pickup Special, Care Promise |
| `/book` | Multi-step demo booking through review; payment = Phase 2 (no charge) |
| `/service-areas` | Demo ZIP list + checker |
| `/commercial` | Light commercial pitch + demo inquiry form |
| `/about` | Brand story (no fake bios) |
| `/contact` | Channels + demo contact form |
| `/faq` | Offer / pricing / Care Promise / areas |
| `/privacy` | Draft placeholder |
| `/terms` | Draft placeholder |
| `/login` | Auth UI shell (Phase 2) |

Reviews section is mounted but **hidden** until verified reviews exist (`REVIEWS_ENABLED` in `src/lib/constants.ts`).

## Demo ZIPs

Configurable in `src/demo/zips.ts`:

| ZIP | City | Note |
| --- | --- | --- |
| `02021` | Canton | Launch ZIP |
| `02072` | Stoughton | Launch ZIP |
| `02301` | Brockton | Sample launch ZIP |
| `02302` | Brockton | Sample launch ZIP |
| `02126` | Mattapan | Sample launch ZIP |

Out-of-area ZIPs show an honest unavailable message (no fake waitlist).

## Pricing (display)

| Plan | Rate | Minimum |
| --- | --- | --- |
| One-time wash & fold | $2.99/lb | $89.99 |
| Weekly | $2.69/lb | $79.99 |
| Express | $3.29/lb | $99.99 |
| Specialty items | Request a quote | — |

**First Pickup Special:** 10% off first completed order, max $15 (eligibility rules on Pricing / FAQ).  
**Care Promise:** quality / rewash language on Pricing & FAQ (legal copy TBD).

## Demo vs Phase 2

| Capability | Phase 1 (this repo) | Phase 2+ |
| --- | --- | --- |
| Marketing pages & design system | Live | — |
| ZIP checker | Client demo list | Server-enforced `service_zones` |
| Booking flow | Multi-step UI through review | Auth + Edge booking APIs |
| Payment | Disabled placeholders — **do not charge** | Stripe SetupIntent / settle after weight |
| Contact / commercial forms | `localStorage` + “demo — not submitted” | Resend / ops alerts |
| Login | UI shell only | Supabase Auth + RLS |
| Reviews | Hidden until verified | Enable when real reviews exist |
| GPS / driver tracking / fake testimonials | Not included | Ops surfaces later |

## Project layout

```text
src/
  components/layout|marketing|seo|ui
  demo/          # ZIPs, pricing, FAQ, booking fixtures, form store
  pages/         # one file per public route
  lib/           # cn(), brand constants
  routes.tsx
```

## Gaps / TODOs before go-live

- Exact launch ZIP list confirmation
- Verified legal entity, address, phone, email (JSON-LD TODOs in `JsonLd.tsx`)
- Counsel-approved Privacy, Terms, and Care Promise wording
- Brand mark / logo SVG assets
- Supabase, Stripe, Resend credentials (Phase 2)
- Netlify production domain DNS
