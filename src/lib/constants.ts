export const BRAND = {
  name: 'FreshFold',
  tagline: 'Get Your Laundry Day Back.',
  supportSentence:
    'Doorstep pickup or partner drop-off where offered, then wash & fold and folded return — so laundry never steals your weekend.',
  region: 'Massachusetts — Canton, Stoughton & select Greater Boston ZIPs',
} as const

export const DEMO_MODE =
  import.meta.env.VITE_DEMO_MODE !== 'false' &&
  import.meta.env.VITE_DEMO_MODE !== '0'

/** Feature flag: hide until verified customer reviews exist. */
export const REVIEWS_ENABLED = false

export const CONTACT = {
  // TODO: replace with verified public support email / phone before go-live
  email: 'hello@freshfold.example',
  phone: '(781) 555-0142',
  hours: 'Mon–Sat, 8am–7pm ET',
} as const
