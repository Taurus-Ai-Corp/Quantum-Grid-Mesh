export type Jurisdiction = 'na' | 'eu' | 'in' | 'ae'

export interface Regulation {
  id: string
  name: string
  authority: string
}

export interface RiskLevel {
  key: string
  label: string
  color: string
  bgColor: string
  description: string
}

export interface JurisdictionConfig {
  id: Jurisdiction
  name: string
  shortName: string
  domain: string
  currency: { code: string; symbol: string; locale: string }
  regulations: Regulation[]
  riskLevels: RiskLevel[]
  assessmentTitle: string
  documentTypes: string[]
  supportedLocales: string[]
  defaultLocale: string
  dataResidencyRegion: string
  vercelRegion: string
  pricingMultiplier: number
}
