'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Clock,
  DollarSign,
  Users,
  MessageCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Rocket,
  type LucideIcon,
} from 'lucide-react'
import { useScrollReveal, useReducedMotion } from '@/hooks'

// ============================================
// Types
// ============================================

interface MetricItem {
  icon: LucideIcon
  label: string
  before: number
  after: number
  unit: string
  description: string
}

interface FeatureHighlight {
  icon: LucideIcon
  title: string
  description: string
  accentColor: string
  glowColor: string
  iconGradient: string
}

interface TimelineStep {
  phase: string
  title: string
  description: string
  icon: LucideIcon
}

// ============================================
// Animation Config
// ============================================

const STAGGER_DELAY = 80

function getEasing(isReduced: boolean): string {
  return isReduced ? 'linear' : 'cubic-bezier(0.16, 1, 0.3, 1)'
}

// ============================================
// Data
// ============================================

const metrics: MetricItem[] = [
  {
    icon: Clock,
    label: 'Horas de administracion',
    before: 10,
    after: 1,
    unit: 'hrs/semana',
    description: 'Tiempo dedicado a tareas administrativas',
  },
  {
    icon: DollarSign,
    label: 'Cobros perdidos',
    before: 15,
    after: 2,
    unit: '% mensual',
    description: 'Ingresos que se escapan por falta de seguimiento',
  },
  {
    icon: Users,
    label: 'Clientes activos',
    before: 60,
    after: 120,
    unit: '',
    description: 'Capacidad de gestionar tu base de clientes',
  },
  {
    icon: MessageCircle,
    label: 'Respuestas a WhatsApp',
    before: 50,
    after: 5,
    unit: '/dia',
    description: 'Mensajes manuales que tenes que responder',
  },
]

const beforeFeatures: FeatureHighlight[] = [
  {
    icon: XCircle,
    title: 'Sin sistema',
    description: 'Todo en papel o planillas de Excel desactualizadas',
    accentColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    iconGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  },
  {
    icon: Clock,
    title: 'Perdida de tiempo',
    description: '3-4 horas diarias en tareas administrativas',
    accentColor: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    iconGradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  },
  {
    icon: Target,
    title: 'Sin control',
    description: 'No sabes que entra y que sale todos los dias',
    accentColor: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    iconGradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
  },
]

const afterFeatures: FeatureHighlight[] = [
  {
    icon: CheckCircle2,
    title: 'Todo automatizado',
    description: 'Un solo lugar para clientes, turnos y cobros',
    accentColor: '#22c55e',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    iconGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  },
  {
    icon: Rocket,
    title: '10x mas rapido',
    description: 'Procesos que antes tomaban horas, ahora son automaticos',
    accentColor: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    iconGradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  },
  {
    icon: TrendingUp,
    title: 'Crecimiento real',
    description: 'En 3 meses: 40% mas clientes, 90% menos deuda',
    accentColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    iconGradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
]

const timeline: TimelineStep[] = [
  {
    phase: 'Semana 1-2',
    title: 'Diagnostico y diseno',
    description: 'Analizamos tu negocio y disenamos la app a tu medida',
    icon: Sparkles,
  },
  {
    phase: 'Semana 2-3',
    title: 'Desarrollo',
    description: 'Programamos tu app con todas las funcionalidades',
    icon: Rocket,
  },
  {
    phase: 'Semana 3-4',
    title: 'Pruebas y lanzamiento',
    description: 'Testeamos juntos que todo funcione perfecto',
    icon: Target,
  },
]

// ============================================
// Animated Metric Counter
// ============================================

function AnimatedMetric({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  isReduced = false,
}: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  isReduced?: boolean
}) {
  // Use lazy initialization to avoid setState in effect
  const [displayValue, setDisplayValue] = useState(() => isReduced ? value : 0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const valueRef = useRef(value)

  // Update ref when value changes
  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    if (isReduced) {
      setDisplayValue(valueRef.current)
      return
    }

    setDisplayValue(0)
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayValue(Math.round(eased * valueRef.current))

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [duration, isReduced])

  return (
    <span>
      {prefix}
      {displayValue}
      {suffix}
    </span>
  )
}

