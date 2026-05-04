'use client';

const PROBLEMS = [
  { icon: '📅', text: 'Un día mi agenda se mezcló con la de mi cliente' },
  { icon: '💰', text: 'Tuve que cobrarle a un cliente que se mudó' },
  { icon: '📈', text: 'Mi local creció y no di abasto' },
  { icon: '⏰', text: 'Perdí un cliente porque no le respondí a tiempo' },
  { icon: '📊', text: 'El caos de manejar todo en hojas de cálculo' },
  { icon: '🔄', text: 'Cada vez que cambio una herramienta, pierdo todo el historial' },
];

const SOLUTIONS = [
  { icon: '✅', text: 'Agenda automática que nunca se mezcla' },
  { icon: '💳', text: 'Cobros digitalizados, deudas controladas' },
  { icon: '🚀', text: 'Escalabilidad real sin límites' },
  { icon: '⚡', text: 'Respuesta instantánea por WhatsApp' },
  { icon: '📋', text: 'Organización total en un solo lugar' },
  { icon: '🔐', text: 'Datos 100% tuyos, siempre' },
];

export default function ProblemSolution() {
  return (
    <section id="problem-solution" className="relative py-12 md:py-16 bg-[#030014]">
      <div className="container-custom px-4">
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* Problem Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/60 to-transparent rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-red-950/90 to-red-950/50 border border-red-900/80 rounded-3xl p-6 md:p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">😰</span>
                <h2 className="text-2xl md:text-3xl font-bold text-red-400">¿Te suena familiar?</h2>
              </div>
              <ul className="space-y-5">
                {PROBLEMS.map((problem, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="text-xl mt-0.5">{problem.icon}</span>
                    <span className="text-slate-300 leading-relaxed">{problem.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Solution Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 to-transparent rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <div className="relative bg-gradient-to-br from-green-950/90 to-green-950/50 border border-green-900/80 rounded-3xl p-6 md:p-8 h-full">
              <div className="flex items-center gap-3 mb-8">
                <span className="text-3xl">🚀</span>
                <h2 className="text-2xl md:text-3xl font-bold text-green-400">Así funciona MaatWork</h2>
              </div>
              <ul className="space-y-5">
                {SOLUTIONS.map((solution, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="text-xl mt-0.5">{solution.icon}</span>
                    <span className="text-slate-300 leading-relaxed">{solution.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex justify-center mt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full blur-lg opacity-50" />
            <div className="relative w-16 h-16 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
