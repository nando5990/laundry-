import { Link, useLocation } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function MobileBookCta() {
  const { pathname } = useLocation()
  if (pathname.startsWith('/book')) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 p-3 backdrop-blur md:hidden">
      <Button asChild className="w-full" size="lg">
        <Link to="/book">Book pickup</Link>
      </Button>
    </div>
  )
}
