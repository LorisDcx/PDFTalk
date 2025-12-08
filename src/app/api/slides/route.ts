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

    const { documentContent, slideCount = 8, language = 'fr' } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ error: 'Missing document content' }, { status: 400 })
    }

    const count = Math.min(15, Math.max(5, slideCount))
    
    const languageNames: Record<string, string> = {
      fr: 'français', en: 'English', es: 'español', de: 'Deutsch',
      it: 'italiano', pt: 'português', zh: '中文', ja: '日本語', ar: 'العربية'
    }
    const langName = languageNames[language] || 'français'

    const systemPrompt = `Tu es un expert en création de présentations PowerPoint PREMIUM et visuellement impressionnantes. Analyse le document et crée une présentation professionnelle avec des layouts variés.

LANGUE: Génère TOUT le contenu en ${langName}.

CONTENU DU DOCUMENT:
${documentContent.substring(0, 15000)} ${documentContent.length > 15000 ? '... [document tronqué]' : ''}

INSTRUCTIONS:
- Crée exactement ${count} slides avec des LAYOUTS VARIÉS
- Utilise OBLIGATOIREMENT différents types de slides pour rendre la présentation dynamique
- Ajoute des emojis pertinents pour illustrer visuellement
- Les statistiques doivent avoir des chiffres impactants
- Les timelines doivent avoir 3-5 étapes chronologiques
- Les comparaisons doivent opposer 2 éléments

TYPES DE SLIDES DISPONIBLES:
1. "title" - Slide de titre (titre + sous-titre + emoji)
2. "content" - Contenu classique (titre + bullets avec emojis)
3. "stats" - Statistiques clés (titre + 3 stats avec icône, valeur, label)
4. "timeline" - Frise chronologique (titre + étapes ordonnées)
5. "twoColumns" - 2 colonnes (titre + colonne gauche/droite avec bullets)
6. "quote" - Citation importante (texte + auteur)
7. "comparison" - Comparaison (titre + 2 options avec avantages/inconvénients)
8. "icons" - Points avec icônes (titre + items avec emoji et description)
9. "conclusion" - Slide de conclusion (titre + points clés)

FORMAT JSON STRICT:
{
  "title": "Titre de la présentation",
  "slides": [
    {
      "id": 1,
      "type": "title",
      "title": "Titre Principal",
      "subtitle": "Sous-titre explicatif",
      "emoji": "🎯"
    },
    {
      "id": 2,
      "type": "stats",
      "title": "Chiffres clés",
      "stats": [
        { "icon": "📊", "value": "85%", "label": "Description stat" },
        { "icon": "⏱️", "value": "30j", "label": "Description stat" },
        { "icon": "💰", "value": "10K€", "label": "Description stat" }
      ]
    },
    {
      "id": 3,
      "type": "timeline",
      "title": "Les étapes",
      "steps": [
        { "title": "Étape 1", "description": "Description" },
        { "title": "Étape 2", "description": "Description" }
      ]
    },
    {
      "id": 4,
      "type": "twoColumns",
      "title": "Comparatif",
      "leftTitle": "Option A",
      "leftBullets": ["Point 1", "Point 2"],
      "rightTitle": "Option B", 
      "rightBullets": ["Point 1", "Point 2"]
    },
    {
      "id": 5,
      "type": "icons",
      "title": "Points essentiels",
      "items": [
        { "emoji": "✅", "title": "Point 1", "description": "Détail" },
        { "emoji": "⚡", "title": "Point 2", "description": "Détail" }
      ]
    },
    {
      "id": 6,
      "type": "quote",
      "text": "Citation importante du document",
      "author": "Source ou contexte"
    },
    {
      "id": 7,
      "type": "comparison",
      "title": "Avantages vs Inconvénients",
      "option1": { "title": "Avantages", "emoji": "✅", "points": ["Point 1", "Point 2"] },
      "option2": { "title": "Inconvénients", "emoji": "⚠️", "points": ["Point 1", "Point 2"] }
    },
    {
      "id": 8,
      "type": "content",
      "title": "Détails importants",
      "bullets": ["📌 Point détaillé 1", "📌 Point détaillé 2"]
    },
    {
      "id": 9,
      "type": "conclusion",
      "title": "À retenir",
      "bullets": ["🎯 Point clé 1", "🎯 Point clé 2", "🎯 Point clé 3"]
    }
  ]
}

IMPORTANT: Varie les types de slides ! N'utilise pas que "content". La présentation doit être visuellement diverse et professionnelle.`

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
