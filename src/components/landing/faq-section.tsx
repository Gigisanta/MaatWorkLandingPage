'use client'

import { Sparkles, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStaggerReveal } from '@/hooks'
import { FAQAccordion, FAQItem } from '@/components/ui/faq-accordion'

const faqs: FAQItem[] = [
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
  {
    q: '¿Puedo personalizar el diseño?',
    a: 'Sí. El diseño se adapta a tu marca. Colores, logo y estilo visual los configuramos juntos.',
  },
  {
    q: '¿Qué pasa si necesito cambios después?',
    a: 'Incluye ajustes menores. Para cambios grandes, cotizamos por separado pero siempre con precios justos.',
  },
]

export function FaqSection() {
  const { ref, isVisible, getItemStyle } = useStaggerReveal<HTMLDivElement>({
    threshold: 0.1,
    staggerDelay: 80,
    itemCount: faqs.length,
  })

  return (
    <section
      id="faq"
      className="py-24 px-6 lg:px-12 bg-[var(--color-bg-base)] relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.1),transparent)]" />

      {/* Decorative elements */}
      <div className="absolute top-40 left-20 w-40 h-40 bg-violet-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 right-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-purple-500/3 rounded-full blur-3xl" />

      <div
        ref={ref}
        className="relative max-w-3xl mx-auto"
      >
        {/* Header */}
        <div
          className={cn(
            'text-center mb-16',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transition: 'all 700ms ease 0ms' }}
        >
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

        {/* Premium FAQ Accordion */}
        <div className="space-y-4 px-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              style={getItemStyle(index)}
            >
              <FAQAccordion
                items={[faq]}
                defaultOpen={null}
                idPrefix={`faq-${index}`}
              />
            </div>
          ))}
        </div>

        {/* CTA with decorative elements */}
        <div
          className={cn(
            'text-center mt-16 relative trust-badge',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
          style={{ transition: `all 700ms ease ${faqs.length * 80 + 100}ms` }}
        >
          {/* Decorative line */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-violet-500/30" />

          <p className="text-white/40 mb-4">¿Tenés otra pregunta?</p>
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 text-violet-400 hover:text-violet-300 transition-all duration-200 font-medium link-arrow cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            Escribinos
          </a>
        </div>
      </div>
    </section>
  )
}
