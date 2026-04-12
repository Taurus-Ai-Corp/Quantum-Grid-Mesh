/**
 * RegTech Risk Scoring Models + QRS vs RegTech Comparison Framework
 *
 * Three components:
 *   A. Customer Risk Scoring (KYC/AML) — 6 weighted factors
 *   B. Transaction Risk Scoring (AML)  — 5 weighted factors
 *   C. Framework Comparison            — QRS vs RegTech gap analysis
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CustomerRiskInput {
  jurisdictionRisk: 'low' | 'medium' | 'high' | 'critical' // FATF grey/black list
  pepStatus: boolean // Politically exposed person
  industryRisk: 'low' | 'medium' | 'high' // gambling, crypto, arms = high
  adverseMedia: boolean // negative press / sanctions
  transactionPattern: 'normal' | 'suspicious' | 'structured' // structuring detection
  accountAgeDays: number // newer = riskier
}

export interface TransactionRiskInput {
  amountUsd: number
  averageAmountUsd: number
  txCountLast24h: number
  averageTxCountDaily: number
  originCountry: string
  destinationCountry: string
  counterpartyRisk: 'low' | 'medium' | 'high'
  isOffHours: boolean
}

export interface RiskFactor {
  name: string
  weight: number
  score: number
  weighted: number
}

export interface RiskScore {
  overall: number // 0-100 (higher = more risky)
  level: 'low' | 'medium' | 'high' | 'critical'
  factors: RiskFactor[]
  action: string // Auto-approve | Enhanced monitoring | Manual review | Block + SAR
}

export interface FrameworkSide {
  name: string
  focus: string
  categories: string[]
  weights: Record<string, number>
  strengths: string[]
  limitations: string[]
}

export interface FrameworkComparison {
  qrs: FrameworkSide
  regtech: FrameworkSide
  gaps: string[]
  recommendations: string[]
  unifiedModel: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function riskLevel(score: number): RiskScore['level'] {
  if (score <= 30) return 'low'
  if (score <= 60) return 'medium'
  if (score <= 80) return 'high'
  return 'critical'
}

function riskAction(level: RiskScore['level']): string {
  switch (level) {
    case 'low':
      return 'Auto-approve'
    case 'medium':
      return 'Enhanced monitoring'
    case 'high':
      return 'Manual review'
    case 'critical':
      return 'Block + SAR'
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// ---------------------------------------------------------------------------
// A. Customer Risk Scoring (KYC/AML)
// ---------------------------------------------------------------------------

/**
 * Score a customer across 6 KYC/AML risk factors.
 *
 * Weights sum to 100%:
 *   jurisdictionRisk 25%, pepStatus 20%, industryRisk 15%,
 *   adverseMedia 15%, transactionPattern 15%, accountAge 10%
 */
export function scoreCustomerRisk(input: CustomerRiskInput): RiskScore {
  // --- Individual factor scores (0-100, higher = riskier) ---

  const jurisdictionScoreMap: Record<CustomerRiskInput['jurisdictionRisk'], number> = {
    low: 10,
    medium: 45,
    high: 75,
    critical: 100,
  }
  const jurisdictionScore = jurisdictionScoreMap[input.jurisdictionRisk]

  const pepScore = input.pepStatus ? 100 : 0

  const industryScoreMap: Record<CustomerRiskInput['industryRisk'], number> = {
    low: 10,
    medium: 50,
    high: 90,
  }
  const industryScore = industryScoreMap[input.industryRisk]

  const adverseMediaScore = input.adverseMedia ? 100 : 0

  const patternScoreMap: Record<CustomerRiskInput['transactionPattern'], number> = {
    normal: 10,
    suspicious: 70,
    structured: 95,
  }
  const patternScore = patternScoreMap[input.transactionPattern]

  // Account age: <30d = 90, <90d = 60, <365d = 30, else 10
  let accountAgeScore: number
  if (input.accountAgeDays < 30) accountAgeScore = 90
  else if (input.accountAgeDays < 90) accountAgeScore = 60
  else if (input.accountAgeDays < 365) accountAgeScore = 30
  else accountAgeScore = 10

  // --- Build weighted factors ---
  const factors: RiskFactor[] = [
    { name: 'jurisdictionRisk', weight: 0.25, score: jurisdictionScore, weighted: jurisdictionScore * 0.25 },
    { name: 'pepStatus', weight: 0.20, score: pepScore, weighted: pepScore * 0.20 },
    { name: 'industryRisk', weight: 0.15, score: industryScore, weighted: industryScore * 0.15 },
    { name: 'adverseMedia', weight: 0.15, score: adverseMediaScore, weighted: adverseMediaScore * 0.15 },
    { name: 'transactionPattern', weight: 0.15, score: patternScore, weighted: patternScore * 0.15 },
    { name: 'accountAge', weight: 0.10, score: accountAgeScore, weighted: accountAgeScore * 0.10 },
  ]

  const overall = clamp(Math.round(factors.reduce((sum, f) => sum + f.weighted, 0)), 0, 100)
  const level = riskLevel(overall)

  return { overall, level, factors, action: riskAction(level) }
}

