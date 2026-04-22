import { leadSchema } from '@/lib/schemas/lead.schema'
import type { LeadInput } from '@/lib/schemas/lead.schema'

const INDUSTRY_LABELS: Record<LeadInput['industria'], string> = {
  natatorio: 'Natatorio',
  peluqueria: 'Peluqueria',
  gimnasio: 'Gimnasio',
  academia: 'Academia',
  consultorio: 'Consultorio',
  otro: 'Otro'
}

interface SlackBlock {
  type: string
  [key: string]: unknown
}

interface SlackPayload {
  blocks: SlackBlock[]
}

function buildSlackMessage(lead: LeadInput): SlackPayload {
  const problemaTruncado =
    lead.problema.length > 200
      ? lead.problema.slice(0, 200) + '...'
      : lead.problema

  return {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: 'Nuevo Lead desde Landing' }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Nombre:*\n${lead.nombre}` },
          {
            type: 'mrkdwn',
            text: `*Industria:*\n${INDUSTRY_LABELS[lead.industria]}`
          }
        ]
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*WhatsApp:*\n${lead.whatsapp}` },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${lead.email || 'No proporcionado'}`
          }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Problema:*\n${problemaTruncado}`
        }
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `Fecha: ${new Date().toLocaleString('es-AR', {
              timeZone: 'America/Argentina/Buenos_Aires',
              dateStyle: 'short',
              timeStyle: 'short'
            })}`
          }
        ]
      }
    ]
  }
}

export async function sendSlackNotification(
  lead: unknown
): Promise<{ success: boolean }> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('[Slack] Webhook URL not configured')
    return { success: false }
  }

  const parsed = leadSchema.safeParse(lead)

  if (!parsed.success) {
    throw new Error(
      `Invalid lead data: ${parsed.error.issues.map((e) => e.message).join(', ')}`
    )
  }

  const payload = buildSlackMessage(parsed.data)

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`Slack webhook error: ${response.status}`)
  }

  return { success: true }
}
