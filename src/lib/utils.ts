import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ============================================================================
// Class Merging
// ============================================================================

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ============================================================================
// Shared Types
// ============================================================================

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

// ============================================================================
// String Helpers
// ============================================================================

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function capitalize(text: string): string {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function capitalizeWords(text: string): string {
  return text.split(' ').map(capitalize).join(' ')
}

export function removeAccents(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function maskEmail(email: string): string {
  const [user, domain] = email.split('@')
  if (!user || !domain) return email
  const masked = user.slice(0, 2) + '***'
  return `${masked}@${domain}`
}

// ============================================================================
// Date/Time Helpers
// ============================================================================

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)

  const intervals: [number, string][] = [
    [31536000, 'año'],
    [2592000, 'mes'],
    [86400, 'día'],
    [3600, 'hora'],
    [60, 'minuto']
  ]

  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs)
    if (count >= 1) {
      return `hace ${count} ${label}${count > 1 && label !== 'mes' ? 's' : ''}`
    }
  }

  return 'justo ahora'
}

// ============================================================================
// Number/Format Helpers
// ============================================================================

export function formatCurrency(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency
  }).format(amount)
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-ES').format(num)
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ============================================================================
// Object/Array Helpers
// ============================================================================

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj }
  for (const key of keys) {
    delete result[key]
  }
  return result
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result
}

export function groupBy<T>(
  array: T[],
  key: keyof T | ((item: T) => string | number)
): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const groupKey = typeof key === 'function' ? String(key(item)) : String(item[key])
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    acc[groupKey].push(item)
    return acc
  }, {} as Record<string, T[]>)
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

type SortKey<T> = keyof T | ((item: T) => unknown)

export function sortBy<T>(array: T[], key: SortKey<T>): T[] {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key as keyof T]
    const bVal = typeof key === 'function' ? key(b) : b[key as keyof T]
    if (aVal === bVal) return 0
    if (aVal == null) return 1
    if (bVal == null) return -1
    return aVal < bVal ? -1 : 1
  })
}

// ============================================================================
// Validation Helpers
// ============================================================================

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function isUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true
  if (typeof value === 'string') return value.trim().length === 0
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[\d\s\-()]{8,}$/.test(phone)
}

// ============================================================================
// Async Helpers
// ============================================================================

export async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// ============================================================================
// Browser/ DOM Helpers
// ============================================================================

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function downloadFile(content: string, filename: string, mimeType = 'text/plain'): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function getQueryParam(key: string): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(key)
}

export function setQueryParams(params: Record<string, string | number | boolean>): void {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }
  window.history.replaceState({}, '', url.toString())
}
