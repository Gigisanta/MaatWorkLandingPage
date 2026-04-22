'use client'

import { useState, useRef, useCallback, useEffect, RefObject } from 'react'

interface TiltOptions {
  /** Maximum rotation in degrees (default: 15) */
  maxRotation?: number
  /** Perspective value in px (default: 1000) */
  perspective?: number
  /** Spring stiffness for smooth interpolation (default: 0.1) */
  stiffness?: number
  /** Spring damping (default: 0.8) */
  damping?: number
  /** Enable glare effect (default: false) */
  enableGlare?: boolean
  /** Scale on hover (default: 1.02) */
  scale?: number
}

interface TiltState {
  rotateX: number
  rotateY: number
  glareX: number
  glareY: number
}

interface UseTilt3DReturn {
  ref: RefObject<HTMLElement | null>
  style: React.CSSProperties
  isHovering: boolean
  tilt: TiltState
}

/**
 * Optimized 3D tilt hook with:
 * - Smooth spring-based interpolation
 * - prefers-reduced-motion support
 * - Configurable glare effect
 * - Automatic cleanup
 */
export function useTilt3D<T extends HTMLElement = HTMLDivElement>(
  options: TiltOptions = {}
): UseTilt3DReturn {
  const {
    maxRotation = 15,
    perspective = 1000,
    stiffness = 0.1,
    damping = 0.8,
    enableGlare = false,
    scale = 1.02
  } = options

  const ref = useRef<T>(null)
  const prefersReducedMotion = useRef(false)

  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50
  })
  const [isHovering, setIsHovering] = useState(false)

  // Use refs for values needed in event callbacks to avoid stale closures
  const stateRef = useRef({ isHovering: false, maxRotation, enableGlare })
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  // Keep refs in sync with state
  useEffect(() => {
    stateRef.current.isHovering = isHovering
  }, [isHovering])

  useEffect(() => {
    stateRef.current.maxRotation = maxRotation
  }, [maxRotation])

  useEffect(() => {
    stateRef.current.enableGlare = enableGlare
  }, [enableGlare])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.current = mediaQuery.matches

    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches
    }
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const stopAnimation = useCallback(() => {
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current)
      rafId.current = null
    }
  }, [])

  const resetToCenter = useCallback(() => {
    current.current = { x: 0, y: 0 }
    velocity.current = { x: 0, y: 0 }
    target.current = { x: 0, y: 0 }
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 })
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const element = ref.current
    if (!element || !stateRef.current.isHovering) return

    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const { maxRotation: max } = stateRef.current
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * max
    const rotateX = ((centerY - e.clientY) / (rect.height / 2)) * max

    target.current = { x: rotateX, y: rotateY }

    if (stateRef.current.enableGlare) {
      const glareX = ((e.clientX - rect.left) / rect.width) * 100
      const glareY = ((e.clientY - rect.top) / rect.height) * 100
      setTilt(prev => ({ ...prev, glareX, glareY }))
    }
  }, [])

  const animate = useCallback(() => {
    if (!stateRef.current.isHovering) return

    // Spring physics: F = -k * x - d * v
    const forceX = (target.current.x - current.current.x) * stiffness
    const forceY = (target.current.y - current.current.y) * stiffness

    velocity.current.x = (velocity.current.x + forceX) * damping
    velocity.current.y = (velocity.current.y + forceY) * damping

    current.current.x += velocity.current.x
    current.current.y += velocity.current.y

    setTilt(prev => ({
      ...prev,
      rotateX: current.current.x,
      rotateY: current.current.y
    }))

    // Continue animation if still moving
    if (
      Math.abs(velocity.current.x) > 0.001 ||
      Math.abs(velocity.current.y) > 0.001
    ) {
      rafId.current = requestAnimationFrame(animate)
    }
  }, [stiffness, damping])

  const handleMouseEnter = useCallback(() => {
    if (prefersReducedMotion.current) return

    setIsHovering(true)
    stopAnimation()
    rafId.current = requestAnimationFrame(animate)
  }, [stopAnimation, animate])

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    stopAnimation()

    if (prefersReducedMotion.current) {
      resetToCenter()
      return
    }

    // Animate back to center
    const animateBack = () => {
      const forceX = -current.current.x * stiffness
      const forceY = -current.current.y * stiffness

      velocity.current.x = (velocity.current.x + forceX) * damping
      velocity.current.y = (velocity.current.y + forceY) * damping

      current.current.x += velocity.current.x
      current.current.y += velocity.current.y

      setTilt(prev => ({
        ...prev,
        rotateX: current.current.x,
        rotateY: current.current.y
      }))

      if (
        Math.abs(current.current.x) > 0.01 ||
        Math.abs(current.current.y) > 0.01
      ) {
        rafId.current = requestAnimationFrame(animateBack)
      } else {
        resetToCenter()
      }
    }

    rafId.current = requestAnimationFrame(animateBack)
  }, [stopAnimation, stiffness, damping, resetToCenter])

  // Attach event listeners with useEffect (not useCallback)
  useEffect(() => {
    const element = ref.current
    if (!element) return

    element.addEventListener('mousemove', handleMouseMove as EventListener)
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove as EventListener)
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
      stopAnimation()
    }
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave, stopAnimation])

  const style: React.CSSProperties = {
    transform: `perspective(${perspective}px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${isHovering ? scale : 1})`,
    transition: isHovering ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform',
    '--tilt-rotate-x': `${tilt.rotateX}deg`,
    '--tilt-rotate-y': `${tilt.rotateY}deg`,
    '--glare-x': `${tilt.glareX}%`,
    '--glare-y': `${tilt.glareY}%`,
  } as React.CSSProperties

  return { ref, style, isHovering, tilt }
}
