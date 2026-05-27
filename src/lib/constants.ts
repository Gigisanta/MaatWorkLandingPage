export const WHATSAPP_PHONE = '542994569840'
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_PHONE}`

export const WHATSAPP_LINKS = {
  hero: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent('Hola! Quiero probar MaatWork gratis')}`,
  nav: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent('Hola! Quiero probar MaatWork gratis')}`,
  floating: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent('Hola! Quiero más información sobre MaatWork')}`,
  allInOne: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent('Hola! Quiero saber más sobre cómo funciona MaatWork')}`,
  contact: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent('Hola! Quiero más información sobre MaatWork')}`,
  roi: `${WHATSAPP_BASE_URL}?text=${encodeURIComponent('Hola! Quiero empezar con MaatWork')}`,
} as const

export function getWhatsAppLink(message: string): string {
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`
}
