'use client';

import { useVisibilityState, useAdaptiveQuality } from './effects/AdaptiveQuality';
import type { ViewportInfo } from './types';
import StarField from './StarField';
import Planet from './Planet';
import NebulaCloud from './NebulaCloud';
import GalacticCore from './GalacticCore';
import ShootingStars from './ShootingStars';
import SpaceShip from './SpaceShip';
import CameraController from './CameraController';

export default function Scene({ viewport }: { 
  viewport: ViewportInfo;
}) {
  const { isVisible } = useVisibilityState();
  const quality = useAdaptiveQuality();

  if (!isVisible) return null;

  // Responsive scaling
  const scaleFactor = viewport.isMobile ? 0.6 : viewport.isTablet ? 0.8 : 1;
  const starMultiplier = quality.tier === 'high' ? 1 : quality.tier === 'medium' ? 0.7 : 0.4;

  return (
    <>
      {/* Deep space — rich dark violet base */}
      <color attach="background" args={['#060215']} />

      {/* Sun — dramatic directional light illuminating planets */}
      <pointLight position={[80, 50, 60]} intensity={viewport.isMobile ? 80 : 180} color="#fff6e0" distance={600} decay={1.1} />
      <pointLight position={[-60, -30, -20]} intensity={viewport.isMobile ? 12 : 28} color="#4060c0" distance={350} decay={1.4} />
      <pointLight position={[0, 80, -20]} intensity={20} color="#a855f7" distance={200} decay={1.8} />

      {/* Nebulae — vivid electric aurora clouds */}
      <NebulaCloud position={[-80, 40, -50]} scale={260 * scaleFactor} colors={['#220855', '#5b1db0', '#9333ea']} opacity={0.78} flowSpeed={0.032} zPos={-55} />
      <NebulaCloud position={[85, -35, -45]} scale={230 * scaleFactor} colors={['#06142e', '#1e44a0', '#3b82f6']} opacity={0.72} flowSpeed={0.028} zPos={-50} />
      <NebulaCloud position={[30, -55, -60]} scale={270 * scaleFactor} colors={['#200630', '#6b0fa0', '#c026d3']} opacity={0.75} flowSpeed={0.036} zPos={-65} />
      <NebulaCloud position={[-55, -45, -48]} scale={220 * scaleFactor} colors={['#250530', '#7a0d50', '#db2777']} opacity={0.68} flowSpeed={0.030} zPos={-42} />
      <NebulaCloud position={[15, 55, -70]} scale={240 * scaleFactor} colors={['#0a1a30', '#0e4060', '#0891b2']} opacity={0.64} flowSpeed={0.022} zPos={-72} />

      {/* Galactic core */}
      <GalacticCore />

      {/* FAR BACKGROUND STARS */}
      <StarField count={Math.round(6000 * starMultiplier)} radius={800 * scaleFactor} size={0.6} depthZ={250} spread={0.12} orbitSpeed={0.008} />

      {/* MID-FIELD STARS */}
      <StarField count={Math.round(2500 * starMultiplier)} radius={400 * scaleFactor} size={0.8} depthZ={100} spread={0.15} orbitSpeed={0.012} />

      {/* ── PLANETS ────────────────────────────────── */}
      {/* Gas giant — Saturn-like with glorious rings */}
      <Planet
        orbitRadiusX={48 * scaleFactor} orbitRadiusY={36 * scaleFactor} orbitSpeed={0.032}
        size={viewport.isMobile ? 5.5 : 9} color1="#d4a055" color2="#9b6028"
        planetType={1}
        roughness={0.75} atmosphereColor="#f0c880" atmosphereIntensity={3.2}
        rotationSpeed={0.08} initialAngle={0.4} hasRing={true} ringColor="#e8d0a0"
        tilt={0.22} cloudColor="#ffe8bb" cloudIntensity={0.5}
        geometryDetail={quality.tier === 'high' ? 1 : quality.tier === 'medium' ? 0.65 : 0.4}
      />

      {/* Ice giant — only on desktop (high/medium quality) */}
      {!viewport.isTablet && (
        <Planet
          orbitRadiusX={62 * scaleFactor} orbitRadiusY={46 * scaleFactor} orbitSpeed={0.022}
          size={7} color1="#1a5070" color2="#2090c8"
          planetType={2}
          roughness={0.5} atmosphereColor="#40b0e8" atmosphereIntensity={3.6}
          rotationSpeed={0.12} initialAngle={2.4} tilt={-0.14}
          cloudColor="#a8e0ff" cloudIntensity={0.7}
          geometryDetail={quality.tier === 'high' ? 1 : 0.65}
        />
      )}

      {/* Ocean planet */}
      <Planet
        orbitRadiusX={38 * scaleFactor} orbitRadiusY={30 * scaleFactor} orbitSpeed={0.042}
        size={viewport.isTablet ? 5 : 6} color1="#1560a8" color2="#28903a"
        planetType={3}
        roughness={0.6} atmosphereColor="#5590e8" atmosphereIntensity={4.0}
        rotationSpeed={0.14} initialAngle={4.8} tilt={0.1}
        cloudColor="#ffffff" cloudIntensity={0.75}
        geometryDetail={quality.tier === 'high' ? 1 : quality.tier === 'medium' ? 0.65 : 0.4}
      />

      {/* Lava planet — desktop only */}
      {quality.tier === 'high' && !viewport.isTablet && (
        <Planet
          orbitRadiusX={28 * scaleFactor} orbitRadiusY={22 * scaleFactor} orbitSpeed={0.058}
          size={4.5} color1="#8b2000" color2="#e04000"
          planetType={0}
          roughness={0.9} atmosphereColor="#ff5020" atmosphereIntensity={3.8}
          rotationSpeed={0.2} initialAngle={1.8} tilt={0.06}
          cloudColor="#ff8040" cloudIntensity={0.3}
          geometryDetail={0.9}
        />
      )}

      {/* FOREGROUND STARS */}
      <StarField count={Math.round(1000 * starMultiplier)} radius={200 * scaleFactor} size={1.3} depthZ={-5} spread={0.2} orbitSpeed={0.018} />
      <StarField count={Math.round(400 * starMultiplier)} radius={150 * scaleFactor} size={1.8} depthZ={-35} spread={0.25} orbitSpeed={0.025} />

      {/* Shooting stars */}
      <ShootingStars />

      {/* Spaceship — passes through every ~30s on desktop */}
      {!viewport.isMobile && <SpaceShip />}

      <CameraController viewport={viewport} />
    </>
  );
}
