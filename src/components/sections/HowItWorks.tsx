'use client';

const STEPS = [
  {
    number: '01',
    title: 'Diagnóstico',
    description: 'Analizamos tu negocio, procesos actuales y puntos de dolor para entender qué necesitas automatizar.',
    duration: '1-2 días',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Prototipo',
    description: 'Creamos una versión inicial de tu app personalizada con datos de prueba para que veas cómo queda.',
    duration: '3-7 días',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Lanzamiento',
    description: 'Lanzamos tu app en producción, migramos datos si es necesario y te capacitamos para que empieces a usar MaatWork.',
    duration: '1-2 días',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-12 md:py-16 bg-gradient-to-b from-[#030014] to-[#0a0a1a]">
      <div className="container-custom px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            En <span className="gradient-text">3 pasos</span> tienes tu app funcionando
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            De cero a producción en 5-10 días. Sin complicaciones, con soporte incluido.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line */}
              {index < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+3rem)] w-[calc(100%-6rem)] h-0.5 bg-gradient-to-r from-violet-600/50 to-transparent z-0" />
              )}

              <div className="relative z-10 text-center">
                {/* Icon Circle */}
                <div className="relative inline-flex mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-violet-950 to-purple-950 border border-violet-600 flex items-center justify-center text-violet-400">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{step.number}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-300 mb-4 mx-auto">{step.description}</p>
                <span className="inline-block px-3 py-1 bg-violet-900 border border-violet-700 rounded-full text-sm text-violet-200">
                  {step.duration}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8">
          <a
            href="https://wa.me/5491130916574?text=Hola!%20Quiero%20saber%20más%20sobre%20cómo%20funciona%20MaatWork"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Comenzar ahora
          </a>
        </div>
      </div>
    </section>
  );
}
