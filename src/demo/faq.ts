export interface FaqItem {
  id: string
  question: string
  answer: string
  category: 'offer' | 'pricing' | 'service' | 'care' | 'areas'
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is',
    category: 'offer',
    question: 'What is FreshFold?',
    answer:
      'FreshFold is a laundry pickup and delivery service for busy households and light commercial accounts in Massachusetts. We schedule pickup, partner facilities wash and finish your laundry, and we deliver it folded back to your door.',
  },
  {
    id: 'grand-slam',
    category: 'offer',
    question: 'What does “Get Your Laundry Day Back” mean?',
    answer:
      'It’s our Grand Slam Offer: scheduled pickup, professional wash & fold (or specialty care), and folded delivery — so you never spend a Saturday on laundry.',
  },
  {
    id: 'how-pricing',
    category: 'pricing',
    question: 'How does pricing work?',
    answer:
      'Wash & fold is priced per pound with a minimum order. One-time is $2.99/lb (min $89.99), weekly is $2.69/lb (min $79.99), and express is $3.29/lb (min $99.99). Final charge is settled after actual weight at intake. Specialty items are quoted separately.',
  },
  {
    id: 'first-pickup',
    category: 'pricing',
    question: 'What is the First Pickup Special?',
    answer:
      'New customers in active service ZIPs can save 10% on their first completed order, up to a maximum of $15. It is one-time only and cannot be combined with other promotions. In Phase 1 demo mode the discount is shown for reference only and is not charged or applied live.',
  },
  {
    id: 'care-promise',
    category: 'care',
    question: 'What is the Care Promise?',
    answer:
      'If something isn’t right, contact us within 48 hours of delivery. We’ll evaluate a rewash or credit. Final legal wording will be confirmed before live service.',
  },
  {
    id: 'areas',
    category: 'areas',
    question: 'Where do you pick up?',
    answer:
      'Phase 1 launch geography is Canton and Stoughton, plus selected Brockton and Mattapan ZIP codes. Use the ZIP checker on the site — demo ZIPs are clearly labeled. Exact launch list may still change before go-live.',
  },
  {
    id: 'turnaround',
    category: 'service',
    question: 'How long does a typical order take?',
    answer:
      'Standard wash & fold typically returns on your scheduled delivery window. Express is available for faster turnaround. Exact windows depend on your ZIP and selected plan.',
  },
  {
    id: 'preferences',
    category: 'service',
    question: 'Can I set detergent and fold preferences?',
    answer:
      'Yes. During booking you can choose detergent, softener, water temperature, and fold style preferences. Those preferences travel with your order.',
  },
  {
    id: 'payment-demo',
    category: 'pricing',
    question: 'Will I be charged when I book on this site?',
    answer:
      'No. Phase 1 booking is a demo flow. The payment step is marked Phase 2 and does not charge a card. Live Stripe payments arrive in Phase 2.',
  },
  {
    id: 'commercial',
    category: 'service',
    question: 'Do you serve small businesses?',
    answer:
      'Yes — light commercial accounts (salons, clinics, offices, short-term rentals) can inquire via the Commercial page. Phase 1 forms are demo-only and are not submitted to a backend.',
  },
]
