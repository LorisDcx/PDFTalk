// Shared by controls and server checks. These are quota pages, not PDF pages.
export const learningCost = { plan: 20, lesson: 40, coach: 20, speech: 100, transcription: 10 } as const
export const learningTokenLimit = { plan: 3000, lesson: 6500, coach: 3000 } as const
