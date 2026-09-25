import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { getDocumentContext } from '@/lib/document-context'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId, language = 'fr' } = await request.json()
    const documentContent = await getDocumentContext(supabase, user.id, documentId)

    if (!documentContent) return NextResponse.json({ suggestions: [] }, { status: 403 })

    // Language names for the prompt
    const languageNames: Record<string, string> = {
      fr: 'French', en: 'English', es: 'Spanish', de: 'German',
      it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic'
    }
    const targetLanguage = languageNames[language] || 'English'

    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      reasoning_effort: 'minimal',
      messages: [
        { 
          role: 'system', 
          content: `Analyze this document and generate exactly 3 relevant and specific questions the user might want to ask. The questions must be:
- Directly related to the document content
- Practical and useful
- Short (max 8 words)
- Written in ${targetLanguage}

Respond ONLY with valid JSON in this format:
{"suggestions": ["Question 1 in ${targetLanguage}", "Question 2 in ${targetLanguage}", "Question 3 in ${targetLanguage}"]}`
        },
        { 
          role: 'user', 
          content: `Document:\n${documentContent.substring(0, 5000)}`
        },
      ],
      max_completion_tokens: 400,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      return NextResponse.json({ suggestions: [] })
    }

    const parsed = JSON.parse(content)
    
    return NextResponse.json({
      suggestions: Array.isArray(parsed.suggestions)
        ? parsed.suggestions.filter((item: unknown) => typeof item === 'string' && item.trim()).slice(0, 3)
        : [],
    })

  } catch (error) {
    console.error('Suggestions generation error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
