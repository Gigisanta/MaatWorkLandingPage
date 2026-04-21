'use client'

import { Shield, Zap, Headphones, Award } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

const badges = [
  {
    icon: Shield,
    label: 'Datos seguros',
    desc: 'Encriptación de grado bancario',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Zap,
    label: 'Activación rápida',
    desc: 'Tu app en 7-14 días',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Headphones,
    label: 'Soporte dedicado',
    desc: 'Te acompañamos siempre',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Award,
    label: 'Garantía 30 días',
    desc: 'Si no funciona, te devolvemos',
    gradient: 'from-rose-500 to-pink-500',
  },
]

export function TrustBadges() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="py-20 px-6 lg:px-12 bg-[#04040e] border-y border-white/[0.06] relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />

      <div
        ref={ref}
        className={`max-w-6xl mx-auto relative transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {badges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <div
                key={i}
                className="group relative flex items-center gap-4 lg:flex-col lg:text-center p-5 lg:p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300"
                style={{
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                {/* Icon container */}
                <div className="relative flex-shrink-0">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${badge.gradient} p-[1px]`}>
                    <div className="w-full h-full rounded-xl bg-[#04040e] flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${badge.gradient} rounded-xl blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 -z-10`} />
                </div>

                {/* Text */}
                <div className="lg:mt-4">
                  <div className="font-semibold text-white text-sm lg:text-base">{badge.label}</div>
                  <div className="text-xs lg:text-sm text-white/50 mt-0.5">{badge.desc}</div>
                </div>

                {/* Hover accent line */}
                <div className={`absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent ${badge.gradient.includes('emerald') ? 'via-emerald-500/50' : badge.gradient.includes('amber') ? 'via-amber-500/50' : badge.gradient.includes('violet') ? 'via-violet-500/50' : 'via-rose-500/50'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
