'use client'

import { useEffect, useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react'
import { useReducedMotion } from '@/hooks'

// ======================
// Types
// ======================

type AnimationType = 'fade-up' | 'fade-down' | 'slide-left' | 'slide-right' | 'scale' | 'blur' | 'reveal' | 'none'

interface SectionRevealOptions {
  children: ReactNode
  className?: string
  delay?: number
  threshold?: number
  rootMargin?: string
  animation?: AnimationType
  duration?: number
}

interface StaggerContainerOptions {
  children: ReactNode
  className?: string
  staggerDelay?: number
  animation?: AnimationType
  duration?: number
}

// ======================
// Premium Easing Curves
// ======================

const PREMIUM_EASING = 'cubic-bezier(0.16, 1, 0.3, 1)'
const REVEAL_EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'

// ======================
// Section Reveal Component
// ======================

export function SectionReveal({
  children,
  className = '',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px',
  animation = 'fade-up',
  duration = 700,
}: SectionRevealOptions) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion, threshold, rootMargin])

  const getAnimationStyle = useCallback((): CSSProperties => {
    if (prefersReducedMotion) {
      return { opacity: 1, transform: 'none' }
    }

    if (animation === 'none') {
      return { opacity: 1, transform: 'none' }
    }

    const states: Record<AnimationType, { from: CSSProperties; to: CSSProperties }> = {
      'fade-up': {
        from: { opacity: 0, transform: 'translateY(32px) scale(0.96)', filter: 'blur(4px)' },
        to: { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
      },
      'fade-down': {
        from: { opacity: 0, transform: 'translateY(-32px) scale(0.96)', filter: 'blur(4px)' },
        to: { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' }
      },
      'slide-left': {
        from: { opacity: 0, transform: 'translateX(48px) scale(0.96)', filter: 'blur(4px)' },
        to: { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' }
      },
      'slide-right': {
        from: { opacity: 0, transform: 'translateX(-48px) scale(0.96)', filter: 'blur(4px)' },
        to: { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' }
      },
      'scale': {
        from: { opacity: 0, transform: 'scale(0.92)', filter: 'blur(4px)' },
        to: { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }
      },
      'blur': {
        from: { opacity: 0, transform: 'translateY(24px)', filter: 'blur(12px)' },
        to: { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }
      },
      'reveal': {
        from: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        to: { opacity: 1, clipPath: 'inset(0% 0 0 0)' }
      },
      'none': { from: { opacity: 1, transform: 'none', filter: 'blur(0px)' }, to: { opacity: 1, transform: 'none', filter: 'blur(0px)' } },
    }

    const style = states[animation]
    const target = isVisible ? style.to : style.from

    return {
      ...target,
      transition: `opacity ${duration}ms ${PREMIUM_EASING} ${delay}ms, transform ${duration}ms ${PREMIUM_EASING} ${delay}ms, filter ${duration}ms ${PREMIUM_EASING} ${delay}ms`,
      willChange: 'opacity, transform, filter',
    }
  }, [animation, delay, isVisible, prefersReducedMotion, duration])

  return (
    <div
      ref={ref}
      className={className}
      style={getAnimationStyle()}
      aria-hidden={!isVisible}
    >
      {children}
    </div>
  )
}

// ======================
// Stagger Container Component
// ======================

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 80,
  animation = 'fade-up',
  duration = 600,
}: StaggerContainerOptions) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const childrenArray = Array.isArray(children) ? children : [children]

  const getItemStyle = (index: number): CSSProperties => {
    const effectiveDelay = prefersReducedMotion ? 0 : index * staggerDelay

    if (animation === 'none' || isVisible) {
      return {
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        filter: 'blur(0px)',
        transition: `opacity ${duration}ms ${PREMIUM_EASING} ${effectiveDelay}ms, transform ${duration}ms ${PREMIUM_EASING} ${effectiveDelay}ms, filter ${duration}ms ${PREMIUM_EASING} ${effectiveDelay}ms`,
        willChange: 'opacity, transform, filter',
      }
    }

    const fromStates: Record<AnimationType, CSSProperties> = {
      'fade-up': { opacity: 0, transform: 'translateY(28px) scale(0.96)', filter: 'blur(6px)' },
      'fade-down': { opacity: 0, transform: 'translateY(-28px) scale(0.96)', filter: 'blur(6px)' },
      'slide-left': { opacity: 0, transform: 'translateX(40px) scale(0.96)', filter: 'blur(6px)' },
      'slide-right': { opacity: 0, transform: 'translateX(-40px) scale(0.96)', filter: 'blur(6px)' },
      'scale': { opacity: 0, transform: 'scale(0.88)', filter: 'blur(6px)' },
      'blur': { opacity: 0, transform: 'translateY(20px)', filter: 'blur(16px)' },
      'reveal': { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      none: { opacity: 0, transform: 'none', filter: 'blur(0px)' },
    }

    return {
      ...fromStates[animation],
      transition: `opacity ${duration}ms ${PREMIUM_EASING} ${effectiveDelay}ms, transform ${duration}ms ${PREMIUM_EASING} ${effectiveDelay}ms, filter ${duration}ms ${PREMIUM_EASING} ${effectiveDelay}ms`,
      willChange: 'opacity, transform, filter',
    }
  }

  return (
    <div ref={ref} className={className}>
      {childrenArray.map((child, index) => (
        <div key={index} style={getItemStyle(index)}>
          {child}
        </div>
      ))}
    </div>
  )
}

// ======================
// Page Enter Transition Hook
// ======================

export function usePageEnterTransition(duration = 600) {
  const [isEntered, setIsEntered] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsEntered(true)
      return
    }

    const timer = setTimeout(() => setIsEntered(true), 50)
    return () => clearTimeout(timer)
  }, [prefersReducedMotion])

  const transitionStyle: CSSProperties = {
    opacity: isEntered ? 1 : 0,
    transform: isEntered ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity ${duration}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1)`,
  }

  return { isEntered, transitionStyle }
}

// ======================
// Scroll Velocity Hook
// ======================

function useScrollVelocity(throttleMs = 50) {
  const [velocityState, setVelocityState] = useState({ velocity: 0, isFast: false })
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const FAST_THRESHOLD = 800

    const handleScroll = () => {
      if (rafId.current) return

      rafId.current = requestAnimationFrame(() => {
        const now = Date.now()
        const delta = now - lastTime.current

        if (delta >= throttleMs) {
          const dist = window.scrollY - lastScrollY.current
          const vel = Math.abs(dist) / (delta / 1000)

          setVelocityState({ velocity: vel, isFast: vel > FAST_THRESHOLD })
          lastScrollY.current = window.scrollY
          lastTime.current = now
        }

        rafId.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [throttleMs])

  return velocityState
}

// ======================
// Curtain Transition Effect
// ======================

interface CurtainEffectProps {
  isActive: boolean
  color?: string
  direction: 'up' | 'down'
}

function CurtainEffect({ isActive, color = '#6366f1', direction }: CurtainEffectProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) return null

  const style: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '100vh',
    background: `linear-gradient(135deg, ${color} 0%, #8b5cf6 100%)`,
    transform: isActive ? 'translateY(0)' : direction === 'down' ? 'translateY(-100%)' : 'translateY(100%)',
    transition: 'transform 0.65s cubic-bezier(0.76, 0, 0.24, 1)',
    zIndex: 9990,
    pointerEvents: 'none',
  }

  return <div style={style} aria-hidden="true" />
}

