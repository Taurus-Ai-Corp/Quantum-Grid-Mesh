export const MODEL_RATES: Record<string, { input: number; output: number }> = {
  'ollama/qwen3-coder': { input: 0, output: 0 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
  'claude-sonnet-4-6': { input: 0.003, output: 0.015 },
}

export function calculateCost(model: string, tokensIn: number, tokensOut: number): number {
  const rates = MODEL_RATES[model] ?? { input: 0, output: 0 }
  return (tokensIn / 1000) * rates.input + (tokensOut / 1000) * rates.output
}

export function buildQueryFilters(jurisdiction: string) {
  return { action: 'ai_guard_attestation' as const, jurisdiction }
}

export interface ObserveSummary {
  totalCost: number
  totalAssessments: number
  avgCostPerAssessment: number
  selfHostedRatio: number
  guardPassRate: number
  guardBlockRate: number
  guardWarnRate: number
  avgLatencyMs: number
  p95LatencyMs: number
}
