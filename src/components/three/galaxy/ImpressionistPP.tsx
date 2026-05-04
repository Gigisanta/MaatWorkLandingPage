'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

interface ImpressionistPPProps {
  enabled?: boolean;
}

export function ImpressionistPP({ enabled = true }: ImpressionistPPProps) {
  if (!enabled) return null;

  return (
    <EffectComposer multisampling={4} depthBuffer={false}>
      {/* Bloom with low intensity - makes stars and bright areas glow */}
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        radius={0.5}
      />
      {/* Subtle vignette for depth - NORMAL blend works with alpha:true Canvas */}
      <Vignette
        offset={0.3}
        darkness={0.5}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}