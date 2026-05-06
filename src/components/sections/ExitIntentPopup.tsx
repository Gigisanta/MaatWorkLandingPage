'use client';

import { useState, useEffect } from 'react';
import { useExitIntent } from '@/hooks/use-exit-intent';

interface ExitIntentPopupProps {
  enabled?: boolean;
}

export default function ExitIntentPopup({ enabled = true }: ExitIntentPopupProps) {
  const { showExitIntent, closeExitIntent } = useExitIntent({ enabled });
  const [formData, setFormData] = useState({ nombre: '', whatsapp: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (showExitIntent) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showExitIntent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.whatsapp) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formData.nombre,
          whatsapp: formData.whatsapp.replace(/\s/g, ''),
          email: formData.email || undefined,
          industria: 'no_define',
          problema: 'Salió de la landing sin convertir - exit intent popup',
          procesos: [],
          source: 'exit_intent',
        }),
      });

      const message = encodeURIComponent(
        `¡Hola! Me fui de la landing pero quiero saber más sobre MaatWork.\n\nNombre: ${formData.nombre}\nWhatsApp: ${formData.whatsapp}`
      );
      window.open(`https://wa.me/542994569840?text=${message}`, '_blank');
      setSubmitted(true);
      setTimeout(() => closeExitIntent(), 2000);
    } catch (error) {
      console.error('Error submitting exit intent form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!showExitIntent) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeExitIntent}
      />

      <div className="relative bg-[#0a0a1a] border border-violet-700/50 rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-violet-900/20">
        <button
          onClick={closeExitIntent}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-600/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">¡Gracias!</h3>
            <p className="text-slate-300">Te redirigimos a WhatsApp...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">¡Espera!</h3>
              <p className="text-slate-300">
                Dejá tus datos y te mandamos info para que puedas automatizar tu negocio.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="input-base"
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-base"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-green w-full py-4 disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Quiero saber más'}
              </button>

              <p className="text-xs text-slate-500 text-center">
                Sin spam. Solo te contactamos por WhatsApp.
              </p>
            </form>

            <button
              onClick={closeExitIntent}
              className="w-full mt-3 text-slate-400 hover:text-slate-300 text-sm transition-colors"
            >
              No, mejor sigo mirando
            </button>
          </>
        )}
      </div>
    </div>
  );
}
