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
      <div className="relative overflow-hidden rounded-2xl border border-[rgba(99,102,241,0.2)] bg-[rgba(99,102,241,0.08)] p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(99,102,241,0.15)] to-transparent pointer-events-none" />
        <div className="relative">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[rgba(99,102,241,0.3)] to-[rgba(139,92,246,0.3)] flex items-center justify-center mb-6 border border-[rgba(99,102,241,0.4)]">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">Mensaje enviado</h3>
          <p className="text-[rgba(255,255,255,0.65)]">
            Te contactaremos en menos de 24 horas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="nombre" className="block text-sm font-medium text-[rgba(255,255,255,0.85)]">
            Nombre completo
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Juan Perez"
            disabled={isSubmitting}
            className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] transition-all duration-200 focus:outline-none focus:border-[rgba(99,102,241,0.6)] focus:bg-[rgba(99,102,241,0.06)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:border-[rgba(99,102,241,0.6)] disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="industria" className="block text-sm font-medium text-[rgba(255,255,255,0.85)]">
            Industria
          </label>
          <select
            id="industria"
            name="industria"
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-white transition-all duration-200 focus:outline-none focus:border-[rgba(99,102,241,0.6)] focus:bg-[rgba(99,102,241,0.06)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:border-[rgba(99,102,241,0.6)] disabled:opacity-50 cursor-pointer appearance-none [&>option]:bg-[#04040e]"
          >
            <option value="">Selecciona tu industria</option>
            {industries.map(i => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label htmlFor="whatsapp" className="block text-sm font-medium text-[rgba(255,255,255,0.85)]">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            required
            placeholder="+54 11 1234 5678"
            disabled={isSubmitting}
            className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] transition-all duration-200 focus:outline-none focus:border-[rgba(99,102,241,0.6)] focus:bg-[rgba(99,102,241,0.06)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:border-[rgba(99,102,241,0.6)] disabled:opacity-50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-[rgba(255,255,255,0.85)]">
            Email <span className="text-[rgba(255,255,255,0.4)]">(opcional)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="juan@tuempresa.com"
            disabled={isSubmitting}
            className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] transition-all duration-200 focus:outline-none focus:border-[rgba(99,102,241,0.6)] focus:bg-[rgba(99,102,241,0.06)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:border-[rgba(99,102,241,0.6)] disabled:opacity-50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="problema" className="block text-sm font-medium text-[rgba(255,255,255,0.85)]">
          Que proceso queres automatizar?
        </label>
        <textarea
          id="problema"
          name="problema"
          required
          rows={4}
          placeholder="Contanos brevemente que tareas重复itivas te gustaria automatizar..."
          disabled={isSubmitting}
          className="w-full px-4 py-3.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] text-white placeholder-[rgba(255,255,255,0.3)] transition-all duration-200 focus:outline-none focus:border-[rgba(99,102,241,0.6)] focus:bg-[rgba(99,102,241,0.06)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)] focus:border-[rgba(99,102,241,0.6)] disabled:opacity-50 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full relative overflow-hidden rounded-xl bg-gradient-to-r from-[#6366f1] via-[#8b5cf6] to-[#a78bfa] px-8 py-4 text-base font-semibold text-white shadow-[0_0_28px_rgba(99,102,241,0.35)] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]"
      >
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>
    </form>
  )
}