// ============================================
// Feature Card Component
// ============================================

function FeatureCard({
  feature,
  isActive,
  index,
  isReduced,
}: {
  feature: FeatureHighlight
  isActive: boolean
  index: number
  isReduced?: boolean
}) {
  const Icon = feature.icon
  const easing = getEasing(isReduced ?? false)

  return (
    <div
      className={`
        relative p-6 rounded-2xl border transition-all duration-500
        ${isActive ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}
      `}
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${feature.accentColor}18 0%, transparent 60%)`
          : 'rgba(255, 255, 255, 0.02)',
        borderColor: isActive ? `${feature.accentColor}50` : 'rgba(255, 255, 255, 0.06)',
        boxShadow: isActive
          ? `0 0 60px ${feature.glowColor}, inset 0 1px 0 ${feature.accentColor}30, 0 20px 40px rgba(0,0,0,0.3)`
          : 'none',
        transform: isActive ? 'translateY(0) rotateX(0)' : 'translateY(16px) rotateX(5deg)',
        transition: `all 500ms ${easing} ${index * STAGGER_DELAY}ms`,
        transformStyle: 'preserve-3d',
        perspective: '800px',
      }}
    >
      {/* Glow effect */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at 30% 0%, ${feature.glowColor} 0%, transparent 60%)`,
            filter: 'blur(30px)',
          }}
        />
      )}

      {/* Animated border glow */}
      {isActive && !isReduced && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'transparent',
            border: `1px solid ${feature.accentColor}60`,
            animation: 'border-glow 3s ease-in-out infinite',
          }}
        />
      )}

      <div className="relative flex items-start gap-5">
        <div
          className="relative flex-shrink-0"
          style={{
            transform: isActive ? 'scale(1) rotateY(0)' : 'scale(0.8) rotateY(-15deg)',
            transition: `transform 600ms ${easing} ${index * STAGGER_DELAY + 100}ms`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: feature.iconGradient,
              boxShadow: isActive ? `0 12px 40px ${feature.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)` : 'none',
            }}
          >
            {/* Shine overlay */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 50%)',
              }}
            />
            {/* Animated shine sweep */}
            {!isReduced && isActive && (
              <div
                className="absolute inset-0 opacity-0"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  animation: 'icon-shine 3s ease-in-out infinite',
                  animationDelay: `${index * 500}ms`,
                }}
              />
            )}
            <Icon
              className="w-8 h-8 text-white relative z-10"
              strokeWidth={2}
            />
          </div>

          {/* Pulse ring */}
          {isActive && !isReduced && (
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                border: `2px solid ${feature.accentColor}50`,
                animation: 'feature-pulse 2.5s ease-in-out infinite',
              }}
            />
          )}

          {/* Floating particles around icon */}
          {isActive && !isReduced && (
            <>
              <div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                style={{
                  background: feature.accentColor,
                  boxShadow: `0 0 10px ${feature.accentColor}`,
                  animation: 'particle-float 3s ease-in-out infinite',
                  animationDelay: '0s',
                }}
              />
              <div
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full"
                style={{
                  background: feature.accentColor,
                  boxShadow: `0 0 8px ${feature.accentColor}`,
                  animation: 'particle-float 3s ease-in-out infinite',
                  animationDelay: '1s',
                }}
              />
            </>
          )}
        </div>

        <div className="flex-1 min-w-0 pt-2">
          <h4
            className="font-bold text-lg text-white mb-1.5 transition-all duration-500"
            style={{
              transform: isActive ? 'translateX(0)' : 'translateX(-16px)',
              transition: `transform 500ms ${easing} ${index * STAGGER_DELAY + 50}ms`,
            }}
          >
            {feature.title}
          </h4>
          <p
            className="text-sm text-white/50 transition-all duration-500 leading-relaxed"
            style={{
              opacity: isActive ? 1 : 0.4,
              transform: isActive ? 'translateY(0)' : 'translateY(10px)',
              transition: `opacity 500ms ${easing} ${index * STAGGER_DELAY + 100}ms, transform 500ms ${easing} ${index * STAGGER_DELAY + 100}ms`,
            }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Metric Bar Component
// ============================================

function MetricBar({
  metric,
  isAfter,
  index,
  isReduced,
}: {
  metric: MetricItem
  isAfter: boolean
  index: number
  isReduced?: boolean
}) {
  const beforePercent = (metric.before / (metric.before + metric.after)) * 100
  const afterPercent = (metric.after / (metric.before + metric.after)) * 100
  const Icon = metric.icon
  const easing = getEasing(isReduced ?? false)
  const accentColor = isAfter ? '#22c55e' : '#ef4444'
  const glowColor = isAfter ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'

  return (
    <div
      className="relative"
      style={{
        opacity: 1,
        transform: 'translateY(0)',
        transition: `all 600ms ${easing} ${index * 100}ms`,
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: isAfter
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.1) 100%)'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.1) 100%)',
              border: `1px solid ${isAfter ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'}`,
              boxShadow: `0 0 25px ${isAfter ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            }}
          >
            {/* Inner glow */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: `radial-gradient(circle at 30% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
              }}
            />
            <Icon
              className="w-5 h-5 relative z-10"
              style={{ color: accentColor }}
              strokeWidth={1.5}
            />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{metric.label}</div>
            <div className="text-xs text-white/40">{metric.description}</div>
          </div>
        </div>

        <div
          className="text-right"
          style={{
            transform: isAfter ? 'translateX(0)' : 'translateX(16px)',
            opacity: 1,
            transition: `all 500ms ${easing}`,
          }}
        >
          <div
            className="font-display text-2xl lg:text-3xl font-black tabular-nums leading-tight"
            style={{
              color: accentColor,
              textShadow: `0 0 40px ${glowColor}`,
            }}
          >
            {isAfter ? (
              <AnimatedMetric
                value={metric.after}
                suffix={metric.unit ? ` ${metric.unit}` : ''}
                isReduced={isReduced}
              />
            ) : (
              <AnimatedMetric
                value={metric.before}
                suffix={metric.unit ? ` ${metric.unit}` : ''}
                isReduced={isReduced}
              />
            )}
          </div>
        </div>
      </div>

      {/* Comparison bar */}
      <div className="relative h-4 rounded-full overflow-hidden bg-white/5 backdrop-blur-sm border border-white/5">
        <div className="absolute inset-y-0 left-0 rounded-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              width: `${beforePercent}%`,
              background: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.7)',
              transition: `width 900ms ${easing} 100ms`,
            }}
          />
        </div>
        <div
          className="absolute inset-y-0 right-0 rounded-full overflow-hidden"
          style={{
            width: isAfter ? `${afterPercent}%` : '0%',
            background: 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.7)',
            transition: `width 900ms ${easing} 200ms`,
          }}
        />

        {/* Shimmer effect on bars */}
        {!isReduced && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              animation: 'bar-shimmer 2s ease-in-out infinite',
            }}
          />
        )}

        {/* Center divider */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-8 bg-white/20 rounded-full backdrop-blur-sm border border-white/10" />
      </div>
    </div>
  )
}

