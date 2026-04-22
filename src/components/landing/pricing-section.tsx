'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Check, Zap, Shield, Headphones, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { useScrollReveal, useCounter, useReducedMotion, lerp, springInterpolate } from '@/hooks'

const features = [
  'WhatsApp automático (cuotas, turnos)',
  'Agenda de turnos / gestión de grupos',
  'Gestión de clientes y membresías',
  'Cobros online integrados',
  'Panel avanzado con métricas del mes',
  'Acceso multi-usuario con roles',
  'Registro de asistentes',
  'Tu marca, tu subdominio',
  'Soporte prioritario incluido',
]

const trustIndicators = [
  { icon: Shield, text: 'Pago seguro' },
  { icon: Headphones, text: 'Soporte dedicado' },
  { icon: Zap, text: 'Activación en 7-14 días' },
]

// Animated Checkmark component with SVG stroke animation
function AnimatedCheckmark({ delay = 0 }: { delay?: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.unobserve(element)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay])

  return (
    <svg
      ref={ref}
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        className="fill-gradient-to-br from-violet-500 to-indigo-500"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out'
        }}
      />
      <path
        d="M8 12l3 3 5-6"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 24,
          strokeDashoffset: isVisible ? 0 : 24,
          transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s'
        }}
      />
    </svg>
  )
}

// Price Counter component
function PriceCounter({ isAnnual = false }: { isAnnual?: boolean }) {
  // Symbolic price that conveys value without being a real quote
  const basePrice = isAnnual ? 49 : 59
  const { ref, count, isVisible } = useCounter({
    end: basePrice,
    duration: 1800,
    delay: 300,
    decimals: 0
  })

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className="font-display text-6xl lg:text-7xl font-black text-white tracking-tight tabular-nums">
      <span className="opacity-0 transition-opacity duration-300" style={{ opacity: isVisible ? 1 : 0 }}>
        ${Math.round(count)}
      </span>
      <span className="text-2xl text-zinc-400 ml-1">/mes</span>
    </div>
  )
}

// Guarantee Badge with pulse animation
function GuaranteeBadge() {
  const [isPulsing, setIsPulsing] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true)
      setTimeout(() => setIsPulsing(false), 1000)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
      <div className={`
        relative bg-gradient-to-r from-emerald-500/20 to-emerald-400/20 backdrop-blur-sm border border-emerald-500/30 rounded-full px-4 py-1.5
        ${isPulsing ? 'scale-105' : 'scale-100'}
        transition-transform duration-1000 ease-out
      `}>
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-md" />
        <span className="relative text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
          <Shield className="w-3 h-3" />
          Garantía de 30 días
        </span>
      </div>
    </div>
  )
}

// Popular Badge with premium pulse animation
function PopularBadge({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <div className="absolute -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <div className="relative group/badge">
        {/* Outer pulse ring - respects reduced motion */}
        {!reducedMotion && (
          <div className="absolute -inset-2 rounded-full animate-ping-slow opacity-40 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />
        )}

        {/* Animated background gradient */}
        <div
          className="absolute -inset-px rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400"
          style={{
            backgroundSize: '200% 100%',
            animation: reducedMotion ? 'none' : 'gradient-shift 2s ease infinite',
          }}
        />

        {/* Glow effect */}
        <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 blur-xl opacity-60 group-hover/badge:opacity-80 transition-opacity duration-300" />

        {/* Badge content */}
        <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-xl shadow-amber-500/30 flex items-center gap-2">
          <Zap className={`w-4 h-4 ${reducedMotion ? '' : 'animate-sparkle'}`} />
          <span className="relative">
            <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover/badge:scale-100 transition-transform duration-300" />
            Más elegido
          </span>
        </div>
      </div>
    </div>
  )
}

