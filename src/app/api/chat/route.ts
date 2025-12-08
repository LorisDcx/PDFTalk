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

    const { documentId, documentContent, question, history } = await request.json()

    if (!documentContent || !question) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build conversation history for context
    const conversationHistory = history?.map((msg: any) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })) || []

    // Create the prompt
    const systemPrompt = `Tu es un assistant expert en analyse de documents. Tu as accès au contenu d'un document PDF et tu dois répondre aux questions de l'utilisateur de manière précise et utile.

CONTENU DU DOCUMENT:
${documentContent.substring(0, 15000)} ${documentContent.length > 15000 ? '... [document tronqué pour le contexte]' : ''}

INSTRUCTIONS:
- Réponds toujours en français
- Base tes réponses uniquement sur le contenu du document
- Si l'information n'est pas dans le document, dis-le clairement
- Sois concis mais complet
- Utilise des bullet points quand c'est approprié
- Si on te demande un résumé, structure-le clairement`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: question },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    const answer = response.choices[0]?.message?.content || "Je n'ai pas pu générer de réponse."

    return NextResponse.json({ answer })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 })
  }
}
