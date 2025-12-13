import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'

export const maxDuration = 60 // Vercel max timeout (free plan)

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

    // Max 50 cards with Vercel's 60s timeout
    const cardCount = Math.min(50, Math.max(5, count))

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

    // Larger content limit with Vercel's longer timeout
    const maxContentLength = 10000
    const truncatedContent = documentContent.substring(0, maxContentLength)
    const isTruncated = documentContent.length > maxContentLength

    const systemPrompt = `You are an expert in creating educational flashcards. Create exactly ${cardCount} flashcards from this document.

DOCUMENT:
${truncatedContent}${isTruncated ? '\n... [document truncated]' : ''}

INSTRUCTIONS:
- Create exactly ${cardCount} flashcards
- ALL content MUST be in ${targetLanguage}
- Questions: clear and specific
- Answers: concise (1-2 sentences max)
- Cover the most important concepts
- Return ONLY valid JSON

FORMAT:
{"flashcards":[{"id":"1","question":"...","answer":"...","sourceRef":"Section X"}]}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${cardCount} flashcards in ${targetLanguage}.` },
      ],
      temperature: 0.7,
      max_tokens: 6000,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      return NextResponse.json({ error: 'AI returned empty response' }, { status: 500 })
    }

    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json({ error: 'AI returned invalid format' }, { status: 500 })
    }
    
    const flashcards = parsed.flashcards || []
    const actualCardCount = flashcards.length
    const actualPageCost = calculatePageCost('flashcards', actualCardCount)
    await deductPages(supabase, user.id, actualPageCost)

    // Save flashcards to database
    if (documentId && flashcards.length > 0) {
      // Delete existing flashcards for this document
      await supabase
        .from('flashcards')
        .delete()
        .eq('document_id', documentId)

      // Insert new flashcards
      const flashcardsToInsert = flashcards.map((card: any, index: number) => ({
        document_id: documentId,
        question: card.question,
        answer: card.answer,
        source_ref: card.sourceRef || null,
        order_index: index
      }))

      const { error: insertError } = await supabase
        .from('flashcards')
        .insert(flashcardsToInsert)

      if (insertError) {
        console.error('Failed to save flashcards to DB:', insertError)
      }
    }
    
    return NextResponse.json({ 
      flashcards,
      count: actualCardCount,
      pagesUsed: actualPageCost
    })

  } catch (error: any) {
    console.error('Flashcards error:', error?.message || error)
    
    if (error?.status === 429) {
      return NextResponse.json({ error: 'AI service busy. Try again.' }, { status: 429 })
    }
    
    return NextResponse.json({ error: 'Generation failed. Try again.' }, { status: 500 })
  }
}
