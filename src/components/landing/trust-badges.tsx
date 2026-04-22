'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Shield, Zap, Headphones, Award, Lock, Clock, Users, ThumbsUp, CheckCircle2 } from 'lucide-react'
import { useScrollReveal, useStaggerReveal, useCounter, useReducedMotion } from '@/hooks/use-scroll-reveal'
import { cn } from '@/lib/utils'
import { LogoCarousel, placeholderLogos } from './logo-carousel'

// Badge data with enhanced color options
const badges = [
  {
    icon: Shield,
    label: 'Datos seguros',
    desc: 'Encriptación de grado bancario',
    gradient: 'from-emerald-500 to-teal-500',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    accentColor: '#10b981',
  },
  {
    icon: Zap,
    label: 'Activación rápida',
    desc: 'Tu app en 7-14 días',
    gradient: 'from-amber-500 to-orange-500',
    glowColor: 'rgba(245, 158, 11, 0.3)',
    accentColor: '#f59e0b',
  },
  {
    icon: Headphones,
    label: 'Soporte dedicado',
    desc: 'Te acompañamos siempre',
    gradient: 'from-violet-500 to-purple-500',
    glowColor: 'rgba(139, 92, 246, 0.3)',
    accentColor: '#8b5cf6',
  },
  {
    icon: Award,
    label: 'Garantía 30 días',
    desc: 'Si no funciona, te devolvemos',
    gradient: 'from-rose-500 to-pink-500',
    glowColor: 'rgba(244, 63, 94, 0.3)',
    accentColor: '#f43f5e',
  },
  {
    icon: Lock,
    label: 'SSL incluido',
    desc: 'Certificado de seguridad',
    gradient: 'from-blue-500 to-cyan-500',
    glowColor: 'rgba(59, 130, 246, 0.3)',
    accentColor: '#3b82f6',
  },
  {
    icon: Clock,
    label: '99.9% uptime',
    desc: 'Servidores confiables',
    gradient: 'from-indigo-500 to-violet-500',
    glowColor: 'rgba(99, 102, 241, 0.3)',
    accentColor: '#6366f1',
  },
  {
    icon: Users,
    label: '+500 usuarios',
    desc: 'Ya confían en nosotros',
    gradient: 'from-fuchsia-500 to-pink-500',
    glowColor: 'rgba(217, 70, 239, 0.3)',
    accentColor: '#d946ef',
  },
  {
    icon: ThumbsUp,
    label: '4.9/5 rating',
    desc: 'Calificación promedio',
    gradient: 'from-teal-500 to-emerald-500',
    glowColor: 'rgba(20, 184, 166, 0.3)',
    accentColor: '#14b8a6',
  },
]

// Trust stats with numeric values for counter animation
const stats = [
  { value: 500, suffix: '+', label: 'Apps entregadas' },
  { value: 98, suffix: '%', label: 'Clientes satisfechos' },
  { value: 14, suffix: '', label: 'Días máx. entrega' },
  { value: 24, suffix: '/7', label: 'Soporte' },
]

// Tilt effect hook for premium card interaction
function useTilt3D<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()
  const [transform, setTransform] = useState('')
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = (y - centerY) / 15
      const rotateY = (centerX - x) / 15

      setTransform(
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
      )
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      setTransform('perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)')
    }

    const handleMouseEnter = () => setIsHovering(true)

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)
    element.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
      element.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [prefersReducedMotion])

  return { ref, transform, isHovering }
}

// Animated stat counter component
function AnimatedStat({ value, suffix, label, delay, index }: {
  value: number
  suffix: string
  label: string
  delay: number
  index: number
}) {
  const { ref, formatted } = useCounter({
    end: value,
    duration: 2000,
    delay,
    suffix,
  })

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="text-center"
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
        {formatted}
      </div>
      <div className="text-sm text-white/40 mt-1">{label}</div>
    </div>
  )
}

