'use client';

import { WHATSAPP_BASE_URL } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

const NAV_LINKS = [
  { href: '#roi-pricing', label: 'Características' },
  { href: '#contact', label: 'Contacto' },
];

const CONTACT = {
  whatsapp: '+54 9 299 456 9840',
  email: 'info@maatwork.com',
};

export default function Footer() {
  return (
    <footer className="bg-[#030014]/95 border-t border-violet-900/20">
      <div className="container-custom px-4 py-8">
        {/* Top row - compact */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="MaatWork" className="w-8 h-8" width={32} height={32} />
            <div>
              <span className="text-lg font-semibold gradient-text">MaatWork</span>
              <p className="text-xs text-slate-500 mt-0.5">Automatización comercial</p>
            </div>
          </div>

          {/* Nav + Contact inline */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-400 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
            <a href={WHATSAPP_BASE_URL} className="text-slate-400 hover:text-green-400 transition-colors flex items-center gap-1.5">
              <WhatsAppIcon className="w-4 h-4" />
              WhatsApp
            </a>
            <a href={`mailto:${CONTACT.email}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-violet-900/20 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© 2026 MaatWork. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Términos</a>
            <span>Hecho con ❤️ en Argentina</span>
          </div>
        </div>
      </div>
    </footer>
  );
}