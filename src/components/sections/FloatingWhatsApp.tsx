'use client';

import { WHATSAPP_LINKS } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

export default function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_LINKS.floating}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-6 z-50 group pb-safe"
      aria-label="Contactar por WhatsApp"
    >
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-[#0a0a1a] border border-violet-800/30 rounded-lg px-4 py-2 whitespace-nowrap">
          <p className="text-sm text-white">¿Necesitás ayuda?</p>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 border-8 border-transparent border-r-violet-800/30" />
      </div>

      {/* Button */}
      <div className="relative">
        {/* Glow */}
        <div className="absolute inset-0 bg-green-500 rounded-full blur-lg opacity-30 animate-pulse" />

        {/* Icon */}
        <div className="relative w-14 h-14 bg-[#25D266] hover:bg-[#20BD5A] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
          <WhatsAppIcon className="w-7 h-7 text-white" />
        </div>
      </div>
    </a>
  );
}
