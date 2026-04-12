'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Filter,
  Loader2,
  FileWarning,
} from 'lucide-react'
import type {
  Soc2ControlMapping,
  Soc2ReadinessScore,
} from '@/lib/soc2-mapper'

// ---------------------------------------------------------------------------
// Types (API response)
// ---------------------------------------------------------------------------

interface FullResponse {
  mappings: Soc2ControlMapping[]
  total: number
  score: Soc2ReadinessScore
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_FILTERS = ['all', 'met', 'partial', 'not-met'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

const STATUS_CONFIG: Record<
  Soc2ControlMapping['status'],
  { icon: React.FC<{ className?: string }>; color: string; bg: string; label: string }
> = {
  met: { icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Met' },
  partial: { icon: ShieldAlert, color: 'text-amber-700', bg: 'bg-amber-50', label: 'Partial' },
  'not-met': { icon: ShieldX, color: 'text-red-700', bg: 'bg-red-50', label: 'Not Met' },
}

const CATEGORY_COLORS: Record<string, string> = {
  Security: 'border-l-blue-500',
  Availability: 'border-l-purple-500',
  'Processing Integrity': 'border-l-teal-500',
  Confidentiality: 'border-l-amber-500',
  Privacy: 'border-l-rose-500',
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Soc2Page() {
  const [mappings, setMappings] = useState<Soc2ControlMapping[]>([])
  const [score, setScore] = useState<Soc2ReadinessScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  useEffect(() => {
    setLoading(true)
    setError(null)

    fetch('/api/soc2?view=full')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load SOC 2 data')
        return r.json() as Promise<FullResponse>
      })
      .then((data) => {
        setMappings(data.mappings)
        setScore(data.score)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load SOC 2 data')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = mappings.filter(
    (m) => statusFilter === 'all' || m.status === statusFilter,
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-graphite-light">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm">Loading SOC 2 readiness data...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-brand p-4 mb-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-graphite mb-1">
          SOC 2 Type II Readiness
        </h1>
        <p className="text-sm text-graphite-med">
          Trust Services Criteria controls mapped to platform features with readiness scoring
        </p>
      </div>

      {/* Readiness score + stat cards */}
      {score && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <SummaryCard
            label="Overall Readiness"
            value={`${score.overall}%`}
            sub={`${score.totalControls} controls assessed`}
            accent="teal"
          />
          <SummaryCard
            label="Controls Met"
            value={String(score.metControls)}
            sub="Fully satisfied"
            accent="emerald"
          />
          <SummaryCard
            label="Partial"
            value={String(score.partialControls)}
            sub="Needs enhancement"
            accent="amber"
          />
          <SummaryCard
            label="Gaps"
            value={String(score.gapControls)}
            sub="Not yet addressed"
            accent="red"
          />
          <SummaryCard
            label="Total Controls"
            value={String(score.totalControls)}
            sub="Across 5 TSC categories"
            accent="blue"
          />
        </div>
      )}

      {/* Per-category breakdown */}
      {score && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
          {Object.entries(score.byCategory).map(([cat, catScore]) => (
            <div
              key={cat}
              className={`rounded-lg border border-graphite-ghost bg-white p-3 border-l-4 ${CATEGORY_COLORS[cat] ?? 'border-l-gray-500'}`}
            >
              <p className="text-xs font-medium text-graphite-med truncate">{cat}</p>
              <p className="text-lg font-bold text-graphite mt-0.5">{catScore}%</p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-graphite-whisper overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${catScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-graphite-light" />
          <span className="text-sm font-medium text-graphite-med">Status:</span>
          <div className="flex gap-1">
            {STATUS_FILTERS.map((sf) => (
              <button
                key={sf}
                onClick={() => setStatusFilter(sf)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  statusFilter === sf
                    ? 'bg-accent text-white'
                    : 'bg-graphite-whisper text-graphite-med hover:bg-graphite-ghost'
                }`}
              >
                {sf === 'all' ? 'All' : STATUS_CONFIG[sf as Soc2ControlMapping['status']].label}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-graphite-light ml-auto">
          {filtered.length} of {mappings.length} controls
        </span>
      </div>

      {/* Controls table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-brand border border-graphite-ghost shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <FileWarning className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="font-semibold text-graphite mb-2">No matching controls</h2>
          <p className="text-sm text-graphite-med">
            Try adjusting the status filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-brand border border-graphite-ghost shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-graphite-ghost bg-bone">
                <th className="text-left p-3 font-medium text-graphite-med">Control</th>
                <th className="text-left p-3 font-medium text-graphite-med hidden md:table-cell">
                  Category
                </th>
                <th className="text-left p-3 font-medium text-graphite-med">Status</th>
                <th className="text-left p-3 font-medium text-graphite-med hidden lg:table-cell">
                  Platform Feature
                </th>
                <th className="text-left p-3 font-medium text-graphite-med hidden xl:table-cell">
                  Gap / Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => {
                const cfg = STATUS_CONFIG[m.status]
                const Icon = cfg.icon

                return (
                  <tr
                    key={m.controlId}
                    className="border-b border-graphite-ghost last:border-b-0 hover:bg-bone transition-colors"
                  >
                    <td className="p-3 align-top">
                      <p className="font-medium text-graphite">
                        <span className="font-mono text-xs text-graphite-light mr-1.5">
                          {m.controlId}
                        </span>
                        {m.controlTitle}
                      </p>
                      {/* Show category + feature on mobile */}
                      <div className="md:hidden mt-1 space-y-1">
                        <span className="text-xs text-graphite-med">{m.category}</span>
                        {m.platformFeature && (
                          <p className="text-xs text-graphite-light">{m.platformFeature}</p>
                        )}
                        {m.gap && (
                          <p className="text-xs text-red-600">{m.gap}</p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 align-top hidden md:table-cell">
                      <span className="text-xs text-graphite-med">{m.category}</span>
                    </td>
                    <td className="p-3 align-top">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                      >
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="p-3 align-top hidden lg:table-cell">
                      <span className="text-xs text-graphite-med">
                        {m.platformFeature ?? '—'}
                      </span>
                    </td>
                    <td className="p-3 align-top hidden xl:table-cell">
                      {m.gap ? (
                        <span className="text-xs text-red-600">{m.gap}</span>
                      ) : (
                        <span className="text-xs text-emerald-600">No action required</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cross-link to Compliance Matrix */}
      <div className="mt-8 pt-6 border-t border-graphite-ghost">
        <p className="text-sm text-graphite-med">
          For full regulatory framework mapping, see{' '}
          <Link href="/dashboard/compliance-matrix" className="text-accent hover:text-accent-dark font-medium">
            Compliance Matrix &rarr;
          </Link>
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SummaryCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string
  value: string
  sub: string
  accent: 'teal' | 'emerald' | 'amber' | 'red' | 'blue'
}) {
  const colors: Record<string, string> = {
    teal: 'border-l-teal-500',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    red: 'border-l-red-500',
    blue: 'border-l-blue-500',
  }
  return (
    <div
      className={`rounded-lg border border-graphite-ghost bg-white p-4 border-l-4 ${colors[accent]}`}
    >
      <p className="text-xs font-medium text-graphite-med">{label}</p>
      <p className="text-2xl font-bold text-graphite mt-1">{value}</p>
      <p className="text-xs text-graphite-light mt-0.5">{sub}</p>
    </div>
  )
}
