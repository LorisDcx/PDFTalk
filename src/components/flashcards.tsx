'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Download,
  Shuffle,
  Sparkles,
  GraduationCap,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Flashcard {
  id: string
  question: string
  answer: string
}

interface FlashcardsProps {
  documentId: string
  documentContent: string
  documentName: string
}

export function Flashcards({ documentId, documentContent, documentName }: FlashcardsProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [cardCount, setCardCount] = useState(20)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showViewer, setShowViewer] = useState(false)

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
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate flashcards')
      }

      setFlashcards(data.flashcards)
      setCurrentIndex(0)
      setIsFlipped(false)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Flashcard generation error:', error)
    } finally {
      setIsGenerating(false)
    }
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

  const currentCard = flashcards[currentIndex]

  return (
    <>
      {/* Trigger Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
            <GraduationCap className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span>Flashcards</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl">Générer des Flashcards</DialogTitle>
                <DialogDescription>
                  Créez des cartes mémoire pour réviser
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardCount" className="text-sm font-medium">Nombre de flashcards</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={cardCount}
                  onChange={(e) => setCardCount(parseInt(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="text-2xl font-bold text-primary w-12">{cardCount}</span>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {[20, 50, 100].map((num) => (
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
                  {num} cartes
                </button>
              ))}
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
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Générer {cardCount} flashcards
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flashcard Viewer Modal */}
      {flashcards.length > 0 && (
        <Dialog open={flashcards.length > 0} onOpenChange={() => setFlashcards([])}>
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
                  <Button variant="ghost" size="icon" onClick={shuffleCards} title="Mélanger" className="hover:bg-primary/10">
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={resetCards} title="Recommencer" className="hover:bg-primary/10">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={exportToCSV} title="Exporter CSV" className="hover:bg-primary/10">
                    <Download className="h-4 w-4" />
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
                    Question
                  </span>
                  <p className="text-lg font-medium leading-relaxed">{currentCard?.question}</p>
                  <p className="text-xs text-muted-foreground mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    👆 Cliquez pour révéler la réponse
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
                    Réponse
                  </span>
                  <p className="text-base leading-relaxed">{currentCard?.answer}</p>
                  <p className="text-xs text-muted-foreground mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    👆 Cliquez pour voir la question
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
                  Précédent
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
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
