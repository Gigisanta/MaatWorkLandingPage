import { Shield, Zap, Headphones, Award } from 'lucide-react'

const badges = [
  {
    icon: Shield,
    label: 'Datos seguros',
    desc: 'Encriptación de grado bancario',
  },
  {
    icon: Zap,
    label: 'Activación rápida',
    desc: 'Tu app en 7-14 días',
  },
  {
    icon: Headphones,
    label: 'Soporte dedicado',
    desc: 'Te acompañamos siempre',
  },
  {
    icon: Award,
    label: 'Garantía 30 días',
    desc: 'Si no funciona, te devolvemos',
  },
]

export function TrustBadges() {
  return (
    <section className="py-16 px-6 lg:px-12 bg-[#04040e] border-y border-white/[0.06]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {badges.map((badge, i) => {
            const Icon = badge.icon
            return (
              <div key={i} className="flex items-center gap-4 lg:flex-col lg:text-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{badge.label}</div>
                  <div className="text-xs text-white/50">{badge.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
