'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { AnimatedStat } from '@/components/ui/animated-stats'
import dynamic from 'next/dynamic'
import {
  useReducedMotion,
  useParallax,
  springInterpolate
} from '@/hooks'

// Spring easing function for elegant animations
const springEasing = [0.33, 1, 0.68, 1] as const // Custom spring-like bezier

// Animation duration constants (ms)
const DURATION_REVEAL = 800

// Deferred 3D canvas - loads after initial page paint for better LCP
const ParticlesCanvas = dynamic(
  () => import('@/components/three/particles-canvas').then((mod) => mod.ParticlesCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 overflow-hidden" aria-label="Cargando fondo 3D..." role="status">
        {/* Animated gradient background as fallback while loading */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#04040e] via-[#0a0a1a] to-[#04040e]">
          <div className="absolute w-96 h-96 rounded-full opacity-10"
            style={{
              top: '10%',
              left: '20%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.5) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'particle-fallback-pulse 4s ease-in-out infinite',
            }}
          />
          <div className="absolute w-80 h-80 rounded-full opacity-8"
            style={{
              top: '40%',
              right: '15%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'particle-fallback-pulse 4s ease-in-out infinite 1.5s',
            }}
          />
        </div>
      </div>
    )
  }
)

// Deferred 3D Hero scene with floating badge and torus knot
const Hero3DScene = dynamic(
  () => import('@/components/three/floating-brand-badge').then((mod) => mod.Hero3DScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 pointer-events-none" aria-label="Cargando escena 3D..." role="status">
        {/* Premium glassmorphic shimmer skeleton */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Badge skeleton with shimmer effect */}
          <div className="relative w-[200px] h-[80px]">
            {/* Background gradient */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1a2e]/60 via-[#0f0a1e]/80 to-[#1a1a2e]/60 border border-white/10 backdrop-blur-md"
              style={{ boxShadow: '0 0 60px rgba(99, 102, 241, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)' }}
            />

            {/* Animated shimmer sweep */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer-sweep" />
            </div>

            {/* Glow border animation */}
            <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-br from-primary/30 via-primary/10 to-accent-purple/20 opacity-60 animate-pulse" />

            {/* Text placeholders */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-24 h-4 rounded-lg bg-white/15 animate-pulse" />
              <div className="w-16 h-2.5 rounded-full bg-primary/30 animate-pulse delay-150" />
            </div>

            {/* Ambient glow */}
            <div className="absolute inset-[-30px] rounded-3xl bg-gradient-to-br from-primary/8 via-transparent to-accent-purple/8 blur-2xl opacity-50 animate-pulse delay-300" />
          </div>
        </div>

        {/* Floating particle hints around the badge */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/50 animate-pulse"
              style={{
                top: `${35 + (i * 8) % 30}%`,
                left: `${30 + (i * 12) % 40}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${2 + (i % 2)}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

// Deferred 3D phone mockup
const PhoneMockup = dynamic(
  () => import('@/components/three/phone-mockup').then((mod) => mod.PhoneMockup),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-[180px] h-[360px]" aria-label="Cargando mockup..." role="status">
        {/* Dark glassmorphic skeleton background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a] via-[#1a1a2e] to-[#0f0a1e] rounded-3xl" />

        {/* Phone body skeleton */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[140px] h-[280px] rounded-[32px] bg-gradient-to-br from-[#1a1a2e]/80 to-[#0d0d1a]/80 border border-white/5">
            {/* Notch skeleton */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-2 rounded-full bg-white/5 animate-pulse" />

            {/* Screen skeleton with shimmer */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[120px] h-[230px] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#050510] via-[#0a0a15] to-[#050510]" />
              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer-sweep" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

// ======================
// Animated Mesh Gradient Background
// ======================
function AnimatedMeshGradient() {
  const meshRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const targetPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const animationRef = useRef<number | null>(null)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Normalize to percentage (0-100)
    targetPos.current = {
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    }
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    const animate = () => {
      // Spring physics for smooth following
      const { value: newX, velocity: newVelX } = springInterpolate(
        currentPos.current.x,
        targetPos.current.x,
        velocity.current.x,
        40,  // stiffness - lower for smoother, slower response
        12,  // damping
        1    // mass
      )
      const { value: newY, velocity: newVelY } = springInterpolate(
        currentPos.current.y,
        targetPos.current.y,
        velocity.current.y,
        40,
        12,
        1
      )

      currentPos.current.x = newX
      currentPos.current.y = newY
      velocity.current.x = newVelX
      velocity.current.y = newVelY

      if (meshRef.current) {
        const offsetX = (currentPos.current.x - 50) * 0.4
        const offsetY = (currentPos.current.y - 50) * 0.3
        meshRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`
      }

      setMousePos({ x: currentPos.current.x, y: currentPos.current.y })

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [handleMouseMove, reducedMotion])

  return (
    <div
      ref={meshRef}
      className="absolute inset-0 overflow-hidden"
      style={{ transition: reducedMotion ? 'none' : 'transform 0.15s ease-out' }}
      aria-hidden="true"
    >
      {/* Layer 1: Deep violet base */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 30% 20%, rgba(var(--color-primary-rgb), 0.55) 0%, transparent 55%)',
          animation: reducedMotion ? 'none' : 'mesh-drift-1 20s ease-in-out infinite'
        }}
      />

      {/* Layer 2: Purple accent */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 70% 60%, rgba(var(--color-primary-rgb), 0.5) 0%, transparent 50%)',
          animation: reducedMotion ? 'none' : 'mesh-drift-2 25s ease-in-out infinite'
        }}
      />

      {/* Layer 3: Pink tinge for depth */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 80% 80%, rgba(236, 72, 153, 0.35) 0%, transparent 50%)',
          animation: reducedMotion ? 'none' : 'mesh-drift-1 30s ease-in-out infinite reverse'
        }}
      />
    </div>
  )
}

