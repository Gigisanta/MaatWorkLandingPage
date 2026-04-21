'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal'

interface Step {
  num: string
  title: string
  desc: string
  icon: React.ReactNode
}

const steps: Step[] = [
  {
    num: "01",
    title: "Diagnostico",
    desc: "Contanos tu situacion y besoins. Analizamos tus procesos y disenamos la solucion perfecta.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Prototipo",
    desc: "Te mostarmos una idea clara en 48hs. Ves exactamente como va a funcionar tu app.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Launch",
    desc: "Tu app lista en 7-14 dias. Deployment automatico y soporte incluido.",
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
]

export function HowItWorks() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden bg-[#04040e]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glow-blob glow-blob-primary opacity-20" />
        <div className="glow-blob glow-blob-purple opacity-15" />
        {/* Animated grid lines */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-700 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="badge badge-primary mb-6">El proceso</span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
            Tu app lista en dias, no en meses
          </h2>
          <p className="text-white/60 mt-4 max-w-xl mx-auto">
            Solo 3 pasos para tener tu propia app funcionando
          </p>
        </div>

        {/* Steps grid */}
        <div
          ref={stepsRef}
          className={`grid md:grid-cols-3 gap-6 lg:gap-8 transition-all duration-700 delay-200 ${
            stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {steps.map((step, i) => (
            <div key={i} className="relative group">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-[calc(50%+4rem)] right-[calc(-50%+4rem)] z-10">
                  <div className="h-px bg-gradient-to-r from-indigo-500/60 via-purple-500/30 to-transparent relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
                  </div>
                </div>
              )}

              {/* Card */}
              <div className="card-glass p-8 lg:p-10 h-full flex flex-col relative group hover:border-indigo-500/40 transition-all duration-500 hover:-translate-y-2">
                {/* Glowing top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-indigo-500/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon with animated gradient background */}
                <div className="relative w-16 h-16 mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl rotate-0 group-hover:rotate-6 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white">
                    {step.icon}
                  </div>
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-500" />
                </div>

                {/* Step number with gradient */}
                <div className="text-7xl lg:text-8xl font-black leading-none mb-4 select-none -mt-2">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-base text-white/70 leading-relaxed flex-grow">
                  {step.desc}
                </p>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Corner accents */}
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-indigo-500/0 group-hover:border-indigo-500/40 rounded-tr-xl transition-all duration-500" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-indigo-500/0 group-hover:border-indigo-500/40 rounded-bl-xl transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer badge with animation */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 glass px-8 py-4 rounded-full hover:bg-white/[0.06] transition-all duration-300 group">
            <div className="relative">
              <svg
                className="w-6 h-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="absolute inset-0 bg-indigo-400/20 rounded-full animate-ping" />
            </div>
            <span className="text-white/80 font-medium">
              Tiempo promedio de entrega:{' '}
              <span className="text-white font-bold">7 a 14 dias habiles</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
