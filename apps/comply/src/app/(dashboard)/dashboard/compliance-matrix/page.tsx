'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Filter,
  ArrowUpDown,
  Loader2,
  FileWarning,
} from 'lucide-react'
import type { ComplianceEntry, ComplianceCoverage } from '@/lib/compliance-matrix'

// ---------------------------------------------------------------------------
// Types (API response wrappers)
// ---------------------------------------------------------------------------

interface CoverageSummary {
  covered: number
  partial: number
  gap: number
  coveragePercent: number
}

interface MatrixResponse {
  matrix: ComplianceEntry[]
  total: number
  coverage: CoverageSummary
}

type CoverageResponse = ComplianceCoverage

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FRAMEWORKS = ['All', 'EU AI Act', 'GDPR', 'DORA', 'NIS2', 'SOC 2', 'ENISA PQC'] as const
type FrameworkFilter = (typeof FRAMEWORKS)[number]

const STATUS_FILTERS = ['All', 'covered', 'partial', 'gap'] as const
type StatusFilter = (typeof STATUS_FILTERS)[number]

type SortField = 'featureName' | 'status' | 'category'

const STATUS_CONFIG: Record<
  ComplianceEntry['status'],
  { icon: React.FC<{ className?: string }>; color: string; bg: string; label: string }
