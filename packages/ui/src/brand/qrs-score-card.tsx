import * as React from 'react'
import { cn } from '../lib/utils.js'

interface QrsScoreCardProps {
  score: number
  riskLevel: 'critical' | 'high' | 'moderate' | 'low'
  className?: string
}

const riskColors: Record<QrsScoreCardProps['riskLevel'], string> = {
  critical: 'text-red-500 border-red-500/30',
  high: 'text-amber-500 border-amber-500/30',
  moderate: 'text-yellow-500 border-yellow-500/30',
  low: 'text-[var(--accent)] border-[var(--accent)]/30',
}

export function QrsScoreCard({ score, riskLevel, className }: QrsScoreCardProps) {
  return (
    <div className={cn('border bg-[var(--bone-deep)] p-6 text-center', riskColors[riskLevel], className)}>
      <div className="font-heading text-5xl font-bold">{score}</div>
      <div className="mt-1 font-mono text-xs uppercase tracking-widest text-[var(--graphite-med)]">QRS Score</div>
      <div className={cn('mt-2 font-mono text-xs uppercase tracking-wider', riskColors[riskLevel])}>
        {riskLevel} risk
      </div>
    </div>
  )
}
