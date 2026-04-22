'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useReducedMotion, useMagneticButton } from '@/hooks'

// Typing indicator with motion respect
function TypingDots({ className = '' }: { className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return null

  return (
    <div className={`absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-0.5 ${className}`}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-violet-400/60 animate-typing-dot"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}

// Field validation icons
function ValidationIcon({ isValid, isTouched }: { isValid: boolean; isTouched: boolean }) {
  if (!isTouched) return null

  return (
    <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${
      isValid ? 'opacity-100 scale-100' : 'opacity-100 scale-100'
    }`}>
      {isValid ? (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
    </div>
  )
}

// Character counter for textarea
function CharacterCount({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100
  const isNearLimit = percentage > 80
  const isOverLimit = current > max

  return (
    <div className={`absolute right-4 top-6 flex items-center gap-1.5 transition-opacity duration-300 ${
      isNearLimit || isOverLimit ? 'opacity-100' : 'opacity-0'
    }`}>
      <span className={`text-xs tabular-nums ${
        isOverLimit ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-white/40'
      }`}>
        {current}/{max}
      </span>
    </div>
  )
}

// Floating label input with premium interactions
interface FloatingInputProps {
  id: string
  name: string
  type?: string
  label: string
  optional?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
  fieldState: { touched: boolean; valid: boolean; error: string | null }
  isSubmitting: boolean
  icon?: React.ReactNode
}

function FloatingInput({ id, name, type = 'text', label, optional, value, onChange, onBlur, fieldState, isSubmitting, icon }: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasValue = value.length > 0
  const error = fieldState.touched ? fieldState.error : null
  const isValid = fieldState.touched && fieldState.valid && hasValue
  const reduced = useReducedMotion()

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    onBlur(e)
  }

  // Glow color based on state
  const glowColor = error ? '#ef4444' : isValid ? '#22c55e' : '#8b5cf6'

  return (
    <div className="relative group">
      {/* Glow backdrop - shows on focus, error, or hover */}
      <div
        className={`absolute -inset-0.5 rounded-xl blur transition-opacity duration-300 ${
          isFocused ? 'opacity-60' : error ? 'opacity-40' : 'group-hover:opacity-20'
        }`}
        style={{ background: `linear-gradient(135deg, ${glowColor}, ${glowColor}80)` }}
      />

      {/* Input container */}
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isSubmitting}
          autoComplete="off"
          className={`
            peer w-full px-4 pt-7 pb-2.5 rounded-xl
            bg-white/[0.03] border text-white
            transition-all duration-300 ease-out
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder-transparent
            ${error ? 'border-red-500/50' : isValid ? 'border-emerald-500/50' : 'border-white/[0.08]'}
            ${isFocused ? 'bg-violet-500/[0.08]' : ''}
          `}
          style={{
            transitionProperty: 'background, border-color, box-shadow',
            ...(!reduced && isFocused && {
              boxShadow: `0 0 0 1px ${glowColor}40, 0 0 20px ${glowColor}20`
            })
          }}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            error ? 'text-red-400' : isFocused ? 'text-violet-400' : 'text-white/50'
          }`}
          style={{
            top: hasValue || isFocused ? '10px' : '50%',
            transform: hasValue || isFocused ? 'translateY(0) scale(0.75)' : 'translateY(-50%)',
            transformOrigin: 'left',
            left: hasValue || isFocused ? '12px' : '16px',
          }}
        >
          {label}
          {optional && <span className="text-white/30 ml-1">(opcional)</span>}
        </label>

        {/* Animated underline */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: glowColor,
            boxShadow: isFocused ? `0 0 12px ${glowColor}` : 'none'
          }}
        />

        {/* Typing indicator */}
        {!reduced && <TypingDots />}

        {/* Icon */}
        {icon && (
          <div className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none">
            {icon}
          </div>
        )}

        {/* Validation icon */}
        <ValidationIcon isValid={isValid} isTouched={fieldState.touched && !isFocused} />
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// Floating select with premium interactions
interface FloatingSelectProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void
  fieldState: { touched: boolean; valid: boolean; error: string | null }
  isSubmitting: boolean
  options: { value: string; label: string }[]
}

function FloatingSelect({ id, name, label, value, onChange, onBlur, fieldState, isSubmitting, options }: FloatingSelectProps) {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const error = fieldState.touched ? fieldState.error : null
  const isValid = fieldState.touched && fieldState.valid && hasValue
  const reduced = useReducedMotion()

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false)
    onBlur(e)
  }

  const glowColor = error ? '#ef4444' : isValid ? '#22c55e' : '#8b5cf6'

  return (
    <div className="relative group">
      {/* Glow backdrop */}
      <div
        className={`absolute -inset-0.5 rounded-xl blur transition-opacity duration-300 ${
          isFocused ? 'opacity-60' : error ? 'opacity-40' : 'group-hover:opacity-20'
        }`}
        style={{ background: `linear-gradient(135deg, ${glowColor}, ${glowColor}80)` }}
      />

      {/* Select container */}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isSubmitting}
          className={`
            peer w-full px-4 pt-7 pb-2.5 rounded-xl appearance-none
            bg-white/[0.03] border text-white
            transition-all duration-300 ease-out
            focus:outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            [&>option]:bg-[var(--color-bg-base)] [&>option]:text-white
            ${error ? 'border-red-500/50' : isValid ? 'border-emerald-500/50' : 'border-white/[0.08]'}
            ${isFocused ? 'bg-violet-500/[0.08]' : ''}
          `}
          style={{
            ...(!reduced && isFocused && {
              boxShadow: `0 0 0 1px ${glowColor}40, 0 0 20px ${glowColor}20`
            })
          }}
        >
          <option value="">Selecciona tu industria</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute transition-all duration-300 pointer-events-none ${
            error ? 'text-red-400' : isFocused ? 'text-violet-400' : 'text-white/50'
          }`}
          style={{
            top: hasValue || isFocused ? '10px' : '50%',
            transform: hasValue || isFocused ? 'translateY(0) scale(0.75)' : 'translateY(-50%)',
            transformOrigin: 'left',
            left: hasValue || isFocused ? '12px' : '16px',
          }}
        >
          {label}
        </label>

        {/* Animated underline */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: glowColor,
            boxShadow: isFocused ? `0 0 12px ${glowColor}` : 'none'
          }}
        />

        {/* Dropdown arrow */}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 ${
          isFocused ? 'text-violet-400 rotate-180' : 'text-white/40'
        }`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Validation icon */}
        <div className={`absolute right-10 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          fieldState.touched && !isFocused ? 'opacity-100' : 'opacity-0'
        }`}>
          {isValid ? (
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : error ? (
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : null}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// Floating textarea with premium interactions
interface FloatingTextareaProps {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  fieldState: { touched: boolean; valid: boolean; error: string | null }
  isSubmitting: boolean
  maxLength?: number
}

function FloatingTextarea({ id, name, label, value, onChange, onBlur, fieldState, isSubmitting, maxLength = 500 }: FloatingTextareaProps) {
  const [isFocused, setIsFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasValue = value.length > 0
  const error = fieldState.touched ? fieldState.error : null
  const isValid = fieldState.touched && fieldState.valid && hasValue
  const reduced = useReducedMotion()

  const handleFocus = () => setIsFocused(true)
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false)
    onBlur(e)
  }

  // Auto-expand
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const glowColor = error ? '#ef4444' : isValid ? '#22c55e' : '#8b5cf6'

  return (
    <div className="relative group">
      {/* Glow backdrop */}
      <div
        className={`absolute -inset-0.5 rounded-xl blur transition-opacity duration-300 ${
          isFocused ? 'opacity-60' : error ? 'opacity-40' : 'group-hover:opacity-20'
        }`}
        style={{ background: `linear-gradient(135deg, ${glowColor}, ${glowColor}80)` }}
      />

      {/* Textarea container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isSubmitting}
          rows={3}
          maxLength={maxLength}
          className={`
            peer w-full px-4 pt-7 pb-8 rounded-xl resize-none
            bg-white/[0.03] border text-white
            transition-all duration-300 ease-out
            focus:outline-none min-h-[120px]
            disabled:opacity-50 disabled:cursor-not-allowed
            placeholder-transparent
            ${error ? 'border-red-500/50' : isValid ? 'border-emerald-500/50' : 'border-white/[0.08]'}
            ${isFocused ? 'bg-violet-500/[0.08]' : ''}
          `}
          style={{
            ...(!reduced && isFocused && {
              boxShadow: `0 0 0 1px ${glowColor}40, 0 0 20px ${glowColor}20`
            })
          }}
        />

        {/* Floating label */}
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            error ? 'text-red-400' : isFocused ? 'text-violet-400' : 'text-white/50'
          }`}
          style={{
            top: hasValue || isFocused ? '10px' : '24px',
            transform: hasValue || isFocused ? 'scale(0.75) translateY(0)' : 'translateY(0)',
            transformOrigin: 'left',
            left: hasValue || isFocused ? '12px' : '16px',
          }}
        >
          {label}
        </label>

        {/* Animated underline */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-0.5 transition-all duration-300 ${
            isFocused ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: glowColor,
            boxShadow: isFocused ? `0 0 12px ${glowColor}` : 'none'
          }}
        />

        {/* Typing dots */}
        {!reduced && <TypingDots className="!top-8 !-translate-y-0" />}

        {/* Character count */}
        <CharacterCount current={value.length} max={maxLength} />

        {/* Validation icon */}
        <div className={`absolute right-4 top-6 transition-all duration-300 ${
          fieldState.touched && !isFocused ? 'opacity-100' : 'opacity-0'
        }`}>
          {isValid ? (
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : error ? (
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : null}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-red-400 text-xs">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

// Progress bar showing form completion
function ProgressBar({ fields }: { fields: Record<string, { touched: boolean; valid: boolean }> }) {
  const requiredFields = ['nombre', 'whatsapp', 'industria', 'problema']
  const completed = requiredFields.filter(f => fields[f]?.touched && fields[f]?.valid).length
  const total = requiredFields.length
  const percentage = (completed / total) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/50">Completá tu consulta</span>
        <span className="text-xs font-medium" style={{ color: percentage === 100 ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>
          {completed}/{total} campos
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out relative"
          style={{
            width: `${percentage}%`,
            background: 'linear-gradient(90deg, var(--color-accent-purple), var(--color-primary))',
            boxShadow: percentage > 0 ? '0 0 20px rgba(139, 92, 246, 0.5)' : 'none',
          }}
        >
          {percentage > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  )
}

// Premium submit button with magnetic effect
interface SubmitButtonProps {
  isSubmitting: boolean
  hasError: boolean
  isMac: boolean
}

function SubmitButton({ isSubmitting, hasError, isMac }: SubmitButtonProps) {
  const {
    ref,
    isHovering,
    ripples,
    createRipple,
    isTouchDevice
  } = useMagneticButton<HTMLButtonElement>({
    strength: 0.25,
    maxDistance: 10,
    scaleOnHover: 1.02,
    glowIntensity: 0.4,
    disabled: isSubmitting
  })

  const reduced = useReducedMotion()
  const buttonState = isSubmitting ? 'loading' : hasError ? 'error' : 'idle'

  return (
    <div className="space-y-3">
      <button
        ref={ref}
        type="submit"
        disabled={isSubmitting}
        onClick={createRipple}
        className={`
          group relative w-full overflow-hidden rounded-xl px-8 py-4
          text-base font-semibold text-white
          transition-all duration-300 ease-out
          disabled:cursor-not-allowed cursor-pointer
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-base)]
          ${isHovering && !isTouchDevice ? 'z-10' : ''}
        `}
        style={{ willChange: 'transform' }}
      >
        {/* Background gradient */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={{
            background: buttonState === 'error'
              ? 'linear-gradient(135deg, #dc2626, #b91c1c, #dc2626)'
              : buttonState === 'loading'
              ? 'linear-gradient(135deg, #7c3aed, #6366f1, #7c3aed)'
              : 'linear-gradient(135deg, #8b5cf6, #6366f1, #8b5cf6)',
          }}
        />

        {/* Hover glow effect */}
        {!reduced && buttonState === 'idle' && (
          <div
            className="absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-500 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
              opacity: isHovering ? 0.4 : 0,
            }}
          />
        )}

        {/* Inner glow */}
        <div
          className="absolute inset-0 rounded-xl transition-shadow duration-500"
          style={{
            boxShadow: buttonState === 'error'
              ? 'inset 0 0 30px rgba(239, 68, 68, 0.3)'
              : buttonState === 'loading'
              ? 'inset 0 0 20px rgba(99, 102, 241, 0.3)'
              : 'inset 0 0 20px rgba(99, 102, 241, 0.3)',
          }}
        />

        {/* Shimmer effect */}
        {!reduced && buttonState !== 'loading' && (
          <div
            className="absolute inset-0 -translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            style={{ transform: isHovering ? 'translateX(100%)' : 'translateX(-100%)' }}
          />
        )}

        {/* Loading spinner */}
        {buttonState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {/* Ripple effects */}
        {ripples.map(ripple => (
          <span
            key={ripple.id}
            className="magnetic-ripple absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              marginLeft: -ripple.size / 2,
              marginTop: -ripple.size / 2,
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%)',
              animation: 'magnetic-ripple 0.6s ease-out forwards'
            }}
          />
        ))}

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {buttonState === 'loading' && <span>Enviando...</span>}
          {buttonState === 'error' && (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Error - Intentar de nuevo
            </>
          )}
          {buttonState === 'idle' && (
            <>
              Enviar consulta
              <svg
                className="w-5 h-5 transition-transform duration-300"
                style={{ transform: isHovering ? 'translateX(4px)' : 'translateX(0)' }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
      </button>

      {/* Keyboard hint */}
      <div className="flex items-center justify-center gap-2 text-white/30 text-xs">
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[10px]">
            {isMac ? '⌘' : 'Ctrl'}
          </kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/20 font-mono text-[10px]">↵</kbd>
        </span>
        <span>para enviar</span>
      </div>
    </div>
  )
}

// Confetti component for success state
function Confetti() {
  const reduced = useReducedMotion()
  const animationRef = useRef<number | undefined>(undefined)
  const particlesStateRef = useRef<Array<{ id: number; x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number }>>([])
  const [, forceUpdate] = useState(0)
  const colors = ['#8b5cf6', '#6366f1', '#a78bfa', '#818cf8', '#c4b5fd', '#fbbf24', '#f472b6']

  // Generate particles using useState initializer (runs once)
  const [particles] = useState(() => {
    if (reduced) return []
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 20,
      y: 50,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -12 - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
    }))
  })

  useEffect(() => {
    if (reduced) return

    particlesStateRef.current = [...particles]
    let frame = 0
    const animate = () => {
      frame++
      particlesStateRef.current = particlesStateRef.current.map(p => ({
        ...p,
        x: p.x + p.vx * 0.3,
        y: p.y + p.vy * 0.3,
        vy: p.vy + 0.3,
        rotation: p.rotation + (Math.random() - 0.5) * 10,
      })).filter(p => p.y < 120)
      forceUpdate(n => n + 1)
      if (frame < 100) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [reduced, particles])

  if (reduced) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 1,
          }}
        />
      ))}
    </div>
  )
}

// Success state component
function SuccessState() {
  const reduced = useReducedMotion()

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/5 p-12 text-center" role="status" aria-live="polite">
      {/* Confetti */}
      <Confetti />

      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-indigo-500/10 pointer-events-none" />

      {/* Floating particles */}
      {!reduced && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-violet-400/30"
              style={{
                left: `${20 + i * 20}%`,
                top: `${25 + (i % 3) * 20}%`,
                animation: `float 4s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Success icon */}
      <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-6 shadow-xl shadow-violet-500/40">
        <svg className="w-10 h-10 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="relative font-display text-2xl font-bold text-white mb-3">Mensaje enviado</h3>
      <p className="relative text-white/60">Te contactaremos en menos de 24 horas.</p>

      {/* Decorative elements */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
    </div>
  )
}

