import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, checkHumanizerUsage, deductHumanizerCredit } from '@/lib/usage'
import { usageFailureResponse } from '@/lib/usage-response'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { type, subject, thesis, text, wordCount = 1500 } = await request.json()
    if (!['dissertation', 'commentaire', 'humanize'].includes(type) ||
      !Number.isInteger(wordCount) || wordCount < 250 || wordCount > 3000 ||
      (subject != null && (typeof subject !== 'string' || subject.length > 1000)) ||
      (thesis != null && (typeof thesis !== 'string' || thesis.length > 2000)) ||
      (text != null && (typeof text !== 'string' || text.length > 30000)) ||
      (type === 'dissertation' && !subject?.trim()) ||
      (type !== 'dissertation' && !text?.trim())) {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }

    const isRewrite = type === 'humanize'
    const humanizerUsage = isRewrite ? await checkHumanizerUsage(supabase, user.id) : null
    if (humanizerUsage && !humanizerUsage.allowed) {
      return NextResponse.json({ error: 'Crédits de reformulation épuisés', code: humanizerUsage.error,
        creditsRemaining: humanizerUsage.creditsRemaining, creditsLimit: humanizerUsage.creditsLimit }, { status: 403 })
    }
    const estimatedPages = Math.ceil(wordCount / 250)
    if (!isRewrite) {
      const usage = await checkUserUsage(supabase, user.id, estimatedPages)
      if (!usage.allowed) return usageFailureResponse(usage)
    }

    const systemPrompt = isRewrite
      ? 'Tu es un assistant de rédaction. Reformule le texte dans sa langue d’origine pour le rendre plus fluide et lisible. Préserve le sens, les faits, les citations et le niveau de formalité. N’invente ni expérience personnelle, ni détail, ni référence. Ne promets aucun résultat dans un détecteur d’IA. Réponds uniquement avec le texte reformulé, en paragraphes simples.'
      : type === 'dissertation'
        ? 'Tu aides à rédiger une dissertation en français avec introduction, problématique, développement argumenté et conclusion. Distingue les faits des exemples hypothétiques, n’invente pas de citation ni de référence précise, et indique les points à vérifier. La réponse doit être une aide à l’étude.'
        : 'Tu aides à rédiger un commentaire de texte en français avec introduction, analyse organisée et conclusion. Appuie chaque observation sur le texte fourni. N’invente pas de citation, d’auteur ou de contexte absent de la demande.'

    const userPrompt = isRewrite
      ? `Reformule ce texte sans en changer le sens :\n\n${text}`
      : type === 'dissertation'
        ? `Sujet : ${subject}\nOrientation : ${thesis || 'libre'}\nLongueur souhaitée : environ ${wordCount} mots.`
        : `Texte à commenter :\n${text}\nConsigne : ${subject || 'analyse libre'}\nLongueur souhaitée : environ ${wordCount} mots.`

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      temperature: 0.7,
      max_tokens: 6000,
    })
    const content = response.choices[0]?.message?.content?.trim()
    if (!content) return NextResponse.json({ error: 'Réponse vide de l’IA' }, { status: 502 })
    const actualWordCount = content.split(/\s+/).length

    if (isRewrite) {
      const charge = await deductHumanizerCredit(supabase, user.id)
      if (!charge.success) return NextResponse.json({ error: charge.error }, { status: 403 })
      return NextResponse.json({ content, wordCount: actualWordCount, creditsUsed: 1,
        creditsRemaining: Math.max(0, (humanizerUsage?.creditsRemaining ?? 1) - 1),
        creditsLimit: humanizerUsage?.creditsLimit ?? 0 })
    }

    const pagesUsed = Math.ceil(actualWordCount / 250)
    const charge = await deductPages(supabase, user.id, pagesUsed)
    if (!charge.success) return NextResponse.json({ error: charge.error }, { status: 403 })
    return NextResponse.json({ content, wordCount: actualWordCount, pagesUsed })
  } catch (error: any) {
    console.error('Writer error:', error?.message || error)
    return NextResponse.json({ error: error?.status === 429 ? 'Service IA surchargé. Réessayez.' : 'Échec de la génération. Réessayez.' },
      { status: error?.status === 429 ? 429 : 500 })
  }
}
