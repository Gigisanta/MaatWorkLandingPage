'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useViewport } from './useViewport';
import Scene from './Scene';

export default function GalaxyBackground3D() {
  const viewport = useViewport();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Mobile: pure CSS animated background — zero WebGL overhead ──
  if (viewport.isMobile) {
    return (
      <div className="mobile-space-bg">
        <div className="mobile-bg-nebula-a" />
        <div className="mobile-bg-nebula-b" />
        <div className="mobile-bg-nebula-c" />
        <div className="mobile-bg-nebula-d" />
      </div>
    );
  }

  const dpr       = Math.min(window.devicePixelRatio, viewport.isTablet ? 1.5 : 2);
  const antialias = dimensions.width > 0;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      background: 'radial-gradient(ellipse at 45% 25%, #1a0840 0%, #0a0328 45%, #040115 100%)',
      contain: 'strict',
    }}>
      <Canvas
        camera={{ position: [0, 0, 65], fov: 60 }}
        dpr={dpr}
        gl={{
          antialias,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true,
          // Additional optimizations
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
        // Performance: skip unnecessary checks
        flat={false}
        legacy={false}
      >
        <Scene viewport={viewport} />
      </Canvas>
    </div>
  );
}
