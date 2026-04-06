'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Shield, ArrowRight } from 'lucide-react'

// ---------- Migration state machine ----------

type MigrationState = 'LEGACY' | 'HYBRID_SIGN' | 'HYBRID_VERIFY' | 'PQC_PRIMARY' | 'PQC_ONLY'

interface StateConfig {
  label: string
  description: string
}

const STATE_CONFIGS: Record<MigrationState, StateConfig> = {
  LEGACY:        { label: 'Legacy',         description: 'Current RSA/ECDSA cryptography' },
  HYBRID_SIGN:   { label: 'Hybrid Sign',    description: 'Sign with both legacy + ML-DSA-65' },
  HYBRID_VERIFY: { label: 'Hybrid Verify',  description: 'Verify ML-DSA-65 signatures, fallback to legacy' },
  PQC_PRIMARY:   { label: 'PQC Primary',    description: 'ML-DSA-65 primary, legacy backup only' },
  PQC_ONLY:      { label: 'PQC Only',       description: 'Full quantum-safe (ML-DSA-65 / ML-KEM-768)' },
}

const STATE_ORDER: MigrationState[] = [
  'LEGACY',
  'HYBRID_SIGN',
  'HYBRID_VERIFY',
  'PQC_PRIMARY',
  'PQC_ONLY',
]

function getNextState(current: MigrationState): MigrationState | null {
  const idx = STATE_ORDER.indexOf(current)
  if (idx < STATE_ORDER.length - 1) {
    return STATE_ORDER[idx + 1] ?? null
  }
  return null
}

// ---------- Component ----------

export function MigrationWizard() {
  const [currentState, setCurrentState] = useState<MigrationState>('LEGACY')
  const [isAdvancing, setIsAdvancing] = useState(false)

  const currentIndex = STATE_ORDER.indexOf(currentState)
  const nextState = getNextState(currentState)
  const isComplete = currentState === 'PQC_ONLY'

  function handleAdvance() {
    if (!nextState || isAdvancing) return
    setIsAdvancing(true)
    setTimeout(() => {
      setCurrentState(nextState)
      setIsAdvancing(false)
    }, 2000)
  }

  return (
    <div className="bg-white rounded-[var(--radius)] border border-[var(--graphite-ghost)] shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--accent-light)] flex items-center justify-center shrink-0">
          <Shield className="h-5 w-5 text-[var(--accent)]" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-base text-[var(--graphite)]">PQC Migration Wizard</h2>
          <p className="text-xs text-[var(--graphite-med)]">
            Migrate your cryptography to NIST-standardised post-quantum algorithms
          </p>
        </div>
        {/* Step badge */}
        <div
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold font-mono border ${
            isComplete
              ? 'border-transparent bg-emerald-50 text-emerald-700'
              : 'border-[var(--graphite-ghost)] bg-[var(--bone)] text-[var(--graphite-med)]'
          }`}
        >
          {isComplete ? 'Quantum-Safe' : `Step ${currentIndex + 1} of 5`}
        </div>
      </div>

      {/* Step progress indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STATE_ORDER.map((state, idx) => {
          const isDone = idx < currentIndex
          const isCurrent = idx === currentIndex

          return (
            <div key={state} className="flex items-center gap-2 flex-1 last:flex-none">
              {/* Circle */}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold border-2 transition-colors ${
                  isDone
                    ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                    : isCurrent
                    ? 'bg-white border-[var(--accent)] text-[var(--accent)]'
                    : 'bg-white border-[var(--graphite-ghost)] text-[var(--graphite-faint)]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              {/* Connector line — not after last item */}
              {idx < STATE_ORDER.length - 1 && (
                <div
                  className={`h-px flex-1 transition-colors ${
                    idx < currentIndex ? 'bg-[var(--accent)]' : 'bg-[var(--graphite-ghost)]'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Current state display */}
      <div
        className={`rounded-[var(--radius)] border p-5 mb-6 transition-colors ${
          isComplete
            ? 'border-emerald-200 bg-emerald-50'
            : 'border-[var(--graphite-ghost)] bg-[var(--bone)]'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isComplete ? 'bg-emerald-100' : 'bg-[var(--accent-light)]'
            }`}
          >
            {isComplete ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Shield className="h-5 w-5 text-[var(--accent)]" />
            )}
          </div>
          <div>
            <p
              className={`text-sm font-semibold mb-0.5 ${
                isComplete ? 'text-emerald-800' : 'text-[var(--graphite)]'
              }`}
            >
              {STATE_CONFIGS[currentState].label}
            </p>
            <p
              className={`text-xs ${
                isComplete ? 'text-emerald-700' : 'text-[var(--graphite-med)]'
              }`}
            >
              {STATE_CONFIGS[currentState].description}
            </p>
          </div>
        </div>

        {/* Step labels row */}
        <div className="mt-4 pt-4 border-t border-[var(--graphite-ghost)] grid grid-cols-5 gap-1">
          {STATE_ORDER.map((state, idx) => {
            const isCurrent = idx === currentIndex
            const isDone = idx < currentIndex
            return (
              <div key={state} className="text-center">
                <p
                  className={`text-[10px] font-medium leading-tight ${
                    isCurrent
                      ? 'text-[var(--accent)]'
                      : isDone
                      ? 'text-[var(--graphite-med)]'
                      : 'text-[var(--graphite-faint)]'
                  }`}
                >
                  {STATE_CONFIGS[state].label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Success message */}
      {isComplete && (
        <div className="flex items-start gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-[var(--radius)] p-3 mb-5">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>Migration complete — all cryptography is quantum-safe</span>
        </div>
      )}

      {/* Advance button */}
      {!isComplete && (
        <button
          onClick={handleAdvance}
          disabled={isAdvancing}
          className="inline-flex items-center gap-2 h-10 px-6 text-sm font-semibold text-white bg-[var(--accent)] rounded-[var(--radius)] hover:bg-[var(--accent-dark)] transition-colors disabled:opacity-60 disabled:pointer-events-none"
        >
          {isAdvancing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Advancing…
            </>
          ) : (
            <>
              Advance to {nextState ? STATE_CONFIGS[nextState].label : ''}
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
