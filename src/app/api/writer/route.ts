import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, subject, thesis, text, wordCount = 1500 } = await request.json()

    if (!type) {
      return NextResponse.json({ error: 'Type requis' }, { status: 400 })
    }

    // Calculate page cost based on word count
    const pageCost = Math.ceil(wordCount / 250) // ~250 words per page

    const usageCheck = await checkUserUsage(supabase, user.id, pageCost)
    
    if (!usageCheck.allowed) {
      return NextResponse.json({ 
        error: `Pages insuffisantes. Vous avez besoin de ${pageCost} pages mais il vous en reste ${usageCheck.pagesRemaining}.`,
        code: usageCheck.error,
        pagesRequired: pageCost,
        pagesRemaining: usageCheck.pagesRemaining
      }, { status: 403 })
    }

    let systemPrompt = ''
    let userPrompt = ''

    if (type === 'dissertation') {
      systemPrompt = `Tu es un professeur de philosophie/lettres expert en dissertation française. 
Tu dois rédiger une dissertation complète, structurée et argumentée.

STRUCTURE OBLIGATOIRE:
1. INTRODUCTION (accroche, définition des termes, problématique, annonce du plan)
2. DÉVELOPPEMENT en 3 parties avec sous-parties (thèse, antithèse, synthèse ou plan progressif)
3. CONCLUSION (bilan, réponse à la problématique, ouverture)

STYLE:
- Français académique soutenu
- Transitions fluides entre les parties
- Exemples littéraires, philosophiques ou historiques pertinents
- Argumentation rigoureuse
- Environ ${wordCount} mots`

      userPrompt = `Rédige une dissertation complète sur le sujet suivant:

SUJET: ${subject}
${thesis ? `\nORIENTATION/THÈSE: ${thesis}` : ''}

Rédige la dissertation complète avec introduction, développement structuré et conclusion.`

    } else if (type === 'commentaire') {
      systemPrompt = `Tu es un professeur de lettres expert en commentaire de texte littéraire.
Tu dois rédiger un commentaire composé complet et structuré.

STRUCTURE OBLIGATOIRE:
1. INTRODUCTION (présentation auteur/œuvre, situation du passage, problématique, annonce du plan)
2. DÉVELOPPEMENT en 2-3 axes avec sous-parties (analyse stylistique, thématique, structurelle)
3. CONCLUSION (bilan, portée du texte, ouverture)

MÉTHODE:
- Citer le texte entre guillemets avec analyse
- Identifier les procédés littéraires (figures de style, champs lexicaux, rythme...)
- Interpréter les effets produits
- Lier forme et fond
- Environ ${wordCount} mots`

      userPrompt = `Rédige un commentaire composé du texte suivant:

TEXTE À COMMENTER:
${text}

${subject ? `CONSIGNE/AXE: ${subject}` : ''}

Rédige le commentaire complet avec introduction, développement structuré et conclusion.`

    } else if (type === 'humanize') {
      systemPrompt = `Tu es un expert en réécriture de texte. Ta mission est de transformer un texte généré par IA en un texte qui semble écrit par un humain.

TECHNIQUES:
- Varier la longueur des phrases (courtes et longues)
- Ajouter des expressions idiomatiques naturelles
- Inclure des hésitations subtiles ("en quelque sorte", "disons que")
- Varier le vocabulaire (éviter les répétitions)
- Ajouter des connecteurs logiques variés
- Rendre le ton plus conversationnel si approprié
- Garder quelques imperfections mineures (naturel)
- Préserver le sens et les informations clés

IMPORTANT: Le texte doit rester professionnel et cohérent, juste plus naturel.`

      userPrompt = `Réécris ce texte pour qu'il paraisse plus naturel et humain, tout en conservant le sens:

${text}`
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 8000,
    })

    const content = response.choices[0]?.message?.content
    
    if (!content) {
      return NextResponse.json({ error: 'Réponse vide de l\'IA' }, { status: 500 })
    }

    // Deduct pages
    const actualWordCount = content.split(/\s+/).length
    const actualPageCost = Math.ceil(actualWordCount / 250)
    await deductPages(supabase, user.id, actualPageCost)
    
    return NextResponse.json({ 
      content,
      wordCount: actualWordCount,
      pagesUsed: actualPageCost
    })

  } catch (error: any) {
    console.error('Writer error:', error?.message || error)
    
    if (error?.status === 429) {
      return NextResponse.json({ error: 'Service IA surchargé. Réessayez.' }, { status: 429 })
    }
    
    return NextResponse.json({ error: 'Échec de la génération. Réessayez.' }, { status: 500 })
  }
}
