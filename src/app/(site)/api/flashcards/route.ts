import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'
import { usageFailureResponse } from '@/lib/usage-response'
import { getPlanLimits } from '@/lib/plans'
import { getDocumentContextWithStatus } from '@/lib/document-context'
import { sampleDocumentSections, verifySourceQuote } from '@/lib/document-retrieval'
import { parseGeneratedCards, uniqueByQuestion, type GeneratedCard } from '@/lib/study-generation'

export const maxDuration = 60

const languageNames: Record<string, string> = {
  fr: 'French', en: 'English', es: 'Spanish', de: 'German', it: 'Italian',
  pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese', ar: 'Arabic',
}

async function generateBatch(documentContent: string, count: number, language: string, existing: string[]): Promise<GeneratedCard[]> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `Create exactly ${count} distinct, useful student flashcards in ${language} from the document excerpts. Questions must be specific and answers concise (one or two sentences). Cover different important concepts, not repeated facts. For each card, copy a short sourceQuote EXACTLY from the excerpts when possible. Never invent a source or page. Return valid JSON only: {"flashcards":[{"question":"...","answer":"...","sourceQuote":"..."}]}\n\nDOCUMENT:\n${documentContent}` },
      { role: 'user', content: `Create ${count} flashcards. Avoid these existing questions: ${existing.slice(-100).join(' | ') || 'none'}.` },
    ],
    temperature: 0.55,
    max_tokens: Math.min(8000, Math.max(2000, count * 180)),
    response_format: { type: 'json_object' },
  })
  const content = response.choices[0]?.message?.content
  if (!content) return []
  try { return parseGeneratedCards(content) } catch { return [] }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { documentId, count = 20, language = 'fr' } = await request.json()
    const context = await getDocumentContextWithStatus(supabase, user.id, documentId)
    if (!context.content) return NextResponse.json({ error: context.code, code: context.code }, { status: context.code === 'service_unavailable' ? 503 : 403 })

    const { data: profile, error: profileError } = await supabase.from('users').select('current_plan').eq('id', user.id).single()
    if (profileError || !profile) return NextResponse.json({ error: 'Profile unavailable', code: 'service_unavailable' }, { status: 503 })
    const requested = Number.isFinite(Number(count)) ? Math.floor(Number(count)) : 20
    const cardCount = Math.min(getPlanLimits(profile.current_plan).maxFlashcardsPerGen, Math.max(5, requested))
    const pageCost = calculatePageCost('flashcards', cardCount)
    const usage = await checkUserUsage(supabase, user.id, pageCost)
    if (!usage.allowed) return usageFailureResponse(usage)

    const documentContent = context.content
    const selectedContent = sampleDocumentSections(documentContent, 14000)
    const targetLanguage = languageNames[language] || 'French'
    const batchSizes = Array.from({ length: Math.ceil(cardCount / 30) }, (_, index) => Math.min(30, cardCount - index * 30))
    let generated = uniqueByQuestion((await Promise.all(batchSizes.map(size => generateBatch(selectedContent, size, targetLanguage, [])))).flat())
    if (generated.length < cardCount) {
      const missing = cardCount - generated.length
      generated = uniqueByQuestion([...generated, ...await generateBatch(selectedContent, missing, targetLanguage, generated.map(card => card.question))])
    }
    if (generated.length < cardCount) return NextResponse.json({ error: 'Could not create the full card set. Your existing cards and quota are unchanged.', code: 'generation_incomplete' }, { status: 503 })

    const cards = generated.slice(0, cardCount).map(card => {
      const source = card.sourceQuote ? verifySourceQuote(documentContent, card.sourceQuote) : null
      return { question: card.question, answer: card.answer,
        sourceRef: source ? `${source.page ? `Page ${source.page} · ` : ''}« ${source.quote} »` : undefined }
    })

    const { data: previousCards, error: previousError } = await supabase.from('flashcards').select('id').eq('document_id', documentId)
    if (previousError) throw previousError
    const { data: insertedCards, error: insertError } = await supabase.from('flashcards').insert(cards.map((card, index) => ({
      document_id: documentId, question: card.question, answer: card.answer, source_ref: card.sourceRef || null, order_index: index,
    }))).select('id')
    if (insertError || insertedCards?.length !== cardCount) throw insertError || new Error('Could not save the full card set')

    const insertedIds = insertedCards.map(card => card.id)
    const charge = await deductPages(supabase, user.id, pageCost)
    if (!charge.success) {
      const { error: rollbackError } = await supabase.from('flashcards').delete().in('id', insertedIds)
      if (rollbackError) console.error('Flashcard rollback failed:', rollbackError)
      return NextResponse.json({ error: charge.error, code: charge.code }, { status: charge.code === 'usage_charge_failed' ? 503 : 403 })
    }
    if (previousCards?.length) {
      const { error: cleanupError } = await supabase.from('flashcards').delete().in('id', previousCards.map(card => card.id))
      if (cleanupError) console.error('Could not remove previous flashcards:', cleanupError)
    }
    return NextResponse.json({ flashcards: cards, count: cardCount, pagesUsed: pageCost })
  } catch (error) {
    console.error('Flashcards error:', error instanceof Error ? error.message : error)
    if (error && typeof error === 'object' && 'status' in error && error.status === 429) return NextResponse.json({ error: 'AI service busy. Try again.', code: 'service_unavailable' }, { status: 429 })
    return NextResponse.json({ error: 'Generation failed. Try again.', code: 'service_unavailable' }, { status: 503 })
  }
}
