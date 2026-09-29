import { selectQuizCards, type ProgressMap } from './study-scheduler.ts'

export type QuizCard = { id: string; question: string; answer: string; sourceRef?: string }
export type StudyQuizQuestion = {
  id: string
  cardId: string
  question: string
  correctAnswer: string
  options: string[]
  sourceRef?: string
}

function words(value: string) {
  return new Set(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().match(/[\p{L}\p{N}]{3,}/gu) || [])
}

function distractorScore(correct: string, candidate: string) {
  const lengthSimilarity = 1 - Math.abs(correct.length - candidate.length) / Math.max(correct.length, candidate.length, 1)
  const correctWords = words(correct)
  const sharedWords = [...words(candidate)].filter(word => correctWords.has(word)).length
  const sameShape = /^\d/.test(correct) === /^\d/.test(candidate) ? 1 : 0
  return lengthSimilarity * 3 + Math.min(sharedWords, 2) + sameShape
}

function shuffled<T>(items: T[], random: () => number) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

export function buildAdaptiveQuiz(cards: QuizCard[], progress: ProgressMap, requestedCount: number, now = Date.now(), random = Math.random): StudyQuizQuestion[] {
  const uniqueAnswers = [...new Map(cards.map(card => card.answer.trim()).filter(Boolean).map(answer => [answer.toLocaleLowerCase(), answer])).values()]
  if (uniqueAnswers.length < 4) return []

  const chosen = selectQuizCards(cards, progress, now, Math.max(1, requestedCount))
  return chosen.map(card => {
    const answer = card.answer.trim()
    const distractors = uniqueAnswers.filter(candidate => candidate.toLocaleLowerCase() !== answer.toLocaleLowerCase())
      .map(candidate => ({ candidate, score: distractorScore(answer, candidate), tie: random() }))
      .sort((a, b) => b.score - a.score || a.tie - b.tie)
      .slice(0, 3).map(item => item.candidate)
    return {
      id: `card-${card.id}`,
      cardId: card.id,
      question: card.question,
      correctAnswer: answer,
      options: shuffled([answer, ...distractors], random),
      sourceRef: card.sourceRef,
    }
  })
}
