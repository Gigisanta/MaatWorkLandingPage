'use client';

import { Suspense, useState, useEffect, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { GalaxyCore } from './galaxy/GalaxyCore';
import { StarField } from './galaxy/StarField';
import { NebulaClouds } from './galaxy/NebulaClouds';
import { ImpressionistPP } from './galaxy/ImpressionistPP';
import { ScrollReactiveProvider, useScrollContext } from './effects/ScrollReactive';
import { useAdaptiveQuality, useVisibilityState } from './effects/AdaptiveQuality';
import ThreeErrorBoundary from './ErrorBoundary';

function GalaxyScene() {
  const { scrollProgress, scrollVelocity } = useScrollContext();
  const quality = useAdaptiveQuality();
  const { isVisible } = useVisibilityState();

  const effectiveParticleCount = useMemo(() => {
    return quality.tier === 'high' ? 60000 : quality.tier === 'medium' ? 30000 : 15000;
  }, [quality.tier]);

  const effectiveStarCount = useMemo(() => {
    return quality.tier === 'high' ? 12000 : quality.tier === 'medium' ? 6000 : 3000;
  }, [quality.tier]);

  const nebulaLayers = useMemo(() => {
    return quality.tier === 'high' ? 3 : quality.tier === 'medium' ? 2 : 1;
  }, [quality.tier]);

  return (
    <>
      {isVisible && (
        <>
          <StarField
            starCount={effectiveStarCount}
            radius={90}
            paused={!isVisible}
          />

          <NebulaClouds
            scrollProgress={scrollProgress}
            layers={nebulaLayers}
          />

          <GalaxyCore
            particleCount={effectiveParticleCount}
            scrollProgress={scrollProgress}
            scrollVelocity={scrollVelocity}
            paused={!isVisible}
          />

          <ImpressionistPP
            enabled={quality.enablePostProcessing}
            quality={quality.tier}
          />
        </>
      )}
    </>
  );
}

function FixedBackground() {
  const [mounted] = useState(() => {
    return typeof window !== 'undefined';
  });
  const quality = useAdaptiveQuality();
  const { isVisible } = useVisibilityState();
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const dpr = useMemo(() => {
    if (quality.tier === 'low') return 1;
    if (quality.tier === 'medium') return Math.min(window.devicePixelRatio, 1.5);
    return Math.min(window.devicePixelRatio, 2);
  }, [quality.tier]);

  useEffect(() => {
    return () => {
      if (glRef.current) {
        glRef.current.dispose();
        glRef.current.forceContextLoss();
        glRef.current = null;
      }
    };
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(135deg, #0a0a1f 0%, #1a0a2e 50%, #0d0d1a 100%)',
        }}
      />
    );
  }

  return (
    <>
      <style>{`
        #galaxy-background-wrapper {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: -1 !important;
          pointer-events: none !important;
          overflow: hidden !important;
        }
        #galaxy-background-wrapper canvas {
          display: block !important;
        }
      `}</style>
      <div id="galaxy-background-wrapper" aria-hidden="true">
        <ThreeErrorBoundary>
          <Canvas
            camera={{
              position: [0, 0, 12],
              fov: 60,
              near: 0.1,
              far: 200,
            }}
            dpr={dpr}
            frameloop={isVisible ? 'always' : 'never'}
            gl={{
              antialias: quality.tier !== 'low',
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
              preserveDrawingBuffer: false,
            }}
            onCreated={({ gl }) => {
              glRef.current = gl;
              gl.setClearColor(0x030014, 1);
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.warn('WebGL context lost');
              });
              gl.domElement.addEventListener('webglcontextrestored', () => {
                console.log('WebGL context restored');
              });
            }}
          >
            <color attach="background" args={[0x030014]} />
            <fog attach="fog" args={[0x030014, 15, 60]} />
            <Suspense fallback={null}>
              <GalaxyScene />
            </Suspense>
          </Canvas>
        </ThreeErrorBoundary>
      </div>
    </>
  );
}

export default function GalaxyBackground3D() {
  return (
    <ScrollReactiveProvider>
      <FixedBackground />
    </ScrollReactiveProvider>
  );
}
