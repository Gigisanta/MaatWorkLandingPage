'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useScrollReveal, useReducedMotion } from '@/hooks/use-scroll-reveal'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { TrendingUp, Clock, Users, Zap, ArrowRight, Calculator, Sparkles, Check } from 'lucide-react'

// ROI Calculator configuration
interface ROIConfig {
  name: string
  min: number
  max: number
  step: number
  default: number
  unit: string
  prefix?: string
  suffix?: string
  description: string
  icon: React.ReactNode
}

const roiConfig: ROIConfig[] = [
  {
    name: 'Horas diarias en tareas administrativas',
    min: 1,
    max: 8,
    step: 0.5,
    default: 3,
    unit: 'hrs/dia',
    description: 'Tiempo que dedicas a scheduling, cobros y WhatsApp manual',
    icon: <Clock className="w-4 h-4" />
  },
  {
    name: 'Tarifa por hora de tu tiempo',
    min: 1000,
    max: 15000,
    step: 500,
    default: 4000,
    unit: 'ARS/hora',
    prefix: '$',
    description: 'Valor de tu hora de trabajo',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    name: 'Dias lavorables por mes',
    min: 20,
    max: 31,
    step: 1,
    default: 22,
    unit: 'dias',
    description: 'Dias que trabajas activamente',
    icon: <Users className="w-4 h-4" />
  }
]

// Check for reduced motion preference
const useMotionSafe = () => {
  const reducedMotion = useReducedMotion()
  return !reducedMotion
}

// 3D tilt hook for premium card effect
function useTilt3D<T extends HTMLElement>(maxTilt = 8) {
  const ref = useRef<T>(null)
  const motionSafe = useMotionSafe()

  useEffect(() => {
    if (!motionSafe || !ref.current) return

    const el = ref.current
    let rafId: number | null = null

    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -maxTilt
        const rotateY = ((x - centerX) / centerX) * maxTilt
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      })
    }

    const handleMouseLeave = () => {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)'
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [motionSafe, maxTilt])

  return ref
}

// Floating particles component
function FloatingParticles() {
  const motionSafe = useMotionSafe()
  const [particles] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      duration: Math.random() * 4 + 6,
      driftX: (Math.random() - 0.5) * 100,
      driftY: Math.random() * 50 + 50
    }))
  )

  if (!motionSafe) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gradient-to-r from-primary/30 to-accent-purple/30"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `particle-drift ${p.duration}s ease-in-out ${p.delay}s infinite`,
            ['--drift-x' as string]: p.driftX,
            ['--drift-y' as string]: p.driftY,
            filter: 'blur(1px)'
          }}
        />
      ))}
    </div>
  )
}

// Sparkle burst effect
function SparkleBurst({ active }: { active: boolean }) {
  const motionSafe = useMotionSafe()
  if (!motionSafe || !active) return null

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
          style={{
            left: '50%',
            top: '40%',
            animation: `sparkle-burst 0.6s ease-out forwards`,
            animationDelay: `${i * 50}ms`,
            transform: `rotate(${i * 45}deg) translateY(0)`
          }}
        />
      ))}
    </div>
  )
}

