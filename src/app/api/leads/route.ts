import { NextRequest, NextResponse } from 'next/server'
import { leadSchema } from '@/lib/schemas/lead.schema'
import { createLead } from '@/lib/services/supabase'
import { sendSlackNotification } from '@/lib/services/slack'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const body = await request.json()

    // Validate with Zod
    const validation = leadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        details: validation.error.flatten().fieldErrors
      }, { status: 400 })
    }

    const leadData = validation.data

    // Get additional metadata
    const ip_address = request.headers.get('x-forwarded-for') ?? null
    const user_agent = request.headers.get('user-agent') ?? null

    // Save to Supabase
    const { data: lead, error: dbError } = await createLead({
      ...leadData,
      source: 'landing_page',
      ip_address,
      user_agent
    })

    if (dbError || !lead) {
      console.error('Database error:', dbError)
      return NextResponse.json({
        success: false,
        error: 'Error al guardar el lead. Por favor intenta de nuevo.'
      }, { status: 500 })
    }

    // Send Slack notification (non-blocking)
    sendSlackNotification(lead).catch(err => {
      console.error('Slack notification failed:', err)
    })

    return NextResponse.json({
      success: true,
      message: 'Lead creado exitosamente',
      data: lead
    }, { status: 201 })

  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor'
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}
