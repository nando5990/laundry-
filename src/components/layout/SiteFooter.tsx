import { Link } from 'react-router-dom'

import { BRAND, CONTACT } from '@/lib/constants'

const FOOTER_LINKS = [
  {
    heading: 'Service',
    links: [
      { to: '/how-it-works', label: 'How it works' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/book', label: 'Book pickup' },
      { to: '/service-areas', label: 'Service areas' },
      { to: '/commercial', label: 'Commercial' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/faq', label: 'FAQ' },
      { to: '/contact', label: 'Contact' },
      { to: '/login', label: 'Log in' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy' },
      { to: '/terms', label: 'Terms' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-navy text-white">
      <div className="section-pad mx-auto grid max-w-6xl gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-extrabold">{BRAND.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
            {BRAND.tagline} Laundry pickup & delivery for {BRAND.region}.
          </p>
          <p className="mt-4 text-sm text-white/60">
            {CONTACT.email}
            <br />
            {CONTACT.phone} · {CONTACT.hours}
          </p>
          <p className="mt-3 text-xs text-white/40">
            Contact details are placeholders pending verified business info.
          </p>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.heading}>
            <p className="text-sm font-semibold text-blush">{group.heading}</p>
            <ul className="mt-4 space-y-2">
              {group.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/70 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <p className="section-pad mx-auto max-w-6xl py-4 text-xs text-white/45">
          © 2026 FreshFold. Phase 1 demo site — not live ordering.
        </p>
      </div>
    </footer>
  )
}
