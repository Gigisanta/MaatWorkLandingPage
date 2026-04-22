'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Torus, Icosahedron, TorusKnot } from '@react-three/drei'
import type { MeshStandardMaterial, MeshBasicMaterial, InstancedMesh, PointLight, Group, Mesh } from 'three'
import { Object3D, Color, BackSide } from 'three'
import { useReducedMotion } from '@/hooks'
import { CanvasErrorBoundary } from './canvas-error-boundary'

// Lerp utility
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor
}

// Seeded random for stable particle initialization
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return x - Math.floor(x)
}

// Premium color palette
const PARTICLE_COLORS = [
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#a78bfa', // purple
  '#22c55e', // emerald
  '#f472b6', // pink
]

interface ParticleData {
  t: number
  factor: number
  speed: number
  xFactor: number
  yFactor: number
  zFactor: number
  pulseOffset: number
  colorIndex: number
  trailPhase: number
}

function Particles({ count = 80, mousePosition, scrollOffset, reducedMotion }: {
  count?: number
  mousePosition: React.MutableRefObject<{ x: number; y: number }>
  scrollOffset: React.MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
}) {
  const mesh = useRef<InstancedMesh>(null)
  const glowMesh = useRef<InstancedMesh>(null)
  const trailMesh = useRef<InstancedMesh>(null)
  const lightRef = useRef<PointLight>(null)
  const groupRef = useRef<Group>(null)
  const mouseVelocity = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const prevPositions = useRef<Float32Array | null>(null)

  const dummy = useMemo(() => new Object3D(), [])

  // Initialize position buffer once based on count
  if (!prevPositions.current || prevPositions.current.length !== count * 3) {
    prevPositions.current = new Float32Array(count * 3)
  }

  const particles = useMemo<ParticleData[]>(() => {
    const temp: ParticleData[] = []
    for (let i = 0; i < count; i++) {
      const seed = i * 7.31
      const t = seededRandom(seed) * 100
      const factor = 20 + seededRandom(seed + 1) * 100
      const speed = 0.01 + seededRandom(seed + 2) / 200
      const xFactor = -50 + seededRandom(seed + 3) * 100
      const yFactor = -50 + seededRandom(seed + 4) * 100
      const zFactor = -50 + seededRandom(seed + 5) * 100
      const pulseOffset = seededRandom(seed + 7) * Math.PI * 2
      const colorIndex = Math.floor(seededRandom(seed + 8) * PARTICLE_COLORS.length)
      const trailPhase = seededRandom(seed + 9) * Math.PI * 2
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, pulseOffset, colorIndex, trailPhase })
    }
    return temp
  }, [count])

  useFrame((state, delta) => {
    if (!mesh.current || !glowMesh.current || !trailMesh.current) return

    const time = state.clock.getElapsedTime()
    const { pointer } = state

    // Smooth mouse following with easing
    const mouseEase = reducedMotion ? 1 : Math.min(delta * 3, 0.15)
    smoothMouse.current.x = lerp(smoothMouse.current.x, pointer.x, mouseEase)
    smoothMouse.current.y = lerp(smoothMouse.current.y, pointer.y, mouseEase)

    // Calculate mouse velocity for gentle drift
    mouseVelocity.current.x = lerp(mouseVelocity.current.x, pointer.x - smoothMouse.current.x, 0.1)
    mouseVelocity.current.y = lerp(mouseVelocity.current.y, pointer.y - smoothMouse.current.y, 0.1)

    // Apply scroll-based group rotation for parallax depth effect
    if (groupRef.current && !reducedMotion) {
      const scrollX = scrollOffset.current.x
      const scrollY = scrollOffset.current.y

      groupRef.current.rotation.y = lerp(groupRef.current.rotation.y, scrollX * 0.5, 0.08)
      groupRef.current.rotation.x = lerp(groupRef.current.rotation.x, scrollY * 0.3, 0.08)
    }

    particles.forEach((particle, i) => {
      const { factor, speed, xFactor, yFactor, zFactor, pulseOffset, trailPhase } = particle
      const t = particle.t + speed

      const s = Math.cos(t)

      // Smoother mouse influence
      const mx = smoothMouse.current.x * 2.5
      const my = smoothMouse.current.y * 2.5

      // Scroll influence on particle drift
      const scrollInfluence = reducedMotion ? { x: 0, y: 0 } : {
        x: scrollOffset.current.x * 1.5,
        y: scrollOffset.current.y * 1
      }

      // Subtle mouse drift effect
      const mouseDrift = reducedMotion ? { x: 0, y: 0 } : {
        x: mouseVelocity.current.x * 0.5,
        y: mouseVelocity.current.y * 0.5
      }

      // Pulsating size based on time with color shift
      const pulse = Math.sin(time * 1.5 + pulseOffset) * 0.2 + 1
      const baseScale = s * 0.25 + 0.6

      const posX = (mx + particle.xFactor / 50 + scrollInfluence.x + mouseDrift.x) * Math.cos(t * factor * 0.05) + Math.sin(t * 0.5) * 0.3 + xFactor * s * 0.25
      const posY = (my + particle.yFactor / 50 + scrollInfluence.y + mouseDrift.y) * Math.sin(t * factor * 0.05) + Math.cos(t * 0.5) * 0.3 + yFactor * s * 0.25
      const posZ = zFactor * s * 0.15

      dummy.position.set(posX, posY, posZ)

      const scale = baseScale * pulse
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.set(s * 1.5, s * 1.5, s * 2)
      dummy.updateMatrix()

      mesh.current!.setMatrixAt(i, dummy.matrix)

      // Glow effect - slightly larger, more transparent, with color variation
      dummy.scale.set(scale * 2.2, scale * 2.2, scale * 2.2)
      dummy.updateMatrix()
      glowMesh.current!.setMatrixAt(i, dummy.matrix)

      // Trail effect - only calculate for every 3rd particle to reduce work
      if (!reducedMotion && i % 3 === 0 && trailMesh.current) {
        const trailLength = scale * 1.5
        const prevIdx = i * 3
        const prevX = prevPositions.current?.[prevIdx] ?? posX
        const prevY = prevPositions.current?.[prevIdx + 1] ?? posY
        const prevZ = prevPositions.current?.[prevIdx + 2] ?? posZ

        // Direction of movement
        const dx = posX - prevX
        const dy = posY - prevY
        const dz = posZ - prevZ

        // Trail position (midpoint)
        dummy.position.set(posX - dx * 0.5, posY - dy * 0.5, posZ - dz * 0.5)
        dummy.scale.set(trailLength, scale * 0.4, scale * 0.4)
        // Align trail with movement direction
        dummy.rotation.set(dy * 2, dx * 2, dz * 2)
        dummy.updateMatrix()
        trailMesh.current.setMatrixAt(i, dummy.matrix)

        // Store current position for next frame
        if (prevPositions.current) {
          prevPositions.current[prevIdx] = posX
          prevPositions.current[prevIdx + 1] = posY
          prevPositions.current[prevIdx + 2] = posZ
        }
      }
    })
    mesh.current.instanceMatrix.needsUpdate = true
    glowMesh.current.instanceMatrix.needsUpdate = true
    trailMesh.current.instanceMatrix.needsUpdate = true

    // Update light position based on mouse with smooth lerp
    if (lightRef.current && !reducedMotion) {
      lightRef.current.position.x = lerp(lightRef.current.position.x, pointer.x * 5, 0.04)
      lightRef.current.position.y = lerp(lightRef.current.position.y, pointer.y * 5, 0.04)
      // Dynamic color shift on light
      const hue = (Math.sin(time * 0.5) + 1) / 2
      const color = new Color().setHSL(0.7 + hue * 0.15, 0.8, 0.6)
      lightRef.current.color = color
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main particles */}
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <octahedronGeometry args={[0.06, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={1.5}
          transparent
          opacity={0.9}
          metalness={0.7}
          roughness={0.1}
        />
      </instancedMesh>

      {/* Glow/trail particles */}
      <instancedMesh ref={glowMesh} args={[undefined, undefined, count]}>
        <octahedronGeometry args={[0.1, 0]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#8b5cf6"
          emissiveIntensity={0.8}
          transparent
          opacity={0.3}
          metalness={0.4}
          roughness={0.3}
        />
      </instancedMesh>

      {/* Motion trail particles */}
      <instancedMesh ref={trailMesh} args={[undefined, undefined, count]}>
        <capsuleGeometry args={[0.02, 0.15, 4, 8]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={0.15}
        />
      </instancedMesh>

      <pointLight ref={lightRef} color="#6366f1" intensity={1.2} distance={15} />
    </group>
  )
}

function FloatingShapes({ scrollOffset, reducedMotion, isMobile }: {
  scrollOffset: React.MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
  isMobile: boolean
}) {
  // Individual shape refs for scroll-driven parallax
  const sphere1Ref = useRef<Group>(null)
  const sphere2Ref = useRef<Group>(null)
  const torus1Ref = useRef<Group>(null)
  const torus2Ref = useRef<Group>(null)
  const ico1Ref = useRef<Group>(null)
  const bgSphereRef = useRef<Group>(null)
  const octaRef = useRef<Group>(null)
  const torus3Ref = useRef<Group>(null)
  const ico3Ref = useRef<Group>(null)
  const nebulaRef = useRef<Group>(null)

  // Initial positions
  const initialPositions = {
    sphere1: [-2.5, 0.5, -1.5] as [number, number, number],
    sphere2: [3, -0.5, -2] as [number, number, number],
    torus1: [-1.5, -1.5, -2] as [number, number, number],
    torus2: [2.5, 1.5, -1.5] as [number, number, number],
    ico1: [1, -1, -3] as [number, number, number],
    bgSphere: [0, 0, -4] as [number, number, number],
    octa: [-3, -0.8, -2.5] as [number, number, number],
    torus3: [3.5, 0.5, -2.5] as [number, number, number],
    ico3: [-1, 2, -3] as [number, number, number],
  }

  // Nebula particles for background depth
  const nebulaParticles = useMemo(() => {
    const temp: { position: [number, number, number]; scale: number; phase: number }[] = []
    for (let i = 0; i < (isMobile ? 20 : 50); i++) {
      const seed = i * 3.14159
      temp.push({
        position: [
          (seededRandom(seed) - 0.5) * 20,
          (seededRandom(seed + 1) - 0.5) * 15,
          -5 - seededRandom(seed + 2) * 8
        ],
        scale: 0.02 + seededRandom(seed + 3) * 0.08,
        phase: seededRandom(seed + 4) * Math.PI * 2
      })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (reducedMotion) return

    const time = state.clock.getElapsedTime()
    const scrollX = scrollOffset.current.x
    const scrollY = scrollOffset.current.y
    const depthMult = isMobile ? 0.5 : 1

    // Background sphere (farthest) - slowest movement
    if (bgSphereRef.current) {
      bgSphereRef.current.position.z = lerp(bgSphereRef.current.position.z, initialPositions.bgSphere[2] + scrollY * 2, 0.03)
    }

    // Far shapes - slow parallax
    if (torus1Ref.current) {
      torus1Ref.current.position.x = lerp(torus1Ref.current.position.x, initialPositions.torus1[0] + scrollX * 3 * depthMult, 0.04)
      torus1Ref.current.position.y = lerp(torus1Ref.current.position.y, initialPositions.torus1[1] + scrollY * 2 * depthMult, 0.04)
    }
    if (ico1Ref.current) {
      ico1Ref.current.position.x = lerp(ico1Ref.current.position.x, initialPositions.ico1[0] + scrollX * 2.5 * depthMult, 0.05)
      ico1Ref.current.position.y = lerp(ico1Ref.current.position.y, initialPositions.ico1[1] + scrollY * 1.5 * depthMult, 0.05)
    }

    // Mid shapes - medium parallax
    if (sphere1Ref.current) {
      sphere1Ref.current.position.x = lerp(sphere1Ref.current.position.x, initialPositions.sphere1[0] + scrollX * 2 * depthMult, 0.06)
      sphere1Ref.current.position.y = lerp(sphere1Ref.current.position.y, initialPositions.sphere1[1] + scrollY * 1.2 * depthMult, 0.06)
    }
    if (sphere2Ref.current) {
      sphere2Ref.current.position.x = lerp(sphere2Ref.current.position.x, initialPositions.sphere2[0] + scrollX * 1.8 * depthMult, 0.07)
      sphere2Ref.current.position.y = lerp(sphere2Ref.current.position.y, initialPositions.sphere2[1] + scrollY * depthMult, 0.07)
    }
    if (torus2Ref.current) {
      torus2Ref.current.position.x = lerp(torus2Ref.current.position.x, initialPositions.torus2[0] + scrollX * 1.5 * depthMult, 0.06)
      torus2Ref.current.position.y = lerp(torus2Ref.current.position.y, initialPositions.torus2[1] + scrollY * 1.3 * depthMult, 0.06)
    }

    // Near shapes - faster parallax
    if (octaRef.current) {
      octaRef.current.position.x = lerp(octaRef.current.position.x, initialPositions.octa[0] + scrollX * 4 * depthMult, 0.08)
      octaRef.current.position.y = lerp(octaRef.current.position.y, initialPositions.octa[1] + scrollY * 2.5 * depthMult, 0.08)
    }
    if (torus3Ref.current) {
      torus3Ref.current.position.x = lerp(torus3Ref.current.position.x, initialPositions.torus3[0] + scrollX * 3.5 * depthMult, 0.09)
      torus3Ref.current.position.y = lerp(torus3Ref.current.position.y, initialPositions.torus3[1] + scrollY * 2 * depthMult, 0.09)
    }
    if (ico3Ref.current) {
      ico3Ref.current.position.x = lerp(ico3Ref.current.position.x, initialPositions.ico3[0] + scrollX * 2.8 * depthMult, 0.08)
      ico3Ref.current.position.y = lerp(ico3Ref.current.position.y, initialPositions.ico3[1] + scrollY * 2.2 * depthMult, 0.08)
    }

    // Nebula pulsing
    if (nebulaRef.current) {
      nebulaRef.current.rotation.y = time * 0.02
      nebulaRef.current.rotation.x = Math.sin(time * 0.1) * 0.05
    }
  })

  // Reduced float parameters for motion reduction
  const floatParams = reducedMotion
    ? { speed: 0.3, rotationIntensity: 0.1, floatIntensity: 0.2 }
    : null

  return (
    <>
      {/* Nebula background particles */}
      <group ref={nebulaRef}>
        {nebulaParticles.map((particle, i) => (
          <mesh key={i} position={particle.position}>
            <sphereGeometry args={[particle.scale, 8, 8]} />
            <meshBasicMaterial
              color={PARTICLE_COLORS[i % PARTICLE_COLORS.length]}
              transparent
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Main purple sphere */}
      <group ref={sphere1Ref} position={initialPositions.sphere1}>
        <Float
          speed={floatParams?.speed ?? 1.5}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.3}
          floatIntensity={floatParams?.floatIntensity ?? 0.8}
        >
          <Sphere args={[0.8, 48, 48]}>
            <MeshDistortMaterial
              color="#8b5cf6"
              attach="material"
              distort={0.5}
              speed={reducedMotion ? 0.8 : 1.5}
              transparent
              opacity={0.65}
              metalness={0.4}
              roughness={0.3}
            />
          </Sphere>
        </Float>
      </group>

      {/* Green accent sphere */}
      <group ref={sphere2Ref} position={initialPositions.sphere2}>
        <Float
          speed={floatParams?.speed ?? 2}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.5}
          floatIntensity={floatParams?.floatIntensity ?? 1}
        >
          <Sphere args={[0.5, 32, 32]}>
            <MeshDistortMaterial
              color="#22c55e"
              attach="material"
              distort={0.4}
              speed={reducedMotion ? 1 : 2}
              transparent
              opacity={0.55}
              metalness={0.7}
              roughness={0.2}
            />
          </Sphere>
        </Float>
      </group>

      {/* Torus ring 1 */}
      <group ref={torus1Ref} position={initialPositions.torus1} rotation={[1, 0.5, 0]}>
        <Float
          speed={floatParams?.speed ?? 1.8}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.4}
          floatIntensity={floatParams?.floatIntensity ?? 0.6}
        >
          <Torus args={[0.6, 0.15, 16, 80]}>
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.5}
              transparent
              opacity={0.65}
              metalness={0.8}
              roughness={0.15}
            />
          </Torus>
        </Float>
      </group>

      {/* Torus ring 2 */}
      <group ref={torus2Ref} position={initialPositions.torus2} rotation={[0.5, 1, 0.5]}>
        <Float
          speed={floatParams?.speed ?? 2.2}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.6}
          floatIntensity={floatParams?.floatIntensity ?? 0.8}
        >
          <Torus args={[0.4, 0.12, 16, 64]}>
            <meshStandardMaterial
              color="#a78bfa"
              emissive="#a78bfa"
              emissiveIntensity={0.6}
              transparent
              opacity={0.55}
              metalness={0.85}
              roughness={0.1}
            />
          </Torus>
        </Float>
      </group>

      {/* Small icosahedron accent */}
      <group ref={ico1Ref} position={initialPositions.ico1}>
        <Float
          speed={floatParams?.speed ?? 1.6}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.8}
          floatIntensity={floatParams?.floatIntensity ?? 0.4}
        >
          <Icosahedron args={[0.3, 0]}>
            <meshStandardMaterial
              color="#f472b6"
              emissive="#f472b6"
              emissiveIntensity={0.7}
              transparent
              opacity={0.65}
              metalness={0.9}
              roughness={0.1}
            />
          </Icosahedron>
        </Float>
      </group>

      {/* Background sphere */}
      {!isMobile && <group ref={bgSphereRef} position={initialPositions.bgSphere}>
        <Float
          speed={floatParams?.speed ?? 0.8}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.1}
          floatIntensity={floatParams?.floatIntensity ?? 0.2}
        >
          <Sphere args={[1.2, 24, 24]}>
            <MeshDistortMaterial
              color="#1e1b4b"
              attach="material"
              distort={0.2}
              speed={reducedMotion ? 0.3 : 0.5}
              transparent
              opacity={0.35}
              metalness={0.3}
              roughness={0.7}
            />
          </Sphere>
        </Float>
      </group>}

      {/* Additional shapes for depth */}
      {!isMobile && <group ref={octaRef} position={initialPositions.octa}>
        <Float
          speed={floatParams?.speed ?? 1.2}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.5}
          floatIntensity={floatParams?.floatIntensity ?? 0.3}
        >
          <mesh>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#22c55e"
              emissiveIntensity={0.5}
              transparent
              opacity={0.55}
              metalness={0.8}
              roughness={0.15}
            />
          </mesh>
        </Float>
      </group>}

      {!isMobile && <group ref={torus3Ref} position={initialPositions.torus3} rotation={[0.3, 0.8, 0.2]}>
        <Float
          speed={floatParams?.speed ?? 1.9}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.7}
          floatIntensity={floatParams?.floatIntensity ?? 0.5}
        >
          <Torus args={[0.35, 0.1, 12, 48]}>
            <meshStandardMaterial
              color="#f472b6"
              emissive="#f472b6"
              emissiveIntensity={0.6}
              transparent
              opacity={0.6}
              metalness={0.85}
              roughness={0.1}
            />
          </Torus>
        </Float>
      </group>}

      {!isMobile && <group ref={ico3Ref} position={initialPositions.ico3}>
        <Float
          speed={floatParams?.speed ?? 1.4}
          rotationIntensity={floatParams?.rotationIntensity ?? 0.3}
          floatIntensity={floatParams?.floatIntensity ?? 0.6}
        >
          <Icosahedron args={[0.4, 0]}>
            <meshStandardMaterial
              color="#6366f1"
              emissive="#6366f1"
              emissiveIntensity={0.6}
              transparent
              opacity={0.5}
              metalness={0.7}
              roughness={0.2}
            />
          </Icosahedron>
        </Float>
      </group>}
    </>
  )
}

