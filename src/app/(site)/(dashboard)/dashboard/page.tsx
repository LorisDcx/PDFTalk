'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { FileUpload } from '@/components/file-upload'
import { DocumentCard } from '@/components/document-card'
import { UsageCard } from '@/components/usage-card'
import { useToast } from '@/components/ui/use-toast'
import { isSameUtcDay, isTrialExpired } from '@/lib/utils'
import { getPlanLimits } from '@/lib/plans'
import { createClient } from '@/lib/supabase/client'
import type { Document } from '@/types/database'
import { ArrowRight, FileText, AlertCircle, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import { clearPendingDocument, loadPendingDocument } from '@/lib/pending-document'

interface DocumentWithSummary extends Document {
  summaryPreview?: string
}

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading, refreshProfile } = useAuth()
  const [documents, setDocuments] = useState<DocumentWithSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadService, setUploadService] = useState<'checking' | 'ready' | 'unavailable'>('checking')
  const router = useRouter()
  const { toast } = useToast()
  const { t, language } = useLanguage()

  // Create supabase client once per component mount
  const [supabase] = useState(() => createClient())

  // Track if initial load has happened
  const hasLoadedRef = useRef(false)
  const pendingUploadStartedRef = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user?.id) return
    const controller = new AbortController()
    fetch('/api/usage-readiness', { cache: 'no-store', signal: controller.signal })
      .then(response => {
        if (!controller.signal.aborted) setUploadService(response.ok || response.status === 403 ? 'ready' : 'unavailable')
      })
      .catch(() => {
        if (!controller.signal.aborted) setUploadService('unavailable')
      })
    return () => controller.abort()
  }, [user?.id])

  // Single useEffect for initial data load - runs only once per user
  useEffect(() => {
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

    }

    loadData()
  }, [user, supabase, toast])

  const handleUpload = async (file: File) => {
    if (!profile) return

    // Check trial/subscription status
    const hasAccess = profile.subscription_status === 'active' ||
      (profile.subscription_status === 'trialing' && profile.trial_end_at && !isTrialExpired(profile.trial_end_at))

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
    const isTrial = profile.subscription_status === 'trialing'
    const trialUsage = isSameUtcDay(profile.trial_usage_reset_at)
      ? profile.trial_pages_processed_today : 0
    if (isTrial ? trialUsage >= 200 : profile.pages_processed_this_month >= planLimits.pagesPerMonth) {
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
      const readinessResponse = await fetch('/api/usage-readiness', { cache: 'no-store' })
      if (!readinessResponse.ok) {
        const readiness = await readinessResponse.json().catch(() => ({}))
        throw new Error(readiness.error || 'Le traitement est temporairement indisponible. Réessaie plus tard.')
      }

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
      try { await refreshProfile() } catch (error) { console.error('Profile refresh failed:', error) }

      // Navigate to document view
      if (sessionStorage.getItem('processPendingDocument')) {
        try { await clearPendingDocument() } catch (error) { console.error('Pending PDF cleanup failed:', error) }
        sessionStorage.removeItem('processPendingDocument')
        sessionStorage.removeItem('pendingDocument')
      }
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

  useEffect(() => {
    if (!profile || !user || pendingUploadStartedRef.current) return
    if (!sessionStorage.getItem('processPendingDocument')) return
    pendingUploadStartedRef.current = true
    loadPendingDocument()
      .then(file => {
        if (file) return handleUpload(file)
        sessionStorage.removeItem('processPendingDocument')
      })
      .catch(error => console.error('Pending PDF recovery failed:', error))
  }, [profile, user])

  const canUpload = () => {
    if (!profile) return false
    const hasAccess = profile.subscription_status === 'active' ||
      (profile.subscription_status === 'trialing' && profile.trial_end_at && !isTrialExpired(profile.trial_end_at))
    if (!hasAccess) return false

    const planLimits = getPlanLimits(profile.current_plan)
    if (profile.subscription_status === 'trialing') {
      const usedToday = isSameUtcDay(profile.trial_usage_reset_at)
        ? profile.trial_pages_processed_today : 0
      return usedToday < 200
    }
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
      <div className="min-h-screen bg-[#faf7f5] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse">
          <Skeleton className="mb-3 h-3 w-24 rounded-full" />
          <Skeleton className="h-12 w-64 rounded-xl" />
          <Skeleton className="mt-4 h-5 w-80 max-w-full rounded-lg" />
          <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
            <Skeleton className="h-[340px] rounded-[28px]" />
            <Skeleton className="h-[340px] rounded-[28px]" />
          </div>
          <Skeleton className="mt-12 h-8 w-52 rounded-lg" />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Skeleton className="h-48 rounded-[24px]" />
            <Skeleton className="h-48 rounded-[24px]" />
          </div>
        </div>
      </div>
    )
  }

  const showTrialExpired = profile && profile.subscription_status === 'trialing' && isTrialExpired(profile.trial_end_at)

  return (
    <div className="min-h-screen bg-[#faf7f5] px-4 pb-20 pt-9 text-[#33252b] sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#bc6b50]">{t('dashboard')}</p>
            <h1 className="font-editorial text-4xl leading-[1.08] tracking-tight sm:text-5xl">{t('dashboardTitle')}</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#756a74] sm:text-base">{t('analyzeDocuments')}</p>
          </div>
          <Link href="/documents" className="inline-flex w-fit items-center gap-2 rounded-full border border-[#e5dbe1] bg-white px-4 py-2.5 text-sm font-medium text-[#b84432] transition-colors hover:border-[#bfa8b8] hover:bg-[#f7eff4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]">
            {t('myDocuments')} <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </header>

        {showTrialExpired && (
          <div role="alert" className="mb-6 flex flex-col gap-4 rounded-[22px] border border-[#edc5c0] bg-[#fff2f0] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#a44d48]" aria-hidden="true" />
              <div>
                <p className="font-semibold text-[#853b36]">{t('trialExpiredMsg')}</p>
                <p className="mt-0.5 text-sm text-[#81605f]">{t('upgradeToUnlock')}</p>
              </div>
            </div>
            <Button asChild className="shrink-0"><Link href="/billing">{t('upgradePlan')}</Link></Button>
          </div>
        )}

        {uploadService === 'unavailable' && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-[#e6c9b5] bg-[#fff3e9] px-5 py-4 text-[#643f32]">
            <AlertCircle className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-semibold">{language === 'fr' ? 'Traitement des PDF indisponible' : 'PDF processing unavailable'}</p>
              <p className="mt-1 text-sm leading-6">{language === 'fr' ? 'Le service rencontre un problème temporaire. Aucun quota ne sera débité ; réessaie plus tard.' : 'The service is temporarily unavailable. No pages will be charged; please try again later.'}</p>
            </div>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
          <section id="upload-panel" aria-labelledby="upload-title" className="rounded-[28px] border border-[#e9e0e5] bg-white p-5 shadow-[0_24px_60px_-50px_rgba(43,34,48,0.4)] sm:p-7">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#f4eaf0] text-[#b84432]">
                <UploadCloud className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h2 id="upload-title" className="font-editorial text-[1.65rem] leading-tight">{t('uploadDocument')}</h2>
                <p className="mt-1 text-sm text-[#786d77]">{t('uploadFirstPdf')}</p>
              </div>
            </div>
            <div className="[&>div>div]:border-[#e3cbbf] [&>div>div]:bg-[#fcfafb] [&>div>div]:p-7 sm:[&>div>div]:p-10">
              <FileUpload onUpload={handleUpload} disabled={!canUpload() || isUploading || uploadService !== 'ready'} />
            </div>
            {uploadService === 'checking' && <p role="status" className="mt-3 text-sm text-[#756a74]">{language === 'fr' ? 'Vérification du service…' : 'Checking service…'}</p>}
          </section>
          <UsageCard />
        </div>

        <section aria-labelledby="documents-title" className="mt-12 sm:mt-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#bc6b50]">{t('documents')}</p>
              <h2 id="documents-title" className="font-editorial text-3xl leading-tight sm:text-[2.2rem]">{t('recentDocuments')}</h2>
            </div>
            {documents.length > 0 && (
              <Link href="/documents" className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-[#b84432] transition-colors hover:text-[#412039] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]">
                {t('viewAll')} <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2" aria-label={t('recentDocuments')}>
              <Skeleton className="h-[194px] rounded-[24px]" />
              <Skeleton className="h-[194px] rounded-[24px]" />
            </div>
          ) : documents.length === 0 ? (
            <div className="flex flex-col items-center rounded-[28px] border border-dashed border-[#e3cbbf] bg-white px-5 py-14 text-center">
              <span className="mb-5 flex size-16 items-center justify-center rounded-[22px] bg-[#f3eaf0] text-[#b84432]">
                <FileText className="size-7" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="font-editorial text-2xl text-[#33252b]">{t('noDocuments')}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#786d77]">{t('uploadFirstPdf')}</p>
              <a href="#upload-panel" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b84432] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#512b46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-2">
                {t('uploadDocument')} <ArrowRight className="size-4" aria-hidden="true" />
              </a>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {documents.map(doc => (
                <DocumentCard key={doc.id} document={doc} summaryPreview={doc.summaryPreview} onDelete={handleDeleteDocument} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