const industries = [
  { value: 'natatorio', label: 'Natatorio' },
  { value: 'peluqueria', label: 'Peluqueria' },
  { value: 'gimnasio', label: 'Gimnasio' },
  { value: 'academia', label: 'Academia Deportiva' },
  { value: 'consultorio', label: 'Consultorio' },
  { value: 'otro', label: 'Otro' },
]

interface FieldState {
  touched: boolean
  valid: boolean
  error: string | null
}

function validateField(name: string, value: string): string | null {
  switch (name) {
    case 'nombre':
      if (!value.trim()) return 'El nombre es requerido'
      if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres'
      return null
    case 'whatsapp':
      if (!value.trim()) return 'El WhatsApp es requerido'
      const digits = value.replace(/\D/g, '')
      if (digits.length < 8) return 'Ingresá un número válido'
      return null
    case 'email':
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido'
      return null
    case 'industria':
      if (!value) return 'Seleccioná una industria'
      return null
    case 'problema':
      if (!value.trim()) return 'Describí el proceso a automatizar'
      if (value.trim().length < 10) return 'Contanos un poco más (mínimo 10 caracteres)'
      return null
    default:
      return null
  }
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nombre: '',
    whatsapp: '',
    email: '',
    industria: '',
    problema: '',
  })
  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({
    nombre: { touched: false, valid: false, error: null },
    whatsapp: { touched: false, valid: false, error: null },
    email: { touched: false, valid: false, error: null },
    industria: { touched: false, valid: false, error: null },
    problema: { touched: false, valid: false, error: null },
  })
  const [isMac] = useState(() => /Mac|iPod|iPhone|iPad/.test(navigator.platform))


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Live validation feedback
    const err = validateField(name, value)
    const valid = !err && (name !== 'email' ? !!value.trim() : !value || !err)

    setFieldStates(prev => ({
      ...prev,
      [name]: { ...prev[name], valid, error: err },
    }))
  }, [])

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const err = validateField(name, value)
    const valid = !err && (name !== 'email' ? !!value.trim() : !value || !err)

    setFieldStates(prev => ({
      ...prev,
      [name]: { touched: true, valid, error: err },
    }))
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Mark all fields as touched
    const touchedFields: Record<string, FieldState> = {}
    let hasAnyError = false

    for (const key of Object.keys(formData) as Array<keyof typeof formData>) {
      const err = validateField(key, formData[key])
      const valid = !err && !!formData[key].trim()
      if (err) hasAnyError = true
      touchedFields[key] = { touched: true, valid, error: err }
    }
    setFieldStates(touchedFields)

    if (hasAnyError) {
      setIsSubmitting(false)
      setError('Por favor completá todos los campos correctamente')
      return
    }

    const data = new FormData(e.currentTarget)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: data.get('nombre'),
          whatsapp: data.get('whatsapp'),
          email: data.get('email'),
          industria: data.get('industria'),
          problema: data.get('problema'),
        }),
      })

      if (res.ok) {
        setIsSuccess(true)
      } else {
        setError('Error al enviar. Probá de nuevo.')
      }
    } catch {
      setError('Error al enviar. Probá de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return <SuccessState />
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, var(--color-primary) 1px, transparent 1px), radial-gradient(circle at 75% 75%, var(--color-accent-purple) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Progress indicator */}
      <ProgressBar fields={fieldStates} />

      <div className="relative grid md:grid-cols-2 gap-6">
        <FloatingInput
          id="nombre"
          name="nombre"
          label="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={fieldStates.nombre}
          isSubmitting={isSubmitting}
        />

        <FloatingSelect
          id="industria"
          name="industria"
          label="Industria"
          value={formData.industria}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={fieldStates.industria}
          isSubmitting={isSubmitting}
          options={industries}
        />
      </div>

      <div className="relative grid md:grid-cols-2 gap-6">
        <FloatingInput
          id="whatsapp"
          name="whatsapp"
          type="tel"
          label="WhatsApp"
          value={formData.whatsapp}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={fieldStates.whatsapp}
          isSubmitting={isSubmitting}
          icon={
            <svg className="w-5 h-5 text-emerald-500/60" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
          }
        />

        <FloatingInput
          id="email"
          name="email"
          type="email"
          label="Email"
          optional
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          fieldState={fieldStates.email}
          isSubmitting={isSubmitting}
        />
      </div>

      <FloatingTextarea
        id="problema"
        name="problema"
        label="Que proceso queres automatizar?"
        value={formData.problema}
        onChange={handleChange}
        onBlur={handleBlur}
        fieldState={fieldStates.problema}
        isSubmitting={isSubmitting}
        maxLength={500}
      />

      {/* Error message */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <SubmitButton isSubmitting={isSubmitting} hasError={!!error} isMac={isMac} />
    </form>
  )
}
