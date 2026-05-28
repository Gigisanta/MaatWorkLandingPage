'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSmoothDelta } from './effects/AdaptiveQuality';
import type { ViewportInfo } from './types';

export default function CameraController({ viewport }: {
  viewport: ViewportInfo;
}) {
  const { camera } = useThree();
  const timeRef = useRef(0);
  const { getSmoothDelta } = useSmoothDelta();
  
  // Pre-compute lookAt target — never changes
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, -25), []);
  
  // Pre-compute base FOV
  const baseFov = viewport.isMobile ? 75 : viewport.isTablet ? 68 : 60;
  const fovSetRef = useRef(false);

  useFrame(({ clock }, delta) => {
    const smoothDelta = getSmoothDelta(delta);
    timeRef.current += smoothDelta;
    const t = timeRef.current;

    // Cast to PerspectiveCamera for FOV access
    const perspCamera = camera as THREE.PerspectiveCamera;
    
    // Set FOV once (not every frame)
    if (!fovSetRef.current || Math.abs(perspCamera.fov - baseFov) > 0.5) {
      perspCamera.fov = baseFov;
      perspCamera.updateProjectionMatrix();
      fovSetRef.current = true;
    }

    // Organic drift — two overlapping frequencies
    // Pre-computed sin/cos values for smooth motion
    const sin05 = Math.sin(t * 0.05);
    const sin13 = Math.sin(t * 0.13);
    const cos03 = Math.cos(t * 0.03);
    const cos17 = Math.cos(t * 0.17);
    const sin02 = Math.sin(t * 0.02);
    const sin07 = Math.sin(t * 0.07);

    const targetX = sin05 * 2.5 + sin13 * 0.9;
    const targetY = cos03 * 2.0 + cos17 * 0.7;
    const targetZ = 65 + sin02 * 2.0 + sin07 * 0.8;

    // Frame-rate independent lerp — uses exp for consistency
    const lerpFactor = 1.0 - Math.exp(-1.5 * smoothDelta);
    camera.position.x += (targetX - camera.position.x) * lerpFactor;
    camera.position.y += (targetY - camera.position.y) * lerpFactor;
    camera.position.z += (targetZ - camera.position.z) * lerpFactor;

    // lookAt only when position changed significantly (avoid matrix recalc every frame)
    const dx = targetX - camera.position.x;
    const dy = targetY - camera.position.y;
    if (dx * dx + dy * dy > 0.0001) {
      camera.lookAt(lookTarget);
    }
  });

  return null;
}
