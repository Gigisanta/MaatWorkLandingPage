// ============================================
// GLSL SHADERS - ENHANCED VISUAL QUALITY
// ============================================

// Ultra-realistic star shader with temperature-based colors
export const STAR_VERTEX = `
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
    float twinkle = sin(uTime * twinkleSpeed + aBrightness * 10.0) * 0.10
                  + sin(uTime * twinkleSpeed * 1.7 + aBrightness * 5.0) * 0.06
                  + sin(uTime * twinkleSpeed * 2.3 + aBrightness * 3.0) * 0.04;

    // Larger size for more immersive stars
    float sizeAtten = 450.0 / max(vDist, 1.0);
    gl_PointSize = aSize * uPixelRatio * sizeAtten * (0.9 + twinkle);
    gl_Position = projectionMatrix * mv;
  }
`;

export const STAR_FRAGMENT = `
  precision highp float;
  varying vec3 vColor;
  varying float vBrightness;
  varying float vTemperature;
  varying float vDist;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);

    // Ensure perfect circular star - discard outside radius 0.5
    if (d > 0.5) discard;

    // Enhanced multi-layer gaussian glow
    float core = exp(-d * d * 35.0);
    float glow1 = exp(-d * d * 12.0) * 0.75;
    float glow2 = exp(-d * d * 5.0) * 0.50;
    float glow3 = exp(-d * d * 2.0) * 0.30;
    float glow4 = exp(-d * d * 0.8) * 0.15; // Wide halo

    // Enhanced diffraction spikes for hot/bright stars
    float spike = 0.0;
    if (vTemperature > 0.5 && vBrightness > 0.5) {
      float angle = atan(c.y, c.x);
      // 4-pointed star pattern
      float spikeH = exp(-abs(sin(angle * 2.0)) * 6.0) * exp(-d * d * 10.0) * 0.40;
      float spikeV = exp(-abs(cos(angle * 2.0)) * 6.0) * exp(-d * d * 10.0) * 0.40;
      // Diagonal secondary spikes for 8-point effect
      float spikeD1 = exp(-abs(sin(angle * 2.0 + 0.785)) * 12.0) * exp(-d * d * 14.0) * 0.20;
      float spikeD2 = exp(-abs(cos(angle * 2.0 + 0.785)) * 12.0) * exp(-d * d * 14.0) * 0.20;
      spike = (spikeH + spikeV + spikeD1 + spikeD2) * vBrightness * vTemperature;
    }

    float alpha = (core + glow1 + glow2 + glow3 + glow4 + spike) * vBrightness;
    if (alpha < 0.002) discard;

    // Chromatic aberration for hot stars - subtle color fringing
    vec3 hotColor = mix(vColor, vec3(0.85, 0.92, 1.0), vTemperature * 0.5);
    vec3 warmColor = mix(vColor, vec3(1.0, 0.95, 0.85), (1.0 - vTemperature) * 0.3);
    vec3 baseColor = mix(warmColor, hotColor, vTemperature);

    // Enhanced brightness with core bloom
    vec3 color = baseColor * (glow1 * 2.0 + 0.25);
    color = mix(color, baseColor * (3.0 + core * 6.0), core);
    // Add subtle color shift in outer glow
    color += baseColor * glow4 * 0.8;

    // Fog with softer falloff
    float fog = 1.0 - smoothstep(120.0, 500.0, vDist);
    color *= fog * 0.88 + 0.55;

    gl_FragColor = vec4(color, min(alpha * 0.95, 1.0));
  }
`;

