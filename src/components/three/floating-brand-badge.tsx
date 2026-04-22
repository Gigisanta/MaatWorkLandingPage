'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Html } from '@react-three/drei'
import type { Group, Mesh, MeshStandardMaterial, MeshBasicMaterial } from 'three'
import { BackSide } from 'three'
import { useReducedMotion } from '@/hooks'
import { CanvasErrorBoundary } from './canvas-error-boundary'

// ======================
// Animated Badge Component
// ======================

interface FloatingBadge3DProps {
  primary: string
  secondary?: string
  position?: [number, number, number]
  scale?: number
}

/**
 * Premium 3D floating brand badge with:
 * - Dramatic multi-source lighting
 * - Smooth spring-based animations
 * - Interactive hover effects
 * - Reduced motion support
 */
export function FloatingBadge3D({
  primary,
  secondary,
  position = [0, 0, 0],
  scale = 1,
}: FloatingBadge3DProps) {
  const groupRef = useRef<Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  const targetScale = useRef(1)
  const currentScale = useRef(1)

  // Hover handlers
  const handlePointerEnter = useCallback(() => {
    if (!prefersReducedMotion) {
      setIsHovered(true)
      targetScale.current = 1.08
    }
  }, [prefersReducedMotion])

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false)
    targetScale.current = 1
  }, [])

  // Mouse tracking for subtle rotation on hover
  useFrame((state) => {
    if (!groupRef.current || prefersReducedMotion) return

    const time = state.clock.getElapsedTime()

    if (isHovered) {
      // Subtle rotation towards mouse
      const mx = state.mouse.x * 0.15
      const my = state.mouse.y * 0.15
      targetRotation.current.x = my
      targetRotation.current.y = mx
    } else {
      // Return to center
      targetRotation.current.x *= 0.95
      targetRotation.current.y *= 0.95
    }

    // Smooth interpolation (spring-like)
    const springFactor = 0.08
    currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * springFactor
    currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * springFactor
    currentScale.current += (targetScale.current - currentScale.current) * springFactor

    // Apply transforms
    groupRef.current.rotation.x = currentRotation.current.x
    groupRef.current.rotation.y = currentRotation.current.y
    groupRef.current.scale.setScalar(scale * currentScale.current)
  })

  return (
    <Float
      position={position}
      speed={prefersReducedMotion ? 0 : 1.5}
      rotationIntensity={prefersReducedMotion ? 0 : 0.3}
      floatIntensity={prefersReducedMotion ? 0 : 0.5}
    >
      <group
        ref={groupRef}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Main badge body with dramatic metallic finish */}
        <RoundedBox args={[3, 1.2, 0.15]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={2.5}
          />
        </RoundedBox>

        {/* Inner glow border */}
        <RoundedBox args={[3.02, 1.22, 0.13]} radius={0.155} smoothness={4}>
          <meshBasicMaterial color="#6366f1" transparent opacity={0.4} />
        </RoundedBox>

        {/* Outer glow halo */}
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[3.8, 1.9]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={isHovered ? 0.2 : 0.08} />
        </mesh>

        {/* Secondary outer glow for depth */}
        <mesh position={[0, 0, -0.12]}>
          <planeGeometry args={[4.2, 2.2]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={isHovered ? 0.1 : 0.04} />
        </mesh>

        {/* Primary text - using Html instead of Text for lighter bundle */}
        <Html
          position={[0, 0.1, 0.1]}
          center
          style={{
            color: '#ffffff',
            fontSize: '0.35em',
            letterSpacing: '0.05em',
            fontFamily: 'inherit',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {primary}
        </Html>

        {/* Secondary text */}
        {secondary && (
          <Html
            position={[0, -0.35, 0.1]}
            center
            style={{
              color: '#8b5cf6',
              fontSize: '0.18em',
              letterSpacing: '0.1em',
              fontFamily: 'inherit',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {secondary}
          </Html>
        )}
      </group>
    </Float>
  )
}

// ======================
// Animated Torus Knot
// ======================

interface AnimatedTorusKnotProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>
  position?: [number, number, number]
}

export function AnimatedTorusKnot({
  mousePosition,
  position = [0, 0, 0],
}: AnimatedTorusKnotProps) {
  const meshRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0 })
  const prefersReducedMotion = useReducedMotion()

  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()

    // Mouse influence - reduced when prefers-reduced-motion
    const mx = prefersReducedMotion ? 0 : mousePosition.current.x * 0.3
    const my = prefersReducedMotion ? 0 : mousePosition.current.y * 0.3

    // Smooth rotation towards mouse
    const lerpFactor = prefersReducedMotion ? 0.02 : 0.05
    targetRotation.current.x += (my - targetRotation.current.x) * lerpFactor
    targetRotation.current.y += (mx - targetRotation.current.y) * lerpFactor

    // Continuous rotation - slower or zero when reduced motion
    const rotSpeed = prefersReducedMotion ? 0.05 : 0.2
    meshRef.current.rotation.x = targetRotation.current.x + time * rotSpeed
    meshRef.current.rotation.y = targetRotation.current.y + time * (rotSpeed * 1.5)

    // Glow follows main mesh with offset
    if (glowRef.current) {
      glowRef.current.rotation.x = meshRef.current.rotation.x * 0.8
      glowRef.current.rotation.y = meshRef.current.rotation.y * 0.8 + time * 0.1
      const pulseSpeed = prefersReducedMotion ? 1 : 2
      const pulseAmount = prefersReducedMotion ? 0.02 : 0.05
      const glowScale = 1.15 + Math.sin(time * pulseSpeed) * pulseAmount
      glowRef.current.scale.set(glowScale, glowScale, glowScale)
    }

    // Ring rotates independently
    if (ringRef.current) {
      const ringSpeed = prefersReducedMotion ? 0.05 : 0.15
      ringRef.current.rotation.x = time * ringSpeed
      ringRef.current.rotation.y = time * ringSpeed * 1.3
      const ringOpacity = prefersReducedMotion
        ? 0.2
        : 0.3 + Math.sin(time * 1.5) * 0.15
      ;(ringRef.current.material as MeshBasicMaterial).opacity = ringOpacity
    }
  })

  return (
    <group position={position}>
      {/* Main torus knot */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshStandardMaterial
          color="#6366f1"
          metalness={0.8}
          roughness={0.2}
          emissive="#8b5cf6"
          emissiveIntensity={prefersReducedMotion ? 0.1 : 0.3}
        />
      </mesh>

      {/* Outer glow layer */}
      <mesh ref={glowRef}>
        <torusKnotGeometry args={[1.1, 0.35, 64, 16]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={prefersReducedMotion ? 0.06 : 0.12}
          side={BackSide}
        />
      </mesh>

      {/* Wireframe accent */}
      <mesh ref={ringRef}>
        <torusKnotGeometry args={[1.02, 0.31, 64, 16]} />
        <meshBasicMaterial
          color="#a78bfa"
          wireframe
          transparent
          opacity={prefersReducedMotion ? 0.1 : 0.25}
        />
      </mesh>
    </group>
  )
}

// ======================
// Hero Scene Inner (scroll-driven)
// ======================

interface HeroSceneContentProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>
  targetScroll: React.MutableRefObject<number>
  prefersReducedMotion: boolean
}

