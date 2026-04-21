import * as React from 'react'
import { cn } from '@/lib/utils'

const buttonVariants = {
  primary: 'bg-bosque text-crema hover:bg-bosque-dark hover:-translate-y-0.5',
  secondary: 'bg-crema-200 text-bosque hover:bg-crema-dark hover:-translate-y-0.5',
  ghost: 'text-bosque hover:bg-bosque/10',
  outline: 'border-2 border-bosque text-bosque hover:bg-bosque hover:text-crema',
  terracota: 'bg-terracota text-crema hover:bg-terracota-dark hover:-translate-y-0.5 hover:shadow-lg',
  // Dark theme variants
  'primary-dark': 'bg-gradient-to-r from-primary to-accent-purple text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5',
  'secondary-dark': 'bg-white/5 border border-white/12 text-white hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5',
  'ghost-dark': 'text-white/80 hover:text-white hover:bg-white/10',
}

const buttonSizes = {
  sm: 'h-10 px-5 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
  icon: 'h-10 w-10',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bosque disabled:pointer-events-none',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
