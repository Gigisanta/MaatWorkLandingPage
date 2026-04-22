'use client'

import { useEffect, useState } from 'react'
import { useScrollReveal, useReducedMotion } from '@/hooks'

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

// Animated Step Card Component
function StepCard({ step, index, isVisible, reducedMotion }: { step: Step; index: number; isVisible: boolean; reducedMotion: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const [glowPhase, setGlowPhase] = useState(0)

  useEffect(() => {
    if (!isVisible || reducedMotion) return
    const interval = setInterval(() => {
      setGlowPhase(p => (p + 1) % 360)
    }, 3000)
    return () => clearInterval(interval)
  }, [isVisible, reducedMotion])

  const glowIntensity = Math.sin((glowPhase * Math.PI) / 180)
  const baseTransition = reducedMotion ? 'none' : 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)'
  const staggerDelay = reducedMotion ? '0ms' : `${index * 150}ms`

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : reducedMotion ? 'translateY(0)' : 'translateY(40px) scale(0.95)',
        transition: `${baseTransition} ${staggerDelay}`,
      }}
    >
      {/* Connector line to next step */}
      {index < steps.length - 1 && (
        <div className="hidden md:block absolute top-20 left-[calc(50%+3rem)] right-[calc(-50%+3rem)] z-10">
          {/* Animated gradient line */}
          <div className="h-px relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400"
              style={{
                backgroundSize: '200% 100%',
                animation: reducedMotion ? 'none' : 'gradient-flow 3s ease infinite',
              }}
            />
          </div>
          {/* Glowing dot at end */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <div
              className="relative"
              style={{
                transform: reducedMotion ? 'scale(1)' : `scale(${1 + glowIntensity * 0.2})`,
                transition: 'transform 0.3s ease',
              }}
            >
              <div className="absolute inset-0 w-3 h-3 bg-indigo-400 rounded-full blur-md" />
              <div className="relative w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {/* Card with glass effect */}
      <div
        className="relative p-8 lg:p-10 h-full flex flex-col backdrop-blur-md bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-indigo-500/40 rounded-3xl overflow-hidden"
        style={{
          boxShadow: isHovered && !reducedMotion
            ? `0 0 60px rgba(99, 102, 241, ${0.15 + glowIntensity * 0.1}), 0 20px 40px rgba(0,0,0,0.3)`
            : '0 4px 24px rgba(0,0,0,0.2)',
          transform: isHovered && !reducedMotion ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
          transition: `${baseTransition} ${staggerDelay}, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {/* Ambient glow on hover */}
        <div
          className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(99, 102, 241, 0.25) 0%, transparent 60%)',
            filter: 'blur(30px)',
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), transparent)',
            opacity: isVisible ? (isHovered ? 1 : 0.6) : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Floating particles on hover */}
        {!reducedMotion && isHovered && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-indigo-400/60"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${30 + i * 15}%`,
                  animation: `float-up ${2 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Icon container with layered effects */}
        <div className="relative w-16 h-16 mb-6">
          {/* Outer glow layers */}
          <div
            className="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Gradient ring that rotates on hover */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600"
            style={{
              transform: reducedMotion ? 'rotate(0deg)' : (isHovered ? 'rotate(12deg) scale(1.05)' : 'rotate(0deg) scale(1)'),
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Inner dark layer */}
          <div className="absolute inset-0.5 rounded-xl bg-[#04040e]/90 backdrop-blur-sm" />

          {/* Icon */}
          <div
            className="absolute inset-0 flex items-center justify-center text-white"
            style={{
              transform: reducedMotion ? 'scale(1)' : (isHovered ? 'scale(1.1)' : 'scale(1)'),
              transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {step.icon}
          </div>

          {/* Inner border glow on hover */}
          <div
            className="absolute inset-[3px] rounded-xl border border-white/10 group-hover:border-indigo-400/40 transition-colors duration-500"
            style={{
              boxShadow: isHovered && !reducedMotion ? 'inset 0 0 25px rgba(99, 102, 241, 0.2)' : 'none',
            }}
          />
        </div>

        {/* Step number with glow effect */}
        <div className="relative mb-4 -mt-2">
          <span
            className="block text-7xl lg:text-8xl font-black leading-none tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c4b5fd 70%, #818cf8 100%)',
              filter: isHovered && !reducedMotion ? 'drop-shadow(0 0 40px rgba(99, 102, 241, 0.6))' : 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.3))',
              transition: 'filter 0.5s ease',
            }}
          >
            {step.num}
          </span>
          {/* Glow behind number */}
          <div
            className="absolute inset-0 blur-2xl opacity-50"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              transform: reducedMotion ? 'scale(1)' : `scale(${1 + glowIntensity * 0.15})`,
              transition: 'transform 0.3s ease',
            }}
          />
        </div>

        {/* Title */}
        <h3
          className="font-display text-2xl lg:text-3xl font-bold text-white mb-4"
          style={{
            color: isHovered ? 'rgb(165, 180, 252)' : 'rgb(255, 255, 255)',
            transition: 'color 0.4s ease',
          }}
        >
          {step.title}
        </h3>

        {/* Description */}
        <p className="text-base text-white/60 leading-relaxed flex-grow">
          {step.desc}
        </p>

        {/* Bottom accent */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Corner accents */}
        <div
          className="absolute top-4 right-4 w-6 h-6 border-t border-r border-indigo-500/0 group-hover:border-indigo-500/50 rounded-tr-lg transition-all duration-500"
          style={{ transform: isHovered && !reducedMotion ? 'translate(2px, -2px)' : 'translate(0, 0)' }}
        />
        <div
          className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-indigo-500/0 group-hover:border-indigo-500/50 rounded-bl-lg transition-all duration-500"
          style={{ transform: isHovered && !reducedMotion ? 'translate(-2px, 2px)' : 'translate(0, 0)' }}
        />
      </div>
    </div>
  )
}

export function HowItWorks() {
  const { ref: headerRef, isVisible: headerVisible, style: headerStyle } = useScrollReveal<HTMLDivElement>({
    threshold: 0.3,
    delay: 0,
    duration: 800,
  })
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollReveal<HTMLDivElement>({
    threshold: 0.1,
    delay: 200,
    duration: 600,
  })
  const { ref: footerRef, isVisible: footerVisible, style: footerStyle } = useScrollReveal<HTMLDivElement>({
    threshold: 0.3,
    delay: 400,
    duration: 700,
  })
  const reducedMotion = useReducedMotion()

  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden bg-[#04040e]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient gradient blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
            filter: 'blur(80px)',
            transform: reducedMotion ? 'translate(0, 0)' : 'translate(-20%, 10%)',
            transition: 'transform 1s ease-out',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
            filter: 'blur(80px)',
            transform: reducedMotion ? 'translate(0, 0)' : 'translate(15%, -10%)',
            transition: 'transform 1.2s ease-out',
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-20" style={headerStyle}>
          <span
            className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] mb-6 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400" style={{
              animation: reducedMotion ? 'none' : 'pulse-dot 2s ease-in-out infinite',
              boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
            }} />
            El proceso
          </span>

          <h2
            className="font-display text-4xl lg:text-5xl font-black text-white mt-4 mb-4"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
            }}
          >
            Tu app lista en dias, no en meses
          </h2>

          <p
            className="text-white/50 mt-4 max-w-xl mx-auto text-lg"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            Solo 3 pasos para tener tu propia app funcionando
          </p>
        </div>

        {/* Steps grid */}
        <div ref={stepsRef} className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <StepCard
              key={i}
              step={step}
              index={i}
              isVisible={stepsVisible}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Footer badge */}
        <div ref={footerRef} className="text-center mt-16" style={footerStyle}>
          <div
            className="inline-flex items-center gap-4 px-8 py-5 rounded-2xl backdrop-blur-md bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300 group"
            style={{
              boxShadow: '0 4px 30px rgba(99, 102, 241, 0.1)',
            }}
          >
            <div className="relative">
              <svg
                className="w-7 h-7 text-indigo-400"
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
              <div
                className="absolute inset-0 bg-indigo-400/30 rounded-full"
                style={{
                  animation: reducedMotion ? 'none' : 'ping-pulse 2s ease-in-out infinite',
                }}
              />
            </div>
            <span className="text-white/70 font-medium">
              Tiempo promedio de entrega:{' '}
              <span className="text-white font-bold">7 a 14 dias habiles</span>
            </span>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-dot {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 4px rgba(99, 102, 241, 0.5);
          }
          50% {
            transform: scale(1.2);
            box-shadow: 0 0 12px rgba(99, 102, 241, 0.8);
          }
        }

        @keyframes ping-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @keyframes float-up {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          10% { opacity: 0.6; }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0.8;
          }
          90% { opacity: 0.6; }
          100% {
            transform: translateY(-60px) scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
