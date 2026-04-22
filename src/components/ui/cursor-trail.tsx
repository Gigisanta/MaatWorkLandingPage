'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useReducedMotion } from '@/hooks'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
  phase: number
}

interface CursorTrailProps {
  particleCount?: number
  colors?: string[]
  maxSize?: number
}

// Premium palette matching 3D canvas aesthetic
const PREMIUM_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#22c55e', '#f472b6']

export function CursorTrail({
  particleCount = 16,
  colors = PREMIUM_COLORS,
  maxSize = 8,
}: CursorTrailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -500, y: -500 })
  const smoothMouseRef = useRef({ x: -500, y: -500 })
  const animationRef = useRef<number | null>(null)

  const reducedMotion = useReducedMotion()

  // Compute initial enabled state based on device type and reduced motion
  const [isEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    if (reducedMotion) return false
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    const isMobile = window.innerWidth < 768
    return !isTouchDevice && !isMobile
  })

  // Lerp utility for smooth interpolation
  const lerp = useCallback((a: number, b: number, t: number) => a + (b - a) * t, [])

  const initParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: particleCount }, (_, i) => ({
      x: -500,
      y: -500,
      vx: 0,
      vy: 0,
      size: 2 + Math.random() * maxSize,
      opacity: 0,
      color: colors[i % colors.length],
      life: 0,
      maxLife: 30 + Math.random() * 30,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [particleCount, maxSize, colors])

  useEffect(() => {
    if (!isEnabled) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    initParticles()

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.016

      // Smooth interpolation factor (0.12 = premium smoothness)
      const smoothFactor = 0.12
      smoothMouseRef.current.x = lerp(smoothMouseRef.current.x, mouseRef.current.x, smoothFactor)
      smoothMouseRef.current.y = lerp(smoothMouseRef.current.y, mouseRef.current.y, smoothFactor)

      const { x: mx, y: my } = smoothMouseRef.current

      particlesRef.current.forEach(p => {
        // Spawn particle with spring-like velocity toward cursor area
        if (p.life === 0 && mx > -100) {
          const angle = Math.random() * Math.PI * 2
          const radius = Math.random() * 6
          p.x = mx + Math.cos(angle) * radius
          p.y = my + Math.sin(angle) * radius
          p.vx = (Math.random() - 0.5) * 0.8
          p.vy = (Math.random() - 0.5) * 0.8
          p.life = p.maxLife
          p.opacity = 0.7 + Math.random() * 0.3
          p.color = colors[Math.floor(Math.random() * colors.length)]
        }

        // Update particle with spring physics
        if (p.life > 0) {
          p.life--
          p.x += p.vx
          p.y += p.vy

          // Spring deceleration with slight drift toward mouse
          p.vx *= 0.94
          p.vy *= 0.94

          // Pulsating opacity with sine wave
          const lifeRatio = p.life / p.maxLife
          const pulse = Math.sin(time * 4 + p.phase) * 0.15 + 0.85
          p.opacity = lifeRatio * pulse * 0.75

          // Core size with pulse
          const coreSize = p.size * (0.4 + pulse * 0.2)

          // === Outer glow (largest, most transparent) ===
          const outerGlow = p.size * 5
          const outerGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, outerGlow)
          outerGradient.addColorStop(0, p.color + '40')
          outerGradient.addColorStop(0.5, p.color + '15')
          outerGradient.addColorStop(1, p.color + '00')
          ctx.beginPath()
          ctx.arc(p.x, p.y, outerGlow, 0, Math.PI * 2)
          ctx.fillStyle = outerGradient
          ctx.fill()

          // === Mid glow (medium layer) ===
          const midGlow = p.size * 2.5
          const midGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, midGlow)
          midGradient.addColorStop(0, p.color + 'aa')
          midGradient.addColorStop(0.4, p.color + '55')
          midGradient.addColorStop(1, p.color + '00')
          ctx.beginPath()
          ctx.arc(p.x, p.y, midGlow, 0, Math.PI * 2)
          ctx.fillStyle = midGradient
          ctx.fill()

          // === Core dot (brightest, solid center) ===
          ctx.beginPath()
          ctx.arc(p.x, p.y, coreSize, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()

          // === Bright center highlight ===
          const highlightSize = coreSize * 0.4
          ctx.beginPath()
          ctx.arc(p.x, p.y, highlightSize, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.fill()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isEnabled, initParticles, lerp, colors])

  if (!isEnabled) return null

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  )
}

export default CursorTrail
