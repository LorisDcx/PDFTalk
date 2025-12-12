import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id

    // Delete user's documents from storage
    const { data: documents } = await supabase
      .from('documents')
      .select('file_path')
      .eq('user_id', userId)

    if (documents && documents.length > 0) {
      const filePaths = documents.map(d => d.file_path).filter(Boolean)
      if (filePaths.length > 0) {
        await supabase.storage
          .from('documents')
          .remove(filePaths)
      }
    }

    // Delete related data (summaries will cascade from documents)
    // Delete documents
    await supabase
      .from('documents')
      .delete()
      .eq('user_id', userId)

    // Delete analytics events
    await supabase
      .from('analytics_events')
      .delete()
      .eq('user_id', userId)

    // Delete user profile
    await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    // Delete auth user (requires service role key)
    // We need to use admin client for this
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError)
      // Continue anyway - data is already deleted
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
  }
}
