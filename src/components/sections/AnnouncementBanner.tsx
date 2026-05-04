'use client';

import { useState, useSyncExternalStore } from 'react';

const WHATSAPP_LINK = 'https://wa.me/5491130916574?text=Hola!%20Quiero%20saber%20más%20sobre%20el%20precio%20especial%20de%20lanzamiento';

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

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getReducedMotionPreference,
    () => false
  );

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-violet-900 via-purple-900 to-violet-900 text-white py-2 px-4 overflow-hidden">
      <div
        className={`absolute inset-0 bg-[length:200%_100%] ${prefersReducedMotion ? '' : 'animate-gradient'} opacity-80`}
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-center gap-4 text-sm md:text-base font-medium">
        <span className="flex items-center gap-2">
          <span className={`inline-block w-2 h-2 bg-green-400 rounded-full ${prefersReducedMotion ? '' : 'animate-pulse'}`} aria-hidden="true" />
          <span>Lanzamos en Beta</span>
        </span>
        <span className="hidden md:inline">|</span>
        <span className="text-violet-200">Primeras 5 apps con precio especial</span>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 px-3 py-1 bg-green-500 hover:bg-green-400 text-white text-xs font-bold rounded-full transition-colors"
        >
          ¡Asegura el tuyo!
        </a>
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
          aria-label="Cerrar banner"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
