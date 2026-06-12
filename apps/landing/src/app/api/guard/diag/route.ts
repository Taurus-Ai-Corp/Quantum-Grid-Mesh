import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

// DIAG ROUTE - 2026-06-11
// Purpose: surface the Vercel-side Stripe state without leaking the key.
// Gated by DIAG_SECRET env var (required) - constant-time comparison to avoid timing
// side-channels. Accepts the secret via ?secret=... query string OR Authorization: Bearer header.
// Without a valid secret: returns 401 with no body, so the route appears unconfigured to
// anyone who doesn't have the secret. Set DIAG_SECRET in Vercel dashboard, then pass it
// to the user as a one-time value when they need to debug Stripe. DELETE THIS FILE after
// the Stripe checkout is fixed in production.
//
// NOTE: This route does NOT import the Stripe SDK - it inspects the key prefix only.
// This avoids adding the Stripe dep to apps/landing/ just for a debug route. The
// most common Stripe 500 cause (sk_test_ in production) is detected by prefix alone.
// If you need a full Stripe account.retrieve() connectivity check, move this route
// to packages/guard/api/ which already has the Stripe SDK.

interface DiagResult {
  ok: boolean
  timestamp: string
  env: {
    nodeEnv: string
    vercelEnv: string | null
    vercelRegion: string | null
  }
  stripe: {
    keyPresent: boolean
    keyMode: 'test' | 'live' | 'unknown'
    keyFingerprint: string
    apiVersionConfigured: string
  }
  secrets: {
    resendConfigured: boolean
    publicAppUrl: string | null
    byoCloudEndpointConfigured: boolean
  }
  warning: string | null
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function extractSecret(req: Request): string | null {
  // Prefer Authorization: Bearer header (logs are cleaner, no secret in URL)
  const auth = req.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) return auth.slice(7).trim()
  // Fallback: ?secret=... query string (for quick curl checks)
  const url = new URL(req.url)
  const q = url.searchParams.get('secret')
  return q?.trim() ?? null
}

function secretMatches(provided: string, expected: string): boolean {
  // Constant-time comparison. Equal length required for timingSafeEqual.
  if (provided.length !== expected.length) return false
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  const expected = process.env['DIAG_SECRET']
  if (!expected) {
    // No DIAG_SECRET configured = route is effectively disabled. Return 404 to avoid
    // disclosing that the route exists at all.
    return new NextResponse(null, { status: 404 })
  }
  const provided = extractSecret(req)
  if (!provided || !secretMatches(provided, expected)) {
    return new NextResponse(null, { status: 401 })
  }

  const result: DiagResult = {
    ok: false,
    timestamp: new Date().toISOString(),
    env: {
      nodeEnv: process.env['NODE_ENV'] ?? 'unknown',
      vercelEnv: process.env['VERCEL_ENV'] ?? null,
      vercelRegion: process.env['VERCEL_REGION'] ?? null,
    },
    stripe: {
      keyPresent: false,
      keyMode: 'unknown',
      keyFingerprint: 'absent',
      apiVersionConfigured: '2026-03-25.dahlia',
    },
    secrets: {
      resendConfigured: false,
      publicAppUrl: process.env['NEXT_PUBLIC_APP_URL'] ?? null,
      byoCloudEndpointConfigured: false,
    },
    warning: null,
  }

  const key = process.env['STRIPE_SECRET_KEY']
  if (!key) {
    result.warning = 'STRIPE_SECRET_KEY is not set in the Vercel environment. This is the most common cause of the checkout 500.'
    return NextResponse.json(result, { status: 200 })
  }

  result.stripe.keyPresent = true
  result.stripe.keyMode = key.startsWith('sk_live_') ? 'live' : key.startsWith('sk_test_') ? 'test' : 'unknown'
  // Fingerprint: last 6 chars only. Never expose the prefix or the full key.
  result.stripe.keyFingerprint = '...' + key.slice(-6)
  result.ok = true

  if (process.env['RESEND_API_KEY']) result.secrets.resendConfigured = true
  if (process.env['BYO_CLOUD_ENDPOINT']) result.secrets.byoCloudEndpointConfigured = true

  // If the key is in test mode but the Vercel env is production, flag it.
  if (result.stripe.keyMode === 'test' && result.env.vercelEnv === 'production') {
    result.warning = 'STRIPE_SECRET_KEY is a TEST key (sk_test_...) but Vercel is in production env. This is the most likely cause of the 500. Swap to sk_live_... in Vercel dashboard → Project Settings → Environment Variables.'
  } else if (result.stripe.keyMode === 'live' && result.env.vercelEnv === 'preview') {
    result.warning = 'STRIPE_SECRET_KEY is a LIVE key but Vercel is in preview env. Live keys should never be used in preview.'
  }

  return NextResponse.json(result, { status: 200 })
}
