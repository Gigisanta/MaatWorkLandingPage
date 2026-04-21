'use client'

import { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    name: 'Martin Rodriguez',
    business: 'Natatorio Acuática',
    location: 'Bahía Blanca',
    quote: 'Pasamos de perder el 30% de los clientes por olvido a tener 0 cancelaciones. El WhatsApp automático cambió todo.',
    result: '+40% retención',
    gradient: 'from-blue-500 to-cyan-500',
    initials: 'MR',
  },
  {
    name: 'Laura Mendes',
    business: 'Peluquería Color',
    location: 'Buenos Aires',
    quote: 'Mi agenda ahora se llena sola. Los clientes confirman turnos por WhatsApp y yo solo me-focus en cortar.',
    result: '+60% eficiencia',
    gradient: 'from-rose-500 to-pink-500',
    initials: 'LM',
  },
  {
    name: 'Diego Fernandez',
    business: 'Gimnasio PowerFit',
    location: 'Cordoba',
    quote: 'Cobrar cuotas era un dolor de cabeza. Ahora con un clic mando recordatorios y cobros. Tiempo解放.',
    result: '+25% cobranzas',
    gradient: 'from-amber-500 to-orange-500',
    initials: 'DF',
  },
]

export function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const prev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActive((a) => (a - 1 + testimonials.length) % testimonials.length)
  }

  const next = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActive((a) => (a + 1) % testimonials.length)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500)
    return () => clearTimeout(timer)
  }, [active])

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActive((a) => (a + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials" className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(99,102,241,0.1),transparent)]" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl" />

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
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-16 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-10 group"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-16 w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 z-10 group"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Card with animation */}
          <div
            className={`glass p-8 lg:p-12 transition-all duration-500 ${
              isAnimating ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
            }`}
          >
            {/* Quote icon */}
            <div className="relative mb-6">
              <Quote className="w-12 h-12 text-primary/30" />
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-xl lg:text-2xl text-white/90 font-medium leading-relaxed mb-10">
              "{testimonials[active].quote}"
            </blockquote>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar placeholder with gradient */}
                <div className={`relative w-14 h-14 rounded-full bg-gradient-to-br ${testimonials[active].gradient} flex items-center justify-center text-white font-bold text-lg`}>
                  {testimonials[active].initials}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonials[active].name}</div>
                  <div className="text-sm text-white/50">
                    {testimonials[active].business} · {testimonials[active].location}
                  </div>
                </div>
              </div>
              <div className={`relative px-5 py-2.5 rounded-full bg-gradient-to-r ${testimonials[active].gradient} text-white text-sm font-bold shadow-lg`}>
                <span className="relative z-10">{testimonials[active].result}</span>
                <div className={`absolute inset-0 bg-gradient-to-r ${testimonials[active].gradient} rounded-full blur-xl opacity-50`} />
              </div>
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-3 mt-10">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true)
                    setActive(i)
                  }
                }}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? 'w-10 bg-gradient-to-r from-indigo-500 to-purple-500'
                    : 'w-2.5 bg-white/20 hover:bg-white/40'
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
