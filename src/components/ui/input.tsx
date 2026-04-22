import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  success?: boolean
  hint?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const inputVariants = {
  default: [
    'border-crema-200 bg-white text-text',
    'hover:border-crema-dark',
    'focus:border-bosque focus:ring-2 focus:ring-bosque/20',
  ],
  error: [
    'border-red-500 bg-red-50/50 text-text',
    'hover:border-red-600',
    'focus:border-red-500 focus:ring-2 focus:ring-red-500/20',
  ],
  success: [
    'border-green-500 bg-green-50/50 text-text',
    'hover:border-green-600',
    'focus:border-green-500 focus:ring-2 focus:ring-green-500/20',
  ],
  glass: [
    'bg-white/10 backdrop-blur-md border-white/20 text-text',
    'hover:bg-white/15 hover:border-white/30',
    'focus:border-bosque focus:ring-2 focus:ring-bosque/20',
    'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/50',
    'dark:hover:bg-white/10 dark:hover:border-white/20',
    'dark:focus:border-primary dark:focus:ring-primary/20',
  ],
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, hint, icon, iconPosition = 'left', id, ...props }, ref) => {
    const inputId = id ?? React.useId()
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    const getInputClasses = () => {
      if (error) return inputVariants.error
      if (props.success) return inputVariants.success
      return inputVariants.default
    }

    return (
      <div className="relative w-full">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-text placeholder:text-text-muted',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:shadow-md',
            'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
            icon && iconPosition === 'left' && 'pl-10',
            icon && iconPosition === 'right' && 'pr-10',
            getInputClasses(),
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            {icon}
          </div>
        )}
        {error && (
          <p id={errorId} className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={hintId} className="mt-1.5 text-sm text-text-muted">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