// ======================
// Geometric Floating Shapes
// ======================
function GeometricShapes() {
  const reducedMotion = useReducedMotion()

  const floatAnimations = ['float-a', 'float-b', 'float-c']

  const shapes = [
    { type: 'triangle', size: 28, x: 10, y: 15, delay: 0, duration: 12, opacity: 0.18 },
    { type: 'diamond', size: 20, x: 85, y: 20, delay: -3, duration: 15, opacity: 0.14 },
    { type: 'triangle', size: 22, x: 75, y: 70, delay: -6, duration: 18, opacity: 0.12 },
    { type: 'diamond', size: 24, x: 15, y: 75, delay: -9, duration: 14, opacity: 0.14 },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {shapes.map((shape, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            animation: reducedMotion ? 'none' : `${floatAnimations[i % 3]} ${shape.duration}s ease-in-out ${shape.delay}s infinite`,
            opacity: shape.opacity,
            transition: reducedMotion ? 'opacity 0.3s ease' : 'none'
          }}
        >
          {shape.type === 'triangle' ? (
            <svg
              width={shape.size}
              height={shape.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{ filter: 'blur(0.5px)' }}
            >
              <path
                d="M12 2L2 22h20L12 2z"
                fill="url(#grad-primary)"
                stroke="rgba(139, 92, 246, 0.3)"
                strokeWidth="0.5"
              />
              <defs>
                <linearGradient id="grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
          ) : (
            <svg
              width={shape.size}
              height={shape.size}
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter: 'blur(0.5px)',
                animation: reducedMotion ? 'none' : `rotate ${shape.duration * 0.5}s linear infinite`
              }}
            >
              <path
                d="M12 2L22 12L12 22L2 12L12 2z"
                fill="url(#grad-purple)"
                stroke="rgba(99, 102, 241, 0.3)"
                strokeWidth="0.5"
              />
              <defs>
                <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>
      ))}
    </div>
  )
}

// ======================
// Typing Effect Component
// ======================
function TypingEffect({
  text,
  className,
  delay = 0,
  typingSpeed = 50
}: {
  text: string
  className?: string
  delay?: number
  typingSpeed?: number
}) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [isTyping, setIsTyping] = useState(true)
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return

    const timeout = setTimeout(() => {
      if (reducedMotion) {
        // Skip typing animation for reduced motion - show full text
        setDisplayed(text)
        setIsTyping(false)
        return
      }

      let current = 0
      const interval = setInterval(() => {
        if (current <= text.length) {
          setDisplayed(text.slice(0, current))
          current++
        } else {
          clearInterval(interval)
          setIsTyping(false)
        }
      }, typingSpeed)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [started, text, delay, typingSpeed, reducedMotion])

  return (
    <span ref={ref} className={className}>
      {displayed}
      {isTyping && <span className={reducedMotion ? 'opacity-0' : 'animate-pulse'}>|</span>}
    </span>
  )
}

