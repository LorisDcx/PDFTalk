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
    const systemPrompt = `You are an expert document analysis assistant. You have access to the content of a PDF document and must answer the user's questions accurately and helpfully.

DOCUMENT CONTENT:
${documentContent.substring(0, 15000)} ${documentContent.length > 15000 ? '... [document truncated for context]' : ''}

CRITICAL INSTRUCTIONS:
- ALWAYS respond in the SAME LANGUAGE the user is writing in. If the user writes in Chinese, respond in Chinese. If they write in French, respond in French. If they write in English, respond in English. Etc.
- Base your answers ONLY on the document content
- If the information is not in the document, say so clearly
- Be concise but complete
- Use bullet points when appropriate
- If asked for a summary, structure it clearly`

    const response = await openai.chat.completions.create({
      model: 'gpt-5-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: question },
      ],
      max_completion_tokens: 1000,
    })

    const answer = response.choices[0]?.message?.content || "I couldn't generate a response."

    return NextResponse.json({ answer })

  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 })
  }
}