// 3D Card Hook with spring physics and mobile detection
function useCard3DTilt<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [tiltStyle, setTiltStyle] = useState({ transform: '', boxShadow: '' })
  const [parallaxStyle, setParallaxStyle] = useState({ transform: '' })

  // Detect touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }
    checkTouch()
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  // Disable 3D effects on touch devices or reduced motion
  const shouldAnimate = !isTouchDevice && !prefersReducedMotion

  useEffect(() => {
    if (!shouldAnimate) return

    let rafId: number
    let targetRotateX = 0
    let targetRotateY = 0
    let currentRotateX = 0
    let currentRotateY = 0
    let targetTranslateX = 0
    let targetTranslateY = 0
    let currentTranslateX = 0
    let currentTranslateY = 0
    let velocityX = 0
    let velocityY = 0

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      // Calculate rotation based on mouse position
      targetRotateY = (e.clientX - centerX) / 15
      targetRotateX = -(e.clientY - centerY) / 15

      // Calculate parallax offset for content (subtle shift)
      targetTranslateX = (e.clientX - centerX) / 50
      targetTranslateY = (e.clientY - centerY) / 50
    }

    const handleMouseEnter = () => setIsHovering(true)

    const handleMouseLeave = () => {
      setIsHovering(false)
      targetRotateX = 0
      targetRotateY = 0
      targetTranslateX = 0
      targetTranslateY = 0
    }

    const animate = () => {
      // Spring physics for tilt
      const rotResult = springInterpolate(currentRotateX, targetRotateX, velocityX)
      currentRotateX = rotResult.value
      velocityX = rotResult.velocity

      const rotYResult = springInterpolate(currentRotateY, targetRotateY, velocityY)
      currentRotateY = rotYResult.value
      velocityY = rotYResult.velocity

      // Smooth lerp for parallax
      currentTranslateX = lerp(currentTranslateX, targetTranslateX, 0.08)
      currentTranslateY = lerp(currentTranslateY, targetTranslateY, 0.08)

      const scale = isHovering ? 1.02 : 1

      setTiltStyle({
        transform: `perspective(1000px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) scale(${scale})`,
        boxShadow: isHovering
          ? `
            0 25px 50px -12px rgba(139, 92, 246, 0.4),
            0 0 80px -15px rgba(139, 92, 246, 0.6),
            0 0 120px -20px rgba(99, 102, 241, 0.4)
          `
          : ''
      })

      setParallaxStyle({
        transform: `translate(${currentTranslateX}px, ${currentTranslateY}px)`,
      })

      // Continue animation if not settled
      if (
        Math.abs(targetRotateX - currentRotateX) > 0.001 ||
        Math.abs(targetRotateY - currentRotateY) > 0.001 ||
        isHovering
      ) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const card = ref.current
    if (card) {
      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)
      card.addEventListener('mousemove', handleMouseMove)

      rafId = requestAnimationFrame(animate)
    }

    return () => {
      if (card) {
        card.removeEventListener('mouseenter', handleMouseEnter)
        card.removeEventListener('mouseleave', handleMouseLeave)
        card.removeEventListener('mousemove', handleMouseMove)
      }
      cancelAnimationFrame(rafId)
    }
  }, [shouldAnimate, isHovering])

  return {
    ref,
    isHovering,
    tiltStyle: shouldAnimate ? tiltStyle : { transform: '', boxShadow: '' },
    parallaxStyle: shouldAnimate ? parallaxStyle : { transform: '' },
    isTouchDevice
  }
}