// Nebula shader - enhanced ethereal gas clouds with domain warping
export const NEBULA_VERTEX = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const NEBULA_FRAGMENT = `
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

  // 5-octave FBM for richer detail
  float fbm5(vec2 p, float time) {
    float v = 0.0, a = 0.5;
    vec2 shift = vec2(100.0);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  // Domain warping for organic cloud shapes
  float domainWarp(vec2 p, float time) {
    vec2 q = vec2(fbm5(p + vec2(0.0, 0.0), time),
                  fbm5(p + vec2(5.2, 1.3), time));
    vec2 r = vec2(fbm5(p + 4.0 * q + vec2(1.7, 9.2), time),
                  fbm5(p + 4.0 * q + vec2(8.3, 2.8), time));
    return fbm5(p + 2.0 * r, time);
  }

  void main() {
    vec2 uv = (vUv - 0.5) * uScale;
    // Three independent time speeds so layers never sync
    float t1 = uTime * 0.010;
    float t2 = uTime * 0.007;
    float t3 = uTime * 0.014;

    // Domain-warped layers for organic shapes
    float f1 = domainWarp(uv * 0.8 + vec2(t1 * 0.015, t1 * 0.008), t1);
    float f2 = domainWarp(uv * 1.2 + vec2(-t2 * 0.010, t2 * 0.018), t2);
    float f3 = fbm5(uv * 0.5 + vec2(t3 * 0.006, -t3 * 0.015), t3);

    // Weighted blend — f1 dominates shape, f2/f3 add texture
    float m = f1 * 0.50 + f2 * 0.32 + f3 * 0.18;
    vec3 color = mix(uColor1, uColor2, m);
    color = mix(color, uColor3, f2 * 0.70);
    color *= 1.0 + f3 * 0.50;

    // Add subtle internal luminance variation
    float luminance = fbm5(uv * 2.5 + vec2(t1 * 0.02, -t2 * 0.015), t1 * 0.5);
    color *= 0.85 + luminance * 0.35;

    // Soft elliptical falloff — wider horizontally for a natural cloud shape
    vec2 d = (vUv - 0.5) * vec2(1.0, 1.3);
    float dist = length(d);
    float edge = 1.0 - smoothstep(0.0, 0.50, dist);
    float alpha = f1 * edge * uOpacity * 0.72;
    alpha = clamp(alpha, 0.0, 0.75);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Galactic core - enhanced spiral galaxy with brighter core
export const GALAXY_VERTEX = `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vUv = uv;
    vWorldPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const GALAXY_FRAGMENT = `
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
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
    return v;
  }

  // True logarithmic spiral - symmetric, no visible seam
  float spiralArm(vec2 uv, float angle, float r, float twist, float offset) {
    float wrappedAngle = mod(angle, PI * 2.0);
    float spiral = wrappedAngle + offset - log(max(r, 0.05)) * twist;
    float density = sin(spiral * 1.5) * 0.5 + 0.5;
    return pow(density, 2.2);
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float r = length(uv);
    float angle = atan(uv.y, uv.x);

    // Smooth slow rotation
    float t = uTime * 0.008;
    float rotated = angle + t;

    // Multiple symmetric spiral arms (4 arms)
    float arms = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
      arms += spiralArm(uv, rotated, r, 4.5, i * PI * 0.5);
    }
    arms = clamp(arms / 4.0, 0.0, 1.0);

    // Secondary finer arms
    float fineArms = 0.0;
    for (float i = 0.0; i < 4.0; i++) {
      fineArms += spiralArm(uv, rotated, r, 6.0, i * PI * 0.5 + PI * 0.25);
    }
    fineArms = clamp(fineArms / 4.0, 0.0, 1.0) * 0.3;

    // Dust lanes
    vec2 dustUv = vec2(cos(rotated * 0.25), sin(rotated * 0.25)) * r;
    float dust = fbm(dustUv * 2.0 + uTime * 0.003);
    float dustLanes = smoothstep(0.38, 0.58, dust) * (1.0 - arms * 0.8);

    // Enhanced core brightness
    float core = exp(-r * r * 4.0) * 1.0;
    float bulge = exp(-r * r * 10.0) * 0.6;
    float halo = exp(-r * 0.5) * 0.08;

    // Hot core with blue-white center
    vec3 coreColor = vec3(1.0, 0.97, 0.92) * core;
    vec3 coreCenter = vec3(0.95, 0.95, 1.0) * exp(-r * r * 15.0) * 0.4;
    vec3 armColor = mix(vec3(0.35, 0.18, 0.50), vec3(0.55, 0.28, 0.70), dust) * (arms + fineArms) * 0.35;
    vec3 dustColor = vec3(0.04, 0.02, 0.05) * dustLanes;
    vec3 haloColor = vec3(0.14, 0.08, 0.22) * halo;

    vec3 color = coreColor + coreCenter + armColor + dustColor + haloColor;

    // Tone mapping
    color = color / (color + vec3(1.0));
    color = pow(color, vec3(0.85));

    // Circular mask
    float vignette = 1.0 - smoothstep(0.42, 0.95, r);
    float alpha = clamp((core * 0.30 + (arms + fineArms) * 0.22 + bulge * 0.18) * vignette, 0.0, 0.75);

    gl_FragColor = vec4(color, alpha);
  }
`;

