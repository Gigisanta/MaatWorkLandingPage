'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import type { Group, Mesh, SpotLight, PointLight, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { MathUtils, ACESFilmicToneMapping } from 'three'
import { useReducedMotion } from '@/hooks'
import { CanvasErrorBoundary } from './canvas-error-boundary'

// App screen data
const APP_SCREENS = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #0f0a1e 100%)',
    content: (
      <div className="p-3 h-full flex flex-col gap-2">
        <div className="text-xs text-white/60">Bienvenido</div>
        <div className="text-lg font-bold text-white">Mesas Activas</div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-16 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center"
            >
              <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
            </div>
          ))}
        </div>
        <div className="mt-auto">
          <div className="text-xs text-white/40 mb-1">Ventas Hoy</div>
          <div className="text-xl font-bold gradient-brand-text">$12,450</div>
        </div>
      </div>
    ),
  },
  {
    id: 'turnos',
    title: 'Turnos',
    gradient: 'linear-gradient(135deg, #0f2027 0%, #1a1a2e 100%)',
    content: (
      <div className="p-3 h-full flex flex-col gap-2">
        <div className="text-xs text-white/60">Hoy - Mayo 15</div>
        {[9, 10, 11, 14].map((hora) => (
          <div
            key={hora}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="text-xs font-mono text-primary">{hora}:00</div>
            <div className="text-xs text-white/80">Disponible</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    gradient: 'linear-gradient(135deg, #1a2a1a 0%, #0f1a0f 100%)',
    content: (
      <div className="p-3 h-full flex flex-col gap-2">
        <div className="text-xs text-white/60">Mensajes Automatizados</div>
        {[
          { nombre: 'Maria G.', msg: 'Hola! Quiero reservar...' },
          { nombre: 'Carlos R.', msg: 'Que horarios tienen?' },
        ].map((chat, i) => (
          <div
            key={i}
            className="p-2 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="text-xs font-medium text-white/90">{chat.nombre}</div>
            <div className="text-xs text-white/60 truncate">{chat.msg}</div>
          </div>
        ))}
        <div className="mt-auto flex items-center gap-2 p-2 rounded-lg bg-accent-green/20 border border-accent-green/30">
          <div className="w-2 h-2 rounded-full bg-accent-green" />
          <div className="text-xs text-accent-green">Auto-respondiendo</div>
        </div>
      </div>
    ),
  },
]

// Entry animation wrapper
function EntryAnimation({
  children,
  delay = 0,
  reducedMotion,
}: {
  children: React.ReactNode
  delay?: number
  reducedMotion: boolean
}) {
  const groupRef = useRef<Group>(null)
  const progress = useRef(0)
  const startTime = useRef<number | null>(null)

  useFrame((state) => {
    if (!groupRef.current || reducedMotion) {
      if (groupRef.current) {
        groupRef.current.scale.setScalar(1)
        groupRef.current.position.set(0, 0, 0)
      }
      return
    }

    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime
    }

    const elapsed = state.clock.elapsedTime - startTime.current - delay
    if (elapsed < 0) return

    progress.current = Math.min(1, elapsed / 1.2)

    // Spring-like easing (expo out)
    const t = 1 - Math.pow(1 - progress.current, 4)

    // Scale from 0.3 to 1
    const scale = 0.3 + t * 0.7
    groupRef.current.scale.setScalar(scale)

    // Fade and rise effect
    groupRef.current.position.y = (1 - t) * 1.5
    groupRef.current.position.z = (1 - t) * -2
  })

  return <group ref={groupRef}>{children}</group>
}

// Dramatic lighting setup
function DramaticLighting({ isHovered }: { isHovered: boolean }) {
  const spotLight1Ref = useRef<SpotLight>(null)
  const spotLight2Ref = useRef<SpotLight>(null)
  const rimLightRef = useRef<PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    // Subtle light animation for "breathing" effect
    if (spotLight1Ref.current) {
      spotLight1Ref.current.intensity = 2 + Math.sin(t * 0.5) * 0.3
    }
    if (spotLight2Ref.current) {
      spotLight2Ref.current.intensity = 1.5 + Math.cos(t * 0.7) * 0.2
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = isHovered ? 2 : 1.2
    }
  })

  return (
    <>
      {/* Key light - warm from top right */}
      <spotLight
        ref={spotLight1Ref}
        position={[4, 6, 5]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
        color="#fff5e6"
        castShadow
      />

      {/* Fill light - cool purple from left */}
      <spotLight
        ref={spotLight2Ref}
        position={[-5, 2, 4]}
        angle={0.5}
        penumbra={1}
        intensity={1.5}
        color="#a78bfa"
      />

      {/* Rim light - cyan backlight for edge definition */}
      <pointLight
        ref={rimLightRef}
        position={[0, 0, -4]}
        intensity={1.2}
        color="#22d3ee"
      />

      {/* Bottom accent light */}
      <pointLight
        position={[0, -4, 2]}
        intensity={0.6}
        color="#6366f1"
      />

      {/* Ambient for base illumination */}
      <ambientLight intensity={0.15} />
    </>
  )
}

interface PhoneModelProps {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
  activeScreen: number
  onScreenChange: (index: number) => void
  onHoverChange: (hovered: boolean) => void
}

function PhoneModel({
  mousePosition,
  reducedMotion,
  activeScreen,
  onScreenChange,
  onHoverChange,
}: PhoneModelProps) {
  const groupRef = useRef<Group>(null)
  const screenRef = useRef<Mesh>(null)
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })
  const targetScale = useRef(1)
  const currentScale = useRef(1)
  const touchStartX = useRef(0)
  const isDragging = useRef(false)
  const isHovered = useRef(false)

  const phoneWidth = 1.4
  const phoneHeight = 2.8
  const phoneDepth = 0.08
  const screenWidth = 1.2
  const screenHeight = 2.3

  // Screen transition animation
  const screenOpacity = useRef(1)
  const targetScreenOpacity = useRef(1)

  useFrame(() => {
    if (!groupRef.current) return

    if (reducedMotion) {
      // Reset to defaults when reduced motion
      currentRotation.current = { x: 0, y: 0 }
      currentScale.current = 1
      groupRef.current.rotation.set(0, 0, 0)
      groupRef.current.scale.setScalar(1)
      return
    }

    // Mouse parallax effect
    targetRotation.current.x = mousePosition.current.y * 0.2
    targetRotation.current.y = mousePosition.current.x * 0.3

    // Smooth interpolation
    currentRotation.current.x = MathUtils.lerp(
      currentRotation.current.x,
      targetRotation.current.x,
      0.06
    )
    currentRotation.current.y = MathUtils.lerp(
      currentRotation.current.y,
      targetRotation.current.y,
      0.06
    )

    // Hover scale effect
    targetScale.current = isHovered.current ? 1.08 : 1
    currentScale.current = MathUtils.lerp(currentScale.current, targetScale.current, 0.1)

    groupRef.current.rotation.x = currentRotation.current.x
    groupRef.current.rotation.y = currentRotation.current.y
    groupRef.current.scale.setScalar(currentScale.current)

    // Screen opacity for transition
    screenOpacity.current = MathUtils.lerp(screenOpacity.current, targetScreenOpacity.current, 0.15)
  })

  const handlePointerDown = useCallback((e: { nativeEvent: PointerEvent }) => {
    isDragging.current = true
    touchStartX.current = e.nativeEvent.clientX
  }, [])

  const handlePointerUp = useCallback(
    (e: { nativeEvent: PointerEvent }) => {
      if (!isDragging.current) return
      isDragging.current = false

      const deltaX = e.nativeEvent.clientX - touchStartX.current
      const threshold = 50

      if (Math.abs(deltaX) > threshold) {
        // Trigger screen transition
        targetScreenOpacity.current = 0

        setTimeout(() => {
          if (deltaX > 0) {
            onScreenChange((activeScreen - 1 + APP_SCREENS.length) % APP_SCREENS.length)
          } else {
            onScreenChange((activeScreen + 1) % APP_SCREENS.length)
          }
          targetScreenOpacity.current = 1
        }, 150)
      }
    },
    [activeScreen, onScreenChange]
  )

  const handlePointerEnter = useCallback(() => {
    isHovered.current = true
    onHoverChange(true)
    document.body.style.cursor = 'grab'
  }, [onHoverChange])

  const handlePointerLeave = useCallback(() => {
    isHovered.current = false
    onHoverChange(false)
    document.body.style.cursor = 'auto'
  }, [onHoverChange])

  return (
    <Float
      speed={1.2}
      rotationIntensity={reducedMotion ? 0 : 0.15}
      floatIntensity={reducedMotion ? 0 : 0.4}
    >
      <EntryAnimation delay={0.3} reducedMotion={reducedMotion}>
        <group
          ref={groupRef}
          position={[0, 0, 0]}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
        >
          {/* Phone body - premium dark material */}
          <RoundedBox args={[phoneWidth, phoneHeight, phoneDepth]} radius={0.12} smoothness={6}>
            <meshStandardMaterial
              color="#0d0d1a"
              metalness={0.95}
              roughness={0.15}
              envMapIntensity={1.2}
            />
          </RoundedBox>

          {/* Subtle edge highlight */}
          <RoundedBox args={[phoneWidth + 0.01, phoneHeight + 0.01, phoneDepth - 0.005]} radius={0.13} smoothness={6}>
            <meshBasicMaterial
              color="#4a4a8a"
              transparent
              opacity={0.15}
            />
          </RoundedBox>

          {/* Inner bezel with metallic finish */}
          <RoundedBox args={[phoneWidth - 0.03, phoneHeight - 0.03, phoneDepth - 0.02]} radius={0.08} smoothness={6}>
            <meshStandardMaterial
              color="#1a1a2e"
              metalness={0.85}
              roughness={0.25}
            />
          </RoundedBox>

          {/* Screen with glass-like material */}
          <mesh ref={screenRef} position={[0, 0, phoneDepth / 2 + 0.002]}>
            <planeGeometry args={[screenWidth, screenHeight]} />
            <meshStandardMaterial
              color="#050510"
              metalness={0.4}
              roughness={0.1}
              envMapIntensity={0.8}
            />
          </mesh>

          {/* Screen glass reflection layer */}
          <mesh position={[0, 0, phoneDepth / 2 + 0.003]}>
            <planeGeometry args={[screenWidth, screenHeight]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.03}
            />
          </mesh>

          {/* Notch */}
          <mesh position={[0, phoneHeight / 2 - 0.2, phoneDepth / 2 + 0.01]}>
            <boxGeometry args={[0.25, 0.06, 0.015]} />
            <meshStandardMaterial color="#0a0a15" metalness={0.5} roughness={0.3} />
          </mesh>

          {/* Camera dot in notch */}
          <mesh position={[0.08, phoneHeight / 2 - 0.2, phoneDepth / 2 + 0.012]}>
            <circleGeometry args={[0.02, 16]} />
            <meshBasicMaterial color="#1a1a2a" />
          </mesh>

          {/* Screen indicator dots */}
          <group position={[0, -phoneHeight / 2 + 0.18, phoneDepth / 2 + 0.01]}>
            {APP_SCREENS.map((_, index) => (
              <mesh key={index} position={[(index - 1) * 0.22, 0, 0]}>
                <circleGeometry args={[0.025, 16]} />
                <meshBasicMaterial
                  color={index === activeScreen ? '#818cf8' : '#3f3f6a'}
                  transparent
                  opacity={index === activeScreen ? 1 : 0.4}
                />
              </mesh>
            ))}
          </group>

          {/* Side buttons - power and volume */}
          <mesh position={[phoneWidth / 2 + 0.025, 0.35, 0]}>
            <boxGeometry args={[0.015, 0.12, 0.04]} />
            <meshStandardMaterial color="#2a2a4e" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[phoneWidth / 2 + 0.025, 0.08, 0]}>
            <boxGeometry args={[0.015, 0.08, 0.04]} />
            <meshStandardMaterial color="#2a2a4e" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[-phoneWidth / 2 - 0.025, 0.15, 0]}>
            <boxGeometry args={[0.015, 0.1, 0.04]} />
            <meshStandardMaterial color="#2a2a4e" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Charging port at bottom */}
          <mesh position={[0, -phoneHeight / 2 - 0.01, 0]}>
            <boxGeometry args={[0.08, 0.01, 0.03]} />
            <meshStandardMaterial color="#0a0a15" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Speaker grille at bottom */}
          <mesh position={[0, -phoneHeight / 2 + 0.06, phoneDepth / 2 + 0.005]}>
            <boxGeometry args={[0.15, 0.01, 0.01]} />
            <meshStandardMaterial color="#0a0a15" metalness={0.6} roughness={0.4} />
          </mesh>
        </group>
      </EntryAnimation>
    </Float>
  )
}

