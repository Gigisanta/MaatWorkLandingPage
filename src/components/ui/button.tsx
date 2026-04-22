import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = {
  primary: [
    'bg-bosque text-crema',
    'hover:bg-bosque-dark hover:shadow-lg hover:shadow-bosque/25 hover:-translate-y-0.5',
    'active:translate-y-0 active:shadow-md',
    'focus-visible:ring-2 focus-visible:ring-bosque focus-visible:ring-offset-2',
  ],
  secondary: [
    'bg-crema-200 text-bosque',
    'hover:bg-crema-dark hover:shadow-md hover:-translate-y-0.5',
    'active:translate-y-0 active:shadow-sm',
    'focus-visible:ring-2 focus-visible:ring-crema-200 focus-visible:ring-offset-2',
  ],
  ghost: [
    'text-bosque',
    'hover:bg-bosque/10 hover:text-bosque-dark',
    'active:bg-bosque/15',
    'focus-visible:ring-2 focus-visible:ring-bosque/30 focus-visible:ring-offset-2',
  ],
  outline: [
    'border-2 border-bosque text-bosque',
    'hover:bg-bosque hover:text-crema hover:shadow-lg hover:-translate-y-0.5',
    'active:translate-y-0 active:shadow-md',
    'focus-visible:ring-2 focus-visible:ring-bosque focus-visible:ring-offset-2',
  ],
  terracota: [
    'bg-terracota text-crema',
    'hover:bg-terracota-dark hover:shadow-lg hover:shadow-terracota/25 hover:-translate-y-0.5',
    'active:translate-y-0 active:shadow-md',
    'focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2',
  ],
  'primary-dark': [
    'bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/30',
    'hover:shadow-primary/50 hover:-translate-y-0.5 hover:brightness-110',
    'active:translate-y-0 active:shadow-md active:brightness-100',
    'focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
  ],
  'secondary-dark': [
    'bg-white/5 border border-white/12 text-white',
    'hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-white/5',
    'active:translate-y-0 active:shadow-md',
    'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
  ],
  'ghost-dark': [
    'text-white/80',
    'hover:text-white hover:bg-white/10',
    'active:bg-white/15',
    'focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2',
  ],
  glass: [
    'bg-white/10 backdrop-blur-md border border-white/20 text-white',
    'hover:bg-white/15 hover:border-white/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10',
    'active:translate-y-0 active:shadow-md',
    'focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
  ],
}

const buttonSizes = {
  sm: 'h-9 px-4 text-sm rounded-md',
  md: 'h-11 px-6 text-base rounded-lg',
  lg: 'h-13 px-8 text-lg rounded-xl',
  icon: 'h-11 w-11 rounded-lg',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold',
          'transition-all duration-200 ease-out',
          'disabled:pointer-events-none disabled:opacity-50',
          'active:scale-[0.97]',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
