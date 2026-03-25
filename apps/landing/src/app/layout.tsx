import type { Metadata } from 'next'
import { DM_Sans, IBM_Plex_Mono, Jura } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-sans',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

const jura = Jura({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Q-Grid Comply',
    default: 'Q-Grid Comply — Post-Quantum Compliance Infrastructure',
  },
  description:
    'The first compliance-first post-quantum cryptography platform. Get quantum-safe in 45 minutes, not months. NIST FIPS 203/204, EU AI Act, SWIFT 2027.',
  openGraph: {
    title: 'Q-Grid Comply — Post-Quantum Compliance Infrastructure',
    description:
      'Get quantum-safe in 45 minutes, not months. NIST FIPS 203/204, EU AI Act Aug 2026, SWIFT 2027.',
    url: 'https://comply.q-grid.net',
    siteName: 'Q-Grid Comply',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Q-Grid Comply — Post-Quantum Compliance Infrastructure',
    description:
      'Get quantum-safe in 45 minutes, not months. 37 AI Agents. NIST FIPS 203/204.',
  },
  metadataBase: new URL('https://comply.q-grid.net'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${dmSans.variable} ${ibmPlexMono.variable} ${jura.variable}`}
    >
      <body className="bg-[var(--bone)] text-[var(--graphite)] font-[var(--font-sans)] antialiased">
        {children}
      </body>
    </html>
  )
}
