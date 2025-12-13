'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  PenTool, 
  Sparkles, 
  FileText, 
  BookOpen,
  Loader2,
  Copy,
  Check,
  Wand2,
  GraduationCap,
  MessageSquare,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

type WritingType = 'dissertation' | 'commentaire' | 'humanize'

interface WritingConfig {
  type: WritingType
  title: string
  description: string
  icon: React.ReactNode
  placeholder: string
  fields: {
    subject?: boolean
    thesis?: boolean
    text?: boolean
  }
}

const WRITING_CONFIGS: Record<WritingType, WritingConfig> = {
  dissertation: {
    type: 'dissertation',
    title: 'Dissertation',
    description: 'Rédaction structurée avec intro, développement et conclusion',
    icon: <BookOpen className="h-5 w-5" />,
    placeholder: 'Ex: "La liberté est-elle une illusion ?" ou "Le progrès technique est-il toujours un progrès ?"',
    fields: { subject: true, thesis: true }
  },
  commentaire: {
    type: 'commentaire',
    title: 'Commentaire de texte',
    description: 'Analyse littéraire approfondie d\'un extrait',
    icon: <FileText className="h-5 w-5" />,
    placeholder: 'Collez ici le texte à commenter...',
    fields: { text: true, subject: true }
  },
  humanize: {
    type: 'humanize',
    title: 'Humaniseur',
    description: 'Rendre un texte IA plus naturel et humain',
    icon: <Wand2 className="h-5 w-5" />,
    placeholder: 'Collez ici le texte généré par IA à humaniser...',
    fields: { text: true }
  }
}

