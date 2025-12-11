import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

    const cardCount = Math.min(50, Math.max(10, count))

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

    // Limit document content (can be larger now with streaming)
    const maxContentLength = 10000
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

    // Create streaming response with SSE
    const encoder = new TextEncoder()
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial event to keep connection alive
          controller.enqueue(encoder.encode(`data: {"type":"start","cardCount":${cardCount}}\n\n`))
          
          // Call OpenAI with streaming
          const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Generate ${cardCount} flashcards from this document. Write them in ${targetLanguage}.` },
            ],
            temperature: 0.7,
            max_tokens: 6000,
            response_format: { type: 'json_object' },
            stream: true,
          })

          let fullContent = ''
          let chunkCount = 0
          
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              fullContent += content
              chunkCount++
              
              // Send progress every 10 chunks to keep connection alive
              if (chunkCount % 10 === 0) {
                controller.enqueue(encoder.encode(`data: {"type":"progress","length":${fullContent.length}}\n\n`))
              }
            }
          }

          // Parse the complete JSON
          let parsed
          try {
            parsed = JSON.parse(fullContent)
          } catch (parseError) {
            console.error('Flashcards: JSON parse error:', parseError)
            controller.enqueue(encoder.encode(`data: {"type":"error","message":"AI returned invalid format"}\n\n`))
            controller.close()
            return
          }

          const flashcards = parsed.flashcards || []
          const actualCardCount = flashcards.length
          const actualPageCost = calculatePageCost('flashcards', actualCardCount)
          
          // Deduct pages
          await deductPages(supabase, user.id, actualPageCost)

          // Send final result
          controller.enqueue(encoder.encode(`data: {"type":"complete","flashcards":${JSON.stringify(flashcards)},"count":${actualCardCount},"pagesUsed":${actualPageCost}}\n\n`))
          controller.close()
          
        } catch (error: any) {
          console.error('Flashcards streaming error:', error?.message || error)
          
          let errorMessage = 'Failed to generate flashcards'
          if (error?.status === 429) {
            errorMessage = 'AI service is busy. Please try again.'
          }
          
          controller.enqueue(encoder.encode(`data: {"type":"error","message":"${errorMessage}"}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: any) {
    console.error('Flashcards generation error:', error?.message || error)
    return NextResponse.json({ 
      error: 'Failed to generate flashcards. Please try again.',
      code: 'generation_error'
    }, { status: 500 })
  }
}
