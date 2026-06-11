import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe | null {
  const key = process.env['STRIPE_SECRET_KEY']
  if (!key) return null
  if (!_stripe) {
    _stripe = new Stripe(key, { apiVersion: '2026-03-25.dahlia' })
  }
  return _stripe
}

export function getResend(): { apiKey: string; from: string } | null {
  const apiKey = process.env['RESEND_API_KEY']
  if (!apiKey) return null
  return { apiKey, from: process.env['RESEND_FROM_EMAIL'] ?? 'GRIDERA <noreply@gridera.net>' }
}
