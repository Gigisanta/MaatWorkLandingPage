import { neon } from '@neondatabase/serverless'
import type { Lead, CreateLeadInput } from '@/lib/types/lead'

const DEFAULT_SOURCE = 'landing_page'
const DEFAULT_LIMIT = 100

function getSql() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new ServiceError('DATABASE_URL environment variable is not set')
  }
  return neon(databaseUrl)
}

class ServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ServiceError'
  }
}

function mapRowToLead(row: Record<string, unknown>): Lead {
  return {
    id: String(row.id),
    nombre: String(row.nombre),
    whatsapp: String(row.whatsapp),
    email: row.email ? String(row.email) : null,
    industria: String(row.industria),
    problema: String(row.problema),
    procesos: Array.isArray(row.procesos) ? row.procesos.map(String) : [],
    presupuesto: row.presupuesto ? String(row.presupuesto) : null,
    timeline: row.timeline ? String(row.timeline) : null,
    source: String(row.source),
    ip_address: row.ip_address ? String(row.ip_address) : null,
    user_agent: row.user_agent ? String(row.user_agent) : null,
    created_at: new Date(row.created_at as string),
  }
}

export async function createLead(data: CreateLeadInput): Promise<Lead> {
  if (!data.nombre || !data.whatsapp || !data.industria || !data.problema) {
    throw new ServiceError('Missing required fields: nombre, whatsapp, industria, problema')
  }

  if (!data.procesos || data.procesos.length === 0) {
    throw new ServiceError('At least one process must be selected')
  }

  const sql = getSql()

  try {
    const result = await sql`
      INSERT INTO leads (
        nombre,
        whatsapp,
        email,
        industria,
        problema,
        procesos,
        presupuesto,
        timeline,
        source,
        ip_address,
        user_agent
      ) VALUES (
        ${data.nombre},
        ${data.whatsapp},
        ${data.email || null},
        ${data.industria},
        ${data.problema},
        ${data.procesos},
        ${data.presupuesto || null},
        ${data.timeline || null},
        ${data.source || DEFAULT_SOURCE},
        ${data.ip_address || null},
        ${data.user_agent || null}
      )
      RETURNING
        id,
        nombre,
        whatsapp,
        email,
        industria,
        problema,
        procesos,
        presupuesto,
        timeline,
        source,
        ip_address,
        user_agent,
        created_at
    `

    const leads = result as Record<string, unknown>[]
    const lead = leads[0]

    if (!lead) {
      throw new ServiceError('Failed to create lead: no return value')
    }

    return mapRowToLead(lead)
  } catch (error) {
    if (error instanceof ServiceError) {
      throw error
    }
    throw new ServiceError(`Failed to create lead: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getLeads(limit = DEFAULT_LIMIT, offset = 0): Promise<Lead[]> {
  if (limit < 1 || limit > 1000) {
    throw new ServiceError('Limit must be between 1 and 1000')
  }

  if (offset < 0) {
    throw new ServiceError('Offset must be non-negative')
  }

  const sql = getSql()

  try {
    const leads = await sql`
      SELECT
        id,
        nombre,
        whatsapp,
        email,
        industria,
        problema,
        procesos,
        presupuesto,
        timeline,
        source,
        ip_address,
        user_agent,
        created_at
      FROM leads
      ORDER BY created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `

    return (leads as Record<string, unknown>[]).map(mapRowToLead)
  } catch (error) {
    throw new ServiceError(`Failed to fetch leads: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export type { Lead, CreateLeadInput }
