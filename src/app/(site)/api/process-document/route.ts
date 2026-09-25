import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { extractTextFromPDF, truncateText } from '@/lib/pdf'
import { generateDocumentDigest, generateEasyReading } from '@/lib/openai'
import { getPlanLimits } from '@/lib/plans'
import { isTrialExpired } from '@/lib/utils'
import { checkUserUsage, deductPages } from '@/lib/usage'
import { usageFailureResponse } from '@/lib/usage-response'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Body
    const { filePath, fileName } = await request.json()
    if (typeof filePath !== 'string' || !filePath || filePath.length > 300 ||
      typeof fileName !== 'string' || !fileName.trim() || fileName.length > 255) {
      return NextResponse.json({ error: 'Missing filePath or fileName' }, { status: 400 })
    }

    // Optional safety: enforce user folder prefix
    if (!filePath.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Access checks
    const hasAccess = profile.subscription_status === 'active' ||
      (profile.subscription_status === 'trialing' && profile.trial_end_at && !isTrialExpired(profile.trial_end_at))
    if (!hasAccess) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 })
    }

    const planLimits = getPlanLimits(profile.current_plan)
    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('documents')
      .download(filePath)

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: downloadError?.message || 'Failed to download file' },
        { status: (downloadError as any)?.statusCode || 500 }
      )
    }

    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Optional size check (align with client 20MB)
    const maxSize = 20 * 1024 * 1024
    if (buffer.byteLength > maxSize) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 })
    }

    // Extract text
    let pdfData
    try {
      pdfData = await extractTextFromPDF(buffer)
    } catch (pdfError: any) {
      console.error('PDF extraction error:', pdfError)
      return NextResponse.json({
        error: pdfError.message || 'Failed to read PDF file'
      }, { status: 400 })
    }

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return NextResponse.json({
        error: 'No text could be extracted from this PDF. It may be a scanned document, contain only images, or be in an unsupported format.',
        code: 'no_text_extracted'
      }, { status: 400 })
    }

    if (pdfData.numPages > planLimits.maxPagesPerDocument) {
      return NextResponse.json({
        error: `Document exceeds page limit (max ${planLimits.maxPagesPerDocument} pages for your plan)`
      }, { status: 400 })
    }

    const usage = await checkUserUsage(supabase, user.id, pdfData.numPages)
    if (!usage.allowed) {
      return usageFailureResponse(usage)
    }

    const pdfWarning = pdfData.warning

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: fileName,
        file_path: filePath,
        file_size: buffer.byteLength,
        pages_count: pdfData.numPages,
        status: 'processing',
      } as any)
      .select()
      .single()

    if (docError || !document) {
      console.error('Document creation error:', docError)
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 })
    }

    // Process document with AI
    try {
      const truncatedText = truncateText(pdfData.text)

      const [digestResult, easyReadingResult] = await Promise.all([
        generateDocumentDigest(truncatedText),
        generateEasyReading(truncatedText),
      ])
      const { digest } = digestResult
      const { easyReading } = easyReadingResult

      const { error: summaryError } = await supabase.from('summaries').insert({
        document_id: document.id,
        summary: digest.summary,
        key_clauses: digest.keyClauses,
        risks: digest.risks,
        questions: digest.questions,
        actions: digest.actions,
        easy_reading: easyReading,
        source_text: truncatedText,
        tokens_used: digestResult.tokensUsed + easyReadingResult.tokensUsed,
      } as any)
      if (summaryError) throw summaryError

      const charge = await deductPages(supabase, user.id, pdfData.numPages, true)
      if (!charge.success) throw new Error(charge.error)

      await supabase
        .from('documents')
        .update({
          status: 'completed',
          document_type: digest.documentType,
        } as any)
        .eq('id', document.id)

    } catch (aiError) {
      console.error('AI processing error:', aiError)

      await supabase
        .from('documents')
        .update({ status: 'failed' } as any)
        .eq('id', document.id)

      return NextResponse.json({
        error: 'Document analysis failed',
        documentId: document.id
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      documentId: document.id,
      warning: pdfWarning
    })
  } catch (error) {
    console.error('Process document error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