// ======================
// Shimmer Effect Component
// ======================
function ShimmerText({ children, className }: { children: React.ReactNode, className?: string }) {
  const reducedMotion = useReducedMotion()
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      {!reducedMotion && (
        <span
          className="absolute inset-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            className="absolute top-0 left-0 w-1/3 h-full shimmer-sweep"
          />
        </span>
      )}
    </span>
  )
}

// ======================
// Floating Notification Badge
// ======================
function FloatingBadge({
  children,
  className,
  position
}: {
  children: React.ReactNode
  className?: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}) {
  const { ref, offset } = useParallax<HTMLDivElement>({ speed: 0.15 })

  const positionClasses = {
    'top-left': '-top-4 -left-4',
    'top-right': '-top-4 -right-4',
    'bottom-left': '-bottom-4 -left-4',
    'bottom-right': '-bottom-4 -right-4'
  }

  return (
    <div
      ref={ref}
      className={`absolute glass-premium rounded-xl px-4 py-2 text-sm font-medium text-white shadow-glow-violet badge-float ${positionClasses[position]} ${className || ''}`}
      style={{
        transform: `translateY(${offset}px)`,
        border: '1px solid rgba(139, 92, 246, 0.4)',
        boxShadow: `
          0 0 20px rgba(139, 92, 246, 0.15),
          0 4px 16px rgba(0, 0, 0, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 0 20px rgba(139, 92, 246, 0.05)
        `,
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.8) 0%, rgba(15, 10, 35, 0.9) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Animated border glow */}
      <div
        className="absolute inset-0 rounded-xl animate-border-glow-pulse"
        style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, transparent 50%, rgba(99, 102, 241, 0.2) 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 3s ease infinite',
        }}
      />
      {/* Inner highlight */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }}
      />
      {children}
    </div>
  )
}

// ======================
// Parallax Depth Layer
// ======================
function ParallaxLayer({
  children,
  depth = 0.5,
  className
}: {
  children: React.ReactNode
  depth?: number
  className?: string
}) {
  const { ref, offset } = useParallax<HTMLDivElement>({ speed: depth })

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  )
}

