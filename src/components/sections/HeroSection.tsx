'use client';

import { useEffect, useRef } from 'react';

const WHATSAPP_LINK = 'https://wa.me/542994569840?text=Hola!%20Quiero%20probar%20MaatWork%20gratis';

const TRUST_BADGES = [
  { value: '+1 año', label: 'desarrollo' },
  { value: '+500', label: 'usuarios en espera' },
  { value: '100%', label: 'escala desde día uno' },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const reveals = sectionRef.current?.querySelectorAll('.reveal');
      reveals?.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const reveals = sectionRef.current?.querySelectorAll('.reveal');
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-[#030014]/30 to-[#030014]/50 z-[1]" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        <h1 className="reveal opacity-0 translate-y-8 text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 text-glow transition-all duration-700 ease-out" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">Automatiza tu local.</span>
          <br />
          <span className="gradient-text font-semibold">Sin complicaciones.</span>
        </h1>

        <p className="reveal opacity-0 translate-y-8 text-lg md:text-xl lg:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide transition-all duration-700 ease-out" style={{ animationDelay: '0.3s' }}>
          El SaaS que gyms, salones y academias eligen en Argentina.
        </p>

        <div className="reveal opacity-0 translate-y-8 flex flex-wrap justify-center gap-8 mb-12 transition-all duration-700 ease-out" style={{ animationDelay: '0.5s' }}>
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="flex items-center gap-3 transition-all duration-500 ease-out" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
              <span className="text-3xl md:text-4xl font-bold gradient-text">{badge.value}</span>
              <span className="text-sm text-slate-400 uppercase tracking-wide">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="reveal opacity-0 translate-y-8 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out" style={{ animationDelay: '0.8s' }}>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Comenzar gratis ahora
          </a>
          <a href="#all-in-one" className="flex items-center gap-2 px-6 py-4 text-slate-300 hover:text-white transition-colors">
            Ver cómo funciona
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-fade-in" style={{ animationDelay: '1.5s', animationFillMode: 'forwards' }}>
        <div className="w-6 h-10 rounded-full border-2 border-violet-500/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-violet-400 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
