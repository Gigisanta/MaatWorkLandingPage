'use client'

import { MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/542994569840?text=Hola%2C%20me%20interesa%20automatizar%20mi%20local"
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed bottom-6 right-6 z-50',
        'flex items-center justify-center w-14 h-14 rounded-full',
        'bg-green-500 text-white shadow-lg shadow-green-500/30',
        'hover:bg-green-600 hover:scale-110',
        'transition-all duration-300',
        'group'
      )}
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-1.5 bg-zinc-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
        Escribinos por WhatsApp
      </span>
    </a>
  )
}
