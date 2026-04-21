'use client'

import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  return (
    <section id="faq" className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.08),transparent)]" />

      <div className="relative max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-400 mb-4">
            <Sparkles className="w-4 h-4" />
            FAQ
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
            Preguntas frecuentes
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-white/[0.08] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={cn(
                  'w-full flex items-center justify-between gap-4 p-6 text-left transition-colors duration-200',
                  'hover:bg-white/[0.02]',
                  open === i ? 'bg-white/[0.03]' : ''
                )}
              >
                <span className="font-semibold text-white">{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-white/40 flex-shrink-0 transition-transform duration-300',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300',
                  open === i ? 'max-h-40' : 'max-h-0'
                )}
              >
                <p className="px-6 pb-6 text-white/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-white/50 mb-4">¿Tenés otra pregunta?</p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors duration-200 font-medium"
          >
            Escribinos →
          </a>
        </div>
      </div>
    </section>
  )
}
