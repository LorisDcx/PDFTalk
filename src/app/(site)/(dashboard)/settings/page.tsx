'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { CreditCard, Loader2, ShieldAlert, Trash2, UserRound } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { isTrialExpired } from '@/lib/utils'

export default function SettingsPage() {
  const { user, profile, isLoading: authLoading, refreshProfile, signOut } = useAuth()
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const [supabase] = useState(() => createClient())
  const profileName = profile?.name

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    let active = true
    queueMicrotask(() => { if (active) setName(profileName || '') })
    return () => { active = false }
  }, [profileName])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      toast({
        title: t('settingsSaved'),
        description: t('profileUpdated'),
      })
    } catch {
      toast({
        title: t('error'),
        description: t('uploadError'),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!user || deleteConfirmation !== 'DELETE') return
    setIsDeleting(true)

    try {
      // Call API to delete account (documents, user data, auth)
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete account')
      }

      toast({
        title: t('accountDeleted'),
        description: t('accountDeletedDesc'),
      })

      // Sign out and redirect to home
      await signOut()
      router.push('/')
    } catch {
      toast({
        title: t('error'),
        description: t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fffaf5]">
        <Loader2 className="size-8 animate-spin text-[#b84432]" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fffaf5] px-4 py-8 text-[#33252b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
      <div className="mb-9">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#b45438]">{t('account')}</p>
        <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">{t('settingsTitle')}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#776d78]">{t('settingsSubtitle')}</p>
      </div>

      <div className="space-y-5">
        {/* Profile */}
        <Card className="rounded-[1.4rem] border-[#ead9cf] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-editorial flex items-center gap-3 text-2xl"><UserRound className="size-5 text-[#b45438]" />{t('profile')}</CardTitle>
            <CardDescription>{t('profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" value={user.email || ''} disabled className="bg-[#f8f5f7]" />
              <p className="text-xs text-muted-foreground">{t('emailCannotChange')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder={t('yourName')}
                className="border-[#ead9cf]"
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving || name.trim() === (profile?.name || '').trim()} className="min-h-11 bg-[#b84432] text-white hover:bg-[#963326]">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('saving')}
                </>
              ) : (
                t('saveChanges')
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Account and subscription */}
        <Card className="rounded-[1.4rem] border-[#ead9cf] bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="font-editorial flex items-center gap-3 text-2xl"><CreditCard className="size-5 text-[#b45438]" />{t('billing')}</CardTitle>
            <CardDescription>{t('manageAccount')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#efdcd0] bg-[#fff5ed] p-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.14em] text-[#866c80]">{t('currentPlan')}</p>
                <p className="mt-1 font-medium text-[#3c2c3b]">{profile?.subscription_status === 'active' ? profile.current_plan?.toUpperCase() || t('currentPlan') : profile?.subscription_status === 'trialing' ? (isTrialExpired(profile.trial_end_at) ? t('trialExpired') : t('trial')) : t('manageSubscription')}</p>
              </div>
              <Button asChild variant="outline" className="border-[#e4c4b6] bg-white text-[#b84432] hover:bg-[#f4eaf1]"><Link href="/billing">{t('manageSubscription')}</Link></Button>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">{t('accountId')}</p>
              <p className="break-all font-mono text-xs text-muted-foreground">{user.id}</p>
            </div>
          </CardContent>
        </Card>

        {/* Destructive action kept separate from routine settings */}
        <Card className="rounded-[1.4rem] border-[#efd9d6] bg-[#fffaf9] shadow-none">
          <CardHeader>
            <CardTitle className="font-editorial flex items-center gap-3 text-2xl text-[#8c413d]"><ShieldAlert className="size-5" />{t('dangerZone')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm leading-6 text-[#776d78]">
                  {t('deleteAccountConfirm')}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="delete-confirm" className="text-sm">
                  {t('typeDeleteToConfirm')}
                </Label>
                <Input
                  id="delete-confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="max-w-xs border-[#e4cac7] bg-white"
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                className="min-h-10"
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmation !== 'DELETE'}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('deleting')}
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('deleteMyAccount')}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}
