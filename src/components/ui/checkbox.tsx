import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  description?: string
  error?: boolean
  indeterminate?: boolean
}

const checkboxVariants = {
  default: [
    'border-crema-200 peer-checked:bg-bosque peer-checked:border-bosque',
    'peer-hover:border-bosque/50',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-bosque peer-focus-visible:ring-offset-2',
  ],
  error: [
    'border-red-500 peer-checked:bg-red-500 peer-checked:border-red-500',
    'peer-hover:border-red-600',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-red-500 peer-focus-visible:ring-offset-2',
  ],
  glass: [
    'border-white/30 bg-white/10 peer-checked:bg-primary peer-checked:border-primary',
    'peer-hover:border-white/50',
    'peer-focus-visible:ring-2 peer-focus-visible:ring-white/40 peer-focus-visible:ring-offset-2',
    'dark:border-white/20 dark:bg-white/5',
    'dark:peer-checked:bg-primary dark:peer-checked:border-primary',
  ],
}

const CheckIcon = () => (
  <svg className="w-3 h-3 text-crema" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path
      d="M2.5 6l2.5 2.5 4.5-5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const IndeterminateIcon = () => (
  <svg className="w-3 h-3 text-crema" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, id, indeterminate, ...props }, ref) => {
    const checkboxId = id ?? React.useId()
    const descriptionId = description ? `${checkboxId}-description` : undefined

    const getCheckboxClasses = () => {
      if (error) return checkboxVariants.error
      return checkboxVariants.default
    }

    return (
      <div className="flex items-start gap-3 group">
        <div className="relative shrink-0 mt-0.5">
          <input
            type="checkbox"
            id={checkboxId}
            className="sr-only peer"
            ref={ref}
            aria-describedby={descriptionId}
            {...props}
          />
          <div
            className={cn(
              'w-5 h-5 rounded border-2 transition-all duration-200 ease-out',
              'flex items-center justify-center',
              'peer-checked:scale-105',
              'peer-indeterminate:scale-105',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2',
              getCheckboxClasses(),
              className
            )}
            aria-hidden="true"
          >
            {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
          </div>
        </div>
        {(label || description) && (
          <div className="flex-1 min-w-0">
            {label && (
              <label
                htmlFor={checkboxId}
                className="text-sm text-text cursor-pointer group-hover:text-text transition-colors duration-150"
              >
                {label}
              </label>
            )}
            {description && (
              <p
                id={descriptionId}
                className="text-xs text-text-muted mt-0.5"
              >
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)
Checkbox.displayName = 'Checkbox'
