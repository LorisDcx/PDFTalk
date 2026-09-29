export type GeneratedCard = { question: string; answer: string; sourceQuote?: string }
export type GeneratedQuizQuestion = { question: string; correctAnswer: string; options: string[]; sourceQuote?: string }

function normalized(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

export function parseGeneratedCards(content: string): GeneratedCard[] {
  const parsed: unknown = JSON.parse(content)
  if (!parsed || typeof parsed !== 'object' || !('flashcards' in parsed) || !Array.isArray(parsed.flashcards)) return []
  const seen = new Set<string>()
  return parsed.flashcards.flatMap((value: unknown) => {
    if (!value || typeof value !== 'object') return []
    const card = value as Record<string, unknown>
    if (typeof card.question !== 'string' || typeof card.answer !== 'string') return []
    const question = card.question.trim()
    const answer = card.answer.trim()
    if (question.length < 8 || answer.length < 2 || seen.has(normalized(question))) return []
    seen.add(normalized(question))
    return [{ question, answer, sourceQuote: typeof card.sourceQuote === 'string' ? card.sourceQuote : undefined }]
  })
}

export function parseGeneratedQuiz(content: string): GeneratedQuizQuestion[] {
  const parsed: unknown = JSON.parse(content)
  if (!parsed || typeof parsed !== 'object' || !('questions' in parsed) || !Array.isArray(parsed.questions)) return []
  const seen = new Set<string>()
  return parsed.questions.flatMap((value: unknown) => {
    if (!value || typeof value !== 'object') return []
    const question = value as Record<string, unknown>
    if (typeof question.question !== 'string' || typeof question.correctAnswer !== 'string' || !Array.isArray(question.options)) return []
    const prompt = question.question.trim()
    const answer = question.correctAnswer.trim()
    const options = question.options.filter((option): option is string => typeof option === 'string').map(option => option.trim())
    if (prompt.length < 8 || !answer || options.length !== 4 || options.some(option => !option) ||
        new Set(options.map(normalized)).size !== 4 || !options.some(option => normalized(option) === normalized(answer)) || seen.has(normalized(prompt))) return []
    seen.add(normalized(prompt))
    return [{ question: prompt, correctAnswer: options.find(option => normalized(option) === normalized(answer))!, options,
      sourceQuote: typeof question.sourceQuote === 'string' ? question.sourceQuote : undefined }]
  })
}

export function uniqueByQuestion<T extends { question: string }>(items: T[]): T[] {
  const seen = new Set<string>()
  return items.filter(item => {
    const key = normalized(item.question)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