// Core glow - enhanced ethereal light
export const CORE_GLOW_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    // Slow organic pulse with harmonics
    float pulse = 1.0 + sin(uTime * 0.3) * 0.08 + sin(uTime * 0.5) * 0.04 + sin(uTime * 0.17) * 0.03;

    // Enhanced multi-layer glow
    float g1 = exp(-dist * 8.0) * 0.60;
    float g2 = exp(-dist * 3.5) * 0.25;
    float g3 = exp(-dist * 1.8) * 0.15;
    float g4 = exp(-dist * 0.6) * 0.06; // Wide outer glow

    // Richer color gradient
    vec3 cWhite = vec3(1.0, 0.98, 0.96);
    vec3 cGold = vec3(1.0, 0.88, 0.65);
    vec3 cPurple = vec3(0.50, 0.28, 0.72);
    vec3 cBlue = vec3(0.60, 0.70, 0.90);

    vec3 color = mix(cGold, cWhite, exp(-dist * 12.0));
    color = mix(cPurple, color, smoothstep(0.0, 0.25, dist));
    color = mix(cBlue, color, smoothstep(0.2, 0.45, dist));

    float glow = (g1 + g2 + g3 + g4) * pulse;
    color *= glow * 0.70;
    color = color / (color + vec3(1.1));

    float alpha = glow * 0.60;
    alpha = min(alpha, 1.0);

    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

// Planet vertex shader
export const PLANET_VERTEX = `
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
export const PLANET_FRAGMENT = `
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
      spec = ggx(normal, halfVec, roughness * 0.3) * 0.6;
    }

    // Enhanced fresnel rim lighting
    float fresnel = pow(1.0 - NdotV, 3.5);
    vec3 rimColor = mix(uPlanetColor2, vec3(0.65, 0.75, 0.95), 0.5);

    // Ambient occlusion from elevation
    float ao = 0.7 + 0.3 * (1.0 - elev);

    // Assemble
    vec3 color = surfaceColor * diffuse * ao;
    color += vec3(spec) * fresnel + 0.12;
    color += rimColor * fresnel * 0.20;

    // Night side glow - enhanced
    float nightMask = 1.0 - smoothstep(-0.2, 0.1, NdotL);
    vec3 nightGlow = uPlanetColor3 * smoothstep(0.4, 0.6, elev) * 0.10;
    color += nightGlow * nightMask;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// ATMOSPHERE SHADER - Enhanced Rayleigh + Mie scattering
