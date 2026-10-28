export type ServiceAreaCity =
  | 'Canton'
  | 'Stoughton'
  | 'Brockton'
  | 'Mattapan'

export interface DemoZip {
  zip: string
  city: ServiceAreaCity
  note?: string
}

/**
 * Phase 1 demo service ZIPs.
 * Exact launch list is a polish blocker — treat as sample data only.
 */
export const DEMO_SERVICE_ZIPS: DemoZip[] = [
  { zip: '02021', city: 'Canton' },
  { zip: '02072', city: 'Stoughton' },
  { zip: '02301', city: 'Brockton', note: 'Sample launch ZIP' },
  { zip: '02302', city: 'Brockton', note: 'Sample launch ZIP' },
  { zip: '02126', city: 'Mattapan', note: 'Sample launch ZIP' },
]

export const DEMO_ZIP_SET = new Set(
  DEMO_SERVICE_ZIPS.map((z) => z.zip),
)

export function normalizeZip(input: string): string {
  return input.replace(/\D/g, '').slice(0, 5)
}

export function lookupDemoZip(input: string): DemoZip | null {
  const zip = normalizeZip(input)
  if (zip.length !== 5) return null
  return DEMO_SERVICE_ZIPS.find((z) => z.zip === zip) ?? null
}

export function isDemoServiceZip(input: string): boolean {
  return lookupDemoZip(input) !== null
}
