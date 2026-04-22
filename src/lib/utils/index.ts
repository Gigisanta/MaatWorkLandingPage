// Utils barrel export - import from specific submodules for better tree-shaking

// Core utilities
export { cn } from './cn'

// Shared types
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
