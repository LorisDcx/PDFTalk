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
    let active = true
    queueMicrotask(() => { if (active) setMounted(true) })
    return () => { active = false }
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
    } catch (error: unknown) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Échec de la génération',
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
    <div className="min-h-[calc(100vh-4rem)] bg-[#fffaf5] px-4 py-8 text-[#33252b] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="mb-9 flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#b84432]">
          <PenTool className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[.2em] text-[#b45438]">{t('studyTools')}</p>
          <h1 className="font-editorial text-4xl leading-tight sm:text-5xl">{t('writerTitle')}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#776d78]">
            {t('writerSubtitle')}
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        {/* Left Panel - Input */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* Type Selection */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(Object.keys(WRITING_CONFIGS) as WritingType[]).map((type) => {
              const cfg = WRITING_CONFIGS[type]
              return (
                <button
                  key={type}
                  type="button"
                  className={cn(
                    "rounded-[1.2rem] border p-4 text-left transition-colors",
                    activeType === type
                      ? "border-[#b895ad] bg-[#f6edf3] text-[#4d2c43]"
                      : "border-[#ead9cf] bg-white hover:border-[#c6a8bd]"
                  )}
                  aria-pressed={activeType === type}
                  onClick={() => { setActiveType(type); resetForm() }}
                >
                  <span className={cn("mb-3 flex size-9 items-center justify-center rounded-xl", activeType === type ? "bg-[#b84432] text-white" : "bg-[#f4eef2] text-[#805e76]")}>{cfg.icon}</span>
                  <span className="block text-sm font-semibold">{t(type === 'dissertation' ? 'dissertation' : type === 'commentaire' ? 'commentaire' : 'humanizer')}</span>
                </button>
              )
            })}
          </div>

          {/* Input Form */}
          <Card className="flex min-w-0 flex-col rounded-[1.4rem] border-[#ead9cf] bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="font-editorial flex items-center gap-2 text-2xl">
                {config.icon}
                {t(activeType === 'dissertation' ? 'dissertation' : activeType === 'commentaire' ? 'commentaire' : 'humanizer')}
              </CardTitle>
              <CardDescription>{t(activeType === 'dissertation' ? 'dissertationDesc' : activeType === 'commentaire' ? 'commentaireDesc' : 'humanizerDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                className="min-h-11 w-full bg-[#b84432] text-white hover:bg-[#963326]"
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
        <div className="min-w-0">
          <Card className="flex min-h-[430px] flex-col rounded-[1.4rem] border-[#ead9cf] bg-white shadow-sm lg:sticky lg:top-24 lg:min-h-[620px]">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="font-editorial flex items-center gap-2 text-2xl">
                  <MessageSquare className="h-5 w-5" />
                  {t('generatedResult')}
                </CardTitle>
                {result && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} aria-label={t('copy')}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleGenerate} disabled={isGenerating} aria-label={t('regenerate')}>
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
            <CardContent className="min-h-0 flex-1">
              {isGenerating ? (
                <div className="flex min-h-[330px] flex-col items-center justify-center text-center">
                  <Loader2 className="mb-5 size-9 animate-spin text-[#b84432]" />
                  <p className="text-muted-foreground">{t('generating')}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t('canTakeUpTo1Min')}</p>
                </div>
              ) : result ? (
                <div className="prose prose-sm dark:prose-invert max-w-none lg:max-h-[65vh] lg:overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm leading-7">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[330px] flex-col items-center justify-center rounded-xl border border-dashed border-[#e8dfe5] bg-[#fcf9fb] px-6 text-center">
                  <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-[#f1e5ed] text-[#805e76]"><PenTool className="size-6" /></span>
                  <p className="font-editorial text-2xl text-[#3c2c3b]">{t('resultWillAppearHere')}</p>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-[#867b86]">{t('fillFormAndGenerate')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 rounded-[1.4rem] border border-[#ead9cf] bg-[#f7f0f5] p-6">
        <h3 className="font-editorial mb-5 flex items-center gap-2 text-2xl">
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
    </div>
  )
}
