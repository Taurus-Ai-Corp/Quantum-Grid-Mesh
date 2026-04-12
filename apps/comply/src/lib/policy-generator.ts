/**
 * Policy Generator — fills jurisdiction-aware templates with org context.
 *
 * Usage:
 *   const policy = generatePolicy('information-security', { orgName: 'Acme', ... })
 *   console.log(policy.markdown)
 */

import { TEMPLATES, JURISDICTION_VALUES } from './policy-templates'
import type { PolicySection } from './policy-templates'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PolicyType =
  | 'information-security'
  | 'data-protection'
  | 'incident-response'
  | 'data-retention'
  | 'key-management'
  | 'third-party-risk'

export interface OrgContext {
  orgName: string
  industry: string
  dpoName: string
  dpoEmail: string
  jurisdiction: string
  dataResidency: string
  lastReviewDate: string
}

export interface GeneratedPolicy {
  title: string
  type: PolicyType
  sections: { title: string; content: string }[]
  markdown: string
  metadata: {
    jurisdiction: string
    version: string
    generatedAt: string
    orgName: string
  }
}

// ---------------------------------------------------------------------------
// Policy type catalogue
// ---------------------------------------------------------------------------

export const POLICY_TYPES: { id: PolicyType; title: string; description: string }[] = [
  {
    id: 'information-security',
    title: 'Information Security Policy',
    description: 'InfoSec governance, data classification, access control, and cryptographic controls.',
  },
  {
    id: 'data-protection',
    title: 'Data Protection Policy',
    description: 'Data processing principles, data subject rights, and breach notification procedures.',
  },
  {
    id: 'incident-response',
    title: 'Incident Response Policy',
    description: 'Incident classification (P1-P4), response procedures, and notification timelines.',
  },
  {
    id: 'data-retention',
    title: 'Data Retention Policy',
    description: 'Retention schedules by data category, destruction procedures, and legal hold.',
  },
  {
    id: 'key-management',
    title: 'Key Management Policy',
    description: 'PQC key lifecycle (ML-DSA-65, ML-KEM-768), rotation schedules, and migration phases.',
  },
  {
    id: 'third-party-risk',
    title: 'Third-Party Risk Management Policy',
    description: 'Vendor classification (Critical/High/Medium/Low) and assessment requirements.',
  },
]

// ---------------------------------------------------------------------------
// Placeholder replacement
// ---------------------------------------------------------------------------

function fillPlaceholders(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    return values[key] ?? `{{${key}}}`
  })
}

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

export function generatePolicy(type: PolicyType, org: OrgContext): GeneratedPolicy {
  const template = TEMPLATES[type]
  if (!template) {
    throw new Error(`Unknown policy type: ${type}`)
  }

  const jur = org.jurisdiction.toLowerCase()
  const jurValues = JURISDICTION_VALUES[jur] ?? JURISDICTION_VALUES['eu']!

  // Build combined value map
  const values: Record<string, string> = {
    orgName: org.orgName,
    industry: org.industry,
    dpoName: org.dpoName,
    dpoEmail: org.dpoEmail,
    jurisdiction: org.jurisdiction.toUpperCase(),
    dataResidency: org.dataResidency,
    lastReviewDate: org.lastReviewDate,
    regulationName: jurValues.regulationName,
    breachTimeline: jurValues.breachTimeline,
    retentionPeriod: jurValues.retentionPeriod,
    dataAuthority: jurValues.dataAuthority,
    pqcRequirement: jurValues.pqcRequirement,
    keyRotation: jurValues.keyRotation,
  }

  // Fill sections
  const filledSections: PolicySection[] = template.sections.map((s) => ({
    title: fillPlaceholders(s.title, values),
    content: fillPlaceholders(s.content, values),
  }))

  // Build markdown
  const now = new Date().toISOString()
  const lines: string[] = [
    `# ${template.title}`,
    '',
    `**Organization**: ${org.orgName}`,
    `**Jurisdiction**: ${org.jurisdiction.toUpperCase()}`,
    `**Version**: 1.0`,
    `**Generated**: ${now}`,
    `**Data Protection Officer**: ${org.dpoName} (${org.dpoEmail})`,
    '',
    '---',
    '',
  ]

  for (const section of filledSections) {
    lines.push(`## ${section.title}`)
    lines.push('')
    lines.push(section.content)
    lines.push('')
  }

  return {
    title: template.title,
    type,
    sections: filledSections,
    markdown: lines.join('\n'),
    metadata: {
      jurisdiction: org.jurisdiction.toUpperCase(),
      version: '1.0',
      generatedAt: now,
      orgName: org.orgName,
    },
  }
}