// HTML overlay for app screen content with transition
function ScreenOverlay({ activeScreen }: { activeScreen: number }) {
  const [opacity, setOpacity] = useState(1)

  useEffect(() => {
    setOpacity(0)
    const timeout = setTimeout(() => setOpacity(1), 150)
    return () => clearTimeout(timeout)
  }, [activeScreen])

  const currentScreen = APP_SCREENS[activeScreen]

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className="pointer-events-none"
        style={{
          width: '168px',
          height: '322px',
          borderRadius: '20px',
          overflow: 'hidden',
          background: currentScreen.gradient,
          padding: '12px',
          opacity,
          transition: 'opacity 0.15s ease-out',
        }}
      >
        <div className="h-full flex flex-col">
          {currentScreen.content.props.children}
        </div>
      </div>
    </div>
  )
}

interface PhoneMockupProps {
  className?: string
}

export function PhoneMockup({ className }: PhoneMockupProps) {
  const [mounted, setMounted] = useState(false)
  const reducedMotion = useReducedMotion()
  const [activeScreen, setActiveScreen] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
    setIsMobile(window.innerWidth < 768)

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleScreenChange = useCallback((index: number) => {
    setActiveScreen(index)
  }, [])

  const handleHoverChange = useCallback((hovered: boolean) => {
    setIsHovered(hovered)
  }, [])

  if (!mounted) {
    return (
      <div
        className={`relative w-[180px] h-[360px] rounded-3xl overflow-hidden ${className || ''}`}
        aria-label="Cargando mockup del telefono..."
        role="status"
      >
        {/* Dark glassmorphic skeleton background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d0d1a] via-[#1a1a2e] to-[#0f0a1e]" />

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
              {/* Content placeholders */}
              <div className="absolute top-4 left-3 right-3 space-y-2">
                <div className="h-2 w-16 rounded bg-white/10 animate-pulse" />
                <div className="h-4 w-24 rounded bg-white/15 animate-pulse delay-75" />
                <div className="flex gap-1.5 mt-3">
                  <div className="w-10 h-8 rounded-lg bg-primary/20 animate-pulse delay-150" />
                  <div className="w-10 h-8 rounded-lg bg-primary/15 animate-pulse delay-200" />
                  <div className="w-10 h-8 rounded-lg bg-primary/10 animate-pulse delay-300" />
                </div>
              </div>
            </div>

            {/* Bottom navigation dots skeleton */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse delay-200" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse delay-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse delay-400" />
            </div>
          </div>
        </div>

        {/* Ambient glow effect */}
        <div className="absolute inset-0 rounded-3xl shadow-2xl" style={{
          boxShadow: '0 0 40px rgba(99, 102, 241, 0.15), inset 0 0 20px rgba(99, 102, 241, 0.05)'
        }} />
      </div>
    )
  }

  return (
    <div
      className={`relative w-[180px] h-[360px] ${className || ''}`}
    >
      {/* 3D Phone Canvas */}
      <CanvasErrorBoundary>
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 4], fov: 42 }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            frameloop="demand"
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
          >
            {/* Lighting instead of heavy HDR Environment */}
            <DramaticLighting isHovered={isHovered} />

            <PhoneModel
              mousePosition={mousePosition}
              reducedMotion={reducedMotion}
              activeScreen={activeScreen}
              onScreenChange={handleScreenChange}
              onHoverChange={handleHoverChange}
            />
          </Canvas>
        </div>
      </CanvasErrorBoundary>

      {/* Screen content overlay */}
      <ScreenOverlay activeScreen={activeScreen} />

      {/* Touch hint - swipe indicator */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/40 text-xs whitespace-nowrap">
        <svg
          className={`w-4 h-4 ${reducedMotion ? '' : 'animate-pulse'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        <span>Swipe to explore</span>
      </div>
    </div>
  )
}
