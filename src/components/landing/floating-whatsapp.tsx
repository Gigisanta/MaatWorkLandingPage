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
        'fixed bottom-8 right-8 z-50',
        'flex items-center justify-center w-16 h-16 rounded-full',
        'bg-gradient-to-br from-green-500 to-emerald-600 text-white',
        'shadow-xl shadow-green-500/30',
        'hover:scale-110 hover:shadow-2xl hover:shadow-green-500/40',
        'transition-all duration-300',
        'group',
        'animate-float'
      )}
      aria-label="Contactar por WhatsApp"
    >
      {/* Pulse rings */}
      <span className="absolute inset-0 rounded-full bg-green-500/30 animate-ping" />
      <span className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse" />

      {/* Icon */}
      <div className="relative z-10">
        <MessageCircle className="w-7 h-7" />
      </div>

      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-4 py-2.5 bg-zinc-900/95 backdrop-blur-xl text-white text-sm rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 translate-x-2 group-hover:translate-x-0 shadow-xl">
        <span className="relative z-10">Escribinos por WhatsApp</span>
        {/* Arrow */}
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-zinc-900/95" />
      </span>
    </a>
  )
}
