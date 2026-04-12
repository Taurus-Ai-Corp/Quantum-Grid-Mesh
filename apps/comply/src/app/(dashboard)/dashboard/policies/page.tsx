'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  FileText,
  Clock,
  Key,
  Users,
  Database,
  Loader2,
  Copy,
  Check,
  ChevronLeft,
} from 'lucide-react'
import { POLICY_TYPES, type GeneratedPolicy } from '@/lib/policy-generator'

// ---------------------------------------------------------------------------
// Constants (icon mapping is UI-specific, kept local)
// ---------------------------------------------------------------------------

const POLICY_TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  'information-security': ShieldCheck,
  'data-protection': Database,
  'incident-response': Clock,
  'data-retention': FileText,
  'key-management': Key,
  'third-party-risk': Users,
}

const JURISDICTION = (process.env['NEXT_PUBLIC_JURISDICTION'] ?? 'eu').toLowerCase()

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PoliciesPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [policy, setPolicy] = useState<GeneratedPolicy | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Org context form state
  const [orgName, setOrgName] = useState('')
  const [industry, setIndustry] = useState('')
  const [dpoName, setDpoName] = useState('')
  const [dpoEmail, setDpoEmail] = useState('')
  const [dataResidency, setDataResidency] = useState('')

  async function handleGenerate() {
    if (!selectedType || !orgName.trim()) return

    setLoading(true)
    setError(null)
    setPolicy(null)

    try {
      const res = await fetch('/api/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: selectedType,
          org: {
            orgName: orgName.trim(),
            industry: industry.trim() || 'Technology',
            dpoName: dpoName.trim() || 'Data Protection Officer',
            dpoEmail: dpoEmail.trim() || 'dpo@organization.com',
            jurisdiction: JURISDICTION,
            dataResidency: dataResidency.trim() || JURISDICTION.toUpperCase(),
            lastReviewDate: new Date().toISOString().split('T')[0],
          },
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(data.error ?? `HTTP ${res.status}`)
      }

      const data = (await res.json()) as GeneratedPolicy
      setPolicy(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to generate policy')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!policy) return
    await navigator.clipboard.writeText(policy.markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleBack() {
    setSelectedType(null)
    setPolicy(null)
    setError(null)
  }

  // -------------------------------------------------------------------------
  // Render: Policy preview
  // -------------------------------------------------------------------------

  if (policy) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1 text-sm text-graphite-med hover:text-graphite mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to policy types
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-heading text-2xl font-bold text-graphite mb-1">
              {policy.title}
            </h1>
            <p className="text-sm text-graphite-med">
              {policy.metadata.jurisdiction} &middot; v{policy.metadata.version} &middot;{' '}
              {new Date(policy.metadata.generatedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-graphite-ghost bg-white text-graphite hover:bg-bone transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy Markdown'}
          </button>
        </div>

        <div className="bg-white rounded-lg border border-graphite-ghost shadow-sm p-6">
          <pre className="whitespace-pre-wrap text-sm font-mono text-graphite leading-relaxed bg-transparent p-0 m-0 overflow-x-auto">
            {policy.markdown}
          </pre>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Render: Generator form (type selected)
  // -------------------------------------------------------------------------

  if (selectedType) {
    const typeInfo = POLICY_TYPES.find((t) => t.id === selectedType)
    const Icon = POLICY_TYPE_ICONS[selectedType] ?? FileText

    return (
      <div>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-1 text-sm text-graphite-med hover:text-graphite mb-4 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to policy types
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-accent-light flex items-center justify-center">
              <Icon className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-graphite">
                {typeInfo?.title ?? 'Generate Policy'}
              </h1>
              <p className="text-sm text-graphite-med">{typeInfo?.description}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg border border-graphite-ghost shadow-sm p-6">
          <h2 className="font-semibold text-graphite mb-4">Organization Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-graphite-med mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                placeholder="Acme Corp"
                className="w-full h-10 px-3 text-sm border border-graphite-ghost rounded-lg bg-white text-graphite placeholder:text-graphite-light focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite-med mb-1">
                Industry
              </label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Financial Services"
                className="w-full h-10 px-3 text-sm border border-graphite-ghost rounded-lg bg-white text-graphite placeholder:text-graphite-light focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite-med mb-1">
                DPO Name
              </label>
              <input
                type="text"
                value={dpoName}
                onChange={(e) => setDpoName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full h-10 px-3 text-sm border border-graphite-ghost rounded-lg bg-white text-graphite placeholder:text-graphite-light focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-graphite-med mb-1">
                DPO Email
              </label>
              <input
                type="email"
                value={dpoEmail}
                onChange={(e) => setDpoEmail(e.target.value)}
                placeholder="dpo@acme.com"
                className="w-full h-10 px-3 text-sm border border-graphite-ghost rounded-lg bg-white text-graphite placeholder:text-graphite-light focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-graphite-med mb-1">
                Data Residency Region
              </label>
              <input
                type="text"
                value={dataResidency}
                onChange={(e) => setDataResidency(e.target.value)}
                placeholder="EU (Frankfurt)"
                className="w-full h-10 px-3 text-sm border border-graphite-ghost rounded-lg bg-white text-graphite placeholder:text-graphite-light focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || !orgName.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-accent text-white hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Generating...' : 'Generate Policy'}
            </button>
            <span className="text-xs text-graphite-light">
              Jurisdiction: {JURISDICTION.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Render: Policy type selection
  // -------------------------------------------------------------------------

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-graphite mb-1">
          Policy Generator
        </h1>
        <p className="text-sm text-graphite-med">
          Generate jurisdiction-aware compliance policies customized to your organization.
          Select a policy type to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {POLICY_TYPES.map((type) => {
          const Icon = POLICY_TYPE_ICONS[type.id] ?? FileText
          return (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className="text-left bg-white rounded-lg border border-graphite-ghost shadow-sm p-5 hover:border-accent hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-bone group-hover:bg-accent-light flex items-center justify-center mb-3 transition-colors">
                <Icon className="h-5 w-5 text-graphite-med group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-semibold text-graphite mb-1">{type.title}</h3>
              <p className="text-xs text-graphite-med leading-relaxed">
                {type.description}
              </p>
            </button>
          )
        })}
      </div>

      <p className="text-xs text-graphite-light mt-4">
        Tip: Run an{' '}
        <Link href="/dashboard/assessments" className="text-accent hover:text-accent-dark">
          assessment
        </Link>
        {' '}first to identify which policies your organization needs.
      </p>
    </div>
  )
}
