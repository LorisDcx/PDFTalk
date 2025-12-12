import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { extractTextFromPDF, truncateText } from '@/lib/pdf'
import { generateDocumentDigest, generateEasyReading } from '@/lib/openai'
import { getPlanLimits } from '@/lib/stripe'
import { isTrialExpired } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Check access (trial or active subscription)
    const hasAccess = profile.subscription_status === 'active' || 
      (profile.trial_end_at && !isTrialExpired(profile.trial_end_at))

    if (!hasAccess) {
      return NextResponse.json({ error: 'Subscription required' }, { status: 403 })
    }

    // Check quota
    const planLimits = getPlanLimits(profile.current_plan)
    if (profile.pages_processed_this_month >= planLimits.pagesPerMonth) {
      return NextResponse.json({ error: 'Monthly page limit exceeded' }, { status: 403 })
    }

    // Get uploaded file
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 })
    }

    // Max file size: 20MB
    const maxSize = 20 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 })
    }

    // Convert file to buffer and extract text
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    let pdfData
    try {
      pdfData = await extractTextFromPDF(buffer)
    } catch (pdfError: any) {
      console.error('PDF extraction error:', pdfError)
      return NextResponse.json({ 
        error: pdfError.message || 'Failed to read PDF file'
      }, { status: 400 })
    }

    // Check if we got any usable text
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return NextResponse.json({ 
        error: 'No text could be extracted from this PDF. It may be a scanned document, contain only images, or be in an unsupported format. Please try a different file or a PDF with selectable text.',
        code: 'no_text_extracted'
      }, { status: 400 })
    }

    // Check page limit per document
    if (pdfData.numPages > planLimits.maxPagesPerDocument) {
      return NextResponse.json({ 
        error: `Document exceeds page limit (max ${planLimits.maxPagesPerDocument} pages for your plan)` 
      }, { status: 400 })
    }

    // Warn about scanned documents but still proceed if some text was extracted
    const pdfWarning = pdfData.warning

    // Sanitize filename for storage (remove accents, special chars, spaces)
    const sanitizeFileName = (name: string): string => {
      return name
        .normalize('NFD') // Decompose accents
        .replace(/[\u0300-\u036f]/g, '') // Remove accent marks
        .replace(/[^a-zA-Z0-9._-]/g, '_') // Replace special chars with underscore
        .replace(/_+/g, '_') // Collapse multiple underscores
        .replace(/^_|_$/g, '') // Trim underscores
    }
    
    // Upload file to storage
    const fileName = `${user.id}/${Date.now()}-${sanitizeFileName(file.name)}`
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(fileName, buffer, {
        contentType: 'application/pdf',
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_path: fileName,
        file_size: file.size,
        pages_count: pdfData.numPages,
        status: 'processing',
      } as any)
      .select()
      .single()

    if (docError || !document) {
      console.error('Document creation error:', docError)
      return NextResponse.json({ error: 'Failed to create document record' }, { status: 500 })
    }

    // Track analytics
    await supabase.from('analytics_events').insert({
      user_id: user.id,
      event_type: 'document_uploaded',
      event_data: { 
        document_id: document.id,
        pages: pdfData.numPages,
        file_size: file.size 
      },
    } as any)

    // Process document with AI (async - but we'll wait for it)
    try {
      const truncatedText = truncateText(pdfData.text)
      
      // Generate digest and easy reading in parallel
      const [digest, easyReading] = await Promise.all([
        generateDocumentDigest(truncatedText),
        generateEasyReading(truncatedText),
      ])

      // Save summary
      await supabase.from('summaries').insert({
        document_id: document.id,
        summary: digest.summary,
        key_clauses: digest.keyClauses,
        risks: digest.risks,
        questions: digest.questions,
        actions: digest.actions,
        easy_reading: easyReading,
        tokens_used: 0, // Could track this from OpenAI response
      } as any)

      // Update document status and type
      await supabase
        .from('documents')
        .update({ 
          status: 'completed',
          document_type: digest.documentType,
        } as any)
        .eq('id', document.id)

      // Update usage
      await supabase
        .from('users')
        .update({
          pages_processed_this_month: profile.pages_processed_this_month + pdfData.numPages,
          docs_processed_this_month: profile.docs_processed_this_month + 1,
        } as any)
        .eq('id', user.id)

    } catch (aiError) {
      console.error('AI processing error:', aiError)
      
      // Mark document as failed
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
      warning: pdfWarning // Include warning about scanned/image PDFs if any
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
