export const studyLanguageNames = {
  fr: 'French', en: 'English', es: 'Spanish', de: 'German', it: 'Italian',
  pt: 'Portuguese', zh: 'Simplified Chinese', ja: 'Japanese', ar: 'Arabic',
} as const

export type StudyLanguage = keyof typeof studyLanguageNames

export function resolveStudyLanguage(value: unknown): StudyLanguage {
  return typeof value === 'string' && Object.hasOwn(studyLanguageNames, value)
    ? value as StudyLanguage
    : 'fr'
}

export function cleanSummaryItem(value: string) {
  return value.trim()
    .replace(/^#{1,4}\s*/, '')
    .replace(/^\d{1,2}[.)]\s*/, '')
    .replace(/^\*\*\s*\d{1,2}\s*\*\*\s*/, '')
    .replace(/\*\*/g, '')
    .trim()
}
