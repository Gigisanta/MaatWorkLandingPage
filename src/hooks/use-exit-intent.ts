'use client';

import { useEffect, useState } from 'react';

interface UseExitIntentOptions {
  enabled?: boolean;
  delayMs?: number;
  sessionStorageKey?: string;
}

export function useExitIntent(options: UseExitIntentOptions = {}) {
  const {
    enabled = true,
    delayMs = 30000,
    sessionStorageKey = 'exit_intent_shown',
  } = options;

  const [showExitIntent, setShowExitIntent] = useState(false);
  const [canShow, setCanShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const hasShown = sessionStorage.getItem(sessionStorageKey);
    if (hasShown) return;

    const timer = setTimeout(() => {
      setCanShow(true);
    }, delayMs);

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && canShow) {
        sessionStorage.setItem(sessionStorageKey, 'true');
        setShowExitIntent(true);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && canShow) {
        sessionStorage.setItem(sessionStorageKey, 'true');
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled, delayMs, canShow, sessionStorageKey]);

  const closeExitIntent = () => {
    setShowExitIntent(false);
    sessionStorage.setItem(sessionStorageKey, 'true');
  };

  return { showExitIntent, closeExitIntent };
}
