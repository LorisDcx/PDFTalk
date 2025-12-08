'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Create client once per component mount
  const [supabase] = useState(() => createClient())

  console.log('🔵 AuthProvider RENDER - isLoading:', isLoading, 'user:', !!user, 'profile:', !!profile)

  useEffect(() => {
    let isMounted = true
    console.log('🟡 AuthProvider useEffect running')

    const fetchProfile = async (userId: string) => {
      console.log('🟢 fetchProfile START for:', userId)
      
      // Add timeout to prevent infinite hang (3s is reasonable for DB query)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      )
      
      try {
        const queryPromise = supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()
        
        const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any
        
        console.log('🟢 fetchProfile RESULT:', { data: !!data, error: error?.message, isMounted })
        
        if (error) {
          console.error('❌ fetchProfile error:', error)
          return
        }
        
        if (data && isMounted) {
          setProfile(data)
        }
      } catch (error: any) {
        console.error('❌ fetchProfile CATCH:', error?.message || error)
        // Continue anyway - don't block the app
      }
    }

    // Use onAuthStateChange as the single source of truth
    // It fires immediately with current session, then on any changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🟣 onAuthStateChange:', event, { hasSession: !!session, isMounted })
        
        if (!isMounted) {
          console.log('🟠 Skipping - not mounted')
          return
        }
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          console.log('🟢 Has user, fetching profile...')
          await fetchProfile(session.user.id)
        } else {
          console.log('🔴 No user, clearing profile')
          setProfile(null)
        }
        
        console.log('✅ Setting isLoading to false')
        setIsLoading(false)
      }
    )
    
    // Trigger initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔵 Initial getSession:', { hasSession: !!session })
      // onAuthStateChange will handle the state update
    })

    return () => {
      console.log('🔴 AuthProvider CLEANUP')
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  const refreshProfile = async () => {
    if (user) {
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error refreshing profile:', error)
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
