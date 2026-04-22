'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { X, Zap, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion, springInterpolate } from '@/hooks'

const STORAGE_KEY = 'maatwork-announcement-closed'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calculateTimeLeft(): TimeLeft {
  const launchDate = new Date()
  launchDate.setDate(launchDate.getDate() + 7)
  launchDate.setHours(23, 59, 59, 999)

  const difference = launchDate.getTime() - Date.now()

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  }
}

function CountdownTimer({ className }: { className?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  return (
    <div className={cn('flex items-center gap-1 text-sm', className)}>
      {[
        { val: timeLeft.days, label: 'd' },
        { val: timeLeft.hours, label: 'h' },
        { val: timeLeft.minutes, label: 'm' },
        { val: timeLeft.seconds, label: 's' },
      ].map(({ val, label }) => (
        <div key={label} className="flex items-center gap-1">
          <span className="relative">
            <span className={cn(
              'absolute inset-0 rounded blur-sm',
              reducedMotion ? 'bg-amber-500/10' : 'bg-amber-500/20 animate-[pulse-glow_2s_ease-in-out_infinite]'
            )} />
            <span className="relative bg-gradient-to-b from-amber-500/90 to-amber-600/90 px-2 py-0.5 rounded font-mono font-bold text-white shadow-lg shadow-amber-500/30">
              {formatNumber(val)}
            </span>
          </span>
          <span className="text-amber-300/70 text-xs">{label}</span>
        </div>
      ))}
    </div>
  )
}

export function AnnouncementBanner() {
  const reducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem(STORAGE_KEY)
    }
    return true
  })
  const [isAnimating] = useState(true)
  const [isReduced, setIsReduced] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const bannerRef = useRef<HTMLDivElement>(null)
  const currentGlow = useRef({ x: 0.5, y: 0.5 })
  const targetGlow = useRef({ x: 0.5, y: 0.5 })
  const velocityGlow = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsReduced(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Mouse tracking for glow effect
  useEffect(() => {
    if (reducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      targetGlow.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const animate = () => {
      const { value: newX, velocity: newVelX } = springInterpolate(
        currentGlow.current.x,
        targetGlow.current.x,
        velocityGlow.current.x,
        40,
        12
      )
      const { value: newY, velocity: newVelY } = springInterpolate(
        currentGlow.current.y,
        targetGlow.current.y,
        velocityGlow.current.y,
        40,
        12
      )

      currentGlow.current.x = newX
      currentGlow.current.y = newY
      velocityGlow.current.x = newVelX
      velocityGlow.current.y = newVelY

      setMousePos({ x: currentGlow.current.x, y: currentGlow.current.y })
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [reducedMotion])

  const handleClose = useCallback(() => {
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem(STORAGE_KEY, 'true')
    }, 300)
  }, [])

  if (!isVisible) {
    return null
  }

  const animateClass = reducedMotion
    ? ''
    : isAnimating
      ? 'translate-y-0 opacity-100'
      : '-translate-y-full opacity-0'

  return (
    <div
      ref={bannerRef}
      className={cn(
        'relative overflow-hidden transition-all duration-500 ease-out',
        animateClass,
        isReduced ? 'py-2' : 'py-3 sm:py-4'
      )}
    >
      {/* Layered gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950"
        aria-hidden="true"
      />

      {/* Animated mesh gradient layers */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 100% at 20% 50%, rgba(139, 92, 246, 0.25) 0%, transparent 50%)',
          animation: reducedMotion ? 'none' : 'mesh-drift-1 15s ease-in-out infinite'
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background: 'radial-gradient(ellipse 70% 90% at 80% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
          animation: reducedMotion ? 'none' : 'mesh-drift-2 20s ease-in-out infinite'
        }}
        aria-hidden="true"
      />

      {/* Shimmer sweep */}
      {!reducedMotion && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-shimmer-sweep" />
        </div>
      )}

      {/* Interactive glow following mouse */}
      {!reducedMotion && (
        <div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            left: `${mousePos.x * 100}%`,
            top: `${mousePos.y * 100}%`,
            transform: 'translate(-50%, -50%)',
            transition: 'none'
          }}
          aria-hidden="true"
        />
      )}

      {/* Ambient orbs */}
      <div
        className={cn(
          'absolute -top-20 -left-20 w-48 h-48 bg-purple-500/25 rounded-full blur-[64px]',
          reducedMotion ? '' : 'animate-[float-orb_8s_ease-in-out_infinite]'
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          'absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/25 rounded-full blur-[64px]',
          reducedMotion ? '' : 'animate-[float-orb_10s_ease-in-out_infinite_reverse]'
        )}
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />

      {/* Top border glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />

      {/* Content */}
      <div className="relative px-4">
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            'flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4',
            isReduced && 'flex-row gap-3'
          )}>
            {/* Premium badge with glow */}
            <div
              className={cn(
                'relative flex items-center gap-2 flex-shrink-0',
                'px-3 py-1 rounded-full',
                'bg-gradient-to-r from-amber-500/25 to-orange-500/25',
                'backdrop-blur-sm border border-amber-500/40',
                'transition-all duration-300',
                'group cursor-pointer',
                reducedMotion ? '' : 'hover:from-amber-500/40 hover:to-orange-500/40 hover:border-amber-500/70 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)]'
              )}
            >
              {/* Badge icon */}
              <span className={cn(
                'relative flex items-center justify-center w-5 h-5',
                'rounded-full bg-gradient-to-br from-amber-400 to-orange-500',
                'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
                reducedMotion ? '' : 'group-hover:scale-110 transition-transform duration-300'
              )}>
                <Zap className="w-3 h-3 text-white" />
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                <Sparkles className="w-3 h-3" />
                Beta
              </span>
            </div>

            {/* Main text */}
            {!isReduced && (
              <p className="text-white text-center text-sm font-medium">
                Primeras 5 apps con precio especial de lanzamiento —{' '}
                <span className="text-amber-300 font-semibold">cupos limitados</span>
              </p>
            )}

            {/* Reduced text */}
            {isReduced && (
              <p className="text-white text-sm font-medium">
                <span className="text-amber-300 font-semibold">5</span> cupos restantes
              </p>
            )}

            {/* Countdown timer */}
            {!isReduced && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-white/60">Termina en:</span>
                <CountdownTimer />
              </div>
            )}

            {/* CTA Button with premium effects */}
            <a
              href="#pricing"
              aria-label="Reservar tu lugar con precio de lanzamiento"
              className={cn(
                'flex-shrink-0 relative inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full',
                'bg-gradient-to-r from-amber-500 to-orange-500',
                'text-white text-sm font-bold',
                'shadow-[0_4px_16px_rgba(245,158,11,0.35)]',
                reducedMotion ? '' : 'hover:shadow-[0_6px_24px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95',
                'transition-all duration-200'
              )}
            >
              {!reducedMotion && (
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 animate-[pulse-glow_2s_ease-in-out_infinite]" />
              )}
              <span className="relative">Reservar</span>
              <span aria-hidden="true">→</span>
            </a>

            {/* Close button */}
            <button
              onClick={handleClose}
              className={cn(
                'p-1.5 rounded-full',
                'text-white/60 hover:text-white',
                'hover:bg-white/10',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50'
              )}
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile countdown */}
          {isReduced && (
            <div className="flex md:hidden items-center justify-center gap-2 mt-1">
              <CountdownTimer className="text-xs" />
            </div>
          )}
        </div>
      </div>

      {/* Tailwind-animated version - uses CSS custom animations */}
      <style>{`
        @keyframes shimmer-sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }

        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10px, -15px) scale(1.05); }
          66% { transform: translate(-5px, 10px) scale(0.95); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        @keyframes mesh-drift-1 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(30px); }
        }

        @keyframes mesh-drift-2 {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-20px); }
        }

        .animate-shimmer-sweep {
          animation: shimmer-sweep 4s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .animate-\\[pulse-glow_2s_ease-in-out_infinite\\] {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
