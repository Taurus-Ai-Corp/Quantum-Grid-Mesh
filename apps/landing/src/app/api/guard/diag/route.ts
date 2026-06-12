import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET() {
  const key = process.env['STRIPE_SECRET_KEY']
  if (!key) return NextResponse.json({ error: 'no key' }, { status: 500 })
  const prefix = key.slice(0, 8) + '...'
  try {
    const s = new Stripe(key, { apiVersion: '2026-03-25.dahlia' })
    const bal = await s.balance.retrieve()
    return NextResponse.json({
      ok: true, prefix,
      mode: bal.livemode ? 'LIVE' : 'TEST',
      currency: bal.available[0]?.currency,
    })
  } catch (e: any) {
    return NextResponse.json({
      ok: false, prefix, error: e.message,
      type: e.type, code: e.code, httpStatus: e.statusCode,
    }, { status: 500 })
  }
}
