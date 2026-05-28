'use client';

import { useEffect, useRef } from 'react';

const VIDEO_SOURCES = [
  { src: '/bg/galaxy-loop.webm', type: 'video/webm' },
  { src: '/bg/galaxy-loop.mp4', type: 'video/mp4' },
];

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = () => {
      v.play().catch(() => {
        // If autoplay blocked, retry on first user interaction
        const onInteract = () => {
          v.play().catch(() => {});
          document.removeEventListener('touchstart', onInteract);
          document.removeEventListener('click', onInteract);
        };
        document.addEventListener('touchstart', onInteract, { once: true });
        document.addEventListener('click', onInteract, { once: true });
      });
    };

    tryPlay();
    v.addEventListener('loadeddata', tryPlay, { once: true });
    return () => v.removeEventListener('loadeddata', tryPlay);
  }, []);

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
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/bg/galaxy-poster.png"
        disablePictureInPicture
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
        aria-hidden="true"
      >
        {VIDEO_SOURCES.map((s) => (
          <source key={s.src} src={s.src} type={s.type} />
        ))}
      </video>
    </div>
  );
}