export const ATMOSPHERE_VERTEX = `
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

export const ATMOSPHERE_FRAGMENT = `
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

  // Mie phase function (Henyey-Greenstein)
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

    // Enhanced fresnel with stronger edge glow
    float fresnel = pow(1.0 - abs(NdotV), 2.5);

    // Height-based density
    float dist = length(vViewPosition);
    float heightFactor = exp(-max(dist - uPlanetRadius, 0.0) * 0.4);

    // Combined scattering
    float rayleigh = rayleighPhase(cosTheta) * (0.65 + NdotL * 0.35);
    float mie = miePhase(cosTheta, 0.75) * 0.6;

    // Sun intensity with limb darkening
    float sunIntensity = max(NdotL, 0.0) * 0.85 + 0.15;
    float limbDark = 1.0 - pow(1.0 - NdotV, 2.0) * 0.3;

    // Atmosphere color with sun influence
    vec3 atmosphereColor = uAtmosphereColor * (1.0 + fresnel * 0.6);
    
    // Day side: enhanced atmosphere glow with sun contribution
    vec3 dayColor = mix(atmosphereColor * 0.45, atmosphereColor, fresnel);
    dayColor += uSunColor * mie * sunIntensity * 0.50;
    // Sun glow at terminator
    float terminatorGlow = exp(-pow(abs(NdotL - 0.1), 2.0) * 8.0) * 0.15;
    dayColor += uSunColor * terminatorGlow;

    // Night side: subtle atmospheric glow
    float nightGlow = max(-NdotL + 0.3, 0.0) * 0.18;
    vec3 nightColor = atmosphereColor * nightGlow;

    // Blend day/night smoothly
    float dayWeight = smoothstep(-0.3, 0.4, NdotL);
    vec3 color = mix(nightColor, dayColor, dayWeight) * limbDark;

    // Intensity with better falloff
    float intensity = (fresnel * 0.75 + heightFactor * 0.25) * uIntensity;
    intensity = clamp(intensity, 0.0, 0.88);

    gl_FragColor = vec4(color, intensity);
  }
`;

// CLOUD LAYER - Enhanced animated clouds
export const CLOUD_VERTEX = `
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

export const CLOUD_FRAGMENT = `
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
    for (int i = 0; i < 5; i++) {
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

    // Cloud movement with enhanced curl
    vec2 flow = curl(rotUv * 3.0, uTime * 0.018) * 0.35;
    vec2 cloudUv = rotUv + flow + uTime * 0.008;

    // Multi-layer clouds with more detail
    float clouds = fbm2(cloudUv * 4.0) * 0.55 +
                  fbm2(cloudUv * 8.0 + 50.0) * 0.28 +
                  fbm2(cloudUv * 16.0 - 30.0) * 0.12 +
                  fbm2(cloudUv * 32.0 + 70.0) * 0.05;

    clouds = smoothstep(0.32, 0.68, clouds) * uCloudDensity;

    // Lighting
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);

    float light = max(dot(normal, sunDir), 0.0) * 0.45 + 0.55;
    float shadow = fbm2(cloudUv * 4.0 - 0.1) * 0.35 + 0.65;

    vec3 cloudBaseColor = uCloudColor * light;
    vec3 cloudShadowColor = uCloudColor * 0.45;
    vec3 cloudCol = mix(cloudShadowColor, cloudBaseColor, shadow);

    // Enhanced silver lining at edges
    float fresnel = pow(1.0 - abs(dot(normal, vec3(0.0, 0.0, 1.0))), 2.5);
    cloudCol += vec3(1.0, 0.98, 0.96) * fresnel * 0.35 * light;

    float alpha = clouds * 0.88;
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(cloudCol, alpha);
  }
`;

// Ring shader - enhanced realistic with gaps and variation
export const RING_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const RING_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = length(vUv - center);

    // Ring bands with enhanced detail
    float bands = sin(dist * 180.0 + uTime * 0.25) * 0.5 + 0.5;
    bands = pow(bands, 1.4);

    // Multiple Cassini-like gaps
    float gap1 = smoothstep(0.32, 0.34, dist) * smoothstep(0.38, 0.36, dist);
    float gap2 = smoothstep(0.42, 0.44, dist) * smoothstep(0.48, 0.46, dist);
    float gap3 = smoothstep(0.52, 0.53, dist) * smoothstep(0.55, 0.54, dist);
    float gaps = 1.0 - (gap1 + gap2 + gap3) * 0.65;

    // Fine grain noise for variation
    float noise = fract(sin(dot(vUv * 100.0, vec2(127.1, 311.7))) * 43758.5453);
    bands *= 0.55 + noise * 0.45;

    // Subtle color variation across rings
    vec3 ringColor = mix(uColor * 0.85, uColor * 1.15, sin(dist * 60.0) * 0.5 + 0.5);

    // Fade at edges
    float innerFade = smoothstep(0.2, 0.32, dist);
    float outerFade = 1.0 - smoothstep(0.48, 0.58, dist);
    float alpha = bands * gaps * innerFade * outerFade * 0.45;

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(ringColor, alpha);
  }
