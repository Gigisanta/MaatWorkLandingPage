'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Martín Rodríguez',
    business: 'Natatorio Acuática',
    location: 'Bahía Blanca',
    quote: 'Pasamos de perder el 30% de los clientes por olvido a tener 0 cancelaciones. El WhatsApp automático cambió todo.',
    result: '+40% retención',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'Laura Mendes',
    business: 'Peluquería Color',
    location: 'Buenos Aires',
    quote: 'Mi agenda ahora se llena sola. Los clientes confirman turnos por WhatsApp y yo solo me-focus en cortar.',
    result: '+60% eficiencia',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    name: 'Diego Fernández',
    business: 'Gimnasio PowerFit',
    location: 'Córdoba',
    quote: 'Cobrar cuotas era un dolor de cabeza. Ahora con un clic mando recordatorios y cobros. Tiempo解放.',
    result: '+25% cobranzas',
    gradient: 'from-amber-500 to-orange-500',
  },
]

export function TestimonialsSection() {
  const [active, setActive] = useState(0)

  const prev = () => setActive((a) => (a - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive((a) => (a + 1) % testimonials.length)

  return (
    <section id="testimonials" className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(99,102,241,0.1),transparent)]" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="badge badge-primary mb-6">Testimonios</span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
            Ya lo están usando
          </h2>
          <p className="text-lg text-white/60 mt-4 max-w-xl mx-auto">
            Negocios como el tuyo que ya automatizaron sus procesos
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 z-10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 z-10"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Card */}
          <div className="glass p-8 lg:p-12">
            {/* Quote icon */}
            <Quote className="w-10 h-10 text-primary/40 mb-6" />

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl lg:text-2xl text-white/90 font-medium leading-relaxed mb-8">
              "{testimonials[active].quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">{testimonials[active].name}</div>
                <div className="text-sm text-white/50">
                  {testimonials[active].business} · {testimonials[active].location}
                </div>
              </div>
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${testimonials[active].gradient} text-white text-sm font-bold`}>
                {testimonials[active].result}
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === active ? 'w-8 bg-primary' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ir al testimonio ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
