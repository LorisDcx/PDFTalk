'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Presentation,
  Download,
  Sparkles,
  Maximize2,
  Minimize2,
  X,
  Languages
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage, LANGUAGES } from '@/lib/i18n'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Slide {
  id: number
  type: 'title' | 'content' | 'conclusion' | 'stats' | 'timeline' | 'twoColumns' | 'quote' | 'comparison' | 'icons' | 'image' | 'agenda' | 'bigNumber' | 'threeColumns'
  title?: string
  subtitle?: string
  emoji?: string
  bullets?: string[]
  stats?: { icon: string; value: string; label: string }[]
  steps?: { title: string; description: string }[]
  leftTitle?: string
  leftBullets?: string[]
  rightTitle?: string
  rightBullets?: string[]
  text?: string
  author?: string
  option1?: { title: string; emoji: string; points: string[] }
  option2?: { title: string; emoji: string; points: string[] }
  items?: { emoji: string; title: string; description: string }[]
  imageUrl?: string
  imageQuery?: string
  number?: string
  numberLabel?: string
  agendaItems?: { number: string; title: string }[]
  columns?: { title: string; items: string[] }[]
}

// Theme configurations
const THEMES = {
  modern: {
    name: 'Moderne',
    titleBg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    contentBg: 'bg-gradient-to-br from-slate-900 to-slate-800',
    conclusionBg: 'bg-gradient-to-br from-primary via-orange-600 to-red-500',
    accent: 'text-orange-400',
    accentBg: 'bg-orange-500/20',
  },
  corporate: {
    name: 'Corporate',
    titleBg: 'bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900',
    contentBg: 'bg-gradient-to-br from-gray-900 to-gray-800',
    conclusionBg: 'bg-gradient-to-br from-blue-600 to-indigo-700',
    accent: 'text-blue-400',
    accentBg: 'bg-blue-500/20',
  },
  creative: {
    name: 'Créatif',
    titleBg: 'bg-gradient-to-br from-purple-900 via-pink-800 to-rose-900',
    contentBg: 'bg-gradient-to-br from-slate-900 to-purple-900/50',
    conclusionBg: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-600',
    accent: 'text-pink-400',
    accentBg: 'bg-pink-500/20',
  },
  nature: {
    name: 'Nature',
    titleBg: 'bg-gradient-to-br from-emerald-900 via-red-800 to-orange-900',
    contentBg: 'bg-gradient-to-br from-slate-900 to-emerald-900/50',
    conclusionBg: 'bg-gradient-to-br from-emerald-500 to-red-600',
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/20',
  },
  minimal: {
    name: 'Minimal',
    titleBg: 'bg-gradient-to-br from-neutral-100 to-neutral-200 text-neutral-900',
    contentBg: 'bg-white text-neutral-900',
    conclusionBg: 'bg-gradient-to-br from-neutral-800 to-neutral-900',
    accent: 'text-neutral-600',
    accentBg: 'bg-neutral-200',
  },
}

type ThemeKey = keyof typeof THEMES

interface SlidesProps {
  documentId: string
  documentContent: string
  documentName: string
}

