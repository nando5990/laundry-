import { useEffect } from 'react'

/**
 * LocalBusiness + Service JSON-LD stubs.
 * TODO: replace placeholder legal name, street address, phone, geo, and EIN
 * with verified business details before claiming live service.
 */
const LOCAL_BUSINESS = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'FreshFold',
  description:
    'Laundry pickup and delivery for Canton, Stoughton, and select Greater Boston ZIP codes.',
  url: 'https://freshfold.example',
  // TODO: verified public phone
  telephone: '(781) 555-0142',
  // TODO: verified legal entity name & street address
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'TODO: street address',
    addressLocality: 'Canton',
    addressRegion: 'MA',
    postalCode: '02021',
    addressCountry: 'US',
  },
  areaServed: [
    { '@type': 'City', name: 'Canton' },
    { '@type': 'City', name: 'Stoughton' },
    { '@type': 'City', name: 'Brockton' },
    { '@type': 'City', name: 'Mattapan' },
  ],
  priceRange: '$$',
}

const SERVICE = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'FreshFold Wash & Fold Pickup and Delivery',
  provider: {
    '@type': 'LocalBusiness',
    name: 'FreshFold',
  },
  areaServed: 'Massachusetts',
  serviceType: 'Laundry pickup and delivery',
}

export function JsonLd() {
  useEffect(() => {
    const ids = ['freshfold-localbusiness', 'freshfold-service']
    const payloads = [LOCAL_BUSINESS, SERVICE]

    payloads.forEach((data, i) => {
      let script = document.getElementById(ids[i]) as HTMLScriptElement | null
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = ids[i]
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(data)
    })

    return () => {
      ids.forEach((id) => document.getElementById(id)?.remove())
    }
  }, [])

  return null
}
