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

    const { documentContent, slideCount = 8 } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ error: 'Missing document content' }, { status: 400 })
    }

    const count = Math.min(15, Math.max(5, slideCount))

    const systemPrompt = `Tu es un expert en création de présentations PowerPoint professionnelles. Analyse le document et crée une présentation claire et impactante.

CONTENU DU DOCUMENT:
${documentContent.substring(0, 15000)} ${documentContent.length > 15000 ? '... [document tronqué]' : ''}

INSTRUCTIONS:
- Crée exactement ${count} slides
- Slide 1: Titre accrocheur + sous-titre
- Slides 2-${count-1}: Contenu principal avec bullets clairs
- Slide ${count}: Conclusion/Points clés à retenir
- Chaque slide doit avoir un titre court et percutant
- Maximum 4-5 bullets par slide
- Bullets concis (1 ligne max)
- Ajoute des emojis pertinents pour rendre visuel
- Réponds UNIQUEMENT en JSON valide

FORMAT DE RÉPONSE (JSON strict):
{
  "title": "Titre de la présentation",
  "slides": [
    {
      "id": 1,
      "type": "title",
      "title": "Titre Principal",
      "subtitle": "Sous-titre explicatif"
    },
    {
      "id": 2,
      "type": "content",
      "title": "Titre du slide",
      "bullets": ["Point 1", "Point 2", "Point 3"]
    },
    {
      "id": 3,
      "type": "conclusion",
      "title": "À retenir",
      "bullets": ["Point clé 1", "Point clé 2"]
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Génère une présentation de ${count} slides sur ce document.` },
      ],
      temperature: 0.7,
      max_tokens: 3000,
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(content)
    
    return NextResponse.json({ 
      title: parsed.title,
      slides: parsed.slides || [],
      count: parsed.slides?.length || 0 
    })

  } catch (error) {
    console.error('Slides generation error:', error)
    return NextResponse.json({ error: 'Failed to generate slides' }, { status: 500 })
  }
}
