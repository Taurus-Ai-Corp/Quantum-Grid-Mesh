import type { JurisdictionConfig } from '../types.js'

export const euConfig: JurisdictionConfig = {
  id: 'eu',
  name: 'European Union',
  shortName: 'EU',
  domain: 'eu.q-grid.net',
  currency: { code: 'EUR', symbol: '€', locale: 'en-EU' },
  regulations: [
    {
      id: 'eu-ai-act',
      name: 'EU AI Act Regulation 2024/1689',
      authority: 'European Commission',
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      authority: 'European Commission',
    },
    {
      id: 'dora',
      name: 'DORA - Digital Operational Resilience Act',
      authority: 'European Council',
    },
    {
      id: 'nis2',
      name: 'NIS2 Directive',
      authority: 'European Commission',
    },
    {
      id: 'enisa-pqc',
      name: 'ENISA PQC Recommendations',
      authority: 'ENISA',
    },
  ],
  riskLevels: [
    {
      key: 'minimal',
      label: 'Minimal',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      description: 'Minimal risk — no significant threat to health, safety, or fundamental rights',
    },
    {
      key: 'limited',
      label: 'Limited',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      description: 'Limited risk — transparency obligations apply',
    },
    {
      key: 'high',
      label: 'High',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      description: 'High risk — significant potential to harm health, safety, or fundamental rights',
    },
    {
      key: 'unacceptable',
      label: 'Unacceptable',
      color: 'text-red-700',
      bgColor: 'bg-red-50',
      description: 'Unacceptable risk — prohibited under the EU AI Act',
    },
  ],
  assessmentTitle: 'EU AI Act Conformity Assessment',
  documentTypes: [
    'technical_documentation',
    'risk_assessment',
    'conformity_declaration',
    'post_market_monitoring',
    'dora_ict_report',
  ],
  supportedLocales: ['en-EU', 'de-DE', 'fr-FR', 'es-ES'],
  defaultLocale: 'en-EU',
  dataResidencyRegion: 'eu-central-1',
  vercelRegion: 'fra1',
  pricingMultiplier: 1.0,
}
