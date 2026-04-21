import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'w-full px-4 py-3 rounded-lg border bg-white text-text transition-all duration-200 appearance-none cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-bosque focus:border-bosque',
          'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%237A7067\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10',
          error && 'border-red-500 focus:ring-red-500',
          !error && 'border-crema-200',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    )
  }
)
Select.displayName = 'Select'