// Premium badge card with tilt effect
function PremiumBadgeCard({
  badge,
  index,
  isVisible,
  reducedMotion
}: {
  badge: typeof badges[0]
  index: number
  isVisible: boolean
  reducedMotion: boolean
}) {
  const { ref, transform, isHovering } = useTilt3D<HTMLDivElement>()
  const Icon = badge.icon

  const entranceDelay = reducedMotion ? 0 : index * 80

  return (
    <div
      ref={ref}
      className="group relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${entranceDelay}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${entranceDelay}ms`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Outer glow ring - visible on hover */}
      <div
        className={cn(
          'absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none',
          isHovering && !reducedMotion ? 'opacity-100' : ''
        )}
        style={{
          background: `radial-gradient(circle at center, ${badge.glowColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />

      {/* Glassmorphism card */}
      <div
        className="relative h-full rounded-2xl overflow-hidden transition-all duration-500"
        style={{
          background: isHovering ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: `1px solid ${isHovering ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.06)'}`,
          boxShadow: isHovering
            ? `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px ${badge.glowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.08)`
            : '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
          transform,
        }}
      >
        {/* Inner top highlight */}
        <div
          className={cn(
            'absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-500',
            isHovering ? 'opacity-100' : 'opacity-0'
          )}
        />

        {/* Inner shadow for depth */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.2)',
          }}
        />

        {/* Gradient border reveal on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500',
            isHovering ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            padding: '1px',
            background: `linear-gradient(135deg, ${badge.accentColor}60 0%, transparent 30%, transparent 70%, ${badge.accentColor}40 100%)`,
            backgroundSize: '200% 200%',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-5 lg:p-6 flex items-start gap-4">
          {/* Icon container with glow */}
          <div className="relative flex-shrink-0">
            {/* Glow behind icon */}
            <div
              className={cn(
                'absolute inset-0 rounded-xl transition-opacity duration-300 -z-10',
                isHovering && !reducedMotion ? 'opacity-60' : 'opacity-0'
              )}
              style={{
                background: `radial-gradient(circle at center, ${badge.glowColor} 0%, transparent 70%)`,
                filter: 'blur(12px)',
                transform: 'scale(1.5)',
              }}
            />

            <div
              className={cn(
                'relative w-14 h-14 rounded-xl p-[1px] transition-all duration-300',
                isHovering && !reducedMotion ? 'scale-110 rotate-2' : 'scale-100 rotate-0'
              )}
              style={{
                background: `linear-gradient(135deg, ${badge.accentColor} 0%, ${badge.accentColor}80 100%)`,
                boxShadow: isHovering
                  ? `0 8px 24px ${badge.glowColor}, 0 0 0 1px ${badge.accentColor}30`
                  : `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 1px ${badge.accentColor}20`,
              }}
            >
              <div
                className="w-full h-full rounded-xl flex items-center justify-center bg-[#04040e]"
              >
                <Icon
                  className={cn(
                    'w-6 h-6 text-white transition-transform duration-300',
                    isHovering && !reducedMotion ? 'scale-110' : 'scale-100'
                  )}
                  style={{
                    filter: `drop-shadow(0 0 8px ${badge.accentColor}80)`,
                  }}
                />
              </div>
            </div>

            {/* Floating particle decoration */}
            {!reducedMotion && (
              <>
                <div
                  className={cn(
                    'absolute -top-1 -right-1 w-2 h-2 rounded-full transition-all duration-500',
                    isHovering ? 'opacity-100 scale-125' : 'opacity-0 scale-50'
                  )}
                  style={{
                    background: badge.accentColor,
                    boxShadow: `0 0 8px ${badge.accentColor}`,
                  }}
                />
                <div
                  className={cn(
                    'absolute -bottom-0.5 -left-2 w-1.5 h-1.5 rounded-full transition-all duration-500',
                    isHovering ? 'opacity-80 scale-100' : 'opacity-0 scale-0'
                  )}
                  style={{
                    background: badge.accentColor,
                    boxShadow: `0 0 6px ${badge.accentColor}`,
                  }}
                />
              </>
            )}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0 pt-1">
            <div
              className={cn(
                'font-semibold text-white text-sm lg:text-base transition-all duration-300',
                isHovering && !reducedMotion ? '-translate-y-0.5' : 'translate-y-0'
              )}
            >
              {badge.label}
            </div>
            <div
              className={cn(
                'text-xs lg:text-sm mt-0.5 transition-all duration-300',
                isHovering ? 'text-white/70' : 'text-white/50'
              )}
            >
              {badge.desc}
            </div>
          </div>

          {/* Check indicator - animated on hover */}
          <div
            className={cn(
              'absolute top-4 right-4 w-5 h-5 rounded-full items-center justify-center transition-all duration-300',
              isHovering && !reducedMotion ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            )}
            style={{
              background: `linear-gradient(135deg, ${badge.accentColor} 0%, ${badge.accentColor}80 100%)`,
              boxShadow: `0 0 12px ${badge.glowColor}`,
            }}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className={cn(
            'absolute bottom-0 left-4 right-4 h-px transition-all duration-500',
            isHovering && !reducedMotion ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            background: `linear-gradient(90deg, transparent, ${badge.accentColor}80, transparent)`,
          }}
        />

        {/* Corner brackets - visible on hover */}
        <div
          className={cn(
            'absolute top-2 right-2 w-8 h-8 transition-all duration-300',
            isHovering && !reducedMotion ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}
        >
          <div
            className={cn(
              'absolute top-0 right-0 h-2.5 w-px transition-all duration-300',
              isHovering && !reducedMotion ? 'animate-corner-tr' : ''
            )}
            style={{
              background: `linear-gradient(to bottom, ${badge.accentColor}80, transparent)`,
            }}
          />
          <div
            className={cn(
              'absolute top-0 right-0 w-2.5 h-px transition-all duration-300',
              isHovering && !reducedMotion ? 'animate-corner-br' : ''
            )}
            style={{
              background: `linear-gradient(to left, ${badge.accentColor}80, transparent)`,
            }}
          />
        </div>
        <div
          className={cn(
            'absolute bottom-2 left-2 w-8 h-8 transition-all duration-300',
            isHovering && !reducedMotion ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          )}
        >
          <div
            className={cn(
              'absolute bottom-0 left-0 h-2.5 w-px transition-all duration-300',
              isHovering && !reducedMotion ? 'animate-corner-bl' : ''
            )}
            style={{
              background: `linear-gradient(to top, ${badge.accentColor}80, transparent)`,
            }}
          />
          <div
            className={cn(
              'absolute bottom-0 left-0 w-2.5 h-px transition-all duration-300',
              isHovering && !reducedMotion ? 'animate-corner-tl' : ''
            )}
            style={{
              background: `linear-gradient(to right, ${badge.accentColor}80, transparent)`,
            }}
          />
        </div>
      </div>

      {/* Premium reflection */}
      <div
        className={cn(
          'absolute -bottom-6 left-4 right-4 h-12 rounded-full blur-xl transition-all duration-500',
          isHovering && !reducedMotion ? 'opacity-40 scale-105' : 'opacity-20 scale-100'
        )}
        style={{
          background: `linear-gradient(to bottom, ${badge.glowColor} 0%, transparent 100%)`,
        }}
      />
    </div>
  )
}

