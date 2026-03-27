import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { assessmentsStore } from '@/lib/assessment-store'
import { scoreAssessment } from '@/lib/assessment-scorer'

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const assessments = assessmentsStore.get(userId) ?? []
  const idx = assessments.findIndex((a) => a.id === id)

  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const current = assessments[idx]!

  if (current.status === 'completed') {
    return NextResponse.json({ error: 'Assessment already completed' }, { status: 400 })
  }

  // Run scoring engine
  const result = scoreAssessment(current.responses)

  const completed = {
    ...current,
    status: 'completed' as const,
    score: result.score,
    riskLevel: result.riskLevel,
    categoryScores: result.categoryScores,
    recommendations: result.recommendations,
    keyFindings: result.keyFindings,
    completedAt: new Date().toISOString(),
  }

  assessments[idx] = completed
  assessmentsStore.set(userId, assessments)

  return NextResponse.json(completed)
}
