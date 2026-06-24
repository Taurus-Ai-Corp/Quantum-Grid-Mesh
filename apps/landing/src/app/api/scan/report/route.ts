import { NextResponse } from 'next/server'
import { getStripe, getStripeInitError } from '@/lib/billing'
import { getScanResult } from '@/lib/scan-store'

// POST /api/scan/report — start Stripe Checkout for the 40-page PQC report ($6,750 USD)
//
// Body: { scanId: string, email: string }
// Flow:
//   1. Look up the scan result in the in-memory store.
//   2. If not found (or expired), 404.
//   3. Create a Stripe Checkout Session (one-time payment, $6,750.00 USD).
//   4. Return { url } so the client can redirect to Stripe.
//
// Success URL: https://eu.q-grid.net/scan/report?scanId={scanId}&session_id={CHECKOUT_SESSION_ID}
// Cancel URL:  https://eu.q-grid.net/scan/results?scanId={scanId}
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    const { scanId, email } = body as { scanId?: string; email?: string }

    if (!scanId || typeof scanId !== 'string') {
      return NextResponse.json({ error: 'scanId is required' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
    }

    // ── Look up scan result ────────────────────────────────────────────────
    const scan = getScanResult(scanId)
    if (!scan) {
      return NextResponse.json(
        { error: 'Scan not found or expired' },
        { status: 404 },
      )
    }

    // ── Stripe client ─────────────────────────────────────────────────────
    const stripe = getStripe()
    if (!stripe) {
      const initError = getStripeInitError()
      return NextResponse.json(
        {
          error: 'Billing not configured',
          hint: initError
            ? `Stripe client failed to initialise: ${initError}`
            : 'STRIPE_SECRET_KEY is not set in the environment. Add it via `vercel env add STRIPE_SECRET_KEY production`.',
        },
        { status: 500 },
      )
    }

    const domain = scan.domain

    // ── Create Checkout Session ──────────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'GRIDERA Quantum Vulnerability Assessment — 40-Page Report',
              description: `Comprehensive PQC vulnerability assessment for ${domain}`,
            },
            // $6,750.00 USD → 675000 cents
            unit_amount: 675000,
          },
          quantity: 1,
        },
      ],
      success_url: `https://eu.q-grid.net/scan/report?scanId=${encodeURIComponent(scanId)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://eu.q-grid.net/scan/results?scanId=${encodeURIComponent(scanId)}`,
      metadata: {
        scanId,
        domain,
        email,
      },
      // Secure one-time report purchase
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    // Surface the actual Stripe error message so debugging from curl/Vercel logs is possible.
    const message = err instanceof Error ? err.message : 'Unknown error'
    const stripeError =
      err && typeof err === 'object' && 'raw' in err
        ? (err as { raw?: { message?: string; code?: string; type?: string } }).raw
        : undefined
    console.error('[scan/report] Error:', message, stripeError)
    return NextResponse.json(
      {
        error: 'Checkout failed',
        detail: message,
        stripeCode: stripeError?.code,
        stripeType: stripeError?.type,
      },
      { status: 500 },
    )
  }
}