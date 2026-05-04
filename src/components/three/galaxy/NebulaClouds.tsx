'use client';

import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';

interface NebulaCloudsProps {
  scrollProgress?: number;
}

const nebulaVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const nebulaFragmentShader = `
  uniform float uTime;
  uniform float uDepth;
  uniform float uScrollProgress;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;

  varying vec2 vUv;

  // Hash function
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // Value noise
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  // FBM
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

    for (int i = 0; i < 6; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float t = uTime * 0.015;

    // Scroll parallax
    uv.y += uScrollProgress * 0.3 * uDepth;

    // Domain warping for organic shapes
    vec2 q = vec2(
      fbm(uv + t * 0.5),
      fbm(uv + vec2(5.2, 1.3))
    );

    vec2 r = vec2(
      fbm(uv + 1.0 * q + vec2(1.7, 9.2) + 0.15 * t),
      fbm(uv + 1.0 * q + vec2(8.3, 2.8) + 0.126 * t)
    );

    float f = fbm(uv + r);

    // Color mixing
    vec3 color = mix(uColor1, uColor2, smoothstep(0.0, 0.5, f));
    color = mix(color, uColor3, smoothstep(0.4, 1.0, f));

    // Intensity
    float alpha = f * f * 0.6;
    alpha *= smoothstep(0.5, 0.2, length(uv)); // Fade edges

    // Subtle shimmer
    alpha *= 0.85 + 0.15 * sin(uTime * 0.3 + f * 10.0);

    gl_FragColor = vec4(color * alpha * 1.2, alpha * 0.7);
  }
`;

const nebulaPlanes = [
  { position: [0, 0, -30] as [number, number, number], rotation: [0, 0, 0] as [number, number, number], scale: 60, depth: 0.3, colors: ['#6b1a1a', '#d4622a', '#8b3d5a'] },
  { position: [10, 5, -40] as [number, number, number], rotation: [0.1, 0.2, 0.05] as [number, number, number], scale: 70, depth: 0.5, colors: ['#1a3d6b', '#2a6b8b', '#3d5a7a'] },
  { position: [-15, -8, -25] as [number, number, number], rotation: [-0.05, -0.1, 0.08] as [number, number, number], scale: 50, depth: 0.7, colors: ['#4a2a6b', '#6b3d7a', '#2a4a5a'] },
];

export function NebulaClouds({ scrollProgress = 0 }: NebulaCloudsProps) {
  const materialRefs = useRef<THREE.ShaderMaterial[]>([]);

  const planes = useMemo(() => {
    return nebulaPlanes.map((plane) => {
      const geometry = new THREE.PlaneGeometry(plane.scale, plane.scale, 1, 1);

      const uniforms = {
        uTime: { value: 0 },
        uDepth: { value: plane.depth },
        uScrollProgress: { value: 0 },
        uColor1: { value: new THREE.Color(plane.colors[0]) },
        uColor2: { value: new THREE.Color(plane.colors[1]) },
        uColor3: { value: new THREE.Color(plane.colors[2]) },
      };

      return { geometry, uniforms, position: plane.position, rotation: plane.rotation };
    });
  }, []);

  useFrame((_, delta) => {
    materialRefs.current.forEach((material) => {
      if (material) {
        material.uniforms.uTime.value += delta;
        material.uniforms.uScrollProgress.value = scrollProgress;
      }
    });
  });

  return (
    <group>
      {planes.map((plane, index) => (
        <mesh
          key={index}
          position={plane.position}
          rotation={plane.rotation}
        >
          <primitive attach="geometry" object={plane.geometry} />
          <shaderMaterial
            ref={(el) => { if (el) materialRefs.current[index] = el; }}
            vertexShader={nebulaVertexShader}
            fragmentShader={nebulaFragmentShader}
            uniforms={plane.uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}