function HeroSceneContent({ mousePosition, targetScroll, prefersReducedMotion }: HeroSceneContentProps) {
  const smoothScroll = useRef(0)
  const scrollVel = useRef(0)
  const torusGroupRef = useRef<Group>(null)
  const ringGroupRef = useRef<Group>(null)
  const ringRef = useRef<Mesh>(null)
  const ringGlowRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!prefersReducedMotion) {
      const dx = targetScroll.current - smoothScroll.current
      scrollVel.current += dx * 80 * delta
      scrollVel.current *= 1 - 15 * delta
      smoothScroll.current = Math.max(0, Math.min(1, smoothScroll.current + scrollVel.current * delta))
    }

    const scroll = prefersReducedMotion ? 0 : smoothScroll.current

    if (torusGroupRef.current) {
      torusGroupRef.current.position.y = -1 + scroll * -3
      torusGroupRef.current.rotation.y = scroll * Math.PI * 0.5
    }

    if (ringGroupRef.current) {
      ringGroupRef.current.position.y = 2 + scroll * 2.5
      ringGroupRef.current.position.x = -3 - scroll * 1.5
    }

    if (ringRef.current) {
      (ringRef.current.material as MeshStandardMaterial).opacity =
        Math.max(0, 0.5 - scroll * 0.7)
    }

    if (ringGlowRef.current) {
      (ringGlowRef.current.material as MeshBasicMaterial).opacity =
        Math.max(0, 0.1 - scroll * 0.12)
    }
  })

  return (
    <>
      <group ref={torusGroupRef}>
        <AnimatedTorusKnot mousePosition={mousePosition} position={[3, 0, -2]} />
      </group>

      <group ref={ringGroupRef}>
        <mesh ref={ringRef} rotation={[0.5, 0.5, 0]}>
          <torusGeometry args={[1.5, 0.05, 16, 100]} />
          <meshStandardMaterial
            color="#6366f1"
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={prefersReducedMotion ? 0.3 : 0.5}
            emissive="#6366f1"
            emissiveIntensity={prefersReducedMotion ? 0.1 : 0.2}
          />
        </mesh>
        <mesh ref={ringGlowRef} position={[0, 0, -0.1]} rotation={[0.5, 0.5, 0]}>
          <torusGeometry args={[1.7, 0.15, 16, 100]} />
          <meshBasicMaterial color="#6366f1" transparent opacity={prefersReducedMotion ? 0.05 : 0.1} />
        </mesh>
      </group>
    </>
  )
}

