'use client';

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
            <a href={`https://wa.me/${CONTACT.whatsapp.replace(/\s/g, '')}`} className="text-slate-400 hover:text-green-400 transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
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
          <p>© 2025 MaatWork. Todos los derechos reservados.</p>
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