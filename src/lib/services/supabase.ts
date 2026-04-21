import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Only create client if env vars are available
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

interface CreateLeadInput {
  nombre: string
  whatsapp: string
  email?: string | null
  industria: string
  problema: string
  procesos: string[]
  presupuesto?: string | null
  timeline?: string | null
  source?: string
  ip_address?: string | null
  user_agent?: string | null
}

export async function createLead(data: CreateLeadInput) {
  if (!supabase) {
    throw new Error('Supabase client not configured')
  }
  return supabase
    .from('leads')
    .insert([{
      nombre: data.nombre,
      whatsapp: data.whatsapp,
      email: data.email || null,
      industria: data.industria,
      problema: data.problema,
      procesos: data.procesos,
      presupuesto: data.presupuesto || null,
      timeline: data.timeline || null,
      source: data.source || 'landing_page',
      ip_address: data.ip_address,
      user_agent: data.user_agent
    }])
    .select()
    .single()
}
