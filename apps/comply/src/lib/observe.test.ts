import { describe, it, expect } from 'vitest'
import { calculateCost, buildQueryFilters } from './observe-queries'

describe('observe cost calculation', () => {
  it('calculates zero cost for self-hosted models', () => {
    expect(calculateCost('ollama/qwen3-coder', 1000, 500)).toBe(0)
  })

  it('calculates cost for cloud models', () => {
    const cost = calculateCost('gemini-1.5-flash', 1000, 500)
    expect(cost).toBeCloseTo(0.000225, 6)
  })

  it('returns zero for unknown models', () => {
    expect(calculateCost('unknown-model', 1000, 500)).toBe(0)
  })
})

describe('observe query filters', () => {
  it('builds correct filter params', () => {
    const filters = buildQueryFilters('eu')
    expect(filters.action).toBe('ai_guard_attestation')
    expect(filters.jurisdiction).toBe('eu')
  })
})