// ---------------------------------------------------------------------------
// B. Transaction Risk Scoring (AML)
// ---------------------------------------------------------------------------

/**
 * Score a single transaction across 5 AML risk factors.
 *
 * Weights sum to 100%:
 *   amountAnomaly 30%, velocity 25%, geoAnomaly 20%,
 *   counterpartyRisk 15%, timePattern 10%
 */
export function scoreTransactionRisk(input: TransactionRiskInput): RiskScore {
  // Amount anomaly — ratio to average
  const amountRatio = input.averageAmountUsd > 0 ? input.amountUsd / input.averageAmountUsd : 10
  let amountScore: number
  if (amountRatio > 10) amountScore = 100
  else if (amountRatio > 5) amountScore = 80
  else if (amountRatio > 2) amountScore = 50
  else amountScore = 10

  // Velocity anomaly — ratio to average daily
  const velocityRatio =
    input.averageTxCountDaily > 0 ? input.txCountLast24h / input.averageTxCountDaily : 10
  let velocityScore: number
  if (velocityRatio > 10) velocityScore = 100
  else if (velocityRatio > 5) velocityScore = 80
  else if (velocityRatio > 2) velocityScore = 50
  else velocityScore = 10

  // Geo anomaly — cross-border vs domestic
  const geoScore =
    input.originCountry.toLowerCase() !== input.destinationCountry.toLowerCase() ? 60 : 10

  // Counterparty risk
  const counterpartyScoreMap: Record<TransactionRiskInput['counterpartyRisk'], number> = {
    low: 10,
    medium: 50,
    high: 90,
  }
  const counterpartyScore = counterpartyScoreMap[input.counterpartyRisk]

  // Time pattern — off-hours is suspicious
  const timeScore = input.isOffHours ? 70 : 10

  // --- Build weighted factors ---
  const factors: RiskFactor[] = [
    { name: 'amountAnomaly', weight: 0.30, score: amountScore, weighted: amountScore * 0.30 },
    { name: 'velocity', weight: 0.25, score: velocityScore, weighted: velocityScore * 0.25 },
    { name: 'geoAnomaly', weight: 0.20, score: geoScore, weighted: geoScore * 0.20 },
    { name: 'counterpartyRisk', weight: 0.15, score: counterpartyScore, weighted: counterpartyScore * 0.15 },
    { name: 'timePattern', weight: 0.10, score: timeScore, weighted: timeScore * 0.10 },
  ]

  const overall = clamp(Math.round(factors.reduce((sum, f) => sum + f.weighted, 0)), 0, 100)
  const level = riskLevel(overall)

  return { overall, level, factors, action: riskAction(level) }
}

// ---------------------------------------------------------------------------
// C. Framework Comparison — QRS vs RegTech
// ---------------------------------------------------------------------------

/**
 * Return a static comparison of the QRS (Quantum Risk Score) engine
 * against a standard RegTech (KYC/AML) risk framework, including gaps
 * and a unified-model recommendation.
 *
 * QRS weights reference packages/pqc-engine/src/qrs-score.ts:
 *   algorithms: 0.40, keySize: 0.30, pqcReadiness: 0.20, compliance: 0.10
 *   Risk levels: critical (0-25), high (26-50), moderate (51-75), low (76+)
 *   Migration priority: immediate / high / medium / low
 */
