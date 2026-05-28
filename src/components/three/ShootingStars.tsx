'use client';

import { useRef, useMemo, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameLimiter } from './effects/AdaptiveQuality';
import { SHOOTING_STAR_VERTEX, SHOOTING_STAR_FRAGMENT } from './shaders';
import type { ShootingStar } from './types';

const MAX_STARS = 5;
const TRAIL_SEGMENTS = 18;

function ShootingStarTrail({ data, visible }: { data: ShootingStar; visible: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, progresses } = useMemo(() => {
    const pos = new Float32Array(TRAIL_SEGMENTS * 3);
    const prog = new Float32Array(TRAIL_SEGMENTS);
    for (let i = 0; i < TRAIL_SEGMENTS; i++) prog[i] = i / TRAIL_SEGMENTS;
    return { positions: pos, progresses: prog };
  }, []);

  useFrame(() => {
    if (!visible || !ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const t = Math.min(data.age / data.maxAge, 1);
    const speed = Math.sqrt(data.vx * data.vx + data.vy * data.vy);
    if (speed < 0.001) return;

    const invSpeed = 1 / speed;
    const vxNorm = data.vx * invSpeed;
    const vyNorm = data.vy * invSpeed;

    for (let i = 0; i < TRAIL_SEGMENTS; i++) {
      const delay = progresses[i] * 0.15;
      const et = Math.max(0, t - delay);
      const dist = et * speed * data.age;
      arr[i * 3] = data.startX + vxNorm * dist;
      arr[i * 3 + 1] = data.startY + data.vy * data.age * (1 - delay * 0.5);
      arr[i * 3 + 2] = data.vz * dist * 0.08;
    }
    attr.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aProgress" args={[progresses, 1]} />
        <bufferAttribute attach="attributes-aBrightness" args={[new Float32Array(TRAIL_SEGMENTS).fill(data.brightness), 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={SHOOTING_STAR_VERTEX}
        fragmentShader={SHOOTING_STAR_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ShootingStars() {
  const starsRef = useRef<ShootingStar[]>([]);
  const nextId = useRef(0);
  const { shouldUpdate } = useFrameLimiter(30);

  // Pre-allocate pool
  const pool = useMemo<ShootingStar[]>(() => {
    return Array.from({ length: MAX_STARS }, (_, i) => ({
      id: i,
      startX: 0, startY: 0,
      vx: 0, vy: 0, vz: 0,
      age: 0, maxAge: 1,
      brightness: 1,
    }));
  }, []);

  const spawn = useCallback(() => {
    // Find inactive slot
    const slot = pool.find(s => s.age >= s.maxAge);
    if (!slot) return;

    slot.startX = (Math.random() - 0.5) * 100;
    slot.startY = 35 + Math.random() * 25;
    slot.vx = (Math.random() - 0.4) * 15;
    slot.vy = -35 - Math.random() * 20;
    slot.vz = (Math.random() - 0.5) * 4;
    slot.age = 0;
    slot.maxAge = 1.5 + Math.random() * 0.8;
    slot.brightness = 0.9 + Math.random() * 0.1;

    // Update ref without triggering re-render
    starsRef.current = pool.filter(s => s.age < s.maxAge);
  }, [pool]);

  useEffect(() => {
    const timeout = setTimeout(spawn, 1200);
    const interval = setInterval(spawn, 2800 + Math.random() * 2200);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [spawn]);

  useFrame((_, delta) => {
    if (!shouldUpdate()) return;
    // Update ages — no allocation, no filter, no setState
    for (let i = 0; i < MAX_STARS; i++) {
      if (pool[i].age < pool[i].maxAge) {
        pool[i].age += delta;
      }
    }
  });

  return (
    <>
      {pool.map((s, i) => (
        <ShootingStarTrail key={`star-${i}`} data={s} visible={s.age < s.maxAge} />
      ))}
    </>
  );
}