// ============================================
// Timeline Component
// ============================================

function TimelineStepCard({
  step,
  index,
  isActive,
  isReduced,
}: {
  step: TimelineStep
  index: number
  isActive: boolean
  isReduced?: boolean
}) {
  const Icon = step.icon
  const easing = getEasing(isReduced ?? false)

  return (
    <div
      className="relative flex gap-5"
      style={{
        opacity: isActive ? 1 : 0.3,
        transform: isActive ? 'translateX(0)' : 'translateX(24px)',
        transition: `all 600ms ${easing} ${index * 150}ms`,
      }}
    >
      {/* Connector line */}
      {index < timeline.length - 1 && (
        <div
          className="absolute top-14 left-6 w-0.5 h-full"
          style={{
            background: 'linear-gradient(to bottom, rgba(139, 92, 246, 0.5) 0%, transparent 100%)',
            opacity: isActive ? 0.6 : 0.15,
            transition: `opacity 600ms ${easing}`,
          }}
        />
      )}

      {/* Icon */}
      <div
        className="relative flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center z-10 overflow-hidden"
        style={{
          background: isActive
            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.35) 0%, rgba(99, 102, 241, 0.25) 100%)'
            : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${isActive ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
          boxShadow: isActive ? '0 0 40px rgba(139, 92, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
          transition: `all 600ms ${easing}`,
        }}
      >
        {/* Inner glow */}
        {isActive && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle at 30% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)',
            }}
          />
        )}

        <Icon
          className="w-6 h-6 relative z-10"
          style={{
            color: isActive ? '#c4b5fd' : 'rgba(255, 255, 255, 0.3)',
            strokeWidth: isActive ? 1.5 : 1,
            transition: `all 500ms ${easing}`,
          }}
        />

        {/* Glow pulse */}
        {isActive && !isReduced && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
              animation: 'timeline-glow 2.5s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-10 pt-1">
        <div
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{
            color: isActive ? '#c4b5fd' : 'rgba(255, 255, 255, 0.25)',
            transition: `color 500ms ${easing}`,
          }}
        >
          {step.phase}
        </div>
        <div
          className="font-bold text-lg text-white mb-1.5"
          style={{
            transform: isActive ? 'translateY(0)' : 'translateY(8px)',
            transition: `transform 500ms ${easing}`,
          }}
        >
          {step.title}
        </div>
        <div
          className="text-sm text-white/45"
          style={{
            opacity: isActive ? 1 : 0.4,
            transition: `opacity 500ms ${easing}`,
          }}
        >
          {step.description}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================

