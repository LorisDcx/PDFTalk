'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  AlertCircle, ArrowLeft, BookOpenText, Check, CheckCircle2, Clock3, Copy,
  Eye, FileText, Layers3, ListChecks, Loader2, Menu, MessageCircle,
  PanelLeftClose, PanelLeftOpen, X,
} from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { DocumentSidebar } from '@/components/document-sidebar'
import { Flashcards } from '@/components/flashcards'
import { PDFChat } from '@/components/pdf-chat'
import { Quiz } from '@/components/quiz'
import { Slides } from '@/components/slides'
import { TranslateButton } from '@/components/translate-button'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/use-toast'
import { useLanguage } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import type { Document, DocumentDigest, Summary } from '@/types/database'

type WorkspaceView = 'summary' | 'review' | 'tools' | 'chat'
type FlashcardItem = { id: string; question: string; answer: string; sourceRef?: string }

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
  const [desktopLibraryOpen, setDesktopLibraryOpen] = useState(false)
  const [mobileLibraryOpen, setMobileLibraryOpen] = useState(false)
  const [pdfVisible, setPdfVisible] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [translatedSummary, setTranslatedSummary] = useState<string[] | null>(null)
  const [translatedReview, setTranslatedReview] = useState<string | null>(null)
  const [translatedEasyReading, setTranslatedEasyReading] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([])

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

  const togglePdf = async () => {
    if (pdfVisible) {
      setPdfVisible(false)
      return
    }
    if (!document) return
    setPdfLoading(true)
    try {
      const { data, error } = await supabase.storage.from('documents').createSignedUrl(document.file_path, 3600)
      if (error || !data?.signedUrl) throw error || new Error('PDF unavailable')
      setPdfUrl(data.signedUrl)
      setPdfVisible(true)
    } catch {
      toast({ title: t('error'), description: t('notAvailable'), variant: 'destructive' })
    } finally {
      setPdfLoading(false)
    }
  }

  const copyText = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast({ title: t('copied') })
    } catch {
      toast({ title: t('error'), description: t('unexpectedError'), variant: 'destructive' })
    }
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
    { id: 'review', label: t('risks'), icon: ListChecks },
    { id: 'tools', label: t('studyTools'), icon: Layers3 },
    { id: 'chat', label: t('chatTitle'), icon: MessageCircle },
  ]
  const documentContent = summary?.source_text || summary?.easy_reading || digest?.summary.join('\n') || ''

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
          <div className="mx-auto max-w-[1060px]">
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
                {pdfVisible ? t('back') : t('viewPdf')}
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
            <Button asChild className="mt-7 bg-[#62364f] text-white"><Link href="/dashboard"><ArrowLeft className="mr-2 size-4" />{t('dashboard')}</Link></Button>
          </div>
        ) : !digest ? (
          <div className="mx-auto max-w-3xl px-5 py-20 text-center">
            <h2 className="font-editorial text-3xl">{t('notAvailable')}</h2>
            <Button variant="outline" className="mt-6" onClick={() => void loadDocument()}>{t('back')}</Button>
          </div>
        ) : (
          <div className="mx-auto max-w-[1060px] px-4 pb-14 sm:px-8">
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

            <div className={pdfVisible ? 'grid gap-6 pt-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,42%)]' : 'pt-6'}>
              <div className="min-w-0">
                {activeView === 'summary' && <div className="space-y-5">
                  <section className="rounded-2xl border border-[#e9dfda] bg-white p-5 sm:p-8">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-[#eee6e0] pb-5">
                      <div>
                        <h2 className="font-editorial text-2xl text-[#2c1d2b] sm:text-3xl">{t('summary')}</h2>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-[#776b73]">{t('summaryDesc')}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <TranslateButton content={digest.summary.join('\n\n')} onTranslate={text => setTranslatedSummary(text.split('\n\n').filter(Boolean))} />
                        <Button type="button" size="icon" variant="ghost" aria-label={t('copySummary')} onClick={() => void copyText((translatedSummary || digest.summary).join('\n'))}><Copy className="size-4" /></Button>
                      </div>
                    </div>
                    {(translatedSummary || digest.summary).length > 0 && <div className="max-w-3xl">
                      <p className="text-xs font-bold uppercase tracking-[.15em] text-[#a44331]">{language === 'fr' ? 'En bref' : 'At a glance'}</p>
                      <p className="mt-3 font-editorial text-[clamp(1.4rem,3vw,2rem)] leading-snug text-[#35282d]">{(translatedSummary || digest.summary)[0]}</p>
                    </div>}
                    {(translatedSummary || digest.summary).length > 1 && <div className="mt-8 border-t border-[#eee6e0] pt-7">
                      <h3 className="text-base font-bold text-[#3d3033]">{language === 'fr' ? 'Les idées à retenir' : 'Key ideas'}</h3>
                      <ol className="mt-3 divide-y divide-[#f0eae5]">
                        {(translatedSummary || digest.summary).slice(1).map((point, index) => <li key={index} className="flex gap-4 py-4 first:pt-2 last:pb-0">
                          <span className="w-6 shrink-0 pt-0.5 text-sm font-semibold tabular-nums text-[#b84432]">{String(index + 1).padStart(2, '0')}</span>
                          <p className="text-base leading-7 text-[#483a47]">{point}</p>
                        </li>)}
                      </ol>
                    </div>}
                  </section>

                  {digest.keyClauses?.length > 0 && <section className="rounded-[1.4rem] border border-[#e9dfda] bg-[#fffefd] p-6 sm:p-9">
                    <div className="mb-6 flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-[#eee5ea] text-[#663b57]"><BookOpenText className="size-4" /></div>
                      <h2 className="font-editorial text-2xl sm:text-3xl">{t('keyClauses')}</h2>
                    </div>
                    <div className="divide-y divide-[#eee7e3]">
                      {digest.keyClauses.map((concept, index) => <article key={index} className="py-5 first:pt-0 last:pb-0">
                        <h3 className="text-base font-bold text-[#40293a]">{concept.title}</h3>
                        <p className="mt-2 max-w-3xl text-base leading-7 text-[#635961]">{concept.description}</p>
                        {concept.sourceQuote && <blockquote className="mt-4 max-w-3xl border-l-2 border-[#d7ac99] pl-4 text-sm leading-6 text-[#72666a]"><span className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#a44331]">{language === 'fr' ? 'Extrait du document' : 'From the document'}</span>“{concept.sourceQuote}”</blockquote>}
                      </article>)}
                    </div>
                    <button type="button" onClick={() => void togglePdf()} className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#a44331] hover:underline"><Eye className="size-4" />{language === 'fr' ? 'Vérifier dans le PDF' : 'Check the PDF'}</button>
                  </section>}

                  {summary?.easy_reading && <section className="rounded-[1.4rem] border border-[#e9dfda] bg-[#f2eaf0] p-6 sm:p-9">
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                      <div><p className="mb-1 text-xs font-bold uppercase tracking-[.18em] text-[#80516d]">{t('easyReading')}</p><h2 className="font-editorial text-2xl sm:text-3xl">{t('easyReadingDesc')}</h2></div>
                      <TranslateButton content={summary.easy_reading} onTranslate={setTranslatedEasyReading} />
                    </div>
                    <p className="whitespace-pre-wrap text-sm leading-7 text-[#4f4050]">{translatedEasyReading || summary.easy_reading}</p>
                  </section>}
                </div>}

                {activeView === 'review' && <div className="space-y-6">
                  <section className="rounded-[1.4rem] border border-[#e9dfda] bg-[#fffefd] p-6 sm:p-9">
                    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                      <div><p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-[#8e5973]">{t('documentAnalysis')}</p><h2 className="font-editorial text-3xl sm:text-4xl">{t('risksIdentified')}</h2></div>
                      <TranslateButton content={[...digest.risks.map(item => `${item.title}: ${item.description}`), ...digest.questions].join('\n\n')} onTranslate={setTranslatedReview} />
                    </div>
                    {translatedReview ? <div className="space-y-4"><Button size="sm" variant="outline" onClick={() => setTranslatedReview(null)}>{t('showOriginal')}</Button><p className="whitespace-pre-wrap leading-7 text-[#4f4050]">{translatedReview}</p></div> : digest.risks.length ? <div className="grid gap-3 sm:grid-cols-2">
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

                {activeView === 'tools' && <section className="rounded-2xl border border-[#e9dfda] bg-white p-5 sm:p-8">
                  <h2 className="font-editorial text-2xl sm:text-3xl">{t('studyTools')}</h2>
                  <p className="mt-1 text-sm text-[#776b73]">{t('studyToolsDesc')}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Flashcards documentId={document.id} documentContent={documentContent} documentName={document.file_name} onFlashcardsChange={setFlashcards} />
                    <Quiz documentId={document.id} documentContent={documentContent} documentName={document.file_name} flashcards={flashcards} />
                    <Slides documentId={document.id} documentContent={documentContent} documentName={document.file_name} />
                  </div>
                </section>}

                {activeView === 'chat' && <section className="space-y-4">
                  <h2 className="font-editorial text-2xl sm:text-3xl">{t('chatTitle')}</h2>
                  <PDFChat documentId={document.id} documentContent={documentContent} documentName={document.file_name} />
                </section>}
              </div>

              {pdfVisible && pdfUrl && <aside aria-label={t('viewPdf')} className="fixed inset-x-0 bottom-0 top-16 z-40 flex flex-col border-l border-[#e8dedb] bg-[#f2efeb] shadow-2xl lg:sticky lg:top-24 lg:z-auto lg:h-[calc(100vh-7rem)] lg:rounded-[1.4rem] lg:border lg:shadow-[0_20px_50px_-35px_rgba(48,27,43,.3)]">
                <div className="flex items-center justify-between border-b border-[#e2d8d4] px-4 py-3">
                  <span className="flex min-w-0 items-center gap-2 truncate text-sm font-semibold"><FileText className="size-4 shrink-0 text-[#87516f]" />{document.file_name}</span>
                  <Button type="button" size="icon" variant="ghost" onClick={() => setPdfVisible(false)} aria-label={t('back')}><X className="size-4" /></Button>
                </div>
                <iframe src={`${pdfUrl}#toolbar=1&navpanes=0`} title={t('viewPdf')} className="min-h-0 w-full flex-1 border-0 bg-white" />
              </aside>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
