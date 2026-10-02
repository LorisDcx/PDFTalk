'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { LearningWorkspace } from '@/components/learning-workspace'
import { useLanguage } from '@/lib/i18n'
import { learningCopy } from '@/lib/learning-copy'
import { createClient } from '@/lib/supabase/client'

function LearnContent() {
  const { user, isLoading } = useAuth()
  const { language } = useLanguage()
  const copy = learningCopy[language === 'fr' ? 'fr' : 'en']
  const router = useRouter()
  const query = useSearchParams()
  const requestedDocument = query.get('document')
  const [documents, setDocuments] = useState<{ id: string; file_name: string }[]>([])
  const [loadingDocuments, setLoadingDocuments] = useState(true)
  const [documentsError, setDocumentsError] = useState(false)
  const [sourceMode, setSourceMode] = useState<'topic' | 'pdf'>(requestedDocument ? 'pdf' : 'topic')
  const [selectedDocument, setSelectedDocument] = useState(requestedDocument || '')
  const [supabase] = useState(() => createClient())

  const loadDocuments = useCallback(async (signal?: AbortSignal) => {
    if (!user) return
    setLoadingDocuments(true)
    setDocumentsError(false)
    let request = supabase.from('documents').select('id, file_name').eq('user_id', user.id).eq('status', 'completed').order('created_at', { ascending: false })
    if (signal) request = request.abortSignal(signal)
    try {
      const { data, error } = await request
      if (signal?.aborted) return
      if (error) setDocumentsError(true)
      else setDocuments(data || [])
    } catch { if (!signal?.aborted) setDocumentsError(true) }
    finally { if (!signal?.aborted) setLoadingDocuments(false) }
  }, [supabase, user])
  useEffect(() => {
    if (!isLoading && !user) router.replace('/login?redirect=/apprendre')
  }, [isLoading, router, user])
  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => { if (!controller.signal.aborted) void loadDocuments(controller.signal) })
    return () => controller.abort()
  }, [loadDocuments])

  if (isLoading || !user) return <div role="status" className="flex min-h-[60vh] items-center justify-center gap-2"><Loader2 className="size-6 animate-spin" /><span suppressHydrationWarning>{copy.loading}</span></div>
  const document = documents.find(item => item.id === selectedDocument)
  return <div className="min-h-[calc(100vh-4rem)] bg-[var(--cd-paper)] px-4 py-8 text-[var(--cd-ink)] sm:px-8 sm:py-12">
    <div className="w-full space-y-8">
      <header className="max-w-3xl"><h1 className="font-editorial text-4xl sm:text-5xl">{copy.title}</h1><p className="mt-4 text-base leading-7 text-[var(--cd-muted)]">{copy.description}</p></header>
      <section className="space-y-4 border-y border-[var(--cd-line)] py-6" aria-label={copy.source}>
        <fieldset className="flex flex-wrap gap-4"><legend className="mb-3 text-base font-semibold">{copy.source}</legend>{(['topic', 'pdf'] as const).map(mode => <label key={mode} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[var(--cd-line)] bg-white px-4 py-3 text-base"><input type="radio" name="learning-source" checked={sourceMode === mode} onChange={() => setSourceMode(mode)} className="size-4 accent-[var(--cd-brand)]" />{mode === 'topic' ? copy.subject : copy.pdf}</label>)}</fieldset>
        {sourceMode === 'pdf' && <>
          {loadingDocuments ? <p role="status" className="flex items-center gap-2 text-base"><Loader2 className="size-5 animate-spin" />{copy.loading}</p> : documentsError ? <div role="alert"><p className="text-base text-red-900">{copy.documentsError}</p><button type="button" onClick={() => void loadDocuments()} className="mt-2 min-h-11 font-semibold text-[var(--cd-brand)] underline">{copy.retry}</button></div> : documents.length ? <label className="block max-w-2xl text-base font-semibold">{copy.choose}<select value={selectedDocument} onChange={event => setSelectedDocument(event.target.value)} className="mt-2 block min-h-11 w-full rounded-xl border border-[var(--cd-line)] bg-white px-3 py-3 text-base"><option value="">{copy.choose}</option>{documents.map(item => <option key={item.id} value={item.id}>{item.file_name}</option>)}</select></label> : <p className="text-base text-[var(--cd-muted)]">{copy.noDocuments}</p>}
          {!loadingDocuments && !documentsError && requestedDocument && selectedDocument === requestedDocument && !document && <p role="alert" className="text-base text-red-900">{copy.unavailable}</p>}
          <Link href="/documents" className="inline-flex min-h-11 items-center text-base font-semibold text-[var(--cd-brand)] underline underline-offset-4">{copy.upload}</Link>
        </>}
      </section>
      {(sourceMode === 'topic' || (document && !documentsError && !loadingDocuments)) && <LearningWorkspace key={`${user.id}:${sourceMode === 'pdf' ? document?.id : 'topic'}:${language}`} userId={user.id} documentId={sourceMode === 'pdf' ? document?.id : null} documentName={sourceMode === 'pdf' ? document?.file_name : undefined} />}
    </div>
  </div>
}

export default function LearnPage() {
  return <Suspense><LearnContent /></Suspense>
}
