'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Trash2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

export default function SettingsPage() {
  const { user, profile, isLoading: authLoading, refreshProfile, signOut } = useAuth()
  const [name, setName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from('users')
        .update({ name } as any)
        .eq('id', user.id)

      if (error) throw error

      await refreshProfile()
      toast({
        title: t('settingsSaved'),
        description: t('profileUpdated'),
      })
    } catch (error) {
      toast({
        title: 'Error',
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
    } catch (error) {
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('settingsTitle')}</h1>
        <p className="text-muted-foreground">{t('settingsSubtitle')}</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>{t('profile')}</CardTitle>
            <CardDescription>{t('profileDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input id="email" value={user.email || ''} disabled />
              <p className="text-xs text-muted-foreground">{t('emailCannotChange')}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">{t('name')}</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder={t('yourName')}
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
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

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>{t('account')}</CardTitle>
            <CardDescription>{t('manageAccount')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-1">{t('accountId')}</p>
              <p className="text-sm text-muted-foreground font-mono">{user.id}</p>
            </div>
            <Separator />
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1 text-destructive">{t('dangerZone')}</p>
                <p className="text-sm text-muted-foreground">
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
                  className="max-w-xs"
                />
              </div>
              <Button 
                variant="destructive" 
                size="sm"
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
  )
}