// ======================
// Hero 3D Scene
// ======================

export function Hero3DScene() {
  const mousePosition = useRef({ x: 0, y: 0 })
  const targetScroll = useRef(0)
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setIsClient(true)
    setIsMobile(window.innerWidth < 768)

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const handleScroll = () => {
      targetScroll.current = Math.min(window.scrollY / window.innerHeight, 1)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!isClient || isMobile) {
    // Loading skeleton for server-side rendering and mobile
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-label="Cargando escena 3D..."
        role="status"
      >
        {/* Floating badge skeleton */}
        <div className="relative w-[180px] h-[72px] animate-pulse">
          {/* Badge body */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f0a1e]"
            style={{ boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)' }} />

          {/* Glow border */}
          <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-br from-primary/40 via-transparent to-primary/20 opacity-60" />

          {/* Text placeholder */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className="w-20 h-3 rounded bg-white/20" />
            <div className="w-14 h-2 rounded bg-primary/40" />
          </div>

          {/* Ambient glow */}
          <div className="absolute inset-[-20px] rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-accent-purple/10 blur-xl opacity-50" />
        </div>
      </div>
    )
  }

  return (
    <CanvasErrorBoundary>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={prefersReducedMotion ? 0.6 : 0.4} />
        <directionalLight position={[5, 5, 5]} intensity={prefersReducedMotion ? 0.3 : 0.6} />
        <pointLight position={[-5, -5, 5]} intensity={prefersReducedMotion ? 0.2 : 0.4} color="#8b5cf6" />
        <pointLight position={[3, 2, 4]} intensity={prefersReducedMotion ? 0.15 : 0.3} color="#6366f1" />
        <pointLight position={[-2, 3, -3]} intensity={prefersReducedMotion ? 0.1 : 0.2} color="#22c55e" />
        <pointLight position={[0, -3, 2]} intensity={prefersReducedMotion ? 0.1 : 0.15} color="#f472b6" />

        <HeroSceneContent
          mousePosition={mousePosition}
          targetScroll={targetScroll}
          prefersReducedMotion={prefersReducedMotion}
        />
      </Canvas>
    </CanvasErrorBoundary>
  )
}

export default FloatingBadge3D
