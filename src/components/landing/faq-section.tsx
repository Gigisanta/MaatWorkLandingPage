'use client'

import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

const faqs = [
  {
    q: '¿Necesito conocimientos técnicos?',
    a: 'No. Vos seguís operando tu negocio como siempre. Nosotros nos encargamos de toda la parte técnica y te entregamos una app lista para usar.',
  },
  {
    q: '¿Cuánto tiempo tarda en estar lista?',
    a: 'Entre 7 y 14 días hábiles desde que nos pasás la info. El primer prototipo lo ves en 48 horas.',
  },
  {
    q: '¿Qué pasa si ya tengo un sistema?',
    a: 'No hay problema. Migramos los datos y la integramos con lo que ya usás. Sin perder historial.',
  },
  {
    q: '¿Funciona en mi celular?',
    a: 'Sí. La app es responsive y funciona perfecto en cualquier dispositivo: celular, tablet o computadora.',
  },
  {
    q: '¿Qué incluye el precio?',
    a: 'Todo: la app, el dominio personalizado, WhatsApp automático, panel de métricas y soporte prioritario. Sin costos ocultos.',
  },
  {
    q: '¿Hay garantía?',
    a: 'Sí. Si en 30 días no estás satisfecho, te devolvemos el dinero. Sin preguntas.',
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section id="faq" className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.08),transparent)]" />

      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl" />

      <div
        ref={ref}
        className={`relative max-w-3xl mx-auto transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-400 mb-4">
            <Sparkles className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
            Preguntas frecuentes
          </h2>
          <p className="text-white/50 mt-4 max-w-lg mx-auto">
            Todo lo que necesitás saber antes de empezar
          </p>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="group relative border border-white/[0.06] rounded-xl overflow-hidden bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300"
              style={{
                transitionDelay: `${i * 50}ms`,
              }}
            >
              {/* Left accent line */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={cn(
                  'w-full flex items-center justify-between gap-4 p-6 text-left transition-colors duration-200',
                  'hover:bg-white/[0.02]',
                  open === i ? 'bg-white/[0.03]' : ''
                )}
              >
                <span className="font-semibold text-white group-hover:text-violet-200 transition-colors">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-white/40 flex-shrink-0 transition-all duration-300',
                    open === i && 'rotate-180 text-violet-400'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  open === i ? 'max-h-48' : 'max-h-0'
                )}
              >
                <div className="px-6 pb-6">
                  <div className="w-full h-px bg-gradient-to-r from-violet-500/20 via-indigo-500/10 to-transparent mb-4" />
                  <p className="text-white/60 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/40 mb-4">¿Tenés otra pregunta?</p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-all duration-200 font-medium"
          >
            Escribinos
            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
