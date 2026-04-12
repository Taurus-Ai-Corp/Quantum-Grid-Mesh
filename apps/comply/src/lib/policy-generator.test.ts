import { describe, it, expect } from 'vitest'
import {
  generatePolicy,
  POLICY_TYPES,
  type PolicyType,
  type OrgContext,
} from './policy-generator'

// ---------------------------------------------------------------------------
// Shared test org context
// ---------------------------------------------------------------------------

const euOrg: OrgContext = {
  orgName: 'Acme Corp',
  industry: 'Financial Services',
  dpoName: 'Jane Smith',
  dpoEmail: 'dpo@acme.example',
  jurisdiction: 'eu',
  dataResidency: 'EU (Frankfurt)',
  lastReviewDate: '2026-01-15',
}

const inOrg: OrgContext = {
  ...euOrg,
  orgName: 'Bharat Fintech Ltd',
  jurisdiction: 'in',
  dataResidency: 'India (Mumbai)',
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Policy Generator', () => {
  it('lists 6 policy types', () => {
    expect(POLICY_TYPES).toHaveLength(6)
    const ids = POLICY_TYPES.map((t) => t.id)
    expect(ids).toContain('information-security')
    expect(ids).toContain('data-protection')
    expect(ids).toContain('incident-response')
    expect(ids).toContain('data-retention')
    expect(ids).toContain('key-management')
    expect(ids).toContain('third-party-risk')
  })

  it('generates information-security policy with org name', () => {
    const policy = generatePolicy('information-security', euOrg)
    expect(policy.title).toBe('Information Security Policy')
    expect(policy.type).toBe('information-security')
    expect(policy.markdown).toContain('Acme Corp')
    expect(policy.markdown).toContain('Jane Smith')
    expect(policy.markdown).toContain('dpo@acme.example')
    expect(policy.sections.length).toBeGreaterThan(0)
    // No unfilled placeholders
    expect(policy.markdown).not.toMatch(/\{\{\w+\}\}/)
  })

  it('generates data-protection policy with GDPR references for EU jurisdiction', () => {
    const policy = generatePolicy('data-protection', euOrg)
    expect(policy.title).toBe('Data Protection Policy')
    expect(policy.markdown).toContain('GDPR')
    expect(policy.markdown).toContain('Regulation (EU) 2016/679')
    expect(policy.markdown).toContain('Right to Erasure')
    expect(policy.metadata.jurisdiction).toBe('EU')
  })

  it('generates incident-response with correct breach timelines (72h EU, 6h India)', () => {
    const euPolicy = generatePolicy('incident-response', euOrg)
    expect(euPolicy.markdown).toContain('72 hours')

    const inPolicy = generatePolicy('incident-response', inOrg)
    expect(inPolicy.markdown).toContain('6 hours')
    expect(inPolicy.markdown).toContain('CERT-In')
  })

  it('generates data-retention policy', () => {
    const policy = generatePolicy('data-retention', euOrg)
    expect(policy.title).toBe('Data Retention Policy')
    expect(policy.markdown).toContain('Retention Schedule')
    expect(policy.markdown).toContain('7 years for financial records')
    expect(policy.markdown).toContain('Legal Hold')
    expect(policy.sections.length).toBeGreaterThan(0)
  })

  it('generates key-management policy with ML-DSA-65/ML-KEM-768 references', () => {
    const policy = generatePolicy('key-management', euOrg)
    expect(policy.title).toBe('Key Management Policy')
    expect(policy.markdown).toContain('ML-DSA-65')
    expect(policy.markdown).toContain('ML-KEM-768')
    expect(policy.markdown).toContain('FIPS 204')
    expect(policy.markdown).toContain('FIPS 203')
    expect(policy.markdown).toContain('PQC Migration Phases')
  })

  it('generates third-party-risk policy', () => {
    const policy = generatePolicy('third-party-risk', euOrg)
    expect(policy.title).toBe('Third-Party Risk Management Policy')
    expect(policy.markdown).toContain('Critical')
    expect(policy.markdown).toContain('Vendor Classification')
    expect(policy.markdown).toContain('SOC 2')
    expect(policy.sections.length).toBeGreaterThan(0)
  })

  it('all 6 types generate valid markdown (>200 chars, contains # , has metadata)', () => {
    const types: PolicyType[] = [
      'information-security',
      'data-protection',
      'incident-response',
      'data-retention',
      'key-management',
      'third-party-risk',
    ]

    for (const type of types) {
      const policy = generatePolicy(type, euOrg)
      // Markdown length > 200
      expect(policy.markdown.length).toBeGreaterThan(200)
      // Contains heading
      expect(policy.markdown).toContain('# ')
      // Has metadata
      expect(policy.metadata.jurisdiction).toBe('EU')
      expect(policy.metadata.version).toBe('1.0')
      expect(policy.metadata.orgName).toBe('Acme Corp')
      expect(policy.metadata.generatedAt).toBeTruthy()
    }
  })
})
