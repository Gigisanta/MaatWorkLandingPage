import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'w-full px-4 py-3 rounded-lg border bg-white text-text placeholder:text-text-muted transition-all duration-200 resize-y min-h-[120px]',
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
Textarea.displayName = 'Textarea'
