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

    const { documentId, documentContent, count = 10, language = 'fr' } = await request.json()

    if (!documentContent) {
      return NextResponse.json({ error: 'Missing document content' }, { status: 400 })
    }

    const questionCount = Math.min(30, Math.max(5, count))

    // Calculate page cost (5 questions = 1 page)
    const pageCost = calculatePageCost('quiz', questionCount)

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
    const targetLanguage = languageNames[language] || 'French'

    const systemPrompt = `You are an expert quiz creator for students. Analyze the provided document and create exactly ${questionCount} multiple choice questions to test knowledge.

DOCUMENT CONTENT:
${documentContent.substring(0, 12000)} ${documentContent.length > 12000 ? '... [document truncated]' : ''}

CRITICAL INSTRUCTIONS:
- Create exactly ${questionCount} multiple choice questions
- ALL questions and answers MUST be written in ${targetLanguage}
- Each question must have exactly 4 options (A, B, C, D)
- Only ONE option should be correct
- Include a source reference (approximate page/section) for each question
- Cover the most important concepts from the document
- Vary difficulty levels
- Respond ONLY with valid JSON

RESPONSE FORMAT (strict JSON):
{
  "questions": [
    {
      "id": "1",
      "question": "Clear question in ${targetLanguage}?",
      "correctAnswer": "The correct answer text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "sourceRef": "Page X, Section Y"
    }
  ]
}`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate ${questionCount} quiz questions from this document. Write them in ${targetLanguage}.` },
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
    
    // Ensure correctAnswer is in options array
    const questions = (parsed.questions || []).map((q: any) => {
      if (!q.options.includes(q.correctAnswer)) {
        q.options[0] = q.correctAnswer
        q.options = q.options.sort(() => Math.random() - 0.5)
      }
      return q
    })
    
    // Deduct pages from user's quota after successful generation
    const actualQuestionCount = questions.length
    const actualPageCost = calculatePageCost('quiz', actualQuestionCount)
    await deductPages(supabase, user.id, actualPageCost)
    
    return NextResponse.json({ 
      questions,
      count: actualQuestionCount,
      pagesUsed: actualPageCost
    })

  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