// ======================
// Glow Ring Effect
// ======================
function GlowRing({ size = 300, color = '#6366f1', opacity = 0.15, pulse = true }: {
  size?: number
  color?: string
  opacity?: number
  pulse?: boolean
}) {
  const reducedMotion = useReducedMotion()

  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color} ${opacity * 100}%, transparent 70%)`,
        filter: 'blur(40px)',
        animation: pulse && !reducedMotion ? 'pulse-glow 4s ease-in-out infinite' : 'none',
        opacity: reducedMotion ? opacity * 0.6 : 1,
        transition: 'opacity 0.4s ease'
      }}
    />
  )
}

// ======================
// Entry Animation Helper
// ======================
function getEntryStyle(visible: boolean, reducedMotion: boolean, index: number) {
  if (reducedMotion) {
    return {
      opacity: 1,
      transform: 'translateY(0) scale(1)'
    }
  }

  const delays = [
    0,    // badge
    100,  // headline line 1
    200,  // headline line 2
    300,  // headline line 3
    400,  // subtitle
    500,  // CTA
    600,  // stats
  ]

  const delay = delays[index] || index * 100

  return {
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translateY(0) scale(1)'
      : 'translateY(24px) scale(0.96)',
    transition: `opacity ${DURATION_REVEAL}ms cubic-bezier(${springEasing.join(',')}) ${delay}ms,
                 transform ${DURATION_REVEAL}ms cubic-bezier(${springEasing.join(',')}) ${delay}ms`
  }
}

// ======================
// Main Hero Section
// ======================
export function HeroSection() {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection-based visibility for entry animations
  useEffect(() => {
    const element = containerRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Memoize entry style calculation
  const getStyle = useCallback((index: number) => {
    return getEntryStyle(visible, reducedMotion, index)
  }, [visible, reducedMotion])

  return (
    <section
      ref={containerRef}
      className="relative h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg-base)' }}
    >
      {/* 3D Particles Background */}
      <ParticlesCanvas />

      {/* 3D Hero Scene - floating badge and torus knot */}
      <Hero3DScene />

      {/* Animated Mesh Gradient */}
      <AnimatedMeshGradient />

      {/* Geometric Floating Shapes */}
      <GeometricShapes />

      {/* Grid overlay */}
      <div className="grid-overlay" aria-hidden="true" />

      {/* Glowing blobs with parallax */}
      <ParallaxLayer depth={0.3} className="glow-blob glow-blob-primary" aria-hidden="true">
        <div />
      </ParallaxLayer>
      <ParallaxLayer depth={0.5} className="glow-blob glow-blob-purple" aria-hidden="true">
        <div />
      </ParallaxLayer>

      {/* Single enhanced glow ring for depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <GlowRing size={700} color="#6366f1" opacity={0.18} pulse={!reducedMotion} />
      </div>

      {/* Hero gradient background */}
      <div className="hero-gradient-bg absolute inset-0" aria-hidden="true" />

      {/* Radial gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 0%, var(--color-bg-base) 70%)',
        }}
        aria-hidden="true"
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-12 py-20 lg:py-32">
        <div className="grid lg:grid-cols-[1fr,1.1fr] gap-16 lg:gap-20 items-center">
          {/* Left: Content */}
          <div>
            {/* Badge - staggered item 0 */}
            <div
              className="mb-8"
              style={getStyle(0)}
            >
              <span className="badge badge-primary">
                <span className={`w-1.5 h-1.5 rounded-full bg-primary ${reducedMotion ? '' : 'animate-pulse-glow'}`} />
                Apps para negocios argentinos
              </span>
            </div>

            {/* Headline with typing effect and shimmer - staggered items 1-3 */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.02] mb-6 tracking-tight">
              <span className="text-white block" style={getStyle(1)}>
                <TypingEffect text="Deja de perder tiempo" delay={reducedMotion ? 0 : 100} typingSpeed={60} />
              </span>
              <br />
              <span className="gradient-brand-text block" style={getStyle(2)}>
                <ShimmerText>
                  <TypingEffect text="automatizando tu local." delay={reducedMotion ? 0 : 300} typingSpeed={55} />
                </ShimmerText>
              </span>
              <br />
              <span className="text-white block" style={getStyle(3)}>
                <TypingEffect text="Hoy." delay={reducedMotion ? 0 : 500} typingSpeed={80} />
              </span>
            </h1>

            {/* Subtitle - staggered item 4 */}
            <p
              className="text-lg lg:text-xl text-dim max-w-lg mb-10 leading-relaxed"
              style={getStyle(4)}
            >
              La única plataforma que desarrolla tu app personalizada en 7-14 días.
              Clientes, cobros, turnos y WhatsApp automático — sin que vos hagas nada.
            </p>

            {/* CTA buttons - staggered item 5 */}
            <div
              className="flex flex-wrap gap-4 mb-14 relative"
              style={getStyle(5)}
            >
              {/* Floating badges */}
              <FloatingBadge position="top-right" className="z-20 hidden md:block">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  4.9★ Rating
                </span>
              </FloatingBadge>

              <FloatingBadge position="bottom-left" className="z-20 hidden md:block">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  500+ Apps
                </span>
              </FloatingBadge>

              <MagneticButton
                variant="primary-dark"
                size="lg"
                glowColor="rgba(99, 102, 241, 0.6)"
                className="cursor-pointer"
              >
                Proba gratis 7 dias
                <svg className="w-4 h-4 icon-hover-rotate" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </MagneticButton>
              <MagneticButton
                variant="secondary-dark"
                size="lg"
                className="cursor-pointer"
              >
                Sin tarjeta · Sin compromiso
              </MagneticButton>
            </div>

            {/* Stats - staggered item 6 */}
            <div className="flex flex-wrap gap-10 lg:gap-14" style={getStyle(6)}>
              <AnimatedStat
                value={14}
                label="Dias para tu app"
                suffix="-"
                duration={1800}
                delay={reducedMotion ? 0 : 200}
                size="lg"
              />
              <AnimatedStat
                value={3}
                label="Rubros activos"
                suffix="+"
                duration={1500}
                delay={reducedMotion ? 0 : 400}
                size="lg"
              />
              <div>
                <div className="font-display text-4xl lg:text-5xl font-extrabold gradient-brand-text mb-1">
                  24/7
                </div>
                <div className="text-sm text-white/60">Automatizacion</div>
              </div>
            </div>
          </div>

          {/* Right: Mockup cards - elegant stepped arrangement */}
          <div className="relative h-[420px] lg:h-[540px] hidden lg:block">
            {/* Peluqueria - back left, smaller */}
            <div
              className="mockup-card mockup-float-2 card-shine absolute w-52 top-8 -left-4"
              style={{
                animationDelay: '200ms',
                ...getStyle(7),
                animation: reducedMotion ? 'none' : undefined,
                boxShadow: 'var(--shadow-card), 0 0 0 1px rgba(var(--color-primary-rgb), 0.2), 0 0 40px rgba(var(--color-primary-rgb), 0.12)',
              }}
            >
              <div className="card-3d-tilt-inner p-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.07]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-dim">Peluqueria</span>
                </div>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono text-xs">15:30</span>
                    <span className="text-white/80">Corte & Barba</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-mono text-xs">16:15</span>
                    <span className="text-white/80">Color</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Natatorio - center, prominent */}
            <div
              className="mockup-card mockup-float-1 card-shine absolute w-64 top-28 left-8"
              style={{
                animationDelay: '100ms',
                ...getStyle(8),
                animation: reducedMotion ? 'none' : undefined,
                boxShadow: 'var(--shadow-card), 0 0 0 1px rgba(var(--color-primary-rgb), 0.25), 0 0 80px rgba(var(--color-primary-rgb), 0.18)',
              }}
            >
              <div className="card-3d-tilt-inner p-5">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/[0.07]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-dim">Natatorio</span>
                </div>
                <div className="space-y-2">
                  <div className="inline-block bg-primary/10 text-primary text-xs px-2.5 py-1 rounded-md font-medium">
                    Grupos de Natacion
                  </div>
                  <div className="text-sm text-white/80">Adultos Inicial (19:00)</div>
                  <div className="text-sm text-white/80">Ninos Nivel 1 (17:30)</div>
                </div>
                <div className="mt-5 pt-4 border-t border-white/[0.07]">
                  <div className="text-xs text-dim mb-1.5">Asistencias Hoy</div>
                  <div className="flex items-end gap-2">
                    <AnimatedStat value={42} label="" duration={1200} delay={reducedMotion ? 0 : 500} size="sm" />
                    <div className="text-sm text-dim">/ 50</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academia - front right, with chart */}
            <div
              className="mockup-card mockup-float-3 card-shine absolute w-60 bottom-8 right-20"
              style={{
                animationDelay: '300ms',
                ...getStyle(9),
                animation: reducedMotion ? 'none' : undefined,
                boxShadow: 'var(--shadow-card), 0 0 0 1px rgba(var(--color-primary-rgb), 0.22), 0 0 60px rgba(var(--color-primary-rgb), 0.14)',
              }}
            >
              <div className="card-3d-tilt-inner p-4">
                <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/[0.07]">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="w-2 h-2 rounded-full bg-yellow-400" />
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-dim">Academia</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-dim">Alumnos Activos</span>
                  <AnimatedStat value={128} label="" duration={1500} delay={reducedMotion ? 0 : 700} size="sm" />
                </div>
                <div className="flex items-end gap-1.5 h-14">
                  <div className="flex-1 bg-primary/20 rounded-t" style={{ height: '45%' }} />
                  <div className="flex-1 bg-primary/30 rounded-t" style={{ height: '65%' }} />
                  <div className="flex-1 bg-primary/40 rounded-t" style={{ height: '55%' }} />
                  <div className="flex-1 bg-primary/50 rounded-t" style={{ height: '80%' }} />
                  <div className="flex-1 bg-primary/60 rounded-t" style={{ height: '70%' }} />
                  <div className="flex-1 bg-primary rounded-t" style={{ height: '90%' }} />
                </div>
              </div>
            </div>

            {/* 3D Phone Mockup - right side, floating alongside cards */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <PhoneMockup />
            </div>
          </div>

          {/* Mobile cards - stacked simplified version */}
          <div className="lg:hidden grid gap-4 mt-8">
            <div className="mockup-card card-shine p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-dim">Natatorio</span>
              </div>
              <div className="text-sm text-white/80">Grupos de Natacion · 42/50 asistentes</div>
            </div>
            <div className="mockup-card card-shine p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-dim">Peluqueria</span>
              </div>
              <div className="text-sm text-white/80">15:30 Corte & Barba · 16:15 Color</div>
            </div>
            <div className="mockup-card card-shine p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-dim">Academia</span>
              </div>
              <div className="text-sm text-white/80">128 Alumnos Activos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
