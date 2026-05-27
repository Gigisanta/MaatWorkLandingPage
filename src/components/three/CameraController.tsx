'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { ViewportInfo } from './types';

export default function CameraController({ viewport }: {
  viewport: ViewportInfo;
}) {
  const { camera } = useThree();
  const targetPos = useRef({ x: 0, y: 0, z: 65 });
  const timeRef = useRef(0);

  useFrame(({ clock }, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    // Cast to PerspectiveCamera for FOV access
    const perspCamera = camera as THREE.PerspectiveCamera;

    // Base FOV - wider on mobile for better immersion
    const baseFov = viewport.isMobile ? 75 : viewport.isTablet ? 68 : 60;
    
    // Smooth FOV transition only at start
    if (Math.abs(perspCamera.fov - baseFov) > 0.1) {
      perspCamera.fov = THREE.MathUtils.lerp(perspCamera.fov, baseFov, 0.02);
      perspCamera.updateProjectionMatrix();
    }

    // Organic drift — two overlapping frequencies so it never repeats obviously
    const orbitX = Math.sin(t * 0.05) * 2.5 + Math.sin(t * 0.13) * 0.9;
    const orbitY = Math.cos(t * 0.03) * 2.0 + Math.cos(t * 0.17) * 0.7;
    const orbitZ = 65 + Math.sin(t * 0.02) * 2.0 + Math.sin(t * 0.07) * 0.8;

    targetPos.current.x = orbitX;
    targetPos.current.y = orbitY;
    targetPos.current.z = orbitZ;

    // Smooth lerp for all axes
    camera.position.x += (targetPos.current.x - camera.position.x) * 0.015;
    camera.position.y += (targetPos.current.y - camera.position.y) * 0.015;
    camera.position.z += (targetPos.current.z - camera.position.z) * 0.01;

    camera.lookAt(0, 0, -25);
  });

  return null;
}
