import type { JurisdictionConfig } from '../types.js'

export const aeConfig: JurisdictionConfig = {
  id: 'ae',
  name: 'United Arab Emirates',
  shortName: 'AE',
  domain: 'ae.q-grid.net',
  currency: { code: 'AED', symbol: 'د.إ', locale: 'en-AE' },
  regulations: [
    {
      id: 'vara',
      name: 'VARA Virtual Assets Regulatory Framework',
      authority: 'Virtual Assets Regulatory Authority',
    },
    {
      id: 'dfsa',
      name: 'DFSA AI Governance Framework',
      authority: 'Dubai Financial Services Authority',
    },
    {
      id: 'cbuae-ai',
      name: 'CBUAE Guidance on AI in Financial Services',
      authority: 'Central Bank of UAE',
    },
    {
      id: 'adgm-dp',
      name: 'ADGM Data Protection Regulations 2021',
      authority: 'Abu Dhabi Global Market',
    },
    {
      id: 'uae-ai-strategy',
      name: 'UAE National AI Strategy 2031',
      authority: 'UAE AI Office',
    },
    {
      id: 'uae-pdp',
      name: 'UAE Federal Decree-Law No. 45 on Personal Data Protection',
      authority: 'UAE Government',
    },
  ],
  riskLevels: [
    {
      key: 'low',
      label: 'Low',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Low risk — minimal impact on consumers, markets, or data subjects',
    },
    {
      key: 'medium',
      label: 'Medium',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      description: 'Medium risk — moderate controls and oversight required',
    },
    {
      key: 'high',
      label: 'High',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      description: 'High risk — significant regulatory obligations and supervisory review',
    },
    {
      key: 'restricted',
      label: 'Restricted',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Restricted — prohibited or requires explicit regulatory pre-approval',
    },
  ],
  assessmentTitle: 'UAE AI Compliance Assessment',
  documentTypes: [
    'vara_compliance_report',
    'dfsa_governance_report',
    'cbuae_ai_assessment',
    'data_protection_report',
    'pqc_readiness_report',
  ],
  supportedLocales: ['en-AE', 'ar-AE'],
  defaultLocale: 'en-AE',
  dataResidencyRegion: 'me-central-1',
  vercelRegion: 'bah1',
  pricingMultiplier: 1.2,
}
