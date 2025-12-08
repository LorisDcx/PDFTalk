'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TextTranslator } from '@/components/text-translator'
import { 
  Loader2, 
  ArrowLeft, 
  Copy, 
  FileText, 
  AlertTriangle, 
  HelpCircle,
  CheckCircle,
  Clock,
  BookOpen
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

      {/* Completed State - Tabs */}
      {document.status === 'completed' && digest && (
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Résumé</TabsTrigger>
            <TabsTrigger value="risks">Risques & Questions</TabsTrigger>
            <TabsTrigger value="easy">Lecture facile</TabsTrigger>
          </TabsList>

          {/* Summary Tab */}
          <TabsContent value="summary" className="space-y-6">
            {/* Executive Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Résumé exécutif
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(digest.summary.join('\n'))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copier
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {digest.summary.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Translation for summary */}
            <TextTranslator text={digest.summary.join('\n\n')} />

            {/* Key Clauses */}
            {digest.keyClauses && digest.keyClauses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Clauses et sections clés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {digest.keyClauses.map((clause, i) => (
                      <div key={i}>
                        <h4 className="font-medium mb-1">{clause.title}</h4>
                        <p className="text-sm text-muted-foreground">{clause.description}</p>
                        {i < digest.keyClauses.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Suggested Actions */}
            {digest.actions && digest.actions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Actions suggérées
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {digest.actions.map((action, i) => (
                      <li key={i} className="flex items-start justify-between gap-4">
                        <span>{action.action}</span>
                        <Badge variant={getPriorityColor(action.priority) as any}>
                          {action.priority}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Risks & Questions Tab */}
          <TabsContent value="risks" className="space-y-6">
            {/* Risks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Risques & points d'attention
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(
                    digest.risks.map(r => `[${r.severity.toUpperCase()}] ${r.title}: ${r.description}`).join('\n')
                  )}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </CardHeader>
              <CardContent>
                {digest.risks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No significant risks identified
                  </p>
                ) : (
                  <div className="space-y-4">
                    {digest.risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Badge variant={getSeverityColor(risk.severity) as any} className="mt-1 shrink-0">
                          {risk.severity}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{risk.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Questions à poser
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(digest.questions.join('\n'))}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </CardHeader>
              <CardContent>
                {digest.questions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    No questions suggested
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {digest.questions.map((question, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm shrink-0">
                          {i + 1}
                        </span>
                        <span>{question}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Easy Reading Tab */}
          <TabsContent value="easy" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Version simplifiée
                </CardTitle>
                {summary?.easy_reading && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(summary.easy_reading || '')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copier
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {summary?.easy_reading ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap">{summary.easy_reading}</div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    La version simplifiée est en cours de génération...
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Translation component for easy reading */}
            {summary?.easy_reading && (
              <TextTranslator text={summary.easy_reading} />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
