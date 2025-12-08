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

    const { documentContent, language = 'fr' } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ suggestions: [] })
    }

    // Language names for the prompt
    const languageNames: Record<string, string> = {
      fr: 'French', en: 'English', es: 'Spanish', de: 'German',
      it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic'
    }
    const targetLanguage = languageNames[language] || 'English'

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
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
          content: `Document:\n${documentContent}` 
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      return NextResponse.json({ suggestions: [] })
    }

    const parsed = JSON.parse(content)
    
    return NextResponse.json({ 
      suggestions: parsed.suggestions || []
    })

  } catch (error) {
    console.error('Suggestions generation error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
