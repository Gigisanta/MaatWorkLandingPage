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
  const starMultiplier = quality.tier === 'high' ? 1 : quality.tier === 'medium' ? 0.65 : 0.35;

  return (
    <>
      {/* Deep space — rich dark violet base */}
      <color attach="background" args={['#050212']} />

      {/* Sun — warm golden key light */}
      <pointLight position={[80, 50, 60]} intensity={viewport.isMobile ? 90 : 200} color="#fff4d6" distance={600} decay={1.1} />
      {/* Cool blue fill light */}
      <pointLight position={[-60, -30, -20]} intensity={viewport.isMobile ? 14 : 32} color="#3858b8" distance={350} decay={1.4} />
      {/* Purple accent light */}
      <pointLight position={[0, 80, -20]} intensity={24} color="#9333ea" distance={220} decay={1.8} />
      {/* Subtle warm rim from below */}
      <pointLight position={[20, -60, 30]} intensity={10} color="#c084fc" distance={200} decay={2.0} />

      {/* Nebulae — vivid electric aurora clouds */}
      <NebulaCloud position={[-80, 40, -50]} scale={260 * scaleFactor} colors={['#1a0640', '#6b21a8', '#a855f7']} opacity={0.82} flowSpeed={0.032} zPos={-55} />
      <NebulaCloud position={[85, -35, -45]} scale={230 * scaleFactor} colors={['#041028', '#1e40af', '#60a5fa']} opacity={0.78} flowSpeed={0.028} zPos={-50} />
      <NebulaCloud position={[30, -55, -60]} scale={270 * scaleFactor} colors={['#180528', '#7c3aed', '#c084fc']} opacity={0.80} flowSpeed={0.036} zPos={-65} />

      {/* Galactic core */}
      <GalacticCore />

      {/* FAR BACKGROUND STARS — reduced from 6000 to 3500 */}
      <StarField count={Math.round(3500 * starMultiplier)} radius={800 * scaleFactor} size={0.6} depthZ={250} spread={0.12} orbitSpeed={0.008} />

      {/* MID-FIELD STARS — reduced from 2500 to 1500 */}
      <StarField count={Math.round(1500 * starMultiplier)} radius={400 * scaleFactor} size={0.8} depthZ={100} spread={0.15} orbitSpeed={0.012} />

      {/* ── PLANETS ────────────────────────────────── */}
      {/* Gas giant — Saturn-like with glorious rings */}
      <Planet
        orbitRadiusX={48 * scaleFactor} orbitRadiusY={36 * scaleFactor} orbitSpeed={0.032}
        size={viewport.isMobile ? 5.5 : 9} color1="#e0a84c" color2="#a86820"
        planetType={1}
        roughness={0.70} atmosphereColor="#f5d080" atmosphereIntensity={3.8}
        rotationSpeed={0.08} initialAngle={0.4} hasRing={true} ringColor="#f0d8a0"
        tilt={0.22} cloudColor="#fff0c0" cloudIntensity={0.55}
        geometryDetail={quality.tier === 'high' ? 0.8 : quality.tier === 'medium' ? 0.55 : 0.35}
      />

      {/* Ice giant — only on desktop (high/medium quality) */}
      {!viewport.isTablet && (
        <Planet
          orbitRadiusX={62 * scaleFactor} orbitRadiusY={46 * scaleFactor} orbitSpeed={0.022}
          size={7} color1="#1a5888" color2="#28a0d8"
          planetType={2}
          roughness={0.45} atmosphereColor="#48c0f0" atmosphereIntensity={4.2}
          rotationSpeed={0.12} initialAngle={2.4} tilt={-0.14}
          cloudColor="#b8eaff" cloudIntensity={0.75}
          geometryDetail={quality.tier === 'high' ? 0.8 : 0.55}
        />
      )}

      {/* Ocean planet */}
      <Planet
        orbitRadiusX={38 * scaleFactor} orbitRadiusY={30 * scaleFactor} orbitSpeed={0.042}
        size={viewport.isTablet ? 5 : 6} color1="#1870b8" color2="#30a050"
        planetType={3}
        roughness={0.55} atmosphereColor="#5098e8" atmosphereIntensity={4.5}
        rotationSpeed={0.14} initialAngle={4.8} tilt={0.1}
        cloudColor="#ffffff" cloudIntensity={0.80}
        geometryDetail={quality.tier === 'high' ? 0.8 : quality.tier === 'medium' ? 0.55 : 0.35}
      />

      {/* Lava planet — desktop only */}
      {quality.tier === 'high' && !viewport.isTablet && (
        <Planet
          orbitRadiusX={28 * scaleFactor} orbitRadiusY={22 * scaleFactor} orbitSpeed={0.058}
          size={4.5} color1="#a02800" color2="#f05000"
          planetType={0}
          roughness={0.85} atmosphereColor="#ff6030" atmosphereIntensity={4.2}
          rotationSpeed={0.2} initialAngle={1.8} tilt={0.06}
          cloudColor="#ff9050" cloudIntensity={0.35}
          geometryDetail={0.7}
        />
      )}

      {/* FOREGROUND STARS — reduced from 1000+400 to 500+200 */}
      <StarField count={Math.round(500 * starMultiplier)} radius={200 * scaleFactor} size={1.3} depthZ={-5} spread={0.2} orbitSpeed={0.018} />
      <StarField count={Math.round(200 * starMultiplier)} radius={150 * scaleFactor} size={1.8} depthZ={-35} spread={0.25} orbitSpeed={0.025} />

      {/* Shooting stars */}
      <ShootingStars />

      {/* Spaceship — passes through every ~30s on desktop */}
      {!viewport.isMobile && <SpaceShip />}

      <CameraController viewport={viewport} />
    </>
  );
}
