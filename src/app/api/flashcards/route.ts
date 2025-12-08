import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'

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

    // Language names for the prompt
    const languageNames: Record<string, string> = {
      fr: 'French', en: 'English', es: 'Spanish', de: 'German',
      it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic'
    }
    const targetLanguage = languageNames[language] || 'English'

    const systemPrompt = `You are an expert in creating educational flashcards. Analyze the provided document and create exactly ${cardCount} flashcards to help memorize key concepts.

DOCUMENT CONTENT:
${documentContent.substring(0, 12000)} ${documentContent.length > 12000 ? '... [document truncated]' : ''}

CRITICAL INSTRUCTIONS:
- Create exactly ${cardCount} flashcards
- ALL questions and answers MUST be written in ${targetLanguage}
- Each question must be clear and specific
- Each answer must be concise (2-3 sentences max)
- Cover the most important concepts from the document
- Vary question types (definitions, dates, processes, concepts)
- Respond ONLY with valid JSON

RESPONSE FORMAT (strict JSON):
{
  "flashcards": [
    {
      "id": "1",
      "question": "Clear and precise question in ${targetLanguage}",
      "answer": "Concise and informative answer in ${targetLanguage}"
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${cardCount} flashcards from this document. Write them in ${targetLanguage}.` },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(content)
    
    return NextResponse.json({ 
      flashcards: parsed.flashcards || [],
      count: parsed.flashcards?.length || 0 
    })

  } catch (error) {
    console.error('Flashcards generation error:', error)
    return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 })
  }
}
