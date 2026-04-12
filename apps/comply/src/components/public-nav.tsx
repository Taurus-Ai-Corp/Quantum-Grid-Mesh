'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { JurisdictionBadge } from './jurisdiction-badge'

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-sm border-b border-graphite-ghost">
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo + jurisdiction badge */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="font-heading text-lg font-bold tracking-tight text-graphite"
          >
            <span>GRIDERA</span>
            <span className="text-graphite-faint mx-1">|</span>
            <span className="text-accent">COMPLY</span>
          </Link>
          <JurisdictionBadge jurisdiction="eu" size="sm" />
        </div>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm text-graphite-med hover:text-graphite transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-graphite-med hover:text-graphite transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-sm text-graphite-med hover:text-graphite transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* CTA buttons (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-medium text-graphite border border-graphite-ghost rounded-brand hover:bg-graphite-whisper transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="hidden sm:inline-flex items-center h-9 px-4 text-sm font-semibold text-white bg-accent rounded-brand hover:bg-accent-dark transition-colors"
          >
            Start Free Trial
          </Link>

          {/* Hamburger button — visible on mobile */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-brand border border-graphite-ghost text-graphite hover:bg-graphite-whisper transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-b border-graphite-ghost shadow-lg">
          <nav className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col gap-3">
            <Link
              href="#features"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-graphite-med hover:text-graphite transition-colors py-2"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-graphite-med hover:text-graphite transition-colors py-2"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-graphite-med hover:text-graphite transition-colors py-2"
            >
              Contact
            </Link>
            <div className="border-t border-graphite-ghost pt-3 mt-1 flex flex-col gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-graphite border border-graphite-ghost rounded-brand hover:bg-graphite-whisper transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-semibold text-white bg-accent rounded-brand hover:bg-accent-dark transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
