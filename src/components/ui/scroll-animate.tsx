'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { useReducedMotion } from '@/hooks'

// Premium spring easing matching the landing page aesthetic
const PREMIUM_EASING = 'cubic-bezier(0.33, 1, 0.68, 1)'

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'blur'
  | 'reveal'
  | 'float'
  | 'glow-fade'
  | 'none'

interface ScrollAnimateProps {
  children: ReactNode
  className?: string
  animation?: AnimationType
  delay?: number
  threshold?: number
  rootMargin?: string
  once?: boolean
  duration?: number
  parallaxDepth?: number
}

export function ScrollAnimate({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  rootMargin = '0px',
  once = true,
  duration = 800,
  parallaxDepth = 0,
}: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0)
  const reducedMotion = useReducedMotion()
  const ticking = useRef(false)

  // Parallax effect tied to scroll
  useEffect(() => {
    if (!parallaxDepth || reducedMotion) return

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          if (ref.current) {
            const rect = ref.current.getBoundingClientRect()
            const viewportCenter = window.innerHeight / 2
            const elementCenter = rect.top + rect.height / 2
            const distance = elementCenter - viewportCenter
            setScrollOffset(distance * parallaxDepth * 0.1)
          }
          ticking.current = false
        })
        ticking.current = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [parallaxDepth, reducedMotion])

  // Intersection observer for reveal
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(element)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  // Skip animation for reduced motion
  if (reducedMotion) {
    return (
      <div
        ref={ref}
        className={className}
        style={{ transform: parallaxDepth ? `translateY(${scrollOffset}px)` : undefined }}
      >
        {children}
      </div>
    )
  }

  const getAnimationStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: PREMIUM_EASING,
      transitionDelay: `${delay}ms`,
      willChange: 'opacity, transform, filter',
    }

    if (isVisible) {
      return {
        ...baseStyle,
        opacity: 1,
        transform: `translateY(0) translateX(0) scale(1)${parallaxDepth ? ` translateY(${scrollOffset}px)` : ''}`,
        filter: 'blur(0px)',
      }
    }

    const hiddenStyles: Record<AnimationType, React.CSSProperties> = {
      'fade-up': { opacity: 0, transform: 'translateY(40px) scale(0.96)', filter: 'blur(8px)' },
      'fade-down': { opacity: 0, transform: 'translateY(-40px) scale(0.96)', filter: 'blur(8px)' },
      'slide-left': { opacity: 0, transform: 'translateX(60px) scale(0.96)', filter: 'blur(8px)' },
      'slide-right': { opacity: 0, transform: 'translateX(-60px) scale(0.96)', filter: 'blur(8px)' },
      'scale': { opacity: 0, transform: 'scale(0.88)', filter: 'blur(8px)' },
      'blur': { opacity: 0, transform: 'translateY(30px)', filter: 'blur(16px)' },
      'reveal': { opacity: 0, transform: "clipPath('inset(100% 0 0 0)')" },
      'float': { opacity: 0, transform: 'translateY(50px) scale(0.92)', filter: 'blur(12px)' },
      'glow-fade': { opacity: 0, transform: 'translateY(24px) scale(0.95)', filter: 'blur(6px)' },
      'none': {},
    }

    return {
      ...baseStyle,
      ...hiddenStyles[animation],
    }
  }

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

// ==========================================
// Section Transition Component
// ==========================================

type TransitionDirection = 'up' | 'down' | 'left' | 'right'

interface SectionTransitionProps {
  children: ReactNode
  direction?: TransitionDirection
  distance?: number
  duration?: number
  className?: string
  blur?: boolean
  scale?: boolean
}

