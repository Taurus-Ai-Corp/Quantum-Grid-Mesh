import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getStripe } from '@/lib/billing'
import { GUARD_TIERS, type GuardTier } from '@/lib/guard-tiers'

const checkoutSchema = z.object({
  tier: z.enum(['smb', 'enterprise']),
  email: z.string().email(),
  annual: z.boolean().optional().default(false),
})

// POST /api/guard/checkout — start Stripe Checkout for a Guard subscription
// Free (sandbox) tier skips Stripe and goes to /guard/signup instead.
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })

    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }

    const { tier, email, annual } = parsed.data
    const plan = GUARD_TIERS[tier as GuardTier]

    const stripe = getStripe()
    if (!stripe) {
      return NextResponse.json({ error: 'Billing not configured' }, { status: 503 })
    }

    const unitAmount = annual ? plan.annualMonthly * 12 : plan.monthlyPrice
    const interval = annual ? ('year' as const) : ('month' as const)

    const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `GRIDERA Guard ${plan.name}`,
              description: plan.tagline,
            },
            unit_amount: unitAmount,
            recurring: { interval },
          },
          quantity: 1,
        },
      ],
      // 14-day trial — no charge until day 15
      subscription_data: {
        trial_period_days: 14,
        metadata: { tier, email },
      },
      success_url: `${appUrl}/guard/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/guard`,
      metadata: { tier, email },
      // Allow promo codes
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (err) {
    console.error('[guard/checkout] Error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
