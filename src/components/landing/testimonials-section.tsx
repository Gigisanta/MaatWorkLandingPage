'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Star, ChevronLeft, ChevronRight, Building2, MapPin, Play, X, Pause, Volume2, VolumeX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useScrollReveal, useReducedMotion } from '@/hooks'

interface VideoTestimonialData {
  name: string
  business: string
  location: string
  videoUrl: string
  thumbnailUrl: string
  duration: string
  gradient: string
  initials: string
}

interface TextTestimonialData {
  name: string
  business: string
  location: string
  quote: string
  result: string
  gradient: string
  initials: string
}

type Testimonial = TextTestimonialData | VideoTestimonialData

const isVideoTestimonial = (t: Testimonial): t is VideoTestimonialData => 'videoUrl' in t

const textTestimonials: TextTestimonialData[] = [
  {
    name: 'Martin Rodriguez',
    business: 'Natatorio Acuática',
    location: 'Bahía Blanca',
    quote: 'Pasamos de perder el 30% de los clientes por olvido a tener 0 cancelaciones. El WhatsApp automático cambió todo.',
    result: '+40% retención',
    gradient: 'from-blue-500 to-cyan-500',
    initials: 'MR',
  },
  {
    name: 'Laura Mendes',
    business: 'Peluquería Color',
    location: 'Buenos Aires',
    quote: 'Mi agenda ahora se llena sola. Los clientes confirman turnos por WhatsApp y yo solo me-focus en cortar.',
    result: '+60% eficiencia',
    gradient: 'from-rose-500 to-pink-500',
    initials: 'LM',
  },
  {
    name: 'Diego Fernandez',
    business: 'Gimnasio PowerFit',
    location: 'Córdoba',
    quote: 'Cobrar cuotas era un dolor de cabeza. Ahora con un clic mando recordatorios y cobros. Tiempo解放.',
    result: '+25% cobranzas',
    gradient: 'from-amber-500 to-orange-500',
    initials: 'DF',
  },
  {
    name: 'Carmen Ruiz',
    business: 'Panadería Delicia',
    location: 'Rosario',
    quote: 'Los pedidos por WhatsApp se gestionan solos. Ya no pierdo horas respondiendo mensajes, puedo enfocarme en hornear.',
    result: '+80% pedidos',
    gradient: 'from-emerald-500 to-teal-500',
    initials: 'CR',
  },
  {
    name: 'Gustavo Herrera',
    business: 'Herrería Industrial',
    location: 'Mendoza',
    quote: 'La app me permite mostrar el catálogo de trabajos a clientes nuevos. Cierro trabajos solo con enviar un link.',
    result: '+50% clientes',
    gradient: 'from-violet-500 to-indigo-500',
    initials: 'GH',
  },
  {
    name: 'Ana Lucia Vega',
    business: 'Estudio Jurídico',
    location: 'Santa Fe',
    quote: 'Gestiono audiencias y recordatorios desde la app. Mis clientes reciben alertas automáticas. Menos olvidos, más confianza.',
    result: '+35% puntualidad',
    gradient: 'from-fuchsia-500 to-purple-500',
    initials: 'AV',
  },
]

const videoTestimonials: VideoTestimonialData[] = [
  {
    name: 'Maria Fernandez',
    business: 'Centro de Estética Bella',
    location: 'Rosario',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595461135849-c089c8278a4a?w=800&h=450&fit=crop',
    duration: '1:24',
    gradient: 'from-violet-500 to-purple-500',
    initials: 'MF',
  },
  {
    name: 'Carlos Mendoza',
    business: 'Consultorio Dental Sonrisa',
    location: 'La Plata',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&h=450&fit=crop',
    duration: '2:05',
    gradient: 'from-emerald-500 to-teal-500',
    initials: 'CM',
  },
]

const testimonials: Testimonial[] = [
  ...textTestimonials,
  ...videoTestimonials,
]

