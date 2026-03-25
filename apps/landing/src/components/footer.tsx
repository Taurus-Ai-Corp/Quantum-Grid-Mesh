const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#differentiators' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Docs', href: '/docs' },
    { label: 'API', href: '/docs/api' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Security', href: '/security' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'DPA', href: '/dpa' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t border-[var(--graphite-ghost)] pt-16 pb-10">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="font-mono text-[14px] font-medium tracking-[0.06em] mb-4">
              <span className="text-[var(--graphite)]">Q-GRID</span>
              <span className="text-[var(--graphite-med)] mx-1">/</span>
              <span className="text-[var(--accent)]">COMPLY</span>
            </div>
            <p className="text-[14px] leading-[1.6] text-[var(--graphite-med)] max-w-[300px]">
              The first compliance-first post-quantum cryptography platform. Built for security
              teams who need to be quantum-safe before the deadline — not after.
            </p>
            {/* Jurisdiction pills */}
            <div className="flex flex-wrap gap-2 mt-6">
              {['NIST FIPS 203', 'NIST FIPS 204', 'EU AI Act', 'SWIFT 2027'].map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] font-medium tracking-[0.06em] uppercase px-3 py-[4px] border border-[var(--graphite-ghost)] text-[var(--graphite-med)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="font-mono text-[11px] font-medium tracking-[0.1em] uppercase text-[var(--graphite-med)] mb-5">
                {group}
              </p>
              <ul className="space-y-1">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-[14px] text-[var(--graphite-med)] hover:text-[var(--accent)] transition-colors duration-200 py-1 block"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-[var(--graphite-ghost)] pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--graphite-light)]">
            &copy; {new Date().getFullYear()} Taurus AI Corp. Ontario, Canada &middot; Dubai IFZA
            &middot; Wyoming LLC
          </p>
          <p className="font-mono text-[11px] tracking-[0.06em] text-[var(--graphite-light)]">
            Powered by{' '}
            <a
              href="https://hedera.com"
              className="text-[var(--accent)] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hedera
            </a>{' '}
            &middot; NIST FIPS 203/204
          </p>
        </div>
      </div>
    </footer>
  )
}
