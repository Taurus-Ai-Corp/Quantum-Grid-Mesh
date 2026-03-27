/**
 * Singleton in-memory store for assessments.
 * Shared across all route handlers in a single Next.js server process.
 * Swap for Neon DB queries when DATABASE_URL is provisioned.
 */

export interface Recommendation {
  id: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  category: string
}

export interface AssessmentRecord {
  id: string
  systemId: string
  userId: string
  status: 'draft' | 'in_progress' | 'completed'
  responses: Record<string, string | boolean>
  currentSection: number
  score?: number
  riskLevel?: string
  recommendations?: Recommendation[]
  keyFindings?: string[]
  categoryScores?: Record<string, number>
  createdAt: string
  completedAt?: string
}

// Module-level singleton — persists for the lifetime of the server process
export const assessmentsStore = new Map<string, AssessmentRecord[]>()
