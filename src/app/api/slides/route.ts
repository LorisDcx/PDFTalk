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

    // Language names for the prompt
    const languageNames: Record<string, string> = {
      fr: 'French', en: 'English', es: 'Spanish', de: 'German',
      it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic'
    }
    const targetLanguage = languageNames[language] || 'English'

    const systemPrompt = `You are an expert in creating PREMIUM and visually impressive PowerPoint presentations. Analyze the document and create a professional presentation with varied layouts.

DOCUMENT CONTENT:
${documentContent.substring(0, 15000)} ${documentContent.length > 15000 ? '... [document truncated]' : ''}

CRITICAL INSTRUCTIONS:
- Create exactly ${count} slides with VARIED LAYOUTS
- ALL text content MUST be written in ${targetLanguage}
- MUST use different slide types to make the presentation dynamic
- Add relevant emojis for visual illustration
- Statistics should have impactful numbers
- Timelines should have 3-5 chronological steps
- Comparisons should contrast 2 elements

AVAILABLE SLIDE TYPES:
1. "title" - Title slide (title + subtitle + emoji)
2. "content" - Classic content (title + bullets with emojis)
3. "stats" - Key statistics (title + 3 stats with icon, value, label)
4. "timeline" - Timeline (title + ordered steps)
5. "twoColumns" - 2 columns (title + left/right columns with bullets)
6. "quote" - Important quote (text + author)
7. "comparison" - Comparison (title + 2 options with pros/cons)
8. "icons" - Points with icons (title + items with emoji and description)
9. "conclusion" - Conclusion slide (title + key points)

STRICT JSON FORMAT (write all text in ${targetLanguage}):
{
  "title": "Presentation Title in ${targetLanguage}",
  "slides": [
    {
      "id": 1,
      "type": "title",
      "title": "Main Title",
      "subtitle": "Explanatory subtitle",
      "emoji": "🎯"
    },
    {
      "id": 2,
      "type": "stats",
      "title": "Key Figures",
      "stats": [
        { "icon": "📊", "value": "85%", "label": "Stat description" },
        { "icon": "⏱️", "value": "30d", "label": "Stat description" },
        { "icon": "💰", "value": "10K", "label": "Stat description" }
      ]
    },
    {
      "id": 3,
      "type": "timeline",
      "title": "The Steps",
      "steps": [
        { "title": "Step 1", "description": "Description" },
        { "title": "Step 2", "description": "Description" }
      ]
    },
    {
      "id": 4,
      "type": "twoColumns",
      "title": "Comparison",
      "leftTitle": "Option A",
      "leftBullets": ["Point 1", "Point 2"],
      "rightTitle": "Option B", 
      "rightBullets": ["Point 1", "Point 2"]
    },
    {
      "id": 5,
      "type": "icons",
      "title": "Essential Points",
      "items": [
        { "emoji": "✅", "title": "Point 1", "description": "Detail" },
        { "emoji": "⚡", "title": "Point 2", "description": "Detail" }
      ]
    },
    {
      "id": 6,
      "type": "quote",
      "text": "Important quote from the document",
      "author": "Source or context"
    },
    {
      "id": 7,
      "type": "comparison",
      "title": "Pros vs Cons",
      "option1": { "title": "Pros", "emoji": "✅", "points": ["Point 1", "Point 2"] },
      "option2": { "title": "Cons", "emoji": "⚠️", "points": ["Point 1", "Point 2"] }
    },
    {
      "id": 8,
      "type": "content",
      "title": "Important Details",
      "bullets": ["📌 Detailed point 1", "📌 Detailed point 2"]
    },
    {
      "id": 9,
      "type": "conclusion",
      "title": "Key Takeaways",
      "bullets": ["🎯 Key point 1", "🎯 Key point 2", "🎯 Key point 3"]
    }
  ]
}

IMPORTANT: Vary slide types! Don't only use "content". The presentation must be visually diverse and professional. ALL TEXT MUST BE IN ${targetLanguage}.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate a ${count}-slide presentation about this document. Write all content in ${targetLanguage}.` },
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
