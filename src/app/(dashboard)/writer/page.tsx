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

  useEffect(() => {
    setMounted(true)
  }, [])

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
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg">
          <PenTool className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Rédacteur & Humaniseur</h1>
          <p className="text-sm text-muted-foreground">
            Dissertations, commentaires et humanisation de textes IA
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-6">
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
                    <p className="font-medium text-sm">{cfg.title}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {config.icon}
                {config.title}
              </CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subject field */}
              {config.fields.subject && (
                <div className="space-y-2">
                  <Label htmlFor="subject">
                    {activeType === 'commentaire' ? 'Consigne / Axe d\'analyse (optionnel)' : 'Sujet'}
                  </Label>
                  <Input
                    id="subject"
                    placeholder={activeType === 'dissertation' ? config.placeholder : 'Ex: Analysez la vision de l\'amour dans ce texte'}
                    value={subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)}
                  />
                </div>
              )}

              {/* Thesis field for dissertation */}
              {config.fields.thesis && (
                <div className="space-y-2">
                  <Label htmlFor="thesis">Thèse / Angle (optionnel)</Label>
                  <Input
                    id="thesis"
                    placeholder="Ex: Je pense que la liberté est une conquête permanente..."
                    value={thesis}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setThesis(e.target.value)}
                  />
                </div>
              )}

              {/* Text field */}
              {config.fields.text && (
                <div className="space-y-2">
                  <Label htmlFor="text">
                    {activeType === 'humanize' ? 'Texte à humaniser' : 'Texte à commenter'}
                  </Label>
                  <Textarea
                    id="text"
                    placeholder={config.placeholder}
                    value={inputText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    {inputText.split(/\s+/).filter(Boolean).length} mots
                  </p>
                </div>
              )}

              {/* Word count for dissertation/commentaire */}
              {activeType !== 'humanize' && (
                <div className="space-y-2">
                  <Label>Longueur souhaitée</Label>
                  <Select value={wordCount.toString()} onValueChange={(v) => setWordCount(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="800">~800 mots (court)</SelectItem>
                      <SelectItem value="1500">~1500 mots (standard)</SelectItem>
                      <SelectItem value="2500">~2500 mots (développé)</SelectItem>
                      <SelectItem value="4000">~4000 mots (approfondi)</SelectItem>
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
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel - Result */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Résultat
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
                  {result.split(/\s+/).filter(Boolean).length} mots
                </p>
              )}
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full blur-xl opacity-30 animate-pulse" />
                    <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
                  </div>
                  <p className="text-muted-foreground">Rédaction en cours...</p>
                  <p className="text-xs text-muted-foreground mt-1">Cela peut prendre jusqu'à 1 minute</p>
                </div>
              ) : result ? (
                <div className="prose prose-sm dark:prose-invert max-w-none max-h-[500px] overflow-y-auto">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {result}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center text-muted-foreground">
                  <PenTool className="h-12 w-12 mb-4 opacity-20" />
                  <p>Le résultat apparaîtra ici</p>
                  <p className="text-xs mt-1">Remplissez le formulaire et cliquez sur Générer</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 rounded-xl bg-muted/30 border">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          Conseils pour de meilleurs résultats
        </h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground mb-1">Dissertation</p>
            <p>Formulez clairement votre sujet sous forme de question. Ajoutez votre thèse pour orienter l'argumentation.</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Commentaire</p>
            <p>Collez le texte complet à analyser. Précisez l'axe d'analyse si vous en avez un.</p>
          </div>
          <div>
            <p className="font-medium text-foreground mb-1">Humaniseur</p>
            <p>Fonctionne mieux sur des textes de 200-2000 mots. Préserve le sens tout en variant le style.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
