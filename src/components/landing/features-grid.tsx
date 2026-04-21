'use client'

import {
  Users,
  CreditCard,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

interface Feature {
  icon: LucideIcon
  title: string
  desc: string
  gradient: string
  glowColor: string
}

const features: Feature[] = [
  {
    icon: Users,
    title: 'Gestion de Clientes',
    desc: 'Cada cliente tiene su ficha digital: datos de contacto, membresia, asistencia e historial completo.',
    gradient: 'from-violet-500 to-purple-600',
    glowColor: 'rgba(139, 92, 246, 0.2)',
  },
  {
    icon: CreditCard,
    title: 'Cobros y Cuotas',
    desc: 'Registra cobros y deja que la app maneje los recordatorios de pago automaticamente.',
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.2)',
  },
  {
    icon: Calendar,
    title: 'Turnos y Clases',
    desc: 'Organiza grupos o turnos con horarios y capacidades. Sin confusiones ni overlaps.',
    gradient: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.2)',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Automatico',
    desc: 'Mensajes automaticos sin que hagas nada. Confirmar turnos, avisar cuotas pendientes.',
    gradient: 'from-green-500 to-emerald-600',
    glowColor: 'rgba(34, 197, 94, 0.2)',
  },
  {
    icon: BarChart3,
    title: 'Panel para el Dueno',
    desc: 'Entras al panel y en 10 segundos sabes como viene el mes. Sin pedirle nada a nadie.',
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59, 130, 246, 0.2)',
  },
  {
    icon: Settings,
    title: 'Hecha a Medida',
    desc: 'No es generica. Disenamos la app para tus procesos especificos desde cero.',
    gradient: 'from-rose-500 to-pink-600',
    glowColor: 'rgba(244, 63, 94, 0.2)',
  },
]

export function FeaturesGrid() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 })

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden">
      {/* Background subtle grid */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div className="max-w-6xl mx-auto relative">
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-sm font-bold uppercase tracking-wider text-white/40">
            Funcionalidades
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
            Una app que trabaja por vos, 24/7
          </h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Todo lo que necesitas para automatizar tu negocio y recuperar tiempo libre
          </p>
        </div>

        <div
          ref={gridRef}
          className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div
                key={i}
                className="group relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500 cursor-pointer overflow-hidden"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {/* Animated gradient glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${feature.glowColor} 0%, transparent 60%)`,
                  }}
                />

                {/* Icon container with gradient and animation */}
                <div className="relative inline-flex mb-6">
                  <div
                    className={`relative p-4 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <Icon className="w-7 h-7 text-white" strokeWidth={1.5} />
                  </div>
                  {/* Glow behind icon */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-10 scale-110`}
                  />
                </div>

                <h3 className="font-display text-xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/60 leading-relaxed group-hover:text-white/70 transition-colors">
                  {feature.desc}
                </p>

                {/* Animated border gradient on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  style={{
                    background: `linear-gradient(135deg, transparent 40%, ${feature.glowColor.replace('0.2', '0.3')} 50%, transparent 60%)`,
                    backgroundSize: '200% 200%',
                    animation: 'gradient-shift 3s ease infinite',
                  }}
                />

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent ${feature.gradient.includes('violet') ? 'via-violet-500/30' : feature.gradient.includes('emerald') ? 'via-emerald-500/30' : feature.gradient.includes('amber') ? 'via-amber-500/30' : feature.gradient.includes('green') ? 'via-green-500/30' : feature.gradient.includes('blue') ? 'via-blue-500/30' : 'via-rose-500/30'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Corner decoration */}
                <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-white/0 group-hover:border-white/20 rounded-tr-lg transition-all duration-500" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-white/0 group-hover:border-white/20 rounded-bl-lg transition-all duration-500" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
