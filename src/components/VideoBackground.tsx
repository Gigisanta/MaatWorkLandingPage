'use client';

const VIDEO_SOURCES = [
  { src: '/bg/galaxy-loop.webm', type: 'video/webm' },
  { src: '/bg/galaxy-loop.mp4', type: 'video/mp4' },
];

export default function VideoBackground() {
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
