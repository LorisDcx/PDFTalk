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

    const languageNames: Record<string, string> = {
      fr: 'français', en: 'English', es: 'español', de: 'Deutsch',
      it: 'italiano', pt: 'português', zh: '中文', ja: '日本語', ar: 'العربية'
    }
    const langName = languageNames[language] || 'français'

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: `Analyse ce document et génère exactement 3 questions pertinentes et spécifiques que l'utilisateur pourrait vouloir poser. Les questions doivent être:
- Directement liées au contenu du document
- Pratiques et utiles
- Courtes (max 8 mots)
- En ${langName}

Réponds UNIQUEMENT avec un JSON valide dans ce format:
{"suggestions": ["Question 1", "Question 2", "Question 3"]}`
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
