'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useVisibilityState, useAdaptiveQuality, useFrameLimiter } from './effects/AdaptiveQuality';

// ============================================
// SHADERS - TRUE REALISM
// ============================================

// Ultra-realistic star shader with temperature-based colors - enhanced for immersion
const STAR_VERTEX = `
  attribute float aSize;
  attribute float aBrightness;
  attribute vec3 aColor;
  attribute float aTemperature; // 0 = cool (red), 1 = hot (blue)
  varying vec3 vColor;
  varying float vBrightness;
  varying float vTemperature;
  varying float vDist;
  uniform float uTime;
  uniform float uPixelRatio;

  void main() {
    vColor = aColor;
    vBrightness = aBrightness;
    vTemperature = aTemperature;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDist = -mv.z;

    // Organic twinkle - varies by temperature, more pronounced for immersion
    float twinkleSpeed = 0.3 + aTemperature * 0.5;
    float twinkle = sin(uTime * twinkleSpeed + aBrightness * 10.0) * 0.08
                  + sin(uTime * twinkleSpeed * 1.7 + aBrightness * 5.0) * 0.05
                  + sin(uTime * twinkleSpeed * 2.3 + aBrightness * 3.0) * 0.03;

    // Larger size for more immersive stars
    float sizeAtten = 420.0 / max(vDist, 1.0);
    gl_PointSize = aSize * uPixelRatio * sizeAtten * (0.9 + twinkle);
    gl_Position = projectionMatrix * mv;
  }
`;

const STAR_FRAGMENT = `
  varying vec3 vColor;
  varying float vBrightness;
  varying float vTemperature;
  varying float vDist;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);

    // Ensure perfect circular star - discard outside radius 0.5
    if (d > 0.5) discard;

    // Bright core with enhanced soft gaussian glow for immersion
    float core = exp(-d * d * 30.0);
    float glow1 = exp(-d * d * 10.0) * 0.7;
    float glow2 = exp(-d * d * 4.0) * 0.45;
    float glow3 = exp(-d * d * 1.5) * 0.25;

    // Diffraction spike for hot (large/bright) stars - more prominent
    float spike = 0.0;
    if (vTemperature > 0.55 && vBrightness > 0.55) {
      float angle = atan(c.y, c.x);
      float spikeH = exp(-abs(sin(angle * 2.0)) * 8.0) * exp(-d * d * 12.0) * 0.35;
      float spikeV = exp(-abs(cos(angle * 2.0)) * 8.0) * exp(-d * d * 12.0) * 0.35;
      spike = (spikeH + spikeV) * vBrightness * vTemperature;
    }

    float alpha = (core + glow1 + glow2 + glow3 + spike) * vBrightness;
    if (alpha < 0.002) discard;

    // Color: hot stars are blue-white, cool stars are orange-red, enhanced brightness
    vec3 hotColor = mix(vColor, vec3(0.9, 0.95, 1.0), vTemperature * 0.4);
    vec3 color = mix(hotColor * (glow1 * 1.8 + 0.2), hotColor * (2.5 + core * 5.0), core);

    // Less fog for more visible stars
    float fog = 1.0 - smoothstep(150.0, 450.0, vDist);
    color *= fog * 0.85 + 0.6;

    gl_FragColor = vec4(color, min(alpha * 0.95, 1.0));
  }
`;

// Nebula shader - ethereal gas clouds
const NEBULA_VERTEX = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const NEBULA_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uOpacity;
  uniform float uScale;

  float hash21(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash21(i), hash21(i + vec2(1,0)), f.x),
               mix(hash21(i + vec2(0,1)), hash21(i + vec2(1,1)), f.x), f.y);
  }

  // 3D-style FBM for volumetric feel - optimized from 8 to 4 octavas
  float fbm3(vec2 p, float time) {
    float v = 0.0, a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * uScale;
    float t = uTime * 0.015;

    // Multiple flow layers for depth
    float f1 = fbm3(uv + vec2(t * 0.02, t * 0.01), t);
    float f2 = fbm3(uv * 1.5 - vec2(t * 0.015, -t * 0.02), t * 0.8);
    float f3 = fbm3(uv * 0.7 + vec2(t * 0.01, t * 0.025), t * 1.2);

    // Ethereal color mixing - more vibrant
    float m = f1 * 0.5 + f2 * 0.3 + f3 * 0.2;
    vec3 color = mix(uColor1, uColor2, m);
    color = mix(color, uColor3, f2 * 0.7);

    // Boosted color intensity
    color *= 1.0 + f3 * 0.5;

    // Soft circular falloff - no hard edges
    float dist = length(vUv - 0.5);
    float edge = 1.0 - smoothstep(0.0, 0.55, dist);
    float alpha = f1 * edge * uOpacity * 0.7;
    
    // More visible, less clamped
    alpha = clamp(alpha, 0.0, 0.75);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Galactic core - realistic spiral galaxy
const GALAXY_VERTEX = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GALAXY_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  #define PI 3.14159265359

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  // True logarithmic spiral - symmetric, no visible seam
  float spiralArm(vec2 uv, float angle, float r, float twist, float offset) {
    // Wrap angle to prevent discontinuity at 0/2PI
    float wrappedAngle = mod(angle, PI * 2.0);
    float spiral = wrappedAngle + offset - log(max(r, 0.05)) * twist;
    float density = sin(spiral * 1.5) * 0.5 + 0.5;
    return pow(density, 2.0);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // Smooth slow rotation - time only
    float t = uTime * 0.008;
    float rotated = angle + t;

    // Multiple symmetric spiral arms (4 arms for symmetry)
    float arms = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
      arms += spiralArm(uv, rotated, r, 4.5, i * PI * 0.5);
    }
    arms = clamp(arms / 4.0, 0.0, 1.0);

    // Dust lanes - dark bands across arms
    vec2 dustUv = vec2(cos(rotated * 0.25), sin(rotated * 0.25)) * r;
    float dust = fbm(dustUv * 2.0 + uTime * 0.003);
    float dustLanes = smoothstep(0.38, 0.58, dust) * (1.0 - arms * 0.8);

    // Core brightness - smooth radial gradient
    float core = exp(-r * r * 3.5) * 0.8;
    float bulge = exp(-r * r * 8.0) * 0.5;
    float halo = exp(-r * 0.6) * 0.06;

    // Colors - warm core, purple arms, visible dust
    vec3 coreColor = vec3(1.0, 0.95, 0.88) * core;
    vec3 armColor = mix(vec3(0.3, 0.15, 0.45), vec3(0.5, 0.25, 0.65), dust) * arms * 0.3;
    vec3 dustColor = vec3(0.03, 0.015, 0.04) * dustLanes;
    vec3 haloColor = vec3(0.12, 0.07, 0.2) * halo;

    vec3 color = coreColor + armColor + dustColor + haloColor;

    // Tone mapping - smooth
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(0.9));

    // Circular mask - smooth edges
    float vignette = 1.0 - smoothstep(0.45, 1.0, r);
    float alpha = clamp((core * 0.25 + arms * 0.2 + bulge * 0.15) * vignette, 0.0, 0.7);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Core glow - soft ethereal light
