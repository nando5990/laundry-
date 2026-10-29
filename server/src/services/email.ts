import { Resend } from 'resend'

export async function sendBookingConfirmation(params: {
  to: string
  fullName: string
  bookingId: string
  pickupSummary: string
  estimateLabel: string
}) {
  const key = process.env.RESEND_API_KEY
  const from =
    process.env.EMAIL_FROM ?? 'FreshFold <bookings@freshfold.example>'

  if (!key) {
    console.log(
      '[email] RESEND_API_KEY missing — logging confirmation instead:',
      {
        to: params.to,
        bookingId: params.bookingId,
        pickupSummary: params.pickupSummary,
      },
    )
    return { sent: false, logged: true }
  }

  const resend = new Resend(key)
  await resend.emails.send({
    from,
    to: params.to,
    subject: 'FreshFold booking confirmed',
    text: [
      `Hi ${params.fullName},`,
      '',
      'Your FreshFold pickup is scheduled.',
      `Booking: ${params.bookingId}`,
      `Pickup: ${params.pickupSummary}`,
      `Estimate: ${params.estimateLabel}`,
      '',
      'Final charge settles after actual weight at intake.',
      '— FreshFold',
    ].join('\n'),
  })
  return { sent: true, logged: false }
}
