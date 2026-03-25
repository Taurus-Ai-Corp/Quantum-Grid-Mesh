const FEATURE_PILLS = [
  'ML-DSA FIPS 204',
  'ML-KEM FIPS 203',
  'EU AI ACT AUG 2026',
  '37 AI AGENTS',
]

const STATUS_ITEMS = [
  { label: 'NIST FIPS 204 Compliant', color: 'bg-[var(--accent)]' },
  { label: 'EU AI Act Ready', color: 'bg-[var(--accent)]' },
  { label: 'Blockchain Audit Trail', color: 'bg-[var(--accent)]' },
  { label: 'SOC 2 Pending', color: 'bg-[#D4A017]' },
]

export default function Hero() {
  return (
    <section className="relative pt-40 pb-20 min-h-screen flex items-center overflow-hidden">
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--graphite-ghost) 1px, transparent 1px), linear-gradient(90deg, var(--graphite-ghost) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-[var(--accent)] mb-6 px-4 py-[6px] border border-[var(--accent)]">
          <span className="block w-5 h-px bg-[var(--accent)]" aria-hidden="true" />
          /// QUANTUM-SAFE COMPLIANCE INFRASTRUCTURE
        </div>

        {/* H1 */}
        <h1
          className="font-[var(--font-heading)] font-bold leading-[1.05] tracking-[-0.02em] mb-4"
          style={{ fontSize: 'clamp(40px, 5vw, 64px)', maxWidth: '720px' }}
        >
          Compliance-First
          <br />
          <span className="gradient-text">Post-Quantum</span>
          <br />
          Cryptography
        </h1>

        {/* Sub-headline */}
        <p className="text-[22px] font-normal text-[var(--graphite-med)] tracking-[-0.01em] mt-3">
          Get quantum-safe in 45 minutes, not months.
        </p>

        {/* Description */}
        <p className="mt-6 max-w-[560px] text-[16px] leading-[1.7] text-[var(--graphite-med)]">
          Built on{' '}
          <span className="font-mono text-[var(--accent)] text-[13px]">NIST FIPS 203/204</span>,
          aligned with the{' '}
          <span className="font-mono text-[var(--accent)] text-[13px]">EU AI Act (Aug 2026)</span>{' '}
          and{' '}
          <span className="font-mono text-[var(--accent)] text-[13px]">SWIFT CSP 2027</span>{' '}
          mandates. 37 AI agents continuously discover, assess, and remediate your cryptographic
          exposure — no consultants required.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center gap-2 mt-8">
          {FEATURE_PILLS.map((pill) => (
            <span
              key={pill}
              className="font-mono text-[11px] font-medium tracking-[0.06em] uppercase px-3 py-[5px] border border-[var(--graphite-ghost)] text-[var(--graphite-med)]"
            >
              {pill}
            </span>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 mt-10 flex-wrap">
          <a href="/scan" className="btn-primary">
            Free PQC Scan
            <span aria-hidden="true">→</span>
          </a>
          <a href="#differentiators" className="btn-secondary">
            Why Q-Grid
          </a>
        </div>

        {/* Status bar */}
        <div className="flex items-center flex-wrap gap-x-8 gap-y-3 mt-16 pt-6 border-t border-[var(--graphite-ghost)] font-mono text-[11px] tracking-[0.08em] uppercase text-[var(--graphite-med)]">
          {STATUS_ITEMS.map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`w-[6px] h-[6px] rounded-full ${color}`} aria-hidden="true" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
