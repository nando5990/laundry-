import { Navigate, Route, Routes } from 'react-router-dom'

import { PublicLayout } from '@/components/layout/PublicLayout'
import { AboutPage } from '@/pages/AboutPage'
import { AdminPage } from '@/pages/AdminPage'
import { AppPortalPage } from '@/pages/AppPortalPage'
import { BookPage } from '@/pages/BookPage'
import { CommercialPage } from '@/pages/CommercialPage'
import { ContactPage } from '@/pages/ContactPage'
import { FaqPage } from '@/pages/FaqPage'
import { HomePage } from '@/pages/HomePage'
import { HowItWorksPage } from '@/pages/HowItWorksPage'
import { LoginPage } from '@/pages/LoginPage'
import { PricingPage } from '@/pages/PricingPage'
import { PrivacyPage } from '@/pages/PrivacyPage'
import { ServiceAreasPage } from '@/pages/ServiceAreasPage'
import { TermsPage } from '@/pages/TermsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="how-it-works" element={<HowItWorksPage />} />
        <Route path="pricing" element={<PricingPage />} />
        <Route path="book" element={<BookPage />} />
        <Route path="service-areas" element={<ServiceAreasPage />} />
        <Route path="commercial" element={<CommercialPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="app" element={<AppPortalPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