export function SectionTransition({
  children,
  direction = 'up',
  distance = 50,
  duration = 900,
  className = '',
  blur = true,
  scale = true,
}: SectionTransitionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = useReducedMotion()

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
      { threshold: 0.1 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  const getStyle = (): React.CSSProperties => {
    if (isVisible) {
      return {
        opacity: 1,
        transform: 'translate(0, 0) scale(1)',
        filter: 'blur(0px)',
        transition: `opacity ${duration}ms ${PREMIUM_EASING}, transform ${duration}ms ${PREMIUM_EASING}, filter ${duration}ms ${PREMIUM_EASING}`,
        willChange: 'opacity, transform, filter',
      }
    }

    const offsets: Record<TransitionDirection, string> = {
      up: `translateY(${distance}px)`,
      down: `translateY(-${distance}px)`,
      left: `translateX(${distance}px)`,
      right: `translateX(-${distance}px)`,
    }

    const baseTransform = offsets[direction]

    return {
      opacity: 0,
      transform: scale ? `${baseTransform} scale(0.92)` : baseTransform,
      filter: blur ? 'blur(8px)' : 'blur(0px)',
      transition: `opacity ${duration}ms ${PREMIUM_EASING}, transform ${duration}ms ${PREMIUM_EASING}, filter ${duration}ms ${PREMIUM_EASING}`,
      willChange: 'opacity, transform, filter',
    }
  }

  return (
    <div ref={ref} className={className} style={getStyle()}>
      {children}
    </div>
  )
}

// ==========================================
// Stagger Container
// ==========================================

type StaggerAnimationType = Exclude<AnimationType, 'float' | 'glow-fade'>

interface ScrollStaggerProps {
  children: ReactNode[]
  className?: string
  staggerDelay?: number
  animation?: StaggerAnimationType
  threshold?: number
  duration?: number
}

export function ScrollStagger({
  children,
  className = '',
  staggerDelay = 100,
  animation = 'fade-up',
  threshold = 0.1,
  duration = 700,
}: ScrollStaggerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((_, index) => {
            setTimeout(() => {
              setVisibleCount(index + 1)
            }, index * staggerDelay)
          })
          observer.unobserve(element)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, staggerDelay, children.length])

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  const getChildStyle = (index: number): React.CSSProperties => {
    const isVisible = index < visibleCount
    const baseDelay = index * staggerDelay

    const animations: Record<StaggerAnimationType, { from: React.CSSProperties; to: React.CSSProperties }> = {
      'fade-up': {
        from: { opacity: 0, transform: 'translateY(36px) scale(0.95)', filter: 'blur(10px)' },
        to: { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' },
      },
      'fade-down': {
        from: { opacity: 0, transform: 'translateY(-36px) scale(0.95)', filter: 'blur(10px)' },
        to: { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' },
      },
      'slide-left': {
        from: { opacity: 0, transform: 'translateX(50px) scale(0.95)', filter: 'blur(10px)' },
        to: { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' },
      },
      'slide-right': {
        from: { opacity: 0, transform: 'translateX(-50px) scale(0.95)', filter: 'blur(10px)' },
        to: { opacity: 1, transform: 'translateX(0) scale(1)', filter: 'blur(0px)' },
      },
      'scale': {
        from: { opacity: 0, transform: 'scale(0.85)', filter: 'blur(10px)' },
        to: { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' },
      },
      'blur': {
        from: { opacity: 0, transform: 'translateY(24px)', filter: 'blur(20px)' },
        to: { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' },
      },
      'reveal': {
        from: { opacity: 0, clipPath: 'inset(100% 0 0 0)' },
        to: { opacity: 1, clipPath: 'inset(0% 0 0 0)' },
      },
      'none': {
        from: { opacity: 1 },
        to: { opacity: 1 },
      },
    }

    return {
      ...(isVisible ? animations[animation].to : animations[animation].from),
      transition: `opacity ${duration}ms ${PREMIUM_EASING}, transform ${duration}ms ${PREMIUM_EASING}, filter ${duration}ms ${PREMIUM_EASING}`,
      transitionDelay: isVisible ? `${baseDelay}ms` : '0ms',
      willChange: 'opacity, transform, filter',
    }
  }

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div key={index} style={getChildStyle(index)}>
          {child}
        </div>
      ))}
    </div>
  )
}

// ==========================================
// Animated Entrance Hook
// ==========================================

interface UseEntranceAnimationOptions {
  type?: AnimationType
  delay?: number
  duration?: number
  threshold?: number
}

export function useEntranceAnimation<T extends HTMLElement = HTMLDivElement>(
  options: UseEntranceAnimationOptions = {}
) {
  const { type = 'fade-up', delay = 0, duration = 800, threshold = 0.2 } = options
  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const reducedMotion = useReducedMotion()

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
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  const getHiddenStyle = (): React.CSSProperties => {
    switch (type) {
      case 'fade-up':
        return { opacity: 0, transform: 'translateY(32px) scale(0.96)', filter: 'blur(8px)' }
      case 'fade-down':
        return { opacity: 0, transform: 'translateY(-32px) scale(0.96)', filter: 'blur(8px)' }
      case 'slide-left':
        return { opacity: 0, transform: 'translateX(48px) scale(0.96)', filter: 'blur(8px)' }
      case 'slide-right':
        return { opacity: 0, transform: 'translateX(-48px) scale(0.96)', filter: 'blur(8px)' }
      case 'scale':
        return { opacity: 0, transform: 'scale(0.88)', filter: 'blur(8px)' }
      case 'blur':
        return { opacity: 0, transform: 'translateY(24px)', filter: 'blur(16px)' }
      case 'reveal':
        return { opacity: 0, clipPath: 'inset(100% 0 0 0)' }
      case 'float':
        return { opacity: 0, transform: 'translateY(40px) scale(0.92)', filter: 'blur(12px)' }
      case 'glow-fade':
        return { opacity: 0, transform: 'translateY(20px) scale(0.95)', filter: 'blur(6px)' }
      default:
        return { opacity: 0 }
    }
  }

  const style: React.CSSProperties = reducedMotion
    ? {}
    : isVisible
      ? {
          opacity: 1,
          transform: 'translateY(0) translateX(0) scale(1)',
          filter: 'blur(0px)',
          transition: `opacity ${duration}ms ${PREMIUM_EASING} ${delay}ms, transform ${duration}ms ${PREMIUM_EASING} ${delay}ms, filter ${duration}ms ${PREMIUM_EASING} ${delay}ms`,
          willChange: 'opacity, transform, filter',
        }
      : {
          ...getHiddenStyle(),
          transition: 'none',
        }

  return { ref, isVisible, style }
}
