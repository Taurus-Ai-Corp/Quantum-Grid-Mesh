import type { JurisdictionConfig } from '../types.js'

export const naConfig: JurisdictionConfig = {
  id: 'na',
  name: 'North America',
  shortName: 'NA',
  domain: 'comply.q-grid.net',
  currency: { code: 'CAD', symbol: '$', locale: 'en-CA' },
  regulations: [
    {
      id: 'tb-directive-adm',
      name: 'Treasury Board Directive on Automated Decision-Making',
      authority: 'Treasury Board Secretariat',
    },
    {
      id: 'aida',
      name: 'AIDA - Artificial Intelligence and Data Act Bill C-27',
      authority: 'Parliament of Canada',
    },
    {
      id: 'pipeda',
      name: 'PIPEDA',
      authority: 'Office of the Privacy Commissioner',
    },
    {
      id: 'osfi-e23',
      name: 'OSFI E-23 Model Risk Management',
      authority: 'OSFI',
    },
    {
      id: 'osfi-b13',
      name: 'OSFI B-13 Technology and Cyber Risk',
      authority: 'OSFI',
    },
    {
      id: 'cccs-pqc',
      name: 'CCCS Post-Quantum Cryptography Migration',
      authority: 'Canadian Centre for Cyber Security',
    },
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      authority: 'AICPA',
    },
  ],
  riskLevels: [
    {
      key: 'level-i',
      label: 'Level I',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Low impact — minimal risk to individuals or organizations',
    },
    {
      key: 'level-ii',
      label: 'Level II',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50',
      description: 'Moderate impact — limited adverse effects on rights or safety',
    },
    {
      key: 'level-iii',
      label: 'Level III',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      description: 'High impact — significant effects on rights, safety, or welfare',
    },
    {
      key: 'level-iv',
      label: 'Level IV',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Critical impact — severe or irreversible harm to individuals or society',
    },
  ],
  assessmentTitle: 'North American AI Compliance Assessment',
  documentTypes: [
    'aia_report',
    'pipeda_pia',
    'osfi_mrm_report',
    'pqc_readiness_report',
    'data_residency_certificate',
    'soc2_report',
  ],
  supportedLocales: ['en-CA', 'fr-CA'],
  defaultLocale: 'en-CA',
  dataResidencyRegion: 'us-east-2',
  vercelRegion: 'iad1',
  pricingMultiplier: 1.0,
}
