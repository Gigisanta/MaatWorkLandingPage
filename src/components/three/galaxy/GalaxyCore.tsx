'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GalaxyCoreProps {
  particleCount?: number;
  scrollProgress?: number;
  scrollVelocity?: number;
}

// Vertex shader with logarithmic spiral + GPU animation
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

    // Calculate spiral position
    float radius = length(position.xz);
    float spinAngle = radius * 0.8;
    float branchAngle = (aArmIndex / 4.0) * 6.28318;

    // Differential rotation - outer = slower
    float rotSpeed = 0.15 / (1.0 + aDistanceFromCenter * 0.8);
    float angle = atan(position.z, position.x) + spinAngle + branchAngle + uTime * rotSpeed;

    // Spiral position
    vec3 spiralPos = vec3(
      cos(angle) * radius,
      position.y + sin(uTime * 0.3 + aPhase) * 0.3 * aDistanceFromCenter,
      sin(angle) * radius
    );

    // Scroll parallax
    spiralPos.z += uScrollProgress * 40.0 * (1.0 - aDistanceFromCenter * 0.5);
    spiralPos.x += uScrollVelocity * 5.0 * aDistanceFromCenter;

    // Impressionist color: hot core → cool arms
    vec3 coreColor = vec3(1.0, 0.95, 0.85);
    vec3 midColor = vec3(0.85, 0.65, 1.0);
    vec3 armColor = vec3(0.45, 0.55, 0.95);

    float t = aDistanceFromCenter;
    vec3 color = mix(coreColor, midColor, smoothstep(0.0, 0.3, t));
    color = mix(color, armColor, smoothstep(0.3, 1.0, t));

    // Add warm accent to some stars
    float warmStar = step(0.92, sin(aPhase * 17.3));
    color = mix(color, vec3(1.0, 0.85, 0.6), warmStar * 0.4);

    vColor = color;

    // Twinkle
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

    // Soft circular core
    float core = 1.0 - smoothstep(0.0, 0.35, d);

    // 4-way diffraction cross
    float spikeH = 1.0 - smoothstep(0.0, 0.015, abs(uv.y));
    float spikeV = 1.0 - smoothstep(0.0, 0.015, abs(uv.x));
    float spikes = max(spikeH, spikeV) * (1.0 - d) * 0.35;

    // Diagonal cross (subtle)
    float spikeD1 = 1.0 - smoothstep(0.0, 0.012, abs(uv.x - uv.y));
    float spikeD2 = 1.0 - smoothstep(0.0, 0.012, abs(uv.x + uv.y));
    float diagSpikes = max(spikeD1, spikeD2) * (1.0 - d) * 0.15;

    float brightness = (core + spikes + diagSpikes) * vBrightness;

    // Soft glow falloff
    float alpha = brightness * 0.9;
    alpha *= 1.0 - smoothstep(0.3, 0.5, d);

    gl_FragColor = vec4(vColor * brightness, alpha);
  }
`;

export function GalaxyCore({ particleCount = 60000, scrollProgress = 0, scrollVelocity = 0 }: GalaxyCoreProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Points>(null);
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  // Use useState with lazy initialization to generate random values once
  // This avoids calling Math.random() during render
  const [galaxyData] = useState(() => {
    const positions = new Float32Array(particleCount * 3);
    const distances = new Float32Array(particleCount);
    const armIndices = new Float32Array(particleCount);
    const brightnesses = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Galaxy parameters
      const maxRadius = 18;
      const armCount = 4;

      // Random position along spiral arm
      const t = Math.pow(Math.random(), 0.6); // 0 = center, 1 = edge
      const radius = t * maxRadius;

      // Spiral angle
      const spinAngle = radius * 0.8;
      const branchAngle = (i % armCount) / armCount * Math.PI * 2;
      const armAngle = branchAngle + spinAngle;

      // Gaussian scatter around arm
      const scatterRadius = 0.3 + radius * 0.15;
      const scatterX = (Math.random() - 0.5) * scatterRadius;
      const scatterZ = (Math.random() - 0.5) * scatterRadius;

      // Position with spiral
      positions[i3] = Math.cos(armAngle) * radius + scatterX;
      positions[i3 + 1] = (Math.random() - 0.5) * 0.4 * (1.0 - t * 0.5); // Flatten Y
      positions[i3 + 2] = Math.sin(armAngle) * radius + scatterZ;

      distances[i] = t;
      armIndices[i] = i % armCount;
      brightnesses[i] = 1.0 + Math.random() * 2.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, distances, armIndices, brightnesses, phases };
  });

  const { positions, distances, armIndices, brightnesses, phases } = galaxyData;

  // Create geometry with attributes
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
  }, [geometry]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScrollProgress: { value: 0 },
    uScrollVelocity: { value: 0 },
  }), []);

  useFrame((_, delta) => {
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
