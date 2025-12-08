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
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
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
  MessageSquare
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
  const { toast } = useToast()
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
    <div className="container max-w-5xl py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FileText className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{document.file_name}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
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
          <CardContent className="py-16 text-center">
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
          <CardContent className="py-16 text-center">
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
          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            {/* Summary Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <FileText className="h-4 w-4 group-hover:text-primary transition-colors" />
                  Résumé
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
                <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                  <SheetHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <SheetTitle>Résumé exécutif</SheetTitle>
                        <SheetDescription>Les points clés de votre document</SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    {digest.summary.map((item, i) => (
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
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Clauses clés</h4>
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
                        Actions suggérées
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
                    Copier le résumé
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Risks & Questions Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <AlertTriangle className="h-4 w-4 group-hover:text-primary transition-colors" />
                  Risques & Questions
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
                <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                  <SheetHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <SheetTitle>Risques & Questions</SheetTitle>
                        <SheetDescription>Points d'attention et questions à poser</SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>
                </div>
                <div className="p-6 space-y-6">
                  {/* Risks */}
                  <div>
                    <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">Risques identifiés</h4>
                    {digest.risks.length === 0 ? (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-700 dark:text-emerald-400">
                        Aucun risque significatif identifié
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
                      Questions à poser
                    </h4>
                    {digest.questions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Aucune question suggérée</p>
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

                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => copyToClipboard(digest.questions.join('\n'))}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier les questions
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            {/* Easy Reading Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
                  <BookOpen className="h-4 w-4 group-hover:text-primary transition-colors" />
                  Lecture facile
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
                <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                  <SheetHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <SheetTitle>Version simplifiée</SheetTitle>
                        <SheetDescription>Le document expliqué simplement</SheetDescription>
                      </div>
                    </div>
                  </SheetHeader>
                </div>
                <div className="p-6">
                  {summary?.easy_reading ? (
                    <>
                      <div className="p-4 rounded-xl bg-muted/50 border">
                        <div className="prose prose-sm max-w-none">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{summary.easy_reading}</div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="w-full mt-4"
                        onClick={() => copyToClipboard(summary.easy_reading || '')}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copier
                      </Button>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-muted/50 border text-sm text-muted-foreground">
                      La version simplifiée n'est pas disponible.
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Flashcards */}
            <Flashcards 
              documentId={document.id}
              documentContent={summary?.easy_reading || digest.summary.join('\n')}
              documentName={document.file_name}
            />

            {/* Slides / Presentation */}
            <Slides 
              documentId={document.id}
              documentContent={summary?.easy_reading || digest.summary.join('\n')}
              documentName={document.file_name}
            />
          </div>

          {/* Main Chat Interface */}
          <PDFChat 
            documentId={document.id}
            documentContent={summary?.easy_reading || digest.summary.join('\n')}
            documentName={document.file_name}
          />
        </div>
      )}
    </div>
  )
}
