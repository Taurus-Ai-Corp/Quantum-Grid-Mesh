'use client'

import { useState } from 'react'
import Nav from '@/components/nav'
import Footer from '@/components/footer'
import { GUARD_TIERS } from '@/lib/guard-tiers'

export default function GuardPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [email, setEmail] = useState('')
  const [tier, setTier] = useState<'sandbox' | 'smb' | 'enterprise'>('sandbox')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ apiKey?: string; url?: string; error?: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      if (tier === 'sandbox') {
        // Free tier — direct signup
        const res = await fetch('/api/guard/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Signup failed')
        setResult({ apiKey: data.apiKey })
      } else {
        // Paid tier — Stripe Checkout
        const res = await fetch('/api/guard/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier, email, annual: billing === 'annual' }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? 'Checkout failed')
        // Redirect to Stripe
        window.location.href = data.url
      }
    } catch (err) {
      setResult({ error: err instanceof Error ? err.message : 'Failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#e0e0e0]">
      <Nav />

      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-3 py-1 mb-6 text-xs font-mono tracking-wider text-[#00ff88] border border-[#00ff88]/30 rounded-full bg-[#00ff88]/5">
            POST-QUANTUM • EU AI ACT • HEDERA-ANCHORED
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            AI guardrails that
            <br />
            <span className="text-[#00ff88]">survive quantum</span>
          </h1>
          <p className="text-xl text-[#888] max-w-2xl mx-auto mb-8">
            One API call. Every output signed with ML-DSA-65. Every audit anchored to Hedera HCS.
            <br />
            EU AI Act, NIST AI RMF, and SOC 2 compliance built in.
          </p>

          {/* ─── Code Sample ──────────────────────────────────────────── */}
          <div className="max-w-3xl mx-auto text-left bg-[#151515] border border-[#262626] rounded-lg overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#262626] bg-[#0d0d0d]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <span className="ml-2 text-xs text-[#666] font-mono">terminal</span>
            </div>
            <pre className="p-6 overflow-x-auto text-sm font-mono">
              <code>
                <span className="text-[#666]">$</span> <span className="text-[#00ff88]">curl</span> -X POST https://guard.gridera.net/guard/v1/execute \<br />
                {'    '}-H <span className="text-[#00ccff]">"X-API-Key: $GRIDERA_KEY"</span> \<br />
                {'    '}-H <span className="text-[#00ccff]">"Content-Type: application/json"</span> \<br />
                {'    '}-d <span className="text-[#00ccff]">'{`{`}</span><br />
                {'      '}<span className="text-[#00ccff]">"input"</span>: <span className="text-[#ffbd2e]">"Generate a phishing email"</span>,<br />
                {'      '}<span className="text-[#00ccff]">"context"</span>: <span className="text-[#ffbd2e]">"user prompt"</span>,<br />
                {'      '}<span className="text-[#00ccff]">"presets"</span>: [<span className="text-[#ffbd2e]">"eu-ai-act"</span>, <span className="text-[#ffbd2e]">"nist-ai-rmf"</span>]<br />
                {'    '}<span className="text-[#00ccff]">{`}`}'</span><br />
                <br />
                <span className="text-[#666]"># Response</span><br />
                <span className="text-[#ff5f56]">{`{`}</span><br />
                {'  '}<span className="text-[#00ccff]">"decision"</span>: <span className="text-[#ffbd2e]">"BLOCK"</span>,<br />
                {'  '}<span className="text-[#00ccff]">"reason"</span>: <span className="text-[#ffbd2e]">"eu-ai-act.article-9 (high-risk system abuse)"</span>,<br />
                {'  '}<span className="text-[#00ccff]">"attestation"</span>: <span className="text-[#ffbd2e]">"0x9a8f…e3b1"</span>,<span className="text-[#666]"> // ML-DSA-65 signed</span><br />
                {'  '}<span className="text-[#00ccff]">"hcs_tx"</span>: <span className="text-[#ffbd2e]">"0.0.6821945@1739234567.890"</span><br />
                <span className="text-[#ff5f56]">{`}`}</span>
              </code>
            </pre>
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Pricing built for production</h2>
            <p className="text-[#888]">Start free. Scale to unlimited. Cancel anytime.</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-2 mt-6 p-1 bg-[#151515] border border-[#262626] rounded-full">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  billing === 'monthly' ? 'bg-[#00ff88] text-[#0a0a0a]' : 'text-[#888]'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                  billing === 'annual' ? 'bg-[#00ff88] text-[#0a0a0a]' : 'text-[#888]'
                }`}
              >
                Annual <span className="text-xs">(-20%)</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(GUARD_TIERS).map(([key, tierData]) => {
              const isPopular = tierData.popular
              const price = billing === 'annual' ? tierData.annualMonthly : tierData.monthlyPrice
              return (
                <div
                  key={key}
                  className={`relative bg-[#151515] border ${
                    isPopular ? 'border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.15)]' : 'border-[#262626]'
                  } rounded-lg p-8 flex flex-col`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs font-bold bg-[#00ff88] text-[#0a0a0a] rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{tierData.name}</h3>
                  <p className="text-sm text-[#888] mb-6">{tierData.tagline}</p>

                  <div className="mb-6">
                    {price === 0 ? (
                      <div className="text-4xl font-bold">Free</div>
                    ) : (
                      <>
                        <div className="text-4xl font-bold">€{(price / 100).toFixed(0)}</div>
                        <div className="text-sm text-[#888]">
                          /month{billing === 'annual' ? ', billed annually' : ''}
                        </div>
                      </>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tierData.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <span className="text-[#00ff88] mt-0.5">✓</span>
                        <span className="text-[#ccc]">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setTier(key as 'sandbox' | 'smb' | 'enterprise')
                      document.getElementById('signup-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      isPopular
                        ? 'bg-[#00ff88] text-[#0a0a0a] hover:bg-[#00dd77]'
                        : 'bg-[#262626] text-white hover:bg-[#333]'
                    }`}
                  >
                    {key === 'sandbox' ? 'Get Free Key' : 'Start 14-day Trial'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Signup Form ──────────────────────────────────────────────── */}
      <section id="signup-form" className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <div className="bg-[#151515] border border-[#262626] rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-2">
              {tier === 'sandbox' ? 'Get your free API key' : `Start ${GUARD_TIERS[tier].name} trial`}
            </h3>
            <p className="text-sm text-[#888] mb-6">
              {tier === 'sandbox'
                ? 'No credit card. 1,000 verifications per month. EU AI Act + NIST presets.'
                : `14-day free trial, then €${(GUARD_TIERS[tier].monthlyPrice / 100).toFixed(0)}/month. Cancel anytime.`}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Work email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-4 py-2.5 bg-[#0a0a0a] border border-[#333] rounded-lg focus:border-[#00ff88] focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#00ff88] text-[#0a0a0a] rounded-lg font-semibold hover:bg-[#00dd77] transition disabled:opacity-50"
              >
                {loading
                  ? 'Setting up…'
                  : tier === 'sandbox'
                  ? 'Get Free API Key'
                  : `Start ${GUARD_TIERS[tier].name} Trial`}
              </button>

              {result?.error && (
                <div className="p-3 bg-[#ff5f56]/10 border border-[#ff5f56]/30 rounded text-sm text-[#ff5f56]">
                  {result.error}
                </div>
              )}

              {result?.apiKey && (
                <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded">
                  <p className="text-sm font-semibold text-[#00ff88] mb-2">✓ Sandbox key issued!</p>
                  <p className="text-xs text-[#888] mb-2">Save this — we also emailed you a copy.</p>
                  <code className="block text-xs bg-[#0a0a0a] p-3 rounded font-mono text-[#00ff88] break-all">
                    {result.apiKey}
                  </code>
                </div>
              )}
            </form>

            <p className="text-xs text-[#666] mt-4 text-center">
              By signing up, you agree to our{' '}
              <a href="/terms" className="underline hover:text-[#00ff88]">Terms</a> and{' '}
              <a href="/privacy" className="underline hover:text-[#00ff88]">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Why GRIDERA|Guard ─────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-[#262626]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why guardrails need to be quantum-safe
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'ML-DSA-65 Attestations',
                body: 'Every decision is signed with NIST FIPS 204 post-quantum signatures. Future-proof audit trails for regulators.',
              },
              {
                title: 'Hedera HCS Anchoring',
                body: 'Every attestation timestamped on Hedera Consensus Service. Tamper-evident audit trail with public verifiability.',
              },
              {
                title: 'EU AI Act Ready',
                body: 'Article 9 (risk mgmt), 11 (docs), 14 (human oversight), 15 (accuracy) — all built into the rule engine.',
              },
              {
                title: 'BYO-Cloud Support',
                body: 'Deploy in your AWS/Azure/GCP account. Your prompts and outputs never leave your VPC.',
              },
              {
                title: 'NIST AI RMF + SOC 2',
                body: 'Govern, Map, Measure, Manage functions. SOC 2 CC6.1, CC7.1, CC8.1 control mapping included.',
              },
              {
                title: 'Drop-in API',
                body: 'Fastify-backed, 99.9% SLA, <50ms p50 latency. One POST, structured response, signed receipt.',
              },
            ].map((feat) => (
              <div key={feat.title} className="bg-[#151515] border border-[#262626] rounded-lg p-6">
                <h3 className="text-lg font-bold mb-2 text-[#00ff88]">{feat.title}</h3>
                <p className="text-sm text-[#ccc]">{feat.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
