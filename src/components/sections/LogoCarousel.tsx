'use client';

import { useSyncExternalStore } from 'react';

const LOGOS = [
  { name: 'Next.js', icon: 'N' },
  { name: 'React', icon: 'R' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Tailwind', icon: 'TW' },
  { name: 'Vercel', icon: 'V' },
  { name: 'Node.js', icon: 'N' },
  { name: 'PostgreSQL', icon: 'PG' },
  { name: 'AWS', icon: 'AWS' },
];

function getReducedMotionPreference(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const subscribeToMotionPreference = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
};

export default function LogoCarousel() {
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getReducedMotionPreference,
    () => false
  );

  return (
    <section className="py-10 bg-[#030014] border-y border-violet-900/20 overflow-hidden" aria-labelledby="tech-heading">
      <div className="container-custom px-4 mb-8">
        <h2 id="tech-heading" className="text-center text-base text-slate-400 uppercase tracking-wider">
          Tecnologías que utilizamos
        </h2>
      </div>

      <div className="relative">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#030014] to-transparent z-10" aria-hidden="true" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#030014] to-transparent z-10" aria-hidden="true" />

        {/* Infinite scroll */}
        <div className={`flex ${prefersReducedMotion ? '' : 'animate-scroll'}`}>
          {[...LOGOS, ...LOGOS].map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-xl bg-violet-950/50 border border-violet-800/30 flex items-center justify-center mb-2 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-300">
                <span className="text-lg font-bold text-violet-400">{logo.icon}</span>
              </div>
              <span className="text-xs text-slate-500">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
