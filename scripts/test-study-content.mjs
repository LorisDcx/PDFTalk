import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { cleanSummaryItem, resolveStudyLanguage, studyLanguageNames } from '../src/lib/study-language.ts'

assert.equal(resolveStudyLanguage('de'), 'de')
assert.equal(resolveStudyLanguage('invalid'), 'fr')
assert.equal(cleanSummaryItem('1. **01** Key ideas include the order structure.'), 'Key ideas include the order structure.')

const source = readFileSync(new URL('../src/lib/i18n.tsx', import.meta.url), 'utf8')
const sections = source.split(/^  (fr|en|es|de|it|pt|zh|ja|ar): \{$/m)
const planFeatureKeys = [
  'planFeaturePages300', 'planFeaturePages800', 'planFeaturePagesUnlimited',
  'planFeatureFlashcards50', 'planFeatureFlashcards100', 'planFeatureFlashcards200',
  'planFeatureQuiz20', 'planFeatureQuiz50', 'planFeatureQuiz100',
  'planFeatureSlides', 'planFeatureChat', 'planFeatureHistory',
  'planFeatureAllStarter', 'planFeatureAllStudent', 'planFeaturePriority', 'planFeaturePriorityMax',
]
const studyKeys = [
  'humanizerCreditsPerMonth', 'trialDayRemainingLabel', 'trialDaysRemainingLabel',
  'summaryDisplay', 'atGlance', 'keyIdeas',
  'regenerateStudyNotes', 'regeneratingStudyNotes', 'studyNotesUpdated',
  'regenerateStudyNotesError', 'easyReadingEmpty', 'translationUnavailable',
]
for (const language of Object.keys(studyLanguageNames)) {
  const index = sections.indexOf(language)
  assert.notEqual(index, -1, `Missing ${language} locale`)
  const locale = sections[index + 1]
  for (const key of [...planFeatureKeys, ...studyKeys]) {
    assert.ok(new RegExp(`\\b${key}:`).test(locale), `Missing ${language}.${key}`)
  }
}

console.log('Study summary cleanup and billing translations passed for all nine languages')
