'use client';

import {
  Users,
  CreditCard,
  Calendar,
  MessageCircle,
  BarChart3,
  Settings,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks';

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
  gradient: string;
  glowColor: string;
  accentColor: string;
  pattern?: 'default' | 'featured' | 'compact';
}

const features: Feature[] = [
  {
    icon: Users,
    title: 'Gestion de Clientes',
    desc: 'Cada cliente tiene su ficha digital: datos de contacto, membresia, asistencia e historial completo.',
    gradient: 'from-violet-600 to-purple-700',
    glowColor: 'rgba(139, 92, 246, 0.4)',
    accentColor: '#8b5cf6',
    pattern: 'featured',
  },
  {
    icon: CreditCard,
    title: 'Cobros y Cuotas',
    desc: 'Registra cobros y deja que la app maneje los recordatorios de pago automaticamente.',
    gradient: 'from-emerald-500 to-teal-600',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    accentColor: '#10b981',
  },
  {
    icon: Calendar,
    title: 'Turnos y Clases',
    desc: 'Organiza grupos o turnos con horarios y capacidades. Sin confusiones ni overlaps.',
    gradient: 'from-amber-500 to-orange-600',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    accentColor: '#f59e0b',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp Automatico',
    desc: 'Mensajes automaticos sin que hagas nada. Confirmar turnos, avisar cuotas pendientes.',
    gradient: 'from-green-500 to-emerald-600',
    glowColor: 'rgba(34, 197, 94, 0.35)',
    accentColor: '#22c55e',
  },
  {
    icon: BarChart3,
    title: 'Panel para el Dueno',
    desc: 'Entras al panel y en 10 segundos sabes como viene el mes. Sin pedirle nada a nadie.',
    gradient: 'from-blue-500 to-indigo-600',
    glowColor: 'rgba(59, 130, 246, 0.35)',
    accentColor: '#3b82f6',
  },
  {
    icon: Settings,
    title: 'Hecha a Medida',
    desc: 'No es generica. Disenamos la app para tus procesos especificos desde cero.',
    gradient: 'from-rose-500 to-pink-600',
    glowColor: 'rgba(244, 63, 94, 0.35)',
    accentColor: '#f43f5e',
  },
];

// Bento Card Component with premium glassmorphism
function BentoCard({
  feature,
  index,
  isVisible,
  reducedMotion,
}: {
  feature: Feature;
  index: number;
  isVisible: boolean;
  reducedMotion: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const isFeatured = feature.pattern === 'featured';

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  const entranceDelay = reducedMotion ? 0 : 100 + index * 80;
  const Icon = feature.icon;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsHovered(!isHovered);
    }
  };

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      className={`
        relative group cursor-pointer
        ${isFeatured ? 'md:col-span-2 lg:col-span-2 row-span-2' : ''}
      `}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.96)',
        transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${entranceDelay}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${entranceDelay}ms`,
        transformStyle: 'preserve-3d',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
    >
      {/* Ambient glow - follows mouse on featured card */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${feature.glowColor} 0%, transparent 70%)`,
          filter: 'blur(30px)',
          opacity: isHovered ? 0.6 : 0,
        }}
      />

      {/* Main card */}
      <div
        className={`
          relative h-full min-h-[280px] rounded-2xl overflow-hidden
          transition-all duration-500 ease-out
          ${isFeatured ? 'p-8 md:p-10' : 'p-6'}
          ${isHovered ? 'glass-elevated' : 'glass'}
        `}
        style={{
          boxShadow: isHovered
            ? `0 25px 60px -12px rgba(0,0,0,0.6), 0 0 60px ${feature.glowColor}, inset 0 1px 0 rgba(255,255,255,0.15)`
            : '0 10px 40px -10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)',
          transform: reducedMotion || !isHovered
            ? 'scale(1) rotateX(0) rotateY(0)'
            : `scale(1.02) rotateX(${(mousePos.y - 0.5) * -8}deg) rotateY(${(mousePos.x - 0.5) * 8}deg)`,
        }}
      >
        {/* Top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${feature.accentColor}60 50%, transparent 100%)`,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 400ms ease',
          }}
        />

        {/* Subtle inner glow */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 0%, ${feature.glowColor}20 0%, transparent 70%)`,
            opacity: isHovered ? 0.8 : 0,
            transition: 'opacity 500ms ease',
          }}
        />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1px) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1px) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Icon container */}
          <div
            className={`
              inline-flex items-center justify-center w-14 h-14 rounded-xl
              transition-all duration-500 ease-out
              ${isHovered ? 'scale-110 -translate-y-1' : 'scale-100 translate-y-0'}
            `}
            style={{
              background: `linear-gradient(135deg, ${feature.accentColor}50 0%, ${feature.accentColor}25 100%)`,
              boxShadow: isHovered
                ? `0 8px 32px ${feature.glowColor}, inset 0 1px 0 rgba(255,255,255,0.2)`
                : `0 4px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)`,
              border: `1px solid ${feature.accentColor}50`,
            }}
          >
            <Icon
              className="w-7 h-7 transition-transform duration-500"
              style={{ color: feature.accentColor }}
              strokeWidth={1.5}
            />
          </div>

          {/* Text content */}
          <div className={`mt-auto ${isFeatured ? 'mt-8' : 'mt-5'}`}>
            <h3
              className={`
                font-display text-white mb-3 leading-tight
                transition-all duration-300
                ${isFeatured ? 'text-2xl md:text-3xl font-black' : 'text-lg md:text-xl font-bold'}
                ${isHovered ? 'translate-y-0' : ''}
              `}
            >
              {feature.title}
            </h3>
            <p
              className={`
                leading-relaxed transition-all duration-300
                ${isFeatured ? 'text-base md:text-lg' : 'text-sm md:text-base'}
                ${isHovered ? 'text-white/75' : 'text-white/60'}
              `}
            >
              {feature.desc}
            </p>
          </div>

          {/* Featured badge */}
          {isFeatured && (
            <div className="absolute top-5 right-5">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <Sparkles className="w-3 h-3" style={{ color: feature.accentColor }} />
                Premium
              </div>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-6 right-6 h-px transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.accentColor}50, transparent)`,
            opacity: isHovered ? 0.6 : 0,
          }}
        />
      </div>

      {/* Reflection */}
      <div
        className="absolute -bottom-6 left-4 right-4 h-12 rounded-full blur-xl transition-all duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(to bottom, ${feature.accentColor}30 0%, transparent 100%)`,
          opacity: isHovered ? 0.4 : 0.15,
          transform: `scaleY(${isHovered ? 1.1 : 1})`,
        }}
      />
    </div>
  );
}