// Animated number display with smooth transitions
function AnimatedNumber({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  duration = 400
}: {
  value: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  duration?: number
}) {
  const motionSafe = useMotionSafe()
  const [displayValue, setDisplayValue] = useState(value)
  const animationRef = useRef<number | null>(null)
  const targetValue = useRef(value)
  const startTimeRef = useRef<number | null>(null)
  const prevValue = useRef(value)

  // Update target when value changes
  useEffect(() => {
    if (value !== prevValue.current) {
      targetValue.current = value
      prevValue.current = value
    }
  }, [value])

  // Animation effect - only runs when motion is safe and value changes
  useEffect(() => {
    if (!motionSafe || value === displayValue) return

    const startValue = displayValue
    startTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) return

      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Spring-like easing
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const current = startValue + (targetValue.current - startValue) * easeOut

      setDisplayValue(current)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        startTimeRef.current = null
        animationRef.current = null
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [motionSafe, duration, value, displayValue])

  const formattedValue = (motionSafe ? displayValue : value).toLocaleString('es-AR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  )
}

// Circular progress chart for ROI visualization with multiple rings
function ROICircularChart({
  percentage,
  label,
  value,
  delay = 0
}: {
  percentage: number
  label: string
  value: string
  delay?: number
}) {
  const motionSafe = useMotionSafe()
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.5 })

  // Track animation progress using ref only for smooth animation
  const progressRef = useRef(0)
  const [displayPercent, setDisplayPercent] = useState(0)

  // Set up animation when visible
  useEffect(() => {
    if (!isVisible) return

    // Start animation from current progress (allows re-animation on re-entry)
    const startPercent = progressRef.current
    const timeout = setTimeout(() => {
      startTimeRef.current = performance.now()
      const animDuration = motionSafe ? 1400 : 1 // Near-instant for reduced motion

      const animate = (currentTime: number) => {
        if (startTimeRef.current === null) return
        const elapsed = currentTime - startTimeRef.current
        const progress = Math.min(elapsed / animDuration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        const current = startPercent + (percentage - startPercent) * easeOut
        progressRef.current = current
        setDisplayPercent(current)

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      startTimeRef.current = null
    }
  }, [isVisible, percentage, motionSafe, delay])

  const radius = 42
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayPercent / 100) * circumference

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative w-32 h-32">
        {/* Outer glow ring */}
        <div
          className="absolute inset-[-4px] rounded-full transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)',
            opacity: displayPercent > 0 ? 1 : 0
          }}
        />

        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
          />
          {/* Outer decorative ring */}
          <circle
            cx="50"
            cy="50"
            r={radius + 6}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#chartGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-300 ease-out"
            style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.5))' }}
          />
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-black text-white tabular-nums">
            {Math.round(displayPercent)}%
          </span>
          <span className="text-[10px] text-emerald-400/80 font-medium">eficiencia</span>
        </div>
      </div>
      <span className="mt-3 text-sm font-semibold text-white/90 text-center">{value}</span>
      <span className="text-xs text-white/50">{label}</span>
    </div>
  )
}

