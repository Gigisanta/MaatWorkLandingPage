'use client';

import { useEffect, useRef } from 'react';

import { WHATSAPP_LINKS } from '@/lib/constants';
import WhatsAppIcon from '@/components/icons/WhatsAppIcon';

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
        <h1 className="reveal opacity-0 translate-y-8 text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6 text-glow transition-all duration-700 ease-out" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">Automatiza tu local.</span>
          <br />
          <span className="gradient-text font-semibold">Sin complicaciones.</span>
        </h1>

        <p className="reveal opacity-0 translate-y-8 text-lg md:text-xl lg:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed tracking-wide transition-all duration-700 ease-out" style={{ animationDelay: '0.3s' }}>
          El SaaS que gyms, salones y academias eligen en Argentina.
        </p>

        <div className="reveal opacity-0 translate-y-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-8 mb-12 transition-all duration-700 ease-out" style={{ animationDelay: '0.5s' }}>
          {TRUST_BADGES.map((badge, i) => (
            <div key={i} className="flex items-center gap-3 transition-all duration-500 ease-out" style={{ animationDelay: `${0.6 + i * 0.1}s` }}>
              <span className="text-3xl md:text-4xl font-bold gradient-text">{badge.value}</span>
              <span className="text-sm text-slate-400 uppercase tracking-wide">{badge.label}</span>
            </div>
          ))}
        </div>

        <div className="reveal opacity-0 translate-y-8 flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 ease-out" style={{ animationDelay: '0.8s' }}>
          <a
            href={WHATSAPP_LINKS.hero}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
            aria-label="Comenzar gratis ahora - Contactar por WhatsApp"
          >
            <WhatsAppIcon className="w-6 h-6" />
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
