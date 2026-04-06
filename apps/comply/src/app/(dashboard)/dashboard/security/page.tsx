'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Key, AlertTriangle, RefreshCw, X, CheckCircle, Loader2, BookOpen } from 'lucide-react'
import { MigrationWizard } from '@/components/migration-wizard'

// ---------- Types ----------

type KeyAlgorithm =
  | 'ML-DSA-44'
  | 'ML-DSA-65'
  | 'ML-DSA-87'
  | 'ML-KEM-512'
  | 'ML-KEM-768'
  | 'ML-KEM-1024'
  | 'RSA-2048'

type KeyType = 'Signing' | 'Encryption'
type KeyStatus = 'Active' | 'Deprecated' | 'Revoked'

interface KeyRecord {
  id: string
  algorithm: KeyAlgorithm
  type: KeyType
  status: KeyStatus
  created: string
  lastUsed: string
  isPqc: boolean
}

// ---------- Demo data ----------

const INITIAL_KEYS: KeyRecord[] = [
  {
    id: 'key-1',
    algorithm: 'ML-DSA-65',
    type: 'Signing',
    status: 'Active',
    created: '2026-03-25',
    lastUsed: '2026-03-29',
    isPqc: true,
  },
  {
    id: 'key-2',
    algorithm: 'ML-KEM-768',
    type: 'Encryption',
    status: 'Active',
    created: '2026-03-25',
    lastUsed: '2026-03-28',
    isPqc: true,
  },
  {
    id: 'key-3',
    algorithm: 'ML-DSA-44',
    type: 'Signing',
    status: 'Active',
    created: '2026-03-20',
    lastUsed: '2026-03-27',
    isPqc: true,
  },
  {
    id: 'key-4',
    algorithm: 'RSA-2048',
    type: 'Signing',
    status: 'Deprecated',
    created: '2025-11-01',
    lastUsed: '2026-01-15',
    isPqc: false,
  },
]

const PQC_ALGORITHMS: KeyAlgorithm[] = [
  'ML-DSA-44',
  'ML-DSA-65',
  'ML-DSA-87',
  'ML-KEM-512',
  'ML-KEM-768',
  'ML-KEM-1024',
]

// ---------- Helper sub-components ----------

function StatusPill({ status }: { status: KeyStatus }) {
  const styles: Record<KeyStatus, { color: string; bg: string }> = {
    Active: { color: 'text-emerald-700', bg: 'bg-emerald-50' },
    Deprecated: { color: 'text-amber-700', bg: 'bg-amber-50' },
    Revoked: { color: 'text-red-700', bg: 'bg-red-50' },
  }
  const s = styles[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${s.color} ${s.bg}`}>
      {status}
    </span>
  )
}

function AlgoBadge({ algorithm, isPqc }: { algorithm: string; isPqc: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold font-[var(--font-mono)] ${
        isPqc
          ? 'text-[var(--accent)] bg-[var(--accent-light)]'
          : 'text-amber-700 bg-amber-50'
      }`}
    >
      {algorithm}
    </span>
  )
}

// ---------- Quantum Readiness Gauge ----------

