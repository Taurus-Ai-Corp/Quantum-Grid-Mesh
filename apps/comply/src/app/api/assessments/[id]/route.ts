import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { assessmentsStore } from '@/lib/assessment-store'
import { systemsStore } from '@/lib/systems-store'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const assessments = assessmentsStore.get(userId) ?? []
  const assessment = assessments.find((a) => a.id === id)

  if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Enrich with system name
  const systems = systemsStore.get(userId) ?? []
  const system = systems.find((s) => s.id === assessment.systemId)

  return NextResponse.json({ ...assessment, systemName: system?.name ?? 'Unknown System' })
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const assessments = assessmentsStore.get(userId) ?? []
  const idx = assessments.findIndex((a) => a.id === id)

  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const body = await req.json() as {
    responses?: Record<string, string | boolean>
    currentSection?: number
    status?: 'draft' | 'in_progress' | 'completed'
  }

  const current = assessments[idx]!
  const updated = {
    ...current,
    responses: body.responses !== undefined ? body.responses : current.responses,
    currentSection: body.currentSection !== undefined ? body.currentSection : current.currentSection,
    status: body.status !== undefined ? body.status : current.status,
  }

  assessments[idx] = updated
  assessmentsStore.set(userId, assessments)

  return NextResponse.json(updated)
}
