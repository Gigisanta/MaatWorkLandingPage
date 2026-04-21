import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary'
}

export function Badge({ className, variant = 'primary', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
        variant === 'primary' && 'bg-bosque/10 text-bosque border border-bosque/30',
        variant === 'secondary' && 'bg-crema-200 text-text-muted',
        className
      )}
      {...props}
    />
  )
}