function CentralHeroMesh({ mousePosition, scrollOffset, reducedMotion }: {
  mousePosition: React.MutableRefObject<{ x: number; y: number }>
  scrollOffset: React.MutableRefObject<{ x: number; y: number }>
  reducedMotion: boolean
}) {
  const meshRef = useRef<Mesh>(null)
  const wireframeRef = useRef<Mesh>(null)
  const glowRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const lightRef = useRef<PointLight>(null)
  const light2Ref = useRef<PointLight>(null)

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    // Scroll-driven rotation offset
    const scrollRotX = reducedMotion ? 0 : scrollOffset.current.y * 0.4
    const scrollRotY = reducedMotion ? 0 : scrollOffset.current.x * 0.3

    // Mouse-based rotation with smoother response
    const mouseInfluence = reducedMotion ? 0.15 : 0.3
    const targetRotX = mousePosition.current.y * mouseInfluence + scrollRotX
    const targetRotY = mousePosition.current.x * mouseInfluence + scrollRotY

    // Apply scroll-based group movement for parallax
    if (groupRef.current && !reducedMotion) {
      groupRef.current.position.y = lerp(groupRef.current.position.y, scrollOffset.current.y * -0.5, 0.06)
    }

    if (meshRef.current) {
      // Smooth rotation following mouse + scroll
      const rotLerp = reducedMotion ? 0.08 : 0.05
      meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, targetRotX, rotLerp)
      meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, targetRotY + (reducedMotion ? 0 : time * 0.1), rotLerp)

      // Subtle pulsation with color shift
      const pulseSpeed = reducedMotion ? 0.8 : 1.5
      const pulse = Math.sin(time * pulseSpeed) * (reducedMotion ? 0.03 : 0.05) + 1
      meshRef.current.scale.set(pulse, pulse, pulse)

      // Dynamic material color shift
      const mat = meshRef.current.material as MeshStandardMaterial
      const hue = (Math.sin(time * 0.3) + 1) / 2
      mat.emissive.setHSL(0.7 + hue * 0.08, 0.8, 0.4)
    }

    if (wireframeRef.current && !reducedMotion) {
      // Wireframe follows main mesh rotation with slight offset
      wireframeRef.current.rotation.x = meshRef.current!.rotation.x + 0.1
      wireframeRef.current.rotation.y = meshRef.current!.rotation.y + 0.15 + time * 0.05

      // Faster pulsation for wireframe
      const wirePulse = Math.sin(time * 2.5) * 0.08 + 1
      wireframeRef.current.scale.set(wirePulse, wirePulse, wirePulse)

      // Opacity pulse with color variation
      const mat = wireframeRef.current.material as MeshBasicMaterial
      mat.opacity = 0.15 + Math.sin(time * 2) * 0.08
      const hue = (Math.sin(time * 0.5) + 1) / 2
      mat.color.setHSL(0.75 + hue * 0.1, 0.9, 0.7)
    }

    if (glowRef.current && !reducedMotion) {
      // Glow mesh rotates slower
      glowRef.current.rotation.x = time * 0.08
      glowRef.current.rotation.y = time * 0.12

      // Stronger pulsation for glow
      const glowPulse = Math.sin(time * 1.8) * 0.1 + 1.2
      glowRef.current.scale.set(glowPulse, glowPulse, glowPulse)

      // Glow color shift
      const mat = glowRef.current.material as MeshBasicMaterial
      const hue = (Math.sin(time * 0.4 + 1) + 1) / 2
      mat.color.setHSL(0.72 + hue * 0.12, 0.85, 0.6)
    }

    // Dynamic light movement following mouse
    if (lightRef.current && !reducedMotion) {
      lightRef.current.position.x = lerp(lightRef.current.position.x, mousePosition.current.x * 3, 0.05)
      lightRef.current.position.y = lerp(lightRef.current.position.y, mousePosition.current.y * 3, 0.05)
      // Color shift on main light
      const hue = (Math.sin(time * 0.3) + 1) / 2
      lightRef.current.color.setHSL(0.72 + hue * 0.1, 0.8, 0.5)
    }

    // Secondary light for extra glow
    if (light2Ref.current && !reducedMotion) {
      light2Ref.current.position.x = lerp(light2Ref.current.position.x, -mousePosition.current.x * 2, 0.03)
      light2Ref.current.position.y = lerp(light2Ref.current.position.y, -mousePosition.current.y * 2, 0.03)
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Dynamic point light attached to hero */}
      <pointLight ref={lightRef} color="#8b5cf6" intensity={1.5} distance={10} decay={2} />
      {/* Secondary accent light */}
      <pointLight ref={light2Ref} color="#22c55e" intensity={0.6} distance={8} decay={2} />

      {/* Main TorusKnot - solid */}
      <TorusKnot ref={meshRef} args={[0.9, 0.25, 64, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.7}
          transparent
          opacity={0.9}
          metalness={0.75}
          roughness={0.1}
        />
      </TorusKnot>

      {/* Wireframe overlay for complexity */}
      <TorusKnot ref={wireframeRef} args={[0.92, 0.26, 48, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#8b5cf6"
          wireframe
          transparent
          opacity={0.25}
        />
      </TorusKnot>

      {/* Inner glow layer */}
      <TorusKnot ref={glowRef} args={[1.05, 0.35, 64, 12]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.15}
          side={BackSide}
        />
      </TorusKnot>

      {/* Outer ambient glow */}
      <mesh>
        <sphereGeometry args={[1.5, 24, 24]} />
        <meshBasicMaterial
          color="#6366f1"
          transparent
          opacity={0.04}
          side={BackSide}
        />
      </mesh>
    </group>
  )
}

function Scene({ mousePosition, isMobile, particleCount, scrollOffset, reducedMotion }: { mousePosition: React.MutableRefObject<{ x: number; y: number }>; isMobile: boolean; particleCount: number; scrollOffset: React.MutableRefObject<{ x: number; y: number }>; reducedMotion: boolean }) {
  // Reduced particle count on mobile for performance
  const adjustedParticleCount = isMobile ? Math.floor(particleCount * 0.4) : particleCount

  return (
    <>
      {/* Improved ambient lighting */}
      <ambientLight intensity={reducedMotion ? 0.5 : 0.35} />

      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={reducedMotion ? 0.5 : 0.7}
        color="#ffffff"
      />

      {/* Optimized point lights - fewer on mobile and reduced motion */}
      {isMobile || reducedMotion ? (
        <pointLight position={[0, 0, 5]} color="#6366f1" intensity={0.5} distance={12} decay={2} />
      ) : (
        <>
          {/* Fill light - purple */}
          <pointLight position={[-8, -8, -8]} color="#8b5cf6" intensity={0.6} distance={15} decay={2} />
          {/* Accent light - green */}
          <pointLight position={[8, 4, 4]} color="#22c55e" intensity={0.4} distance={12} decay={2} />
          {/* Main key light - indigo */}
          <pointLight position={[0, 0, 5]} color="#6366f1" intensity={0.7} distance={15} decay={2} />
          {/* Rim light - violet */}
          <pointLight position={[-4, 4, -4]} color="#a78bfa" intensity={0.4} distance={15} decay={2} />
        </>
      )}

      <Particles count={adjustedParticleCount} mousePosition={mousePosition} scrollOffset={scrollOffset} reducedMotion={reducedMotion} />
      <FloatingShapes scrollOffset={scrollOffset} reducedMotion={reducedMotion} isMobile={isMobile} />
      <CentralHeroMesh mousePosition={mousePosition} scrollOffset={scrollOffset} reducedMotion={reducedMotion} />
    </>
  )
}

export function ParticlesCanvas() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const scrollOffset = useRef({ x: 0, y: 0 })
  const targetScrollOffset = useRef({ x: 0, y: 0 })
  const scrollVelocity = useRef({ x: 0, y: 0 })
  const scrollAnimationRef = useRef<number | null>(null)
  const lastMouseUpdate = useRef(0)

  // Use the useReducedMotion hook from hooks
  const reducedMotion = useReducedMotion()

  // Mobile detection with SSR safety
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false
  const particleCount = isMobile ? 25 : 50
  const dprValue: [number, number] = isMobile ? [1, 1] : [1, 1]

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      // Throttle to ~60fps (16ms) for performance
      if (now - lastMouseUpdate.current < 16) return
      lastMouseUpdate.current = now

      // Normalized mouse position [-1, 1]
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Scroll tracking with spring physics
  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const normalizedScroll = maxScroll > 0 ? scrollY / maxScroll : 0

      // Map scroll to rotation/movement offsets
      targetScrollOffset.current = {
        x: (normalizedScroll - 0.5) * 0.4,
        y: normalizedScroll * 0.3
      }
    }

    const animateScroll = () => {
      // Immediate set when reduced motion
      if (reducedMotion) {
        scrollOffset.current = { ...targetScrollOffset.current }
        scrollAnimationRef.current = requestAnimationFrame(animateScroll)
        return
      }

      // Spring interpolation constants
      const stiffness = 60
      const damping = 12

      const dx = targetScrollOffset.current.x - scrollOffset.current.x
      const dy = targetScrollOffset.current.y - scrollOffset.current.y

      scrollVelocity.current.x += dx * stiffness * 0.016
      scrollVelocity.current.y += dy * stiffness * 0.016

      scrollVelocity.current.x *= 1 - damping * 0.016
      scrollVelocity.current.y *= 1 - damping * 0.016

      scrollOffset.current.x += scrollVelocity.current.x
      scrollOffset.current.y += scrollVelocity.current.y

      scrollAnimationRef.current = requestAnimationFrame(animateScroll)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    scrollAnimationRef.current = requestAnimationFrame(animateScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current)
      }
    }
  }, [mounted, reducedMotion])

  // Visibility detection with IntersectionObserver for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: '100px' }
    )
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => observer.disconnect()
  }, [])

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        aria-label="Cargando particulas 3D..."
        role="status"
      >
        {/* Animated gradient background as fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#04040e] via-[#0a0a1a] to-[#04040e]">
          {/* Animated glow orbs */}
          <div
            className="absolute w-64 h-64 rounded-full opacity-20"
            style={{
              top: '20%',
              left: '30%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)',
              animation: 'particle-fallback-pulse 3s ease-in-out infinite',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute w-48 h-48 rounded-full opacity-15"
            style={{
              top: '50%',
              right: '20%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
              animation: 'particle-fallback-pulse 3s ease-in-out infinite 1s',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              bottom: '30%',
              left: '40%',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, transparent 70%)',
              animation: 'particle-fallback-pulse 3s ease-in-out infinite 2s',
              filter: 'blur(40px)',
            }}
          />
        </div>

        {/* Floating particle hints */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse"
              style={{
                top: `${20 + (i * 10) % 60}%`,
                left: `${15 + (i * 13) % 70}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + (i % 3)}s`,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  // Keep gradient visible when not visible (performance) to prevent flash
  if (!isVisible) {
    return (
      <div
        ref={containerRef}
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        {/* Persistent gradient background to prevent transparent flash */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#04040e] via-[#0a0a1a] to-[#04040e]">
          {/* Static glow orbs - no animation for performance when not visible */}
          <div
            className="absolute w-64 h-64 rounded-full opacity-15"
            style={{
              top: '20%',
              left: '30%',
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.6) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute w-48 h-48 rounded-full opacity-12"
            style={{
              top: '50%',
              right: '20%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
          <div
            className="absolute w-32 h-32 rounded-full opacity-10"
            style={{
              bottom: '30%',
              left: '40%',
              background: 'radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <CanvasErrorBoundary>
      <div ref={containerRef} className="absolute inset-0 -z-10">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 55 }}
          dpr={dprValue}
          gl={{
            antialias: false,
            alpha: true,
            powerPreference: 'low-power',
          }}
          performance={{ min: 0.5 }}
          frameloop="demand"
        >
          <Scene mousePosition={mousePosition} isMobile={isMobile} particleCount={particleCount} scrollOffset={scrollOffset} reducedMotion={reducedMotion} />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  )
}
