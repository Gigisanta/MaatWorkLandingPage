import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        className={cn(
          'w-full px-4 py-3 rounded-lg border bg-white text-text placeholder:text-text-muted transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-bosque focus:border-bosque',
          error && 'border-red-500 focus:ring-red-500',
          !error && 'border-crema-200',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'
