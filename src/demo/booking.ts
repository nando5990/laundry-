import type { PricingPlan } from './pricing'

export type BookingStep =
  | 'service'
  | 'address'
  | 'schedule'
  | 'preferences'
  | 'review'
  | 'payment'

export type IntakeMode = 'doorstep' | 'dropoff'
export type ReturnMode = 'doorstep' | 'partner-pickup'

export const BOOKING_STEPS: { id: BookingStep; label: string }[] = [
  { id: 'service', label: 'Service' },
  { id: 'address', label: 'Address' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'review', label: 'Review' },
  { id: 'payment', label: 'Payment' },
]

export interface BookingDraft {
  planId: PricingPlan['id']
  intakeMode: IntakeMode
  returnMode: ReturnMode
  estimatedBags: string
  fullName: string
  email: string
  phone: string
  street: string
  unit: string
  city: string
  zip: string
  pickupDay: string
  pickupWindow: string
  detergent: string
  softener: string
  foldStyle: string
  notes: string
  applyFirstPickup: boolean
  /** Selected fixed-price retail add-on ids (see RETAIL_ADDONS). */
  retailAddonIds: string[]
}

export const EMPTY_BOOKING: BookingDraft = {
  planId: 'one-time',
  intakeMode: 'doorstep',
  returnMode: 'doorstep',
  estimatedBags: '2',
  fullName: '',
  email: '',
  phone: '',
  street: '',
  unit: '',
  city: '',
  zip: '',
  pickupDay: '',
  pickupWindow: '',
  detergent: 'hypoallergenic',
  softener: 'none',
  foldStyle: 'standard',
  notes: '',
  applyFirstPickup: true,
  retailAddonIds: [],
}

export const DEMO_PICKUP_DAYS = [
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const DEMO_PICKUP_WINDOWS = [
  '8:00–10:00 AM',
  '10:00 AM–12:00 PM',
  '12:00–2:00 PM',
  '2:00–4:00 PM',
  '4:00–6:00 PM',
]

/** Same window grid reused for partner drop-off hours in demo. */
export const DEMO_DROPOFF_DAYS = DEMO_PICKUP_DAYS
export const DEMO_DROPOFF_WINDOWS = DEMO_PICKUP_WINDOWS

export const DETERGENT_OPTIONS = [
  { value: 'hypoallergenic', label: 'Hypoallergenic' },
  { value: 'standard', label: 'Standard scent-free' },
  { value: 'fresh', label: 'Light fresh scent' },
]

export const SOFTENER_OPTIONS = [
  { value: 'none', label: 'No softener' },
  { value: 'liquid', label: 'Liquid softener' },
  { value: 'sheets', label: 'Dryer sheets' },
]

export const FOLD_OPTIONS = [
  { value: 'standard', label: 'Standard fold' },
  { value: 'hang', label: 'Hang shirts when possible' },
  { value: 'rolled', label: 'Rolled for drawers' },
]
