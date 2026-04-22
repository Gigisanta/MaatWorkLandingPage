'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion, springInterpolate } from '@/hooks'

type CursorVariant = 'default' | 'hover' | 'click'

const INTERACTIVE_SELECTORS = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'textarea',
  'select',
  '[data-cursor="hover"]',
  '.btn',
  'label',
].join(',')

// Premium colors matching the landing page aesthetic
const CURSOR_COLOR = 'rgba(99, 102, 241, 0.9)' // --color-primary
const RING_COLOR = 'rgba(99, 102, 241, 0.4)'
const CLICK_COLOR = 'rgba(139, 92, 246, 1)' // --color-accent-purple

interface CursorState {
  x: number
  y: number
  vx: number
  vy: number
}

export function PremiumCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLCanvasElement>(null)

  const mouseRef = useRef<CursorState>({ x: -100, y: -100, vx: 0, vy: 0 })
  const dotSmoothRef = useRef<CursorState>({ x: -100, y: -100, vx: 0, vy: 0 })
  const ringSmoothRef = useRef<CursorState>({ x: -100, y: -100, vx: 0, vy: 0 })

  const rafRef = useRef<number | null>(null)
  const trailRafRef = useRef<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [variant, setVariant] = useState<CursorVariant>('default')
  const [trailEnabled, setTrailEnabled] = useState(false)

  const reducedMotion = useReducedMotion()

  // Trail particles
  const trailParticlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    life: number; maxLife: number; size: number;
  }>>([])

  const lerp = useCallback((a: number, b: number, t: number) => a + (b - a) * t, [])

  // Initialize trail canvas
  useEffect(() => {
    if (reducedMotion) return

    const canvas = trailRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Check if device should have trail
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    const isMobile = window.innerWidth < 768
    setTrailEnabled(!isTouchDevice && !isMobile)

    return () => window.removeEventListener('resize', resize)
  }, [reducedMotion])

  // Trail animation
  useEffect(() => {
    if (!trailEnabled || reducedMotion) return

    const canvas = trailRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      const { x, y } = mouseRef.current

      // Spawn particles
      if (x > 0 && y > 0 && Math.random() > 0.4) {
        trailParticlesRef.current.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
          maxLife: 20 + Math.random() * 15,
          size: 2 + Math.random() * 4,
        })
      }

      // Update and draw particles
      trailParticlesRef.current = trailParticlesRef.current.filter(p => {
        p.life -= 1 / p.maxLife
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96

        if (p.life <= 0) return false

        const alpha = p.life * 0.6
        const radius = p.size * p.life

        // Glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3)
        gradient.addColorStop(0, `rgba(99, 102, 241, ${alpha * 0.5})`)
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${alpha * 0.25})`)
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')

        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
        ctx.fill()

        return true
      })

      trailRafRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (trailRafRef.current) cancelAnimationFrame(trailRafRef.current)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [trailEnabled, reducedMotion])

  // Main cursor animation
  useEffect(() => {
    if (reducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseRef.current.x
      const dy = e.clientY - mouseRef.current.y
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        vx: dx * 0.1,
        vy: dy * 0.1,
      }
      setVisible(true)
    }

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)
    const handleMouseDown = () => setVariant('click')
    const handleMouseUp = () => setVariant('default')

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const interactive = target.closest(INTERACTIVE_SELECTORS)
      setVariant(interactive ? 'hover' : 'default')
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousemove', handleElementHover, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Animation loop with spring physics
    const updateCursor = () => {
      const { x, y } = mouseRef.current

      // Dot - responsive, slight spring lag
      const dotSpring = springInterpolate(
        dotSmoothRef.current.x,
        x,
        dotSmoothRef.current.vx,
        150,
        12
      )
      dotSmoothRef.current = {
        x: dotSpring.value,
        y: springInterpolate(dotSmoothRef.current.y, y, dotSmoothRef.current.vy, 150, 12).value,
        vx: dotSpring.velocity,
        vy: dotSmoothRef.current.vy,
      }

      // Ring - smooth trailing effect with slower spring
      const ringSpring = springInterpolate(
        ringSmoothRef.current.x,
        x,
        ringSmoothRef.current.vx,
        80,
        10
      )
      ringSmoothRef.current = {
        x: ringSpring.value,
        y: springInterpolate(ringSmoothRef.current.y, y, ringSmoothRef.current.vy, 80, 10).value,
        vx: ringSpring.velocity,
        vy: ringSmoothRef.current.vy,
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotSmoothRef.current.x}px, ${dotSmoothRef.current.y}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringSmoothRef.current.x}px, ${ringSmoothRef.current.y}px) translate(-50%, -50%)`
      }

      rafRef.current = requestAnimationFrame(updateCursor)
    }

    rafRef.current = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousemove', handleElementHover)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)

      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  // Variant-based styles
  const dotSize = variant === 'hover' ? 8 : variant === 'click' ? 12 : 6
  const ringSize = variant === 'hover' ? 48 : variant === 'click' ? 36 : 40
  const ringColor = variant === 'click' ? CLICK_COLOR : RING_COLOR
  const dotColor = variant === 'click' ? CLICK_COLOR : CURSOR_COLOR

  return (
    <>
      {/* Trail canvas */}
      {trailEnabled && (
        <canvas
          ref={trailRef}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9996,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />
      )}

      {/* Main dot - bright core */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: dotColor,
          boxShadow: `0 0 ${dotSize * 2}px ${dotColor}, 0 0 ${dotSize * 4}px rgba(99, 102, 241, 0.5)`,
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: 'width 200ms ease-out, height 200ms ease-out, background-color 200ms ease-out, box-shadow 200ms ease-out',
          willChange: 'transform',
        }}
      />

      {/* Outer ring - trailing glow */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: ringSize,
          height: ringSize,
          borderRadius: '50%',
          border: `1.5px solid ${ringColor}`,
          boxShadow: `0 0 ${ringSize / 2}px ${ringColor}, inset 0 0 ${ringSize / 3}px rgba(99, 102, 241, 0.1)`,
          pointerEvents: 'none',
          zIndex: 9997,
          opacity: visible ? 0.8 : 0,
          transition: 'width 250ms ease-out, height 250ms ease-out, border-color 200ms ease-out, box-shadow 250ms ease-out, opacity 200ms ease-out',
          willChange: 'transform',
        }}
      />
    </>
  )
}

export default PremiumCursor
