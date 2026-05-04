'use client';

import { useState } from 'react';

const INDUSTRIES = [
  'Gimnasio',
  'Salón de belleza',
  'Academia / Escuela',
  'Centro de pilates / Yoga',
  'Swimming pool / Club',
  'Consultorio profesional',
  'Otro',
];

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    industry: '',
    problem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const message = encodeURIComponent(
      `¡Hola! Me gustaría contactarlos.\n\nNombre: ${formData.name}\nWhatsApp: ${formData.whatsapp}\nEmail: ${formData.email}\nIndustria: ${formData.industry}\nProblema: ${formData.problem}`
    );

    window.open(`https://wa.me/5491130916574?text=${message}`, '_blank');

    setSubmitted(true);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
<section id="contact" className="py-12 md:py-16 bg-[#0a0a1a]">
        <div className="container-custom px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-green-600/40 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">¡Gracias por contactarnos!</h3>
            <p className="text-slate-300 mb-6">
              Te contactaremos pronto por WhatsApp para definir cómo podemos ayudar a tu negocio.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-secondary active:scale-95 transition-transform">
              Enviar otro mensaje
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-[#0a0a1a]">
      <div className="container-custom px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para <span className="gradient-text">automatizar</span> tu local?
            </h2>
            <p className="text-slate-300">
              Completa el formulario y te contactaremos pronto por WhatsApp
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-violet-950/80 border border-violet-800/60 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300 mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                id="whatsapp"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 bg-violet-950/80 border border-violet-800/60 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="+54 9 11 1234 5678"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-violet-950/80 border border-violet-800/60 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
                Tipo de negocio
              </label>
              <select
                id="industry"
                required
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-3 bg-violet-950/80 border border-violet-800/60 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="" className="bg-[#0a0a1a]">Selecciona tu industria</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry} className="bg-[#0a0a1a]">
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-slate-300 mb-2">
                ¿Cuál es tu mayor desafío?
              </label>
              <textarea
                id="problem"
                rows={4}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full px-4 py-3 bg-violet-950/80 border border-violet-800/60 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                placeholder="Cuéntanos tu mayor desafío..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-green w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 active:bg-violet-700 transition-transform"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar mensaje'
              )}
            </button>
          </form>

          {/* WhatsApp alternative */}
          <div className="mt-6 text-center">
            <p className="text-slate-400 mb-4">¿Prefieres escribir directo?</p>
            <a
              href="https://wa.me/5491130916574?text=Hola!%20Quiero%20más%20información%20sobre%20MaatWork"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Escribir por WhatsApp directo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
