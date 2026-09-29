import { isValidCardProgress, migrateLegacyStatus, type ProgressMap } from './study-scheduler'

const storageKey = (userId: string) => `cramdesk-study-progress-v1:${userId}`
export const STUDY_PROGRESS_EVENT = 'cramdesk:study-progress-changed'

export function readStudyProgress(userId: string, cardIds: string[] = [], now = Date.now()): ProgressMap {
  if (!userId || typeof window === 'undefined') return {}
  try {
    const stored = localStorage.getItem(storageKey(userId))
    if (stored) {
      const parsed: unknown = JSON.parse(stored)
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {}
      return Object.fromEntries(Object.entries(parsed).filter(([, value]) => isValidCardProgress(value))) as ProgressMap
    }
    const legacy: unknown = JSON.parse(localStorage.getItem('cramdesk-flashcard-statuses') || '{}')
    if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) return {}
    const migrated: ProgressMap = {}
    for (const cardId of cardIds) {
      const value = migrateLegacyStatus((legacy as Record<string, unknown>)[cardId], now)
      if (value) migrated[cardId] = value
    }
    if (Object.keys(migrated).length) localStorage.setItem(storageKey(userId), JSON.stringify(migrated))
    return migrated
  } catch (error) {
    console.error('Could not read study progress:', error)
    return {}
  }
}

export function writeStudyProgress(userId: string, progress: ProgressMap): boolean {
  if (!userId || typeof window === 'undefined') return false
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(progress))
    window.dispatchEvent(new Event(STUDY_PROGRESS_EVENT))
    return true
  } catch (error) {
    console.error('Could not save study progress:', error)
    return false
  }
}
