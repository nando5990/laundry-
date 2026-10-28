import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { BRAND } from '@/lib/constants'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/how-it-works', label: 'How it works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/service-areas', label: 'Service areas' },
  { to: '/commercial', label: 'Commercial' },
  { to: '/faq', label: 'FAQ' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 text-white backdrop-blur">
      <div className="section-pad mx-auto flex h-16 max-w-6xl items-center justify-between gap-4">
        <Link to="/" className="font-display text-xl font-extrabold tracking-tight">
          {BRAND.name}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium text-white/75 transition-colors hover:text-white',
                  isActive && 'text-teal',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button asChild variant="outline" size="sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/book">Book pickup</Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{BRAND.name}</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <SheetClose asChild key={item.to}>
                  <Link
                    to={item.to}
                    className="rounded-md px-3 py-3 text-base font-medium text-navy hover:bg-off-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <SheetClose asChild>
                <Link
                  to="/about"
                  className="rounded-md px-3 py-3 text-base font-medium text-navy hover:bg-off-white"
                  onClick={() => setOpen(false)}
                >
                  About
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link
                  to="/contact"
                  className="rounded-md px-3 py-3 text-base font-medium text-navy hover:bg-off-white"
                  onClick={() => setOpen(false)}
                >
                  Contact
                </Link>
              </SheetClose>
            </nav>
            <div className="mt-auto flex flex-col gap-2 pt-8">
              <SheetClose asChild>
                <Button asChild variant="secondary">
                  <Link to="/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
              </SheetClose>
              <SheetClose asChild>
                <Button asChild>
                  <Link to="/book" onClick={() => setOpen(false)}>
                    Book pickup
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