export function FeaturesGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" aria-labelledby="features-heading" className="section-spacing px-6 lg:px-12 bg-[var(--color-bg-base)] relative overflow-hidden">
      {/* Background layers */}
      <div className="mesh-gradient opacity-70" />
      <div className="mesh-gradient-subtle opacity-50" />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1px) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1px) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Decorative orbs */}
      <div
        className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent-purple) 60%, transparent) 0%, transparent 70%)`,
          animation: reducedMotion ? 'none' : 'drift 20s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--color-accent-pink, #ec4899) 50%, transparent) 0%, transparent 70%)`,
          animation: reducedMotion ? 'none' : 'drift 25s ease-in-out infinite reverse',
        }}
      />
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.15] blur-3xl pointer-events-none"
        style={{
          background: `radial-gradient(circle, color-mix(in srgb, var(--color-primary) 50%, transparent) 0%, transparent 70%)`,
          animation: reducedMotion ? 'none' : 'drift 30s ease-in-out infinite',
        }}
      />

      <div className="max-w-7xl mx-auto relative" ref={containerRef}>
        {/* Header */}
        <div
          className="text-center mb-16"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 0ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 0ms',
          }}
        >
          <span className="inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/50 mb-5">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-white/40" />
            Funcionalidades
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-white/40" />
          </span>
          <h2 id="features-heading" className="font-display text-5xl lg:text-6xl xl:text-7xl font-black text-white mt-4 tracking-tight">
            Una app que trabaja
            <br />
            <span className="gradient-brand-text">por vos, 24/7</span>
          </h2>
          <p className="text-white/55 mt-6 max-w-md mx-auto text-lg leading-relaxed">
            Todo lo que necesitas para automatizar tu negocio y recuperar tiempo libre
          </p>
        </div>

        {/* Premium Bento Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-[280px]"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
          }}
        >
          {features.map((feature, i) => (
            <BentoCard
              key={i}
              feature={feature}
              index={i}
              isVisible={isVisible}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>

        {/* Bottom indicator */}
        <div
          className="flex justify-center mt-16 gap-2"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 500ms ease 800ms',
          }}
        >
          {features.slice(0, 6).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-white/20"
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: isVisible ? 'scale(1)' : 'scale(0.5)',
                transition: `opacity 500ms ease ${reducedMotion ? '0ms' : `${900 + i * 80}ms`}`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
