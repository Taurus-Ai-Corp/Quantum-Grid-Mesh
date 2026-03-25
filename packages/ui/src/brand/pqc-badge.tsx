import * as React from 'react'
import { Shield } from 'lucide-react'
import { cn } from '../lib/utils.js'

interface PqcBadgeProps {
  algorithm?: string
  verified?: boolean
  className?: string
}

export function PqcBadge({ algorithm = 'ML-DSA-65', verified = true, className }: PqcBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-medium border',
        verified
          ? 'text-[var(--accent)] border-[var(--accent)]/30 bg-[var(--accent-glow)]'
          : 'text-[var(--graphite-light)] border-[var(--graphite-ghost)] bg-[var(--graphite-whisper)]',
        className,
      )}
    >
      <Shield className="w-3 h-3" />
      <span>
        {algorithm} {verified ? 'Signed' : 'Unsigned'}
      </span>
    </div>
  )
}
