import Stripe from 'stripe'

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  // Use account-default API version from the secret key environment
  return new Stripe(key)
}

/**
 * Create a SetupIntent to save a payment method (test mode when sk_test_*).
 * Charge-after-weight: TODO create PaymentIntent after invoiceCents is set;
 * never trust client amounts.
 */
export async function createSetupIntent(params: {
  customerId?: string
  email: string
  orderId: string
  metadata?: Record<string, string>
}) {
  const stripe = getStripe()
  if (!stripe) {
    return {
      ok: false as const,
      reason: 'STRIPE_SECRET_KEY missing — SetupIntent stubbed',
      clientSecret: null,
      setupIntentId: null,
    }
  }

  let customerId = params.customerId
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: params.email,
      metadata: { orderId: params.orderId },
    })
    customerId = customer.id
  }

  const intent = await stripe.setupIntents.create({
    customer: customerId,
    usage: 'off_session',
    metadata: {
      orderId: params.orderId,
      ...params.metadata,
    },
  })

  return {
    ok: true as const,
    reason: null,
    clientSecret: intent.client_secret,
    setupIntentId: intent.id,
    customerId,
  }
}

/**
 * TODO(Phase 2 polish / Phase 3): after weight + invoiceCents,
 * create PaymentIntent with amount = invoiceCents using saved payment method.
 * Webhook handler must be idempotent on stripe event.id → payment_records.stripe_event_id.
 */
export async function chargeAfterWeightStub(params: {
  amountCents: number
  paymentMethodId: string
  customerId: string
  orderId: string
}) {
  const stripe = getStripe()
  if (!stripe) {
    return {
      ok: false as const,
      reason: 'STRIPE_SECRET_KEY missing — charge-after-weight not executed',
    }
  }
  // Intentionally not charging in Phase 2 MVP without explicit ops confirmation.
  console.log(
    '[stripe] charge-after-weight stub — would charge',
    params.amountCents,
    'for order',
    params.orderId,
  )
  return {
    ok: false as const,
    reason:
      'TODO: enable PaymentIntent charge-after-weight after ops sign-off (test mode only until live keys)',
  }
}
