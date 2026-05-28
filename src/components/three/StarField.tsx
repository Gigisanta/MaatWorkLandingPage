'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameLimiter } from './effects/AdaptiveQuality';
import { STAR_VERTEX, STAR_FRAGMENT } from './shaders';
import type { StarFieldProps } from './types';

export default function StarField({ count, radius, size, depthZ, spread, orbitSpeed = 0.01 }: StarFieldProps) {
  const ref = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  const { shouldUpdate } = useFrameLimiter(30);

  // Static positions - no per-frame calculations needed
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightness = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const temperatures = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute stars in a disk with spread
      const theta = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * radius;
      
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * r;
      positions[i * 3 + 2] = r * Math.sin(theta);

      // Size correlates with temperature (hot = large)
      const temperature = Math.pow(Math.random(), 2);
      const baseSize = size * (0.2 + temperature * 0.8);
      sizes[i] = baseSize * (0.5 + Math.random() * 0.5);

      // Brightness inversely correlated with size for realism
      brightness[i] = 0.2 + Math.pow(Math.random(), 3) * 0.8;
      temperatures[i] = temperature;

      // Color based on temperature
      let rC, gC, bC;
      if (temperature > 0.7) {
        rC = 0.85 + Math.random() * 0.15;
        gC = 0.9 + Math.random() * 0.1;
        bC = 1.0;
      } else if (temperature > 0.4) {
        rC = 1.0;
        gC = 0.95 + Math.random() * 0.05;
        bC = 0.85 + Math.random() * 0.1;
      } else {
        rC = 1.0;
        gC = 0.7 + Math.random() * 0.2;
        bC = 0.5 + Math.random() * 0.2;
      }

      const bf = 0.5 + brightness[i] * 0.5;
      colors[i * 3] = rC * bf;
      colors[i * 3 + 1] = gC * bf;
      colors[i * 3 + 2] = bC * bf;
    }

    return { positions, sizes, brightness, colors, temperatures };
  }, [count, radius, size, spread]);

  // Single rotation update per frame — extremely cheap
  useFrame((_, delta) => {
    if (!shouldUpdate()) return;
    if (!groupRef.current) return;

    rotationRef.current += delta * orbitSpeed;
    groupRef.current.rotation.z = rotationRef.current;

    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = performance.now() * 0.001;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -depthZ]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
          <bufferAttribute attach="attributes-aBrightness" args={[data.brightness, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-aTemperature" args={[data.temperatures, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={{ uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } }}
          vertexShader={STAR_VERTEX}
          fragmentShader={STAR_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
