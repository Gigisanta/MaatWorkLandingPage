# Galaxy Background Assets

Required files for the video background:

1. `galaxy-loop.webm` — Primary video (VP9 codec, ~2-5MB for 8s at 1080p)
2. `galaxy-loop.mp4` — Fallback video (H.264 codec, ~3-8MB)
3. `galaxy-poster.webp` — First frame as poster image (~50-100KB)

## Generation Prompt (Veo 3.1 / any video model)

```
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
```

## Post-processing

```bash
# Compress to WebM (VP9) — primary
ffmpeg -i raw-video.mp4 -c:v libvpx-vp9 -crf 30 -b:v 2M -an public/bg/galaxy-loop.webm

# Compress to MP4 (H.264 fallback)
ffmpeg -i raw-video.mp4 -c:v libx264 -crf 23 -preset slow -an -movflags +faststart public/bg/galaxy-loop.mp4

# Extract poster frame
ffmpeg -i raw-video.mp4 -vframes 1 -q:v 2 public/bg/galaxy-poster.webp
```

## Loop optimization (optional, for seamless loop)

```bash
# Crossfade first/last 1 second for seamless loop
ffmpeg -i galaxy-loop.mp4 -filter_complex \
  "[0]split[orig][flip];[flip]reverse[r];[orig][r]blend=all_expr='if(gte(X,W/2),A,B)':shortest=1" \
  -c:v libx264 -crf 18 galaxy-seamless.mp4
```
