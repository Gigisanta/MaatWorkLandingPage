'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { GalaxyCore } from './galaxy/GalaxyCore';
import { StarField } from './galaxy/StarField';
import { NebulaClouds } from './galaxy/NebulaClouds';
import { ImpressionistPP } from './galaxy/ImpressionistPP';
import { ScrollReactiveProvider, useScrollContext } from './effects/ScrollReactive';
import { useAdaptiveQuality } from './effects/AdaptiveQuality';
import ThreeErrorBoundary from './ErrorBoundary';

function GalaxyScene() {
  const { scrollProgress, scrollVelocity } = useScrollContext();
  const quality = useAdaptiveQuality();

  return (
    <>
      {/* Star field - distant stars */}
      <StarField
        starCount={quality.starCount}
        radius={90}
      />

      {/* Nebula clouds for color depth */}
      <NebulaClouds scrollProgress={scrollProgress} />

      {/* Main galaxy core with spiral arms */}
      <GalaxyCore
        particleCount={quality.particleCount}
        scrollProgress={scrollProgress}
        scrollVelocity={scrollVelocity}
      />

      {/* Post-processing effects - Bloom makes stars/glow visible */}
      <ImpressionistPP enabled />
    </>
  );
}

function FixedBackground() {
  const [mounted] = useState(() => {
    return typeof window !== 'undefined';
  });
  const quality = useAdaptiveQuality();

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
            dpr={[1, quality.pixelRatio]}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.2,
            }}
            onCreated={({ gl }) => {
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
