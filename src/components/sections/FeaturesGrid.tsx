'use client';

const FEATURES = [
  {
    id: 'gestion-clientes',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Gestión de clientes">
        <title>Gestión de Clientes</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Gestión de Clientes',
    description: 'Registro completo con historial. Toda la información de tus clientes en un solo lugar, siempre accesible.',
  },
  {
    id: 'cobros-cuotas',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Cobros y cuotas">
        <title>Cobros y Cuotas</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    title: 'Cobros y Cuotas',
    description: 'Control total de pagos y deudas. Nunca más pierdas un cobro por olvido.',
  },
  {
    id: 'turnos-clases',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Turnos y clases">
        <title>Turnos y Clases</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Turnos y Clases',
    description: 'Agenda automática que se maneja sola. Confirmaciones y recordatorios por WhatsApp.',
  },
  {
    id: 'whatsapp-auto',
    icon: (
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-label="WhatsApp automático">
        <title>WhatsApp Automático</title>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    title: 'WhatsApp Automático',
    description: 'Respuestas y recordatorios automatizados. Responder en segundos, no en horas.',
  },
  {
    id: 'panel-dueno',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Panel del dueño">
        <title>Panel para el Dueño</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Panel para el Dueño',
    description: 'Dashboard ejecutivo con métricas clave. Decisiones basadas en datos reales.',
  },
  {
    id: 'hecha-medida',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Personalización">
        <title>Hecha a Medida</title>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Hecha a Medida',
    description: 'Se adapta a tu industria, no al revés. Plantillas específicas por tipo de negocio.',
  },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="relative py-12 md:py-16 bg-[#030014]">
      <div className="container-custom px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Todo lo que necesitas en <span className="gradient-text">un solo lugar</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Automatiza cada aspecto de tu negocio y recupera horas para lo que realmente importa.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="reveal group relative p-5 bg-gradient-to-br from-violet-950 to-purple-950 border border-violet-800/80 rounded-2xl hover:border-violet-500 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(124,58,237,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-br from-violet-600/30 to-purple-600/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-600/80 to-purple-600/80 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-110 group-hover:from-violet-500/90 group-hover:to-purple-500/90 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-violet-200 transition-colors">{feature.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
