'use client'

import {
  Clock,
  UserX,
  Receipt,
  MessageSquareX,
  CalendarCheck,
  BellRing,
  CreditCard,
  Bot,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from 'lucide-react'
import { useScrollReveal, useReducedMotion } from '@/hooks'
import { useState, useEffect, useRef } from 'react'

interface ProblemItem {
  icon: LucideIcon
  text: string
  cost?: string
  sadIcon: LucideIcon
}

interface SolutionItem {
  icon: LucideIcon
  text: string
  highlight?: string
  benefit?: string
  happyIcon: LucideIcon
}

const problems: ProblemItem[] = [
  { icon: Clock, sadIcon: Clock, text: 'Gestion manual de turnos que consume horas', cost: '-2hrs/dia' },
  { icon: UserX, sadIcon: UserX, text: '30% de clientes olvidan sus turnos', cost: '-$50K/mes' },
  { icon: Receipt, sadIcon: Receipt, text: 'Cobros que se vencen y nunca llegan', cost: '-15% ingresos' },
  { icon: MessageSquareX, sadIcon: MessageSquareX, text: 'WhatsApp saturado de mensajes repetitivos', cost: '-3hrs/dia' },
]

const solutions: SolutionItem[] = [
  { icon: CalendarCheck, happyIcon: CalendarCheck, text: 'Agenda automatica que se llena sola', highlight: '+40%', benefit: 'mas clientes' },
  { icon: BellRing, happyIcon: BellRing, text: 'Recordatorios por WhatsApp personalizados', highlight: '0', benefit: 'cancelaciones' },
  { icon: CreditCard, happyIcon: CreditCard, text: 'Cobros con un clic y seguimiento automatico', highlight: '+25%', benefit: 'cobro efectivo' },
  { icon: Bot, happyIcon: Bot, text: 'Respuestas automaticas 24/7', highlight: '+2hrs', benefit: 'libres diario' },
]

// Problem Card - dramatic red theme with strong visual impact
function ProblemCard({ item, index, isVisible, reducedMotion }: { item: ProblemItem; index: number; isVisible: boolean; reducedMotion: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const Icon = item.icon

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsExpanded(true), reducedMotion ? 0 : index * 120)
      return () => clearTimeout(timer)
    }
  }, [isVisible, index, reducedMotion])

  const baseTransition = reducedMotion ? 'none' : 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
  const staggerDelay = reducedMotion ? '0ms' : `${index * 80}ms`

  return (
    <li
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'translateY(0)' : reducedMotion ? 'translateY(0)' : 'translateY(30px)',
        transition: `${baseTransition} ${staggerDelay}`,
      }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.2) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      <div
        className="relative p-5 rounded-xl border border-red-950/60 bg-gradient-to-br from-red-950/40 to-red-950/10 hover:border-red-800/50 transition-all duration-400"
        style={{
          boxShadow: isHovered && !reducedMotion ? '0 0 30px rgba(220, 38, 38, 0.15)' : 'none',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon with dramatic glow */}
          <div className="relative flex-shrink-0">
            <div
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/30 to-orange-500/10 border border-red-500/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                transform: isHovered && !reducedMotion ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon className="w-5 h-5 text-red-400" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-white/90 font-medium block leading-relaxed">
              {item.text}
            </span>
            {item.cost && (
              <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {item.cost}
              </span>
            )}
          </div>

          <XCircle className="w-5 h-5 text-red-500/40 group-hover:text-red-500/70 transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </li>
  )
}

