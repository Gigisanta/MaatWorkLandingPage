# Replace Three.js Galaxy with Video Background

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace the heavy Three.js galaxy scene (10 components, 40MB deps) with a looped video background, keeping the existing CSS mobile fallback.

**Architecture:** Single `<video>` element as fixed background, WebM + MP4 sources, poster image for instant paint. Mobile stays on CSS. Desktop/tablet plays video. Zero WebGL, zero Three.js.

**Tech Stack:** Next.js 16, React 19, HTML5 `<video>`, CSS

**Impact:**
- Bundle: -40MB (three + @react-three/fiber + @types/three)
- Runtime: zero GPU overhead on desktop (video decode is hardware-accelerated)
- Components deleted: 10 files in `src/components/three/`
- Components created: 1 file `src/components/VideoBackground.tsx`

---

## Task 1: Create VideoBackground component

**Objective:** New component that renders a looped video as fixed background with mobile CSS fallback.

**Files:**
- Create: `src/components/VideoBackground.tsx`

**Implementation:**

```tsx
'use client';

import { useEffect, useState } from 'react';

const VIDEO_SOURCES = [
  { src: '/bg/galaxy-loop.webm', type: 'video/webm' },
  { src: '/bg/galaxy-loop.mp4', type: 'video/mp4' },
];

export default function VideoBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Mobile: CSS animated background (existing)
  if (isMobile) {
    return (
      <div className="mobile-space-bg">
        <div className="mobile-bg-nebula-a" />
        <div className="mobile-bg-nebula-b" />
        <div className="mobile-bg-nebula-c" />
        <div className="mobile-bg-nebula-d" />
      </div>
    );
  }

  // Desktop/Tablet: video background
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        background: 'radial-gradient(ellipse at 45% 25%, #1a0840 0%, #0a0328 45%, #040115 100%)',
        contain: 'strict',
      }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/bg/galaxy-poster.webp"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
        aria-hidden="true"
      >
        {VIDEO_SOURCES.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    </div>
  );
}
```

**Verify:**
- Component renders without errors
- Mobile shows CSS background (same as current)
- Desktop shows video element (will show gradient until video files are added)

---

## Task 2: Replace GalaxyWrapper with VideoBackground in page.tsx

**Objective:** Swap the import in page.tsx from GalaxyWrapper to VideoBackground.

**Files:**
- Modify: `src/app/page.tsx:1` (import line)
- Modify: `src/app/page.tsx:14` (JSX usage)

**Changes:**

```diff
- import GalaxyWrapper from '@/components/GalaxyWrapper';
+ import VideoBackground from '@/components/VideoBackground';
```

```diff
- <GalaxyWrapper />
+ <VideoBackground />
```

**Verify:**
- `npm run build` succeeds
- Page renders with video background on desktop
- Mobile still shows CSS background

---

## Task 3: Prepare video assets directory

**Objective:** Create the public/bg/ directory and document the expected files.

**Files:**
- Create: `public/bg/` directory
- Create: `public/bg/README.md` (documents expected assets)

**public/bg/README.md:**
```markdown
# Galaxy Background Assets

Required files for the video background:

1. `galaxy-loop.webm` — Primary video (VP9 codec, ~2-5MB for 8s at 1080p)
2. `galaxy-loop.mp4` — Fallback video (H.264 codec, ~3-8MB)
3. `galaxy-poster.webp` — First frame as poster image (~50-100KB)

Generation prompt (for Veo 3.1 or any video model):

Slow cinematic pan through deep space. Dark violet-black void with thousands 
of tiny twinkling white and blue stars. A warm golden sun glows softly in the 
upper right corner. Three planets drift slowly in the mid-ground: a golden 
Saturn-like gas giant with luminous rings rotating gently, a blue ice giant 
with a cyan atmospheric glow, and a small green-blue ocean planet. Three 
volumetric nebula clouds in electric purple, deep blue, and violet hues 
slowly drift and swirl through the scene. A faint bright galactic core glows 
at the center. Occasional subtle shooting stars streak across the frame. 
Everything moves very slowly and smoothly. No sudden camera movements. 
Seamless loop. 16:9 landscape, cinematic depth of field, photorealistic 
space rendering, dark atmospheric mood. No text, no audio.

Post-processing:

```bash
# Compress to WebM (VP9)
ffmpeg -i raw-video.mp4 -c:v libvpx-vp9 -crf 30 -b:v 2M -an public/bg/galaxy-loop.webm

