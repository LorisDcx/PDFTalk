'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { User } from '@/types/database'

interface AuthContextType {
  user: SupabaseUser | null
  profile: User | null
  session: Session | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    let mounted = true
    const applySession = (nextSession: Session | null) => {
      if (!mounted) return
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
      setIsLoading(false)
    }

    // Keep database requests outside the auth callback so token refresh cannot stall.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => applySession(nextSession)
    )
    supabase.auth.getSession()
      .then(({ data }) => applySession(data.session))
      .catch(error => {
        console.error('Failed to restore session:', error)
        if (mounted) setIsLoading(false)
      })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    let mounted = true
    supabase.from('users').select('*').eq('id', user.id).single()
      .then(({ data, error }) => {
        if (error) console.error('Failed to load profile:', error)
        if (mounted) setProfile(data as User | null)
      })

    return () => { mounted = false }
  }, [supabase, user?.id])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (!user) return
    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()
    if (error) throw error
    setProfile(data as User)
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
