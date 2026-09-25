export type StudySubject = {
  id: string
  name: string
  chapters: number
  difficulty: 1 | 2 | 3
}

export type StudyPlanInput = {
  examDate: string
  minutesPerDay: number
  weekdays: number[]
  subjects: StudySubject[]
}

export type StudySession = {
  subject: string
  title: string
  kind: 'learn' | 'recall' | 'practice'
  chapter?: number
}

export type StudyDay = {
  date: Date
  sessions: StudySession[]
}

export type StudyPlan = {
  days: StudyDay[]
  totalChapters: number
  introducedChapters: number
  recallSessions: number
  availableSessions: number
  minutesPerSession: number
}

function parseLocalDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day
    ? null
    : date
}

function atMidnight(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function addDays(date: Date, count: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + count)
  return next
}

export function createStudyPlan(input: StudyPlanInput, today = new Date()): StudyPlan | null {
  const exam = parseLocalDate(input.examDate)
  const start = atMidnight(today.getHours() >= 18 ? addDays(today, 1) : today)
  if (!exam || exam <= start || !input.weekdays.length || !input.subjects.length) return null

  const weekdays = new Set(input.weekdays)
  const studyDates: Date[] = []
  for (let day = start; day < exam && studyDates.length < 180; day = addDays(day, 1)) {
    if (weekdays.has(day.getDay())) studyDates.push(day)
  }
  if (!studyDates.length) return null

  const minutesPerSession = 45
  const blocksPerDay = Math.max(1, Math.min(5, Math.floor(input.minutesPerDay / minutesPerSession)))
  const subjects = input.subjects.filter(subject => subject.name.trim() && subject.chapters > 0)
  if (!subjects.length) return null

  const chapters = Array.from({ length: Math.max(...subjects.map(subject => subject.chapters)) }, (_, chapterIndex) =>
    [...subjects]
      .filter(subject => subject.chapters > chapterIndex)
      .sort((a, b) => a.difficulty - b.difficulty)
      .map(subject => ({ subject: subject.name.trim(), chapter: chapterIndex + 1 }))
  ).flat()

  type Review = { subject: string; chapter: number; due: number; pass: 1 | 2 }
  const reviews: Review[] = []
  const days: StudyDay[] = []
  let introducedChapters = 0
  let recallSessions = 0
  let practiceIndex = 0

  studyDates.forEach((date, dateIndex) => {
    const sessions: StudySession[] = []
    for (let slot = 0; slot < blocksPerDay; slot++) {
      const reviewIndex = reviews.findIndex(review => review.due <= dateIndex)
      const reserveRecall = blocksPerDay > 1 && slot === blocksPerDay - 1 && reviewIndex >= 0

      if (introducedChapters < chapters.length && !reserveRecall) {
        const item = chapters[introducedChapters++]
        sessions.push({ subject: item.subject, chapter: item.chapter, title: `Chapitre ${item.chapter} · Comprendre et reformuler`, kind: 'learn' })
        if (dateIndex + 1 < studyDates.length) reviews.push({ ...item, due: dateIndex + 1, pass: 1 })
        continue
      }

      if (reviewIndex >= 0) {
        const [review] = reviews.splice(reviewIndex, 1)
        sessions.push({ subject: review.subject, chapter: review.chapter, title: `Chapitre ${review.chapter} · Rappel actif sans notes`, kind: 'recall' })
        recallSessions++
        if (review.pass === 1 && dateIndex + 3 < studyDates.length) reviews.push({ ...review, due: dateIndex + 3, pass: 2 })
        continue
      }

      if (introducedChapters < chapters.length) {
        const item = chapters[introducedChapters++]
        sessions.push({ subject: item.subject, chapter: item.chapter, title: `Chapitre ${item.chapter} · Comprendre et reformuler`, kind: 'learn' })
        if (dateIndex + 1 < studyDates.length) reviews.push({ ...item, due: dateIndex + 1, pass: 1 })
        continue
      }

      const subject = subjects[practiceIndex % subjects.length]
      const activities = [
        'Mini-quiz sans regarder le cours',
        'Corriger les erreurs du dernier quiz',
        'Expliquer les notions à voix haute',
        'Questions d’examen et points fragiles',
      ]
      sessions.push({ subject: subject.name.trim(), title: activities[practiceIndex % activities.length], kind: 'practice' })
      practiceIndex++
    }
    days.push({ date, sessions })
  })

  return {
    days,
    totalChapters: chapters.length,
    introducedChapters,
    recallSessions,
    availableSessions: studyDates.length * blocksPerDay,
    minutesPerSession,
  }
}

function icsEscape(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')
}

function icsDate(date: Date, hour: number, minute: number) {
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(hour)}${pad(minute)}00`
}

export function studyPlanToIcs(plan: StudyPlan) {
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const events = plan.days.flatMap((day, dayIndex) => day.sessions.map((session, slot) => {
    const startMinutes = 18 * 60 + slot * (plan.minutesPerSession + 10)
    const endMinutes = startMinutes + plan.minutesPerSession
    const start = icsDate(day.date, Math.floor(startMinutes / 60), startMinutes % 60)
    const end = icsDate(day.date, Math.floor(endMinutes / 60), endMinutes % 60)
    return [
      'BEGIN:VEVENT',
      `UID:cramdesk-${dayIndex}-${slot}-${start}@cramdesk.com`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${icsEscape(`${session.subject} — ${session.title}`)}`,
      `DESCRIPTION:${icsEscape('Plan gratuit CramDesk. Ajustez les horaires dans votre calendrier selon vos disponibilités.')}`,
      'END:VEVENT',
    ].join('\r\n')
  }))
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CramDesk//Study Planner//FR', 'CALSCALE:GREGORIAN', ...events, 'END:VCALENDAR'].join('\r\n')
}