export function TransformationShowcase() {
  const [isAfter, setIsAfter] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 })
  const reducedMotion = useReducedMotion()

  // Memoize easing
  const easing = useMemo(() => getEasing(reducedMotion), [reducedMotion])

  // State transition flash effect
  const [showFlash, setShowFlash] = useState(false)
  const prevIsAfter = useRef(isAfter)

  useEffect(() => {
    if (prevIsAfter.current !== isAfter) {
      setShowFlash(true)
      const timeout = setTimeout(() => setShowFlash(false), 400)
      prevIsAfter.current = isAfter
      return () => clearTimeout(timeout)
    }
  }, [isAfter])

  // Mouse/touch handlers for the comparison slider
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPosition(percentage)
    setIsAfter(percentage > 50)
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) handleMove(e.clientX)
    },
    [isDragging, handleMove],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isDragging) handleMove(e.touches[0].clientX)
    },
    [isDragging, handleMove],
  )

  // Toggle button handler
  const handleToggle = useCallback(() => {
    setIsAfter((prev) => !prev)
    setSliderPosition((prev) => (prev > 50 ? 30 : 70))
  }, [])

  const features = isAfter ? afterFeatures : beforeFeatures
  const accentColor = isAfter ? '#22c55e' : '#ef4444'
  const glowColor = isAfter ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'

  return (
    <section
      ref={sectionRef}
      className="relative section-spacing px-6 lg:px-12 overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* State Transition Flash */}
      {showFlash && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: isAfter
              ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle at center, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
            animation: 'flash-pulse 400ms ease-out forwards',
          }}
        />
      )}

      {/* Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Primary ambient glow */}
        <div
          className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[180px] transition-all duration-1000"
          style={{
            background: isAfter
              ? 'radial-gradient(ellipse, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.05) 40%, transparent 70%)'
              : 'radial-gradient(ellipse, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.05) 40%, transparent 70%)',
          }}
        />

        {/* Secondary ambient glow */}
        <div
          className="absolute top-1/3 left-0 w-[500px] h-[400px] rounded-full blur-[150px] transition-all duration-1000"
          style={{
            background: isAfter
              ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
            transform: `translateX(${isAfter ? '-30%' : '0%'})`,
          }}
        />

        {/* Tertiary ambient glow */}
        <div
          className="absolute bottom-1/4 right-0 w-[450px] h-[350px] rounded-full blur-[140px] transition-all duration-1000"
          style={{
            background: isAfter
              ? 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(220, 38, 38, 0.08) 0%, transparent 70%)',
            transform: `translateX(${isAfter ? '0%' : '20%'})`,
          }}
        />

        {/* Floating particles - only when reduced motion is false */}
        {!reducedMotion && (
          <>
            {/* Large ambient orbs */}
            <div
              className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full animate-float-slow"
              style={{
                background: `radial-gradient(circle, ${isAfter ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)'} 0%, transparent 70%)`,
                filter: 'blur(20px)',
                animationDelay: '0s',
              }}
            />
            <div
              className="absolute top-[50%] right-[15%] w-24 h-24 rounded-full animate-float-medium"
              style={{
                background: `radial-gradient(circle, ${isAfter ? 'rgba(99, 102, 241, 0.1)' : 'rgba(249, 115, 22, 0.1)'} 0%, transparent 70%)`,
                filter: 'blur(15px)',
                animationDelay: '2s',
              }}
            />
            <div
              className="absolute bottom-[25%] left-[20%] w-20 h-20 rounded-full animate-float-fast"
              style={{
                background: `radial-gradient(circle, ${isAfter ? 'rgba(139, 92, 246, 0.1)' : 'rgba(220, 38, 38, 0.08)'} 0%, transparent 70%)`,
                filter: 'blur(12px)',
                animationDelay: '4s',
              }}
            />

            {/* Small particles */}
            <div
              className="absolute top-[20%] left-[15%] w-1 h-1 rounded-full"
              style={{
                background: isAfter ? '#22c55e' : '#ef4444',
                boxShadow: `0 0 10px ${isAfter ? '#22c55e' : '#ef4444'}`,
                animation: 'float-slow 8s ease-in-out infinite',
                animationDelay: '0s',
              }}
            />
            <div
              className="absolute top-[40%] right-[20%] w-1.5 h-1.5 rounded-full"
              style={{
                background: isAfter ? '#6366f1' : '#f97316',
                boxShadow: `0 0 12px ${isAfter ? '#6366f1' : '#f97316'}`,
                animation: 'float-medium 6s ease-in-out infinite',
                animationDelay: '1s',
              }}
            />
            <div
              className="absolute bottom-[30%] left-[25%] w-1 h-1 rounded-full"
              style={{
                background: isAfter ? '#8b5cf6' : '#eab308',
                boxShadow: `0 0 8px ${isAfter ? '#8b5cf6' : '#eab308'}`,
                animation: 'float-fast 5s ease-in-out infinite',
                animationDelay: '2s',
              }}
            />
            <div
              className="absolute top-[60%] left-[8%] w-0.5 h-0.5 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.5)',
                boxShadow: '0 0 6px rgba(255,255,255,0.5)',
                animation: 'float-medium 7s ease-in-out infinite',
                animationDelay: '3s',
              }}
            />
            <div
              className="absolute bottom-[15%] right-[25%] w-1 h-1 rounded-full"
              style={{
                background: isAfter ? '#10b981' : '#dc2626',
                boxShadow: `0 0 10px ${isAfter ? '#10b981' : '#dc2626'}`,
                animation: 'float-slow 9s ease-in-out infinite',
                animationDelay: '1.5s',
              }}
            />
          </>
        )}
      </div>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
        <div
          className="text-center mb-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: `all 800ms ${easing}`,
          }}
        >
          <span className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest mb-6">
            <span
              className="h-px w-12 transition-all duration-700"
              style={{
                background: `linear-gradient(to right, transparent, ${accentColor})`,
              }}
            />
            <span
              className="relative px-4 py-1.5 rounded-full"
              style={{
                color: accentColor,
                background: `${accentColor}12`,
                border: `1px solid ${accentColor}30`,
              }}
            >
              Transformacion Real
            </span>
            <span
              className="h-px w-12 transition-all duration-700"
              style={{
                background: `linear-gradient(to left, transparent, ${accentColor})`,
              }}
            />
          </span>

          <h2 className="font-display text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-6 leading-[1.1]">
            De perder clientes a
            <br />
            <span
              className="relative inline-block"
              style={{
                color: accentColor,
              }}
            >
              <span
                className="absolute -inset-4 rounded-2xl blur-xl opacity-50"
                style={{ background: `${accentColor}30` }}
              />
              <span className="relative">crecer 40%</span>
            </span>{' '}
            en 3 meses
          </h2>

          <p className="text-white/50 max-w-xl mx-auto text-lg leading-relaxed">
            Mira la diferencia entre gestionar tu negocio con metodos tradicionales
            vs. con MaatWork
          </p>
        </div>

        {/* State Toggle */}
        <div
          className="flex justify-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: `all 700ms ${easing} 0.1s`,
          }}
        >
          <div
            className="relative inline-flex items-center gap-0 p-1.5 rounded-full cursor-pointer select-none backdrop-blur-sm"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
            onClick={handleToggle}
            role="switch"
            aria-checked={isAfter}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleToggle()}
          >
            {/* Sliding indicator */}
            <div
              className="absolute top-1 bottom-1 rounded-full transition-all duration-500 ease-out"
              style={{
                width: 'calc(50% - 6px)',
                left: isAfter ? 'calc(50% + 3px)' : '3px',
                background: accentColor,
                boxShadow: `0 0 40px ${glowColor}, 0 4px 16px rgba(0,0,0,0.3)`,
              }}
            />

            <div
              className="relative px-8 py-3 rounded-full transition-all duration-300 z-10"
              style={{
                color: !isAfter ? 'white' : 'rgba(255, 255, 255, 0.45)',
                fontWeight: !isAfter ? 700 : 500,
              }}
            >
              <span className="flex items-center gap-2.5">
                <XCircle className="w-4.5 h-4.5" strokeWidth={2.5} />
                <span>Antes</span>
              </span>
            </div>
            <div
              className="relative px-8 py-3 rounded-full transition-all duration-300 z-10"
              style={{
                color: isAfter ? 'white' : 'rgba(255, 255, 255, 0.45)',
                fontWeight: isAfter ? 700 : 500,
              }}
            >
              <span className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4.5 h-4.5" strokeWidth={2.5} />
                <span>Despues</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Comparison Area */}
        <div
          className="grid lg:grid-cols-2 gap-8 mb-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: `all 800ms ${easing} 0.2s`,
          }}
        >
          {/* Left: Visual Comparison Slider */}
          <div
            ref={containerRef}
            className="relative h-96 rounded-3xl overflow-hidden cursor-ew-resize select-none"
            style={{
              background: 'rgba(255, 255, 255, 0.01)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              perspective: '1000px',
              transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
          >
            {/* Before side */}
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.1) 50%, rgba(127, 29, 29, 0.05) 100%)',
                transform: sliderPosition > 50 ? 'translateZ(0)' : 'translateZ(-20px)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Radial overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 30% 50%, rgba(239, 68, 68, 0.25) 0%, transparent 60%)',
                }}
              />

              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
                    border: '2px solid rgba(239, 68, 68, 0.5)',
                    boxShadow: '0 0 80px rgba(239, 68, 68, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                    transform: `scale(${sliderPosition > 70 ? 1 : 0.8}) rotateY(${sliderPosition > 70 ? 0 : 10}deg)`,
                  }}
                >
                  {/* Inner glow */}
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'radial-gradient(circle at 30% 0%, rgba(255,255,255,0.2) 0%, transparent 60%)',
                    }}
                  />
                  <XCircle className="w-14 h-14 text-red-400 relative z-10" strokeWidth={1.5} />
                </div>
                <div
                  className="text-2xl font-bold text-red-400 mb-2 tracking-tight"
                  style={{
                    textShadow: '0 0 30px rgba(239, 68, 68, 0.6)',
                  }}
                >
                  SIN MaatWork
                </div>
                <div className="text-white/50 text-center max-w-[220px] leading-relaxed">
                  Administracion manual, caos y perdidas
                </div>
              </div>
            </div>

            {/* After side */}
            <div
              className="absolute inset-0 transition-all duration-300"
              style={{
                clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 50%, rgba(5, 46, 22, 0.05) 100%)',
                transform: sliderPosition < 50 ? 'translateZ(0)' : 'translateZ(-20px)',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Radial overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(circle at 70% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 60%)',
                }}
              />

              {/* Noise texture overlay */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center mb-6 transition-all duration-500 relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(22, 163, 74, 0.2) 100%)',
                    border: '2px solid rgba(34, 197, 94, 0.5)',
                    boxShadow: '0 0 80px rgba(34, 197, 94, 0.5), inset 0 1px 0 rgba(255,255,255,0.15)',
                    transform: `scale(${sliderPosition < 30 ? 1 : 0.8}) rotateY(${sliderPosition < 30 ? 0 : -10}deg)`,
                  }}
                >
                  {/* Inner glow */}
                  <div
                    className="absolute inset-0 rounded-3xl"
                    style={{
                      background: 'radial-gradient(circle at 70% 0%, rgba(255,255,255,0.2) 0%, transparent 60%)',
                    }}
                  />
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 relative z-10" strokeWidth={1.5} />
                </div>
                <div
                  className="text-2xl font-bold text-emerald-400 mb-2 tracking-tight"
                  style={{
                    textShadow: '0 0 30px rgba(34, 197, 94, 0.6)',
                  }}
                >
                  CON MaatWork
                </div>
                <div className="text-white/50 text-center max-w-[220px] leading-relaxed">
                  Automatizacion inteligente y crecimiento
                </div>
              </div>
            </div>

            {/* Slider handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white/60 cursor-ew-resize z-20 transition-all duration-150"
              style={{
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)',
                boxShadow: isDragging
                  ? '0 0 60px rgba(255, 255, 255, 0.8), -4px 0 20px rgba(0,0,0,0.3), 4px 0 20px rgba(0,0,0,0.3)'
                  : '0 0 30px rgba(255, 255, 255, 0.4)',
              }}
            >
              {/* Glow effect */}
              <div
                className="absolute inset-0"
                style={{
                  background: isDragging
                    ? 'linear-gradient(90deg, rgba(239,68,68,0.8) 0%, white 50%, rgba(34,197,94,0.8) 100%)'
                    : 'linear-gradient(90deg, rgba(239,68,68,0.4) 0%, white 50%, rgba(34,197,94,0.4) 100%)',
                  filter: 'blur(2px)',
                }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center transition-transform duration-150"
                style={{
                  transform: `translate(-50%, -50%) scale(${isDragging ? 1.2 : 1})`,
                  boxShadow: '0 12px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255,255,255,0.3)',
                }}
              >
                <div className="flex items-center gap-0.5">
                  <ArrowRight
                    className="w-6 h-6 text-red-400 transition-transform duration-300"
                    style={{ transform: sliderPosition > 50 ? 'scaleX(1) translateX(2px)' : 'scaleX(-1) translateX(-2px)' }}
                  />
                  <ArrowRight
                    className="w-6 h-6 text-emerald-400 transition-transform duration-300"
                    style={{ transform: sliderPosition > 50 ? 'scaleX(1) translateX(-2px)' : 'scaleX(-1) translateX(2px)' }}
                  />
                </div>
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-5 left-5 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
              <span className="text-xs font-bold tracking-wider text-red-400">ANTES</span>
            </div>
            <div className="absolute top-5 right-5 px-4 py-2 rounded-full bg-black/70 backdrop-blur-md border border-white/10">
              <span className="text-xs font-bold tracking-wider text-emerald-400">DESPUES</span>
            </div>
          </div>

          {/* Right: Metrics Comparison */}
          <div
            className="relative rounded-3xl p-8 overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              boxShadow: `0 0 80px ${glowColor}15, inset 0 1px 0 rgba(255,255,255,0.05)`,
            }}
          >
            {/* Glow effect */}
            <div
              className="absolute top-0 left-0 w-full h-full rounded-3xl pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${glowColor}25 0%, transparent 60%)`,
                filter: 'blur(40px)',
              }}
            />

            <div className="relative">
              <div className="flex items-center gap-4 mb-10">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%)`,
                    border: `1px solid ${accentColor}40`,
                    boxShadow: `0 0 30px ${accentColor}20`,
                  }}
                >
                  <TrendingUp className="w-6 h-6" style={{ color: accentColor }} strokeWidth={2} />
                </div>
                <div>
                  <div className="font-bold text-white text-lg">Metricas Clave</div>
                  <div className="text-sm text-white/40">Lo que cambia con MaatWork</div>
                </div>
              </div>

              <div className="space-y-8">
                {metrics.map((metric, i) => (
                  <MetricBar
                    key={metric.label}
                    metric={metric}
                    isAfter={isAfter}
                    index={i}
                    isReduced={reducedMotion}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div
          className="mb-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: `all 800ms ${easing} 0.3s`,
          }}
        >
          <div className="text-center mb-10">
            <h3 className="font-display text-3xl font-bold text-white mb-3">
              {isAfter ? 'Lo que ganas con MaatWork' : 'Los problemas de no tener app'}
            </h3>
            <p className="text-white/45 max-w-md mx-auto">
              {isAfter
                ? 'Cada funcionalidad diseñada para hacerte la vida mas facil'
                : 'Cada hora que pasa sin un sistema es dinero que se pierde'}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                isActive={true}
                index={i}
                isReduced={reducedMotion}
              />
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div
          className="relative max-w-lg mx-auto"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: `all 800ms ${easing} 0.4s`,
          }}
        >
          <div className="absolute top-0 left-[27px] w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

          <div className="relative">
            {timeline.map((step, i) => (
              <TimelineStepCard
                key={step.phase}
                step={step}
                index={i}
                isActive={isVisible}
                isReduced={reducedMotion}
              />
            ))}
          </div>

          {/* CTA */}
          <div
            className="mt-16 text-center"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: `all 700ms ${easing} 0.6s`,
            }}
          >
            <button
              className="relative px-12 py-5 rounded-2xl font-bold text-xl transition-all duration-500 overflow-hidden group cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${accentColor} 0%, ${isAfter ? '#16a34a' : '#dc2626'} 100%)`,
                boxShadow: `0 12px 48px ${glowColor}, 0 0 80px ${glowColor}40`,
                transform: 'perspective(800px)',
              }}
            >
              {/* Animated border */}
              {!reducedMotion && (
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background: 'transparent',
                    border: `2px solid ${accentColor}`,
                    animation: 'cta-border-pulse 2s ease-in-out infinite',
                  }}
                />
              )}

              <span className="relative z-10 flex items-center justify-center gap-3 text-white">
                {isAfter ? 'Quiero esta transformacion' : 'Quiero cambiar mi negocio'}
                <ArrowRight
                  className="w-6 h-6 transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                  style={{
                    filter: `drop-shadow(0 0 8px ${accentColor})`,
                  }}
                />
              </span>

              {/* Shine effect */}
              {!reducedMotion && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                    animation: 'shimmer-sweep 1.5s ease-in-out infinite',
                  }}
                />
              )}

              {/* Glow aura */}
              <div
                className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                  zIndex: -1,
                }}
              />
            </button>

            <p className="text-white/35 text-sm mt-5 tracking-wide">
              Sin tarjeta · Sin compromiso · En 7-14 dias tenes tu app
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe animations */}
      <style jsx global>{`
        @keyframes feature-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes timeline-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes shimmer-sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-20px) translateX(10px);
            opacity: 0.4;
          }
        }

        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-15px) translateX(-8px);
            opacity: 0.3;
          }
        }

        @keyframes float-fast {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-12px) translateX(5px);
            opacity: 0.2;
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-float-fast {
          animation: float-fast 5s ease-in-out infinite;
        }

        @keyframes flash-pulse {
          0% {
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes border-glow {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.02);
          }
        }

        @keyframes icon-shine {
          0% {
            opacity: 0;
            transform: translateX(-100%) rotate(45deg);
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0;
            transform: translateX(100%) rotate(45deg);
          }
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-8px) scale(1.2);
            opacity: 1;
          }
        }

        @keyframes cta-border-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.02);
          }
        }

        @keyframes bar-shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </section>
  )
}
