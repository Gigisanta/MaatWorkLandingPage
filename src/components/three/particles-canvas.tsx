'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sphere, MeshDistortMaterial, Torus } from '@react-three/drei'
import * as THREE from 'three'

function Particles({ count = 200 }) {
  const mesh = useRef<THREE.InstancedMesh>(null)
  const mousePosition = useRef({ x: 0, y: 0 })

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
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
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

      dummy.position.set(
        (particle.mx / 10) * Math.cos(t * factor * 0.1) + Math.sin(t * 0.5) * 0.5 + xFactor * s * 0.3,
        (particle.my / 10) * Math.sin(t * factor * 0.1) + Math.cos(t * 0.5) * 0.5 + yFactor * s * 0.3,
        zFactor * s * 0.2
      )

      const scale = s * 0.5 + 1
      dummy.scale.set(scale, scale, scale)
      dummy.rotation.set(s * 2, s * 2, s * 3)
      dummy.updateMatrix()

      mesh.current!.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true

    // Smooth mouse follow
    mousePosition.current.x += (pointer.x * 0.5 - mousePosition.current.x) * 0.02
    mousePosition.current.y += (pointer.y * 0.5 - mousePosition.current.y) * 0.02
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.15, 0]} />
      <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} transparent opacity={0.6} />
    </instancedMesh>
  )
}

function FloatingShapes() {
  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 32, 32]} position={[-3, 1, -2]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.4}
            speed={2}
            transparent
            opacity={0.4}
          />
        </Sphere>
      </Float>

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <Sphere args={[0.7, 32, 32]} position={[3.5, -0.5, -1]}>
          <MeshDistortMaterial
            color="#22c55e"
            attach="material"
            distort={0.3}
            speed={1.5}
            transparent
            opacity={0.3}
          />
        </Sphere>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1.2}>
        <Torus args={[0.8, 0.2, 16, 100]} position={[-2, -1.5, -3]} rotation={[1, 0.5, 0]}>
          <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.3} transparent opacity={0.5} />
        </Torus>
      </Float>

      <Float speed={2.2} rotationIntensity={0.6} floatIntensity={0.6}>
        <Torus args={[0.5, 0.15, 16, 100]} position={[2.5, 2, -2]} rotation={[0.3, 1, 0.5]}>
          <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.4} transparent opacity={0.4} />
        </Torus>
      </Float>
    </>
  )
}

function Scene() {
  const { viewport } = useThree()

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={0.5} />

      <Particles count={150} />
      <FloatingShapes />
    </>
  )
}

export function ParticlesCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
