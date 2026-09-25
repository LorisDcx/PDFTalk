import type { SupabaseClient } from '@supabase/supabase-js'

/** Resolve document content on the server; never trust PDF text supplied by the browser. */
export async function getDocumentContext(supabase: SupabaseClient, userId: string, documentId: unknown) {
  if (typeof documentId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f-]{27,}$/i.test(documentId)) return null

  const { data: profile } = await supabase.from('users')
    .select('subscription_status, trial_end_at').eq('id', userId).single()
  const active = profile?.subscription_status === 'active' ||
    (profile?.subscription_status === 'trialing' && new Date(profile.trial_end_at).getTime() > Date.now())
  if (!active) return null

  const { data: document } = await supabase.from('documents')
    .select('id').eq('id', documentId).eq('user_id', userId).eq('status', 'completed').single()
  if (!document) return null

  const { data: summary } = await supabase.from('summaries')
    .select('source_text, easy_reading, summary').eq('document_id', document.id).single()
  if (!summary) return null
  const fallback = Array.isArray(summary.summary) ? summary.summary.join('\n') : ''
  return summary.source_text || summary.easy_reading || fallback
}
