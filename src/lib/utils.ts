import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getTrialDaysRemaining(trialEndAt: Date | string): number {
  const now = new Date()
  const trialEnd = new Date(trialEndAt)
  if (Number.isNaN(trialEnd.getTime())) return 0
  const diffTime = trialEnd.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

export function isTrialExpired(trialEndAt: Date | string): boolean {
  const end = new Date(trialEndAt)
  return Number.isNaN(end.getTime()) || end < new Date()
}

export function isSameUtcDay(value: Date | string | null | undefined, reference = new Date()): boolean {
  if (value == null) return false
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime()) || Number.isNaN(reference.getTime())) return false
  return date.getUTCFullYear() === reference.getUTCFullYear() &&
    date.getUTCMonth() === reference.getUTCMonth() &&
    date.getUTCDate() === reference.getUTCDate()
}
