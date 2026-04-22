'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'

// ======================
// Reduced Motion Hook
// ======================

export function useReducedMotion(): boolean {
  const [prefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prefersReducedMotion !== mediaQuery.matches) {
      // State already initialized, just sync if needed
    }

    const handler = (event: MediaQueryListEvent) => {
      // This is an event callback, not synchronous setState in effect
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  return prefersReducedMotion
}

// ======================
// Type Definitions
// ======================

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
  duration?: number
}

interface StaggerRevealOptions extends ScrollRevealOptions {
  staggerDelay?: number
  /** @deprecated Use itemCount instead */
  items?: number
  itemCount?: number
}

interface ParallaxOptions {
  speed?: number
  direction?: 'up' | 'down' | 'left' | 'right'
}

interface CounterOptions {
  start?: number
  end: number
  duration?: number
  delay?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

interface SpringResult {
  value: number
  velocity: number
}

type CSSProperties = React.CSSProperties

// ======================
// Spring Physics Utilities
// ======================

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

export function springInterpolate(
  current: number,
  target: number,
  velocity: number,
  stiffness: number = 100,
  damping: number = 15,
  mass: number = 1
): SpringResult {
  const spring = stiffness * (target - current)
  const damper = damping * velocity
  const acceleration = (spring - damper) / mass
  const deltaTime = 1 / 60 // ~60fps fixed timestep

  const newVelocity = velocity + acceleration * deltaTime
  const newValue = current + newVelocity * deltaTime

  return { value: newValue, velocity: newVelocity }
}

// ======================
// Scroll Reveal Hook
// ======================

interface UseScrollRevealReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  isVisible: boolean
  style: CSSProperties
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
): UseScrollRevealReturn<T> {
  const {
    threshold = 0.15,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0,
    duration = 600
  } = options

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const element = ref.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observerRef.current?.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    observerRef.current.observe(element)

    return () => observerRef.current?.disconnect()
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion])

  // Memoize style to prevent unnecessary re-renders
  const style = useMemo<CSSProperties>(
    () => ({
      opacity: 1,
      transform: 'translateY(0)',
      transition: prefersReducedMotion ? 'none' : `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    }),
    [duration, delay, prefersReducedMotion]
  )

  return { ref, isVisible, style }
}

// ======================
// Stagger Reveal Hook
// ======================

interface UseStaggerRevealReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  isVisible: boolean
  visibleItems: Set<number>
  getItemStyle: (index: number) => CSSProperties
}

export function useStaggerReveal<T extends HTMLElement = HTMLDivElement>(
  options: StaggerRevealOptions = {}
): UseStaggerRevealReturn<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    staggerDelay = 80,
    items: itemsProp = 6,
    itemCount = itemsProp
  } = options

  const ref = useRef<T>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(() => new Set())
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const element = ref.current
    if (!element) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            observerRef.current?.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
          setVisibleItems(new Set())
        }
      },
      { threshold, rootMargin }
    )

    observerRef.current.observe(element)

    return () => observerRef.current?.disconnect()
  }, [threshold, rootMargin, triggerOnce, prefersReducedMotion])

  // Stagger reveal effect with proper cleanup and batched updates
  useEffect(() => {
    if (!isVisible) return

    // Clear any existing timeouts
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    // When reduced motion is preferred, show all items immediately
    if (prefersReducedMotion) {
      return
    }

    // Batch updates to avoid triggering re-renders for each item
    // Use a single setTimeout chain instead of individual setTimeouts
    let currentIndex = 0

    const revealNext = () => {
      if (currentIndex >= itemCount) return

      setVisibleItems(prev => {
        const next = new Set(prev)
        next.add(currentIndex)
        return next
      })

      currentIndex++
      if (currentIndex < itemCount) {
        const timeout = setTimeout(revealNext, staggerDelay)
        timeoutsRef.current.push(timeout)
      }
    }

    // Start revealing after a small initial delay
    const initialTimeout = setTimeout(revealNext, staggerDelay)
    timeoutsRef.current.push(initialTimeout)

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [isVisible, itemCount, staggerDelay, prefersReducedMotion])

  // Memoize getItemStyle to avoid creating new functions on each render
  const getItemStyle = useCallback(
    (index: number): CSSProperties => {
      const isItemVisible = visibleItems.has(index)
      return {
        opacity: 1,
        transform: 'translateY(0) scale(1)',
        transition: prefersReducedMotion ? 'none' : 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
    [visibleItems, prefersReducedMotion]
  )

  return { ref, isVisible, visibleItems, getItemStyle }
}

// ======================
// Parallax Hook
// ======================

interface UseParallaxReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  offset: number
  isInView: boolean
  style: CSSProperties
  isTouchDevice: boolean
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {}
): UseParallaxReturn<T> {
  const { speed = 0.5, direction = 'up' } = options
  const ref = useRef<T>(null)

  const [offset, setOffset] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  const targetOffset = useRef(0)
  const currentOffset = useRef(0)
  const velocity = useRef(0)
  const rafId = useRef<number | null>(null)

  // Memoize direction multiplier
  const directionMultiplier = useMemo(() => {
    switch (direction) {
      case 'up': return 1
      case 'down': return -1
      case 'left': return 1
      case 'right': return -1
      default: return 1
    }
  }, [direction])

  // Touch device detection - disable parallax on touch devices for performance
  // Initialize synchronously to prevent flash of parallax on touch devices
  const [isTouchDevice] = useState(() => {
    if (typeof window === 'undefined') return false
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    )
  })

  useEffect(() => {
    const checkTouch = () => {
      // This is event-driven, not synchronous setState in effect
    }
    window.addEventListener('resize', checkTouch)
    return () => window.removeEventListener('resize', checkTouch)
  }, [])

  // Viewport visibility check
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  // Parallax scroll handler - optimized with throttling
  useEffect(() => {
    // Disable parallax on touch devices or when reduced motion is preferred
    if (!isInView || prefersReducedMotion || isTouchDevice) return

    let lastExecution = 0
    const throttleMs = 16 // ~60fps

    const handleScroll = () => {
      const now = performance.now()
      if (now - lastExecution < throttleMs) return
      lastExecution = now

      const element = ref.current
      if (!element) return

      const rect = element.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const distanceFromCenter = elementCenter - viewportCenter

      // Clamp offset to prevent extreme values on rapid scroll
      const rawOffset = distanceFromCenter * speed * directionMultiplier
      targetOffset.current = Math.max(-200, Math.min(200, rawOffset))
    }

    const animate = () => {
      const { value, velocity: newVelocity } = springInterpolate(
        currentOffset.current,
        targetOffset.current,
        velocity.current,
        80, // stiffness
        12, // damping
        1   // mass
      )

      const isSettled =
        Math.abs(targetOffset.current - currentOffset.current) < 0.01 &&
        Math.abs(newVelocity) < 0.01

      if (!isSettled) {
        currentOffset.current = value
        velocity.current = newVelocity
        setOffset(value)
        rafId.current = requestAnimationFrame(animate)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    rafId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
        rafId.current = null
      }
    }
  }, [isInView, speed, directionMultiplier, prefersReducedMotion, isTouchDevice])

  // Memoize style
  const style = useMemo<CSSProperties>(() => {
    const axis = direction === 'left' || direction === 'right' ? 'X' : 'Y'
    // On touch devices, don't apply transform
    if (isTouchDevice || prefersReducedMotion) {
      return {
        transform: 'none',
        willChange: 'auto',
      }
    }
    return {
      transform: `translate${axis}(${offset}px)`,
      willChange: 'transform',
    }
  }, [offset, direction, prefersReducedMotion, isTouchDevice])

  return { ref, offset, isInView, style, isTouchDevice }
}

// ======================
// Counter Animation Hook
// ======================

interface UseCounterReturn {
  ref: React.RefObject<HTMLElement | null>
  count: number
  formatted: string
  isVisible: boolean
}

export function useCounter(options: CounterOptions): UseCounterReturn {
  const {
    start = 0,
    end,
    duration = 2000,
    delay = 0,
    decimals = 0,
    prefix = '',
    suffix = ''
  } = options

  const ref = useRef<HTMLElement>(null)
  const [count, setCount] = useState(start)
  const [isVisible, setIsVisible] = useState(false)
  const hasAnimated = useRef(false)
  const rafId = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    // When reduced motion is preferred, show final value immediately
    if (prefersReducedMotion) {
      return
    }

    const timeout = setTimeout(() => {
      const startTime = performance.now()
      const diff = end - start

      const tick = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)

        setCount(start + diff * easeOut)

        if (progress < 1) {
          rafId.current = requestAnimationFrame(tick)
        }
      }

      rafId.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      clearTimeout(timeout)
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [isVisible, start, end, duration, delay, prefersReducedMotion])

  const formatted = useMemo(
    () => `${prefix}${count.toFixed(decimals)}${suffix}`,
    [count, decimals, prefix, suffix]
  )

  return { ref, count, formatted, isVisible }
}

// ======================
// Scroll Progress Hook
// ======================

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(Math.max(scrollProgress, 0), 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}

// ======================
// Magnetic Effect Hook
// ======================

interface UseMagneticReturn<T extends HTMLElement> {
  ref: React.RefObject<T | null>
  isHovering: boolean
}

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  strength: number = 0.3
): UseMagneticReturn<T> {
  const ref = useRef<T>(null)
  const [isHovering, setIsHovering] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Skip magnetic effect when reduced motion is preferred
    if (prefersReducedMotion) return

    const element = ref.current
    if (!element) return

    let rafId: number | null = null
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let velocityX = 0
    let velocityY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      targetX = (e.clientX - rect.left - rect.width / 2) * strength
      targetY = (e.clientY - rect.top - rect.height / 2) * strength
    }

    const animate = () => {
      const { value: newX, velocity: newVelX } = springInterpolate(currentX, targetX, velocityX, 150, 10)
      const { value: newY, velocity: newVelY } = springInterpolate(currentY, targetY, velocityY, 150, 10)

      currentX = newX
      currentY = newY
      velocityX = newVelX
      velocityY = newVelY

      element.style.transform = `translate(${currentX}px, ${currentY}px)`

      if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
        rafId = requestAnimationFrame(animate)
      }
    }

    const handleMouseEnter = () => {
      setIsHovering(true)
      element.style.transition = 'transform 0.1s ease-out'
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      targetX = 0
      targetY = 0
      element.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      rafId = requestAnimationFrame(animate)
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [strength, prefersReducedMotion])

  return { ref, isHovering }
}
