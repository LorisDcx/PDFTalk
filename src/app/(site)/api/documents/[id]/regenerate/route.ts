import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { generateDocumentDigest, generateEasyReading } from '@/lib/openai'
import { extractTextFromPDF, prepareDocumentText } from '@/lib/pdf'
import { resolveStudyLanguage } from '@/lib/study-language'
import { isTrialExpired } from '@/lib/utils'

export const maxDuration = 60

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid document' }, { status: 400 })
  }

  const supabase = await createServerClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile, error: profileError } = await supabase.from('users').select('subscription_status, trial_end_at').eq('id', user.id).single()
  if (profileError || !profile) return NextResponse.json({ error: 'Account temporarily unavailable', code: 'service_unavailable' }, { status: 503 })
  const hasAccess = profile?.subscription_status === 'active' ||
    (profile?.subscription_status === 'trialing' && profile.trial_end_at && !isTrialExpired(profile.trial_end_at))
  if (!hasAccess) return NextResponse.json({ error: 'Access expired', code: 'access_expired' }, { status: 403 })

  const { data: document } = await supabase.from('documents')
    .select('id, file_path, status').eq('id', id).eq('user_id', user.id).single()
  if (!document || document.status !== 'completed') {
    return NextResponse.json({ error: 'Document unavailable' }, { status: 404 })
  }
  const { data: previous } = await supabase.from('summaries')
    .select('id, source_text').eq('document_id', id).single()
  if (!previous) return NextResponse.json({ error: 'Analysis unavailable' }, { status: 404 })

  let sourceText = previous.source_text?.trim() || ''
  if (!sourceText) {
    const { data: file, error: downloadError } = await supabase.storage.from('documents').download(document.file_path)
    if (downloadError || !file) return NextResponse.json({ error: 'Source PDF unavailable', code: 'source_unavailable' }, { status: 503 })
    try {
      sourceText = prepareDocumentText(await extractTextFromPDF(Buffer.from(await file.arrayBuffer()))).text
    } catch (error) {
      console.error('Could not recover document source:', error)
      return NextResponse.json({ error: 'Source PDF unavailable', code: 'source_unavailable' }, { status: 503 })
    }
  }

  const body = await request.json().catch(() => ({})) as { language?: unknown }
  const language = resolveStudyLanguage(body.language)
  try {
    const [digestResult, readingResult] = await Promise.all([
      generateDocumentDigest(sourceText, language),
      generateEasyReading(sourceText, language),
    ])
    const { digest } = digestResult
    const { easyReading } = readingResult
    const { error: saveError } = await supabase.from('summaries').update({
      summary: digest.summary,
      key_clauses: digest.keyClauses,
      risks: digest.risks,
      questions: digest.questions,
      actions: digest.actions,
      easy_reading: easyReading,
      source_text: sourceText,
      tokens_used: digestResult.tokensUsed + readingResult.tokensUsed,
    } as never).eq('id', previous.id)
    if (saveError) throw saveError
    await supabase.from('documents').update({ document_type: digest.documentType } as never).eq('id', id).eq('user_id', user.id)
    return NextResponse.json({ digest, easyReading })
  } catch (error) {
    console.error('Document regeneration failed:', error)
    return NextResponse.json({ error: 'Analysis temporarily unavailable', code: 'ai_unavailable' }, { status: 503 })
  }
}