// Solution Card - emerald theme with positive relief
function SolutionCard({ item, index, isVisible, reducedMotion }: { item: SolutionItem; index: number; isVisible: boolean; reducedMotion: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const Icon = item.icon

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsExpanded(true), reducedMotion ? 0 : index * 120 + 150)
      return () => clearTimeout(timer)
    }
  }, [isVisible, index, reducedMotion])

  const baseTransition = reducedMotion ? 'none' : 'all 500ms cubic-bezier(0.16, 1, 0.3, 1)'
  const staggerDelay = reducedMotion ? '0ms' : `${index * 80 + 150}ms`

  return (
    <li
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isExpanded ? 1 : 0,
        transform: isExpanded ? 'translateY(0)' : reducedMotion ? 'translateY(0)' : 'translateY(30px)',
        transition: `${baseTransition} ${staggerDelay}`,
      }}
    >
      {/* Glow backdrop */}
      <div
        className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.15) 0%, transparent 70%)',
          filter: 'blur(16px)',
        }}
      />

      <div
        className="relative p-5 rounded-xl border border-emerald-950/60 bg-gradient-to-br from-emerald-950/30 to-emerald-950/5 hover:border-emerald-800/50 transition-all duration-400"
        style={{
          boxShadow: isHovered && !reducedMotion ? '0 0 30px rgba(34, 197, 94, 0.12)' : 'none',
        }}
      >
        <div className="flex items-start gap-4">
          {/* Icon with relief glow */}
          <div className="relative flex-shrink-0">
            <div
              className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/25 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              style={{
                transform: isHovered && !reducedMotion ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <Icon className="w-5 h-5 text-emerald-400" strokeWidth={1.5} />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <span className="text-white/90 font-medium block leading-relaxed">
              {item.text}
            </span>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {item.highlight && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/25 text-emerald-400 text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {item.highlight}
                </span>
              )}
              {item.benefit && (
                <span className="text-white/50 text-xs">
                  {item.benefit}
                </span>
              )}
            </div>
          </div>

          <CheckCircle2 className="w-5 h-5 text-emerald-500/40 group-hover:text-emerald-500/70 transition-colors flex-shrink-0 mt-1" />
        </div>
      </div>
    </li>
  )
}

// Before/After Comparison Slider
function ComparisonSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
  }

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) handleMove(e.clientX)
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) handleMove(e.touches[0].clientX)
  }

  return (
    <div
      ref={sectionRef}
      className="mt-16 relative"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
      }}
    >
      <div className="text-center mb-6">
        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50">
          <span className="w-8 h-px bg-gradient-to-r from-transparent to-white/30" />
          Comparacion visual
          <span className="w-8 h-px bg-gradient-to-l from-transparent to-white/30" />
        </span>
      </div>

      <div
        ref={containerRef}
        className="relative h-64 rounded-3xl overflow-hidden cursor-ew-resize select-none"
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchStart={handleMouseDown}
        onTouchEnd={handleMouseUp}
      >
        {/* Problem side (before) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-[#0a0a14] to-[#0a0a14]"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
            <span className="text-red-400 font-bold text-lg mb-2">SIN MaatWork</span>
            <span className="text-white/60 text-sm text-center max-w-[200px]">
              Administracion manual, perdidas, caos
            </span>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-1 rounded-full bg-red-500/30 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-red-400/60 text-xs mt-1 block">85% ineficiente</span>
            </div>
          </div>
          {/* Warm atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse at center, rgba(220,50,50,0.2) 0%, transparent 60%)]" />
        </div>

        {/* Solution side (after) */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-[#0a0a14] to-[#0a0a14]"
          style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <span className="text-emerald-400 font-bold text-lg mb-2">CON MaatWork</span>
            <span className="text-white/60 text-sm text-center max-w-[200px]">
              Automatizacion inteligente, crecimiento
            </span>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-1 rounded-full bg-emerald-500/30 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: '95%' }} />
              </div>
              <span className="text-emerald-400/60 text-xs mt-1 block">95% eficiente</span>
            </div>
          </div>
          {/* Cool atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse at center, rgba(34,197,94,0.2) 0%, transparent 60%)]" />
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/80 cursor-ew-resize z-10"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
            style={{
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <div className="flex items-center gap-0.5">
              <ArrowRight className="w-3 h-3 text-red-400 rotate-180" />
              <ArrowRight className="w-3 h-3 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="text-xs font-semibold text-red-400">ANTES</span>
        </div>
        <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="text-xs font-semibold text-emerald-400">DESPUES</span>
        </div>
      </div>

      <p className="text-center text-white/40 text-sm mt-4">
        Arrastra el control para comparar
      </p>
    </div>
  )
}

// Emotional color shift background component
function EmotionalBackground({ scrollProgress }: { scrollProgress: number }) {
  const warmHue = 220 + scrollProgress * 20 // Shifts warmer for problem area
  const coolHue = 160 - scrollProgress * 10 // Shifts cooler for solution area

  return (
    <>
      {/* Problem warming gradient */}
      <div
        className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full blur-[200px] transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center,
            hsla(${warmHue}, 70%, 50%, 0.12) 0%,
            hsla(${warmHue + 20}, 80%, 40%, 0.06) 40%,
            transparent 70%)`,
          transform: `translate(${-20 + scrollProgress * 10}%, ${-10}%)`,
          left: '-200px',
          top: '-200px',
        }}
      />

      {/* Solution cooling gradient */}
      <div
        className="absolute bottom-0 right-0 w-[800px] h-[800px] rounded-full blur-[200px] transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center,
            hsla(${coolHue}, 60%, 45%, 0.1) 0%,
            hsla(${coolHue - 20}, 70%, 35%, 0.05) 40%,
            transparent 70%)`,
          transform: `translate(${20 - scrollProgress * 10}%, ${10}%)`,
          right: '-200px',
          bottom: '-200px',
        }}
      />
    </>
  )
}

