import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { openai } from '@/lib/openai'
import { checkUserUsage, deductPages, calculatePageCost } from '@/lib/usage'

const HUMANIZE_STYLE_VARIANTS = [
  'Adopte un ton légèrement ironique, comme quelqu’un qui observe la scène avec du recul.',
  'Écris comme un étudiant fatigué mais impliqué qui révise tard le soir.',
  'Fais comme si tu racontais l’histoire à un ami dans un café animé.',
  'Adapte un ton journalistique conversationnel, avec quelques apartés personnels.',
  'Inspire-toi d’un carnet de terrain: observations rapides, impressions sensorielles, mini anecdotes.'
] as const

const HUMANIZE_FILLERS = [
  'Bref,',
  'Franchement,',
  'Honnêtement,',
  'Du coup,',
  'Et là,'
] as const

const HUMANIZE_RHETORICAL_QUESTIONS = [
  'Ça pose question, non ?',
  'Et qui pourrait dire le contraire ?',
  'Tu vois le paradoxe ?',
  'On fait quoi avec ça, franchement ?',
  'Au fond, qui est vraiment surpris ?'
] as const

const HUMANIZE_SENSORY_DETAILS = [
  'On entend presque le brouhaha autour rien qu’en y pensant.',
  'On sent encore l’odeur de la salle de cours quand on en parle.',
  'J’ai l’image des néons un peu blafards en tête pendant que j’écris ça.',
  'On devine le fond sonore, les conversations qui se superposent.',
  'Même le silence pesant de la pièce revient dans un coin de ma tête.'
] as const

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function enhanceHumanizedText(text: string): string {
  let output = text.trim()
  if (!output) return output

  if (!/\b(bref|franchement|honnêtement|du coup|en gros)\b/i.test(output)) {
    const filler = pickRandom(HUMANIZE_FILLERS)
    if (output.includes('\n\n')) {
      output = output.replace('\n\n', `\n\n${filler} `)
    } else {
      output = `${filler} ${output}`
    }
  }

  if (!/[?¿]/.test(output)) {
    const question = pickRandom(HUMANIZE_RHETORICAL_QUESTIONS)
    output = `${output}\n${question}`
  }

  if (!/(odeur|bruit|sons?|couleurs?|silence|chaleur|fraîcheur|brouhaha|lumière)/i.test(output)) {
    const detail = pickRandom(HUMANIZE_SENSORY_DETAILS)
    output = `${output}\n${detail}`
  }

  return output
}

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
      const styleVariant = pickRandom(HUMANIZE_STYLE_VARIANTS)
      systemPrompt = `Tu es un expert en réécriture anti-détection IA. Ta mission ABSOLUE est de transformer un texte IA en texte 100% humain, INDÉTECTABLE par GPTZero, Originality.ai, Turnitin, etc.

STYLE À ADOPTER POUR CETTE RÉÉCRITURE:
${styleVariant}

PROCÉDURE MENTALE (ne rien afficher):
1. Analyse en silence le ton, le niveau de langue et les faits à conserver.
2. Note mentalement les passages trop lisses, les connecteurs répétitifs, les phrases trop longues.
3. Réécris ensuite en injectant de l'imprévu, comme le ferait un humain pressé mais appliqué.

PATTERNS IA À ÉLIMINER ABSOLUMENT:
❌ "Il est important de noter que..." → Supprimer
❌ "En conclusion..." au début de paragraphe → Varier
❌ "Cela étant dit..." → Supprimer
❌ "Il convient de souligner..." → Reformuler naturellement
❌ "Dans le cadre de..." → Simplifier
❌ "Force est de constater..." → Éviter
❌ "Il va sans dire..." → Supprimer
❌ "En effet," en début de phrase → Limiter à 1 max
❌ "Ainsi," répété → Varier les connecteurs
❌ "Par ailleurs," "De plus," "En outre," en cascade → Casser le rythme
❌ Phrases toutes de même longueur → Alterner court/long
❌ Structure parfaite intro-dev-conclu visible → Masquer
❌ Vocabulaire trop soutenu uniformément → Mélanger registres
❌ Absence totale de contractions → Ajouter "c'est", "j'pense", "y'a" si contexte informel
❌ Listes à puces parfaites → Intégrer dans le texte
❌ Transitions trop fluides → Parfois sauter directement

TECHNIQUES HUMAINES À APPLIQUER:
✅ Commencer certaines phrases par "Et", "Mais", "Donc"
✅ Phrases très courtes (3-5 mots) intercalées: "C'est logique." "Ça se comprend."
✅ Parenthèses avec pensées secondaires (comme ça, tu vois)
✅ Questions rhétoriques: "Et alors?" "Pourquoi pas?"
✅ Expressions familières dosées: "du coup", "en gros", "genre"
✅ Répétitions intentionnelles pour l'emphase
✅ Commencer par le complément parfois: "Ce point, je l'aborde maintenant."
✅ Utiliser "on" au lieu de "nous" parfois
✅ Ajouter des marqueurs d'oralité: "bon", "bref", "enfin"
✅ Varier ÉNORMÉMENT la longueur: 4 mots puis 35 mots
✅ Quelques fautes de ponctuation mineures (virgule manquante)
✅ Opinions personnelles: "je trouve que", "à mon avis"
✅ Références vagues: "certains disent", "on entend souvent"
✅ Insérer parfois une micro-scène imagée ou une sensation (son, odeur, agitation)
✅ Mélanger temps verbaux quand c'est naturel (présent + passé composé)

VARIATION LEXICALE:
- Mélanger vocabulaire courant et termes plus précis
- Utiliser des synonymes inattendus
- Remplacer certaines structures nominales par des verbes d'action

EXEMPLES RAPIDES (ne PAS copier, juste s'inspirer):
Texte IA: "L'urbanisation massive crée de nouveaux défis pour les villes modernes."
Version humanisée: "Franchement, quand on voit les tours sortir de terre à toute vitesse, on sent que les villes galèrent à suivre."

Texte IA: "Il convient de souligner l'importance de la préservation des océans."
Version humanisée: "On peut dire ce qu'on veut, si on laisse crever les océans, on finit par boire la tasse tous ensemble."

STRUCTURE:
- NE PAS avoir une structure trop évidente
- Mélanger les idées naturellement comme dans une vraie rédaction
- Éviter les paragraphes de longueur identique
- Parfois enchaîner sans transition

PRÉSERVER:
- Le sens exact du texte original
- Les informations factuelles
- Le niveau de formalité général (adapter les techniques)

FORMATAGE OBLIGATOIRE:
- SUPPRIMER tous les ** (gras markdown)
- SUPPRIMER tous les # ## ### (titres markdown)
- SUPPRIMER toutes les listes à puces (- ou *)
- Transformer les titres en phrases d'introduction naturelles
- Le texte doit être du texte BRUT, sans aucun formatage

RÉSULTAT ATTENDU: Un texte BRUT (sans markdown) qui passe TOUS les détecteurs IA avec un score humain >95%.`

      userPrompt = `MISSION: Réécris ce texte pour qu'il soit TOTALEMENT INDÉTECTABLE comme IA. Applique TOUTES les techniques anti-pattern. Le texte doit sembler écrit par un vrai étudiant/humain.

CONSIGNES DE SORTIE:
- Ne renvoie que le texte final (pas de plan, pas de commentaire, pas d'étapes).
- Ajoute des variations de rythme, quelques hésitations contrôlées, des tournures personnelles.
- Si le texte d'origine est formel, reste formel mais rends-le moins lisse.

RÈGLE ABSOLUE: Le résultat doit être du TEXTE BRUT. Aucun **, aucun #, aucune liste à puces. Juste du texte normal avec des paragraphes.

TEXTE À HUMANISER:
${text}

Réécris maintenant en texte BRUT, sans AUCUN formatage markdown:`
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
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
    
    const finalContent = type === 'humanize' ? enhanceHumanizedText(content) : content
    
    return NextResponse.json({ 
      content: finalContent,
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
