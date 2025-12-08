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

    const { documentId, documentContent, count = 20 } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ error: 'Missing document content' }, { status: 400 })
    }

    const cardCount = Math.min(100, Math.max(10, count))

    const systemPrompt = `Tu es un expert en création de flashcards éducatives. Analyse le document fourni et crée exactement ${cardCount} flashcards pour aider à mémoriser les concepts clés.

CONTENU DU DOCUMENT:
${documentContent.substring(0, 12000)} ${documentContent.length > 12000 ? '... [document tronqué]' : ''}

INSTRUCTIONS:
- Crée exactement ${cardCount} flashcards
- Chaque question doit être claire et spécifique
- Chaque réponse doit être concise (2-3 phrases max)
- Couvre les concepts les plus importants du document
- Varie les types de questions (définitions, dates, processus, concepts)
- Réponds UNIQUEMENT en JSON valide

FORMAT DE RÉPONSE (JSON strict):
{
  "flashcards": [
    {
      "id": "1",
      "question": "Question claire et précise",
      "answer": "Réponse concise et informative"
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Génère ${cardCount} flashcards à partir de ce document.` },
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
