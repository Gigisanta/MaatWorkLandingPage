import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  hint?: string
}

const textareaVariants = {
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
  glass: [
    'bg-white/10 backdrop-blur-md border-white/20 text-text',
    'hover:bg-white/15 hover:border-white/30',
    'focus:border-bosque focus:ring-2 focus:ring-bosque/20',
    'dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/50',
  ],
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, hint, id, ...props }, ref) => {
    const textareaId = id ?? React.useId()
    const errorId = `${textareaId}-error`
    const hintId = `${textareaId}-hint`

    const getTextareaClasses = () => {
      if (error) return textareaVariants.error
      return textareaVariants.default
    }

    return (
      <div className="relative w-full">
        <textarea
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 rounded-lg border text-text placeholder:text-text-muted',
            'transition-all duration-200 ease-out resize-y',
            'focus:outline-none focus:shadow-md',
            'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[120px]',
            getTextareaClasses(),
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        />
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
Textarea.displayName = 'Textarea'
