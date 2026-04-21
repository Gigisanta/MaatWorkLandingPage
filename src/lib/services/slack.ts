interface Lead {
  id: string
  nombre: string
  whatsapp: string
  email: string | null
  industria: string
  problema: string
  procesos: string[]
  presupuesto: string | null
  timeline: string | null
  created_at: string
}

const industries: Record<string, string> = {
  natatorio: '🏊 Natatorio',
  peluqueria: '💇 Peluquería',
  gimnasio: '🏋️ Gimnasio',
  academia: '📚 Academia',
  consultorio: '🩺 Consultorio',
  otro: '📦 Otro'
}

export async function sendSlackNotification(lead: Lead) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('SLACK_WEBHOOK_URL not configured, skipping notification')
    return
  }

  const blocks = [
    {
      type: 'header',
      text: { type: 'plain_text', text: '🎯 Nuevo Lead desde Landing' }
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*Nombre:*\n${lead.nombre}` },
        { type: 'mrkdwn', text: `*Industria:*\n${industries[lead.industria] || lead.industria}` }
      ]
    },
    {
      type: 'section',
      fields: [
        { type: 'mrkdwn', text: `*WhatsApp:*\n${lead.whatsapp}` },
        { type: 'mrkdwn', text: `*Email:*\n${lead.email || 'No proporcionado'}` }
      ]
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Problema:*\n${lead.problema.slice(0, 200)}${lead.problema.length > 200 ? '...' : ''}`
      }
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `Lead ID: ${lead.id} | ${new Date(lead.created_at).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}`
        }
      ]
    }
  ]

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks })
  })

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.status}`)
  }

  return response.json()
}
