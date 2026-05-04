'use client';

const FEATURES_INCLUDED = [
  'Gestión de Clientes completa',
  'Control de Cobros y Cuotas',
  'Agenda de Turnos y Clases',
  'WhatsApp Automático',
  'Panel para el Dueño (Dashboard)',
  'Personalización por Industria',
  'Soporte por WhatsApp incluido',
  'Capacitación inicial',
  'Datos 100% tuyos (exportación)',
  'Escalabilidad sin límites',
  'Actualizaciones incluidas',
  'Backup automático',
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-12 md:py-16 bg-[#030014]">
      <div className="container-custom px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Simple y <span className="gradient-text">transparente</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Un solo plan con todo incluido. Sin costos ocultos, sin sorpresas.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-purple-600/20 rounded-3xl blur-xl" />

            <div className="relative group bg-gradient-to-br from-violet-950 to-purple-950 border border-violet-600/60 rounded-3xl p-6 md:p-8 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] transition-all duration-300">
              {/* Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full text-sm font-semibold text-white shadow-lg">
                  Precio especial beta
                </span>
              </div>

              {/* Plan name */}
              <div className="text-center mt-4 mb-8">
                <h3 className="text-xl font-semibold text-slate-300 mb-2">App MaatWork</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-5xl md:text-6xl font-bold text-white">$59</span>
                  <span className="text-xl text-slate-400">USD/mes</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-10">
                {FEATURES_INCLUDED.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="text-center">
                <a
                  href="https://wa.me/5491130916574?text=Hola!%20Quiero%20empezar%20con%20MaatWork%20-%20Plan%20de%20%2459%20USD/mes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-green w-full text-center text-lg py-4 block mb-4 active:scale-95 transition-transform"
                >
                  Comenzar ahora
                </a>
                <p className="text-sm text-slate-400">
                  Sin tarjeta de crédito • Configuración en 24hs
                </p>
              </div>

              {/* ROI note */}
              <div className="mt-8 pt-8 border-t border-violet-800/30 text-center">
                <p className="text-sm text-slate-400 mb-2">
                  <span className="text-green-400 font-semibold">ROI rápido:</span> Recuperás la inversión en minutos de tiempo ahorrado
                </p>
                <p className="text-xs text-slate-400">
                  15+ horas/semana × $2,000/hora = $144,000/mes ahorrados
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-950/80 border border-green-800/60 rounded-full">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-green-300 font-medium">Garantía de satisfacción: 30 días para evaluar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
