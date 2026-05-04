'use client';

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';

interface StarFieldProps {
  starCount?: number;
  radius?: number;
}

const vertexShader = `
  uniform float uTime;

  attribute float aSize;
  attribute float aPhase;
  attribute float aColorMix;

  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vColorMix = aColorMix;

    // Slow rotation
    vec3 pos = position;
    float angle = uTime * 0.01;
    float cosA = cos(angle);
    float sinA = sin(angle);
    pos.xz = mat2(cosA, -sinA, sinA, cosA) * pos.xz;

    // Twinkle
    float twinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aPhase * 12.56);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * twinkle * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;

    // Fade with distance
    vAlpha = smoothstep(100.0, 20.0, -mvPosition.z) * twinkle;
  }
`;

const fragmentShader = `
  varying float vAlpha;
  varying float vColorMix;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float d = length(uv);

    if (d > 0.5) discard;

    // Soft circle
    float star = 1.0 - smoothstep(0.0, 0.4, d);

    // Cross spikes
    float spike = max(
      1.0 - smoothstep(0.0, 0.02, abs(uv.x)),
      1.0 - smoothstep(0.0, 0.02, abs(uv.y))
    ) * (1.0 - d) * 0.3;

    float brightness = star + spike;

    // Color: blue-white to warm white
    vec3 coldColor = vec3(0.78, 0.83, 1.0);  // #c8d4ff
    vec3 warmColor = vec3(1.0, 0.96, 0.88);   // #fff4e0
    vec3 whiteColor = vec3(1.0, 1.0, 1.0);

    vec3 color = mix(coldColor, warmColor, vColorMix);
    color = mix(color, whiteColor, smoothstep(0.8, 1.0, vColorMix));

    gl_FragColor = vec4(color * brightness, brightness * vAlpha);
  }
`;

export function StarField({ starCount = 12000, radius = 90 }: StarFieldProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Use useState with lazy initialization to generate random values once
  // This avoids calling Math.random() during render
  const [starData] = useState(() => {
    const positions = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const phases = new Float32Array(starCount);
    const colorMixes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Random point on sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = 1.0 + Math.random() * 2.5;
      phases[i] = Math.random() * Math.PI * 2;
      colorMixes[i] = Math.random(); // 0 = cold, 1 = warm
    }

    return { positions, sizes, phases, colorMixes };
  });

  const { positions, sizes, phases, colorMixes } = starData;

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geo.setAttribute('aColorMix', new THREE.BufferAttribute(colorMixes, 1));
    return geo;
  }, [positions, sizes, phases, colorMixes]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
  }), []);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
