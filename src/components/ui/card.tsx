import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const cardVariants = {
  default: [
    'bg-white border border-crema-200 shadow-sm',
    'hover:shadow-lg hover:-translate-y-0.5 hover:border-crema-dark',
  ],
  glass: [
    'bg-white/80 backdrop-blur-md border border-white/20 shadow-sm',
    'hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-lg',
    'dark:bg-white/5 dark:border-white/10 dark:shadow-black/20',
    'dark:hover:bg-white/10 dark:hover:border-white/20',
  ],
  interactive: [
    'bg-white border border-crema-200 shadow-sm cursor-pointer',
    'hover:shadow-xl hover:-translate-y-1 hover:border-bosque/30',
    'active:translate-y-0 active:shadow-md',
    'focus-visible:ring-2 focus-visible:ring-bosque/30 focus-visible:ring-offset-2',
  ],
  elevated: [
    'bg-white border border-transparent shadow-lg',
    'hover:shadow-xl hover:-translate-y-0.5 hover:shadow-xl',
    'active:translate-y-0',
  ],
}

const cardPadding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200 ease-out',
          cardVariants[variant],
          cardPadding[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mb-4', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-xl font-semibold text-text font-display', className)}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-text-muted mt-1', className)} {...props} />
  )
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-4 pt-4 border-t border-crema-200 flex items-center gap-3', className)} {...props} />
  )
)
CardFooter.displayName = 'CardFooter'
