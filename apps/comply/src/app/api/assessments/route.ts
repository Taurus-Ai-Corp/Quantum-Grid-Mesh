import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { assessmentsStore, type AssessmentRecord } from '@/lib/assessment-store'
import { systemsStore } from '@/lib/systems-store'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const assessments = assessmentsStore.get(userId) ?? []

  // Enrich with system name
  const systems = systemsStore.get(userId) ?? []
  const enriched = assessments.map((a) => {
    const system = systems.find((s) => s.id === a.systemId)
    return { ...a, systemName: system?.name ?? 'Unknown System' }
  })

  return NextResponse.json({ assessments: enriched })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { systemId?: string }
  if (!body.systemId) {
    return NextResponse.json({ error: 'systemId is required' }, { status: 400 })
  }

  // Verify system belongs to user
  const systems = systemsStore.get(userId) ?? []
  const system = systems.find((s) => s.id === body.systemId)
  if (!system) {
    return NextResponse.json({ error: 'System not found' }, { status: 404 })
  }

  const assessment: AssessmentRecord = {
    id: crypto.randomUUID(),
    systemId: body.systemId,
    userId,
    status: 'draft',
    responses: {},
    currentSection: 0,
    createdAt: new Date().toISOString(),
  }

  const existing = assessmentsStore.get(userId) ?? []
  existing.push(assessment)
  assessmentsStore.set(userId, existing)

  return NextResponse.json(assessment, { status: 201 })
}
