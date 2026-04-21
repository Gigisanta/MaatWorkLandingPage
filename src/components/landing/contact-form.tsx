'use client'

import { useState } from 'react'

const industries = [
  { value: 'natatorio', label: 'Natatorio' },
  { value: 'peluqueria', label: 'Peluqueria' },
  { value: 'gimnasio', label: 'Gimnasio' },
  { value: 'academia', label: 'Academia Deportiva' },
  { value: 'consultorio', label: 'Consultorio' },
  { value: 'otro', label: 'Otro' },
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.get('nombre'),
          whatsapp: data.get('whatsapp'),
          email: data.get('email'),
          industria: data.get('industria'),
          problema: data.get('problema'),
        }),
      })

      if (res.ok) {
        setIsSuccess(true)
        form.reset()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-12 text-center">
        {/* Animated glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent pointer-events-none" />

        {/* Success icon */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-6 shadow-xl shadow-violet-500/30 animate-fade-in-scale">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h3 className="relative font-display text-2xl font-bold text-white mb-3">Mensaje enviado</h3>
        <p className="relative text-white/60">
          Te contactaremos en menos de 24 horas.
        </p>

        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 group">
          <label htmlFor="nombre" className="block text-sm font-medium text-white/80 group-focus-within:text-violet-400 transition-colors">
            Nombre completo
          </label>
          <div className="relative">
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              placeholder="Juan Perez"
              disabled={isSubmitting}
              className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 transition-all duration-300 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] disabled:opacity-50"
            />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 to-indigo-500/0 opacity-0 focus-within:opacity-20 pointer-events-none transition-opacity duration-300" />
          </div>
        </div>
        <div className="space-y-3 group">
          <label htmlFor="industria" className="block text-sm font-medium text-white/80 group-focus-within:text-violet-400 transition-colors">
            Industria
          </label>
          <div className="relative">
            <select
              id="industria"
              name="industria"
              required
              disabled={isSubmitting}
              className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white transition-all duration-300 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] disabled:opacity-50 cursor-pointer appearance-none [&>option]:bg-[#04040e] [&>option]:text-white"
            >
              <option value="">Selecciona tu industria</option>
              {industries.map(i => (
                <option key={i.value} value={i.value}>{i.label}</option>
              ))}
            </select>
            {/* Dropdown arrow */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3 group">
          <label htmlFor="whatsapp" className="block text-sm font-medium text-white/80 group-focus-within:text-violet-400 transition-colors">
            WhatsApp
          </label>
          <div className="relative">
            <input
              id="whatsapp"
              name="whatsapp"
              type="tel"
              required
              placeholder="+54 11 1234 5678"
              disabled={isSubmitting}
              className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 transition-all duration-300 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] disabled:opacity-50"
            />
            {/* WhatsApp icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-emerald-500/60" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
          </div>
        </div>
        <div className="space-y-3 group">
          <label htmlFor="email" className="block text-sm font-medium text-white/80 group-focus-within:text-violet-400 transition-colors">
            Email <span className="text-white/30">(opcional)</span>
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="juan@tuempresa.com"
              disabled={isSubmitting}
              className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 transition-all duration-300 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] disabled:opacity-50"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3 group">
        <label htmlFor="problema" className="block text-sm font-medium text-white/80 group-focus-within:text-violet-400 transition-colors">
          Que proceso queres automatizar?
        </label>
        <textarea
          id="problema"
          name="problema"
          required
          rows={4}
          placeholder="Contanos brevemente que tareas repetitivas te gustaria automatizar..."
          disabled={isSubmitting}
          className="w-full px-4 py-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-white/30 transition-all duration-300 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/[0.05] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] disabled:opacity-50 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-xl disabled:hover:shadow-violet-500/25"
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              Enviar consulta
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>
    </form>
  )
}