// 3D Carousel Hook with mouse parallax
function useCarousel3D(totalSlides: number) {
  const [active, setActive] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [mouseParallax, setMouseParallax] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  // Mouse parallax handler
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isHovering) return
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const parallaxX = ((e.clientX - centerX) / rect.width) * 20
    const parallaxY = ((e.clientY - centerY) / rect.height) * 10
    setMouseParallax({ x: parallaxX, y: parallaxY })
  }, [isHovering])

  const handleMouseEnter = useCallback(() => setIsHovering(true), [])
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false)
    setMouseParallax({ x: 0, y: 0 })
  }, [])

  // Animation helper with smoother timing
  const animateSlide = useCallback((newIndex: number, dir: 'left' | 'right') => {
    if (isAnimating) return
    setIsAnimating(true)
    setDirection(dir)
    setActive(newIndex)
    setTimeout(() => {
      setIsAnimating(false)
      setDirection(null)
    }, 550)
  }, [isAnimating])

  const prev = useCallback(() => {
    const newIndex = (active - 1 + totalSlides) % totalSlides
    animateSlide(newIndex, 'left')
  }, [active, animateSlide, totalSlides])

  const next = useCallback(() => {
    const newIndex = (active + 1) % totalSlides
    animateSlide(newIndex, 'right')
  }, [active, animateSlide, totalSlides])

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 50
    if (diff > threshold) next()
    else if (diff < -threshold) prev()
  }, [next, prev])

  const goTo = useCallback((index: number) => {
    const dir = index > active ? 'right' : 'left'
    animateSlide(index, dir)
  }, [active, animateSlide])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [prev, next])

  return {
    active,
    setActive: goTo,
    isAnimating,
    direction,
    mouseParallax,
    containerRef,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    prev,
    next,
  }
}

