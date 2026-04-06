/**
 * Swarm-Spawner integration layer for comply assessment execution.
 * Spawns one ephemeral PQC-signed agent per assessment section (6 agents)
 * in parallel, then merges results with the scoring engine output.
 */

import { SwarmSpawner, defaultExecutor } from '@taurus-ai/swarm-spawner'
import { euAssessmentSections } from './assessment-sections'
import { scoreAssessment } from './assessment-scorer'
import type { ScoringResult } from './assessment-scorer'

export type { ScoringResult }

// ─── Public types ─────────────────────────────────────────────────────────────

export interface SwarmAssessmentInput {
  assessmentId: string
  responses: Record<string, string | boolean>
  jurisdiction: string
  licenseKey?: string
}

export interface SectionAgentResult {
  agentId: string
  sectionId: string
  sectionTitle: string
  score: number
  status: 'completed' | 'failed'
}

export interface SwarmAssessmentResult {
  assessmentId: string
  totalAgents: number
  successRate: number
  overallScore: number
  riskLevel: string
  sectionResults: SectionAgentResult[]
  scoringResult: ScoringResult
}

// ─── Core function ─────────────────────────────────────────────────────────────

/**
 * Runs a full swarm assessment:
 * 1. Scores responses with the weighted engine (scoreAssessment).
 * 2. Spawns one ephemeral agent per EU AI Act section (6 total) in parallel.
 * 3. Maps agent results back to section-level SectionAgentResult objects.
 * 4. Returns a consolidated SwarmAssessmentResult.
 */
export async function runSwarmAssessment(
  input: SwarmAssessmentInput,
): Promise<SwarmAssessmentResult> {
  const { assessmentId, responses, jurisdiction, licenseKey } = input

  // Step 1 — score with the existing weighted engine
  const scoringResult = scoreAssessment(responses, jurisdiction)

  // Step 2 — build the swarm spawner
  const spawner = new SwarmSpawner({
    maxParallel: 6,
    timeout: 30_000,
    retryAttempts: 1,
    retryDelay: 500,
    enableAuditTrail: false,
    hederaNetwork: 'testnet',
    executor: defaultExecutor,
    ...(licenseKey ? { licenseKey } : {}),
  })

  // Step 3 — one task per section
  const tasks = euAssessmentSections.map((section) => ({
    id: `${assessmentId}-${section.id}`,
    description: `Evaluate EU AI Act section: ${section.title}`,
    input: {
      assessmentId,
      sectionId: section.id,
      sectionTitle: section.title,
      sectionScore: scoringResult.categoryScores[section.id] ?? 0,
      jurisdiction,
    },
    modelTier: 'fast' as const,
  }))

  // Step 4 — spawn all agents in parallel
  const aggregated = await spawner.spawn({ tasks, strategy: 'parallel' })

  // Step 5 — map aggregated results back to section shape
  const sectionResults: SectionAgentResult[] = euAssessmentSections.map((section, idx) => {
    const agentResult = aggregated.results[idx]
    const agentId = agentResult?.agentId ?? `${assessmentId}-${section.id}`
    const status: 'completed' | 'failed' =
      agentResult?.status === 'completed' ? 'completed' : 'failed'

    return {
      agentId,
      sectionId: section.id,
      sectionTitle: section.title,
      score: scoringResult.categoryScores[section.id] ?? 0,
      status,
    }
  })

  const successCount = sectionResults.filter((r) => r.status === 'completed').length
  const successRate = sectionResults.length > 0 ? successCount / sectionResults.length : 0

  spawner.destroy()

  return {
    assessmentId,
    totalAgents: euAssessmentSections.length,
    successRate,
    overallScore: scoringResult.score,
    riskLevel: scoringResult.riskLevel,
    sectionResults,
    scoringResult,
  }
}