`;

// Shooting star - enhanced with better tail
export const SHOOTING_STAR_VERTEX = `
  attribute float aProgress;
  attribute float aBrightness;
  varying float vProgress;
  varying float vBrightness;

  void main() {
    vProgress = aProgress;
    vBrightness = aBrightness;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float size = (4.0 - aProgress * 3.2) * (220.0 / -mv.z);
    gl_PointSize = max(size, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const SHOOTING_STAR_FRAGMENT = `
  precision highp float;
  varying float vProgress;
  varying float vBrightness;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);

    // Enhanced glow layers
    float core = exp(-d * d * 40.0);
    float glow1 = exp(-d * 6.0) * 0.45;
    float glow2 = exp(-d * 2.5) * 0.20;
    float alpha = (core + glow1 + glow2) * (1.0 - vProgress * 0.65) * vBrightness;
    if (alpha < 0.01) discard;

    vec3 headColor = vec3(1.0, 1.0, 1.0);
    vec3 tailColor = mix(vec3(0.45, 0.85, 1.0), vec3(1.0, 0.35, 0.75), vBrightness);
    vec3 color = mix(headColor, tailColor, pow(vProgress, 1.0));
    color *= 1.8 + core * 3.5;

    gl_FragColor = vec4(color, alpha);
  }
`;

// Spaceship engine glow shader - enhanced
export const ENGINE_GLOW_VERTEX = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ENGINE_GLOW_FRAGMENT = `
  precision highp float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;

  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c);
    // More complex flicker with harmonics
    float pulse = 1.0 + sin(uTime * 14.0) * 0.15 + sin(uTime * 23.0) * 0.08 + sin(uTime * 7.0) * 0.05;
    float core  = exp(-d * d * 25.0) * pulse;
    float glow  = exp(-d * d * 7.0)  * 0.60 * pulse;
    float outer = exp(-d * d * 2.0)  * 0.22;
    float halo  = exp(-d * d * 0.6)  * 0.08;
    float alpha = (core + glow + outer + halo) * uIntensity;
    if (alpha < 0.01) discard;
    vec3 color  = mix(uColor, vec3(1.0, 1.0, 1.0), core * 0.75);
    gl_FragColor = vec4(color * (1.0 + core * 1.8), min(alpha, 1.0));
  }
`;

// Engine trail / exhaust shader - enhanced
export const EXHAUST_VERTEX = `
  attribute float aOffset;
  attribute float aAlpha;
  varying float vAlpha;
  uniform float uTime;

  void main() {
    vAlpha = aAlpha;
    vec3 pos = position;
    // Enhanced turbulence in exhaust
    pos.y += sin(uTime * 6.0 + aOffset * 4.0) * 0.10;
    pos.z += cos(uTime * 5.0 + aOffset * 3.0) * 0.10;
    pos.x += sin(uTime * 4.5 + aOffset * 5.0) * 0.05;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float sz = (0.9 - aOffset * 0.75) * (130.0 / -mv.z);
    gl_PointSize = max(sz, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const EXHAUST_FRAGMENT = `
  precision highp float;
  varying float vAlpha;
  uniform vec3 uColor;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float core = exp(-d * d * 12.0) * 1.2;
    float glow = exp(-d * d * 4.0) * 0.5;
    float a = (core + glow) * vAlpha;
    if (a < 0.01) discard;
    vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), core * 0.4);
    gl_FragColor = vec4(color, a);
  }
`;
