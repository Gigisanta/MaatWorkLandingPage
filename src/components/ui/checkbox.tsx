import * as React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label className="flex items-center gap-3 cursor-pointer group" htmlFor={id}>
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <div className={cn(
            'w-5 h-5 rounded border-2 transition-all duration-200',
            'border-crema-200 peer-checked:bg-bosque peer-checked:border-bosque',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-bosque peer-focus-visible:ring-offset-2',
            'group-hover:border-bosque/50'
          )}>
            <svg className="w-full h-full text-crema opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 12 12" fill="none">
              <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {label && <span className="text-sm text-text-muted group-hover:text-text transition-colors">{label}</span>}
      </label>
    )
  }
)
Checkbox.displayName = 'Checkbox'