export default function WriterPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  
  const [mounted, setMounted] = useState(false)
  const [activeType, setActiveType] = useState<WritingType>('dissertation')
  const [subject, setSubject] = useState('')
  const [thesis, setThesis] = useState('')
  const [inputText, setInputText] = useState('')
  const [result, setResult] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [wordCount, setWordCount] = useState<number>(1500)
  const [humanizerCreditsRemaining, setHumanizerCreditsRemaining] = useState<number | null>(null)
  const [humanizerCreditsLimit, setHumanizerCreditsLimit] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return
      try {
        const res = await fetch('/api/writer/credits')
        const data = await res.json()
        if (res.ok && data?.creditsRemaining !== undefined) {
          setHumanizerCreditsRemaining(data.creditsRemaining)
          setHumanizerCreditsLimit(data.creditsLimit)
        }
      } catch (err) {
        console.error('Failed to load humanizer credits', err)
      }
    }
    fetchCredits()
  }, [user])

  const config = WRITING_CONFIGS[activeType]

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleGenerate = async () => {
    if (activeType === 'humanize' && !inputText.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un texte à humaniser', variant: 'destructive' })
      return
    }
    if (activeType === 'dissertation' && !subject.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer un sujet', variant: 'destructive' })
      return
    }
    if (activeType === 'commentaire' && !inputText.trim()) {
      toast({ title: 'Erreur', description: 'Veuillez entrer le texte à commenter', variant: 'destructive' })
      return
    }

    setIsGenerating(true)
    setResult('')

    try {
      const response = await fetch('/api/writer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeType,
          subject: subject.trim(),
          thesis: thesis.trim(),
          text: inputText.trim(),
          wordCount
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de génération')
      }

      setResult(data.content)
      if (activeType === 'humanize') {
        if (typeof data.creditsRemaining === 'number') {
          setHumanizerCreditsRemaining(data.creditsRemaining)
        }
        if (typeof data.creditsLimit === 'number') {
          setHumanizerCreditsLimit(data.creditsLimit)
        }
      }
    } catch (error: any) {
      toast({ 
        title: 'Erreur', 
        description: error.message || 'Échec de la génération', 
        variant: 'destructive' 
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: 'Copié !', description: 'Le texte a été copié dans le presse-papier' })
  }

  const resetForm = () => {
    setSubject('')
    setThesis('')
    setInputText('')
    setResult('')
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="container max-w-6xl py-4 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg">
          <PenTool className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t('writerTitle')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('writerSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left Panel - Input */}
        <div className="space-y-6 h-full flex flex-col min-h-0">
          {/* Type Selection */}
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(WRITING_CONFIGS) as WritingType[]).map((type) => {
              const cfg = WRITING_CONFIGS[type]
              return (
                <Card 
                  key={type}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    activeType === type 
                      ? "border-primary bg-primary/5 ring-1 ring-primary" 
                      : "hover:border-primary/30"
                  )}
                  onClick={() => { setActiveType(type); resetForm() }}
                >
                  <CardContent className="p-4 text-center">
                    <div className={cn(
                      "w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2",
                      activeType === type 
                        ? "bg-gradient-to-br from-primary to-orange-500 text-white" 
                        : "bg-muted text-muted-foreground"
                    )}>
                      {cfg.icon}
                    </div>
                    <p className="font-medium text-sm">{t(type === 'dissertation' ? 'dissertation' : type === 'commentaire' ? 'commentaire' : 'humanizer')}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Input Form */}
          <Card className="flex-1 min-h-0 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {config.icon}
                {t(activeType === 'dissertation' ? 'dissertation' : activeType === 'commentaire' ? 'commentaire' : 'humanizer')}
              </CardTitle>
              <CardDescription>{t(activeType === 'dissertation' ? 'dissertationDesc' : activeType === 'commentaire' ? 'commentaireDesc' : 'humanizerDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-auto min-h-0">
              {/* Subject field */}
              {config.fields.subject && (
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    {activeType === 'commentaire' ? t('analysisAxis') : t('subject')}
                  </Label>
                  <Input
                    id="subject"
                    placeholder={activeType === 'dissertation' ? t('dissertationPlaceholder') : t('analysisPlaceholder')}
                    value={subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                  />
                </div>
              )}

              {/* Thesis field for dissertation */}
              {config.fields.thesis && (
                <div className="space-y-2">
                  <Label htmlFor="thesis">{t('thesisAngle')}</Label>
                  <Input
                    id="thesis"
                    placeholder={t('thesisPlaceholder')}
                    value={thesis}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThesis(e.target.value)}
                  />
                </div>
              )}

              {activeType === 'humanize' && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary">Crédits Humanizer restants</p>
                      <p className="text-sm text-muted-foreground">
                        {humanizerCreditsRemaining !== null && humanizerCreditsLimit !== null
                          ? `${humanizerCreditsRemaining}/${humanizerCreditsLimit} ce mois-ci`
                          : 'Chargement des crédits...'}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-primary border-primary/40">
                      {humanizerCreditsRemaining !== null ? humanizerCreditsRemaining : '...'}
                    </Badge>
                  </div>
                </div>
              )}

              {/* Text field */}
              {config.fields.text && (
                <div className="space-y-2">
                  <Label htmlFor="text">
                    {activeType === 'humanize' ? t('textToHumanize') : t('textToComment')}
                  </Label>
                  <Textarea
                    id="text"
                    placeholder={activeType === 'humanize' ? t('humanizerPlaceholder') : t('commentairePlaceholder')}
                    value={inputText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {inputText.split(/\s+/).filter(Boolean).length} {t('words')}
                  </p>
                </div>
              )}

              {/* Word count for dissertation/commentaire */}
              {activeType !== 'humanize' && (
                <div className="space-y-2">
                  <Label>{t('desiredLength')}</Label>
                  <Select value={wordCount.toString()} onValueChange={(v) => setWordCount(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="800">~800 {t('words')} ({t('short')})</SelectItem>
                      <SelectItem value="1500">~1500 {t('words')} ({t('standard')})</SelectItem>
                      <SelectItem value="2500">~2500 {t('words')} ({t('developed')})</SelectItem>
                      <SelectItem value="4000">~4000 {t('words')} ({t('indepth')})</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button 
                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('generate')}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Result */}
        <div className="h-full min-h-0 flex flex-col">
          <Card className="h-full flex flex-col min-h-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('generatedResult')}
                </CardTitle>
                {result && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating}>
                      <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                    </Button>
                  </div>
                )}
              </div>
              {result && (
                <p className="text-xs text-muted-foreground">
                  {result.split(/\s+/).filter(Boolean).length} {t('words')}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
                  </div>
                  <p className="text-muted-foreground">{t('generating')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('canTakeUpTo1Min')}</p>
                </div>
              ) : result ? (
                <div className="prose prose-sm dark:prose-invert max-w-none h-full overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <PenTool className="h-12 w-12 mb-4 opacity-20" />
                  <p>{t('resultWillAppearHere')}</p>
                  <p className="text-xs mt-1">{t('fillFormAndGenerate')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-4 p-4 rounded-xl bg-muted/30 border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          {t('tipsTitle')}
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">{t('dissertation')}</p>
            <p>{t('tipDissertation')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">{t('commentaire')}</p>
            <p>{t('tipCommentaire')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">{t('humanizer')}</p>
            <p>{t('tipHumanizer')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
