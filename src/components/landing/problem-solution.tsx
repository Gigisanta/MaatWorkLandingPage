'use client'

import { Clock, UserX, Receipt, MessageSquareX, CalendarCheck, BellRing, CreditCard, Bot, type LucideIcon } from 'lucide-react';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface ProblemItem {
  icon: LucideIcon;
  text: string;
}

interface SolutionItem {
  icon: LucideIcon;
  text: string;
}

const problems: ProblemItem[] = [
  { icon: Clock, text: 'Gestion manual de turnos' },
  { icon: UserX, text: 'Clientes que olvidan turnos' },
  { icon: Receipt, text: 'Cobros que nunca llegan' },
  { icon: MessageSquareX, text: 'WhatsApp saturado' },
];

const solutions: SolutionItem[] = [
  { icon: CalendarCheck, text: 'Agenda automatica' },
  { icon: BellRing, text: 'Recordatorios por WhatsApp' },
  { icon: CreditCard, text: 'Cobros con un clic' },
  { icon: Bot, text: 'Respuestas automaticas' },
];

export function ProblemSolutionSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05, triggerOnce: false });

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,113,78,0.08),transparent)]" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-terracota/80 mb-4">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-terracota/50" />
            El problema
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-terracota/50" />
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4 mb-4">
            ¿Seguir así hasta fin de año?
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            El 78% de los dueños de locales en Argentina siguen administrando con papel,
            WhatsApp y Excel. Perdiendo clientes, dinero y tiempo.
          </p>
        </div>

        {/* Two column layout */}
        <div
          ref={gridRef}
          className={`grid md:grid-cols-2 gap-8 lg:gap-12 transition-all duration-700 delay-200 ${
            gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >

          {/* PROBLEMS - Left column */}
          <div className="relative">
            {/* Coral accent glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-terracota/5 via-transparent to-transparent rounded-3xl blur-xl" />

            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 lg:p-10">
              {/* Column header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-terracota/10 border border-terracota/20 flex items-center justify-center">
                  <UserX className="w-5 h-5 text-terracota" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Sin MaatWork
                </h3>
              </div>

              {/* Problem items */}
              <ul className="space-y-5">
                {problems.map((problem, i) => {
                  const Icon = problem.icon;
                  return (
                    <li
                      key={i}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-terracota/5 border border-terracota/10 hover:bg-terracota/10 hover:border-terracota/20 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-terracota/20 to-terracota/5 border border-terracota/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-terracota" strokeWidth={1.5} />
                      </div>
                      <span className="text-white/80 font-medium leading-relaxed pt-1">
                        {problem.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* SOLUTIONS - Right column */}
          <div className="relative">
            {/* Green accent glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-bosque/10 via-transparent to-transparent rounded-3xl blur-xl" />

            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 lg:p-10">
              {/* Column header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-bosque/10 border border-bosque/20 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5 text-bosque" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Con MaatWork
                </h3>
              </div>

              {/* Solution items */}
              <ul className="space-y-5">
                {solutions.map((solution, i) => {
                  const Icon = solution.icon;
                  return (
                    <li
                      key={i}
                      className="group flex items-start gap-4 p-4 rounded-xl bg-bosque/5 border border-bosque/10 hover:bg-bosque/10 hover:border-bosque/20 transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-bosque/20 to-bosque/5 border border-bosque/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-bosque" strokeWidth={1.5} />
                      </div>
                      <span className="text-white font-medium leading-relaxed pt-1">
                        {solution.text}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