// Calculate card position in 3D space
function getCardStyle(
  index: number,
  active: number,
  total: number,
  mouseParallax: { x: number; y: number },
  isAnimating: boolean,
  prefersReducedMotion: boolean = false
) {
  const offset = index - active
  const normalizedOffset = ((offset % total) + total) % total
  const isLeft = normalizedOffset > total / 2
  const adjustedOffset = isLeft ? normalizedOffset - total : normalizedOffset
  const absOffset = Math.abs(adjustedOffset)

  // Reduced motion: simple fade transition
  if (prefersReducedMotion) {
    const isActive = index === active
    return {
      transform: 'none',
      opacity: isActive ? 1 : 0.2,
      zIndex: isActive ? total : 1,
      transition: 'opacity 0.25s ease-out',
    }
  }

  // 3D positioning with smooth easing
  const rotateY = adjustedOffset * 35
  const translateX = adjustedOffset * 260
  const translateZ = -absOffset * 120
  const scale = 1 - absOffset * 0.12
  const opacity = Math.max(0.15, 1 - absOffset * 0.3)
  const zIndex = total - absOffset

  // Subtle parallax on active card only
  const parallaxX = index === active ? mouseParallax.x * 0.3 : 0
  const parallaxY = index === active ? mouseParallax.y * 0.15 : 0

  const easeType = isAnimating ? 'cubic-bezier(0.32, 0.72, 0, 1)' : 'cubic-bezier(0.4, 0, 0.2, 1)'

  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale}) translate(${parallaxX}px, ${parallaxY}px)`,
    opacity,
    zIndex,
    transition: `all ${isAnimating ? 550 : 300}ms ${easeType}`,
    willChange: isAnimating ? 'transform, opacity' : 'auto',
  }
}

// Premium navigation arrow
function PremiumArrow({
  direction,
  onClick,
  disabled
}: {
  direction: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'group relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer',
        'transition-all duration-300 ease-out',
        'bg-gradient-to-br from-white/[0.03] to-white/[0.01]',
        'border border-white/[0.08] hover:border-white/[0.15]',
        'shadow-lg shadow-black/20',
        'hover:shadow-xl hover:shadow-black/30 hover:scale-110',
        'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100',
        direction === 'left' ? '-ml-6' : '-mr-6'
      )}
      aria-label={direction === 'left' ? 'Anterior' : 'Siguiente'}
    >
      {/* Glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl'
      )} />

      {/* Icon */}
      <div className="relative flex items-center justify-center">
        {direction === 'left' ? (
          <ChevronLeft className="w-6 h-6 text-white/60 group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-200" />
        ) : (
          <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-200" />
        )}
      </div>

      {/* Ring animation on hover */}
      <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-white/[0.1] transition-all duration-300 scale-110 opacity-0 group-hover:opacity-100" />
    </button>
  )
}

// Premium progress dot
function PremiumDot({
  active,
  onClick
}: {
  active: boolean
  onClick: () => void
}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative transition-all duration-300 rounded-full cursor-pointer',
        'hover:scale-125 active:scale-110',
        'min-w-[44px] min-h-[44px] flex items-center justify-center',
        prefersReducedMotion && 'transition-duration-100'
      )}
      aria-label="Ir al testimonio"
    >
      <div
        className={cn(
          'w-2.5 h-2.5 rounded-full transition-all duration-300',
          active
            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-125'
            : 'bg-white/20 hover:bg-white/40'
        )}
      />

      {/* Active glow - disabled when reduced motion is preferred */}
      {active && !prefersReducedMotion && (
        <div className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 blur-md opacity-50'
        )} />
      )}
    </button>
  )
}

// Video Modal for playback
function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  thumbnailUrl
}: {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
  thumbnailUrl: string
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showControls, setShowControls] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className={cn(
        'fixed inset-0 z-[60] flex items-center justify-center',
        'bg-black/90 backdrop-blur-md',
        'transition-all duration-300 ease-out',
        'animate-in fade-in zoom-in-95'
      )}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className={cn(
          'absolute top-4 right-4 z-10 w-12 h-12 rounded-full cursor-pointer',
          'flex items-center justify-center',
          'bg-white/10 hover:bg-white/20',
          'border border-white/20',
          'transition-all duration-200 hover:scale-110'
        )}
        aria-label="Cerrar video"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Video container */}
      <div
        className={cn(
          'relative w-full max-w-4xl mx-4',
          'rounded-2xl overflow-hidden',
          'shadow-2xl shadow-black/50',
          'border border-white/10'
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          className="w-full aspect-video bg-black"
          playsInline
          muted={isMuted}
          onEnded={() => setIsPlaying(false)}
        />

        {/* Play/Pause overlay */}
        <button
          onClick={handlePlay}
          className={cn(
            'absolute inset-0 flex items-center justify-center cursor-pointer',
            'bg-black/20 hover:bg-black/30 transition-all duration-200',
            'group'
          )}
          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
        >
          {/* Play/Pause button */}
          <div
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center',
              'bg-white/20 backdrop-blur-sm',
              'border border-white/30',
              'transition-all duration-200',
              'group-hover:bg-white/30 group-hover:scale-110',
              isPlaying && 'opacity-0 group-hover:opacity-100'
            )}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 text-white" />
            ) : (
              <Play className="w-8 h-8 text-white ml-1" />
            )}
          </div>

          {/* Always show play button when paused */}
          {!isPlaying && (
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center',
                'bg-black/30'
              )}
            >
              <div
                className={cn(
                  'w-20 h-20 rounded-full flex items-center justify-center',
                  'bg-white/20 backdrop-blur-sm',
                  'border border-white/30',
                  'transition-all duration-200',
                  'hover:bg-white/30 hover:scale-110'
                )}
              >
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          )}
        </button>

        {/* Controls bar */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 p-4',
            'bg-gradient-to-t from-black/80 to-transparent',
            'transition-all duration-300',
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={handlePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" />
              ) : (
                <Play className="w-5 h-5 text-white ml-0.5" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full',
                  'transition-all duration-100'
                )}
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Video testimonial card for 3D carousel
function VideoTestimonialCard3D({
  testimonial,
  style,
  isActive,
  onPlayClick,
  onHoverPreview
}: {
  testimonial: VideoTestimonialData
  style: React.CSSProperties
  isActive: boolean
  onPlayClick: () => void
  onHoverPreview: (isHovering: boolean) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  const handleMouseEnter = () => {
    setIsHovering(true)
    onHoverPreview(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    onHoverPreview(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  useEffect(() => {
    if (isHovering && videoRef.current && isActive) {
      videoRef.current.play().catch(() => {})
    } else if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [isHovering, isActive])

  return (
    <div
      className={cn(
        'absolute left-1/2 top-0 w-full max-w-[420px] -translate-x-1/2',
        'transition-all duration-500',
        isActive && 'pointer-events-auto'
      )}
      style={style}
    >
      <div className="relative">
        {/* Glow behind card */}
        <div
          className={cn(
            'absolute -inset-4 bg-gradient-to-br rounded-3xl transition-opacity duration-500',
            testimonial.gradient,
            isActive ? 'opacity-30 blur-2xl' : 'opacity-10 blur-xl'
          )}
        />

        {/* Card */}
        <div
          className={cn(
            'relative rounded-2xl overflow-hidden',
            'transition-all duration-500',
            'glass-premium-strong',
            isActive && 'ring-1 ring-white/[0.1]'
          )}
        >
          {/* Video thumbnail */}
          <div
            className="relative aspect-video bg-black cursor-pointer group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Thumbnail image */}
            <Image
              src={testimonial.thumbnailUrl}
              alt={`Video testimonio de ${testimonial.name}`}
              width={800}
              height={450}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-500',
                isHovering && 'opacity-0'
              )}
            />

            {/* Video preview (hidden until hover) */}
            <video
              ref={videoRef}
              src={testimonial.videoUrl}
              className={cn(
                'absolute inset-0 w-full h-full object-cover',
                'transition-opacity duration-500',
                isHovering ? 'opacity-100' : 'opacity-0'
              )}
              muted
              loop
              playsInline
            />

            {/* Play button overlay */}
            <div
              className={cn(
                'absolute inset-0 flex items-center justify-center',
                'bg-black/30 group-hover:bg-black/40 transition-all duration-300'
              )}
            >
              {/* Pulsing play button */}
              <div className="relative">
                {/* Outer ring animation */}
                <div
                  className={cn(
                    'absolute inset-0 rounded-full',
                    'bg-white/20 blur-md',
                    'animate-ping'
                  )}
                  style={{ animationDuration: '2s' }}
                />

                {/* Play button */}
                <div
                  className={cn(
                    'relative w-16 h-16 rounded-full',
                    'flex items-center justify-center',
                    'bg-white/20 backdrop-blur-sm',
                    'border-2 border-white/50',
                    'transition-all duration-300',
                    'group-hover:scale-110 group-hover:bg-white/30',
                    isActive && 'scale-100'
                  )}
                >
                  <Play className="w-7 h-7 text-white ml-1" />
                </div>
              </div>
            </div>

            {/* Duration badge */}
            <div
              className={cn(
                'absolute bottom-3 right-3 px-2 py-1 rounded-md',
                'bg-black/70 backdrop-blur-sm',
                'text-xs text-white font-medium'
              )}
            >
              {testimonial.duration}
            </div>

            {/* Click to play */}
            <button
              onClick={onPlayClick}
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-label={`Reproducir video de ${testimonial.name}`}
            />
          </div>

          {/* Author section */}
          <div className="p-6 lg:p-8">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className={cn(
                  'relative w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-base',
                  'shadow-lg ring-2 ring-white/10',
                  'transition-all duration-500',
                  testimonial.gradient
                )}
              >
                {testimonial.initials}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                )}
              </div>

              <div className="flex-1">
                <div className="font-semibold text-white text-base">
                  {testimonial.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{testimonial.business}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{testimonial.location}</span>
                </div>
              </div>

              {/* Video indicator */}
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full',
                  'bg-gradient-to-r text-white text-xs font-semibold',
                  testimonial.gradient,
                  'transition-all duration-500',
                  isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
                )}
              >
                <Play className="w-3 h-3" />
                <span>Video</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Testimonial card for 3D carousel
function TestimonialCard3D({
  testimonial,
  style,
  isActive,
  onPlayClick,
  onHoverPreview,
}: {
  testimonial: Testimonial
  style: React.CSSProperties
  isActive: boolean
  onPlayClick?: () => void
  onHoverPreview?: (isHovering: boolean) => void
}) {
  // If it's a video testimonial, render the video card
  if (isVideoTestimonial(testimonial)) {
    return (
      <VideoTestimonialCard3D
        testimonial={testimonial}
        style={style}
        isActive={isActive}
        onPlayClick={onPlayClick!}
        onHoverPreview={onHoverPreview!}
      />
    )
  }

  // Text testimonial card
  return (
    <div
      className={cn(
        'absolute left-1/2 top-0 w-full max-w-[420px] -translate-x-1/2',
        'transition-all duration-500',
        isActive && 'pointer-events-auto'
      )}
      style={style}
    >
      <div className="relative">
        {/* Glow behind card */}
        <div
          className={cn(
            'absolute -inset-4 bg-gradient-to-br rounded-3xl transition-opacity duration-500',
            testimonial.gradient,
            isActive ? 'opacity-30 blur-2xl' : 'opacity-10 blur-xl'
          )}
        />

        {/* Card */}
        <div
          className={cn(
            'relative rounded-2xl p-8 lg:p-10',
            'transition-all duration-500',
            'glass-premium-strong',
            isActive && 'ring-1 ring-white/[0.1]'
          )}
        >
          {/* Decorative quote */}
          <div className="absolute -top-6 -left-4 pointer-events-none select-none">
            <svg width="80" height="80" viewBox="0 0 120 120" fill="none" className="drop-shadow-lg">
              <defs>
                <linearGradient id={`quote-grad-${testimonial.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className={testimonial.gradient.replace('from-', 'stop-color: ')} />
                  <stop offset="100%" className={testimonial.gradient.replace('to-', 'stop-color: ')} />
                </linearGradient>
              </defs>
              <text
                x="10"
                y="100"
                fontSize="140"
                fontFamily="Georgia, serif"
                fontWeight="900"
                fill={`url(#quote-grad-${testimonial.name})`}
                opacity="0.15"
              >
                &quot;
              </text>
            </svg>
          </div>

          {/* Stars */}
          <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-5 h-5 transition-all duration-300',
                  'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                )}
                style={{
                  animationDelay: `${i * 100}ms`,
                  transform: isActive ? 'scale(1)' : 'scale(0.8)',
                  opacity: isActive ? 1 : 0.5
                }}
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote
            className={cn(
              'text-lg lg:text-xl text-white/90 font-display leading-relaxed mb-8',
              'transition-all duration-500',
              isActive ? 'text-white/90' : 'text-white/60'
            )}
          >
            <span className="text-3xl text-white/20 absolute -top-2 left-4">&ldquo;</span>
            <span className="relative z-10">{testimonial.quote}</span>
            <span className="text-3xl text-white/20 absolute -bottom-6 right-4">&rdquo;</span>
          </blockquote>

          {/* Author section */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className={cn(
                  'relative w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg',
                  'shadow-lg ring-2 ring-white/10',
                  'transition-all duration-500',
                  testimonial.gradient
                )}
              >
                {testimonial.initials}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
                )}
                {/* Online indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-[#04040e] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  </div>
                )}
              </div>

              <div>
                <div className="font-semibold text-white text-base">
                  {testimonial.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-white/50 mt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{testimonial.business}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/40 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </div>

            {/* Result badge */}
            <div
              className={cn(
                'relative px-4 py-2 rounded-full font-bold text-white text-sm',
                'bg-gradient-to-r shadow-lg',
                testimonial.gradient,
                'transition-all duration-500',
                isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
              )}
              style={{
                boxShadow: isActive
                  ? '0 8px 32px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1) inset'
                  : '0 4px 16px rgba(0,0,0,0.2)'
              }}
            >
              <span className="relative z-10">{testimonial.result}</span>
              {isActive && (
                <div
                  className={cn(
                    'absolute inset-0 rounded-full blur-xl opacity-50',
                    testimonial.gradient
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean
    videoUrl: string
    thumbnailUrl: string
  }>({ isOpen: false, videoUrl: '', thumbnailUrl: '' })
  const [isHoveringVideo, setIsHoveringVideo] = useState(false)
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 })

  const {
    active,
    setActive,
    isAnimating,
    mouseParallax,
    containerRef,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    prev,
    next,
  } = useCarousel3D(testimonials.length)

  // Open video modal
  const openVideoModal = useCallback((videoUrl: string, thumbnailUrl: string) => {
    setVideoModal({ isOpen: true, videoUrl, thumbnailUrl })
  }, [])

  // Close video modal
  const closeVideoModal = useCallback(() => {
    setVideoModal({ isOpen: false, videoUrl: '', thumbnailUrl: '' })
  }, [])

  // Handle video hover preview
  const handleVideoHoverPreview = useCallback((isHovering: boolean) => {
    setIsHoveringVideo(isHovering)
  }, [])

  // Check if mobile and reduced motion preference
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    motionQuery.addEventListener('change', motionHandler)

    return () => {
      window.removeEventListener('resize', checkMobile)
      motionQuery.removeEventListener('change', motionHandler)
    }
  }, [])

  // Auto-rotate every 7 seconds (pause when hovering video or reduced motion)
  useEffect(() => {
    if (isMobile || isHoveringVideo || prefersReducedMotion) return
    const interval = setInterval(() => {
      next()
    }, 7000)
    return () => clearInterval(interval)
  }, [next, isMobile, isHoveringVideo, prefersReducedMotion])

  return (
    <section
      id="testimonials"
      className="py-24 px-6 lg:px-12 bg-[var(--color-bg-base)] relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(99,102,241,0.12),transparent)]" />
      <div className="absolute top-20 left-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-52 h-52 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-violet-500/3 rounded-full blur-3xl" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div
        ref={ref}
        className={cn(
          'relative max-w-6xl mx-auto transition-all duration-700',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-400 mb-4">
            <Star className="w-4 h-4 fill-violet-400" />
            Testimonios
            <Star className="w-4 h-4 fill-violet-400" />
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-black text-white mt-4">
            Ya lo están usando
          </h2>
          <p className="text-lg text-white/60 mt-4 max-w-xl mx-auto">
            Negocios como el tuyo que ya automatizaron sus procesos
          </p>
        </div>

        {/* 3D Carousel */}
        {!isMobile && (
          <div
            ref={containerRef}
            className={cn(
              'relative h-[520px] select-none cursor-pointer',
              !prefersReducedMotion && 'cursor-grab active:cursor-grabbing'
            )}
            onMouseMove={!prefersReducedMotion ? handleMouseMove : undefined}
            onMouseEnter={!prefersReducedMotion ? handleMouseEnter : undefined}
            onMouseLeave={!prefersReducedMotion ? handleMouseLeave : undefined}
          >
            {/* Navigation arrows */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between items-center z-30 px-4">
              <PremiumArrow direction="left" onClick={prev} />
              <PremiumArrow direction="right" onClick={next} />
            </div>

            {/* 3D Carousel container with perspective */}
            <div
              className="relative w-full h-full"
              style={{
                perspective: prefersReducedMotion ? 'none' : '1400px',
                perspectiveOrigin: '50% 50%',
              }}
            >
              {/* Carousel track */}
              <div
                className={cn(
                  'relative w-full h-full',
                  !prefersReducedMotion && 'transform-style-preserve-3d'
                )}
                style={{
                  transform: prefersReducedMotion
                    ? 'none'
                    : `rotateY(${mouseParallax.x * 0.3}deg) rotateX(${-mouseParallax.y * 0.15}deg)`,
                  transition: isAnimating
                    ? 'all 0.55s cubic-bezier(0.32, 0.72, 0, 1)'
                    : prefersReducedMotion
                      ? 'opacity 0.25s ease-out'
                      : 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {testimonials.map((testimonial, index) => (
                  <TestimonialCard3D
                    key={testimonial.name}
                    testimonial={testimonial}
                    isActive={index === active}
                    style={getCardStyle(index, active, testimonials.length, mouseParallax, isAnimating, prefersReducedMotion)}
                    onPlayClick={isVideoTestimonial(testimonial) ? () => openVideoModal(testimonial.videoUrl, testimonial.thumbnailUrl) : undefined}
                    onHoverPreview={isVideoTestimonial(testimonial) ? handleVideoHoverPreview : undefined}
                  />
                ))}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-3 mt-10">
              {testimonials.map((_, index) => (
                <PremiumDot
                  key={index}
                  active={index === active}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-center mt-6">
              <span className="text-sm text-white/30 font-mono tracking-widest">
                {String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}

        {/* Mobile: Horizontal swipeable cards */}
        {isMobile && (
          <div
            className="relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="snap-center shrink-0 w-[calc(100vw-48px)]"
                >
                  {isVideoTestimonial(testimonial) ? (
                    // Video testimonial card for mobile
                    <div
                      className={cn(
                        'relative rounded-2xl overflow-hidden transition-all duration-500',
                        index === active ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
                      )}
                    >
                      {/* Glow */}
                      <div
                        className={cn(
                          'absolute -inset-4 bg-gradient-to-br opacity-15 blur-xl rounded-2xl',
                          testimonial.gradient
                        )}
                      />

                      {/* Video thumbnail */}
                      <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                        <Image
                          src={testimonial.thumbnailUrl}
                          alt={`Video testimonio de ${testimonial.name}`}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover"
                        />

                        {/* Play overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/70 text-xs text-white font-medium">
                          {testimonial.duration}
                        </div>

                        {/* Click to play */}
                        <button
                          onClick={() => openVideoModal(testimonial.videoUrl, testimonial.thumbnailUrl)}
                          className="absolute inset-0 w-full h-full cursor-pointer"
                          aria-label={`Reproducir video de ${testimonial.name}`}
                        />
                      </div>

                      {/* Author info */}
                      <div className="relative glass-premium p-6 rounded-2xl mt-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm',
                                testimonial.gradient
                              )}
                            >
                              {testimonial.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm">
                                {testimonial.name}
                              </div>
                              <div className="text-xs text-white/50">
                                {testimonial.business}
                              </div>
                            </div>
                          </div>

                          <div
                            className={cn(
                              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white',
                              'bg-gradient-to-r',
                              testimonial.gradient
                            )}
                          >
                            <Play className="w-3 h-3" />
                            <span>Video</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Text testimonial card for mobile
                    <div
                      className={cn(
                        'relative rounded-2xl p-6 transition-all duration-500',
                        index === active ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
                      )}
                    >
                      {/* Glow */}
                      <div
                        className={cn(
                          'absolute inset-0 bg-gradient-to-br opacity-15 blur-xl rounded-2xl',
                          testimonial.gradient
                        )}
                      />

                      {/* Card */}
                      <div className="relative glass-premium p-6 rounded-2xl">
                        {/* Stars */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>

                        {/* Quote */}
                        <blockquote className="text-base text-white/90 font-display leading-relaxed mb-6">
                          &ldquo;{testimonial.quote}&rdquo;
                        </blockquote>

                        {/* Author */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm',
                                testimonial.gradient
                              )}
                            >
                              {testimonial.initials}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm">
                                {testimonial.name}
                              </div>
                              <div className="text-xs text-white/50">
                                {testimonial.business}
                              </div>
                            </div>
                          </div>

                          <div
                            className={cn(
                              'px-3 py-1.5 rounded-full text-xs font-bold text-white',
                              'bg-gradient-to-r',
                              testimonial.gradient
                            )}
                          >
                            {testimonial.result}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Progress dots */}
            <div className="flex items-center justify-center gap-3 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={cn(
                    'w-2.5 h-2.5 rounded-full transition-all duration-300',
                    'min-w-[44px] min-h-[44px] flex items-center justify-center',
                    index === active
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 scale-125'
                      : 'bg-white/20 hover:bg-white/40'
                  )}
                  aria-label="Ir al testimonio"
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
              <span className="text-sm text-white/30 font-mono tracking-widest">
                {String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Custom styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }

        @keyframes animate-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: animate-in 0.3s ease-out forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Video Modal */}
      <VideoModal
        isOpen={videoModal.isOpen}
        onClose={closeVideoModal}
        videoUrl={videoModal.videoUrl}
        thumbnailUrl={videoModal.thumbnailUrl}
      />
    </section>
  )
}
