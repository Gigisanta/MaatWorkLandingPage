import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Class merging utility for Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
