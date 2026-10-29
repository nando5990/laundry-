/**
 * Demo partner drop-off location — placeholder until a real partner address
 * is confirmed for Canton / Stoughton launch.
 */
export const DEMO_PARTNER_DROPOFF = {
  name: 'FreshFold partner — Canton demo',
  street: '450 Washington St',
  city: 'Canton',
  state: 'MA',
  zip: '02021',
  hoursNote: 'Demo drop-off windows only — not a live storefront yet.',
  demoLabel: 'Demo address — not a live partner location yet',
} as const

export function formatPartnerAddress(): string {
  const p = DEMO_PARTNER_DROPOFF
  return `${p.street}, ${p.city}, ${p.state} ${p.zip}`
}
