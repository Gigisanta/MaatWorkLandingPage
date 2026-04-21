'use client'

import { Clock, UserX, Receipt, MessageSquareX, CalendarCheck, BellRing, CreditCard, Bot, type LucideIcon } from 'lucide-react'
import { useScrollReveal } from '@/hooks/use-scroll-reveal'

interface ProblemItem {
  icon: LucideIcon
  text: string
}

interface SolutionItem {
  icon: LucideIcon
  text: string
  highlight?: string
}

const problems: ProblemItem[] = [
  { icon: Clock, text: 'Gestion manual de turnos que consume horas' },
  { icon: UserX, text: '30% de clientes olvidan sus turnos' },
  { icon: Receipt, text: 'Cobros que se vencen y nunca llegan' },
  { icon: MessageSquareX, text: 'WhatsApp saturado de mensajes repetitivos' },
]

const solutions: SolutionItem[] = [
  { icon: CalendarCheck, text: 'Agenda automatica que se llena sola', highlight: '+40%' },
  { icon: BellRing, text: 'Recordatorios por WhatsApp personalizados', highlight: '0 cancelaciones' },
  { icon: CreditCard, text: 'Cobros con un clic y seguimiento automatico', highlight: '+25%' },
  { icon: Bot, text: 'Respuestas automaticas 24/7', highlight: 'Ahorra 2hrs/dia' },
]

export function ProblemSolutionSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: gridRef, isVisible: gridVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 })

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden">
      {/* Background grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,113,78,0.08),transparent)]" />

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-terracota/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-terracota/80 mb-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-terracota/50" />
            El problema
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-terracota/50" />
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4 mb-4">
            ¿Seguir así hasta fin de año?
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
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
          <div className="relative group">
            {/* Coral accent glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-terracota/10 via-transparent to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 lg:p-10 group-hover:border-terracota/20 transition-all duration-300">
              {/* Column header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-terracota/20 to-orange-500/10 border border-terracota/30 flex items-center justify-center">
                    <UserX className="w-6 h-6 text-terracota" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-terracota/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Sin MaatWork
                  </h3>
                  <p className="text-sm text-white/40">Situacion actual</p>
                </div>
              </div>

              {/* Problem items */}
              <ul className="space-y-4">
                {problems.map((problem, i) => {
                  const Icon = problem.icon
                  return (
                    <li
                      key={i}
                      className="group/item flex items-start gap-4 p-5 rounded-xl bg-terracota/5 border border-terracota/10 hover:bg-terracota/10 hover:border-terracota/30 transition-all duration-300"
                      style={{
                        transitionDelay: `${i * 75}ms`,
                      }}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-terracota/20 to-orange-500/10 border border-terracota/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-terracota" strokeWidth={1.5} />
                        </div>
                        {/* Glow on hover */}
                        <div className="absolute inset-0 bg-terracota/20 rounded-lg blur-md opacity-0 group-hover/item:opacity-50 transition-opacity duration-300" />
                      </div>
                      <span className="text-white/80 font-medium leading-relaxed pt-1.5">
                        {problem.text}
                      </span>
                    </li>
                  )
                })}
              </ul>

              {/* X mark decoration */}
              <div className="absolute -top-4 -right-4 w-16 h-16 opacity-10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-terracota">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          {/* SOLUTIONS - Right column */}
          <div className="relative group">
            {/* Green accent glow */}
            <div className="absolute -inset-4 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 lg:p-10 group-hover:border-emerald-500/20 transition-all duration-300">
              {/* Column header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center">
                    <CalendarCheck className="w-6 h-6 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-white">
                    Con MaatWork
                  </h3>
                  <p className="text-sm text-white/40">Tu nueva realidad</p>
                </div>
              </div>

              {/* Solution items */}
              <ul className="space-y-4">
                {solutions.map((solution, i) => {
                  const Icon = solution.icon
                  return (
                    <li
                      key={i}
                      className="group/item flex items-start gap-4 p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300"
                      style={{
                        transitionDelay: `${i * 75}ms`,
                      }}
                    >
                      <div className="relative flex-shrink-0">
                        <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
                        </div>
                        {/* Glow on hover */}
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-lg blur-md opacity-0 group-hover/item:opacity-50 transition-opacity duration-300" />
                      </div>
                      <div className="flex-1 pt-1.5">
                        <span className="text-white/90 font-medium leading-relaxed block">
                          {solution.text}
                        </span>
                        {solution.highlight && (
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                            {solution.highlight}
                          </span>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Check mark decoration */}
              <div className="absolute -top-4 -right-4 w-16 h-16 opacity-10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-full h-full text-emerald-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stat */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full bg-white/[0.02] border border-white/[0.06]">
            <span className="text-3xl font-black gradient-brand-text">78%</span>
            <span className="text-white/60">de negocios en Argentina operan igual que hace 10 años</span>
          </div>
        </div>
      </div>
    </section>
  )
}
