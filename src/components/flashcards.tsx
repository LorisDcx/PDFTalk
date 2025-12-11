'use client'

import { useState, useEffect } from 'react'
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
  RotateCcw,
  Download,
  Shuffle,
  Sparkles,
  GraduationCap,
  Trash2,
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

interface Flashcard {
  id: string
  question: string
  answer: string
  sourceRef?: string // e.g., "Page 5, ligne 12"
}

interface FlashcardsProps {
  documentId: string
  documentContent: string
  documentName: string
  onFlashcardsChange?: (flashcards: Flashcard[]) => void
}

export function Flashcards({ documentId, documentContent, documentName, onFlashcardsChange }: FlashcardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [cardCount, setCardCount] = useState(20)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const { t, language } = useLanguage()
  const { toast } = useToast()

  // Load existing flashcards from localStorage on mount
  useEffect(() => {
    loadFlashcards()
  }, [documentId])

  const loadFlashcards = () => {
    try {
      const stored = localStorage.getItem(`flashcards-${documentId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.length > 0) {
          setFlashcards(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load flashcards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem(`flashcards-${documentId}`, JSON.stringify(flashcards))
      onFlashcardsChange?.(flashcards)
    }
  }, [flashcards, documentId, onFlashcardsChange])

  const generateFlashcards = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          documentContent,
          count: cardCount,
          language,
        }),
      })

      // Handle non-streaming error responses (auth, quota, etc.)
      if (!response.ok && response.headers.get('content-type')?.includes('application/json')) {
        const data = await response.json()
        if (response.status === 403) {
          toast({
            title: t('insufficientPages'),
            description: data.error,
            variant: 'destructive',
          })
          setIsDialogOpen(false)
          return
        }
        throw new Error(data.error || 'Failed to generate flashcards')
      }

      // Handle SSE streaming response
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (value) {
          buffer += decoder.decode(value, { stream: true })
        }
        
        // Process all complete events in buffer
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))
              
              if (event.type === 'error') {
                throw new Error(event.message)
              }
              
              if (event.type === 'complete') {
                setFlashcards(event.flashcards)
                setCurrentIndex(0)
                setIsFlipped(false)
                setIsDialogOpen(false)
                setIsViewerOpen(true)
              }
            } catch (parseError) {
              // Ignore parse errors for incomplete chunks
              if (parseError instanceof SyntaxError) continue
              throw parseError
            }
          }
        }
        
        if (done) break
      }
      
      // Process any remaining data in buffer after stream ends
      if (buffer.trim()) {
        const remainingLines = buffer.split('\n\n')
        for (const line of remainingLines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))
              if (event.type === 'error') {
                throw new Error(event.message)
              }
              if (event.type === 'complete') {
                setFlashcards(event.flashcards)
                setCurrentIndex(0)
                setIsFlipped(false)
                setIsDialogOpen(false)
                setIsViewerOpen(true)
              }
            } catch (parseError) {
              console.error('Final buffer parse error:', parseError)
            }
          }
        }
      }
    } catch (error) {
      console.error('Flashcard generation error:', error)
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const deleteFlashcards = () => {
    localStorage.removeItem(`flashcards-${documentId}`)
    setFlashcards([])
    setIsViewerOpen(false)
  }

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setFlashcards(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const resetCards = () => {
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const exportToCSV = () => {
    const csv = flashcards
      .map(card => `"${card.question.replace(/"/g, '""')}","${card.answer.replace(/"/g, '""')}"`)
      .join('\n')
    const header = '"Question","Answer"\n'
    const blob = new Blob([header + csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flashcards-${documentName.replace(/\.[^/.]+$/, '')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const translateFlashcards = async (targetLang: string) => {
    if (flashcards.length === 0) return
    setIsTranslating(true)
    
    try {
      const content = flashcards.map(c => `Q: ${c.question}\nA: ${c.answer}`).join('\n\n---\n\n')
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, targetLanguage: targetLang }),
      })
      
      if (!response.ok) throw new Error('Translation failed')
      
      const { translatedText } = await response.json()
      const parts = translatedText.split(/---/).map((p: string) => p.trim()).filter(Boolean)
      
      const translated = parts.map((part: string, i: number) => {
        const qMatch = part.match(/Q:\s*([^\n]+)/)
        const aMatch = part.match(/A:\s*(.+)/)
        return {
          id: flashcards[i]?.id || `card-${i}`,
          question: qMatch?.[1]?.trim() || flashcards[i]?.question || '',
          answer: aMatch?.[1]?.trim() || flashcards[i]?.answer || '',
        }
      })
      
      setFlashcards(translated)
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  const currentCard = flashcards[currentIndex]

  return (
    <>
      {/* Trigger Buttons */}
      <div className="flex gap-2">
        {/* View existing flashcards */}
        {flashcards.length > 0 && !isLoading && (
          <Button 
            variant="outline" 
            className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={() => setIsViewerOpen(true)}
          >
            <GraduationCap className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span>Flashcards ({flashcards.length})</span>
          </Button>
        )}

        {/* Generate new flashcards */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
              <GraduationCap className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span>{flashcards.length > 0 ? t('regenerate') : t('flashcards')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    {t('generateFlashcards')}
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">Beta</span>
                  </DialogTitle>
                  <DialogDescription>
                    {t('flashcardsDesc')}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cardCount" className="text-sm font-medium">{t('numberOfCards')}</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={cardCount}
                    onChange={(e) => setCardCount(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-2xl font-bold text-primary w-12">{cardCount}</span>
                </div>
                {/* Estimated time indicator */}
                <p className="text-xs text-muted-foreground text-center">
                  ⏱️ {cardCount >= 50 ? t('canTakeUpTo2Min') : t('canTakeUpTo1Min')}
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {[10, 20, 50].map((num) => (
                  <button
                    key={num}
                    onClick={() => setCardCount(num)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium transition-all",
                      cardCount === num 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {num} {t('cards')}
                  </button>
                ))}
              </div>
              {/* Page cost indicator */}
              <div className="flex items-center justify-center p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  💰 {t('pageCost').replace('{count}', String(Math.ceil(cardCount / 5)))}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={generateFlashcards} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 text-white shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('generatingCards')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('generate')} {cardCount} {t('flashcards')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Flashcard Viewer Modal */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Flashcards</h3>
                    <p className="text-sm text-muted-foreground">{currentIndex + 1} / {flashcards.length}</p>
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
                        <DropdownMenuItem key={lang.code} onClick={() => translateFlashcards(lang.name)}>
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="ghost" size="icon" onClick={shuffleCards} title={t('shuffle')} className="hover:bg-primary/10">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={resetCards} title={t('restart')} className="hover:bg-primary/10">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={exportToCSV} title={t('exportCSV')} className="hover:bg-primary/10">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={deleteFlashcards} title={t('delete')} className="hover:bg-destructive/10 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="p-6">
              <div 
                className="relative h-64 cursor-pointer group"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Question Side */}
                <div 
                  className={cn(
                    "absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500",
                    "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-2 shadow-xl",
                    isFlipped ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                  )}
                >
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 px-3 py-1 bg-primary/10 rounded-full">
                    {t('question')}
                  </span>
                  <p className="text-lg font-medium leading-relaxed">{currentCard?.question}</p>
                  <p className="text-xs text-muted-foreground mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    👆 {t('clickToRevealAnswer')}
                  </p>
                </div>
                
                {/* Answer Side */}
                <div 
                  className={cn(
                    "absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500",
                    "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 border-2 border-emerald-200 dark:border-emerald-800 shadow-xl",
                    isFlipped ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  )}
                >
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 px-3 py-1 bg-emerald-500/10 rounded-full">
                    {t('answer')}
                  </span>
                  <p className="text-base leading-relaxed">{currentCard?.answer}</p>
                  {currentCard?.sourceRef && (
                    <p className="text-xs text-muted-foreground mt-4 px-2 py-1 bg-muted/50 rounded">
                      📍 {currentCard.sourceRef}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    👆 {t('clickToShowQuestion')}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button 
                  variant="outline" 
                  onClick={prevCard}
                  disabled={currentIndex === 0}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('previous')}
                </Button>
                
                {/* Progress dots */}
                <div className="flex gap-1.5 max-w-[200px] overflow-x-auto py-2">
                  {flashcards.map((_, i) => (
                    <button
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all shrink-0",
                        i === currentIndex 
                          ? "bg-gradient-to-r from-primary to-cyan-500 scale-125" 
                          : "bg-muted hover:bg-muted-foreground/30"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIndex(i)
                        setIsFlipped(false)
                      }}
                    />
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={nextCard}
                  disabled={currentIndex === flashcards.length - 1}
                  className="gap-2"
                >
                  {t('next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
    </>
  )
}
