'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GalaxyCoreProps {
  particleCount?: number;
  scrollProgress?: number;
  scrollVelocity?: number;
  paused?: boolean;
}

const vertexShader = `
  uniform float uTime;
  uniform float uScrollProgress;
  uniform float uScrollVelocity;

  attribute float aDistanceFromCenter;
  attribute float aArmIndex;
  attribute float aBrightness;
  attribute float aPhase;

  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    vBrightness = aBrightness;

    float radius = length(position.xz);
    float spinAngle = radius * 0.8;
    float branchAngle = (aArmIndex / 4.0) * 6.28318;

    float rotSpeed = 0.15 / (1.0 + aDistanceFromCenter * 0.8);
    float angle = atan(position.z, position.x) + spinAngle + branchAngle + uTime * rotSpeed;

    vec3 spiralPos = vec3(
      cos(angle) * radius,
      position.y + sin(uTime * 0.3 + aPhase) * 0.3 * aDistanceFromCenter,
      sin(angle) * radius
    );

    spiralPos.z += uScrollProgress * 40.0 * (1.0 - aDistanceFromCenter * 0.5);
    spiralPos.x += uScrollVelocity * 5.0 * aDistanceFromCenter;

    vec3 coreColor = vec3(1.0, 0.95, 0.85);
    vec3 midColor = vec3(0.85, 0.65, 1.0);
    vec3 armColor = vec3(0.45, 0.55, 0.95);

    float t = aDistanceFromCenter;
    vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.3, t));
    color = mix(color, armColor, smoothstep(0.3, 1.0, t));

    float warmStar = step(0.92, sin(aPhase * 17.3));
    color = mix(color, vec3(1.0, 0.85, 0.6), warmStar * 0.4);

    vColor = color;

    float twinkle = 0.7 + 0.3 * sin(uTime * 2.5 + aPhase * 6.28);

    vec4 mvPosition = modelViewMatrix * vec4(spiralPos, 1.0);
    gl_PointSize = aBrightness * twinkle * 280.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vBrightness;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float d = length(uv);

    if (d > 0.5) discard;

    float core = 1.0 - smoothstep(0.0, 0.35, d);
    float spikeH = 1.0 - smoothstep(0.0, 0.015, abs(uv.y));
    float spikeV = 1.0 - smoothstep(0.0, 0.015, abs(uv.x));
    float spikes = max(spikeH, spikeV) * (1.0 - d) * 0.35;
    float spikeD1 = 1.0 - smoothstep(0.0, 0.012, abs(uv.x - uv.y));
    float spikeD2 = 1.0 - smoothstep(0.0, 0.012, abs(uv.x + uv.y));
    float diagSpikes = max(spikeD1, spikeD2) * (1.0 - d) * 0.15;

    float brightness = (core + spikes + diagSpikes) * vBrightness;
    float alpha = brightness * 0.9;
    alpha *= 1.0 - smoothstep(0.3, 0.5, d);

    gl_FragColor = vec4(vColor * brightness, alpha);
  }
`;

export function GalaxyCore({ particleCount = 60000, scrollProgress = 0, scrollVelocity = 0, paused = false }: GalaxyCoreProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  const [galaxyData] = useState(() => {
    const positions = new Float32Array(particleCount * 3);
    const distances = new Float32Array(particleCount);
    const armIndices = new Float32Array(particleCount);
    const brightnesses = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const maxRadius = 18;
      const armCount = 4;

      const t = Math.pow(Math.random(), 0.6);
      const radius = t * maxRadius;

      const spinAngle = radius * 0.8;
      const branchAngle = (i % armCount) / armCount * Math.PI * 2;
      const armAngle = branchAngle + spinAngle;

      const scatterRadius = 0.3 + radius * 0.15;
      const scatterX = (Math.random() - 0.5) * scatterRadius;
      const scatterZ = (Math.random() - 0.5) * scatterRadius;

      positions[i3] = Math.cos(armAngle) * radius + scatterX;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.4 * (1.0 - t * 0.5);
      positions[i3 + 2] = Math.sin(armAngle) * radius + scatterZ;

      distances[i] = t;
      armIndices[i] = i % armCount;
      brightnesses[i] = 1.0 + Math.random() * 2.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, distances, armIndices, brightnesses, phases };
  });

  const { positions, distances, armIndices, brightnesses, phases } = galaxyData;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aDistanceFromCenter', new THREE.BufferAttribute(distances, 1));
    geo.setAttribute('aArmIndex', new THREE.BufferAttribute(armIndices, 1));
    geo.setAttribute('aBrightness', new THREE.BufferAttribute(brightnesses, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    return geo;
  }, [positions, distances, armIndices, brightnesses, phases]);

  useEffect(() => {
    geometryRef.current = geometry;
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uScrollVelocity: { value: 0 },
  }), []);

  useFrame((_, delta) => {
    if (paused) return;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
      materialRef.current.uniforms.uScrollProgress.value = scrollProgress;
      materialRef.current.uniforms.uScrollVelocity.value = scrollVelocity;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry}>
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