# Compress to MP4 (H.264 fallback)
ffmpeg -i raw-video.mp4 -c:v libx264 -crf 23 -preset slow -an -movflags +faststart public/bg/galaxy-loop.mp4

# Extract poster frame
ffmpeg -i raw-video.mp4 -vframes 1 -q:v 2 public/bg/galaxy-poster.webp
```
```

**Verify:**
- Directory exists at `public/bg/`
- README documents the full workflow

---

## Task 4: Remove Three.js components

**Objective:** Delete all Three.js-related source files.

**Files to delete (15 files in three/ + 1 wrapper):**
- `src/components/three/GalaxyBackground3D.tsx`
- `src/components/three/Scene.tsx`
- `src/components/three/StarField.tsx`
- `src/components/three/Planet.tsx`
- `src/components/three/NebulaCloud.tsx`
- `src/components/three/GalacticCore.tsx`
- `src/components/three/ShootingStars.tsx`
- `src/components/three/SpaceShip.tsx`
- `src/components/three/CameraController.tsx`
- `src/components/three/ErrorBoundary.tsx`
- `src/components/three/effects/AdaptiveQuality.tsx`
- `src/components/three/shaders/index.ts`
- `src/components/three/types.ts`
- `src/components/three/useViewport.ts`
- `src/components/three/index.ts`
- `src/components/GalaxyWrapper.tsx`

**DO NOT DELETE:** `src/components/ErrorBoundary.tsx` — used by `src/app/layout.tsx` (app-level error boundary, not Three.js specific)

**Command:**
```bash
rm -rf src/components/three/ src/components/GalaxyWrapper.tsx
```

**Verify:**
- No imports of deleted files remain
- `grep -r "three/Galaxy\|GalaxyWrapper\|@react-three" src/` returns nothing

---

## Task 5: Remove Three.js dependencies from package.json

**Objective:** Remove three, @react-three/fiber, and @types/three from package.json.

**Files:**
- Modify: `package.json`

**Changes:**

Remove from dependencies:
- `"@react-three/fiber": "^9.6.0"`
- `"three": "^0.184.0"`

Remove from devDependencies:
- `"@types/three": "^0.184.0"`

**Command:**
```bash
npm uninstall three @react-three/fiber @types/three
```

**Verify:**
- `npm run build` succeeds
- `node_modules/three` no longer exists
- Bundle size decreases by ~40MB

---

## Task 6: Verify build and clean up

**Objective:** Full build verification and cleanup.

**Steps:**
1. `npm run build` — must succeed with zero errors
2. `grep -r "three\|@react-three" src/` — must return nothing
3. Check `public/bg/` has README with prompt and instructions
4. Verify mobile CSS fallback still works (check globals.css has `.mobile-space-bg` classes)
5. `git add -A && git commit -m "refactor: replace Three.js galaxy with video background (-40MB)"`

**Expected result:**
- Build succeeds
- Desktop: gradient background (until video files are added)
- Mobile: CSS animated nebula background (unchanged)
- No Three.js references remain in codebase

---

## Execution Order

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6
```

Tasks 1-3 are additive (no breaking changes). Tasks 4-5 remove old code. Task 6 verifies.

## When Gio provides the video file:

1. Place raw video in `public/bg/`
2. Run FFmpeg commands from Task 3 README
3. Verify `galaxy-loop.webm`, `galaxy-loop.mp4`, `galaxy-poster.webp` exist
4. Test in browser — video should autoplay, loop, be muted
5. Check Lighthouse score (should improve vs Three.js)
