import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  hint?: string
  placeholder?: string
}

const selectVariants = {
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
    'dark:bg-white/5 dark:border-white/10 dark:text-white',
    'dark:[&>option]:bg-bosque dark:[&>option]:text-white',
  ],
}

const ChevronIcon = () => (
  <svg
    className="w-4 h-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
)

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, hint, placeholder, id, children, ...props }, ref) => {
    const selectId = id ?? React.useId()
    const errorId = `${selectId}-error`
    const hintId = `${selectId}-hint`

    const getSelectClasses = () => {
      if (error) return selectVariants.error
      return selectVariants.default
    }

    return (
      <div className="relative w-full">
        <select
          id={selectId}
          className={cn(
            'w-full px-4 py-3 pr-10 rounded-lg border text-text appearance-none cursor-pointer',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:shadow-md',
            'disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed',
            'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%237A7067\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat',
            getSelectClasses(),
            className
          )}
          ref={ref}
          aria-invalid={error}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          {...props}
        >
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
            <ChevronIcon />
          </div>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
          <ChevronIcon />
        </div>
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
Select.displayName = 'Select'
