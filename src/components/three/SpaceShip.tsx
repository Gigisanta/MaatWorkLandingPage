'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ENGINE_GLOW_VERTEX, ENGINE_GLOW_FRAGMENT, EXHAUST_VERTEX, EXHAUST_FRAGMENT } from './shaders';
import type { FlightState } from './types';

function cubicBezier(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number) {
  const inv = 1 - t;
  return new THREE.Vector3(
    inv*inv*inv*p0.x + 3*inv*inv*t*p1.x + 3*inv*t*t*p2.x + t*t*t*p3.x,
    inv*inv*inv*p0.y + 3*inv*inv*t*p1.y + 3*inv*t*t*p2.y + t*t*t*p3.y,
    inv*inv*inv*p0.z + 3*inv*inv*t*p1.z + 3*inv*t*t*p2.z + t*t*t*p3.z,
  );
}

export default function SpaceShip() {
  const groupRef    = useRef<THREE.Group>(null);
  const engineL     = useRef<THREE.Mesh>(null);
  const engineR     = useRef<THREE.Mesh>(null);
  const exhaust1Ref = useRef<THREE.Points>(null);
  const exhaust2Ref = useRef<THREE.Points>(null);
  const timeRef     = useRef(0);
  const flight      = useRef<FlightState>({
    active: false, t: 0, speed: 0.11,
    nextIn: 8 + Math.random() * 10,
    p0: new THREE.Vector3(), p1: new THREE.Vector3(),
    p2: new THREE.Vector3(), p3: new THREE.Vector3(),
  });

  const TRAIL_POINTS = 28;

  const { exhaustPositions, exhaustAlphas, exhaustOffsets } = useMemo(() => {
    const pos  = new Float32Array(TRAIL_POINTS * 3);
    const alph = new Float32Array(TRAIL_POINTS);
    const off  = new Float32Array(TRAIL_POINTS);
    for (let i = 0; i < TRAIL_POINTS; i++) {
      alph[i] = 1 - i / TRAIL_POINTS;
      off[i]  = i / TRAIL_POINTS;
    }
    return { exhaustPositions: pos, exhaustAlphas: alph, exhaustOffsets: off };
  }, []);

  const engineGlowUniforms = useMemo(() => ({
    uColor:     { value: new THREE.Color('#40c0ff') },
    uTime:      { value: 0 },
    uIntensity: { value: 1.6 },
  }), []);

  const exhaustUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#60d8ff') },
    uTime:  { value: 0 },
  }), []);

  const startFlight = () => {
    const f = flight.current;
    f.active = true;
    f.t      = 0;
    f.speed  = 0.09 + Math.random() * 0.07;
    const side = Math.random() > 0.5 ? 1 : -1;
    const yA = (Math.random() - 0.5) * 35;
    const yB = (Math.random() - 0.5) * 35;
    const zA = -5  - Math.random() * 30;
    const zB = -10 - Math.random() * 35;
    f.p0.set(side * 95, yA, zA);
    f.p1.set(side * 35, yA + (Math.random()-0.5)*25, (zA + zB) * 0.5 + (Math.random()-0.5)*15);
    f.p2.set(-side * 35, yB + (Math.random()-0.5)*25, (zA + zB) * 0.5 + (Math.random()-0.5)*15);
    f.p3.set(-side * 95, yB, zB);
  };

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t   = timeRef.current;
    const f   = flight.current;

    if (!f.active) {
      f.nextIn -= delta;
      if (f.nextIn <= 0) { startFlight(); }
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }

    f.t += delta * f.speed;
    if (f.t >= 1.0) {
      f.active = false;
      f.nextIn = 22 + Math.random() * 18;
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }

    if (!groupRef.current) return;
    groupRef.current.visible = true;

    const pos     = cubicBezier(f.p0, f.p1, f.p2, f.p3, f.t);
    const posNext = cubicBezier(f.p0, f.p1, f.p2, f.p3, Math.min(f.t + 0.008, 1));
    const dir     = posNext.clone().sub(pos).normalize();

    groupRef.current.position.copy(pos);

    // Look along direction of travel
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(dir, up).normalize();
    const trueUp = new THREE.Vector3().crossVectors(right, dir).normalize();
    const mat4 = new THREE.Matrix4().makeBasis(right, trueUp, dir.clone().negate());
    groupRef.current.setRotationFromMatrix(mat4);

    // Banking — roll into the turn
    const bankAngle = -dir.x * 0.6;
    groupRef.current.rotateZ(bankAngle);

    // Engine glow uniforms
    const glowMat = engineL.current?.material as THREE.ShaderMaterial | undefined;
    if (glowMat) { glowMat.uniforms.uTime.value = t; }
    const glowMat2 = engineR.current?.material as THREE.ShaderMaterial | undefined;
    if (glowMat2) { glowMat2.uniforms.uTime.value = t; }

    // Exhaust trail for both exhausts
    [exhaust1Ref, exhaust2Ref].forEach((ref, idx) => {
      if (!ref.current) return;
      const attr = ref.current.geometry.attributes.position;
      const arr  = attr.array as Float32Array;
      const zOffset = idx === 0 ? 0.9 : -0.9;
      for (let i = 0; i < TRAIL_POINTS; i++) {
        const delay = (i / TRAIL_POINTS) * 0.06;
        const tp    = Math.max(0, f.t - delay);
        const p     = cubicBezier(f.p0, f.p1, f.p2, f.p3, tp);
        arr[i*3]   = p.x;
        arr[i*3+1] = p.y;
        arr[i*3+2] = p.z + zOffset * 0.1;
      }
      attr.needsUpdate = true;
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    });

    exhaustUniforms.uTime.value = t;
  });

  const hullMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b0bac5', metalness: 0.9, roughness: 0.15 }), []);
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#203050', metalness: 0.5, roughness: 0.05, transparent: true, opacity: 0.85 }), []);
  const wingMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8898a8', metalness: 0.85, roughness: 0.2 }), []);
  const engineBodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#607080', metalness: 0.9, roughness: 0.3, emissive: '#203040', emissiveIntensity: 0.4 }), []);

  return (
    <group ref={groupRef} visible={false}>
      {/* Hull — elongated ellipsoid */}
      <mesh scale={[2.2, 0.6, 0.75]} material={hullMat}>
        <sphereGeometry args={[1.5, 14, 10]} />
      </mesh>

      {/* Cockpit dome */}
      <mesh position={[0.9, 0.55, 0]} scale={[0.85, 0.65, 0.7]} material={glassMat}>
        <sphereGeometry args={[0.6, 10, 8]} />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.3, -0.15, 2.6]} rotation={[0.12, 0.08, -0.18]} material={wingMat}>
        <boxGeometry args={[3.2, 0.12, 1.4]} />
      </mesh>
      {/* Right wing */}
      <mesh position={[-0.3, -0.15, -2.6]} rotation={[-0.12, -0.08, 0.18]} material={wingMat}>
        <boxGeometry args={[3.2, 0.12, 1.4]} />
      </mesh>

      {/* Engine pod — left */}
      <mesh position={[-1.6, -0.25, 0.9]} rotation={[Math.PI/2, 0, 0]} material={engineBodyMat}>
        <cylinderGeometry args={[0.28, 0.24, 1.1, 10]} />
      </mesh>
      {/* Engine pod — right */}
      <mesh position={[-1.6, -0.25, -0.9]} rotation={[Math.PI/2, 0, 0]} material={engineBodyMat}>
        <cylinderGeometry args={[0.28, 0.24, 1.1, 10]} />
      </mesh>

      {/* Engine glow planes — left */}
      <mesh ref={engineL} position={[-2.2, -0.25, 0.9]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <shaderMaterial
          uniforms={engineGlowUniforms}
          vertexShader={ENGINE_GLOW_VERTEX}
          fragmentShader={ENGINE_GLOW_FRAGMENT}
          transparent depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Engine glow planes — right */}
      <mesh ref={engineR} position={[-2.2, -0.25, -0.9]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <shaderMaterial
          uniforms={engineGlowUniforms}
          vertexShader={ENGINE_GLOW_VERTEX}
          fragmentShader={ENGINE_GLOW_FRAGMENT}
          transparent depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Exhaust trails rendered in world space via points outside group */}
    </group>
  );
}
