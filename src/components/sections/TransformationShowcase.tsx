'use client';

const BEFORE = [
  { icon: '📱', text: 'Manejar todo en WhatsApp y Excel' },
  { icon: '⏰', text: 'Perder horas en tareas manuales' },
  { icon: '😓', text: 'Olvidar turnos y perder clientes' },
  { icon: '💸', text: 'Cobrar tarde o no cobrar' },
  { icon: '📊', text: 'Desorganización total' },
  { icon: '😫', text: 'Estrés y jornadas de 12+ horas' },
];

const AFTER = [
  { icon: '📋', text: 'Todo centralizado en una app' },
  { icon: '⚡', text: 'Automatización de tareas repetitivas' },
  { icon: '✅', text: 'Agenda inteligente que nunca olvida' },
  { icon: '💳', text: 'Cobros puntuales y controlados' },
  { icon: '🎯', text: 'Organización total y escalable' },
  { icon: '😊', text: 'Tiempo libre para lo importante' },
];

const METRICS = [
  { value: '15+', unit: 'hrs', label: 'ahorradas por semana' },
  { value: '-80%', unit: '', label: 'tareas administrativas' },
  { value: '0', unit: '', label: 'turnos perdidos' },
];

export default function TransformationShowcase() {
  return (
    <section id="transformation" className="relative py-12 md:py-16 bg-[#0a0a1a]">
      <div className="container-custom px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            De <span className="text-red-400">esto...</span> a{' '}
            <span className="text-green-400">esto</span>
          </h2>
          <p className="text-slate-400 text-lg">
            La transformación que experimentan nuestros clientes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Before */}
          <div className="bg-gradient-to-br from-red-950/30 to-transparent border border-red-900/30 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">😔</span>
              <h3 className="text-2xl font-bold text-red-400">Sin MaatWork</h3>
            </div>
            <ul className="space-y-4">
              {BEFORE.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-400">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="bg-gradient-to-br from-green-950/30 to-transparent border border-green-900/30 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">😊</span>
              <h3 className="text-2xl font-bold text-green-400">Con MaatWork</h3>
            </div>
            <ul className="space-y-4">
              {AFTER.map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-300">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          {METRICS.map((metric, index) => (
            <div key={index} className="text-center p-4 bg-gradient-to-b from-violet-950/30 to-transparent rounded-2xl border border-violet-900/20">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                {metric.value}
                <span className="text-lg ml-1">{metric.unit}</span>
              </div>
              <p className="text-sm text-slate-400">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
