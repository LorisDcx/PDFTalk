'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  AlertCircle, ArrowLeft, BookOpenText, Check, CheckCircle2, Clock3, Copy,
  ChevronLeft, ChevronRight, ExternalLink, Eye, FileText, GripVertical,
  Layers3, ListChecks, Loader2, Menu, MessageCircle,
  PanelLeftClose, PanelLeftOpen, RotateCcw, X,
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useAuth } from '@/components/auth-provider'
import { DocumentSidebar } from '@/components/document-sidebar'
import { Flashcards } from '@/components/flashcards'
import { PDFChat } from '@/components/pdf-chat'
import { LearningWorkspace } from '@/components/learning-workspace'
import { learnLabels, learningCopy } from '@/lib/learning-copy'
import { Quiz } from '@/components/quiz'
import { Slides } from '@/components/slides'
import { TranslateButton } from '@/components/translate-button'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { cleanSummaryItem } from '@/lib/study-language'
import type { Document, DocumentDigest, Summary } from '@/types/database'

type WorkspaceView = 'summary' | 'review' | 'tools' | 'chat' | 'learn'
type FlashcardItem = { id: string; question: string; answer: string; sourceRef?: string }

const pdfLabels = {
  fr: { study: 'Espace de travail', pdf: 'Document PDF', close: 'Fermer le PDF', previous: 'Page précédente', next: 'Page suivante', page: 'Page', of: 'sur', open: 'Ouvrir dans un onglet', resize: 'Redimensionner le panneau PDF', unavailable: 'Impossible de charger ce PDF. Réessaie sans perdre ton travail.', retry: 'Réessayer', views: 'Choisir une vue' },
  en: { study: 'Workspace', pdf: 'PDF document', close: 'Close PDF', previous: 'Previous page', next: 'Next page', page: 'Page', of: 'of', open: 'Open in a new tab', resize: 'Resize PDF panel', unavailable: 'Could not load this PDF. Try again without losing your work.', retry: 'Try again', views: 'Choose a view' },
  es: { study: 'Espacio de trabajo', pdf: 'Documento PDF', close: 'Cerrar PDF', previous: 'Página anterior', next: 'Página siguiente', page: 'Página', of: 'de', open: 'Abrir en otra pestaña', resize: 'Cambiar tamaño del panel PDF', unavailable: 'No se pudo cargar el PDF. Vuelve a intentarlo sin perder tu trabajo.', retry: 'Reintentar', views: 'Elegir una vista' },
  de: { study: 'Arbeitsbereich', pdf: 'PDF-Dokument', close: 'PDF schließen', previous: 'Vorherige Seite', next: 'Nächste Seite', page: 'Seite', of: 'von', open: 'In neuem Tab öffnen', resize: 'PDF-Bereich vergrößern', unavailable: 'Das PDF konnte nicht geladen werden. Versuche es erneut, ohne deine Arbeit zu verlieren.', retry: 'Erneut versuchen', views: 'Ansicht auswählen' },
  it: { study: 'Area di lavoro', pdf: 'Documento PDF', close: 'Chiudi PDF', previous: 'Pagina precedente', next: 'Pagina successiva', page: 'Pagina', of: 'di', open: 'Apri in una nuova scheda', resize: 'Ridimensiona il pannello PDF', unavailable: 'Impossibile caricare il PDF. Riprova senza perdere il tuo lavoro.', retry: 'Riprova', views: 'Scegli una vista' },
  pt: { study: 'Área de trabalho', pdf: 'Documento PDF', close: 'Fechar PDF', previous: 'Página anterior', next: 'Próxima página', page: 'Página', of: 'de', open: 'Abrir em outra aba', resize: 'Redimensionar painel PDF', unavailable: 'Não foi possível carregar o PDF. Tente novamente sem perder seu trabalho.', retry: 'Tentar novamente', views: 'Escolher visualização' },
  zh: { study: '学习空间', pdf: 'PDF 文档', close: '关闭 PDF', previous: '上一页', next: '下一页', page: '第', of: '页，共', open: '在新标签页打开', resize: '调整 PDF 面板大小', unavailable: '无法加载此 PDF。请重试，你的工作不会丢失。', retry: '重试', views: '选择视图' },
  ja: { study: '学習スペース', pdf: 'PDF 文書', close: 'PDF を閉じる', previous: '前のページ', next: '次のページ', page: 'ページ', of: '/', open: '新しいタブで開く', resize: 'PDF パネルの幅を変更', unavailable: 'PDF を読み込めませんでした。作業内容はそのままに再試行できます。', retry: '再試行', views: '表示を選択' },
  ar: { study: 'مساحة العمل', pdf: 'مستند PDF', close: 'إغلاق PDF', previous: 'الصفحة السابقة', next: 'الصفحة التالية', page: 'الصفحة', of: 'من', open: 'فتح في تبويب جديد', resize: 'تغيير حجم لوحة PDF', unavailable: 'تعذر تحميل ملف PDF. أعد المحاولة دون فقدان عملك.', retry: 'إعادة المحاولة', views: 'اختيار طريقة العرض' },
} as const

