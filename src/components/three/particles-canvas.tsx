'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Torus, Icosahedron } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 150, mousePosition }: { count?: number; mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const factor = 20 + Math.random() * 100
      const speed = 0.01 + Math.random() / 200
      const xFactor = -50 + Math.random() * 100
      const yFactor = -50 + Math.random() * 100
      const zFactor = -50 + Math.random() * 100
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor })
    }
    return temp
  }, [count])

  useFrame((state) => {
    if (!mesh.current) return

    const time = state.clock.getElapsedTime()
    const { pointer } = state

    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle

      t += speed

      const s = Math.cos(t)

      // Mouse influence on particles
      const mx = mousePosition.current.x * 2
      const my = mousePosition.current.y * 2

      dummy.position.set(
        (mx + particle.xFactor / 50) * Math.cos(t * factor * 0.05) + Math.sin(t * 0.5) * 0.5 + xFactor * s * 0.3,
        (my + particle.yFactor / 50) * Math.sin(t * factor * 0.05) + Math.cos(t * 0.5) * 0.5 + yFactor * s * 0.3,
        zFactor * s * 0.2
      )

      const scale = s * 0.5 + 1
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.set(s * 2, s * 2, s * 3)
      dummy.updateMatrix()

      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true

    // Update light position based on mouse
    if (lightRef.current) {
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, pointer.x * 5, 0.02)
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, pointer.y * 5, 0.02)
    }
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.12, 0]} />
        <meshStandardMaterial
          color="#6366f1"
          emissive="#6366f1"
          emissiveIntensity={0.8}
          transparent
          opacity={0.7}
          metalness={0.5}
          roughness={0.2}
        />
      </instancedMesh>
      <pointLight ref={lightRef} color="#6366f1" intensity={0.5} distance={10} />
    </>
  )
}

function FloatingShapes() {
  return (
    <>
      {/* Main purple sphere */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere args={[0.8, 64, 64]} position={[-2.5, 0.5, -1.5]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.5}
            speed={1.5}
            transparent
            opacity={0.6}
            metalness={0.3}
            roughness={0.4}
          />
        </Sphere>
      </Float>

      {/* Green accent sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.5, 32, 32]} position={[3, -0.5, -2]}>
          <MeshDistortMaterial
            color="#22c55e"
            attach="material"
            distort={0.4}
            speed={2}
            transparent
            opacity={0.5}
            metalness={0.6}
            roughness={0.3}
          />
        </Sphere>
      </Float>

      {/* Torus ring 1 */}
      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <Torus args={[0.6, 0.15, 16, 100]} position={[-1.5, -1.5, -2]} rotation={[1, 0.5, 0]}>
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.4}
            transparent
            opacity={0.6}
            metalness={0.7}
            roughness={0.2}
          />
        </Torus>
      </Float>

      {/* Torus ring 2 */}
      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.8}>
        <Torus args={[0.4, 0.12, 16, 80]} position={[2.5, 1.5, -1.5]} rotation={[0.5, 1, 0.5]}>
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={0.5}
            transparent
            opacity={0.5}
            metalness={0.8}
            roughness={0.1}
          />
        </Torus>
      </Float>

      {/* Small icosahedron accent */}
      <Float speed={1.6} rotationIntensity={0.8} floatIntensity={0.4}>
        <Icosahedron args={[0.3, 0]} position={[1, -1, -3]}>
          <meshStandardMaterial
            color="#f472b6"
            emissive="#f472b6"
            emissiveIntensity={0.6}
            transparent
            opacity={0.6}
            metalness={0.9}
            roughness={0.1}
          />
        </Icosahedron>
      </Float>

      {/* Background sphere */}
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
        <Sphere args={[1.2, 32, 32]} position={[0, 0, -4]}>
          <MeshDistortMaterial
            color="#1e1b4b"
            attach="material"
            distort={0.2}
            speed={0.5}
            transparent
            opacity={0.3}
            metalness={0.2}
            roughness={0.8}
          />
        </Sphere>
      </Float>
    </>
  )
}

function Scene({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.3} />
      <pointLight position={[10, 5, 5]} color="#22c55e" intensity={0.2} />

      <Particles count={100} mousePosition={mousePosition} />
      <FloatingShapes />
    </>
  )
}

export function ParticlesCanvas() {
  const [mounted, setMounted] = useState(false)
  const mousePosition = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!mounted) {
    return <div className="absolute inset-0 bg-transparent" />
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene mousePosition={mousePosition} />
      </Canvas>
    </div>
  )
}
