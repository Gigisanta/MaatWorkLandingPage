'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameLimiter } from './effects/AdaptiveQuality';
import {
  PLANET_VERTEX, PLANET_FRAGMENT,
  CLOUD_VERTEX, CLOUD_FRAGMENT,
  ATMOSPHERE_VERTEX, ATMOSPHERE_FRAGMENT,
  RING_VERTEX, RING_FRAGMENT,
} from './shaders';
import type { PlanetProps } from './types';

export default function Planet({
  orbitRadiusX, orbitRadiusY, orbitSpeed, size, color1, color2,
  roughness, atmosphereColor, atmosphereIntensity, rotationSpeed,
  initialAngle, hasRing = false, ringColor = '#ffffff', tilt = 0,
  planetType = 0, cloudColor = '#ffffff', cloudIntensity = 0.5,
  geometryDetail = 1
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(initialAngle);
  const timeRef = useRef(0);
  const seedRef = useRef(Math.random() * 100);
  const currentPos = useRef({ x: 0, y: 0, z: 0 });

  // Geometry segments — reduced base from 48 to 32
  const segments = Math.max(12, Math.round(32 * geometryDetail));
  const atmosphereSegments = Math.max(10, Math.round(32 * geometryDetail));
  const outerAtmosphereSegments = Math.max(8, Math.round(24 * geometryDetail));
  const ringSegments = Math.max(24, Math.round(48 * geometryDetail));

  const sunDirection = useMemo(() => new THREE.Vector3(0.6, 0.4, 0.5).normalize(), []);
  const { shouldUpdate: shouldUpdateShaders } = useFrameLimiter(30);

  // Third color for multi-tone planets
  const color3 = useMemo(() => {
    const c = new THREE.Color(color1);
    c.lerp(new THREE.Color(color2), 0.5);
    return c;
  }, [color1, color2]);

  const planetUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: sunDirection },
    uPlanetColor1: { value: new THREE.Color(color1) },
    uPlanetColor2: { value: new THREE.Color(color2) },
    uPlanetColor3: { value: color3 },
    uPlanetType: { value: planetType },
    uSeed: { value: seedRef.current },
    uCloudIntensity: { value: cloudIntensity },
    uRoughness: { value: roughness },
  }), [color1, color2, color3, planetType, cloudIntensity, roughness, sunDirection]);

  const atmosphereUniforms = useMemo(() => ({
    uSunDirection: { value: sunDirection },
    uAtmosphereColor: { value: new THREE.Color(atmosphereColor) },
    uSunColor: { value: new THREE.Color('#fff8e8') },
    uIntensity: { value: atmosphereIntensity },
    uPlanetRadius: { value: size },
    uAtmosphereRadius: { value: size * 1.25 },
  }), [atmosphereColor, atmosphereIntensity, sunDirection, size]);

  const cloudUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: sunDirection },
    uSeed: { value: seedRef.current },
    uCloudColor: { value: new THREE.Color(cloudColor) },
    uCloudDensity: { value: cloudIntensity },
  }), [cloudColor, cloudIntensity, sunDirection]);

  const ringUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(ringColor) },
  }), [ringColor]);

  // Pre-compute orbit constants
  const orbitParams = useMemo(() => ({
    halfY: orbitRadiusY * 0.4,
    yOff1: 12,
    yOff2: 5,
  }), [orbitRadiusY]);

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (groupRef.current) {
      // Smooth time-based angle update
      angleRef.current += orbitSpeed * delta;

      // Clean elliptical orbit in 3D space
      const angle = angleRef.current;
      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);
      const sinA04 = Math.sin(angle * 0.4);
      const sinA06 = Math.sin(angle * 0.6);

      const targetX = cosA * orbitRadiusX;
      const targetY = sinA04 * orbitParams.yOff1 + sinA06 * orbitParams.yOff2;
      const targetZ = sinA * orbitRadiusY;

      // Frame-rate independent lerp
      const smoothFactor = 1.0 - Math.exp(-3.0 * delta);
      
      currentPos.current.x += (targetX - currentPos.current.x) * smoothFactor;
      currentPos.current.y += (targetY - currentPos.current.y) * smoothFactor;
      currentPos.current.z += (targetZ - currentPos.current.z) * smoothFactor;

      groupRef.current.position.set(
        currentPos.current.x,
        currentPos.current.y,
        currentPos.current.z
      );

      // Planet self-rotation
      groupRef.current.rotation.y += rotationSpeed * delta;
    }

    // Shader uniforms at 30 fps — saves GPU driver calls
    if (shouldUpdateShaders()) {
      if (planetRef.current) {
        (planetRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
      }
      if (cloudRef.current) {
        (cloudRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      {/* Main planet surface */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, segments, segments]} />
        <shaderMaterial
          uniforms={planetUniforms}
          vertexShader={PLANET_VERTEX}
          fragmentShader={PLANET_FRAGMENT}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef} scale={[1.03, 1.03, 1.03]}>
        <sphereGeometry args={[size, segments, segments]} />
        <shaderMaterial
          uniforms={cloudUniforms}
          vertexShader={CLOUD_VERTEX}
          fragmentShader={CLOUD_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Atmosphere - smooth volumetric scattering */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[size, atmosphereSegments, atmosphereSegments]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[size, outerAtmosphereSegments, outerAtmosphereSegments]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 2.3, ringSegments]} />
          <shaderMaterial
            uniforms={ringUniforms}
            vertexShader={RING_VERTEX}
            fragmentShader={RING_FRAGMENT}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}
