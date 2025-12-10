'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PDFChat } from '@/components/pdf-chat'
import { Flashcards } from '@/components/flashcards'
import { Slides } from '@/components/slides'
import { Quiz } from '@/components/quiz'
import { DocumentSidebar } from '@/components/document-sidebar'
import { TranslateButton } from '@/components/translate-button'
import { useLanguage } from '@/lib/i18n'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { 
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'
import { 
  Loader2, 
  ArrowLeft, 
  Copy, 
  FileText, 
  AlertTriangle, 
  HelpCircle,
  CheckCircle,
  Clock,
  BookOpen,
  ListChecks,
  MessageSquare,
  Eye,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { Document, Summary, DocumentDigest } from '@/types/database'

export default function DocumentPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [document, setDocument] = useState<Document | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [digest, setDigest] = useState<DocumentDigest | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [translatedSummary, setTranslatedSummary] = useState<string[] | null>(null)
  const [translatedRisks, setTranslatedRisks] = useState<string | null>(null)
  const [translatedEasyReading, setTranslatedEasyReading] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<{ id: string; question: string; answer: string; sourceRef?: string }[]>([])
  const [showPdfViewer, setShowPdfViewer] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const { toast } = useToast()
  const { t, language } = useLanguage()
  const supabase = createClient()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && params.id) {
      fetchDocument()
    }
  }, [user, params.id])

  const fetchDocument = async () => {
    try {
      // Fetch document
      const { data: doc, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user!.id)
        .single() as { data: Document | null, error: any }

      if (docError || !doc) {
        toast({
          title: 'Document not found',
          description: 'The document you are looking for does not exist',
          variant: 'destructive',
        })
        router.push('/dashboard')
        return
      }

      setDocument(doc)

      // Fetch summary if document is completed
      if (doc.status === 'completed') {
        const { data: summaryData } = await supabase
          .from('summaries')
          .select('*')
          .eq('document_id', doc.id)
          .single() as { data: Summary | null, error: any }

        if (summaryData) {
          setSummary(summaryData)
          setDigest({
            documentType: doc.document_type || 'Document',
            summary: summaryData.summary as string[],
            keyClauses: summaryData.key_clauses as any[],
            risks: summaryData.risks as any[],
            questions: summaryData.questions as string[],
            actions: summaryData.actions as any[],
          })
        }
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      toast({
        title: 'Error',
        description: 'Failed to load document',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard',
    })
  }

  const loadPdfUrl = async () => {
    if (!document) return
    try {
      const { data } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 3600) // 1 hour
      
      if (data?.signedUrl) {
        setPdfUrl(data.signedUrl)
        setShowPdfViewer(true)
      }
    } catch (error) {
      console.error('Error loading PDF:', error)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le PDF',
        variant: 'destructive',
      })
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'warning'
      case 'low': return 'secondary'
      default: return 'secondary'
    }
  }

  if (authLoading || isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!document) {
    return null
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Document Sidebar */}
      {showSidebar && (
        <DocumentSidebar currentDocumentId={document.id} />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full py-4 px-4 lg:px-6 xl:px-8">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-semibold leading-snug line-clamp-2">{document.file_name}</h1>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{document.pages_count} pages</span>
                    <span>{formatDate(document.created_at)}</span>
                    {document.document_type && (
                      <Badge variant="outline">{document.document_type}</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {document.status === 'processing' && (
                <Badge variant="warning" className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Processing
                </Badge>
              )}
              {document.status === 'failed' && (
                <Badge variant="destructive">Failed</Badge>
              )}
            </div>
          </div>

      {/* Processing State */}
      {document.status === 'processing' && (
        <Card>
          <CardContent className="py-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analyzing your document...</h2>
            <p className="text-muted-foreground">
              This usually takes 30-60 seconds. The page will refresh automatically.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Failed State */}
      {document.status === 'failed' && (
        <Card className="border-destructive">
          <CardContent className="py-8 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analysis failed</h2>
            <p className="text-muted-foreground mb-4">
              We couldn't analyze this document. This might be due to the PDF format or content.
            </p>
            <Button asChild>
              <Link href="/dashboard">Try another document</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Completed State - Chat First with Secondary Actions */}
      {document.status === 'completed' && digest && (
        <div className="space-y-6">
          {/* Tools Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Primary Tools - Document Analysis */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{t('documentAnalysis')}</CardTitle>
                    <p className="text-xs text-muted-foreground">{t('viewContentAndAnalysis')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {/* View PDF */}
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all"
                    onClick={loadPdfUrl}
                  >
                    <Eye className="h-4 w-4 group-hover:text-primary transition-colors" />
                    {t('viewPdf')}
                  </Button>

                  {/* Summary Sheet */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <FileText className="h-4 w-4 group-hover:text-primary transition-colors" />
                        {t('summary')}
                      </Button>
                    </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
                <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                  <SheetHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <SheetTitle>{t('summary')}</SheetTitle>
                          <SheetDescription>{t('summaryDesc')}</SheetDescription>
                        </div>
                      </div>
                      <TranslateButton 
                        content={digest.summary.join('\n\n')}
                        onTranslate={(text) => setTranslatedSummary(text.split('\n\n').filter(Boolean))}
                      />
                    </div>
                  </SheetHeader>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    {(translatedSummary || digest.summary).map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Key Clauses */}
                  {digest.keyClauses && digest.keyClauses.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">{t('keyClauses')}</h4>
                      <div className="space-y-3">
                        {digest.keyClauses.map((clause, i) => (
                          <div key={i} className="p-4 bg-muted/50 rounded-xl border">
                            <h5 className="font-medium text-sm">{clause.title}</h5>
                            <p className="text-sm text-muted-foreground mt-1">{clause.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {digest.actions && digest.actions.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {t('suggestedActions')}
                      </h4>
                      <div className="space-y-2">
                        {digest.actions.map((action, i) => (
                          <div key={i} className="flex items-center justify-between gap-2 p-3 rounded-xl bg-muted/50 border">
                            <span className="text-sm">{action.action}</span>
                            <Badge variant={getPriorityColor(action.priority) as any} className="text-xs shrink-0">
                              {action.priority}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => copyToClipboard(digest.summary.join('\n'))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('copySummary')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Risks & Questions Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <AlertTriangle className="h-4 w-4 group-hover:text-primary transition-colors" />
                  {t('risks')}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
                <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                  <SheetHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <SheetTitle>{t('risks')}</SheetTitle>
                          <SheetDescription>{t('risksDesc')}</SheetDescription>
                        </div>
                      </div>
                      <TranslateButton 
                        content={[...digest.risks.map(r => `${r.title}: ${r.description}`), ...digest.questions].join('\n\n')}
                        onTranslate={(text) => setTranslatedRisks(text)}
                      />
                    </div>
                  </SheetHeader>
                </div>
                <div className="p-6 space-y-6">
                  {/* Translated Risks (if available) */}
                  {translatedRisks ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">{t('risksIdentified')} & {t('questionsToAsk')}</h4>
                        <Button variant="ghost" size="sm" onClick={() => setTranslatedRisks(null)} className="text-xs">
                          ✕ {t('showOriginal') || 'Original'}
                        </Button>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 border whitespace-pre-wrap text-sm">
                        {translatedRisks}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Risks */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">{t('risksIdentified')}</h4>
                        {digest.risks.length === 0 ? (
                          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400">
                            {t('noRisks')}
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {digest.risks.map((risk, i) => (
                              <div key={i} className="p-4 rounded-xl bg-muted/50 border">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant={getSeverityColor(risk.severity) as any} className="text-xs">
                                    {risk.severity}
                                  </Badge>
                                  <h5 className="font-medium text-sm">{risk.title}</h5>
                                </div>
                                <p className="text-sm text-muted-foreground">{risk.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Questions */}
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide text-muted-foreground">
                          <HelpCircle className="h-4 w-4" />
                          {t('questionsToAsk')}
                        </h4>
                        {digest.questions.length === 0 ? (
                          <p className="text-sm text-muted-foreground">{t('noQuestions')}</p>
                        ) : (
                          <div className="space-y-2">
                            {digest.questions.map((question, i) => (
                              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs shrink-0 font-medium">
                                  {i + 1}
                                </span>
                                <span className="text-sm leading-relaxed">{question}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => copyToClipboard(digest.questions.join('\n'))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('copyQuestions')}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Easy Reading Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <BookOpen className="h-4 w-4 group-hover:text-primary transition-colors" />
                  {t('easyReading')}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
                <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                  <SheetHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <SheetTitle>{t('easyReading')}</SheetTitle>
                          <SheetDescription>{t('easyReadingDesc')}</SheetDescription>
                        </div>
                      </div>
                      {summary?.easy_reading && (
                        <TranslateButton 
                          content={summary.easy_reading}
                          onTranslate={(text) => setTranslatedEasyReading(text)}
                        />
                      )}
                    </div>
                  </SheetHeader>
                </div>
                <div className="p-6">
                  {summary?.easy_reading ? (
                    <>
                      <div className="p-4 rounded-xl bg-muted/50 border">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{translatedEasyReading || summary.easy_reading}</div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => copyToClipboard(summary.easy_reading || '')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {t('copy')}
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/50 border text-sm text-muted-foreground">
                      {t('notAvailable')}
                    </div>
                  )}
                </div>
              </SheetContent>
                </Sheet>
                </div>
              </CardContent>
            </Card>

            {/* Secondary Tools - Study Tools */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-background to-muted/30">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                    <ListChecks className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{t('studyTools')}</CardTitle>
                    <p className="text-xs text-muted-foreground">{t('studyToolsDesc')}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2">
                  {/* Flashcards */}
                  <Flashcards 
                    documentId={document.id}
                    documentContent={summary?.easy_reading || digest.summary.join('\n')}
                    documentName={document.file_name}
                    onFlashcardsChange={setFlashcards}
                  />

                  {/* Quiz */}
                  <Quiz 
                    documentId={document.id}
                    documentContent={summary?.easy_reading || digest.summary.join('\n')}
                    documentName={document.file_name}
                    flashcards={flashcards}
                  />

                  {/* Slides / Presentation */}
                  <Slides 
                    documentId={document.id}
                    documentContent={summary?.easy_reading || digest.summary.join('\n')}
                    documentName={document.file_name}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* PDF Viewer Dialog */}
          {showPdfViewer && pdfUrl && (
            <Dialog open={showPdfViewer} onOpenChange={setShowPdfViewer}>
              <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-primary/10 via-cyan-500/10 to-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg shadow-primary/25">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{document.file_name}</h3>
                      <p className="text-xs text-white/60">{document.pages_count} pages</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-white/10 text-white border-0">
                      PDF
                    </Badge>
                  </div>
                </div>
                {/* PDF Content */}
                <div className="flex-1 h-[calc(90vh-80px)] relative">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
                  <iframe 
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
                    className="w-full h-full border-0"
                    title="PDF Viewer"
                    style={{ background: 'white' }}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Main Chat Interface */}
          <PDFChat 
            documentId={document.id}
            documentContent={summary?.easy_reading || digest.summary.join('\n')}
            documentName={document.file_name}
          />
        </div>
      )}
        </div>
      </div>
    </div>
  )
}
