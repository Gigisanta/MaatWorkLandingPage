'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameLimiter } from './effects/AdaptiveQuality';
import { NEBULA_VERTEX, NEBULA_FRAGMENT } from './shaders';
import type { NebulaCloudProps } from './types';

export default function NebulaCloud({ position, scale, colors, opacity, flowSpeed, zPos }: NebulaCloudProps) {
  const ref = useRef<THREE.Mesh>(null);
  const rotationRef = useRef(Math.random() * Math.PI * 2);
  const { shouldUpdate } = useFrameLimiter(30);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(colors[0]) },
    uColor2: { value: new THREE.Color(colors[1]) },
    uColor3: { value: new THREE.Color(colors[2]) },
    uOpacity: { value: opacity },
    uScale: { value: 4.0 },
  }), [colors, opacity]);

  useFrame(() => {
    if (!shouldUpdate()) return;
    if (!ref.current) return;
    const mat = ref.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = performance.now() * 0.001;
  });

  return (
    <mesh ref={ref} position={[position[0], position[1], zPos]} scale={[scale, scale, 1]} rotation={[0, 0, rotationRef.current]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={NEBULA_VERTEX}
        fragmentShader={NEBULA_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