// ======================
// Page Transitions Orchestrator
// ======================

interface PageTransitionsOptions {
  children: ReactNode
  className?: string
  staggerChildren?: boolean
  staggerDelay?: number
  animationType?: AnimationType
  enableCurtain?: boolean
  curtainColor?: string
}

export function PageTransitions({
  children,
  className = '',
  staggerChildren = true,
  staggerDelay = 75,
  animationType = 'fade-up',
  enableCurtain = false,
  curtainColor = '#6366f1',
}: PageTransitionsOptions) {
  const [isCurtainActive, setIsCurtainActive] = useState(false)
  const [curtainDirection, setCurtainDirection] = useState<'up' | 'down'>('down')
  const lastScrollY = useRef(0)
  const rafId = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion || !enableCurtain) return

    const handleScroll = () => {
      if (rafId.current) return

      rafId.current = requestAnimationFrame(() => {
        const delta = window.scrollY - lastScrollY.current

        if (Math.abs(delta) > 100) {
          setCurtainDirection(delta > 0 ? 'down' : 'up')
          setIsCurtainActive(true)
          setTimeout(() => setIsCurtainActive(false), 350)
        }

        lastScrollY.current = window.scrollY
        rafId.current = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [prefersReducedMotion, enableCurtain])

  const effectiveAnimation = animationType === 'none' ? 'fade-up' : animationType

  const content = staggerChildren ? (
    <StaggerContainer staggerDelay={staggerDelay} animation={effectiveAnimation}>
      {children}
    </StaggerContainer>
  ) : (
    children
  )

  return (
    <>
      {enableCurtain && (
        <CurtainEffect isActive={isCurtainActive} color={curtainColor} direction={curtainDirection} />
      )}
      <div className={className}>
        {content}
      </div>
    </>
  )
}

// ======================
// Text Reveal Animation
// ======================

interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  animation?: 'word' | 'char' | 'line'
}

export function TextReveal({
  children,
  className = '',
  delay = 0,
  animation = 'word',
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.2 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const splitContent = (text: string): string[] => {
    if (animation === 'char') return text.split('')
    if (animation === 'line') return text.split('\n')
    return text.split(' ')
  }

  const parts = splitContent(children)

  const getStyle = (index: number): CSSProperties => {
    const staggerDelay = prefersReducedMotion ? 0 : delay + index * 40

    if (animation === 'char') {
      return {
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(3px)',
        transform: isVisible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.45s ease ${staggerDelay}ms, filter 0.45s ease ${staggerDelay}ms, transform 0.45s ease ${staggerDelay}ms`,
        display: 'inline-block',
      }
    }

    return {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(100%)',
      transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${staggerDelay}ms`,
    }
  }

  return (
    <span ref={ref} className={className} style={{ display: 'block', overflow: 'hidden' }}>
      {parts.map((part, index) => (
        <span
          key={index}
          style={{
            ...getStyle(index),
            marginRight: animation === 'word' ? '0.25em' : 0,
          }}
        >
          {animation === 'word' && index < parts.length - 1 ? `${part} ` : part}
        </span>
      ))}
    </span>
  )
}

// ======================
// Exports
// ======================

export type { SectionRevealOptions, StaggerContainerOptions }
