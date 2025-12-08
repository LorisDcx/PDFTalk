import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { translateText } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get request body
    const { text, targetLanguage } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    // Check user has access (trial or subscription)
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    const now = new Date()
    const trialEnd = profile.trial_end_at ? new Date(profile.trial_end_at) : null
    const hasAccess = profile.subscription_status === 'active' || 
      (trialEnd && trialEnd > now)

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Translate the text
    const translatedText = await translateText(text, targetLanguage || 'fr')

    return NextResponse.json({ translatedText })
  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: error.message || 'Translation failed' },
      { status: 500 }
    )
  }
}