export function PricingSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 })
  const prefersReducedMotion = useReducedMotion()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAnnual, setIsAnnual] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [glowPhase, setGlowPhase] = useState(0)
  const [featureVisible, setFeatureVisible] = useState<boolean[]>(() =>
    prefersReducedMotion ? features.map(() => true) : features.map(() => false)
  )

  const {
    ref: cardRef,
    isHovering,
    tiltStyle,
    parallaxStyle,
    isTouchDevice
  } = useCard3DTilt<HTMLDivElement>()

  // Animate glow border continuously - skip if reduced motion
  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return
    let animationFrame: number
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      setGlowPhase((elapsed % 4000) / 4000)
      animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [isVisible, prefersReducedMotion])

  // Stagger feature visibility on mount
  useEffect(() => {
    if (prefersReducedMotion) return // Already initialized correctly
    const timers = features.map((_, i) =>
      setTimeout(() => {
        setFeatureVisible(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, 400 + i * 60)
    )
    return () => timers.forEach(clearTimeout)
  }, [prefersReducedMotion])

  // Track mouse for spotlight effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [cardRef])

  const handleButtonClick = () => {
    setIsLoading(true)
    // Simulate brief loading state for conversion feel
    setTimeout(() => setIsLoading(false), 1500)
  }

  // Calculate glow border gradient position
  const glowOffset = Math.sin(glowPhase * Math.PI * 2) * 20

  return (
    <section id="pricing" className="relative section-spacing px-6 lg:px-12 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[var(--color-bg-base)]" />

      {/* Mesh gradient backgrounds */}
      <div className="mesh-gradient opacity-70" />
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[128px] pointer-events-none" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <div
        ref={sectionRef}
        className={`relative max-w-xl lg:max-w-3xl mx-auto transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-violet-400 mb-4">
            <Sparkles className="w-4 h-4" />
            Precios
          </span>
          <h2 className="font-display text-5xl lg:text-6xl font-black text-white tracking-tight">
            Tu app, a tu medida
          </h2>
          <p className="text-lg text-zinc-400 mt-5 max-w-xl mx-auto">
            Cada proyecto es único. Cotizamos según tus necesidades específicas.
          </p>

          {/* Period Toggle - WCAG 2.5.8: 44x44px minimum touch target */}
          <div className="mt-8 inline-flex items-center gap-4 bg-zinc-900/80 backdrop-blur-sm rounded-full p-1.5 border border-white/10" role="group" aria-label="Seleccionar periodo de facturacion">
            <button
              onClick={() => setIsAnnual(false)}
              aria-pressed={!isAnnual}
              className={`
                px-5 py-3 min-h-11 min-w-11 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                ${!isAnnual
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                  : 'text-zinc-400 hover:text-white'
                }
              `}
            >
              Mensual
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              aria-pressed={isAnnual}
              className={`
                px-5 py-3 min-h-11 min-w-11 rounded-full text-sm font-medium transition-all duration-300 ease-out flex items-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
                ${isAnnual
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                  : 'text-zinc-400 hover:text-white'
                }
              `}
            >
              Anual
              <span className={`text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full ${isAnnual && !prefersReducedMotion ? 'animate-pulse' : ''}`}>
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Glass card with animated gradient border */}
        <div
          ref={cardRef}
          className={`relative group spotlight-container ${isTouchDevice ? '' : 'transition-transform duration-300 ease-out'}`}
          style={tiltStyle}
        >
          {/* Animated glow border */}
          <div
            className="absolute -inset-[2px] rounded-2xl opacity-60"
            style={{
              background: `linear-gradient(${90 + glowOffset}deg,
                rgb(139, 92, 246) 0%,
                rgb(99, 102, 241) 25%,
                rgb(139, 92, 246) 50%,
                rgb(99, 102, 241) 75%,
                rgb(139, 92, 246) 100%)`,
              backgroundSize: '200% 100%',
              animation: 'gradient-shift 3s ease infinite',
              filter: `blur(1px)`
            }}
          />
          <div
            className="absolute -inset-[2px] rounded-2xl opacity-40 blur-sm"
            style={{
              background: `linear-gradient(${90 + glowOffset}deg,
                rgb(139, 92, 246) 0%,
                rgb(99, 102, 241) 50%,
                rgb(139, 92, 246) 100%)`
            }}
          />
          {/* Extra glow layer for that premium feel */}
          <div
            className="absolute -inset-[6px] rounded-2xl opacity-20 blur-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-violet-600"
            style={{
              animation: `pulse-glow 2s ease-in-out infinite`
            }}
          />
          {/* Outer ambient glow */}
          <div
            className={`absolute -inset-12 rounded-3xl transition-opacity duration-1000 pointer-events-none ${isHovering ? 'opacity-60' : 'opacity-20'}`}
            style={{
              background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.1) 40%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Spotlight effect that follows cursor */}
          <div
            className="spotlight transition-opacity duration-300"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              opacity: isHovering ? 1 : 0,
            }}
          />

          {/* Glass card with enhanced lift */}
          <div
            className="relative rounded-xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 overflow-visible transition-all duration-500 focus-within:ring-2 focus-within:ring-violet-400/50 focus-within:ring-offset-2 focus-within:ring-offset-zinc-900"
            style={{
              boxShadow: isHovering
                ? 'var(--shadow-violet-glow), 0 0 80px rgba(139, 92, 246, 0.15)'
                : '0 20px 50px -10px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.08)'
            }}
          >
            {/* Spotlight gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none" />

            {/* Animated sparkles */}
            <div className="absolute top-12 right-12 w-2 h-2 rounded-full bg-white/20 sparkle opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-24 right-20 w-1.5 h-1.5 rounded-full bg-violet-400/30 sparkle sparkle-delay-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-20 right-16 w-1 h-1 rounded-full bg-indigo-400/30 sparkle sparkle-delay-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content with parallax effect */}
            <div className="relative p-8 lg:p-12" style={parallaxStyle}>
              {/* Popular Badge */}
              <PopularBadge reducedMotion={prefersReducedMotion} />

              {/* Pricing header */}
              <div className="text-center mb-10 pt-6">
                <div className="text-sm uppercase tracking-widest text-zinc-500 mb-3">
                  App Completa
                </div>
                <PriceCounter isAnnual={isAnnual} />
                <div className="text-zinc-500 mt-4 max-w-sm mx-auto">
                  Presupuesto personalizado según tu operación
                </div>
                {isAnnual && (
                  <div className="mt-2 text-sm text-emerald-400 font-medium animate-pulse">
                    Ahorra $120 al año
                  </div>
                )}
              </div>

              {/* Features list */}
              <ul className="space-y-4 mb-10">
                {features.map((item, i) => (
                  <li
                    key={i}
                    className="relative flex items-start gap-4 group/feature pl-4 -ml-4
                      border-l-2 border-transparent
                      hover:border-violet-500/50"
                    style={{
                      opacity: featureVisible[i] ? 1 : 0,
                      transform: featureVisible[i] ? 'translateX(0)' : 'translateX(-12px)',
                      transition: `opacity 0.4s ease-out ${i * 60}ms, transform 0.4s ease-out ${i * 60}ms, border-color 0.3s ease-out, background-color 0.3s ease-out`,
                    }}
                  >
                    <div className="flex-shrink-0 mt-0.5 group-hover/feature:scale-110 transition-transform duration-300 ease-out">
                      <AnimatedCheckmark delay={i * 80 + 200} />
                    </div>
                    <span className="text-zinc-400 group-hover/feature:text-zinc-300 transition-colors duration-300">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <div className="mt-12">
                <MagneticButton
                  variant="primary-dark"
                  size="lg"
                  className="w-full cursor-pointer"
                  glowColor="rgba(139, 92, 246, 0.6)"
                  onClick={handleButtonClick}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      Solicitar cotización
                      <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </MagneticButton>
              </div>

              {/* Guarantee Badge */}
              <GuaranteeBadge />
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-6 mt-16 flex-wrap">
          {trustIndicators.map((indicator, i) => {
            const Icon = indicator.icon
            return (
              <div
                key={i}
                className="group relative flex items-center gap-3 px-5 py-3 rounded-xl
                  bg-white/[0.03] border border-white/[0.06]
                  hover:border-violet-500/30 hover:bg-white/[0.06]
                  cursor-default
                  trust-badge"
                style={{
                  transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
                  opacity: isVisible ? 1 : 0,
                  transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${300 + i * 120}ms, opacity 0.6s ease-out ${300 + i * 120}ms, border-color 0.3s ease-out, background-color 0.3s ease-out`,
                }}
              >
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                    filter: 'blur(8px)'
                  }}
                />
                {/* Icon */}
                <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-indigo-500/20 group-hover:from-violet-500/30 group-hover:to-indigo-500/30 transition-all duration-300 ease-out">
                  <Icon className="w-4 h-4 text-violet-400 group-hover:text-violet-300 transition-colors duration-300 ease-out" />
                </div>
                <span className="relative text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300 ease-out">{indicator.text}</span>
                {/* Subtle shine sweep */}
                <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className={`absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 ${prefersReducedMotion ? '' : 'group-hover:animate-shimmer-sweep'}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.02);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes ping-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.2;
            transform: scale(1.1);
          }
        }

        @keyframes sparkle-icon {
          0%, 100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          25% {
            opacity: 0.8;
            transform: scale(1.1) rotate(-5deg);
          }
          50% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          75% {
            opacity: 0.8;
            transform: scale(1.1) rotate(5deg);
          }
        }

        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .sparkle-delay-1 {
          animation-delay: 0.5s;
        }

        .sparkle-delay-2 {
          animation-delay: 1s;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-sparkle {
          animation: sparkle-icon 1.5s ease-in-out infinite;
        }

        /* Respect reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }

          .sparkle,
          .animate-ping-slow,
          .animate-sparkle {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  )
}
