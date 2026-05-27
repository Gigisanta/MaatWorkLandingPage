'use client';

import { useState } from 'react';

import { WHATSAPP_BASE_URL, WHATSAPP_LINKS } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

const TESTIMONIALS = [
  {
    quote: "Perdía 3 horas diarias con la agenda. Ahora todo está automatizado.",
    name: 'María González',
    business: 'Gimnasio FitLife',
  },
  {
    quote: "Tenía $40k en deudas, ahora tengo todo registrado y los pagos son puntuales.",
    name: 'Carlos Rodríguez',
    business: 'Belleza Express',
  },
  {
    quote: "Tengo 120 alumnos en 8 horarios. La agenda se maneja sola y nunca más mezclé un turno.",
    name: 'Roberto Sánchez',
    business: 'Estudio de Danza',
  },
];

const FAQS = [
  {
    question: '¿Necesito algo especial?',
    answer: 'Solo un celular e internet. Funciona en cualquier navegador moderno.',
  },
  {
    question: '¿Cuánto tarda en estar funcionando?',
    answer: 'De 5 a 10 días: diagnóstico (1-2), prototipo (3-7) y lanzamiento (1-2).',
  },
  {
    question: '¿Para qué negocios funciona?',
    answer: 'Gimnasios, salones de belleza, academias, centros de pilates, consultorios y más.',
  },
  {
    question: '¿Me enseñan a usarla?',
    answer: 'Sí, incluimos capacitación y soporte por WhatsApp.',
  },
  {
    question: '¿Mis datos están seguros?',
    answer: '100% tuyos. Encriptación, backups diarios, sin compartir con terceros.',
  },
];

const INDUSTRIES = [
  { value: 'gimnasio', label: 'Gimnasio' },
  { value: 'peluqueria', label: 'Salón de belleza' },
  { value: 'academia', label: 'Academia / Escuela' },
  { value: 'consultorio', label: 'Consultorio profesional' },
  { value: 'natatorio', label: 'Natatorio / Pileta' },
  { value: 'otro', label: 'Otro' },
];

const PROCESOS = [
  { value: 'agenda', label: 'Agenda de turnos' },
  { value: 'cobros', label: 'Cobros y cuotas' },
  { value: 'whatsapp', label: 'WhatsApp automático' },
  { value: 'clientes', label: 'Gestión de clientes' },
  { value: 'reportes', label: 'Reportes y métricas' },
];

const PRESUPUESTO_OPTIONS = [
  { value: 'menos_50k', label: 'Menos de $50.000/mes' },
  { value: '50k_150k', label: '$50.000 - $150.000/mes' },
  { value: '150k_500k', label: '$150.000 - $500.000/mes' },
  { value: 'mas_500k', label: 'Más de $500.000/mes' },
  { value: 'no_define', label: 'Aún no lo tengo definido' },
];

const TIMELINE_OPTIONS = [
  { value: 'urgente', label: 'Urgente (esta semana)' },
  { value: 'corto', label: 'Corto plazo (1-2 semanas)' },
  { value: 'medio', label: 'Mediano plazo (1 mes)' },
  { value: 'largo', label: 'Largo plazo (más de 1 mes)' },
  { value: 'explorando', label: 'Solo explorando' },
];

function getUtmSource(): string {
  if (typeof window === 'undefined') return 'contact_form';
  const params = new URLSearchParams(window.location.search);
  return params.get('utm_source') || 'contact_form';
}

