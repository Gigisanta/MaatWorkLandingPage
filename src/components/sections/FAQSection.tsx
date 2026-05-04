'use client';

import { useState } from 'react';

const FAQS = [
  {
    question: '¿Necesito algo especial para usar MaatWork?',
    answer: 'Solo necesitas un celular y conexión a internet. MaatWork funciona como aplicación web y es compatible con cualquier navegador moderno (Chrome, Safari, Firefox, Edge), celulares Android y iPhone, tabletas y computadoras. No requiere instalación de software pesado ni hardware específico.',
  },
  {
    question: '¿Cuánto tarda en estar funcionando?',
    answer: 'El proceso completo de diagnóstico, prototipo y lanzamiento toma entre 5 y 10 días hábiles: Diagnóstico (1-2 días), Prototipo (3-7 días), y Launch (1-2 días). El tiempo exacto depende de la complejidad de tu negocio y tu disponibilidad para las revisiones.',
  },
  {
    question: '¿Para qué tipos de negocios funciona?',
    answer: 'MaatWork está diseñado para negocios de servicios que manejan agenda y/o cobros recurrentes: gimnasios, salones de belleza y barberías, academias y escuelas (idiomas, danza, karate, etc.), centros de pilates y yoga, swimming pools y clubes, consultorios profesionales, y cualquier negocio similar.',
  },
  {
    question: '¿Qué pasa si no me gusta?',
    answer: 'Ofrecemos una garantía de satisfacción. Si dentro de los primeros 30 días no estás conforme con la aplicación, podemos hacer ajustes o en casos excepcionales, evaluar la devolución. Tu satisfacción es nuestra prioridad.',
  },
  {
    question: '¿Me enseñan a usarla?',
    answer: 'Sí. El proceso de lanzamiento incluye capacitación básica para ti y tu equipo. Además, la interfaz está diseñada para ser intuitiva y fácil de usar. También tienes soporte por WhatsApp para cualquier duda que te surja.',
  },
  {
    question: '¿Puedo seguir usando lo que ya uso?',
    answer: 'Sí, MaatWork puede complementar o reemplazar gradualmente tus herramientas actuales. No te obligamos a abandonar tus sistemas. Además, puedes exportar tus datos en cualquier momento en formatos abiertos.',
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Tu información es 100% tuya. Aplicamos medidas de seguridad industriales: encriptación de datos en tránsito y en reposo, backups automáticos diarios, servidores seguros con redundancia. Nunca compartimos tus datos con terceros.',
  },
  {
    question: '¿El precio puede cambiar?',
    answer: 'El precio de lanzamiento beta es especial para los primeros clientes. Una vez que salgamos de beta, el precio puede ajustarse, pero: los clientes actuales mantendrán su precio, habrá aviso previo de cualquier cambio, y habrá opciones especiales para clientes existentes.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-12 md:py-16 bg-gradient-to-b from-[#030014] to-[#0a0a1a]">
      <div className="container-custom px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Preguntas <span className="gradient-text">frecuentes</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Resolvemos tus dudas antes de que nos contactes
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-2">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === index
                  ? 'border-violet-500 bg-violet-950/80'
                  : 'border-violet-800/60 bg-[#0a0a1a] hover:bg-violet-950'
              }`}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  className="w-full flex items-center justify-between p-3 text-left transition-all duration-200"
                >
                  <span className="font-medium text-white pr-4">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-violet-400 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </h3>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <p className="px-4 pb-4 text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-6">
          <p className="text-slate-300 mb-4">¿Tienes otra pregunta?</p>
          <a
            href="https://wa.me/5491130916574?text=Hola!%20Tengo%20una%20pregunta%20sobre%20MaatWork"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2 active:scale-95 transition-transform"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Escribinos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
