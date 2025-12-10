import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentContent, slideCount = 8, language = 'fr', theme = 'modern', includeImages = true, presentationStyle = 'professional' } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ error: 'Missing document content' }, { status: 400 })
    }

    const count = Math.min(15, Math.max(5, slideCount))

    // Calculate page cost (1 slide = 1 page)
    const pageCost = calculatePageCost('slides', count)

    // Check if user has enough pages
    const usageCheck = await checkUserUsage(supabase, user.id, pageCost)
    
    if (!usageCheck.allowed) {
      return NextResponse.json({ 
        error: usageCheck.error === 'subscription_expired' 
          ? 'Your subscription has expired. Please upgrade to continue.'
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

    // Style descriptions
    const styleDescriptions: Record<string, string> = {
      professional: 'formal, business-oriented, clear and concise, data-driven',
      academic: 'scholarly, detailed, with citations and references, educational',
      creative: 'engaging, storytelling, visual metaphors, innovative layouts'
    }
    const styleDesc = styleDescriptions[presentationStyle] || styleDescriptions.professional

    const systemPrompt = `You are an expert in creating PREMIUM, visually impressive, and ${styleDesc} PowerPoint presentations. Analyze the document and create a professional presentation with varied layouts.

DOCUMENT CONTENT:
${documentContent.substring(0, 15000)} ${documentContent.length > 15000 ? '... [document truncated]' : ''}

CRITICAL INSTRUCTIONS:
- Create exactly ${count} slides with VARIED LAYOUTS
- ALL text content MUST be written in ${targetLanguage}
- MUST use different slide types to make the presentation dynamic and engaging
- Add relevant emojis for visual illustration
- Statistics should have impactful, realistic numbers from the document
- Timelines should have 3-5 chronological steps
- Comparisons should contrast 2 elements clearly
- Make content concise but informative
- Style: ${styleDesc}
${includeImages ? '- For "image" type slides, provide an imageQuery (2-3 English keywords for stock photo search)' : ''}

AVAILABLE SLIDE TYPES (use variety!):
1. "title" - Title slide (title + subtitle + emoji) - USE FIRST
2. "content" - Classic content (title + bullets with emojis)
3. "stats" - Key statistics (title + 3 stats with icon, value, label)
4. "timeline" - Timeline (title + ordered steps with title and description)
5. "twoColumns" - 2 columns comparison (title + leftTitle/leftBullets + rightTitle/rightBullets)
6. "quote" - Important quote (text + author)
7. "comparison" - Pros/Cons comparison (title + option1 + option2 with emoji, title, points)
8. "icons" - Points with icons (title + items array with emoji, title, description)
9. "bigNumber" - Highlight a key number (number + numberLabel + title)
10. "agenda" - Agenda/Table of contents (title + agendaItems with number and title)
${includeImages ? '11. "image" - Image with text (title + bullets + imageQuery for stock photo)' : ''}
12. "threeColumns" - 3 columns (title + columns array with title and items)
13. "conclusion" - Conclusion slide (title + key points) - USE LAST

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
      "type": "agenda",
      "title": "Agenda",
      "agendaItems": [
        { "number": "01", "title": "First topic" },
        { "number": "02", "title": "Second topic" },
        { "number": "03", "title": "Third topic" }
      ]
    },
    {
      "id": 3,
      "type": "bigNumber",
      "number": "85%",
      "numberLabel": "of users agree",
      "title": "Key Insight"
    },
    {
      "id": 4,
      "type": "stats",
      "title": "Key Figures",
      "stats": [
        { "icon": "📊", "value": "85%", "label": "Stat description" },
        { "icon": "⏱️", "value": "30d", "label": "Stat description" },
        { "icon": "💰", "value": "10K", "label": "Stat description" }
      ]
    },
    ${includeImages ? `{
      "id": 5,
      "type": "image",
      "title": "Visual Concept",
      "bullets": ["Key point 1", "Key point 2"],
      "imageQuery": "business teamwork office"
    },` : ''}
    {
      "id": 6,
      "type": "timeline",
      "title": "The Process",
      "steps": [
        { "title": "Step 1", "description": "Description" },
        { "title": "Step 2", "description": "Description" },
        { "title": "Step 3", "description": "Description" }
      ]
    },
    {
      "id": 7,
      "type": "threeColumns",
      "title": "Three Key Areas",
      "columns": [
        { "title": "Area 1", "items": ["Point A", "Point B"] },
        { "title": "Area 2", "items": ["Point A", "Point B"] },
        { "title": "Area 3", "items": ["Point A", "Point B"] }
      ]
    },
    {
      "id": 8,
      "type": "icons",
      "title": "Essential Points",
      "items": [
        { "emoji": "✅", "title": "Point 1", "description": "Detail" },
        { "emoji": "⚡", "title": "Point 2", "description": "Detail" },
        { "emoji": "🎯", "title": "Point 3", "description": "Detail" }
      ]
    },
    {
      "id": 9,
      "type": "quote",
      "text": "Important quote from the document",
      "author": "Source or context"
    },
    {
      "id": 10,
      "type": "conclusion",
      "title": "Key Takeaways",
      "bullets": ["🎯 Key point 1", "🎯 Key point 2", "🎯 Key point 3"]
    }
  ]
}

IMPORTANT RULES:
1. ALWAYS start with a "title" slide
2. ALWAYS end with a "conclusion" slide  
3. Vary slide types - don't use the same type twice in a row
4. Use "bigNumber" for impressive statistics
5. Use "agenda" early to outline the presentation
6. Make bullet points concise (max 10 words each)
7. ALL TEXT MUST BE IN ${targetLanguage}`

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
    
    // Deduct pages from user's quota after successful generation
    const actualSlideCount = parsed.slides?.length || 0
    const actualPageCost = calculatePageCost('slides', actualSlideCount)
    await deductPages(supabase, user.id, actualPageCost)
    
    return NextResponse.json({ 
      title: parsed.title,
      slides: parsed.slides || [],
      count: actualSlideCount,
      pagesUsed: actualPageCost
    })

  } catch (error) {
    console.error('Slides generation error:', error)
    return NextResponse.json({ error: 'Failed to generate slides' }, { status: 500 })
  }
}
