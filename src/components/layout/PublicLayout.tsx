import { Outlet } from 'react-router-dom'

import { DemoBanner } from '@/components/layout/DemoBanner'
import { MobileBookCta } from '@/components/layout/MobileBookCta'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { JsonLd } from '@/components/seo/JsonLd'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <SiteHeader />
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>
      <SiteFooter />
      <MobileBookCta />
      <JsonLd />
    </div>
  )
}
