'use client';

import { useEffect, useState } from 'react';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

const STORAGE_KEY = 'maatwork_utm';

export function useUtm() {
  const [utm, setUtm] = useState<UTMParams>({});

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const utmParams: UTMParams = {};
    const utmKeys: (keyof UTMParams)[] = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
    ];

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
      setUtm(utmParams);
    } else {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setUtm(JSON.parse(stored));
        } catch {
          // ignore parse errors
        }
      }
    }
  }, []);

  const getUtmString = () => {
    return Object.entries(utm)
      .map(([key, value]) => `${key}=${encodeURIComponent(value || '')}`)
      .join('&');
  };

  const getWhatsAppLink = (baseMessage: string, baseSource: string) => {
    const source = utm.utm_source || baseSource;
    return `https://wa.me/542994569840?text=${encodeURIComponent(baseMessage)}&utm_source=${encodeURIComponent(source)}`;
  };

  return { utm, getUtmString, getWhatsAppLink };
}
