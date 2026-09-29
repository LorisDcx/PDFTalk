export type ReviewRating = 'again' | 'hard' | 'good' | 'easy'

export type CardProgress = {
  dueAt: number
  intervalDays: number
  ease: number
  repetitions: number
  lapses: number
  lastRating: ReviewRating
  lastReviewedAt: number
}

export type ProgressMap = Record<string, CardProgress>
export type StudyCard = { id: string; question: string; answer: string }

const DAY = 86_400_000
const MINUTE = 60_000
const MAX_INTERVAL_DAYS = 365

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function scheduleReview(previous: CardProgress | undefined, rating: ReviewRating, now = Date.now()): CardProgress {
  const ease = clamp((previous?.ease ?? 2.3) + ({ again: -0.2, hard: -0.08, good: 0, easy: 0.1 })[rating], 1.3, 3.2)
  const previousInterval = previous?.intervalDays ?? 0
  const intervalDays = rating === 'again' ? 0 : rating === 'hard'
    ? Math.max(1, Math.round(previousInterval * 1.2))
    : rating === 'good'
      ? Math.max(2, Math.round(previousInterval * ease))
      : Math.max(4, Math.round(previousInterval * ease * 1.35))
  const safeInterval = clamp(intervalDays, 0, MAX_INTERVAL_DAYS)

  return {
    dueAt: now + (rating === 'again' ? 10 * MINUTE : safeInterval * DAY),
    intervalDays: safeInterval,
    ease,
    repetitions: rating === 'again' ? 0 : (previous?.repetitions ?? 0) + 1,
    lapses: (previous?.lapses ?? 0) + (rating === 'again' ? 1 : 0),
    lastRating: rating,
    lastReviewedAt: now,
  }
}

export function isCardDue(progress: CardProgress | undefined, now = Date.now()) {
  return !progress || progress.dueAt <= now
}

export function studyPriority(progress: CardProgress | undefined, now = Date.now()) {
  if (!progress) return 10
  if (progress.dueAt > now) return -100
  const overdueDays = Math.max(0, (now - progress.dueAt) / DAY)
  const difficulty = progress.lastRating === 'again' ? 35 : progress.lastRating === 'hard' ? 22 : 0
  return 20 + difficulty + Math.min(overdueDays, 30) + Math.min(progress.lapses * 2, 12)
}

export function selectStudyCards<T extends StudyCard>(cards: T[], progress: ProgressMap, now = Date.now(), limit = 20, includeFuture = false): T[] {
  return cards
    .filter(card => includeFuture || isCardDue(progress[card.id], now))
    .map((card, index) => ({ card, index, priority: studyPriority(progress[card.id], now) }))
    .sort((a, b) => b.priority - a.priority || a.index - b.index)
    .slice(0, limit)
    .map(item => item.card)
}

export function selectQuizCards<T extends StudyCard>(cards: T[], progress: ProgressMap, now = Date.now(), limit = 10): T[] {
  const due = selectStudyCards(cards, progress, now, limit)
  if (due.length >= limit) return due
  const dueIds = new Set(due.map(card => card.id))
  const rest = cards.filter(card => !dueIds.has(card.id))
    .sort((a, b) => (progress[a.id]?.dueAt ?? Infinity) - (progress[b.id]?.dueAt ?? Infinity))
  return [...due, ...rest].slice(0, limit)
}

export function migrateLegacyStatus(status: unknown, now = Date.now()): CardProgress | undefined {
  if (status !== 'failed' && status !== 'hard' && status !== 'success') return undefined
  const rating: ReviewRating = status === 'failed' ? 'again' : status === 'hard' ? 'hard' : 'good'
  const migrated = scheduleReview(undefined, rating, now)
  return status === 'success' ? migrated : { ...migrated, dueAt: now }
}

export function isValidCardProgress(value: unknown): value is CardProgress {
  if (!value || typeof value !== 'object') return false
  const progress = value as Partial<CardProgress>
  return Number.isFinite(progress.dueAt) && Number.isFinite(progress.intervalDays) &&
    Number.isFinite(progress.ease) && Number.isFinite(progress.repetitions) &&
    Number.isFinite(progress.lapses) && Number.isFinite(progress.lastReviewedAt) &&
    ['again', 'hard', 'good', 'easy'].includes(progress.lastRating || '')
}
