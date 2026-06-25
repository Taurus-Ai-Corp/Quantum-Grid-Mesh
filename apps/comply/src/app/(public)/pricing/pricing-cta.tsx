'use client'

import { useAuth } from '@/lib/auth-context'

interface PricingCtaProps {
  plan: 'starter' | 'growth'
  featured: boolean
  label: string
}

export function PricingCta({ plan, featured, label }: PricingCtaProps) {
  const { user } = useAuth()

  const planUrl = plan === 'growth' 
    ? '/api/billing/checkout?plan=growth'
    : '/api/billing/checkout?plan=starter'

  return (
    <div className="mt-8 text-center">
      {user ? (
        <a
          href={planUrl}
          className={`inline-flex items-center justify-center rounded-brand px-6 py-3 text-sm font-semibold shadow-sm transition-colors ${
            featured
              ? 'bg-accent text-white hover:bg-accent-dark'
              : 'bg-graphite text-white hover:bg-graphite-light'
          }`}
        >
          {label}
        </a>
      ) : (
        <a
          href={`/sign-in?redirect=/pricing`}
          className={`inline-flex items-center justify-center rounded-brand px-6 py-3 text-sm font-semibold shadow-sm transition-colors ${
            featured
              ? 'bg-accent text-white hover:bg-accent-dark'
              : 'bg-graphite text-white hover:bg-graphite-light'
          }`}
        >
          {label}
        </a>
      )}
    </div>
  )
}