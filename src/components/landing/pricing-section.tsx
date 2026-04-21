import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

export function PricingSection() {
  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#04040e]" />

      {/* Subtle gradient orbs for depth */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-violet-400 mb-4">
            Precios
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-black text-white tracking-tight">
            Tu app, a tu medida
          </h2>
          <p className="text-lg text-zinc-400 mt-5 max-w-xl mx-auto">
            Cada proyecto es único. Cotizamos según tus necesidades.
          </p>
        </div>

        {/* Glass card with animated gradient border */}
        <div className="relative group">
          {/* Animated gradient border */}
          <div
            className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 bg-[length:200%_100%] animate-gradient opacity-60"
            style={{
              backgroundSize: '200% 100%',
              animation: 'gradient-shift 4s ease infinite',
            }}
          />
          <div
            className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-violet-500 opacity-40 blur-sm"
          />

          {/* Glass card */}
          <div className="relative rounded-xl bg-zinc-900/80 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Spotlight gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative p-8 lg:p-10">
              {/* Badge */}
              <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-violet-500/25">
                  ⭐ Más elegido
                </div>
              </div>

              {/* Pricing header */}
              <div className="text-center mb-10 pt-4">
                <div className="text-sm uppercase tracking-widest text-zinc-500 mb-3">
                  App Completa
                </div>
                <div className="font-display text-6xl font-black text-white tracking-tight">
                  A cotizar
                </div>
                <div className="text-zinc-500 mt-3">
                  Presupuesto personalizado según tu operación
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-10">
                {features.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 text-zinc-300"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mt-0.5 shadow-lg shadow-violet-500/20">
                      <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                    </span>
                    <span className="text-zinc-400">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button variant="primary-dark" size="lg" className="w-full">
                Solicitar cotización
              </Button>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-8 mt-10 text-zinc-600 text-sm">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Pago seguro</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
            <span>Soporte dedicado</span>
          </div>
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
