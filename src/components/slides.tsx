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
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Slide {
  id: number
  type: 'title' | 'content' | 'conclusion' | 'stats' | 'timeline' | 'twoColumns' | 'quote' | 'comparison' | 'icons'
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
}

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
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate slides')
      }

      setSlides(data.slides)
      setPresentationTitle(data.title)
      setCurrentIndex(0)
      setIsDialogOpen(false)
      setIsViewerOpen(true)
    } catch (error) {
      console.error('Slides generation error:', error)
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Générer une Présentation</DialogTitle>
                  <DialogDescription>
                    Créez des slides pro en quelques secondes
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="slideCount" className="text-sm font-medium">Nombre de slides</Label>
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
            <DialogFooter>
              <Button 
                onClick={generateSlides} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 text-white shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer {slideCount} slides
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
          <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                <Presentation className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">{presentationTitle}</h3>
                <p className="text-sm text-muted-foreground">{currentIndex + 1} / {slides.length}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} title="Plein écran" className="hover:bg-primary/10">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={exportToHTML} title="Télécharger HTML" className="hover:bg-primary/10">
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
                  currentSlide.type === 'title' && "bg-gradient-to-br from-primary via-cyan-500 to-teal-500",
                  currentSlide.type === 'conclusion' && "bg-gradient-to-br from-cyan-500 via-primary to-violet-500",
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
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400">{currentSlide.title}</h2>
                    <div className="grid grid-cols-3 gap-6">
                      {currentSlide.stats?.map((stat, i) => (
                        <div key={i} className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                          <span className="text-4xl mb-2 block">{stat.icon}</span>
                          <span className="text-4xl md:text-5xl font-bold text-cyan-400 block">{stat.value}</span>
                          <span className="text-sm md:text-base opacity-80 mt-2 block">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Timeline Slide */}
                {currentSlide.type === 'timeline' && (
                  <div className="w-full max-w-4xl space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400">{currentSlide.title}</h2>
                    <div className="relative">
                      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-primary -translate-x-1/2" />
                      <div className="space-y-6">
                        {currentSlide.steps?.map((step, i) => (
                          <div key={i} className={cn("flex items-center gap-4", i % 2 === 0 ? "flex-row" : "flex-row-reverse")}>
                            <div className={cn("flex-1 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20", i % 2 === 0 ? "text-right" : "text-left")}>
                              <h3 className="font-bold text-cyan-400">{step.title}</h3>
                              <p className="text-sm opacity-80">{step.description}</p>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-cyan-400 border-4 border-slate-900 z-10 shrink-0" />
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
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400">{currentSlide.title}</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                        <h3 className="text-xl font-bold mb-4 text-cyan-400">{currentSlide.leftTitle}</h3>
                        <ul className="space-y-2">
                          {currentSlide.leftBullets?.map((bullet, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-cyan-400 shrink-0" />
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
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400">{currentSlide.title}</h2>
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
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-cyan-400">{currentSlide.title}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {currentSlide.items?.map((item, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-center">
                          <span className="text-4xl mb-3 block">{item.emoji}</span>
                          <h3 className="font-bold text-cyan-400 mb-1">{item.title}</h3>
                          <p className="text-sm opacity-80">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Content Slide */}
                {currentSlide.type === 'content' && (
                  <div className="w-full max-w-3xl space-y-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-cyan-400">{currentSlide.title}</h2>
                    {currentSlide.bullets && (
                      <ul className="space-y-4">
                        {currentSlide.bullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-4 text-lg md:text-xl">
                            <span className="w-2 h-2 mt-2.5 rounded-full bg-cyan-400 shrink-0" />
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
                      ? "bg-gradient-to-r from-primary to-cyan-500 scale-125" 
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
