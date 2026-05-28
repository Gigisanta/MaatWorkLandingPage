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

  // Mobile: CSS animated background (existing, zero overhead)
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
        poster="/bg/galaxy-poster.png"
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
