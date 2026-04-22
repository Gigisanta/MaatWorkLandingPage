import { NextRequest, NextResponse } from 'next/server'
import { leadSchema } from '@/lib/schemas/lead.schema'
import { createLead } from '@/lib/services/neon'
import { sendSlackNotification } from '@/lib/services/slack'

export const runtime = 'nodejs'

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') ?? null
}

async function parseRequestBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get('content-type')

  if (!contentType?.includes('application/json')) {
    throw new Error('INVALID_CONTENT_TYPE')
  }

  try {
    return await request.json()
  } catch {
    throw new Error('INVALID_JSON')
  }
}

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()

  try {
    const body = await parseRequestBody(request)

    const validation = leadSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        {
          status: 400,
          headers: SECURITY_HEADERS,
        }
      )
    }

    const leadData = validation.data

    const lead = await createLead({
      nombre: leadData.nombre,
      whatsapp: leadData.whatsapp,
      email: leadData.email || undefined,
      industria: leadData.industria,
      problema: leadData.problema,
      procesos: leadData.procesos,
      presupuesto: leadData.presupuesto || undefined,
      timeline: leadData.timeline || undefined,
      source: 'landing_page',
      ip_address: getClientIp(request),
      user_agent: request.headers.get('user-agent') ?? undefined,
    })

    sendSlackNotification(lead).catch((err: unknown) => {
      console.error(`[${requestId}] Slack notification failed:`, err)
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Lead created successfully',
        data: lead,
      },
      {
        status: 201,
        headers: SECURITY_HEADERS,
      }
    )

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'INTERNAL_ERROR'

    if (message === 'INVALID_CONTENT_TYPE' || message === 'INVALID_JSON') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400, headers: SECURITY_HEADERS }
      )
    }

    console.error(`[${requestId}] Lead creation error:`, error)

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: SECURITY_HEADERS }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: { ...SECURITY_HEADERS, ...CORS_HEADERS },
  })
}
