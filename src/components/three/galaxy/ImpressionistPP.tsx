'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface ImpressionistPPProps {
  enabled?: boolean;
  quality?: 'high' | 'medium' | 'low';
}

export function ImpressionistPP({ enabled = true, quality = 'medium' }: ImpressionistPPProps) {
  if (!enabled) return null;

  const multisampling = quality === 'high' ? 4 : quality === 'medium' ? 2 : 0;
  const bloomIntensity = quality === 'high' ? 0.6 : quality === 'medium' ? 0.5 : 0.4;
  const bloomThreshold = quality === 'high' ? 0.2 : quality === 'medium' ? 0.3 : 0.4;

  return (
    <EffectComposer multisampling={multisampling} depthBuffer={false}>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        radius={0.5}
      />
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
