import assert from 'node:assert/strict'
import { scheduleReview, selectStudyCards, selectQuizCards, migrateLegacyStatus, isValidCardProgress } from '../src/lib/study-scheduler.ts'
import { buildAdaptiveQuiz } from '../src/lib/study-quiz.ts'
import { parseGeneratedCards, parseGeneratedQuiz, uniqueByQuestion } from '../src/lib/study-generation.ts'

const now = Date.UTC(2026, 8, 29)
const cards = [
  { id: 'a', question: 'What is a carbonyl group?', answer: 'A carbon–oxygen double bond.' },
  { id: 'b', question: 'What is an alkene?', answer: 'A carbon–carbon double bond.' },
  { id: 'c', question: 'What is an alcohol?', answer: 'A hydroxyl-bearing carbon compound.' },
  { id: 'd', question: 'What is a nucleophile?', answer: 'An electron-pair donor.' },
  { id: 'e', question: 'What is an electrophile?', answer: 'An electron-pair acceptor.' },
]
const forgotten = scheduleReview(undefined, 'again', now)
const hard = scheduleReview(undefined, 'hard', now)
const good = scheduleReview(undefined, 'good', now)
const easy = scheduleReview(undefined, 'easy', now)
assert.equal(forgotten.dueAt, now + 10 * 60_000)
assert.ok(hard.dueAt < good.dueAt && good.dueAt < easy.dueAt)
assert.equal(scheduleReview(good, 'again', now).lapses, 1)
assert.equal(scheduleReview(good, 'good', now).repetitions, 2)
assert.ok(isValidCardProgress(forgotten))
assert.equal(isValidCardProgress({ ...forgotten, dueAt: 'tomorrow' }), false)
assert.equal(migrateLegacyStatus('failed', now)?.dueAt, now)

const progress = {
  a: { ...forgotten, dueAt: now - 86_400_000 },
  b: { ...good, dueAt: now + 86_400_000 },
  c: { ...hard, dueAt: now - 60_000 },
}
assert.deepEqual(selectStudyCards(cards, progress, now).map(card => card.id), ['a', 'c', 'd', 'e'])
assert.deepEqual(selectQuizCards(cards, progress, now, 3).map(card => card.id), ['a', 'c', 'd'])
const quiz = buildAdaptiveQuiz(cards, progress, 3, now, () => 0.4)
assert.deepEqual(quiz.map(question => question.cardId), ['a', 'c', 'd'])
for (const question of quiz) {
  assert.equal(question.options.length, 4)
  assert.equal(new Set(question.options).size, 4)
  assert.ok(question.options.includes(question.correctAnswer))
}

assert.equal(parseGeneratedCards(JSON.stringify({ flashcards: [
  { question: 'What is a carbonyl group?', answer: 'A C=O bond.' },
  { question: 'What is a carbonyl group?', answer: 'Repeated.' },
  { question: 'Short?', answer: '' },
] })).length, 1)
assert.equal(parseGeneratedQuiz(JSON.stringify({ questions: [
  { question: 'Which is a carbonyl group?', correctAnswer: 'C=O', options: ['C=O', 'C=C', 'C-O', 'C-N'] },
  { question: 'Which answer is absent?', correctAnswer: 'Missing', options: ['A', 'B', 'C', 'D'] },
] })).length, 1)
assert.equal(uniqueByQuestion([{ question: 'A fact?' }, { question: '  a FACT? ' }]).length, 1)
const metadataCard = { id: 'metadata', question: 'Who wrote the textbook?', answer: 'The textbook author.' }
assert.equal(parseGeneratedCards(JSON.stringify({ flashcards: [metadataCard, cards[0]] })).length, 1)
assert.equal(parseGeneratedQuiz(JSON.stringify({ questions: [{ question: 'De quoi parle le manuel ?', correctAnswer: 'Chemistry', options: ['Chemistry','Physics','Biology','Math'] }] })).length, 0)
const courseQuiz = buildAdaptiveQuiz([metadataCard, ...cards], {}, 10, now, () => 0.4)
assert.equal(courseQuiz.length, cards.length)
assert.ok(courseQuiz.every(question => question.cardId !== 'metadata' && !question.options.includes(metadataCard.answer)))

console.log('Adaptive review, priority quiz and generated-content validation passed')
