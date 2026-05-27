'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameLimiter } from './effects/AdaptiveQuality';
import { GALAXY_VERTEX, GALAXY_FRAGMENT, CORE_GLOW_FRAGMENT } from './shaders';

export default function GalacticCore() {
  const diskRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const glowPosRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const { shouldUpdate } = useFrameLimiter(30);

  const diskUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const glowUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (!shouldUpdate()) return;
    timeRef.current += delta;
    const t = timeRef.current;

    if (diskRef.current) {
      (diskRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }

    if (glowRef.current) {
      (glowRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;

      // Gentle orbital movement for galactic core glow
      const tx = Math.sin(t * 0.1) * 0.3;
      const ty = Math.cos(t * 0.08) * 0.2;
      glowPosRef.current.x += (tx - glowPosRef.current.x) * 0.02;
      glowPosRef.current.y += (ty - glowPosRef.current.y) * 0.02;

      glowRef.current.position.x = glowPosRef.current.x;
      glowRef.current.position.y = glowPosRef.current.y;
    }
  });

  return (
    <>
      <mesh ref={diskRef} position={[0, 0, -40]} scale={[180, 180, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={diskUniforms}
          vertexShader={GALAXY_VERTEX}
          fragmentShader={GALAXY_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, -32]} scale={[75, 75, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={glowUniforms}
          vertexShader={GALAXY_VERTEX}
          fragmentShader={CORE_GLOW_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}
