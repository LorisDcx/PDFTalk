import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'

// Timeout wrapper for OpenAI calls
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('TIMEOUT')), timeoutMs)
  )
  return Promise.race([promise, timeout])
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId, documentContent, count = 20, language = 'fr' } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ error: 'Missing document content' }, { status: 400 })
    }

    const cardCount = Math.min(100, Math.max(10, count))

    // Calculate page cost (5 flashcards = 1 page)
    const pageCost = calculatePageCost('flashcards', cardCount)

    // Check if user has enough pages
    const usageCheck = await checkUserUsage(supabase, user.id, pageCost)
    
    if (!usageCheck.allowed) {
      return NextResponse.json({ 
        error: usageCheck.error === 'subscription_expired' 
          ? 'Your subscription has expired. Please upgrade to continue.'
          : usageCheck.error === 'User profile not found'
          ? 'User profile not found. Please try logging out and back in.'
          : `Insufficient pages. You need ${pageCost} pages but only have ${usageCheck.pagesRemaining} remaining.`,
        code: usageCheck.error,
        pagesRequired: pageCost,
        pagesRemaining: usageCheck.pagesRemaining
      }, { status: 403 })
    }

    // Language names for the prompt
    const languageNames: Record<string, string> = {
      fr: 'French', en: 'English', es: 'Spanish', de: 'German',
      it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic'
    }
    const targetLanguage = languageNames[language] || 'English'

    // Limit document content to avoid timeout (6000 chars for Netlify's ~10s limit)
    const maxContentLength = 6000
    const truncatedContent = documentContent.substring(0, maxContentLength)
    const isTruncated = documentContent.length > maxContentLength

    const systemPrompt = `You are an expert in creating educational flashcards. Analyze the provided document and create exactly ${cardCount} flashcards to help memorize key concepts.

DOCUMENT CONTENT:
${truncatedContent}${isTruncated ? '\n... [document truncated for processing]' : ''}

CRITICAL INSTRUCTIONS:
- Create exactly ${cardCount} flashcards
- ALL questions and answers MUST be written in ${targetLanguage}
- Each question must be clear and specific
- Each answer must be concise (2-3 sentences max)
- Cover the most important concepts from the document
- Vary question types (definitions, dates, processes, concepts)
- Include a source reference (approximate page/section) for each flashcard
- Respond ONLY with valid JSON

RESPONSE FORMAT (strict JSON):
{
  "flashcards": [
    {
      "id": "1",
      "question": "Clear and precise question in ${targetLanguage}",
      "answer": "Concise and informative answer in ${targetLanguage}",
      "sourceRef": "Page X, Section Y"
    }
  ]
}`

    // Call OpenAI with extended timeout (up to 4 minutes for large card counts)
    const timeoutMs = cardCount >= 80 ? 240000 : cardCount >= 50 ? 120000 : 60000
    const response = await withTimeout(
      openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${cardCount} flashcards from this document. Write them in ${targetLanguage}.` },
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
      timeoutMs
    )

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      console.error('Flashcards: No content in OpenAI response')
      return NextResponse.json({ error: 'AI returned empty response. Please try again.' }, { status: 500 })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch (parseError) {
      console.error('Flashcards: JSON parse error:', parseError, 'Content:', content.substring(0, 500))
      return NextResponse.json({ error: 'AI returned invalid format. Please try again.' }, { status: 500 })
    }
    
    // Deduct pages from user's quota after successful generation
    const actualCardCount = parsed.flashcards?.length || 0
    const actualPageCost = calculatePageCost('flashcards', actualCardCount)
    await deductPages(supabase, user.id, actualPageCost)
    
    return NextResponse.json({ 
      flashcards: parsed.flashcards || [],
      count: actualCardCount,
      pagesUsed: actualPageCost
    })

  } catch (error: any) {
    console.error('Flashcards generation error:', error?.message || error)
    
    // Handle specific error types
    if (error?.message === 'TIMEOUT') {
      return NextResponse.json({ 
        error: 'Generation took too long. Try with fewer flashcards or a shorter document.',
        code: 'timeout'
      }, { status: 504 })
    }
    
    if (error?.status === 429) {
      return NextResponse.json({ 
        error: 'AI service is busy. Please try again in a few seconds.',
        code: 'rate_limit'
      }, { status: 429 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to generate flashcards. Please try again.',
      code: 'generation_error'
    }, { status: 500 })
  }
}
