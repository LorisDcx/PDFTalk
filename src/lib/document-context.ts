import type { SupabaseClient } from '@supabase/supabase-js'

export type DocumentContextResult =
  | { content: string; code: null }
  | { content: null; code: 'subscription_expired' | 'document_unavailable' | 'service_unavailable' }

/** Resolve document content on the server; never trust PDF text supplied by the browser. */
export async function getDocumentContextWithStatus(supabase: SupabaseClient, userId: string, documentId: unknown): Promise<DocumentContextResult> {
  if (typeof documentId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(documentId)) return { content: null, code: 'document_unavailable' }

  const { data: profile, error: profileError } = await supabase.from('users')
    .select('subscription_status, trial_end_at').eq('id', userId).single()
  if (profileError || !profile) return { content: null, code: 'service_unavailable' }
  const active = profile?.subscription_status === 'active' ||
    (profile?.subscription_status === 'trialing' && new Date(profile.trial_end_at).getTime() > Date.now())
  if (!active) return { content: null, code: 'subscription_expired' }

  const { data: document, error: documentError } = await supabase.from('documents')
    .select('id').eq('id', documentId).eq('user_id', userId).eq('status', 'completed').single()
  if (documentError && documentError.code !== 'PGRST116') return { content: null, code: 'service_unavailable' }
  if (!document) return { content: null, code: 'document_unavailable' }

  const { data: summary, error: summaryError } = await supabase.from('summaries')
    .select('source_text, easy_reading, summary').eq('document_id', document.id).single()
  if (summaryError && summaryError.code !== 'PGRST116') return { content: null, code: 'service_unavailable' }
  if (!summary) return { content: null, code: 'document_unavailable' }
  const fallback = Array.isArray(summary.summary) ? summary.summary.join('\n') : ''
  const content = summary.source_text || summary.easy_reading || fallback
  return content ? { content, code: null } : { content: null, code: 'document_unavailable' }
}

export async function getDocumentContext(supabase: SupabaseClient, userId: string, documentId: unknown) {
  const result = await getDocumentContextWithStatus(supabase, userId, documentId)
  return result.content
}
