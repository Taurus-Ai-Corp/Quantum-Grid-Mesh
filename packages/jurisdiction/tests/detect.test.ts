import { describe, it, expect } from 'vitest'
import { detectJurisdiction, getJurisdictionConfig } from '../src/index.js'

describe('jurisdiction detection', () => {
  it('detects NA from comply.q-grid.net', () => {
    expect(detectJurisdiction('comply.q-grid.net')).toBe('na')
  })
  it('detects NA from comply.q-grid.ca', () => {
    expect(detectJurisdiction('comply.q-grid.ca')).toBe('na')
  })
  it('detects EU from comply.q-grid.eu', () => {
    expect(detectJurisdiction('comply.q-grid.eu')).toBe('eu')
  })
  it('detects IN from comply.q-grid.in', () => {
    expect(detectJurisdiction('comply.q-grid.in')).toBe('in')
  })
  it('detects AE from comply.q-grid.ae', () => {
    expect(detectJurisdiction('comply.q-grid.ae')).toBe('ae')
  })
  it('falls back to NA for localhost', () => {
    expect(detectJurisdiction('localhost')).toBe('na')
  })
  it('prefers env override', () => {
    expect(detectJurisdiction('comply.q-grid.eu', 'in')).toBe('in')
  })
  it('ignores invalid env override', () => {
    expect(detectJurisdiction('comply.q-grid.eu', 'invalid')).toBe('eu')
  })
})

describe('jurisdiction config', () => {
  it('returns valid config for each jurisdiction', () => {
    for (const j of ['na', 'eu', 'in', 'ae'] as const) {
      const config = getJurisdictionConfig(j)
      expect(config.id).toBe(j)
      expect(config.regulations.length).toBeGreaterThan(0)
      expect(config.currency.code).toBeTruthy()
      expect(config.dataResidencyRegion).toBeTruthy()
      expect(config.vercelRegion).toBeTruthy()
    }
  })
  it('NA config has OSFI and PIPEDA', () => {
    const config = getJurisdictionConfig('na')
    const ids = config.regulations.map(r => r.id)
    expect(ids).toContain('osfi-e23')
    expect(ids).toContain('pipeda')
  })
  it('EU config has EU AI Act and GDPR', () => {
    const config = getJurisdictionConfig('eu')
    const ids = config.regulations.map(r => r.id)
    expect(ids).toContain('eu-ai-act')
    expect(ids).toContain('gdpr')
  })
  it('IN config has DPDP and RBI FREE-AI', () => {
    const config = getJurisdictionConfig('in')
    const ids = config.regulations.map(r => r.id)
    expect(ids).toContain('dpdp-act')
    expect(ids).toContain('rbi-free-ai')
  })
  it('AE config has VARA and DFSA', () => {
    const config = getJurisdictionConfig('ae')
    const ids = config.regulations.map(r => r.id)
    expect(ids).toContain('vara')
    expect(ids).toContain('dfsa')
  })
})
