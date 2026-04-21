'use client'

import { Check, Zap, Shield, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

const features = [
  'WhatsApp automático (cuotas, turnos)',
  'Agenda de turnos / gestión de grupos',
  'Gestión de clientes y membresías',
  'Cobros online integrados',
  'Panel avanzado con métricas del mes',
  'Acceso multi-usuario con roles',
  'Registro de asistentes',
  'Tu marca, tu subdominio',
  'Soporte prioritario incluido',
]

const trustIndicators = [
  { icon: Shield, text: 'Pago seguro' },
  { icon: Headphones, text: 'Soporte dedicado' },
  { icon: Zap, text: 'Activación en 7-14 días' },
]

export function PricingSection() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#04040e]" />

      {/* Subtle gradient orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div
        ref={ref}
        className={`relative max-w-3xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Precios
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-black text-white tracking-tight">
            Tu app, a tu medida
          </h2>
          <p className="text-lg text-zinc-400 mt-5 max-w-xl mx-auto">
            Cada proyecto es único. Cotizamos según tus necesidades específicas.
          </p>
        </div>

        {/* Glass card with animated gradient border */}
        <div className="relative group">
          {/* Animated gradient border */}
          <div
            className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 opacity-60"
            style={{
              backgroundSize: '200% 100%',
              animation: 'gradient-shift 4s ease infinite',
            }}
          />
          <div
            className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 opacity-40 blur-sm"
          />

          {/* Glass card */}
          <div className="relative rounded-xl bg-zinc-900/90 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Spotlight gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative p-8 lg:p-12">
              {/* Badge */}
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl shadow-violet-500/25">
                    ⭐ Más elegido
                  </div>
                  {/* Glow behind badge */}
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-lg opacity-50" />
                </div>
              </div>

              {/* Pricing header */}
              <div className="text-center mb-10 pt-6">
                <div className="text-sm uppercase tracking-widest text-zinc-500 mb-3">
                  App Completa
                </div>
                <div className="font-display text-6xl lg:text-7xl font-black text-white tracking-tight">
                  A cotizar
                </div>
                <div className="text-zinc-500 mt-4 max-w-sm mx-auto">
                  Presupuesto personalizado según tu operación
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-10">
                {features.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 group"
                    style={{
                      transitionDelay: `${i * 50}ms`,
                    }}
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mt-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-110 transition-transform duration-300">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </span>
                    <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="relative group/btn">
                <Button
                  variant="primary-dark"
                  size="lg"
                  className="w-full relative z-10"
                >
                  Solicitar cotización
                  <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Button>
                {/* Button glow */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 opacity-0 group-hover/btn:opacity-20 blur-xl transition-opacity duration-300 -z-10" />
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
          {trustIndicators.map((indicator, i) => {
            const Icon = indicator.icon
            return (
              <div
                key={i}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-400 transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{indicator.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* CSS for gradient animation */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </section>
  )
}
