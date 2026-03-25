const GEO_CARDS = [
  {
    flag: '🇨🇦',
    region: 'North America',
    href: 'https://comply.q-grid.net',
    regs: ['OSFI B-13', 'PIPEDA', 'SOC 2 Type II'],
    tag: 'NA',
  },
  {
    flag: '🇪🇺',
    region: 'European Union',
    href: 'https://comply.q-grid.eu',
    regs: ['EU AI Act', 'GDPR', 'DORA'],
    tag: 'EU',
  },
  {
    flag: '🇮🇳',
    region: 'India',
    href: 'https://comply.q-grid.in',
    regs: ['DPDP Act 2023', 'RBI FREE-AI', 'SEBI'],
    tag: 'IN',
  },
  {
    flag: '🇦🇪',
    region: 'UAE',
    href: 'https://comply.q-grid.ae',
    regs: ['VARA', 'DFSA', 'CBUAE'],
    tag: 'AE',
  },
]

export default function GeoSelector() {
  return (
    <section id="jurisdictions" className="py-[100px]">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section label */}
        <div className="flex items-baseline gap-4 mb-12">
          <span className="font-mono text-[14px] text-[var(--accent)] tracking-[0.02em]">02</span>
          <div>
            <h2 className="font-[var(--font-heading)] text-[28px] font-semibold tracking-[-0.02em] leading-[1.2] text-[var(--graphite)]">
              Choose Your Jurisdiction
            </h2>
            <p className="font-mono text-[11px] tracking-[0.1em] uppercase text-[var(--graphite-med)] mt-1">
              Region-specific compliance, data residency, and regulatory alignment
            </p>
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--graphite-ghost)]">
          {GEO_CARDS.map(({ flag, region, href, regs, tag }) => (
            <a
              key={tag}
              href={href}
              className="geo-card block p-8 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Flag */}
              <div className="text-3xl mb-4" aria-hidden="true">
                {flag}
              </div>

              {/* Region + tag */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[var(--font-heading)] font-semibold text-[17px] text-[var(--graphite)]">
                  {region}
                </h3>
                <span className="font-mono text-[10px] font-medium tracking-[0.1em] uppercase px-2 py-[3px] border border-[var(--graphite-ghost)] text-[var(--graphite-med)]">
                  {tag}
                </span>
              </div>

              {/* Regulations */}
              <ul className="space-y-1 mb-6">
                {regs.map((r) => (
                  <li
                    key={r}
                    className="font-mono text-[12px] tracking-[0.04em] text-[var(--graphite-med)] flex items-center gap-2"
                  >
                    <span className="w-[4px] h-[4px] bg-[var(--accent)] shrink-0" aria-hidden="true" />
                    {r}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <span className="font-mono text-[12px] font-medium tracking-[0.06em] uppercase text-[var(--accent)] group-hover:underline">
                Get Started →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
