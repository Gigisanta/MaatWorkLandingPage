'use client'

import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface Step {
  num: string;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: "01",
    title: "Diagnostico",
    desc: "Contanos tu situacion y besoins",
  },
  {
    num: "02",
    title: "Prototipo",
    desc: "Te mostarmos una idea clara en 48hs",
  },
  {
    num: "03",
    title: "Launch",
    desc: "Tu app lista en 7-14 dias",
  },
];

export function HowItWorks() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden bg-[#04040e]">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="glow-blob glow-blob-primary opacity-20" />
        <div className="glow-blob glow-blob-purple opacity-15" />
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
        </div>

        {/* Steps grid */}
        <div
          ref={stepsRef}
          className={`grid md:grid-cols-3 gap-6 lg:gap-8 transition-all duration-700 delay-200 ${
            stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line (hidden on mobile, shown between cards on desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+3rem)] right-[calc(-50%+3rem)] h-px bg-gradient-to-r from-indigo-500/50 via-purple-500/30 to-transparent z-10" />
              )}

              {/* Card */}
              <div className="card-glass p-8 lg:p-10 h-full flex flex-col relative group hover:border-indigo-500/30 transition-all duration-500">
                {/* Glowing top accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Step number */}
                <div className="text-8xl lg:text-9xl font-black leading-none mb-6 select-none">
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
                    }}
                  >
                    {step.num}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-4">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-white/80 leading-relaxed">
                  {step.desc}
                </p>

                {/* Bottom glow on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Footer badge */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full">
            <svg
              className="w-5 h-5 text-indigo-400"
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
            <span className="text-white/80 font-medium">
              Tiempo promedio de entrega:{" "}
              <span className="text-white font-bold">7 a 14 dias habiles</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
