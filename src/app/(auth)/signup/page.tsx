'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { FileText, Loader2, CheckCircle, Sparkles } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'

interface PendingDocument {
  name: string
  size: number
  type: string
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [pendingDoc, setPendingDoc] = useState<PendingDocument | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { t } = useLanguage()
  const supabase = createClient()
  const isDemo = searchParams.get('demo') === 'true'

  useEffect(() => {
    // Check for pending document from demo
    if (isDemo && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('pendingDocument')
      if (stored) {
        setPendingDoc(JSON.parse(stored))
      }
    }
  }, [isDemo])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const emailRedirectTo = typeof window !== 'undefined'
        ? `${window.location.origin}/auth/callback`
        : undefined

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          ...(emailRedirectTo ? { emailRedirectTo } : {}),
          data: {
            name,
          },
        },
      })

      if (authError) {
        toast({
          title: t('signupFailed'),
          description: authError.message,
          variant: 'destructive',
        })
        return
      }

      if (authData.user) {
        // Create user profile with 7-day trial
        const trialEndAt = new Date()
        trialEndAt.setDate(trialEndAt.getDate() + 7)

        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email: authData.user.email!,
          name,
          trial_end_at: trialEndAt.toISOString(),
          subscription_status: 'trialing',
        } as any)

        if (profileError) {
          console.error('Profile creation error:', profileError)
        }

        // Track signup event
        await supabase.from('analytics_events').insert({
          user_id: authData.user.id,
          event_type: 'signup',
          event_data: { source: 'web' },
        } as any)
      }

      toast({
        title: t('accountCreated'),
        description: pendingDoc 
          ? t('documentWillBeAnalyzed')
          : t('trialStarted'),
      })

      // If there's a pending document, redirect to dashboard with flag
      if (pendingDoc) {
        sessionStorage.setItem('processPendingDocument', 'true')
      }
      
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      toast({
        title: t('error'),
        description: t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-b from-background to-secondary/20">
      <div className="w-full max-w-md">
        {/* Pending document banner */}
        {pendingDoc && (
          <div className="mb-4 p-4 rounded-xl bg-primary/10 border border-primary/20 animate-fade-in-down">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary">{t('documentReadyToAnalyze')}</p>
                <p className="text-xs text-muted-foreground truncate">{pendingDoc.name}</p>
              </div>
              <span className="text-xs text-muted-foreground">{formatFileSize(pendingDoc.size)}</span>
            </div>
          </div>
        )}
        
        <Card className="animate-fade-in-up">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <FileText className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Cramdesk</span>
            </Link>
            <CardTitle>{pendingDoc ? t('createYourAccount') : t('freeTrial')}</CardTitle>
            <CardDescription>
              {pendingDoc 
                ? t('signupToSeeAnalysis')
                : t('trialDescription')}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignup}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('yourName')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">{t('minCharacters')}</p>
              </div>

              <div className="rounded-lg bg-primary/5 p-4 space-y-2">
                <p className="text-sm font-medium">{t('trialIncludes')}</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {t('trialFeature1')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {t('trialFeature2')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {t('trialFeature3')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {t('trialFeature4')}
                  </li>
                </ul>
              </div>

              {/* Terms acceptance checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  required
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground">
                  {t('acceptTermsPrefix')}{' '}
                  <Link href="/terms" className="text-primary hover:underline" target="_blank">
                    {t('termsOfService')}
                  </Link>{' '}
                  {t('and')}{' '}
                  <Link href="/privacy" className="text-primary hover:underline" target="_blank">
                    {t('privacyPolicy')}
                  </Link>
                </label>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('creating')}
                  </>
                ) : pendingDoc ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('createAndAnalyze')}
                  </>
                ) : (
                  t('createMyAccount')
                )}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                {t('alreadyHaveAccount')}{' '}
                <Link href="/login" className="text-primary hover:underline">
                  {t('signIn')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
