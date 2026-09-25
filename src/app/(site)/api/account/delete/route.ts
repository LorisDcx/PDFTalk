import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { stripe } from '@/lib/stripe'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    const admin = createAdminClient()

    const { data: profile } = await admin.from('users')
      .select('subscription_id').eq('id', userId).single()
    if (profile?.subscription_id) {
      await stripe.subscriptions.cancel(profile.subscription_id)
    }

    // Delete user's documents from storage
    const { data: documents } = await admin
      .from('documents')
      .select('file_path')
      .eq('user_id', userId)

    if (documents && documents.length > 0) {
      const filePaths = documents.map(d => d.file_path).filter(Boolean)
      if (filePaths.length > 0) {
        const { error: storageError } = await admin.storage
          .from('documents')
          .remove(filePaths)
        if (storageError) throw storageError
      }
    }

    const { error: analyticsError } = await admin.from('analytics_events')
      .delete().eq('user_id', userId)
    if (analyticsError) throw analyticsError

    // The auth delete cascades to profile, documents, summaries and flashcards.
    const { error: deleteAuthError } = await admin.auth.admin.deleteUser(userId)
    if (deleteAuthError) throw deleteAuthError

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