export default function ContactFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    email: '',
    industria: '' as string,
    problema: '',
    procesos: [] as string[],
    presupuesto: '' as string,
    timeline: '' as string,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (formData.nombre.length < 2) newErrors.nombre = 'Nombre muy corto';
    if (!/^\+?[1-9]\d{6,14}$/.test(formData.whatsapp.replace(/\s/g, ''))) {
      newErrors.whatsapp = 'WhatsApp inválido';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.industria) newErrors.industria = 'Selecciona tu industria';
    if (formData.problema.length < 10) newErrors.problema = 'Describe el problema (mín 10 caracteres)';
    if (formData.procesos.length === 0) newErrors.procesos = 'Selecciona al menos un proceso';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProcesoToggle = (value: string) => {
    setFormData(prev => ({
      ...prev,
      procesos: prev.procesos.includes(value)
        ? prev.procesos.filter(p => p !== value)
        : [...prev.procesos, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const leadData = {
        nombre: formData.nombre,
        whatsapp: formData.whatsapp.replace(/\s/g, ''),
        email: formData.email || undefined,
        industria: formData.industria,
        problema: formData.problema,
        procesos: formData.procesos,
        presupuesto: formData.presupuesto || undefined,
        timeline: formData.timeline || undefined,
        source: getUtmSource(),
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error del servidor');
      }

      const problemaEncoded = encodeURIComponent(formData.problema);
      const procesosEncoded = encodeURIComponent(formData.procesos.join(', '));
      const message = encodeURIComponent(
        `¡Hola! Me gustaría automatizar mi negocio.\n\nNombre: ${formData.nombre}\nWhatsApp: ${formData.whatsapp}\nIndustria: ${formData.industria}\nProblema: ${formData.problema}\nProcesos a automatizar: ${formData.procesos.join(', ')}${formData.presupuesto ? `\nPresupuesto: ${formData.presupuesto}` : ''}`
      );
      window.open(`${WHATSAPP_BASE_URL}?text=${message}`, '_blank');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting lead:', error);
      setErrors({ submit: 'Error al enviar. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="section-y bg-[#030014]/70">
        <div className="container-custom px-4 max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-green-600/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">¡Gracias!</h3>
          <p className="text-slate-300 text-lg">Te contactaremos pronto por WhatsApp.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="section-y bg-[#030014]/70">
      <div className="container-custom px-4 max-w-6xl mx-auto">

        {/* Header */}
        <div className="section-header">
          <h2>
            Automatizá tu negocio <span className="gradient-text">hoy</span>
          </h2>
          <p>De cero a producción en 5-10 días</p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testimonial-card">
              <p className="text-slate-200 text-base italic mb-4">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{t.name}</p>
                  <p className="text-slate-400 text-sm">{t.business}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ + Form */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* FAQ */}
          <div>
            <h3 className="text-xl font-semibold text-white mb-5">Preguntas frecuentes</h3>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className={`faq-item-base ${openIndex === i ? 'active' : ''}`}>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                    aria-expanded={openIndex === i}
                    aria-controls={`faq-${i}`}
                  >
                    <span className="font-medium text-white pr-4">{faq.question}</span>
                    <svg
                      className={`w-5 h-5 text-violet-400 flex-shrink-0 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openIndex === i && (
                    <div id={`faq-${i}`} className="px-4 pb-4" role="region">
                      <p className="text-slate-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-base p-6">
            <h3 className="text-xl font-semibold text-white mb-5">Contactanos</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre *"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className={`input-base ${errors.nombre ? 'border-red-500' : ''}`}
                />
                {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp *"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className={`input-base ${errors.whatsapp ? 'border-red-500' : ''}`}
                />
                {errors.whatsapp && <p className="text-red-400 text-xs mt-1">{errors.whatsapp}</p>}
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input-base ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <select
                  required
                  value={formData.industria}
                  onChange={(e) => setFormData({ ...formData, industria: e.target.value })}
                  className={`input-base ${errors.industria ? 'border-red-500' : ''}`}
                >
                  <option value="">Tipo de negocio *</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind.value} value={ind.value} className="bg-[#0a0a1a]">{ind.label}</option>
                  ))}
                </select>
                {errors.industria && <p className="text-red-400 text-xs mt-1">{errors.industria}</p>}
              </div>

              <div>
                <textarea
                  required
                  placeholder="¿Qué problema querés resolver? * (mín 10 caracteres)"
                  value={formData.problema}
                  onChange={(e) => setFormData({ ...formData, problema: e.target.value })}
                  rows={3}
                  className={`input-base resize-none ${errors.problema ? 'border-red-500' : ''}`}
                />
                {errors.problema && <p className="text-red-400 text-xs mt-1">{errors.problema}</p>}
              </div>

              <div>
                <label className="text-slate-300 text-sm mb-2 block">¿Qué procesos querés automatizar? *</label>
                <div className="flex flex-wrap gap-2">
                  {PROCESOS.map((proc) => (
                    <button
                      key={proc.value}
                      type="button"
                      onClick={() => handleProcesoToggle(proc.value)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        formData.procesos.includes(proc.value)
                          ? 'bg-violet-600 text-white'
                          : 'bg-violet-950/50 text-slate-300 hover:bg-violet-900/50'
                      }`}
                    >
                      {proc.label}
                    </button>
                  ))}
                </div>
                {errors.procesos && <p className="text-red-400 text-xs mt-1">{errors.procesos}</p>}
              </div>

              <div>
                <select
                  value={formData.presupuesto}
                  onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
                  className="input-base"
                >
                  <option value="">Presupuesto mensual (opcional)</option>
                  {PRESUPUESTO_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0a0a1a]">{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                  className="input-base"
                >
                  <option value="">¿Cuándo querés empezar? (opcional)</option>
                  {TIMELINE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0a0a1a]">{opt.label}</option>
                  ))}
                </select>
              </div>

              {errors.submit && <p className="text-red-400 text-sm text-center">{errors.submit}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-green w-full py-4 text-base disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Enviar y continuar por WhatsApp'}
              </button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-3">
              Sin spam. Solo te contactamos por WhatsApp.
            </p>
          </div>

        </div>

        {/* WhatsApp Direct */}
        <div className="text-center mt-10">
          <a
            href={WHATSAPP_LINKS.contact}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-green-400 hover:text-green-300 text-base"
          >
            <WhatsAppIcon className="w-6 h-6" />
            O escribinos directo
          </a>
        </div>

      </div>
    </section>
  );
}