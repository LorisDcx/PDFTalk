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
import { createClient } from '@/lib/supabase/client'
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

export function Flashcards({ documentId, documentName, onFlashcardsChange }: FlashcardsProps) {
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

  // The database is the source of truth across devices; local storage covers offline sessions.
  useEffect(() => {
    let active = true
    const loadCards = async () => {
      try {
        const stored = localStorage.getItem(`flashcards-${documentId}`)
        const { data, error } = await createClient().from('flashcards')
          .select('id, question, answer, source_ref')
          .eq('document_id', documentId)
          .order('order_index', { ascending: true })
        if (!active) return
        if (!error && data) {
          setFlashcards(data.map(card => ({
            id: card.id,
            question: card.question,
            answer: card.answer,
            sourceRef: card.source_ref || undefined,
          })))
          if (data.length === 0) localStorage.removeItem(`flashcards-${documentId}`)
        } else if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0) setFlashcards(parsed)
        }
      } catch (error) {
        console.error('Failed to load flashcards:', error)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    void loadCards()
    return () => { active = false }
  }, [documentId])

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    if (flashcards.length > 0) {
      localStorage.setItem(`flashcards-${documentId}`, JSON.stringify(flashcards))
    }
    onFlashcardsChange?.(flashcards)
  }, [flashcards, documentId, onFlashcardsChange])

  const generateFlashcards = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          count: cardCount,
          language,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
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

      setFlashcards(data.flashcards)
      setCurrentIndex(0)
      setIsFlipped(false)
      setIsDialogOpen(false)
      setIsViewerOpen(true)
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

  const deleteFlashcards = async () => {
    const { error } = await createClient().from('flashcards').delete().eq('document_id', documentId)
    if (error) {
      toast({ title: t('error'), description: t('unexpectedError'), variant: 'destructive' })
      return
    }
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
      <div className="flex flex-wrap gap-2">
        {/* View existing flashcards */}
        {flashcards.length > 0 && !isLoading && (
          <Button 
            variant="outline" 
            className="group gap-2 border-[#e3cbbf] bg-white text-[#b84432] hover:border-[#b897ae] hover:bg-[#faf4f8]"
            onClick={() => setIsViewerOpen(true)}
          >
            <GraduationCap className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span>Flashcards ({flashcards.length})</span>
          </Button>
        )}

        {/* Generate new flashcards */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="group gap-2 border-[#e3cbbf] bg-white text-[#b84432] hover:border-[#b897ae] hover:bg-[#faf4f8]">
              <GraduationCap className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span>{flashcards.length > 0 ? t('regenerate') : t('flashcards')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto border-[#ead9cf] bg-[#fffaf5] sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-[#b84432]">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="font-editorial flex flex-wrap items-center gap-2 text-2xl">
                    {t('generateFlashcards')}
                    <span className="rounded-full border border-[#dec9d8] bg-[#f6e9f2] px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wide text-[#80516f]">Beta</span>
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
                    max={200}
                    step={10}
                    value={cardCount}
                    onChange={(e) => setCardCount(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="font-editorial w-12 text-3xl text-[#b84432]">{cardCount}</span>
                </div>
                {/* Estimated time indicator */}
                <p className="text-xs text-muted-foreground text-center">
                  ⏱️ {cardCount >= 30 ? t('canTakeUpTo2Min') : t('canTakeUpTo1Min')}
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {[10, 20, 50, 100].map((num) => (
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
              <div className="flex items-center justify-center rounded-xl border border-[#e9dfe6] bg-[#f7f0f5] p-3">
                <span className="text-sm font-medium text-[#b84432]">
                  💰 {t('pageCost').replace('{count}', String(Math.ceil(cardCount / 5)))}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={generateFlashcards} 
                disabled={isGenerating}
                className="min-h-11 w-full bg-[#b84432] text-white hover:bg-[#963326]"
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
        <DialogContent className="max-h-[94vh] overflow-y-auto border-[#ead9cf] bg-[#fffaf5] p-0 sm:max-w-2xl">
            {/* Header */}
            <div className="border-b border-[#ead9cf] bg-[#f7eff4] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-[#b84432]">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-editorial text-2xl">Flashcards</h3>
                    <p className="text-sm text-muted-foreground">{currentIndex + 1} / {flashcards.length}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" title={t('translateContent')} aria-label={t('translateContent')} className="hover:bg-primary/10" disabled={isTranslating}>
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
                  <Button variant="ghost" size="icon" onClick={shuffleCards} title={t('shuffle')} aria-label={t('shuffle')} className="hover:bg-primary/10">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={resetCards} title={t('restart')} aria-label={t('restart')} className="hover:bg-primary/10">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={exportToCSV} title={t('exportCSV')} aria-label={t('exportCSV')} className="hover:bg-primary/10">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={deleteFlashcards} title={t('delete')} aria-label={t('delete')} className="hover:bg-destructive/10 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Card */}
            <div className="p-4 sm:p-6">
              <button type="button"
                aria-label={isFlipped ? t('clickToShowQuestion') : t('clickToRevealAnswer')}
                className="group relative block h-64 w-full cursor-pointer text-center sm:h-72"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Question Side */}
                <div 
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center overflow-y-auto rounded-2xl border border-[#e4d5df] bg-[#f6edf3] p-6 text-center shadow-[0_20px_45px_-30px_rgba(65,37,58,.35)] transition-all duration-500 sm:p-8",
                    isFlipped ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
                  )}
                >
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 px-3 py-1 bg-primary/10 rounded-full">
                    {t('question')}
                  </span>
                  <p className="font-editorial text-xl leading-relaxed sm:text-2xl">{currentCard?.question}</p>
                  <p className="text-xs text-muted-foreground mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    👆 {t('clickToRevealAnswer')}
                  </p>
                </div>
                
                {/* Answer Side */}
                <div 
                  className={cn(
                    "absolute inset-0 flex flex-col items-center justify-center overflow-y-auto rounded-2xl border border-[#dce5da] bg-[#f1f6ef] p-6 text-center shadow-[0_20px_45px_-30px_rgba(65,75,58,.25)] transition-all duration-500 sm:p-8",
                    isFlipped ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  )}
                >
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 px-3 py-1 bg-emerald-500/10 rounded-full">
                    {t('answer')}
                  </span>
                  <p className="font-editorial text-lg leading-relaxed sm:text-2xl">{currentCard?.answer}</p>
                  {currentCard?.sourceRef && (
                    <p className="text-xs text-muted-foreground mt-4 px-2 py-1 bg-muted/50 rounded">
                      📍 {currentCard.sourceRef}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    👆 {t('clickToShowQuestion')}
                  </p>
                </div>
              </button>

              {/* Navigation */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
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
                <div className="hidden max-w-[200px] gap-1.5 overflow-x-auto py-2 sm:flex">
                  {flashcards.map((_, i) => (
                    <button
                      key={i}
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all shrink-0",
                        i === currentIndex
                          ? "bg-[#b84432] scale-125"
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