const CORE_GLOW_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    // Slow organic pulse
    float pulse = 1.0 + sin(uTime * 0.3) * 0.06 + sin(uTime * 0.5) * 0.03;

    // Soft multi-layer glow - more vibrant
    float g1 = exp(-dist * 7.0) * 0.55;
    float g2 = exp(-dist * 3.0) * 0.22;
    float g3 = exp(-dist * 1.5) * 0.12;

    // Color gradient
    vec3 cWhite = vec3(1.0, 0.98, 0.95);
    vec3 cGold = vec3(1.0, 0.9, 0.7);
    vec3 cPurple = vec3(0.55, 0.32, 0.75);

    vec3 color = mix(cGold, cWhite, exp(-dist * 10.0));
    color = mix(cPurple, color, smoothstep(0.0, 0.3, dist));

    float glow = (g1 + g2 + g3) * pulse;
    color *= glow * 0.65;
    color = color / (color + vec3(1.2));

    float alpha = glow * 0.55;
    alpha = min(alpha, 1.0);

    gl_FragColor = vec4(color, alpha * 0.8);
  }
`;

// Planet vertex shader
const PLANET_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    vLocalPosition = position;
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Planet fragment shader with domain-warped terrain
const PLANET_FRAGMENT = `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vLocalPosition;

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform vec3 uPlanetColor1;
  uniform vec3 uPlanetColor2;
  uniform vec3 uPlanetColor3;
  uniform float uPlanetType;
  uniform float uSeed;
  uniform float uCloudIntensity;
  uniform float uRoughness;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }

  // Domain warping for realistic terrain
  float domainWarp(vec3 p, float strength) {
    vec3 q = vec3(
      noise3(p + vec3(0.0, 0.0, 0.0)),
      noise3(p + vec3(5.2, 1.3, 2.8)),
      noise3(p + vec3(2.1, 7.5, 4.3))
    );
    vec3 r = vec3(
      noise3(p + 4.0 * q + vec3(1.7, 9.2, 3.1)),
      noise3(p + 4.0 * q + vec3(8.3, 2.8, 5.2)),
      noise3(p + 4.0 * q + vec3(3.4, 6.1, 9.7))
    );
    return noise3(p + strength * r);
  }

  // FBM with rotation
  float fbmRot(vec3 p, int octaves) {
    float v = 0.0, a = 0.5;
    mat3 rot = mat3(
      0.8, 0.6, 0.0,
     -0.6, 0.8, 0.0,
      0.0, 0.0, 1.0
    );
    for (int i = 0; i < 8; i++) {
      if (i >= octaves) break;
      v += a * noise3(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  // Domain warped terrain
  float terrain(vec3 p) {
    float warp = domainWarp(p * 0.8, 1.5) * 0.6;
    return fbmRot((p + warp) * 1.2, 6) * 0.7 +
           fbmRot((p + warp * 0.5) * 2.5, 4) * 0.3;
  }

  // Detail noise
  float detail(vec3 p) {
    return fbmRot(p * 8.0, 3) * 0.15;
  }

  // Mountains
  float mountains(vec3 p) {
    float m = smoothstep(0.55, 0.75, terrain(p * 0.5 + uSeed));
    return m * m * fbmRot(p * 3.0, 4) * 0.4;
  }

  // Ice caps
  float iceCaps(vec3 n) {
    float lat = abs(n.y);
    return smoothstep(0.6, 0.8, lat);
  }

  // Oren-Nayar diffuse for rough surfaces
  float orenNayar(vec3 n, vec3 l, vec3 v, float roughness) {
    float NdotL = max(dot(n, l), 0.0);
    float NdotV = max(dot(n, v), 0.0);
    float r2 = roughness * roughness;
    float A = 1.0 - 0.5 * r2 / (r2 + 0.33);
    float B = 0.45 * r2 / (r2 + 0.09);
    float s = dot(l, v) - NdotL * NdotV;
    float t = s <= 0.0 ? 1.0 : max(NdotL, NdotV);
    return NdotL * (A + B * s / t);
  }

  // GGX/Trowbridge-Reitz specular
  float ggx(vec3 n, vec3 h, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(n, h), 0.0);
    float NdotH2 = NdotH * NdotH;
    float num = a2;
    float denom = NdotH2 * (a2 - 1.0) + 1.0;
    denom = 3.14159 * denom * denom;
    return num / denom;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 halfVec = normalize(sunDir + viewDir);

    // Planet rotation
    float rotSpeed = uTime * 0.02 + uSeed * 10.0;
    mat3 rotY = mat3(
      cos(rotSpeed), 0.0, sin(rotSpeed),
      0.0, 1.0, 0.0,
     -sin(rotSpeed), 0.0, cos(rotSpeed)
    );
    vec3 rotPos = rotY * vLocalPosition;

    // Generate terrain
    float t = terrain(rotPos * 2.0);
    float d = detail(rotPos * 4.0);
    float m = mountains(rotPos * 1.5);
    float elev = t + d + m;

    // Surface type based on elevation and planet type
    float ice = iceCaps(normal);

    // Rocky surface colors
    vec3 lowland = uPlanetColor1;
    vec3 highland = mix(uPlanetColor1, uPlanetColor2, 0.5);
    vec3 mountain = uPlanetColor2;
    vec3 snow = vec3(0.95, 0.97, 1.0);

    // Apply surface type variations
    if (uPlanetType > 2.5) {
      // Ocean planet
      lowland = mix(uPlanetColor1, vec3(0.05, 0.1, 0.2), 0.5);
      highland = uPlanetColor2;
    } else if (uPlanetType > 1.5) {
      // Ice planet
      lowland = mix(vec3(0.7, 0.85, 0.95), uPlanetColor1, 0.3);
      highland = vec3(0.9, 0.95, 1.0);
      mountain = vec3(0.8, 0.9, 0.95);
    } else if (uPlanetType > 0.5) {
      // Gas giant - banded appearance
      float bands = sin(elev * 20.0 + uSeed * 5.0) * 0.5 + 0.5;
      lowland = mix(uPlanetColor1, uPlanetColor2, bands * 0.7);
      highland = mix(uPlanetColor2, uPlanetColor3, bands * 0.5);
    }

    // Blend surface colors by elevation
    vec3 surfaceColor = mix(lowland, highland, smoothstep(0.35, 0.55, elev));
    surfaceColor = mix(surfaceColor, mountain, smoothstep(0.6, 0.75, elev));
    surfaceColor = mix(surfaceColor, snow, ice * smoothstep(0.5, 0.7, elev));

    // Water tinting
    if (uPlanetType < 2.5) {
      vec3 waterColor = mix(vec3(0.1, 0.2, 0.35), vec3(0.05, 0.1, 0.2), elev);
      surfaceColor = mix(waterColor, surfaceColor, smoothstep(0.3, 0.45, elev));
    }

    // Lighting
    float roughness = uRoughness + elev * 0.1;
    float NdotL = max(dot(normal, sunDir), 0.0);
    float NdotV = max(dot(normal, viewDir), 0.0);

    // Wrap diffuse for softer shadows
    float diffuse = orenNayar(normal, sunDir, viewDir, roughness) * 0.8 + 0.2;

    // Specular for water/snow
    float spec = 0.0;
    if (uPlanetType > 2.5 || ice > 0.5) {
      spec = ggx(normal, halfVec, roughness * 0.3) * 0.5;
    }

    // Fresnel rim lighting
    float fresnel = pow(1.0 - NdotV, 3.0);
    vec3 rimColor = mix(uPlanetColor2, vec3(0.6, 0.7, 0.9), 0.5);

    // Ambient occlusion from elevation
    float ao = 0.7 + 0.3 * (1.0 - elev);

    // Assemble
    vec3 color = surfaceColor * diffuse * ao;
    color += vec3(spec) * fresnel + 0.1;
    color += rimColor * fresnel * 0.15;

    // Night side glow
    float nightMask = 1.0 - smoothstep(-0.2, 0.1, NdotL);
    vec3 nightGlow = uPlanetColor3 * smoothstep(0.4, 0.6, elev) * 0.08;
    color += nightGlow * nightMask;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ATMOSPHERE SHADER - Rayleigh + Mie scattering
const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    vWorldNormal = normalize((modelMatrix * vec4(position, 1.0)).xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const ATMOSPHERE_FRAGMENT = `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldNormal;

  uniform vec3 uSunDirection;
  uniform vec3 uAtmosphereColor;
  uniform vec3 uSunColor;
  uniform float uIntensity;
  uniform float uPlanetRadius;
  uniform float uAtmosphereRadius;

  // Rayleigh phase function
  float rayleighPhase(float cosTheta) {
    return 0.75 * (1.0 + cosTheta * cosTheta);
  }

  // Mie phase function (Henyey-Greenstein) - smoother
  float miePhase(float cosTheta, float g) {
    float g2 = g * g;
    float num = (1.0 - g2) * (1.0 + cosTheta * cosTheta);
    float denom = pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5) * 4.0 * 3.14159;
    return num / denom;
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    vec3 sunDir = normalize(uSunDirection);

    float NdotL = dot(normal, sunDir);
    float NdotV = dot(normal, viewDir);
    float cosTheta = dot(viewDir, sunDir);

    // Smooth fresnel for edge glow
    float fresnel = pow(1.0 - abs(NdotV), 2.0);

    // Height-based density - smoother falloff
    float dist = length(vViewPosition);
    float heightFactor = exp(-max(dist - uPlanetRadius, 0.0) * 0.5);

    // Combined scattering - smoother
    float rayleigh = rayleighPhase(cosTheta) * (0.6 + NdotL * 0.4);
    float mie = miePhase(cosTheta, 0.8) * 0.5;

    // Sun intensity
    float sunIntensity = max(NdotL, 0.0) * 0.8 + 0.2;

    // Atmosphere color with sun influence
    vec3 atmosphereColor = uAtmosphereColor * (1.0 + fresnel * 0.5);
    
    // Day side: soft atmosphere glow
    vec3 dayColor = mix(atmosphereColor * 0.4, atmosphereColor, fresnel);
    dayColor += uSunColor * mie * sunIntensity * 0.4;

    // Night side: subtle atmospheric glow
    float nightGlow = max(-NdotL + 0.3, 0.0) * 0.15;
    vec3 nightColor = atmosphereColor * nightGlow;

    // Blend day/night smoothly
    float dayWeight = smoothstep(-0.3, 0.4, NdotL);
    vec3 color = mix(nightColor, dayColor, dayWeight);

    // Smooth intensity - more visible but not harsh
    float intensity = (fresnel * 0.7 + heightFactor * 0.3) * uIntensity;
    intensity = clamp(intensity, 0.0, 0.85);

    gl_FragColor = vec4(color, intensity);
  }
`;

// CLOUD LAYER - Separate animated clouds
const CLOUD_VERTEX = `
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const CLOUD_FRAGMENT = `
  precision highp float;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  uniform float uTime;
  uniform vec3 uSunDirection;
  uniform float uSeed;
  uniform vec3 uCloudColor;
  uniform float uCloudDensity;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise2(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x),
               mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }

  float fbm2(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 4; i++) {
      v += a * noise2(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  // Curl noise for swirling clouds
  vec2 curl(vec2 p, float t) {
    float eps = 0.01;
    float n1 = fbm2(p + vec2(0.0, eps) + t);
    float n2 = fbm2(p - vec2(0.0, eps) - t);
    float n3 = fbm2(p + vec2(eps, 0.0) + t);
    float n4 = fbm2(p - vec2(eps, 0.0) - t);
    return vec2((n1 - n2) / (2.0 * eps), -(n3 - n4) / (2.0 * eps));
  }

  void main() {
    vec2 uv = vUv;

    // Slow planetary rotation
    float rotSpeed = uTime * 0.005 + uSeed;
    vec2 rotUv = vec2(
      cos(rotSpeed) * (uv.x - 0.5) - sin(rotSpeed) * (uv.y - 0.5),
      sin(rotSpeed) * (uv.x - 0.5) + cos(rotSpeed) * (uv.y - 0.5)
    ) + 0.5;

    // Cloud movement with curl
    vec2 flow = curl(rotUv * 3.0, uTime * 0.02) * 0.3;
    vec2 cloudUv = rotUv + flow + uTime * 0.01;

    // Multi-layer clouds
    float clouds = fbm2(cloudUv * 4.0) * 0.6 +
                  fbm2(cloudUv * 8.0 + 50.0) * 0.3 +
                  fbm2(cloudUv * 16.0 - 30.0) * 0.1;

    clouds = smoothstep(0.35, 0.65, clouds) * uCloudDensity;

    // Lighting
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);

    // Cloud shading
    float light = max(dot(normal, sunDir), 0.0) * 0.4 + 0.6;
    float shadow = fbm2(cloudUv * 4.0 - 0.1) * 0.3 + 0.7;

    vec3 cloudBaseColor = uCloudColor * light;
    vec3 cloudShadowColor = uCloudColor * 0.5;
    vec3 cloudCol = mix(cloudShadowColor, cloudBaseColor, shadow);

    // Silver lining at edges
    float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.0);
    cloudCol += vec3(1.0, 0.98, 0.95) * fresnel * 0.3 * light;

    float alpha = clouds * 0.85;
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(cloudCol, alpha);
  }
`;

// Ring shader - realistic with gaps and variation
const RING_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);

    // Ring bands with realistic gaps
    float bands = sin(dist * 150.0 + uTime * 0.3) * 0.5 + 0.5;
    bands = pow(bands, 1.5);

    // Random gaps (Cassini divisions-like)
    float gap1 = smoothstep(0.32, 0.34, dist) * smoothstep(0.38, 0.36, dist);
    float gap2 = smoothstep(0.42, 0.44, dist) * smoothstep(0.48, 0.46, dist);
    float gaps = 1.0 - (gap1 + gap2) * 0.7;

    // Noise for variation
    float noise = fract(sin(dot(vUv * 80.0, vec2(127.1, 311.7))) * 43758.5453);
    bands *= 0.6 + noise * 0.4;

    // Fade at edges
    float innerFade = smoothstep(0.2, 0.32, dist);
    float outerFade = 1.0 - smoothstep(0.48, 0.58, dist);
    float alpha = bands * gaps * innerFade * outerFade * 0.4;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

// Shooting star
const SHOOTING_STAR_VERTEX = `
  attribute float aProgress;
  attribute float aBrightness;
  varying float vProgress;
  varying float vBrightness;

  void main() {
    vProgress = aProgress;
    vBrightness = aBrightness;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float size = (3.5 - aProgress * 2.8) * (200.0 / -mv.z);
    gl_PointSize = max(size, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const SHOOTING_STAR_FRAGMENT = `
  varying float vProgress;
  varying float vBrightness;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);

    float core = exp(-d * d * 35.0);
    float glow = exp(-d * 5.0) * 0.4;
    float alpha = (core + glow) * (1.0 - vProgress * 0.7) * vBrightness;
    if (alpha < 0.01) discard;

    vec3 headColor = vec3(1.0, 1.0, 1.0);
    vec3 tailColor = mix(vec3(0.5, 0.9, 1.0), vec3(1.0, 0.4, 0.8), vBrightness);
    vec3 color = mix(headColor, tailColor, pow(vProgress, 1.1));
    color *= 1.6 + core * 2.8;

    gl_FragColor = vec4(color, alpha);
  }
`;

// Spaceship engine glow shader
const ENGINE_GLOW_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ENGINE_GLOW_FRAGMENT = `
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;

  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c);
    float pulse = 1.0 + sin(uTime * 14.0) * 0.18;
    float core  = exp(-d * d * 22.0) * pulse;
    float glow  = exp(-d * d * 6.0)  * 0.55 * pulse;
    float outer = exp(-d * d * 1.6)  * 0.18;
    float alpha = (core + glow + outer) * uIntensity;
    if (alpha < 0.01) discard;
    vec3 color  = mix(uColor, vec3(1.0, 1.0, 1.0), core * 0.7);
    gl_FragColor = vec4(color * (1.0 + core * 1.5), min(alpha, 1.0));
  }
`;

// Engine trail / exhaust shader
const EXHAUST_VERTEX = `
  attribute float aOffset;
  attribute float aAlpha;
  varying float vAlpha;
  uniform float uTime;

  void main() {
    vAlpha = aAlpha;
    vec3 pos = position;
    // Slight turbulence in exhaust
    pos.y += sin(uTime * 6.0 + aOffset * 4.0) * 0.08;
    pos.z += cos(uTime * 5.0 + aOffset * 3.0) * 0.08;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float sz = (0.8 - aOffset * 0.7) * (120.0 / -mv.z);
    gl_PointSize = max(sz, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

const EXHAUST_FRAGMENT = `
  varying float vAlpha;
  uniform vec3 uColor;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = exp(-d * d * 8.0) * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

// Viewport hook for responsive effects
function useViewport() {
  const [viewport, setViewport] = useState({ width: 1920, height: 1080, isMobile: false, isTablet: false });

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      setViewport({ width, height, isMobile, isTablet });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return viewport;
}

// ============================================
// COMPONENTS
// ============================================

interface StarFieldProps {
  count: number;
  radius: number;
  size: number;
  depthZ: number;
  spread: number;
}

function StarField({ count, radius, size, depthZ, spread, orbitSpeed = 0.01 }: Omit<StarFieldProps, 'scrollOffset'> & { orbitSpeed?: number }) {
  const ref = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const rotationRef = useRef(0);
  const { shouldUpdate } = useFrameLimiter(30);

  // Static positions - no per-frame calculations needed
  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightness = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const temperatures = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Distribute stars in a disk with spread
      const theta = Math.random() * Math.PI * 2;
      const r = 10 + Math.random() * radius;
      
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread * r;
      positions[i * 3 + 2] = r * Math.sin(theta);

      // Size correlates with temperature (hot = large)
      const temperature = Math.pow(Math.random(), 2);
      const baseSize = size * (0.2 + temperature * 0.8);
      sizes[i] = baseSize * (0.5 + Math.random() * 0.5);

      // Brightness inversely correlated with size for realism
      brightness[i] = 0.2 + Math.pow(Math.random(), 3) * 0.8;
      temperatures[i] = temperature;

      // Color based on temperature
      let rC, gC, bC;
      if (temperature > 0.7) {
        rC = 0.85 + Math.random() * 0.15;
        gC = 0.9 + Math.random() * 0.1;
        bC = 1.0;
      } else if (temperature > 0.4) {
        rC = 1.0;
        gC = 0.95 + Math.random() * 0.05;
        bC = 0.85 + Math.random() * 0.1;
      } else {
        rC = 1.0;
        gC = 0.7 + Math.random() * 0.2;
        bC = 0.5 + Math.random() * 0.2;
      }

      const bf = 0.5 + brightness[i] * 0.5;
      colors[i * 3] = rC * bf;
      colors[i * 3 + 1] = gC * bf;
      colors[i * 3 + 2] = bC * bf;
    }

    return { positions, sizes, brightness, colors, temperatures };
  }, [count, radius, size, spread]);

  // Single rotation update per frame - extremely cheap
  useFrame((_, delta) => {
    if (!shouldUpdate()) return;
    if (!groupRef.current) return;

    rotationRef.current += delta * orbitSpeed;
    groupRef.current.rotation.z = rotationRef.current;

    if (ref.current) {
      const mat = ref.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = performance.now() * 0.001;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -depthZ]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[data.sizes, 1]} />
          <bufferAttribute attach="attributes-aBrightness" args={[data.brightness, 1]} />
          <bufferAttribute attach="attributes-aColor" args={[data.colors, 3]} />
          <bufferAttribute attach="attributes-aTemperature" args={[data.temperatures, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={{ uTime: { value: 0 }, uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) } }}
          vertexShader={STAR_VERTEX}
          fragmentShader={STAR_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

interface PlanetProps {
  orbitRadiusX: number;
  orbitRadiusY: number;
  orbitSpeed: number;
  size: number;
  color1: string;
  color2: string;
  roughness: number;
  atmosphereColor: string;
  atmosphereIntensity: number;
  rotationSpeed: number;
  initialAngle: number;
  hasRing?: boolean;
  ringColor?: string;
  tilt?: number;
  planetType?: number; // 0=rocky, 1=gas, 2=ice, 3=ocean
  cloudColor?: string;
  cloudIntensity?: number;
  geometryDetail?: number; // 0.4 to 1.0 multiplier for segment counts
}

function Planet({
  orbitRadiusX, orbitRadiusY, orbitSpeed, size, color1, color2,
  roughness, atmosphereColor, atmosphereIntensity, rotationSpeed,
  initialAngle, hasRing = false, ringColor = '#ffffff', tilt = 0,
  planetType = 0, cloudColor = '#ffffff', cloudIntensity = 0.5,
  geometryDetail = 1
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(initialAngle);
  const timeRef = useRef(0);
  const seedRef = useRef(Math.random() * 100);
  const targetPos = useRef({ x: 0, y: 0, z: 0 });
  const currentPos = useRef({ x: 0, y: 0, z: 0 });

  // Geometry segments based on quality
  const segments = Math.max(16, Math.round(48 * geometryDetail));
  const atmosphereSegments = Math.max(12, Math.round(48 * geometryDetail));
  const outerAtmosphereSegments = Math.max(8, Math.round(32 * geometryDetail));
  const ringSegments = Math.max(32, Math.round(64 * geometryDetail));

  const sunDirection = useMemo(() => new THREE.Vector3(0.6, 0.4, 0.5).normalize(), []);
  const { shouldUpdate: shouldUpdateShaders } = useFrameLimiter(30);

  // Third color for multi-tone planets
  const color3 = useMemo(() => {
    const c = new THREE.Color(color1);
    c.lerp(new THREE.Color(color2), 0.5);
    return c;
  }, [color1, color2]);

  const planetUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: sunDirection },
    uPlanetColor1: { value: new THREE.Color(color1) },
    uPlanetColor2: { value: new THREE.Color(color2) },
    uPlanetColor3: { value: color3 },
    uPlanetType: { value: planetType },
    uSeed: { value: seedRef.current },
    uCloudIntensity: { value: cloudIntensity },
    uRoughness: { value: roughness },
  }), [color1, color2, color3, planetType, cloudIntensity, roughness, sunDirection]);

  const atmosphereUniforms = useMemo(() => ({
    uSunDirection: { value: sunDirection },
    uAtmosphereColor: { value: new THREE.Color(atmosphereColor) },
    uSunColor: { value: new THREE.Color('#fff8e8') },
    uIntensity: { value: atmosphereIntensity },
    uPlanetRadius: { value: size },
    uAtmosphereRadius: { value: size * 1.25 },
  }), [atmosphereColor, atmosphereIntensity, sunDirection, size]);

  const cloudUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSunDirection: { value: sunDirection },
    uSeed: { value: seedRef.current },
    uCloudColor: { value: new THREE.Color(cloudColor) },
    uCloudDensity: { value: cloudIntensity },
  }), [cloudColor, cloudIntensity, sunDirection]);

  const ringUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(ringColor) },
  }), [ringColor]);

  useFrame((_, delta) => {
    timeRef.current += delta;

    if (groupRef.current) {
      // Smooth time-based angle update
      angleRef.current += orbitSpeed * delta;

      // Clean elliptical orbit in 3D space
      const angle = angleRef.current;
      const targetX = Math.cos(angle) * orbitRadiusX;
      const targetY = Math.sin(angle * 0.4) * 12 + Math.sin(angle * 0.6) * 5;
      const targetZ = Math.sin(angle) * orbitRadiusY;

      // Smooth interpolation with frame-rate independent factor
      const smoothFactor = 1.0 - Math.exp(-3.0 * delta);
      
      currentPos.current.x += (targetX - currentPos.current.x) * smoothFactor;
      currentPos.current.y += (targetY - currentPos.current.y) * smoothFactor;
      currentPos.current.z += (targetZ - currentPos.current.z) * smoothFactor;

      groupRef.current.position.set(
        currentPos.current.x,
        currentPos.current.y,
        currentPos.current.z
      );

      // Planet self-rotation
      groupRef.current.rotation.y += rotationSpeed * delta;
    }

    // Shader uniforms at 30 fps — saves GPU driver calls
    if (shouldUpdateShaders()) {
      if (planetRef.current) {
        (planetRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
      }
      if (cloudRef.current) {
        (cloudRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = timeRef.current;
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[tilt, 0, 0]}>
      {/* Main planet surface - optimized segments for performance */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, segments, segments]} />
        <shaderMaterial
          uniforms={planetUniforms}
          vertexShader={PLANET_VERTEX}
          fragmentShader={PLANET_FRAGMENT}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudRef} scale={[1.03, 1.03, 1.03]}>
        <sphereGeometry args={[size, segments, segments]} />
        <shaderMaterial
          uniforms={cloudUniforms}
          vertexShader={CLOUD_VERTEX}
          fragmentShader={CLOUD_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </mesh>

      {/* Atmosphere - smooth volumetric scattering */}
      <mesh scale={[1.1, 1.1, 1.1]}>
        <sphereGeometry args={[size, atmosphereSegments, atmosphereSegments]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry args={[size, outerAtmosphereSegments, outerAtmosphereSegments]} />
        <shaderMaterial
          uniforms={atmosphereUniforms}
          vertexShader={ATMOSPHERE_VERTEX}
          fragmentShader={ATMOSPHERE_FRAGMENT}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Ring */}
      {hasRing && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[size * 1.5, size * 2.3, ringSegments]} />
          <shaderMaterial
            uniforms={ringUniforms}
            vertexShader={RING_VERTEX}
            fragmentShader={RING_FRAGMENT}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
}

const RING_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

interface NebulaCloudProps {
  position: [number, number, number];
  scale: number;
  colors: [string, string, string];
  opacity: number;
  flowSpeed: number;
  zPos: number;
}

function NebulaCloud({ position, scale, colors, opacity, flowSpeed, zPos }: NebulaCloudProps) {
  const ref = useRef<THREE.Mesh>(null);
  const rotationRef = useRef(Math.random() * Math.PI * 2);
  const { shouldUpdate } = useFrameLimiter(30);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color(colors[0]) },
    uColor2: { value: new THREE.Color(colors[1]) },
    uColor3: { value: new THREE.Color(colors[2]) },
    uOpacity: { value: opacity },
    uScale: { value: 4.0 },
  }), [colors, opacity]);

  useFrame(() => {
    if (!shouldUpdate()) return;
    if (!ref.current) return;
    const mat = ref.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = performance.now() * 0.001;
  });

  return (
    <mesh ref={ref} position={[position[0], position[1], zPos]} scale={[scale, scale, 1]} rotation={[0, 0, rotationRef.current]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={NEBULA_VERTEX}
        fragmentShader={NEBULA_FRAGMENT}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function GalacticCore() {
  const diskRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const glowPosRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const { shouldUpdate } = useFrameLimiter(30);

  const diskUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  const glowUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((_, delta) => {
    if (!shouldUpdate()) return;
    timeRef.current += delta;
    const t = timeRef.current;

    if (diskRef.current) {
      (diskRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }

    if (glowRef.current) {
      (glowRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;

      // Gentle orbital movement for galactic core glow
      const tx = Math.sin(t * 0.1) * 0.3;
      const ty = Math.cos(t * 0.08) * 0.2;
      glowPosRef.current.x += (tx - glowPosRef.current.x) * 0.02;
      glowPosRef.current.y += (ty - glowPosRef.current.y) * 0.02;

      glowRef.current.position.x = glowPosRef.current.x;
      glowRef.current.position.y = glowPosRef.current.y;
    }
  });

  return (
    <>
      <mesh ref={diskRef} position={[0, 0, -40]} scale={[180, 180, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={diskUniforms}
          vertexShader={GALAXY_VERTEX}
          fragmentShader={GALAXY_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, -32]} scale={[75, 75, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={glowUniforms}
          vertexShader={GALAXY_VERTEX}
          fragmentShader={CORE_GLOW_FRAGMENT}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  vz: number;
  age: number;
  maxAge: number;
  brightness: number;
}

function ShootingStars() {
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
    const timeout = setTimeout(spawn, 600);
    const interval = setInterval(spawn, 1800 + Math.random() * 1400);
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

// ============================================
// SPACESHIP
// ============================================
interface FlightState {
  active: boolean;
  t: number;
  speed: number;
  nextIn: number;
  p0: THREE.Vector3;
  p1: THREE.Vector3;
  p2: THREE.Vector3;
  p3: THREE.Vector3;
}

function cubicBezier(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number) {
  const inv = 1 - t;
  return new THREE.Vector3(
    inv*inv*inv*p0.x + 3*inv*inv*t*p1.x + 3*inv*t*t*p2.x + t*t*t*p3.x,
    inv*inv*inv*p0.y + 3*inv*inv*t*p1.y + 3*inv*t*t*p2.y + t*t*t*p3.y,
    inv*inv*inv*p0.z + 3*inv*inv*t*p1.z + 3*inv*t*t*p2.z + t*t*t*p3.z,
  );
}

function SpaceShip() {
  const groupRef    = useRef<THREE.Group>(null);
  const engineL     = useRef<THREE.Mesh>(null);
  const engineR     = useRef<THREE.Mesh>(null);
  const exhaust1Ref = useRef<THREE.Points>(null);
  const exhaust2Ref = useRef<THREE.Points>(null);
  const timeRef     = useRef(0);
  const flight      = useRef<FlightState>({
    active: false, t: 0, speed: 0.11,
    nextIn: 8 + Math.random() * 10,
    p0: new THREE.Vector3(), p1: new THREE.Vector3(),
    p2: new THREE.Vector3(), p3: new THREE.Vector3(),
  });

  const TRAIL_POINTS = 28;

  const { exhaustPositions, exhaustAlphas, exhaustOffsets } = useMemo(() => {
    const pos  = new Float32Array(TRAIL_POINTS * 3);
    const alph = new Float32Array(TRAIL_POINTS);
    const off  = new Float32Array(TRAIL_POINTS);
    for (let i = 0; i < TRAIL_POINTS; i++) {
      alph[i] = 1 - i / TRAIL_POINTS;
      off[i]  = i / TRAIL_POINTS;
    }
    return { exhaustPositions: pos, exhaustAlphas: alph, exhaustOffsets: off };
  }, []);

  const engineGlowUniforms = useMemo(() => ({
    uColor:     { value: new THREE.Color('#40c0ff') },
    uTime:      { value: 0 },
    uIntensity: { value: 1.6 },
  }), []);

  const exhaustUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color('#60d8ff') },
    uTime:  { value: 0 },
  }), []);

  const startFlight = () => {
    const f = flight.current;
    f.active = true;
    f.t      = 0;
    f.speed  = 0.09 + Math.random() * 0.07;
    const side = Math.random() > 0.5 ? 1 : -1;
    const yA = (Math.random() - 0.5) * 35;
    const yB = (Math.random() - 0.5) * 35;
    const zA = -5  - Math.random() * 30;
    const zB = -10 - Math.random() * 35;
    f.p0.set(side * 95, yA, zA);
    f.p1.set(side * 35, yA + (Math.random()-0.5)*25, (zA + zB) * 0.5 + (Math.random()-0.5)*15);
    f.p2.set(-side * 35, yB + (Math.random()-0.5)*25, (zA + zB) * 0.5 + (Math.random()-0.5)*15);
    f.p3.set(-side * 95, yB, zB);
  };

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t   = timeRef.current;
    const f   = flight.current;

    if (!f.active) {
      f.nextIn -= delta;
      if (f.nextIn <= 0) { startFlight(); }
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }

    f.t += delta * f.speed;
    if (f.t >= 1.0) {
      f.active = false;
      f.nextIn = 22 + Math.random() * 18;
      if (groupRef.current) groupRef.current.visible = false;
      return;
    }

    if (!groupRef.current) return;
    groupRef.current.visible = true;

    const pos     = cubicBezier(f.p0, f.p1, f.p2, f.p3, f.t);
    const posNext = cubicBezier(f.p0, f.p1, f.p2, f.p3, Math.min(f.t + 0.008, 1));
    const dir     = posNext.clone().sub(pos).normalize();

    groupRef.current.position.copy(pos);

    // Look along direction of travel
    const up = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(dir, up).normalize();
    const trueUp = new THREE.Vector3().crossVectors(right, dir).normalize();
    const mat4 = new THREE.Matrix4().makeBasis(right, trueUp, dir.clone().negate());
    groupRef.current.setRotationFromMatrix(mat4);

    // Banking — roll into the turn
    const bankAngle = -dir.x * 0.6;
    groupRef.current.rotateZ(bankAngle);

    // Engine glow uniforms
    const glowMat = engineL.current?.material as THREE.ShaderMaterial | undefined;
    if (glowMat) { glowMat.uniforms.uTime.value = t; }
    const glowMat2 = engineR.current?.material as THREE.ShaderMaterial | undefined;
    if (glowMat2) { glowMat2.uniforms.uTime.value = t; }

    // Exhaust trail for both exhausts
    [exhaust1Ref, exhaust2Ref].forEach((ref, idx) => {
      if (!ref.current) return;
      const attr = ref.current.geometry.attributes.position;
      const arr  = attr.array as Float32Array;
      const zOffset = idx === 0 ? 0.9 : -0.9;
      for (let i = 0; i < TRAIL_POINTS; i++) {
        const delay = (i / TRAIL_POINTS) * 0.06;
        const tp    = Math.max(0, f.t - delay);
        const p     = cubicBezier(f.p0, f.p1, f.p2, f.p3, tp);
        arr[i*3]   = p.x;
        arr[i*3+1] = p.y;
        arr[i*3+2] = p.z + zOffset * 0.1;
      }
      attr.needsUpdate = true;
      (ref.current.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    });

    exhaustUniforms.uTime.value = t;
  });

  const hullMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b0bac5', metalness: 0.9, roughness: 0.15 }), []);
  const glassMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#203050', metalness: 0.5, roughness: 0.05, transparent: true, opacity: 0.85 }), []);
  const wingMat  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8898a8', metalness: 0.85, roughness: 0.2 }), []);
  const engineBodyMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#607080', metalness: 0.9, roughness: 0.3, emissive: '#203040', emissiveIntensity: 0.4 }), []);

  return (
    <group ref={groupRef} visible={false}>
      {/* Hull — elongated ellipsoid */}
      <mesh scale={[2.2, 0.6, 0.75]} material={hullMat}>
        <sphereGeometry args={[1.5, 14, 10]} />
      </mesh>

      {/* Cockpit dome */}
      <mesh position={[0.9, 0.55, 0]} scale={[0.85, 0.65, 0.7]} material={glassMat}>
        <sphereGeometry args={[0.6, 10, 8]} />
      </mesh>

      {/* Left wing */}
      <mesh position={[-0.3, -0.15, 2.6]} rotation={[0.12, 0.08, -0.18]} material={wingMat}>
        <boxGeometry args={[3.2, 0.12, 1.4]} />
      </mesh>
      {/* Right wing */}
      <mesh position={[-0.3, -0.15, -2.6]} rotation={[-0.12, -0.08, 0.18]} material={wingMat}>
        <boxGeometry args={[3.2, 0.12, 1.4]} />
      </mesh>

      {/* Engine pod — left */}
      <mesh position={[-1.6, -0.25, 0.9]} rotation={[Math.PI/2, 0, 0]} material={engineBodyMat}>
        <cylinderGeometry args={[0.28, 0.24, 1.1, 10]} />
      </mesh>
      {/* Engine pod — right */}
      <mesh position={[-1.6, -0.25, -0.9]} rotation={[Math.PI/2, 0, 0]} material={engineBodyMat}>
        <cylinderGeometry args={[0.28, 0.24, 1.1, 10]} />
      </mesh>

      {/* Engine glow planes — left */}
      <mesh ref={engineL} position={[-2.2, -0.25, 0.9]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <shaderMaterial
          uniforms={engineGlowUniforms}
          vertexShader={ENGINE_GLOW_VERTEX}
          fragmentShader={ENGINE_GLOW_FRAGMENT}
          transparent depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Engine glow planes — right */}
      <mesh ref={engineR} position={[-2.2, -0.25, -0.9]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        <shaderMaterial
          uniforms={engineGlowUniforms}
          vertexShader={ENGINE_GLOW_VERTEX}
          fragmentShader={ENGINE_GLOW_FRAGMENT}
          transparent depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Exhaust trails rendered in world space via points outside group */}
    </group>
  );
}

function SpaceShipTrails() {
  const TRAIL_POINTS = 28;
  const ref1 = useRef<THREE.Points>(null);
  const ref2 = useRef<THREE.Points>(null);

  const { pos, alph, off } = useMemo(() => {
    const pos  = new Float32Array(TRAIL_POINTS * 3);
    const alph = new Float32Array(TRAIL_POINTS);
    const off  = new Float32Array(TRAIL_POINTS);
    for (let i = 0; i < TRAIL_POINTS; i++) {
      alph[i] = (1 - i / TRAIL_POINTS) * 0.9;
      off[i]  = i / TRAIL_POINTS;
    }
    return { pos, alph, off };
  }, []);

  return null; // trails rendered inside SpaceShip component
}

function CameraController({ viewport }: {
  viewport: { width: number; height: number; isMobile: boolean; isTablet: boolean };
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

    // Very gentle organic orbital movement
    const orbitX = Math.sin(t * 0.05) * 2;
    const orbitY = Math.cos(t * 0.03) * 1.5;
    const orbitZ = 65 + Math.sin(t * 0.02) * 1.5;

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

function Scene({ viewport }: { 
  viewport: { width: number; height: number; isMobile: boolean; isTablet: boolean };
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
      <NebulaCloud position={[-80, 40, -50]} scale={260 * scaleFactor} colors={['#220855', '#5b1db0', '#9333ea']} opacity={0.92} flowSpeed={0.032} zPos={-55} />
      <NebulaCloud position={[85, -35, -45]} scale={230 * scaleFactor} colors={['#06142e', '#1e44a0', '#3b82f6']} opacity={0.88} flowSpeed={0.028} zPos={-50} />
      <NebulaCloud position={[30, -55, -60]} scale={270 * scaleFactor} colors={['#200630', '#6b0fa0', '#c026d3']} opacity={0.90} flowSpeed={0.036} zPos={-65} />
      <NebulaCloud position={[-55, -45, -48]} scale={220 * scaleFactor} colors={['#250530', '#7a0d50', '#db2777']} opacity={0.82} flowSpeed={0.030} zPos={-42} />
      <NebulaCloud position={[15, 55, -70]} scale={240 * scaleFactor} colors={['#0a1a30', '#0e4060', '#0891b2']} opacity={0.78} flowSpeed={0.022} zPos={-72} />

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
      background: 'radial-gradient(ellipse at 45% 25%, #130830 0%, #080220 45%, #030010 100%)',
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
        }}
        style={{ width: '100%', height: '100%' }}
        frameloop="always"
      >
        <Scene viewport={viewport} />
      </Canvas>
    </div>
  );
}