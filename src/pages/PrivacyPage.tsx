import { PageMeta } from '@/components/seo/PageMeta'

export function PrivacyPage() {
  return (
    <>
      <PageMeta
        title="Privacy — FreshFold"
        description="FreshFold privacy policy draft placeholder. Counsel-approved copy required before live service."
      />
      <section className="section-pad mx-auto max-w-3xl py-14 md:py-20">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-teal">
          FreshFold
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold text-navy">
          Privacy policy
        </h1>
        <p className="mt-4 rounded-md border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-dark">
          Draft placeholder — TODO: replace with counsel-approved privacy policy
          before claiming live service. Legal entity name and data practices are
          not yet verified.
        </p>
        <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted">
          <p>
            FreshFold (“we”) respects your privacy. This Phase 1 demo site
            stores limited form drafts in your browser’s local storage only. We
            do not transmit contact or commercial inquiries to a server in demo
            mode.
          </p>
          <p>
            When Phase 2 launches with Supabase Auth, Stripe, and Resend, this
            policy will describe what personal data we collect (account,
            address, order, and payment metadata), why we process it, retention,
            and your rights under applicable law.
          </p>
          <p>
            Do not submit sensitive personal information through demo forms.
            Contact details shown on this site are placeholders pending verified
            business information.
          </p>
        </div>
      </section>
    </>
  )
}
