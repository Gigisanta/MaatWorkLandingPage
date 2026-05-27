'use client';

import { WHATSAPP_LINKS } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

const PROBLEMS = [
  { icon: '📅', text: 'La agenda se mezcla y perdés clientes' },
  { icon: '💰', text: 'Cobrar es un caos, siempre hay deudas' },
  { icon: '⏰', text: 'Respondés WhatsApps todo el día' },
];

const SOLUTIONS = [
  { icon: '✅', text: 'Agenda automática que nunca se mezcla' },
  { icon: '💳', text: 'Cobros digitalizados, sin errores' },
  { icon: '⚡', text: 'Respuestas automáticas por WhatsApp' },
];

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Gestión de Clientes',
    desc: 'Historial completo',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Cobros y Cuotas',
    desc: 'Cobranza automática',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Turnos Automáticos',
    desc: 'Confirmaciones por WhatsApp',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    title: 'WhatsApp Auto',
    desc: 'Respuestas 24/7',
  },
];

const STEPS = [
  {
    number: '01',
    title: 'Diagnóstico',
    desc: 'Analizamos tu negocio',
    duration: '1-2 días',
  },
  {
    number: '02',
    title: 'Prototipo',
    desc: 'Ves tu app funcionando',
    duration: '3-7 días',
  },
  {
    number: '03',
    title: 'Lanzamiento',
    desc: 'En producción y listo',
    duration: '1-2 días',
  },
];

export default function AllInOne() {
  return (
    <section id="all-in-one" className="relative section-y bg-[#030014]/70">
      <div className="container-custom px-4 max-w-6xl mx-auto">

        {/* Header */}
        <div className="section-header">
          <h2>
            Tu negocio <span className="gradient-text">automatizado</span>
          </h2>
          <p>De cero a producción en 5-10 días</p>
        </div>

        {/* Problems → Solutions */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Problems */}
          <div className="problem-card">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">😰</span>
              <h3 className="text-lg font-semibold text-red-400">¿Te suena familiar?</h3>
            </div>
            <ul className="space-y-4">
              {PROBLEMS.map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <span className="text-xl">{p.icon}</span>
                  <span>{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="solution-card">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🚀</span>
              <h3 className="text-lg font-semibold text-green-400">Con MaatWork</h3>
            </div>
            <ul className="space-y-4">
              {SOLUTIONS.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <span className="text-xl">{s.icon}</span>
                  <span>{s.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {FEATURES.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="icon-container mx-auto mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="mb-10">
          <div className="steps-row">
            {STEPS.map((step, i) => (
              <div key={i} className="text-center" style={{ minWidth: '6rem', maxWidth: '9rem', flex: '0 0 auto' }}>
                <div className="step-circle mx-auto mb-3">
                  <span>{step.number}</span>
                </div>
                <h4 className="text-base font-semibold text-white mb-1">{step.title}</h4>
                <p className="text-sm text-slate-400 mb-1">{step.desc}</p>
                <span className="text-sm text-violet-400 font-medium">{step.duration}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={WHATSAPP_LINKS.allInOne}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green inline-flex items-center gap-2 px-8 py-4 text-lg"
          >
            <WhatsAppIcon className="w-6 h-6" />
            Comenzar ahora
          </a>
        </div>

      </div>
    </section>
  );
}