export function ProblemSolutionSection() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>()
  const { ref: problemsRef, isVisible: problemsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 })
  const { ref: solutionsRef, isVisible: solutionsVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.05 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  // Track scroll progress for emotional color shift
  useEffect(() => {
    if (reducedMotion) return

    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate progress through the section (0 to 1)
      const progress = Math.max(0, Math.min(1,
        (viewportHeight - elementTop) / (viewportHeight + elementHeight)
      ))
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      className="py-24 px-6 lg:px-12 bg-[#04040e] relative overflow-hidden"
    >
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)',
        backgroundSize: '48px 48px'
      }} />

      {/* Emotional background gradients */}
      <EmotionalBackground scrollProgress={scrollProgress} />

      {/* Dramatic split-screen reveal glows */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full transition-all duration-1000"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(220,50,50,0.15) 0%, transparent 60%)',
          transform: `translateX(${problemsVisible ? '0' : '-100px'})`,
          opacity: problemsVisible ? 1 : 0,
          filter: 'blur(80px)',
        }}
      />

      <div
        className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full transition-all duration-1000 delay-200"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.12) 0%, transparent 60%)',
          transform: `translateX(${solutionsVisible ? '0' : '100px'})`,
          opacity: solutionsVisible ? 1 : 0,
          filter: 'blur(80px)',
        }}
      />

      {/* Central divider with energy pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-[60%] hidden lg:block">
        <div className="h-full bg-gradient-to-b from-transparent via-white/10 to-transparent relative">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-full bg-gradient-to-b from-red-500/20 via-white/30 to-emerald-500/20 blur-sm"
            style={{
              animation: 'energy-pulse 3s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header - dramatic entrance */}
        <div
          ref={headerRef}
          className={`text-center mb-20 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] mb-6">
            <span
              className="w-12 h-px bg-gradient-to-r from-transparent to-red-400/50"
              style={{
                animation: headerVisible ? 'line-grow 0.8s ease-out' : 'none',
                transformOrigin: 'left',
              }}
            />
            <span className="text-red-400/80">El problema real</span>
            <span
              className="w-12 h-px bg-gradient-to-l from-transparent to-red-400/50"
              style={{
                animation: headerVisible ? 'line-grow 0.8s ease-out' : 'none',
                transformOrigin: 'right',
              }}
            />
          </span>

          <h2 className="font-display text-5xl lg:text-6xl font-black text-white mt-4 mb-6 leading-[1.1]">
            <span
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
              }}
            >
              ¿Seguir perdendo clientes,
            </span>
            <br />
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500"
              style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            >
              dinero y tiempo?
            </span>
          </h2>

          <p
            className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}
          >
            El 78% de los negocios en Argentina siguen administrando con papel,
            WhatsApp y Excel. Perdiendo en promedio{' '}
            <span className="text-red-400 font-semibold">$120.000/mes</span> en oportunidades.
          </p>
        </div>

        {/* Problem vs Solution Grid with split reveal */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* PROBLEMS - Left column - dramatic slide from left */}
          <div
            ref={problemsRef}
            className="relative"
            style={{
              opacity: problemsVisible ? 1 : 0,
              transform: problemsVisible ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Pulsing accent line at top */}
            <div
              className="absolute -top-3 left-6 right-6 h-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.6), transparent)',
                animation: 'accent-pulse 2s ease-in-out infinite',
              }}
            />

            <div className="relative bg-gradient-to-b from-red-950/30 via-[#0a0a14] to-[#0a0a14] border border-red-900/40 rounded-3xl p-8 lg:p-10 overflow-hidden">
              {/* Inner warm atmosphere */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,50,50,0.1) 0%, transparent 70%)',
                  animation: 'warmth-breathe 4s ease-in-out infinite',
                }}
              />

              {/* Decorative X marks with animation */}
              <div className="absolute top-4 right-4 opacity-[0.08]">
                <AlertTriangle className="w-24 h-24 text-red-500" />
              </div>
              <div className="absolute bottom-4 left-4 opacity-[0.05]">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>

              {/* Column header */}
              <div className="relative flex items-center gap-4 mb-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/25 to-orange-500/10 border border-red-500/40 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-400" strokeWidth={1.5} />
                  </div>
                  {/* Warning glow with pulse */}
                  <div
                    className="absolute inset-0 bg-red-500/25 rounded-2xl blur-lg"
                    style={{
                      animation: 'warning-breathe 2s ease-in-out infinite',
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-2xl font-bold text-white">
                      Sin MaatWork
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full bg-red-500/25 text-red-400 text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        animation: 'badge-pulse 2s ease-in-out infinite',
                      }}
                    >
                      Perdidas
                    </span>
                  </div>
                  <p className="text-sm text-white/40 mt-1">La realidad de la mayoria</p>
                </div>
              </div>

              {/* Problem items with staggered animation */}
              <ul className="relative space-y-4">
                {problems.map((problem, i) => (
                  <ProblemCard key={i} item={problem} index={i} isVisible={problemsVisible} reducedMotion={reducedMotion} />
                ))}
              </ul>

              {/* Bottom loss indicator with dramatic reveal */}
              <div
                className="relative mt-8 pt-6 border-t border-red-900/40"
                style={{
                  opacity: problemsVisible ? 1 : 0,
                  transform: problemsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1) 0.8s',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-sm">Perdida mensual estimada</span>
                  <span
                    className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500"
                    style={{
                      animation: 'number-glow 2s ease-in-out infinite',
                    }}
                  >
                    $120.000+
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TRANSITION ARROW - Only on large screens */}
          <div className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 items-center justify-center">
            <div
              className="relative"
              style={{
                opacity: solutionsVisible ? 1 : 0,
                transform: solutionsVisible ? 'scale(1)' : 'scale(0.5)',
                transition: 'all 500ms cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-emerald-500/25 rounded-full blur-xl" />
              <div
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500/25 to-teal-500/10 border border-emerald-500/50 flex items-center justify-center"
                style={{
                  animation: 'arrow-breathe 2s ease-in-out infinite',
                }}
              >
                <ArrowRight className="w-7 h-7 text-emerald-400" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* SOLUTIONS - Right column - dramatic slide from right */}
          <div
            ref={solutionsRef}
            className="relative mt-0 lg:mt-24"
            style={{
              opacity: solutionsVisible ? 1 : 0,
              transform: solutionsVisible ? 'translateX(0)' : 'translateX(60px)',
              transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            }}
          >
            {/* Celebration rays */}
            <div className="absolute -top-12 right-8 w-32 h-32 opacity-30">
              <div
                className="absolute inset-0"
                style={{ animation: 'spin 20s linear infinite' }}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 w-1 h-8 bg-gradient-to-t from-emerald-400 to-transparent origin-bottom"
                    style={{
                      transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="relative bg-gradient-to-b from-[#0a0a14] via-emerald-950/25 to-emerald-950/40 border border-emerald-900/40 rounded-3xl p-8 lg:p-10 overflow-hidden">
              {/* Bright relief atmosphere */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(34,197,94,0.15) 0%, transparent 70%)',
                  animation: 'cool-breathe 5s ease-in-out infinite',
                }}
              />

              {/* Success checkmark decoration */}
              <div className="absolute top-4 right-4 opacity-[0.08]">
                <Sparkles className="w-24 h-24 text-emerald-400" />
              </div>

              {/* Column header */}
              <div className="relative flex items-center gap-4 mb-10">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-teal-500/10 border border-emerald-500/50 flex items-center justify-center">
                    <CalendarCheck className="w-7 h-7 text-emerald-400" strokeWidth={1.5} />
                  </div>
                  {/* Success glow */}
                  <div
                    className="absolute inset-0 bg-emerald-500/20 rounded-2xl blur-lg"
                    style={{
                      animation: 'success-breathe 3s ease-in-out infinite',
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-2xl font-bold text-white">
                      Con MaatWork
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Ganancias
                    </span>
                  </div>
                  <p className="text-sm text-white/40 mt-1">La transformacion que necesitas</p>
                </div>
              </div>

              {/* Solution items with staggered animation */}
              <ul className="relative space-y-4">
                {solutions.map((solution, i) => (
                  <SolutionCard key={i} item={solution} index={i} isVisible={solutionsVisible} reducedMotion={reducedMotion} />
                ))}
              </ul>

              {/* Bottom gain indicator */}
              <div
                className="relative mt-8 pt-6 border-t border-emerald-900/40"
                style={{
                  opacity: solutionsVisible ? 1 : 0,
                  transform: solutionsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 600ms cubic-bezier(0.16, 1, 0.3, 1) 1s',
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-sm">Recuperacion de ingresos</span>
                  <span
                    className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"
                    style={{
                      animation: 'gain-pulse 2s ease-in-out infinite',
                    }}
                  >
                    +40%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Before/After Comparison Slider */}
        <ComparisonSlider />

        {/* Bottom transformation banner */}
        <div
          className="text-center mt-20"
          style={{
            opacity: solutionsVisible ? 1 : 0,
            transform: solutionsVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 0.5s',
          }}
        >
          <div
            className="inline-flex items-center gap-6 px-10 py-6 rounded-3xl bg-gradient-to-r from-red-950/40 via-[#0a0a14] to-emerald-950/40 border border-white/10"
            style={{
              animation: 'banner-glow 4s ease-in-out infinite',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="text-red-400 font-bold text-lg">SIN</span>
              <span className="text-white/30">—</span>
              <span className="text-white/60 text-sm">Perdidas, caos, stress</span>
            </div>

            <div className="relative">
              <div
                className="absolute inset-0 bg-emerald-400/25 rounded-full blur-lg"
                style={{
                  animation: 'arrow-glow 2s ease-in-out infinite',
                }}
              />
              <ArrowRight className="w-8 h-8 text-emerald-400 relative" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold text-lg">CON</span>
              <span className="text-white/30">—</span>
              <span className="text-white/60 text-sm">Crecimiento, orden, libertad</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe animations - kept minimal for performance */}
      <style jsx global>{`
        @keyframes line-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        @keyframes energy-pulse {
          0%, 100% { opacity: 0.3; transform: translateX(-50%) scaleY(0.8); }
          50% { opacity: 0.8; transform: translateX(-50%) scaleY(1); }
        }

        @keyframes banner-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.1); }
          50% { box-shadow: 0 0 50px rgba(34, 197, 94, 0.2); }
        }

        @keyframes arrow-glow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
    </section>
  )
}
