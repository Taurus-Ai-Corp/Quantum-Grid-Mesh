import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email, source } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    // For MVP: just log it. Resend integration in Phase 6.
    console.log(`[newsletter] ${email} from ${source ?? 'unknown'}`)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
