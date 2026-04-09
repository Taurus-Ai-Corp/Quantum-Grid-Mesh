import type { JurisdictionConfig } from '../types.js'

export const inConfig: JurisdictionConfig = {
  id: 'in',
  name: 'India',
  shortName: 'IN',
  domain: 'in.q-grid.net',
  currency: { code: 'INR', symbol: '₹', locale: 'en-IN' },
  regulations: [
    {
      id: 'dpdp-act',
      name: 'DPDP Act 2023',
      authority: 'MeitY',
    },
    {
      id: 'rbi-free-ai',
      name: 'RBI FREE-AI Framework 7 Sutras',
      authority: 'Reserve Bank of India',
    },
    {
      id: 'rbi-it-governance',
      name: 'RBI IT Governance Master Direction',
      authority: 'RBI',
    },
    {
      id: 'sebi-aiml',
      name: 'SEBI AI/ML Responsible Usage',
      authority: 'SEBI',
    },
    {
      id: 'rbi-data-localization',
      name: 'RBI Data Localization Circular 2018',
      authority: 'RBI',
    },
    {
      id: 'cert-in-cspai',
      name: 'CERT-In CSPAI Certification',
      authority: 'CERT-In',
    },
    {
      id: 'meity-ai-governance',
      name: 'MeitY AI Governance Guidelines 7 Sutras',
      authority: 'MeitY',
    },
  ],
  riskLevels: [
    {
      key: 'low-impact',
      label: 'Low Impact',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Low impact — minimal risk to data principals or financial stability',
    },
    {
      key: 'medium-impact',
      label: 'Medium Impact',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      description: 'Medium impact — moderate risk requiring enhanced controls',
    },
    {
      key: 'high-impact',
      label: 'High Impact',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      description: 'High impact — significant risk to data principals or systemic stability',
    },
    {
      key: 'critical-impact',
      label: 'Critical Impact',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Critical impact — severe risk requiring regulatory escalation',
    },
  ],
  assessmentTitle: 'Indian AI Compliance Assessment',
  documentTypes: [
    'rbi_free_ai_report',
    'dpdp_pia',
    'rbi_mrm_report',
    'sebi_aiml_report',
    'pqc_readiness_report',
    'data_residency_certificate',
  ],
  supportedLocales: ['en-IN', 'hi-IN'],
  defaultLocale: 'en-IN',
  dataResidencyRegion: 'ap-south-1',
  vercelRegion: 'bom1',
  pricingMultiplier: 0.5,
}