// Premium slider with enhanced styling
function PremiumSlider({
  value,
  min,
  max,
  step,
  onChange,
  label,
  unit,
  prefix = '',
  description,
  icon,
  index
}: {
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  label: string
  unit: string
  prefix?: string
  description: string
  icon: React.ReactNode
  index: number
}) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const motionSafe = useMotionSafe()

  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 })

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const percentage = x / rect.width
    const rawValue = min + (max - min) * percentage
    const steppedValue = Math.round(rawValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))

    onChange(clampedValue)
  }, [isDragging, min, max, step, onChange])

  const percentage = ((value - min) / (max - min)) * 100

  const entryStyle = motionSafe
    ? {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 100}ms`
      }
    : { opacity: 1, transform: 'none' }

  return (
    <div
      ref={ref}
      className="group/slider mb-8 last:mb-0"
      style={entryStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1 pr-4">
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-xl
            flex items-center justify-center
            transition-all duration-300
            ${isHovered || isDragging
              ? 'bg-gradient-to-br from-primary/30 to-accent-purple/30 border border-primary/50'
              : 'bg-white/5 border border-white/10'
            }
          `}>
            <span className={`transition-colors duration-300 ${isHovered || isDragging ? 'text-primary' : 'text-white/60'}`}>
              {icon}
            </span>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/90 mb-1">
              {label}
            </label>
            <p className="text-xs text-white/50">{description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="font-display text-2xl font-bold text-white tabular-nums">
            <AnimatedNumber
              value={value}
              prefix={prefix}
              decimals={step < 1 ? 1 : 0}
            />
          </span>
          <span className="text-sm text-white/50 ml-1">{unit}</span>
        </div>
      </div>

      {/* Track */}
      <div
        ref={(el) => {
          sliderRef.current = el
        }}
        className={`
          relative h-4 rounded-xl cursor-pointer select-none touch-none
          bg-gradient-to-r from-white/10 to-white/5
          transition-shadow duration-300
          ${isDragging
            ? 'shadow-[0_0_25px_rgba(99,102,241,0.5)]'
            : isHovered
              ? 'shadow-[0_0_20px_rgba(99,102,241,0.3)]'
              : ''
          }
        `}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setIsDragging(false)}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault()
            onChange(Math.min(max, value + step))
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault()
            onChange(Math.max(min, value - step))
          }
        }}
      >
        {/* Filled track */}
        <div
          className="absolute inset-y-0 left-0 rounded-xl bg-gradient-to-r from-primary to-accent-purple transition-all duration-75"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 -translate-x-1/2
            w-12 h-12 rounded-full bg-white shadow-xl
            transition-transform duration-150
            flex items-center justify-center
            ${isDragging ? 'scale-125' : isHovered ? 'scale-110' : ''}
          `}
          style={{ left: `${percentage}%` }}
        >
          {/* Inner glow */}
          <div
            className={`
              absolute inset-[5px] rounded-full
              bg-gradient-to-br from-primary/80 to-accent-purple/80
              transition-opacity duration-150
              ${isDragging ? 'opacity-100' : isHovered ? 'opacity-70' : 'opacity-0'}
            `}
          />
          {/* Outer pulse */}
          {motionSafe && (isDragging || isHovered) && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent-purple animate-ping opacity-30" />
          )}
        </div>
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between mt-2 text-[10px] text-white/30">
        <span>{prefix}{min.toLocaleString('es-AR')}</span>
        <span>{prefix}{max.toLocaleString('es-AR')}</span>
      </div>
    </div>
  )
}

// Before/After comparison card with enhanced animations
function BeforeAfterCard({
  before,
  after,
  isVisible,
  delay = 0
}: {
  before: { label: string; value: string; color: string }
  after: { label: string; value: string; color: string }
  isVisible: boolean
  delay?: number
}) {
  const motionSafe = useMotionSafe()

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Before */}
      <div
        className={`
          relative p-4 rounded-xl bg-white/5 border border-white/10
          transition-all duration-500
          ${motionSafe
            ? isVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-8'
            : 'opacity-100 translate-x-0'
          }
        `}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="text-[10px] uppercase tracking-wider text-white/40 mb-2">Antes</div>
        <div className={`font-display text-2xl font-bold mb-1 ${before.color}`}>
          {before.value}
        </div>
        <div className="text-xs text-white/60">{before.label}</div>
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-red-400 text-xs font-bold">X</span>
        </div>
      </div>

      {/* After */}
      <div
        className={`
          relative p-4 rounded-xl
          bg-gradient-to-br from-emerald-500/10 to-emerald-600/5
          border border-emerald-500/30
          transition-all duration-500
          ${motionSafe
            ? isVisible
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-8'
            : 'opacity-100 translate-x-0'
          }
        `}
        style={{ transitionDelay: `${delay + 150}ms` }}
      >
        <div className="text-[10px] uppercase tracking-wider text-emerald-400/70 mb-2">Despues</div>
        <div className={`font-display text-2xl font-bold mb-1 ${after.color}`}>
          {after.value}
        </div>
        <div className="text-xs text-white/60">{after.label}</div>
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <Check className="w-3 h-3 text-emerald-400" />
        </div>
      </div>
    </div>
  )
}

// Main ROI Calculator component
export function ROICalculator() {
  const motionSafe = useMotionSafe()
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.15 })
  const cardRef = useTilt3D<HTMLDivElement>(6)

  const [values, setValues] = useState({
    hours: roiConfig[0].default,
    rate: roiConfig[1].default,
    days: roiConfig[2].default
  })

  const [resultKey, setResultKey] = useState(0)
  const [showSparkle, setShowSparkle] = useState(false)

  // Calculate ROI
  const monthlyHours = values.hours * values.days
  const monthlySavings = monthlyHours * values.rate
  const yearlySavings = monthlySavings * 12
  const efficiencyGain = 85
  const newAdministrativeHours = Math.round(monthlyHours * (1 - efficiencyGain / 100))
  const hoursSaved = monthlyHours - newAdministrativeHours

  // Trigger result animation when values change
  const handleValueChange = useCallback((key: keyof typeof values, value: number) => {
    setValues(prev => ({ ...prev, [key]: value }))
    if (motionSafe) {
      setTimeout(() => {
        setResultKey(prev => prev + 1)
        setShowSparkle(true)
        setTimeout(() => setShowSparkle(false), 600)
      }, 0)
    }
  }, [motionSafe])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const sectionStyle = motionSafe
    ? {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 800ms cubic-bezier(0.16, 1, 0.3, 1), transform 800ms cubic-bezier(0.16, 1, 0.3, 1)'
      }
    : { opacity: 1, transform: 'none' }

  return (
    <section className="relative py-24 px-6 lg:px-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#04040e]" />

      {/* Mesh gradient */}
      <div className="absolute inset-0 mesh-gradient opacity-60" />

      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-purple/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div
        ref={sectionRef}
        className="relative max-w-4xl mx-auto"
        style={sectionStyle}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className={`
              inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-400 mb-4
              transition-all duration-700
              ${motionSafe ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4') : 'opacity-100'}
            `}
            style={{ transitionDelay: '100ms' }}
          >
            <Calculator className="w-4 h-4" />
            Calculadora de ROI
          </div>
          <h2
            className={`
              font-display text-4xl lg:text-5xl font-black text-white tracking-tight mb-4
              transition-all duration-700
              ${motionSafe ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4') : 'opacity-100'}
            `}
            style={{ transitionDelay: '200ms' }}
          >
            Descubri cuanto{' '}
            <span className="gradient-brand-text">ahorraras</span>
          </h2>
          <p
            className={`
              text-lg text-white/60 max-w-xl mx-auto
              transition-all duration-700
              ${motionSafe ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4') : 'opacity-100'}
            `}
            style={{ transitionDelay: '300ms' }}
          >
            Ajusta los parametros segun tu negocio y ve el impacto potencial
          </p>
        </div>

        {/* Main calculator card with 3D tilt */}
        <div ref={cardRef} className="relative transition-transform duration-200 ease-out" style={{ transformStyle: 'preserve-3d' }}>
          <FloatingParticles />

          {/* Animated gradient border */}
          <div
            className="absolute -inset-[2px] rounded-2xl opacity-60"
            style={{
              background: 'linear-gradient(90deg, rgb(99, 102, 241), rgb(139, 92, 246), rgb(168, 85, 247), rgb(99, 102, 241))',
              backgroundSize: '300% 100%',
              animation: motionSafe ? 'gradient-shift 4s ease infinite' : 'none',
              filter: 'blur(2px)'
            }}
          />
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-40"
            style={{
              background: 'linear-gradient(90deg, rgb(99, 102, 241), rgb(139, 92, 246), rgb(168, 85, 247), rgb(99, 102, 241))',
              backgroundSize: '300% 100%',
              animation: motionSafe ? 'gradient-shift 4s ease infinite reverse' : 'none'
            }}
          />

          {/* Card content */}
          <div className="relative rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 overflow-hidden">
            {/* Top accent line with glow */}
            <div className="absolute top-0 inset-x-0 h-px">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-400 to-transparent blur-sm opacity-60" />
            </div>

            <div className="p-8 lg:p-12">
              {/* Sliders */}
              <div className="mb-10">
                {roiConfig.map((config, index) => (
                  <PremiumSlider
                    key={config.name}
                    value={values[config.name.includes('Horas') ? 'hours' : config.name.includes('Tarifa') ? 'rate' : 'days']}
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    onChange={(v) => handleValueChange(config.name.includes('Horas') ? 'hours' : config.name.includes('Tarifa') ? 'rate' : 'days', v)}
                    label={config.name}
                    unit={config.unit}
                    prefix={config.prefix}
                    description={config.description}
                    icon={config.icon}
                    index={index}
                  />
                ))}
              </div>

              {/* Results section */}
              <div className="relative">
                {/* Result glow background */}
                <div
                  className={`
                    absolute inset-0 rounded-2xl
                    bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-primary/10
                    blur-xl transition-opacity duration-500
                    ${resultKey > 0 ? 'opacity-100' : 'opacity-0'}
                  `}
                />
                <SparkleBurst active={showSparkle} />

                <div className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                  {/* Main result with chart */}
                  <div className="flex flex-col lg:flex-row items-center gap-8 mb-6">
                    {/* Left: Main value */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="text-[12px] uppercase tracking-widest text-white/40 mb-2">
                        Tu ahorro mensual estimado
                      </div>
                      <div
                        key={resultKey}
                        className={`
                          font-display text-5xl lg:text-6xl font-black
                          bg-gradient-to-r from-emerald-300 via-emerald-400 to-emerald-300
                          bg-clip-text text-transparent
                          transition-all duration-300 ease-out
                          ${resultKey > 0 ? 'scale-105' : 'scale-100'}
                        `}
                        style={{
                          textShadow: resultKey > 0 ? '0 0 80px rgba(34,197,94,0.6), 0 0 40px rgba(34,197,94,0.3)' : 'none',
                          filter: resultKey > 0 ? 'brightness(1.1)' : 'brightness(1)'
                        }}
                      >
                        {formatCurrency(monthlySavings)}
                      </div>
                      <div className="flex items-center justify-center lg:justify-start gap-2 mt-3">
                        <Zap className="w-4 h-4 text-amber-400 animate-pulse" />
                        <span className="text-sm text-white/70">+{efficiencyGain}% mas eficiente</span>
                      </div>
                    </div>

                    {/* Right: Circular chart */}
                    <div className="flex-shrink-0">
                      <ROICircularChart
                        percentage={efficiencyGain}
                        label="Eficiencia"
                        value={`${hoursSaved}h saved`}
                        delay={200}
                      />
                    </div>
                  </div>

                  {/* Before/After comparison */}
                  <div className="mb-6">
                    <div className="text-[10px] uppercase tracking-widest text-white/30 mb-3 text-center">
                      Comparacion del flujo de trabajo
                    </div>
                    <BeforeAfterCard
                      before={{
                        label: 'Horas administrativas/mes',
                        value: `${monthlyHours}h`,
                        color: 'text-red-400'
                      }}
                      after={{
                        label: 'Horas administrativas/mes',
                        value: `${newAdministrativeHours}h`,
                        color: 'text-emerald-400'
                      }}
                      isVisible={isVisible}
                      delay={400}
                    />
                  </div>

                  {/* Yearly projection */}
                  <div className="flex items-center justify-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="relative">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <div className="absolute inset-0 bg-emerald-400/30 blur-md rounded-full" />
                    </div>
                    <span className="text-sm text-white/70">Ahorro anual proyectado:</span>
                    <span className="font-display text-lg font-bold text-white tabular-nums">
                      <AnimatedNumber
                        value={yearlySavings}
                        prefix="$"
                        duration={600}
                      />
                    </span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div
                className={`
                  mt-8 flex flex-col sm:flex-row gap-4 justify-center
                  transition-all duration-700
                  ${motionSafe ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4') : 'opacity-100'}
                `}
                style={{ transitionDelay: '600ms' }}
              >
                <MagneticButton
                  variant="primary-dark"
                  size="lg"
                  glowColor="rgba(99, 102, 241, 0.6)"
                  className="flex-1 sm:flex-none"
                >
                  Comenzar ahora
                  <ArrowRight className="w-4 h-4 icon-hover-rotate" />
                </MagneticButton>
                <MagneticButton
                  variant="secondary-dark"
                  size="lg"
                  className="flex-1 sm:flex-none"
                >
                  Hablar con ventas
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div
          className={`
            flex flex-wrap items-center justify-center gap-6 mt-10 text-white/40 text-sm
            transition-all duration-700
            ${motionSafe ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4') : 'opacity-100'}
          `}
          style={{ transitionDelay: '700ms' }}
        >
          <div className="flex items-center gap-2 hover:text-white/60 transition-colors duration-300">
            <Clock className="w-4 h-4" />
            <span>Activacion en 7-14 dias</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 hover:text-white/60 transition-colors duration-300">
            <Users className="w-4 h-4" />
            <span>+500 negocios automatizados</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2 hover:text-white/60 transition-colors duration-300">
            <Sparkles className="w-4 h-4" />
            <span>Garantia de 30 dias</span>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes sparkle-burst {
          0% { transform: rotate(var(--rotation, 0deg)) translateY(0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--rotation, 0deg)) translateY(-60px) scale(0); opacity: 0; }
        }

        .tabular-nums { font-variant-numeric: tabular-nums; }
      `}</style>
    </section>
  )
}