export function Slides({ documentId, documentContent, documentName }: SlidesProps) {
  const [slides, setSlides] = useState<Slide[]>([])
  const [presentationTitle, setPresentationTitle] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [slideCount, setSlideCount] = useState(8)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [theme, setTheme] = useState<ThemeKey>('modern')
  const [includeImages, setIncludeImages] = useState(true)
  const [presentationStyle, setPresentationStyle] = useState<'professional' | 'academic' | 'creative'>('professional')
  const { t, language } = useLanguage()
  const { toast } = useToast()
  
  const currentTheme = THEMES[theme]

  // Load existing slides from localStorage on mount
  useEffect(() => {
    loadSlides()
  }, [documentId])

  const loadSlides = () => {
    try {
      const stored = localStorage.getItem(`slides-${documentId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.slides?.length > 0) {
          setSlides(parsed.slides)
          setPresentationTitle(parsed.title || '')
        }
      }
    } catch (error) {
      console.error('Failed to load slides:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save slides to localStorage whenever they change
  useEffect(() => {
    if (slides.length > 0) {
      localStorage.setItem(`slides-${documentId}`, JSON.stringify({ 
        title: presentationTitle, 
        slides 
      }))
    }
  }, [slides, presentationTitle, documentId])

  const generateSlides = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          documentContent,
          slideCount,
          language,
          theme,
          includeImages,
          presentationStyle,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle quota errors
        if (response.status === 403) {
          toast({
            title: t('insufficientPages'),
            description: data.error,
            variant: 'destructive',
          })
          setIsDialogOpen(false)
          return
        }
        throw new Error(data.error || 'Failed to generate slides')
      }

      setSlides(data.slides)
      setPresentationTitle(data.title)
      setCurrentIndex(0)
      setIsDialogOpen(false)
      setIsViewerOpen(true)
    } catch (error) {
      console.error('Slides generation error:', error)
      toast({
        title: t('error'),
        description: t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteSlides = () => {
    localStorage.removeItem(`slides-${documentId}`)
    setSlides([])
    setPresentationTitle('')
    setIsViewerOpen(false)
  }

  const translateSlides = async (targetLang: string) => {
    if (slides.length === 0) return
    setIsTranslating(true)
    
    try {
      // Translate title
      const titleResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: presentationTitle, targetLanguage: targetLang }),
      })
      if (titleResponse.ok) {
        const { translatedText } = await titleResponse.json()
        setPresentationTitle(translatedText)
      }
      
      // Translate each slide content
      const translatedSlides = await Promise.all(slides.map(async (slide) => {
        const textsToTranslate: string[] = []
        if (slide.title) textsToTranslate.push(slide.title)
        if (slide.subtitle) textsToTranslate.push(slide.subtitle)
        if (slide.bullets) textsToTranslate.push(...slide.bullets)
        if (slide.text) textsToTranslate.push(slide.text)
        
        if (textsToTranslate.length === 0) return slide
        
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textsToTranslate.join('\n---\n'), targetLanguage: targetLang }),
        })
        
        if (!response.ok) return slide
        
        const { translatedText } = await response.json()
        const parts = translatedText.split(/---/).map((p: string) => p.trim())
        
        let idx = 0
        const newSlide = { ...slide }
        if (slide.title) newSlide.title = parts[idx++] || slide.title
        if (slide.subtitle) newSlide.subtitle = parts[idx++] || slide.subtitle
        if (slide.bullets) newSlide.bullets = slide.bullets.map(() => parts[idx++] || '')
        if (slide.text) newSlide.text = parts[idx++] || slide.text
        
        return newSlide
      }))
      
      setSlides(translatedSlides)
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }, [currentIndex, slides.length])

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isViewerOpen) return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        nextSlide()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        prevSlide()
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          setIsViewerOpen(false)
        }
      } else if (e.key === 'f' || e.key === 'F') {
        setIsFullscreen(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isViewerOpen, isFullscreen, nextSlide, prevSlide])

  const exportToHTML = () => {
    const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${presentationTitle}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: white; }
    .slide { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 4rem; page-break-after: always; }
    .slide-title { background: linear-gradient(135deg, #3b82f6, #06b6d4); text-align: center; }
    .slide-title h1 { font-size: 3.5rem; margin-bottom: 1rem; }
    .slide-title p { font-size: 1.5rem; opacity: 0.8; }
    .slide-content h2 { font-size: 2.5rem; margin-bottom: 2rem; color: #3b82f6; }
    .slide-content ul { list-style: none; }
    .slide-content li { font-size: 1.5rem; padding: 1rem 0; padding-left: 2rem; border-left: 4px solid #3b82f6; margin-bottom: 1rem; }
    .slide-conclusion { background: linear-gradient(135deg, #06b6d4, #3b82f6); }
    .slide-conclusion h2 { font-size: 2.5rem; margin-bottom: 2rem; }
    .slide-conclusion li { font-size: 1.3rem; padding: 0.75rem 0; }
    .slide-number { position: fixed; bottom: 2rem; right: 2rem; opacity: 0.5; }
  </style>
</head>
<body>
${slides.map((slide, i) => `
  <div class="slide slide-${slide.type}">
    ${slide.type === 'title' ? `
      <h1>${slide.title}</h1>
      ${slide.subtitle ? `<p>${slide.subtitle}</p>` : ''}
    ` : `
      <h2>${slide.title}</h2>
      ${slide.bullets ? `<ul>${slide.bullets.map(b => `<li>${b}</li>`).join('')}</ul>` : ''}
    `}
    <div class="slide-number">${i + 1} / ${slides.length}</div>
  </div>
`).join('')}
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${presentationTitle.replace(/[^a-zA-Z0-9]/g, '_')}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  const currentSlide = slides[currentIndex]

  return (
    <>
      {/* Trigger Buttons */}
      <div className="flex gap-2">
        {/* View existing slides */}
        {slides.length > 0 && !isLoading && (
          <Button 
            variant="outline" 
            className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={() => setIsViewerOpen(true)}
          >
            <Presentation className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span>Présentation ({slides.length})</span>
          </Button>
        )}

        {/* Generate new slides */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Presentation className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span>{slides.length > 0 ? 'Regénérer' : 'Slides'}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg">
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    {t('generatePresentation')}
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">Beta</span>
                  </DialogTitle>
                  <DialogDescription>
                    {t('createSlidesDesc')}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Number of slides */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('numberOfSlides')}</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={15}
                    step={1}
                    value={slideCount}
                    onChange={(e) => setSlideCount(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-2xl font-bold text-primary w-12">{slideCount}</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {[5, 8, 12].map((num) => (
                    <button
                      key={num}
                      onClick={() => setSlideCount(num)}
                      className={cn(
                        "px-3 py-1 rounded-full text-sm font-medium transition-all",
                        slideCount === num 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted hover:bg-muted/80"
                      )}
                    >
                      {num} slides
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('theme')}</Label>
                <div className="grid grid-cols-5 gap-2">
                  {(Object.keys(THEMES) as ThemeKey[]).map((themeKey) => (
                    <button
                      key={themeKey}
                      onClick={() => setTheme(themeKey)}
                      className={cn(
                        "p-2 rounded-lg border-2 transition-all text-xs font-medium",
                        theme === themeKey 
                          ? "border-primary bg-primary/10" 
                          : "border-transparent bg-muted hover:bg-muted/80"
                      )}
                    >
                      <div className={cn(
                        "w-full h-6 rounded mb-1",
                        themeKey === 'modern' && "bg-gradient-to-r from-slate-800 to-orange-600",
                        themeKey === 'corporate' && "bg-gradient-to-r from-blue-800 to-indigo-600",
                        themeKey === 'creative' && "bg-gradient-to-r from-purple-600 to-pink-500",
                        themeKey === 'nature' && "bg-gradient-to-r from-emerald-600 to-red-500",
                        themeKey === 'minimal' && "bg-gradient-to-r from-neutral-200 to-neutral-400",
                      )} />
                      {THEMES[themeKey].name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Presentation style */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('presentationStyle')}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'professional', label: t('professional'), icon: '💼' },
                    { key: 'academic', label: t('academic'), icon: '🎓' },
                    { key: 'creative', label: t('creativeStyle'), icon: '🎨' },
                  ].map((style) => (
                    <button
                      key={style.key}
                      onClick={() => setPresentationStyle(style.key as any)}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all text-sm font-medium flex flex-col items-center gap-1",
                        presentationStyle === style.key 
                          ? "border-primary bg-primary/10" 
                          : "border-transparent bg-muted hover:bg-muted/80"
                      )}
                    >
                      <span className="text-xl">{style.icon}</span>
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Include images toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🖼️</span>
                  <div>
                    <Label className="text-sm font-medium">{t('includeImages')}</Label>
                    <p className="text-xs text-muted-foreground">{t('includeImagesDesc')}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIncludeImages(!includeImages)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-all relative",
                    includeImages ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                    includeImages ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              {/* Page cost indicator */}
              <div className="flex items-center justify-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  💰 {t('pageCost').replace('{count}', String(slideCount))}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={generateSlides} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 text-white shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('generatingSlides')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('generate')} {slideCount} {t('slides')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Slide Viewer Modal */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className={cn(
          "p-0 overflow-hidden transition-all duration-300",
          isFullscreen 
            ? "max-w-[100vw] w-screen h-screen rounded-none" 
            : "sm:max-w-4xl"
        )}>
          {/* Header */}
          <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-orange-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
                <Presentation className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{presentationTitle}</h3>
                <p className="text-sm text-muted-foreground">{currentIndex + 1} / {slides.length}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" title={t('translateContent')} className="hover:bg-primary/10" disabled={isTranslating}>
                    {isTranslating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {LANGUAGES.map((lang) => (
                    <DropdownMenuItem key={lang.code} onClick={() => translateSlides(lang.name)}>
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} title={t('fullscreen')} className="hover:bg-primary/10">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={exportToHTML} title={t('downloadHTML')} className="hover:bg-primary/10">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsViewerOpen(false)} className="hover:bg-primary/10">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Slide Display */}
          <div className={cn(
            "relative overflow-hidden",
            isFullscreen ? "h-[calc(100vh-140px)]" : "h-[500px]"
          )}>
            {currentSlide && (
              <div 
                className={cn(
                  "absolute inset-0 flex flex-col items-center justify-center p-8 text-white transition-all duration-500",
                  currentSlide.type === 'title' && "bg-gradient-to-br from-primary via-orange-500 to-red-500",
                  currentSlide.type === 'conclusion' && "bg-gradient-to-br from-orange-500 via-primary to-violet-500",
                  currentSlide.type === 'quote' && "bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600",
                  !['title', 'conclusion', 'quote'].includes(currentSlide.type) && "bg-gradient-to-br from-slate-900 to-slate-800"
                )}
              >
                {/* Title Slide */}
                {currentSlide.type === 'title' && (
                  <div className="text-center space-y-6">
                    {currentSlide.emoji && (
                      <span className="text-6xl md:text-7xl">{currentSlide.emoji}</span>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold">{currentSlide.title}</h1>
                    {currentSlide.subtitle && (
                      <p className="text-xl md:text-2xl opacity-90">{currentSlide.subtitle}</p>
                    )}
                  </div>
                )}

                {/* Stats Slide */}
                {currentSlide.type === 'stats' && (
                  <div className="w-full max-w-4xl space-y-8">
                    <h2 className={cn("text-3xl md:text-4xl font-bold text-center", currentTheme.accent)}>{currentSlide.title}</h2>
                    <div className="grid grid-cols-3 gap-6">
                      {currentSlide.stats?.map((stat, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                          <span className="text-4xl mb-2 block">{stat.icon}</span>
                          <span className={cn("text-4xl md:text-5xl font-bold block", currentTheme.accent)}>{stat.value}</span>
                          <span className="text-sm md:text-base opacity-80 mt-2 block">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline Slide */}
                {currentSlide.type === 'timeline' && (
                  <div className="w-full max-w-4xl space-y-8">
                    <h2 className={cn("text-3xl md:text-4xl font-bold text-center", currentTheme.accent)}>{currentSlide.title}</h2>
                    <div className="relative">
                      <div className={cn("absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2", currentTheme.accent.replace('text-', 'bg-'))} />
                      <div className="space-y-6">
                        {currentSlide.steps?.map((step, i) => (
                          <div key={i} className={cn("flex items-center gap-4", i % 2 === 0 ? "flex-row" : "flex-row-reverse")}>
                            <div className={cn("flex-1 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20", i % 2 === 0 ? "text-right" : "text-left")}>
                              <h3 className={cn("font-bold", currentTheme.accent)}>{step.title}</h3>
                              <p className="text-sm opacity-80">{step.description}</p>
                            </div>
                            <div className={cn("w-4 h-4 rounded-full border-4 border-slate-900 z-10 shrink-0", currentTheme.accent.replace('text-', 'bg-'))} />
                            <div className="flex-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Two Columns Slide */}
                {currentSlide.type === 'twoColumns' && (
                  <div className="w-full max-w-4xl space-y-8">
                    <h2 className={cn("text-3xl md:text-4xl font-bold text-center", currentTheme.accent)}>{currentSlide.title}</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <h3 className={cn("text-xl font-bold mb-4", currentTheme.accent)}>{currentSlide.leftTitle}</h3>
                        <ul className="space-y-2">
                          {currentSlide.leftBullets?.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className={cn("w-1.5 h-1.5 mt-2 rounded-full shrink-0", currentTheme.accent.replace('text-', 'bg-'))} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <h3 className="text-xl font-bold mb-4 text-primary">{currentSlide.rightTitle}</h3>
                        <ul className="space-y-2">
                          {currentSlide.rightBullets?.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-primary shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quote Slide */}
                {currentSlide.type === 'quote' && (
                  <div className="text-center max-w-3xl space-y-6">
                    <span className="text-6xl opacity-50">"</span>
                    <p className="text-2xl md:text-3xl font-medium italic leading-relaxed">{currentSlide.text}</p>
                    <span className="text-6xl opacity-50">"</span>
                    {currentSlide.author && (
                      <p className="text-lg opacity-80">— {currentSlide.author}</p>
                    )}
                  </div>
                )}

                {/* Comparison Slide */}
                {currentSlide.type === 'comparison' && (
                  <div className="w-full max-w-4xl space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-orange-400">{currentSlide.title}</h2>
                    <div className="grid grid-cols-2 gap-8">
                      {currentSlide.option1 && (
                        <div className="p-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{currentSlide.option1.emoji}</span>
                            <h3 className="text-xl font-bold text-emerald-400">{currentSlide.option1.title}</h3>
                          </div>
                          <ul className="space-y-2">
                            {currentSlide.option1.points.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-emerald-400">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {currentSlide.option2 && (
                        <div className="p-6 rounded-2xl bg-orange-500/20 border border-orange-500/40">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{currentSlide.option2.emoji}</span>
                            <h3 className="text-xl font-bold text-orange-400">{currentSlide.option2.title}</h3>
                          </div>
                          <ul className="space-y-2">
                            {currentSlide.option2.points.map((point, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="text-orange-400">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Icons Slide */}
                {currentSlide.type === 'icons' && (
                  <div className="w-full max-w-4xl space-y-8">
                    <h2 className={cn("text-3xl md:text-4xl font-bold text-center", currentTheme.accent)}>{currentSlide.title}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {currentSlide.items?.map((item, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                          <span className="text-4xl mb-3 block">{item.emoji}</span>
                          <h3 className={cn("font-bold mb-1", currentTheme.accent)}>{item.title}</h3>
                          <p className="text-sm opacity-80">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Big Number Slide */}
                {currentSlide.type === 'bigNumber' && (
                  <div className="text-center space-y-6">
                    <h2 className={cn("text-2xl md:text-3xl font-medium opacity-80", currentTheme.accent)}>{currentSlide.title}</h2>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-orange-400/30 to-primary/30 blur-3xl" />
                      <span className="relative text-7xl md:text-9xl font-black bg-gradient-to-r from-white via-orange-200 to-white bg-clip-text text-transparent">
                        {currentSlide.number}
                      </span>
                    </div>
                    <p className="text-xl md:text-2xl opacity-90">{currentSlide.numberLabel}</p>
                  </div>
                )}

                {/* Agenda Slide */}
                {currentSlide.type === 'agenda' && (
                  <div className="w-full max-w-3xl space-y-8">
                    <h2 className={cn("text-3xl md:text-4xl font-bold text-center", currentTheme.accent)}>{currentSlide.title}</h2>
                    <div className="space-y-4">
                      {currentSlide.agendaItems?.map((item, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                          <span className={cn("text-3xl font-black", currentTheme.accent)}>{item.number}</span>
                          <span className="text-xl font-medium">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Slide */}
                {currentSlide.type === 'image' && (
                  <div className="w-full h-full flex">
                    {/* Image side */}
                    <div className="w-1/2 h-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-slate-900/80 z-10" />
                      <img 
                        src={currentSlide.imageUrl || `https://source.unsplash.com/800x600/?${encodeURIComponent(currentSlide.imageQuery || 'business')}`}
                        alt={currentSlide.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=600&fit=crop`
                        }}
                      />
                    </div>
                    {/* Content side */}
                    <div className="w-1/2 flex flex-col justify-center p-8 space-y-6">
                      <h2 className={cn("text-3xl md:text-4xl font-bold", currentTheme.accent)}>{currentSlide.title}</h2>
                      {currentSlide.bullets && (
                        <ul className="space-y-4">
                          {currentSlide.bullets.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-4 text-lg">
                              <span className={cn("w-2 h-2 mt-2.5 rounded-full shrink-0", currentTheme.accent.replace('text-', 'bg-'))} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}

                {/* Three Columns Slide */}
                {currentSlide.type === 'threeColumns' && (
                  <div className="w-full max-w-5xl space-y-8">
                    <h2 className={cn("text-3xl md:text-4xl font-bold text-center", currentTheme.accent)}>{currentSlide.title}</h2>
                    <div className="grid grid-cols-3 gap-6">
                      {currentSlide.columns?.map((col, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                          <h3 className={cn("text-xl font-bold mb-4 text-center", currentTheme.accent)}>{col.title}</h3>
                          <ul className="space-y-2">
                            {col.items.map((item, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm">
                                <span className={cn("w-1.5 h-1.5 mt-2 rounded-full shrink-0", currentTheme.accent.replace('text-', 'bg-'))} />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Slide */}
                {currentSlide.type === 'content' && (
                  <div className="w-full max-w-3xl space-y-8">
                    <h2 className={cn("text-3xl md:text-4xl font-bold", currentTheme.accent)}>{currentSlide.title}</h2>
                    {currentSlide.bullets && (
                      <ul className="space-y-4">
                        {currentSlide.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-4 text-lg md:text-xl">
                            <span className={cn("w-2 h-2 mt-2.5 rounded-full shrink-0", currentTheme.accent.replace('text-', 'bg-'))} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Conclusion Slide */}
                {currentSlide.type === 'conclusion' && (
                  <div className="w-full max-w-3xl space-y-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold">{currentSlide.title}</h2>
                    {currentSlide.bullets && (
                      <ul className="space-y-4 text-left inline-block">
                        {currentSlide.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-4 text-lg md:text-xl">
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="p-4 border-t bg-background flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </Button>
            
            {/* Slide indicators */}
            <div className="flex gap-1.5 overflow-x-auto max-w-[50%] px-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all shrink-0",
                    i === currentIndex 
                      ? "bg-gradient-to-r from-primary to-orange-500 scale-125" 
                      : "bg-muted hover:bg-muted-foreground/30"
                  )}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              onClick={nextSlide}
              disabled={currentIndex === slides.length - 1}
              className="gap-2"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