function QuantumGauge({ pqcCount, total }: { pqcCount: number; total: number }) {
  const pct = total > 0 ? Math.round((pqcCount / total) * 100) : 0
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (pct / 100) * circumference

  return (
    <div className="bg-white rounded-[var(--radius)] border border-[var(--graphite-ghost)] shadow-sm p-6">
      <h2 className="font-semibold text-sm text-[var(--graphite)] mb-4 flex items-center gap-2">
        <Shield className="h-4 w-4 text-[var(--accent)]" />
        Quantum Readiness
      </h2>

      <div className="flex items-center gap-6">
        {/* SVG gauge */}
        <div className="relative shrink-0 w-[132px] h-[132px] flex items-center justify-center">
          <svg width="132" height="132" viewBox="0 0 132 132">
            {/* Track */}
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke="var(--graphite-ghost)"
              strokeWidth="12"
            />
            {/* Progress */}
            <circle
              cx="66"
              cy="66"
              r={radius}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 66 66)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-[var(--font-heading)] text-2xl font-bold text-[var(--graphite)]">
              {pct}%
            </span>
            <span className="text-[10px] text-[var(--graphite-light)] uppercase tracking-wide mt-0.5">
              quantum-safe
            </span>
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[var(--graphite)] mb-2">
            Your organisation is{' '}
            <span className="text-[var(--accent)] font-semibold">{pct}% quantum-ready</span>
          </p>
          <p className="text-xs text-[var(--graphite-med)] mb-4 leading-relaxed">
            {pqcCount} of {total} keys use NIST-standardised post-quantum algorithms (ML-DSA / ML-KEM).
          </p>

          {/* Recommendations */}
          {total - pqcCount > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-[var(--graphite-light)] uppercase tracking-wide">
                Migration recommendations
              </p>
              <div className="flex items-start gap-2 text-xs text-amber-700">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span>Migrate RSA-2048 signing key to ML-DSA-65 (NIST Level 3)</span>
              </div>
            </div>
          )}
          {total - pqcCount === 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-700">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              <span>All keys use quantum-safe algorithms. No migration needed.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------- Key Rotation Modal ----------

type RotationStep = 'configure' | 'rotating' | 'success'

function RotationModal({
  keyRecord,
  onClose,
  onComplete,
}: {
  keyRecord: KeyRecord
  onClose: () => void
  onComplete: (keyId: string, newAlgorithm: KeyAlgorithm) => void
}) {
  const [step, setStep] = useState<RotationStep>('configure')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<KeyAlgorithm>(
    keyRecord.isPqc ? keyRecord.algorithm : 'ML-DSA-65'
  )
  const [newKeyId] = useState(() => `key-${Date.now()}`)

  function handleRotate() {
    setStep('rotating')
    // Simulate 2s key generation
    setTimeout(() => {
      setStep('success')
    }, 2000)
  }

  function handleDone() {
    onComplete(keyRecord.id, selectedAlgorithm)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step === 'rotating' ? undefined : onClose}
      />
      <div className="relative bg-white rounded-[var(--radius)] shadow-xl border border-[var(--graphite-ghost)] w-full max-w-md p-6">
        {step !== 'rotating' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[var(--graphite-light)] hover:text-[var(--graphite)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-6">
          {(['configure', 'rotating', 'success'] as RotationStep[]).map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-colors ${
                  s === step
                    ? 'bg-[var(--accent)]'
                    : i < (['configure', 'rotating', 'success'] as RotationStep[]).indexOf(step)
                    ? 'bg-[var(--accent-dark)]'
                    : 'bg-[var(--graphite-ghost)]'
                }`}
              />
              {i < 2 && <div className="h-px w-6 bg-[var(--graphite-ghost)]" />}
            </div>
          ))}
          <span className="ml-2 text-xs text-[var(--graphite-light)] capitalize">{step === 'rotating' ? 'Generating…' : step}</span>
        </div>

        {/* Step: Configure */}
        {step === 'configure' && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] flex items-center justify-center shrink-0">
                <RefreshCw className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <div>
                <h2 className="font-semibold text-base text-[var(--graphite)]">Rotate Key</h2>
                <p className="text-xs text-[var(--graphite-med)]">Configure new quantum-safe keypair</p>
              </div>
            </div>

            {/* Current key info */}
            <div className="bg-[var(--bone)] rounded-[var(--radius)] border border-[var(--graphite-ghost)] p-4 mb-5 text-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--graphite-light)] uppercase tracking-wide">Current Key</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--graphite-med)] text-xs">Algorithm:</span>
                <AlgoBadge algorithm={keyRecord.algorithm} isPqc={keyRecord.isPqc} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--graphite-med)] text-xs">Created:</span>
                <span className="font-[var(--font-mono)] text-xs text-[var(--graphite)]">{keyRecord.created}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--graphite-med)] text-xs">Type:</span>
                <span className="text-xs text-[var(--graphite)]">{keyRecord.type}</span>
              </div>
            </div>

            {/* New algorithm selector */}
            <div className="mb-5">
              <label className="block text-xs font-semibold text-[var(--graphite)] mb-2 uppercase tracking-wide">
                New Algorithm
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PQC_ALGORITHMS.map((alg) => (
                  <button
                    key={alg}
                    onClick={() => setSelectedAlgorithm(alg)}
                    className={`px-3 py-2.5 rounded-[var(--radius)] border text-xs font-[var(--font-mono)] font-semibold text-left transition-colors ${
                      selectedAlgorithm === alg
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]'
                        : 'border-[var(--graphite-ghost)] hover:border-[var(--accent)] text-[var(--graphite-med)] hover:text-[var(--graphite)]'
                    }`}
                  >
                    {alg}
                    {alg === 'ML-DSA-65' || alg === 'ML-KEM-768' ? (
                      <span className="ml-1 text-[9px] text-[var(--accent)] font-sans font-medium">★ Recommended</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-[var(--radius)] p-3 mb-5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>Dependent systems will be updated automatically. Old key remains valid for 30 days.</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRotate}
                className="flex-1 h-10 text-sm font-semibold text-white bg-[var(--accent)] rounded-[var(--radius)] hover:bg-[var(--accent-dark)] transition-colors"
              >
                Rotate Key
              </button>
              <button
                onClick={onClose}
                className="h-10 px-4 text-sm font-medium text-[var(--graphite-med)] hover:text-[var(--graphite)] transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {/* Step: Rotating */}
        {step === 'rotating' && (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--accent-light)] flex items-center justify-center mb-5">
              <Loader2 className="h-7 w-7 text-[var(--accent)] animate-spin" />
            </div>
            <h2 className="font-semibold text-base text-[var(--graphite)] mb-2">
              Generating new quantum-safe keypair…
            </h2>
            <p className="text-xs text-[var(--graphite-med)] leading-relaxed max-w-xs">
              Using {selectedAlgorithm} (NIST FIPS {selectedAlgorithm.startsWith('ML-DSA') ? '204' : '203'}).
              This takes a moment.
            </p>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <>
            <div className="flex flex-col items-center py-4 text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
              <h2 className="font-semibold text-base text-[var(--graphite)] mb-1">Key Rotated Successfully</h2>
              <p className="text-xs text-[var(--graphite-med)]">
                New {selectedAlgorithm} keypair is now active.
              </p>
            </div>

            <div className="bg-[var(--bone)] rounded-[var(--radius)] border border-[var(--graphite-ghost)] p-4 mb-5 text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--graphite-med)]">New Algorithm:</span>
                <AlgoBadge algorithm={selectedAlgorithm} isPqc={true} />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--graphite-med)]">Key ID:</span>
                <span className="font-[var(--font-mono)] text-xs text-[var(--graphite)]">{newKeyId.slice(-12)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-[var(--radius)] p-3 mb-5">
              <CheckCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>Previous key deprecated. 30-day revocation grace period active.</span>
            </div>

            <button
              onClick={handleDone}
              className="w-full h-10 text-sm font-semibold text-white bg-[var(--accent)] rounded-[var(--radius)] hover:bg-[var(--accent-dark)] transition-colors"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  )
}

// ---------- Main Page ----------

export default function SecurityPage() {
  const [keys, setKeys] = useState<KeyRecord[]>(INITIAL_KEYS)
  const [rotatingKey, setRotatingKey] = useState<KeyRecord | null>(null)

  const totalKeys = keys.length
  const pqcKeys = keys.filter((k) => k.isPqc)
  const legacyKeys = keys.filter((k) => !k.isPqc)
  const today = new Date('2026-03-29')
  const needRotation = keys.filter((k) => {
    const created = new Date(k.created)
    const diffDays = (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    return diffDays > 90
  })

  function handleRotationComplete(keyId: string, newAlgorithm: KeyAlgorithm) {
    setKeys((prev) =>
      prev.map((k) => {
        if (k.id === keyId) {
          return {
            ...k,
            status: 'Deprecated' as KeyStatus,
          }
        }
        return k
      }).concat({
        id: `key-${Date.now()}`,
        algorithm: newAlgorithm,
        type: keys.find((k) => k.id === keyId)?.type ?? 'Signing',
        status: 'Active',
        created: '2026-03-29',
        lastUsed: '2026-03-29',
        isPqc: true,
      })
    )
  }

  const STAT_CARDS = [
    {
      label: 'Total Keys',
      value: totalKeys,
      icon: Key,
      description: 'All cryptographic keys',
      colorClass: 'text-[var(--graphite)]',
      bgClass: 'bg-[var(--accent-light)]',
      iconClass: 'text-[var(--accent)]',
    },
    {
      label: 'Quantum-Safe',
      value: pqcKeys.length,
      icon: Shield,
      description: 'ML-DSA / ML-KEM keys',
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50',
      iconClass: 'text-emerald-600',
    },
    {
      label: 'Legacy',
      value: legacyKeys.length,
      icon: AlertTriangle,
      description: 'RSA / ECDSA keys',
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50',
      iconClass: 'text-amber-600',
    },
    {
      label: 'Need Rotation',
      value: needRotation.length,
      icon: RefreshCw,
      description: 'Keys older than 90 days',
      colorClass: 'text-red-700',
      bgClass: 'bg-red-50',
      iconClass: 'text-red-600',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[var(--font-heading)] text-2xl font-bold text-[var(--graphite)] mb-1">
            Security
          </h1>
          <p className="text-sm text-[var(--graphite-med)]">
            Post-quantum key management and quantum readiness
          </p>
        </div>
        <Link
          href="/dashboard/security/algorithms"
          className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-[var(--accent)] border border-[var(--accent)] rounded-[var(--radius)] hover:bg-[var(--accent-light)] transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Algorithm Reference
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-white rounded-[var(--radius)] p-5 border border-[var(--graphite-ghost)] shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-[var(--graphite-light)] uppercase tracking-wide">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bgClass}`}>
                  <Icon className={`h-4 w-4 ${card.iconClass}`} />
                </div>
              </div>
              <p className={`font-[var(--font-heading)] text-3xl font-bold ${card.colorClass}`}>
                {card.value}
              </p>
              <p className="text-xs text-[var(--graphite-light)] mt-1">{card.description}</p>
            </div>
          )
        })}
      </div>

      {/* Migration Wizard */}
      <div className="mb-8">
        <MigrationWizard />
      </div>

      {/* Two-column layout: table + gauge */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">

        {/* Key inventory table */}
        <div className="bg-white rounded-[var(--radius)] border border-[var(--graphite-ghost)] shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--graphite-ghost)] flex items-center justify-between">
            <h2 className="font-semibold text-sm text-[var(--graphite)] flex items-center gap-2">
              <Key className="h-4 w-4 text-[var(--accent)]" />
              Key Inventory
            </h2>
            <span className="text-xs text-[var(--graphite-light)]">{keys.length} keys</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--graphite-ghost)] bg-[var(--bone)]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--graphite-light)] uppercase tracking-wide">
                  Algorithm
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--graphite-light)] uppercase tracking-wide hidden sm:table-cell">
                  Type
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--graphite-light)] uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--graphite-light)] uppercase tracking-wide hidden md:table-cell">
                  Created
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--graphite-light)] uppercase tracking-wide hidden lg:table-cell">
                  Last Used
                </th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => (
                <tr
                  key={key.id}
                  className="border-b border-[var(--graphite-ghost)] last:border-0 hover:bg-[var(--bone)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <AlgoBadge algorithm={key.algorithm} isPqc={key.isPqc} />
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="text-xs text-[var(--graphite-med)]">{key.type}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusPill status={key.status} />
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="font-[var(--font-mono)] text-xs text-[var(--graphite-light)]">
                      {key.created}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="font-[var(--font-mono)] text-xs text-[var(--graphite-light)]">
                      {key.lastUsed}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {key.status === 'Active' ? (
                        <button
                          onClick={() => setRotatingKey(key)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Rotate
                        </button>
                      ) : key.status === 'Deprecated' ? (
                        <>
                          <button
                            onClick={() => setRotatingKey(key)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors"
                          >
                            Migrate
                          </button>
                          <button
                            onClick={() =>
                              setKeys((prev) =>
                                prev.map((k) =>
                                  k.id === key.id ? { ...k, status: 'Revoked' as KeyStatus } : k
                                )
                              )
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-[var(--graphite-faint)]">Revoked</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quantum Readiness Gauge */}
        <QuantumGauge
          pqcCount={keys.filter((k) => k.isPqc && k.status === 'Active').length}
          total={keys.filter((k) => k.status === 'Active').length}
        />
      </div>

      {/* Rotation modal */}
      {rotatingKey && (
        <RotationModal
          keyRecord={rotatingKey}
          onClose={() => setRotatingKey(null)}
          onComplete={handleRotationComplete}
        />
      )}
    </div>
  )
}