export default function DocumentPage() {
  const { id: documentId } = useParams<{ id: string }>()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const userId = user?.id
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const [supabase] = useState(() => createClient())
  const [document, setDocument] = useState<Document | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [digest, setDigest] = useState<DocumentDigest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [activeView, setActiveView] = useState<WorkspaceView>('summary')
  const [regenerating, setRegenerating] = useState(false)
  const [regenerationError, setRegenerationError] = useState<'access' | 'service' | null>(null)
  const [openCardsQuiz, setOpenCardsQuiz] = useState(false)
  const [desktopLibraryOpen, setDesktopLibraryOpen] = useState(false)
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false)
  const [pdfVisible, setPdfVisible] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfError, setPdfError] = useState(false)
  const [pdfPage, setPdfPage] = useState(1)
  const [pdfPaneWidth, setPdfPaneWidth] = useState(600)
  const [workspaceWidth, setWorkspaceWidth] = useState(960)
  const [mobilePane, setMobilePane] = useState<'study' | 'pdf'>('study')
  const [resizingPdf, setResizingPdf] = useState(false)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const pdfSignedAt = useRef(0)
  const pdfSignedFor = useRef<string | null>(null)
  const [retrying, setRetrying] = useState(false)
  const [translatedSummary, setTranslatedSummary] = useState<string[] | null>(null)
  const [translatedReview, setTranslatedReview] = useState<string | null>(null)
  const [translatedEasyReading, setTranslatedEasyReading] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([])
  const initialSourceOpened = useRef(false)

  useEffect(() => {
    const stored = Number(window.localStorage.getItem('cramdesk-pdf-panel-width'))
    if (Number.isFinite(stored) && stored >= 320 && stored <= 1200) queueMicrotask(() => setPdfPaneWidth(stored))
  }, [])

  useEffect(() => {
    if (!pdfVisible || !workspaceRef.current) return
    const observer = new ResizeObserver(entries => setWorkspaceWidth(entries[0].contentRect.width))
    observer.observe(workspaceRef.current)
    return () => observer.disconnect()
  }, [pdfVisible])

  const updatePdfWidth = (width: number) => {
    const available = workspaceRef.current?.getBoundingClientRect().width || window.innerWidth
    const next = Math.round(Math.min(Math.max(width, 320), Math.max(320, available - 360)))
    setPdfPaneWidth(next)
    window.localStorage.setItem('cramdesk-pdf-panel-width', String(next))
  }

  const loadDocument = useCallback(async () => {
    if (!userId || !documentId) return
    const { data: doc, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single() as { data: Document | null; error: unknown }

    if (error || !doc) {
      setLoadError(true)
      setIsLoading(false)
      return
    }

    setDocument(doc)
    setLoadError(false)
    if (doc.status === 'completed') {
      const { data } = await supabase
        .from('summaries')
        .select('*')
        .eq('document_id', doc.id)
        .single() as { data: Summary | null; error: unknown }
      if (data) {
        setSummary(data)
        setDigest({
          documentType: doc.document_type || 'Document',
          summary: data.summary as string[],
          keyClauses: data.key_clauses as DocumentDigest['keyClauses'],
          risks: data.risks as DocumentDigest['risks'],
          questions: data.questions as string[],
          actions: data.actions as DocumentDigest['actions'],
        })
      }
    }
    setIsLoading(false)
  }, [documentId, supabase, userId])

  useEffect(() => {
    if (!authLoading && !userId) router.replace('/login')
  }, [authLoading, router, userId])

  useEffect(() => {
    if (!userId) return
    let active = true
    queueMicrotask(() => { if (active) void loadDocument() })
    return () => { active = false }
  }, [loadDocument, userId])

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('view') === 'tools') {
      queueMicrotask(() => setActiveView('tools'))
      if (query.get('quiz') === 'cards') queueMicrotask(() => setOpenCardsQuiz(true))
    }
    if (query.get('view') === 'learn') queueMicrotask(() => setActiveView('learn'))
  }, [])

  // The processing page actually checks for completion; the timer stops on unmount
  // or as soon as the status changes.
  useEffect(() => {
    if (document?.status !== 'processing' || !userId) return
    let checking = false
    const interval = window.setInterval(async () => {
      if (checking) return
      checking = true
      try {
        const { data } = await supabase
          .from('documents')
          .select('status')
          .eq('id', documentId)
          .eq('user_id', userId)
          .single()
        if (data?.status && data.status !== 'processing') await loadDocument()
      } finally {
        checking = false
      }
    }, 5000)
    return () => window.clearInterval(interval)
  }, [document?.status, documentId, loadDocument, supabase, userId])

  const openPdf = useCallback(async (page?: number) => {
    if (!document) return
    setPdfVisible(true)
    setMobilePane('pdf')
    setPdfError(false)
    if (page && Number.isInteger(page) && page > 0) setPdfPage(Math.min(page, Math.max(document.pages_count || page, 1)))
    else if (pdfSignedFor.current !== document.id) setPdfPage(1)
    if (pdfUrl && pdfSignedFor.current === document.id && Date.now() - pdfSignedAt.current < 50 * 60 * 1000) return
    setPdfLoading(true)
    setPdfUrl(null)
    pdfSignedFor.current = null
    try {
      const { data, error } = await supabase.storage.from('documents').createSignedUrl(document.file_path, 3600)
      if (error || !data?.signedUrl) throw error || new Error('PDF unavailable')
      setPdfUrl(data.signedUrl)
      pdfSignedAt.current = Date.now()
      pdfSignedFor.current = document.id
    } catch {
      setPdfError(true)
    } finally {
      setPdfLoading(false)
    }
  }, [document, pdfUrl, supabase])

  useEffect(() => {
    if (!document || initialSourceOpened.current) return
    const page = Number(new URLSearchParams(window.location.search).get('page'))
    if (!Number.isInteger(page) || page < 1) return
    initialSourceOpened.current = true
    queueMicrotask(() => void openPdf(page))
  }, [document, openPdf])

  const togglePdf = async () => {
    if (pdfVisible) { setPdfVisible(false); return }
    await openPdf()
  }

  const copyText = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({ title: t('copied') })
    } catch {
      toast({ title: t('error'), description: t('unexpectedError'), variant: 'destructive' })
    }
  }

  const regenerateNotes = async () => {
    if (!document || regenerating) return
    setRegenerating(true)
    setRegenerationError(null)
    try {
      const response = await fetch(`/api/documents/${document.id}/regenerate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      })
      const result = await response.json().catch(() => ({}))
      if (response.status === 403 && result.code === 'access_expired') {
        setRegenerationError('access')
        return
      }
      if (!response.ok || !result.digest || typeof result.easyReading !== 'string') throw new Error(result.error || t('unexpectedError'))
      const updatedDigest = result.digest as DocumentDigest
      setDigest(updatedDigest)
      setSummary(previous => previous ? {
        ...previous,
        summary: updatedDigest.summary,
        key_clauses: updatedDigest.keyClauses,
        risks: updatedDigest.risks,
        questions: updatedDigest.questions,
        actions: updatedDigest.actions,
        easy_reading: result.easyReading,
      } : previous)
      setDocument(previous => previous ? { ...previous, document_type: updatedDigest.documentType } : previous)
      setTranslatedSummary(null)
      setTranslatedEasyReading(null)
      setTranslatedReview(null)
      toast({ title: t('studyNotesUpdated') })
    } catch (error) {
      console.error('Study notes regeneration failed:', error)
      setRegenerationError('service')
    } finally {
      setRegenerating(false)
    }
  }

  const retryAnalysis = async () => {
    if (!document || retrying) return
    setRetrying(true)
    try {
      const response = await fetch('/api/process-document', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: document.id, filePath: document.file_path, fileName: document.file_name, language }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(result.error || t('unexpectedError'))
      await loadDocument()
      toast({ title: t('documentUploaded'), description: language === 'fr' ? 'Ton document est prêt à réviser.' : 'Your document is ready to study.' })
    } catch (error) {
      toast({ title: t('error'), description: error instanceof Error ? error.message : t('unexpectedError'), variant: 'destructive' })
      await loadDocument()
    } finally { setRetrying(false) }
  }

  if (authLoading || isLoading || !userId) {
    return <div className="flex min-h-[60vh] items-center justify-center bg-[#f8f5f0]">
      <Loader2 className="size-7 animate-spin text-[#673b58]" aria-label={t('processing')} />
    </div>
  }

  if (loadError || !document) {
    return <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 bg-[#f8f5f0] px-6 text-center text-[#291c2b]">
      <FileText className="size-10 text-[#9b8493]" />
      <h1 className="font-editorial text-3xl">{t('notAvailable')}</h1>
      <Button asChild variant="outline"><Link href="/documents">{t('myDocuments')}</Link></Button>
    </div>
  }

  const views: { id: WorkspaceView; label: string; icon: typeof BookOpenText }[] = [
    { id: 'summary', label: t('summary'), icon: BookOpenText },
    { id: 'learn', label: learnLabels[language], icon: BookOpenText },
    { id: 'review', label: t('risks'), icon: ListChecks },
    { id: 'tools', label: t('studyTools'), icon: Layers3 },
    { id: 'chat', label: t('chatTitle'), icon: MessageCircle },
  ]
  const documentContent = summary?.source_text || summary?.easy_reading || digest?.summary.join('\n') || ''
  const pdfCopy = pdfLabels[language]
  const pdfSourceUrl = pdfUrl ? `${pdfUrl}#page=${pdfPage}&toolbar=1&navpanes=0` : null

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#faf8f5] text-[#291c2b] lg:flex">
      {desktopLibraryOpen && <aside className="hidden w-72 shrink-0 border-r border-[#e8dedb] lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-4rem)]">
        <DocumentSidebar currentDocumentId={document.id} />
      </aside>}

      <Sheet open={mobileLibraryOpen} onOpenChange={setMobileLibraryOpen}>
        <SheetContent side="left" className="w-[min(88vw,340px)] border-[#e8dedb] bg-[#f8f5f0] p-0 lg:hidden">
          <SheetHeader className="sr-only"><SheetTitle>{t('myDocuments')}</SheetTitle></SheetHeader>
          <DocumentSidebar currentDocumentId={document.id} onSelect={() => setMobileLibraryOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <header className="border-b border-[#e8dedb] bg-white px-4 py-5 sm:px-8 sm:py-6">
          <div className="w-full">
            <div className="mb-4 flex items-center gap-2 text-sm text-[#786d72]">
              <button type="button" className="rounded-lg p-2 text-[#5d4256] hover:bg-[#f0e8e9] lg:hidden" onClick={() => setMobileLibraryOpen(true)} aria-label={t('myDocuments')}>
                <Menu className="size-5" />
              </button>
              <button type="button" className="hidden rounded-lg p-2 text-[#5d4256] hover:bg-[#f0e8e9] lg:inline-flex" onClick={() => setDesktopLibraryOpen(value => !value)} aria-label={t('myDocuments')}>
                {desktopLibraryOpen ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
              </button>
              <Link href="/documents" className="inline-flex items-center gap-1.5 transition hover:text-[#b84432]"><ArrowLeft className="size-3.5" />{t('myDocuments')}</Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <h1 className="max-w-[min(720px,78vw)] truncate font-editorial text-2xl leading-tight text-[#35282d] sm:text-3xl" title={document.file_name}>{document.file_name.replace(/\.pdf$/i, '')}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#786a73]">
                  <span>{document.pages_count} pages</span>
                  <span>{formatDate(document.created_at)}</span>
                  {document.document_type && <span>· {document.document_type}</span>}
                </div>
              </div>
              <Button type="button" variant="outline" className="gap-2 border-[#e3d9d2] bg-white text-[#51414a] hover:bg-[#fff3eb]" onClick={togglePdf} disabled={pdfLoading}>
                {pdfLoading ? <Loader2 className="size-4 animate-spin" /> : pdfVisible ? <X className="size-4" /> : <Eye className="size-4" />}
                {pdfVisible ? pdfCopy.close : t('viewPdf')}
              </Button>
            </div>
          </div>
        </header>

        {document.status === 'processing' ? (
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#eee1e9] text-[#673b58]"><Loader2 className="size-7 animate-spin" /></div>
            <h2 className="font-editorial text-3xl">{t('processing')}</h2>
            <p className="mt-3 text-[#756772]">{t('aiAnalyzing')}</p>
          </div>
        ) : document.status === 'failed' ? (
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#f7e6e2] text-[#a0443d]"><AlertCircle className="size-7" /></div>
            <h2 className="font-editorial text-3xl">{t('error')}</h2>
            <p className="mt-3 text-[#756772]">{t('unexpectedError')}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button onClick={() => void retryAnalysis()} disabled={retrying} className="bg-[#b84432] text-white">{retrying && <Loader2 className="mr-2 size-4 animate-spin" />}{language === 'fr' ? 'Relancer l’analyse' : 'Retry analysis'}</Button>
              <Button asChild variant="outline"><Link href="/dashboard"><ArrowLeft className="mr-2 size-4" />{t('dashboard')}</Link></Button>
            </div>
          </div>
        ) : !digest ? (
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <h2 className="font-editorial text-3xl">{t('notAvailable')}</h2>
            <Button variant="outline" className="mt-6" onClick={() => void loadDocument()}>{t('back')}</Button>
          </div>
        ) : (
          <>
          <div className={pdfVisible ? 'border-b border-[var(--cd-line)] px-4 py-2 md:hidden' : 'hidden'}>
            <div className="flex rounded-xl bg-[#eee9e4] p-1" role="group" aria-label={pdfCopy.views}>
              <button type="button" onClick={() => setMobilePane('study')} aria-pressed={mobilePane === 'study'} className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold ${mobilePane === 'study' ? 'bg-white text-[var(--cd-ink)] shadow-sm' : 'text-[var(--cd-muted)]'}`}>{pdfCopy.study}</button>
              <button type="button" onClick={() => setMobilePane('pdf')} aria-pressed={mobilePane === 'pdf'} className={`min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold ${mobilePane === 'pdf' ? 'bg-white text-[var(--cd-ink)] shadow-sm' : 'text-[var(--cd-muted)]'}`}>{pdfCopy.pdf}</button>
            </div>
          </div>
          <div ref={workspaceRef} className={pdfVisible ? 'flex w-full min-w-0 items-start' : 'w-full min-w-0'} style={{ '--document-pdf-width': `${pdfPaneWidth}px` } as React.CSSProperties}>
            <div className={`${pdfVisible ? (mobilePane === 'pdf' ? 'hidden md:block' : 'block') : 'block'} min-w-0 flex-1 px-4 pb-14 sm:px-8`}>
            <nav aria-label={t('documentAnalysis')} className="flex gap-1 overflow-x-auto border-b border-[#e8dedb]">
              {views.map(view => <button
                key={view.id}
                type="button"
                aria-current={activeView === view.id ? 'page' : undefined}
                onClick={() => setActiveView(view.id)}
                className={`group relative flex min-h-14 shrink-0 items-center gap-2 px-3 text-sm font-semibold transition-colors sm:px-4 ${activeView === view.id ? 'text-[#b84432]' : 'text-[#82787b] hover:text-[#3c2938]'}`}
              >
                <view.icon className="size-4" />
                {view.label}
                {activeView === view.id && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#b84432]" />}
              </button>)}
            </nav>

            <div className="pt-6">
              <div className="min-w-0">
                {activeView === 'summary' && <div className="space-y-6">
                  {summary?.source_text?.includes('[PARTIAL EXCERPTS') && <p role="status" className="rounded-xl border border-[#e6c9b5] bg-[#fff3e9] p-4 text-base leading-6 text-[#643f32]">{language === 'fr' ? 'Ce document est long : la synthèse utilise des extraits de chaque page. Vérifie les passages importants dans le PDF et pose des questions ciblées.' : 'This document is long: the summary uses excerpts from every page. Check important passages in the PDF and ask focused questions.'}</p>}
                  {summary?.source_text?.includes('[[SOURCE_GAPS]]') && <p role="status" className="rounded-xl border border-[#e6c9b5] bg-[#fff3e9] p-4 text-base leading-6 text-[#643f32]">{language === 'fr' ? 'Certaines pages semblent contenir des images ou des scans : leur texte peut manquer dans cette analyse.' : 'Some pages appear to contain images or scans, so their text may be missing from this analysis.'}</p>}
                  {regenerationError && <p role="alert" className="rounded-xl border border-[#e8c9bd] bg-[#fff6f1] p-4 text-base leading-6 text-[#863c2c]">{regenerationError === 'access' ? t('accessExpired') : t('regenerateStudyNotesError')}</p>}
                  <section className="rounded-2xl border border-[#e9dfda] bg-white p-5 sm:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#eee6e0] pb-5">
                      <div>
                        <h2 className="font-editorial text-2xl text-[#2c1d2b] sm:text-3xl">{t('atGlance')}</h2>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#776b73]">{t('summaryDesc')}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <TranslateButton content={digest.summary.join('\n\n')} onTranslate={text => setTranslatedSummary(text.split('\n\n').filter(Boolean))} />
                        <Button type="button" size="icon" variant="ghost" aria-label={t('copySummary')} onClick={() => void copyText((translatedSummary || digest.summary).join('\n'))}><Copy className="size-4" /></Button>
                      </div>
                    </div>
                    {(translatedSummary || digest.summary).length > 0 && <div className="max-w-3xl">
                      <p className="font-editorial text-[clamp(1.4rem,3vw,2rem)] leading-snug text-[#35282d]">{cleanSummaryItem((translatedSummary || digest.summary)[0])}</p>
                    </div>}
                    {(translatedSummary || digest.summary).length > 1 && <div className="mt-8 border-t border-[#eee6e0] pt-7">
                      <h3 className="text-base font-bold text-[#3d3033]">{t('keyIdeas')}</h3>
                      <ol className="mt-3 divide-y divide-[#f0eae5]">
                        {(translatedSummary || digest.summary).slice(1).map((point, index) => <li key={index} className="flex gap-4 py-4 first:pt-2 last:pb-0">
                          <span className="w-6 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-[#b84432]">{String(index + 1).padStart(2, '0')}</span>
                          <p className="text-base leading-7 text-[#483a47]">{cleanSummaryItem(point)}</p>
                        </li>)}
                      </ol>
                    </div>}
                    <div className="mt-7 border-t border-[#eee6e0] pt-4">
                      <Button type="button" variant="ghost" className="min-h-11 gap-2 px-2 text-sm text-[var(--cd-muted)] hover:text-[var(--cd-brand)]" onClick={() => void regenerateNotes()} disabled={regenerating}>
                        {regenerating ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}{regenerating ? t('regeneratingStudyNotes') : t('regenerateStudyNotes')}
                      </Button>
                    </div>
                  </section>

                  <section className="rounded-[1.4rem] border border-[#e9dfda] bg-white p-5 sm:p-8">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div><h2 className="font-editorial text-2xl sm:text-3xl">{t('easyReading')}</h2><p className="mt-1 text-sm text-[var(--cd-muted)]">{t('easyReadingDesc')}</p></div>
                      {summary?.easy_reading && <TranslateButton content={summary.easy_reading} onTranslate={setTranslatedEasyReading} />}
                    </div>
                    {summary?.easy_reading ? <div className="study-chat-answer max-w-3xl text-base leading-8 text-[#4f4050]"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { trust: false, strict: 'ignore', throwOnError: false }]]}>{translatedEasyReading || summary.easy_reading}</ReactMarkdown></div> : <p className="text-base leading-7 text-[var(--cd-muted)]">{t('easyReadingEmpty')}</p>}
                  </section>
                  {digest.keyClauses?.length > 0 && <details className="group rounded-2xl border border-[var(--cd-line)] bg-white">
                    <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-[var(--cd-ink)] sm:px-8">
                      <span className="inline-flex items-center gap-3"><BookOpenText className="size-5 text-[var(--cd-brand)]" />{t('keyClauses')}</span><ChevronRight className="size-5 shrink-0 text-[var(--cd-muted)] transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="border-t border-[var(--cd-line)] px-5 pb-6 sm:px-8">
                      <div className="divide-y divide-[#eee7e3]">
                        {digest.keyClauses.map((concept, index) => <article key={index} className="py-5 first:pt-5 last:pb-0">
                          <h3 className="text-base font-bold text-[#40293a]">{concept.title}</h3>
                          <p className="mt-2 max-w-3xl text-base leading-7 text-[#635961]">{concept.description}</p>
                          {concept.sourceQuote && <button type="button" onClick={() => void openPdf(concept.sourcePage)} className="mt-4 block min-h-11 max-w-3xl border-l-2 border-[#d7ac99] pl-4 text-left text-sm leading-6 text-[#72666a] hover:text-[#a44331] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b84432]"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#a44331]">{language === 'fr' ? 'Extrait du document' : 'From the document'}{concept.sourcePage ? ` · page ${concept.sourcePage}` : ''}</span>“{concept.sourceQuote}”</button>}
                        </article>)}
                      </div>
                      <button type="button" onClick={() => void openPdf()} className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#a44331] hover:underline"><Eye className="size-4" />{language === 'fr' ? 'Vérifier dans le PDF' : 'Check the PDF'}</button>
                    </div>
                  </details>}
                </div>}

                {activeView === 'review' && <div className="space-y-6">
                  <section className="rounded-[1.4rem] border border-[#e9dfda] bg-[#fffefd] p-6 sm:p-9">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                      <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#8e5973]">{t('documentAnalysis')}</p><h2 className="font-editorial text-3xl sm:text-4xl">{t('risksIdentified')}</h2></div>
                      <TranslateButton content={[...digest.risks.map(item => `${item.title}: ${item.description}`), ...digest.questions].join('\n\n')} onTranslate={setTranslatedReview} />
                    </div>
                    {translatedReview ? <div className="space-y-4"><Button size="sm" variant="outline" onClick={() => setTranslatedReview(null)}>{t('showOriginal')}</Button><p className="whitespace-pre-wrap leading-7 text-[#4f4050]">{translatedReview}</p></div> : digest.risks.length ? <div className={`grid gap-3 ${pdfVisible ? '' : 'sm:grid-cols-2'}`}>
                      {digest.risks.map((point, index) => <article key={index} className="rounded-xl border border-[#eee7e3] bg-[#fbf9f6] p-5">
                        <div className="mb-2 flex items-center gap-2"><CheckCircle2 className="size-4 text-[#87516f]" /><h3 className="font-semibold">{point.title}</h3></div>
                        <p className="text-sm leading-6 text-[#746873]">{point.description}</p>
                      </article>)}
                    </div> : <p className="text-sm text-[#746873]">{t('noRisks')}</p>}
                  </section>

                  <section className="rounded-[1.4rem] border border-[#e9dfda] bg-[#fffefd] p-6 sm:p-9">
                    <div className="mb-6 flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl bg-[#e6ece6] text-[#496d53]"><ListChecks className="size-4" /></div><h2 className="font-editorial text-2xl sm:text-3xl">{t('questionsToAsk')}</h2></div>
                    {digest.questions.length ? <ol className="space-y-3">{digest.questions.map((question, index) => <li key={index} className="flex gap-4 rounded-xl bg-[#f9f6f2] p-4 text-sm leading-6"><span className="font-editorial text-xl text-[#a4718e]">{index + 1}.</span>{question}</li>)}</ol> : <p className="text-sm text-[#746873]">{t('noQuestions')}</p>}
                  </section>

                  {!!digest.actions?.length && <section className="rounded-[1.4rem] border border-[#e9dfda] bg-[#fffefd] p-6 sm:p-9">
                    <div className="mb-6 flex items-center gap-3"><Clock3 className="size-5 text-[#87516f]" /><h2 className="font-editorial text-2xl sm:text-3xl">{t('suggestedActions')}</h2></div>
                    <ul className="space-y-3">{digest.actions.map((action, index) => <li key={index} className="flex items-start gap-3 text-sm leading-6 text-[#4f4050]"><Check className="mt-1 size-4 shrink-0 text-[#68856d]" />{action.action}</li>)}</ul>
                  </section>}
                </div>}

                {activeView === 'tools' && <section className="py-2">
                  <h2 className="font-editorial text-2xl sm:text-3xl">{t('studyTools')}</h2>
                  <p className="mt-1 text-sm text-[#776b73]">{t('studyToolsDesc')}</p>
                  <div className={`mt-6 grid gap-4 ${pdfVisible ? '' : 'md:grid-cols-2'}`}>
                    <Flashcards documentId={document.id} onFlashcardsChange={setFlashcards} />
                    <section className="rounded-2xl border border-[var(--cd-line)] bg-white p-5 sm:p-6" aria-labelledby="document-quiz-title"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[var(--cd-brand)]"><ListChecks className="size-5" /></span><div><h3 id="document-quiz-title" className="font-editorial text-2xl text-[var(--cd-ink)]">{t('quizMode')}</h3><p className="mt-1 text-base leading-6 text-[var(--cd-muted)]">{t('quizModeDesc')}</p></div></div><div className="mt-5"><Quiz documentId={document.id} flashcards={flashcards} openFromCards={openCardsQuiz} onAutoOpen={() => setOpenCardsQuiz(false)} /></div></section>
                    <section className="rounded-2xl border border-[var(--cd-line)] bg-white p-5 sm:p-6" aria-labelledby="document-slides-title"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[var(--cd-brand)]"><Layers3 className="size-5" /></span><div><h3 id="document-slides-title" className="font-editorial text-2xl text-[var(--cd-ink)]">{t('slides')}</h3><p className="mt-1 text-base leading-6 text-[var(--cd-muted)]">{t('slidesDesc')}</p></div></div><div className="mt-5"><Slides documentId={document.id} documentContent={documentContent} documentName={document.file_name} /></div></section>
                  </div>
                </section>}

                {activeView === 'learn' && <section className="space-y-4">
                  <h2 className="font-editorial text-3xl">{learnLabels[language]}</h2>
                  <p className="text-base leading-7 text-[var(--cd-muted)]">{learningCopy[language === 'fr' ? 'fr' : 'en'].description}</p>
                  <LearningWorkspace key={`${userId}:${document.id}:${language}`} userId={userId} documentId={document.id} documentName={document.file_name} onOpenSource={page => void openPdf(page)} />
                </section>}

                {activeView === 'chat' && <section className="space-y-4">
                  <h2 className="font-editorial text-2xl sm:text-3xl">{t('chatTitle')}</h2>
                  <PDFChat documentId={document.id} documentContent={documentContent} documentName={document.file_name} onOpenSource={page => void openPdf(page)} />
                </section>}
              </div>

            </div>
            </div>
            {pdfVisible && <aside aria-label={pdfCopy.pdf} className={`${mobilePane === 'study' ? 'hidden md:flex' : 'flex'} document-pdf-pane relative min-w-0 flex-col border-l border-[var(--cd-line)] bg-white md:sticky md:top-16 md:h-[calc(100dvh-4rem)]`}>
              <div
                role="separator"
                aria-label={pdfCopy.resize}
                aria-orientation="vertical"
                aria-valuemin={320}
                aria-valuemax={Math.max(320, Math.round(workspaceWidth - 360))}
                aria-valuenow={Math.min(pdfPaneWidth, Math.max(320, Math.round(workspaceWidth - 360)))}
                tabIndex={0}
                className="absolute -left-[22px] top-0 z-10 hidden h-full w-11 cursor-col-resize touch-none items-center justify-center focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)] md:flex"
                onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); setResizingPdf(true) }}
                onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) updatePdfWidth((workspaceRef.current?.getBoundingClientRect().right || window.innerWidth) - event.clientX) }}
                onPointerUp={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); setResizingPdf(false) }}
                onPointerCancel={() => setResizingPdf(false)}
                onKeyDown={event => {
                  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); updatePdfWidth(pdfPaneWidth + (event.key === 'ArrowLeft' ? 32 : -32)) }
                  if (event.key === 'Home') { event.preventDefault(); updatePdfWidth(320) }
                  if (event.key === 'End') { event.preventDefault(); updatePdfWidth(1200) }
                }}
              ><span className="rounded-full border border-[var(--cd-line)] bg-white p-0.5 text-[var(--cd-muted)] shadow-sm"><GripVertical className="size-4" /></span></div>
              <div className="flex min-h-14 items-center gap-2 border-b border-[var(--cd-line)] px-3 sm:px-4">
                <FileText className="size-4 shrink-0 text-[var(--cd-brand)]" aria-hidden="true" />
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[var(--cd-ink)]" title={document.file_name}>{document.file_name}</span>
                {pdfSourceUrl && <a href={pdfSourceUrl} target="_blank" rel="noopener noreferrer" aria-label={pdfCopy.open} title={pdfCopy.open} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[var(--cd-muted)] hover:bg-[var(--cd-paper)] focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)]"><ExternalLink className="size-4" /></a>}
                <button type="button" onClick={() => setPdfVisible(false)} aria-label={pdfCopy.close} title={pdfCopy.close} className="flex size-11 shrink-0 items-center justify-center rounded-lg text-[var(--cd-muted)] hover:bg-[var(--cd-paper)] focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)]"><X className="size-4" /></button>
              </div>
              <div className="flex min-h-14 items-center justify-center gap-2 border-b border-[var(--cd-line)] px-3" role="group" aria-label={pdfCopy.page}>
                <button type="button" onClick={() => setPdfPage(value => Math.max(1, value - 1))} disabled={pdfPage <= 1 || !pdfUrl} aria-label={pdfCopy.previous} className="flex size-11 items-center justify-center rounded-lg hover:bg-[var(--cd-paper)] focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)] disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                <label className="flex items-center gap-2 text-sm text-[var(--cd-muted)]">{pdfCopy.page}<input key={pdfPage} type="number" min={1} max={Math.max(document.pages_count || 1, 1)} defaultValue={pdfPage} onKeyDown={event => { if (event.key === 'Enter') event.currentTarget.blur() }} onBlur={event => { const value = Number(event.currentTarget.value); if (Number.isInteger(value) && value >= 1 && value <= Math.max(document.pages_count || 1, 1)) setPdfPage(value); else event.currentTarget.value = String(pdfPage) }} className="h-9 w-14 rounded-lg border border-[var(--cd-line)] bg-white text-center font-semibold tabular-nums text-[var(--cd-ink)] focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)]" />{pdfCopy.of} {document.pages_count || 1}</label>
                <button type="button" onClick={() => setPdfPage(value => Math.min(Math.max(document.pages_count || 1, 1), value + 1))} disabled={pdfPage >= Math.max(document.pages_count || 1, 1) || !pdfUrl} aria-label={pdfCopy.next} className="flex size-11 items-center justify-center rounded-lg hover:bg-[var(--cd-paper)] focus-visible:outline-2 focus-visible:outline-[var(--cd-brand)] disabled:opacity-40"><ChevronRight className="size-4" /></button>
              </div>
              {pdfLoading ? <div role="status" className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center text-[var(--cd-muted)]"><Loader2 className="size-6 animate-spin text-[var(--cd-brand)]" /><span>{t('processing')}</span></div>
                : pdfError ? <div role="alert" className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center"><AlertCircle className="size-7 text-[var(--cd-brand)]" /><p className="max-w-sm text-base leading-6 text-[var(--cd-ink)]">{pdfCopy.unavailable}</p><Button variant="outline" onClick={() => { pdfSignedAt.current = 0; void openPdf(pdfPage) }}>{pdfCopy.retry}</Button></div>
                  : pdfSourceUrl ? <iframe src={pdfSourceUrl} title={pdfCopy.pdf} className={`min-h-0 w-full flex-1 border-0 bg-white ${resizingPdf ? 'pointer-events-none' : ''}`} /> : null}
            </aside>}
          </div>
          </>
        )}
      </div>
    </div>
  )
}
