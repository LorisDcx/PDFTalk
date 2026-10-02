import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import ts from 'typescript'
import { isCourseQuestion } from '../src/lib/course-question-quality.ts'

for (const q of ['Qui a écrit le manuel ?', 'De quoi parle le manuel ?', 'Quel est le but du manuel ?', 'Qui a rédigé ce cours ?', 'Quel est le rôle du manuel ?', 'Who wrote the textbook?', 'Who is the author of this textbook?', 'What is this handbook about?', 'What is the purpose of this book?']) assert.equal(isCourseQuestion(q), false, q)
for (const q of ['Quelle est la dérivée de x² ?', 'Quel auteur a développé la théorie présentée dans ce cours ?', 'Quel est le rôle du document comptable ?', 'Comment fonctionne la photosynthèse ?', 'Qui a écrit Les Misérables ?', 'What does this textbook explain about osmosis?', 'What is the role of ATP in the process described in the document?']) assert.equal(isCourseQuestion(q), true, q)

const rows = new Map(); let failed = false; let status = 'active'; let writeFailed = false
const admin = { from(table) {
  const builder = { select() { return builder }, eq() { return builder }, single: async () => ({ data: { current_plan: 'starter', subscription_status: status }, error: failed ? { code: 'offline' } : null }), in: async (_col, ids) => ({ data: ids.filter(id => rows.has(id)).map(id => ({ id })), error: null }), insert: async row => { await Promise.resolve(); if (writeFailed) return { error: { code: 'offline' } }; if (rows.has(row.id)) return { error: { code: '23505' } }; rows.set(row.id, row); return { error: null } } }
  assert.ok(['users','analytics_events'].includes(table)); return builder
} }
const require = createRequire(import.meta.url); const exports = {}
const js = ts.transpileModule(readFileSync('src/lib/learning-coaching.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
vm.runInNewContext(js, { exports, process: { env: { SUPABASE_SERVICE_ROLE_KEY: 'test-secret' } }, require: name => name === './supabase/admin' ? { createAdminClient: () => admin } : name === './plans' ? { getPlanLimits: plan => ({ includedCoachingPerDay: ({basic:20,starter:20,growth:50,student:50,pro:100,graduate:100})[plan] || 20 }) } : require(name) })
const { reserveIncludedCoaching, coachingDailyLimit } = exports
assert.equal(coachingDailyLimit('starter',true),10);assert.equal(coachingDailyLimit('growth',false),50);assert.equal(coachingDailyLimit('graduate',false),100)
const now=new Date('2026-10-02T17:00:00Z')
const results=await Promise.all(Array.from({ length: 80 }, () => reserveIncludedCoaching('learner', now)))
assert.equal(results.filter(result=>result.code===null).length,20)
assert.equal(results.filter(result=>result.code==='learning_daily_limit').length,60)
assert.equal(rows.size,20)
assert.equal((await reserveIncludedCoaching('learner',new Date('2026-10-03T00:00:00Z'))).code,null)
assert.equal((await reserveIncludedCoaching('another-learner',now)).code,null)
failed=true;assert.equal((await reserveIncludedCoaching('learner',now)).code,'service_unavailable')
failed=false;writeFailed=true;assert.equal((await reserveIncludedCoaching('new-learner',now)).code,'service_unavailable')
writeFailed=false;status='canceled';assert.equal((await reserveIncludedCoaching('new-learner',now)).code,'subscription_expired')
console.log('Course-only questions and included coaching concurrency, daily reset, user isolation and database failure passed.')
