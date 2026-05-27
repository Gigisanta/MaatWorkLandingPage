'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFrameLimiter } from './effects/AdaptiveQuality';
import { SHOOTING_STAR_VERTEX, SHOOTING_STAR_FRAGMENT } from './shaders';
import type { ShootingStar } from './types';

function ShootingStarTrail({ startX, startY, vx, vy, vz, age, maxAge, brightness }: {
  startX: number; startY: number; vx: number; vy: number; vz: number;
  age: number; maxAge: number; brightness: number
}) {
  const ref = useRef<THREE.Points>(null);
  const ageRef = useRef(age);
  const segments = 18;

  useEffect(() => {
    ageRef.current = age;
  }, [age]);

  const { positions, progresses } = useMemo(() => {
    const pos = new Float32Array(segments * 3);
    const prog = new Float32Array(segments);
    for (let i = 0; i < segments; i++) prog[i] = i / segments;
    return { positions: pos, progresses: prog };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const attr = ref.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const currentAge = ageRef.current;
    const t = Math.min(currentAge / maxAge, 1);
    const speed = Math.sqrt(vx * vx + vy * vy);

    for (let i = 0; i < segments; i++) {
      const delay = progresses[i] * 0.15;
      const et = Math.max(0, t - delay);
      const dist = et * speed * currentAge;
      arr[i * 3] = startX + (vx / speed) * dist;
      arr[i * 3 + 1] = startY + vy * currentAge * (1 - delay * 0.5);
      arr[i * 3 + 2] = vz * dist * 0.08;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aProgress" args={[progresses, 1]} />
        <bufferAttribute attach="attributes-aBrightness" args={[new Float32Array(segments).fill(brightness), 1]} />
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
  const starsDataRef = useRef<ShootingStar[]>([]);
  const nextId = useRef(0);
  const renderKeyRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const { shouldUpdate } = useFrameLimiter(30);

  const spawn = useCallback(() => {
    if (starsDataRef.current.length >= 5) return;
    const newStar: ShootingStar = {
      id: nextId.current++,
      startX: (Math.random() - 0.5) * 100,
      startY: 35 + Math.random() * 25,
      vx: (Math.random() - 0.4) * 15,
      vy: -35 - Math.random() * 20,
      vz: (Math.random() - 0.5) * 4,
      age: 0,
      maxAge: 1.5 + Math.random() * 0.8,
      brightness: 0.9 + Math.random() * 0.1
    };
    starsDataRef.current = [...starsDataRef.current, newStar];
    forceUpdate(k => k + 1);
  }, []);

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

    const before = starsDataRef.current.length;
    starsDataRef.current = starsDataRef.current.filter(s => {
      s.age += delta;
      return s.age < s.maxAge;
    });

    if (starsDataRef.current.length !== before) {
      forceUpdate(k => k + 1);
    }
  });

  return (
    <>
      {starsDataRef.current.map(s => (
        <ShootingStarTrail key={`star-${s.id}`} {...s} />
      ))}
    </>
  );
}
