'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { FileUpload } from '@/components/file-upload'
import { DocumentCard } from '@/components/document-card'
import { UsageCard } from '@/components/usage-card'
import { useToast } from '@/components/ui/use-toast'
import { isTrialExpired } from '@/lib/utils'
import { getPlanLimits } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/client'
import type { Document, Summary } from '@/types/database'
import { Loader2, FileText, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

interface DocumentWithSummary extends Document {
  summaryPreview?: string
}

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth()
  const [documents, setDocuments] = useState<DocumentWithSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  
  // Create supabase client once per component mount
  const [supabase] = useState(() => createClient())
  
  // Track if initial load has happened
  const hasLoadedRef = useRef(false)

  console.log('📄 Dashboard RENDER - authLoading:', authLoading, 'user:', !!user, 'profile:', !!profile, 'isLoading:', isLoading)

  useEffect(() => {
    console.log('📄 Dashboard redirect check - authLoading:', authLoading, 'user:', !!user)
    if (!authLoading && !user) {
      console.log('📄 Dashboard -> redirecting to /login')
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Single useEffect for initial data load - runs only once per user
  useEffect(() => {
    console.log('📄 Dashboard load effect - user:', !!user, 'hasLoaded:', hasLoadedRef.current)
    if (!user || hasLoadedRef.current) return
    
    const loadData = async () => {
      hasLoadedRef.current = true
      
      try {
        // Fetch documents
        const { data: docs, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10) as { data: Document[] | null, error: any }

        if (error) throw error

        // Fetch summaries for completed documents
        const completedDocs = (docs || []).filter(d => d.status === 'completed')
        const summaryPreviews: Record<string, string> = {}

        if (completedDocs.length > 0) {
          const { data: summaries } = await supabase
            .from('summaries')
            .select('document_id, summary')
            .in('document_id', completedDocs.map(d => d.id)) as { data: any[] | null, error: any }

          summaries?.forEach((s: any) => {
            const summaryArray = s.summary as string[]
            if (summaryArray && summaryArray.length > 0) {
              summaryPreviews[s.document_id] = summaryArray[0]
            }
          })
        }

        setDocuments(
          (docs || []).map(doc => ({
            ...doc,
            summaryPreview: summaryPreviews[doc.id],
          }))
        )
      } catch (error) {
        console.error('Error fetching documents:', error)
        toast({
          title: 'Error',
          description: t('uploadError'),
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
      
      // Check for pending document from demo
      if (typeof window !== 'undefined') {
        const shouldProcess = sessionStorage.getItem('processPendingDocument')
        if (shouldProcess) {
          sessionStorage.removeItem('processPendingDocument')
          // Will be handled by handleUpload when user uploads
        }
      }
    }

    loadData()
  }, [user, supabase, toast])

  const handleUpload = async (file: File) => {
    if (!profile) return

    // Check trial/subscription status
    const hasAccess = profile.subscription_status === 'active' || 
      (profile.trial_end_at && !isTrialExpired(profile.trial_end_at))

    if (!hasAccess) {
      toast({
        title: t('accessExpired'),
        description: t('upgradeToUnlock'),
        variant: 'destructive',
      })
      router.push('/billing')
      return
    }

    // Check quota
    const planLimits = getPlanLimits(profile.current_plan)
    if (profile.pages_processed_this_month >= planLimits.pagesPerMonth) {
      toast({
        title: t('monthlyLimitReached'),
        description: t('upgradeToUnlock'),
        variant: 'destructive',
      })
      router.push('/billing')
      return
    }

    setIsUploading(true)

    try {
      // Sanitize name client-side (mirror server rules)
      const sanitizeFileName = (name: string): string => {
        const ext = name.split('.').pop()?.toLowerCase() || 'pdf'
        const baseName = name.replace(/\.[^/.]+$/, '')

        const sanitized = baseName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-zA-Z0-9]/g, '_')
          .replace(/_+/g, '_')
          .replace(/^_|_$/g, '')
          .substring(0, 50)

        return `${sanitized || 'document'}.${ext}`
      }

      const sanitizedName = sanitizeFileName(file.name)
      const filePath = `${profile.id}/${Date.now()}-${sanitizedName}`

      // Upload directly to Supabase Storage (bypasses Vercel 5MB limit)
      const { error: storageError } = await supabase.storage
        .from('documents')
        .upload(filePath, file, { contentType: 'application/pdf' })

      if (storageError) {
        throw new Error(storageError.message || 'Upload failed')
      }

      // Trigger processing via lightweight API (no file payload)
      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filePath,
          fileName: file.name,
          fileSize: file.size,
        }),
      })

      // Some upstream errors return plain text, not JSON.
      let result: any = {}
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        result = await response.json()
      } else {
        const text = await response.text()
        result = { error: text || 'Upload failed' }
      }

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      toast({
        title: t('documentUploaded'),
        description: t('aiAnalyzing'),
      })

      // Refresh profile (for updated usage)
      await refreshProfile()

      // Navigate to document view
      router.push(`/documents/${result.documentId}`)
    } catch (error: any) {
      console.error('Upload error:', error)
      toast({
        title: t('uploadError'),
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const canUpload = () => {
    if (!profile) return false
    const hasAccess = profile.subscription_status === 'active' || 
      (profile.trial_end_at && !isTrialExpired(profile.trial_end_at))
    if (!hasAccess) return false
    
    const planLimits = getPlanLimits(profile.current_plan)
    return profile.pages_processed_this_month < planLimits.pagesPerMonth
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm(t('confirmDelete'))) return
    
    try {
      // Delete from storage first
      const doc = documents.find(d => d.id === documentId)
      if (doc?.file_path) {
        await supabase.storage.from('documents').remove([doc.file_path])
      }
      
      // Delete from database (cascade will delete summaries)
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
      
      if (error) throw error
      
      // Update local state
      setDocuments(docs => docs.filter(d => d.id !== documentId))
      
      toast({
        title: t('documentDeleted'),
        description: t('documentDeletedDesc'),
      })
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: 'Error',
        description: t('uploadError'),
        variant: 'destructive',
      })
    }
  }

  if (authLoading || !user) {
    return (
      <div className="w-full py-8 px-4 lg:px-6 xl:px-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-24 w-full rounded-lg" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  const showTrialExpired = profile && !profile.subscription_status && profile.trial_end_at && isTrialExpired(profile.trial_end_at)

  return (
    <div className="w-full py-8 px-4 lg:px-6 xl:px-8">
      {/* Header with usage inline */}
      <div className="mb-8 animate-fade-in-down">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-primary" />
              {t('dashboardTitle')}
            </h1>
            <p className="text-muted-foreground">{t('analyzeDocuments')}</p>
          </div>
          
          {/* Inline usage display */}
          {profile && (() => {
            const limits = getPlanLimits(profile.current_plan)
            const pagesLimit = limits.pagesPerMonth
            const displayLimit = pagesLimit >= 10000 ? '∞' : pagesLimit
            const divisor = pagesLimit >= 10000 ? 10000 : pagesLimit || 1
            const progress = Math.min((profile.pages_processed_this_month / divisor) * 100, 100)
            return (
            <div className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{t('pagesThisMonth')}</span>
                  <span className="font-semibold text-lg">
                    {profile.pages_processed_this_month} / {displayLimit}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/billing">
                  {profile.subscription_status === 'active' ? t('manage') : t('upgrade')}
                </Link>
              </Button>
            </div>
            )
          })()}
        </div>
      </div>

      {showTrialExpired && (
        <Card className="mb-8 border-destructive bg-destructive/5 animate-fade-in">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive animate-pulse" />
              <div>
                <p className="font-medium text-destructive">{t('trialExpiredMsg')}</p>
                <p className="text-sm text-muted-foreground">{t('upgradeToUnlock')}</p>
              </div>
            </div>
            <Button asChild className="btn-press">
              <Link href="/billing">{t('upgradePlan')}</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Section */}
      <section className="mb-8 animate-fade-in-up">
        <h2 className="text-lg font-semibold mb-4">{t('uploadDocument')}</h2>
        <FileUpload 
          onUpload={handleUpload} 
          disabled={!canUpload() || isUploading}
        />
      </section>

      {/* Documents List */}
      <section className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('recentDocuments')}</h2>
          {documents.length > 0 && (
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents">{t('viewAll')}</Link>
            </Button>
          )}
        </div>
        {isLoading ? (
          <div className="grid gap-3">
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : documents.length === 0 ? (
          <Card className="card-hover">
            <CardContent className="p-12 text-center">
              <div className="animate-float">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              </div>
              <h3 className="font-medium mb-2">{t('noDocuments')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('uploadFirstPdf')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {documents.map((doc, index) => (
              <div 
                key={doc.id} 
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <DocumentCard 
                  document={doc}
                  summaryPreview={doc.summaryPreview}
                  onDelete={handleDeleteDocument}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
