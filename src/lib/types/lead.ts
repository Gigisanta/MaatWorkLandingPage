import type { LeadInput } from '@/lib/schemas/lead.schema'

export interface Lead {
  id: string
  nombre: string
  whatsapp: string
  email: string | null
  industria: string
  problema: string
  procesos: string[]
  presupuesto: string | null
  timeline: string | null
  source: string
  ip_address: string | null
  user_agent: string | null
  created_at: Date
}

export interface CreateLeadInput extends LeadInput {
  ip_address?: string | null
  user_agent?: string | null
}