export function compareRiskFrameworks(): FrameworkComparison {
  return {
    qrs: {
      name: 'QRS — Quantum Risk Score',
      focus: 'Cryptographic posture and post-quantum readiness',
      categories: ['algorithms', 'keySize', 'pqcReadiness', 'compliance'],
      weights: { algorithms: 0.40, keySize: 0.30, pqcReadiness: 0.20, compliance: 0.10 },
      strengths: [
        'Deep cryptographic algorithm analysis with per-algorithm grading',
        'ENISA/NIST-aligned scoring (FIPS 203/204 awareness)',
        'Quantum-safe algorithm grading (DILITHIUM, KYBER, ML-KEM, ML-DSA)',
        'TLS version compliance scoring (1.3 preferred, 1.2 acceptable)',
        'Migration priority output (immediate → low) for remediation planning',
      ],
      limitations: [
        'No customer risk assessment (KYC/AML)',
        'No transaction risk scoring',
        'No behavioral pattern analysis',
        'No fraud detection or structuring detection',
      ],
    },
    regtech: {
      name: 'RegTech — KYC/AML Risk Score',
      focus: 'Customer and transaction risk for financial compliance',
      categories: [
        'jurisdictionRisk',
        'pepStatus',
        'industryRisk',
        'adverseMedia',
        'transactionPattern',
        'accountAge',
        'amountAnomaly',
        'velocity',
        'geoAnomaly',
        'counterpartyRisk',
        'timePattern',
      ],
      weights: {
        jurisdictionRisk: 0.25,
        pepStatus: 0.20,
        industryRisk: 0.15,
        adverseMedia: 0.15,
        transactionPattern: 0.15,
        accountAge: 0.10,
        amountAnomaly: 0.30,
        velocity: 0.25,
        geoAnomaly: 0.20,
        counterpartyRisk: 0.15,
        timePattern: 0.10,
      },
      strengths: [
        'KYC/AML scoring with FATF grey/black-list awareness',
        'PEP (Politically Exposed Person) screening and flagging',
        'Transaction velocity and structuring detection',
        'Clear action thresholds (auto-approve → block + SAR)',
        'Counterparty risk propagation',
      ],
      limitations: [
        'No PQC (Post-Quantum Cryptography) assessment',
        'No algorithm vulnerability analysis',
        'No quantum migration priority scoring',
        'No TLS or certificate posture evaluation',
      ],
    },
    gaps: [
      'QRS lacks customer risk profiling (KYC/AML entity scoring)',
      'QRS lacks transaction risk monitoring (AML velocity/structuring)',
      'RegTech lacks PQC readiness assessment (algorithm grading)',
      'RegTech lacks cryptographic inventory and key-size analysis',
      'Neither framework includes AI-specific risk scoring (EU AI Act Annex III)',
      'Neither framework supports real-time adaptive scoring with feedback loops',
    ],
    recommendations: [
      'Create a unified GRIDERA Risk Score combining both frameworks',
      'Weight the unified score: 30% cryptographic + 30% compliance + 20% entity + 20% transaction',
      'Add time-series scoring to detect risk trend acceleration',
      'Integrate GUARD attestation data as a compliance signal',
      'Build a risk heat map dashboard correlating all four pillars',
    ],
    unifiedModel:
      'The GRIDERA Unified Risk Score is a 4-pillar model that combines ' +
      'cryptographic posture (QRS), regulatory compliance (EU AI Act, GDPR, SOC 2), ' +
      'entity risk (KYC/AML customer scoring), and transaction risk (AML velocity/geo). ' +
      'Each pillar is weighted (30/30/20/20) and normalized to 0-100. This differentiates ' +
      'GRIDERA from OneTrust (compliance-only), Vanta (audit-only), and Drata (control-only) ' +
      'by providing a single score that spans quantum-safe crypto, AI governance, and ' +
      'financial crime prevention — three domains no competitor covers in one platform.',
  }
}
