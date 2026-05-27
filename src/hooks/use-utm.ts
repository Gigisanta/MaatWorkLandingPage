'use client';

import { useState } from 'react';
import { WHATSAPP_PHONE } from '@/lib/constants';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const STORAGE_KEY = 'maatwork_utm';

function parseInitialUTM(): UTMParams {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utmKeys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
  ];

  const utmParams: UTMParams = {};
  let hasUtm = false;

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
      hasUtm = true;
    }
  });

  if (hasUtm) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utmParams));
    return utmParams;
  }

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore parse errors
    }
  }

  return {};
}

export function useUtm() {
  const [utm] = useState<UTMParams>(parseInitialUTM);

  const getUtmString = () => {
    return Object.entries(utm)
      .map(([key, value]) => `${key}=${encodeURIComponent(value || '')}`)
      .join('&');
  };

  const getWhatsAppLink = (baseMessage: string, baseSource: string) => {
    const source = utm.utm_source || baseSource;
    return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(baseMessage)}&utm_source=${encodeURIComponent(source)}`;
  };

  return { utm, getUtmString, getWhatsAppLink };
}