export function TrustBadges() {
  const { ref: containerRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })
  const { ref: badgesRef, visibleItems } = useStaggerReveal<HTMLDivElement>({
    threshold: 0.1,
    staggerDelay: 60,
    items: badges.length,
  })
  const prefersReducedMotion = useReducedMotion()

  // Background orb animation
  const orbAnimation = prefersReducedMotion ? 'none' : 'drift 20s ease-in-out infinite'

  return (
    <section className="py-24 px-6 lg:px-12 bg-[#04040e] border-y border-white/[0.06] relative overflow-hidden">
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/[0.02] to-transparent" />

      {/* Large decorative orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
          animation: orbAnimation,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
          animation: prefersReducedMotion ? 'none' : 'drift 25s ease-in-out infinite reverse',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1px) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1px) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      <div
        ref={containerRef}
        className={cn(
          'max-w-6xl mx-auto relative transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        {/* Stats bar with animated counters */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16 pb-10 border-b border-white/[0.06]">
          {stats.map((stat, i) => (
            <AnimatedStat
              key={i}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={prefersReducedMotion ? 0 : 200 + i * 150}
              index={i}
            />
          ))}
        </div>

        {/* Logo Carousel */}
        <div className="mb-16 -mx-6 lg:mx-0">
          <LogoCarousel
            logos={placeholderLogos}
            label="Trusted by industry leaders"
            duration={25}
            gap={32}
          />
        </div>

        {/* Premium badges grid with tilt effect */}
        <div
          ref={badgesRef as React.Ref<HTMLDivElement>}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6"
        >
          {badges.map((badge, i) => {
            const isRevealed = prefersReducedMotion || visibleItems.has(i)
            return (
              <PremiumBadgeCard
                key={i}
                badge={badge}
                index={i}
                isVisible={isRevealed}
                reducedMotion={prefersReducedMotion}
              />
            )
          })}
        </div>

        {/* Trust message */}
        <div className="text-center mt-12">
          <p className="text-white/30 text-sm">
            Mas de 500 negocios argentinos ya confían en Maatwork
          </p>
        </div>
      </div>

      <style>{`
        @keyframes drift {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.05);
          }
          50% {
            transform: translate(-10px, 10px) scale(0.95);
          }
          75% {
            transform: translate(-20px, -10px) scale(1.02);
          }
        }

        @keyframes corner-tr {
          0% { opacity: 0; transform: scaleX(0); }
          100% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes corner-br {
          0% { opacity: 0; transform: scaleY(0); }
          100% { opacity: 1; transform: scaleY(1); }
        }

        @keyframes corner-tl {
          0% { opacity: 0; transform: scaleX(0); }
          100% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes corner-bl {
          0% { opacity: 0; transform: scaleY(0); }
          100% { opacity: 1; transform: scaleY(1); }
        }

        .animate-corner-tr {
          animation: corner-tr 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-corner-br {
          animation: corner-br 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
        }

        .animate-corner-tl {
          animation: corner-tl 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-corner-bl {
          animation: corner-bl 0.3s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards;
        }
      `}</style>
    </section>
  )
}
