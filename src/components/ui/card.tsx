import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'interactive'
}

export function Card({ className, variant = 'default', ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6',
        variant === 'default' && 'bg-white border border-crema-200 shadow-sm',
        variant === 'glass' && 'bg-white/80 backdrop-blur-md border border-white/20 shadow-sm',
        variant === 'interactive' && 'bg-white border border-crema-200 shadow-sm hover:shadow-lg hover:border-bosque/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer',
        className
      )}
      {...props}
    />
  )
}
