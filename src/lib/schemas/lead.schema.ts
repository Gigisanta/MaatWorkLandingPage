import { z } from 'zod'

const leadSchemaBase = z.object({
  nombre: z.string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre demasiado largo'),

  whatsapp: z.string()
    .min(8, 'WhatsApp inválido')
    .regex(/^\+?[1-9]\d{6,14}$/, 'Formato de WhatsApp inválido'),

  email: z.string()
    .email('Email inválido')
    .optional()
    .or(z.literal('')),

  industria: z.enum([
    'natatorio',
    'peluqueria',
    'gimnasio',
    'academia',
    'consultorio',
    'otro',
    'no_define'
  ]),

  problema: z.string()
    .min(10, 'Describe el problema con al menos 10 caracteres')
    .max(1000, 'Descripción demasiado larga'),

  procesos: z.array(z.string()).default([]),

  source: z.enum([
    'landing_page',
    'contact_form',
    'roi_calculator',
    'exit_intent'
  ]).optional(),

  presupuesto: z.enum([
    'menos_50k',
    '50k_150k',
    '150k_500k',
    'mas_500k',
    'no_define'
  ]).optional(),

  timeline: z.enum([
    'urgente',
    'corto',
    'medio',
    'largo',
    'explorando'
  ]).optional()
})

export const leadSchema = leadSchemaBase.superRefine((data, ctx) => {
  // Require at least one proceso for main contact form sources
  const requiresProcesos = !data.source || data.source === 'landing_page' || data.source === 'contact_form'
  if (requiresProcesos && (!data.procesos || data.procesos.length === 0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Selecciona al menos un proceso',
      path: ['procesos'],
    })
  }
})

export type LeadInput = z.infer<typeof leadSchemaBase>
