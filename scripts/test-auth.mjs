import assert from 'node:assert/strict'
import { AuthTimeoutError, authFetch, getAuthErrorMessage, withAuthTimeout } from '../src/lib/supabase/auth-request.ts'

assert.equal(await withAuthTimeout(Promise.resolve('session'), 50), 'session')
await assert.rejects(withAuthTimeout(new Promise(() => {}), 5), AuthTimeoutError)
const failure = new Error('original failure')
await assert.rejects(withAuthTimeout(Promise.reject(failure)), error => error === failure)
// A late rejection after the UI deadline is still handled.
await assert.rejects(withAuthTimeout(new Promise((_, reject) => setTimeout(() => reject(failure), 15)), 5), AuthTimeoutError)
await new Promise(resolve => setTimeout(resolve, 20))

const fallback = 'Unexpected error'
assert.match(getAuthErrorMessage(new AuthTimeoutError(), 'fr', fallback), /temporairement indisponible/)
assert.match(getAuthErrorMessage({ name: 'AuthRetryableFetchError', status: 0 }, 'fr', fallback), /temporairement indisponible/)
assert.match(getAuthErrorMessage({ status: 503 }, 'en', fallback), /temporarily unavailable/)
assert.equal(getAuthErrorMessage({ code: 'invalid_credentials' }, 'fr', fallback), 'Adresse email ou mot de passe incorrect.')
assert.match(getAuthErrorMessage({ code: 'email_not_confirmed' }, 'fr', fallback), /Confirme/)
assert.equal(getAuthErrorMessage({ status: 429, message: 'Rate limit' }, 'en', fallback), 'Rate limit')

const originalFetch = globalThis.fetch
try {
  let captured
  globalThis.fetch = async (input, init) => {
    captured = { input, init }
    return new Response('{}')
  }
  const controller = new AbortController()
  await authFetch('https://example.supabase.co/auth/v1/token', { signal: controller.signal, method: 'POST' })
  const signal = captured.init.signal
  assert.ok(signal instanceof AbortSignal)
  assert.equal(captured.init.method, 'POST')
  controller.abort()
  assert.equal(signal.aborted, true, 'Caller cancellation must be preserved')
  const uploadOptions = { method: 'POST', body: 'file' }
  await authFetch('https://example.supabase.co/storage/v1/object/documents/test.pdf', uploadOptions)
  assert.equal(captured.init, uploadOptions, 'Uploads must not inherit the auth timeout')
} finally {
  globalThis.fetch = originalFetch
}
console.log('Auth deadlines, error messages, cancellation and upload isolation passed')