> = {
  covered: { icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Covered' },
  partial: { icon: ShieldAlert, color: 'text-amber-700', bg: 'bg-amber-50', label: 'Partial' },
  gap: { icon: ShieldX, color: 'text-red-700', bg: 'bg-red-50', label: 'Gap' },
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ComplianceMatrixPage() {
  const [matrix, setMatrix] = useState<ComplianceEntry[]>([])
  const [coverage, setCoverage] = useState<CoverageSummary | null>(null)
  const [frameworkStats, setFrameworkStats] = useState<CoverageResponse['byFramework'] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [frameworkFilter, setFrameworkFilter] = useState<FrameworkFilter>('All')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All')
  const [sortField, setSortField] = useState<SortField>('status')
  const [sortAsc, setSortAsc] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Coverage stats are global — fetch once on mount
  useEffect(() => {
    fetch('/api/compliance-matrix?view=coverage')
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load coverage data')
        return r.json() as Promise<CoverageResponse>
      })
      .then((data) => setFrameworkStats(data.byFramework))
      .catch(() => {})
  }, [])

  // Matrix data depends on framework filter
  useEffect(() => {
    setLoading(true)
    setError(null)
    const frameworkParam =
      frameworkFilter !== 'All' ? `&framework=${encodeURIComponent(frameworkFilter)}` : ''

    fetch(`/api/compliance-matrix?view=full${frameworkParam}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load compliance matrix')
        return r.json() as Promise<MatrixResponse>
      })
      .then((data) => {
        setMatrix(data.matrix)
        setCoverage(data.coverage)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load compliance data')
      })
      .finally(() => setLoading(false))
  }, [frameworkFilter])

  // Client-side status filter + sort
  const filtered = matrix
    .filter((e) => statusFilter === 'All' || e.status === statusFilter)
    .sort((a, b) => {
      const statusOrder = { gap: 0, partial: 1, covered: 2 }
      let cmp = 0
      if (sortField === 'status') {
        cmp = statusOrder[a.status] - statusOrder[b.status]
      } else if (sortField === 'featureName') {
        cmp = a.featureName.localeCompare(b.featureName)
      } else if (sortField === 'category') {
        cmp = a.category.localeCompare(b.category)
      }
      return sortAsc ? cmp : -cmp
    })

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-graphite-light">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        <span className="text-sm">Loading compliance matrix...</span>
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
          Compliance Matrix
        </h1>
        <p className="text-sm text-graphite-med">
          Platform features mapped to EU AI Act, GDPR, DORA, NIS2, SOC 2, and ENISA PQC frameworks
        </p>
      </div>

      {/* Coverage summary cards */}
      {coverage && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SummaryCard
            label="Full Coverage"
            value={`${coverage.coveragePercent}%`}
            sub={`${coverage.covered} of ${coverage.covered + coverage.partial + coverage.gap} features fully covered`}
            accent="teal"
          />
          <SummaryCard
            label="Fully Covered"
            value={String(coverage.covered)}
            sub="Features with complete mapping"
            accent="emerald"
          />
          <SummaryCard
            label="Partial"
            value={String(coverage.partial)}
            sub="Features needing enhancement"
            accent="amber"
          />
          <SummaryCard
            label="Gaps Identified"
            value={String(coverage.gap)}
            sub="Features not yet implemented"
            accent="red"
          />
        </div>
      )}

      {/* Per-framework stats */}
      {frameworkStats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {Object.entries(frameworkStats).map(([fw, stats]) => (
            <button
              key={fw}
              onClick={() => setFrameworkFilter(fw as FrameworkFilter)}
              className={`rounded-lg border p-3 text-left transition-colors ${
                frameworkFilter === fw
                  ? 'border-accent bg-accent-light'
                  : 'border-graphite-ghost bg-white hover:border-graphite-ghost hover:bg-bone'
              }`}
            >
              <p className="text-xs font-medium text-graphite-med truncate">{fw}</p>
              <p className="text-lg font-bold text-graphite mt-0.5">
                {stats.covered}/{stats.total}
              </p>
              <div className="mt-1 h-1.5 w-full rounded-full bg-graphite-whisper overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${stats.total > 0 ? (stats.covered / stats.total) * 100 : 0}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-graphite-light" />
          <span className="text-sm font-medium text-graphite-med">Framework:</span>
          <select
            value={frameworkFilter}
            onChange={(e) => setFrameworkFilter(e.target.value as FrameworkFilter)}
            className="h-8 px-2 text-sm border border-graphite-ghost rounded-brand bg-white text-graphite focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {FRAMEWORKS.map((fw) => (
              <option key={fw} value={fw}>
                {fw}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
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
                {sf === 'All' ? 'All' : STATUS_CONFIG[sf].label}
              </button>
            ))}
          </div>
        </div>
        <span className="text-xs text-graphite-light ml-auto">
          {filtered.length} of {matrix.length} entries
        </span>
      </div>

      {/* Matrix table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-brand border border-graphite-ghost shadow-sm p-12 text-center">
          <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <FileWarning className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="font-semibold text-graphite mb-2">No matching entries</h2>
          <p className="text-sm text-graphite-med">
            Try adjusting the framework or status filters.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-brand border border-graphite-ghost shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-graphite-ghost bg-bone">
                <th className="text-left p-3 font-medium text-graphite-med">
                  <button
                    onClick={() => toggleSort('status')}
                    className="inline-flex items-center gap-1 hover:text-graphite"
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-3 font-medium text-graphite-med">
                  <button
                    onClick={() => toggleSort('featureName')}
                    className="inline-flex items-center gap-1 hover:text-graphite"
                  >
                    Feature
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-3 font-medium text-graphite-med hidden md:table-cell">
                  <button
                    onClick={() => toggleSort('category')}
                    className="inline-flex items-center gap-1 hover:text-graphite"
                  >
                    Category
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="text-left p-3 font-medium text-graphite-med hidden lg:table-cell">
                  Regulations
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => {
                const cfg = STATUS_CONFIG[entry.status]
                const Icon = cfg.icon
                const isExpanded = expandedId === entry.featureId

                return (
                  <tr
                    key={entry.featureId}
                    onClick={() => setExpandedId(isExpanded ? null : entry.featureId)}
                    className="border-b border-graphite-ghost last:border-b-0 cursor-pointer hover:bg-bone transition-colors"
                  >
                    <td className="p-3 align-top">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}
                      >
                        <Icon className="h-3 w-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="p-3 align-top">
                      <p className="font-medium text-graphite">{entry.featureName}</p>
                      {isExpanded && (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs text-graphite-med leading-relaxed">
                            {entry.description}
                          </p>
                          <p className="text-xs font-mono text-graphite-light">
                            {entry.implementationPath}
                          </p>
                          {/* Show regulations inline on mobile (hidden in lg column) */}
                          <div className="lg:hidden flex flex-wrap gap-1 mt-1">
                            {entry.regulations.map((reg, i) => (
                              <span
                                key={i}
                                className="text-xs bg-graphite-whisper text-graphite-med px-2 py-0.5 rounded"
                                title={reg.description}
                              >
                                {reg.framework}: {reg.article}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="p-3 align-top hidden md:table-cell">
                      <span className="text-xs text-graphite-med capitalize">
                        {entry.category.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="p-3 align-top hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {entry.regulations.slice(0, isExpanded ? undefined : 3).map((reg, i) => (
                          <span
                            key={i}
                            className="text-xs bg-graphite-whisper text-graphite-med px-2 py-0.5 rounded"
                            title={reg.description}
                          >
                            {reg.framework}: {reg.article}
                          </span>
                        ))}
                        {!isExpanded && entry.regulations.length > 3 && (
                          <span className="text-xs text-graphite-light">
                            +{entry.regulations.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cross-link to SOC 2 */}
      <div className="mt-8 pt-6 border-t border-graphite-ghost">
        <p className="text-sm text-graphite-med">
          For SOC 2 Type II readiness assessment, see{' '}
          <Link href="/dashboard/soc2" className="text-accent hover:text-accent-dark font-medium">
            SOC 2 Dashboard &rarr;
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
  accent: 'teal' | 'emerald' | 'amber' | 'red'
}) {
  const colors: Record<string, string> = {
    teal: 'border-l-teal-500',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    red: 'border-l-red-500',
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
