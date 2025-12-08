'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Shuffle
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
  const [cardCount, setCardCount] = useState(5)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Layers className="h-4 w-4" />
            Flashcards
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Générer des Flashcards</DialogTitle>
            <DialogDescription>
              Créez des cartes mémoire pour réviser les concepts clés de ce document.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="cardCount">Nombre de flashcards</Label>
            <Input
              id="cardCount"
              type="number"
              min={3}
              max={20}
              value={cardCount}
              onChange={(e) => setCardCount(Math.min(20, Math.max(3, parseInt(e.target.value) || 5)))}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Entre 3 et 20 flashcards recommandé
            </p>
          </div>
          <DialogFooter>
            <Button onClick={generateFlashcards} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Layers className="h-4 w-4 mr-2" />
                  Générer {cardCount} flashcards
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Flashcard viewer */}
      {flashcards.length > 0 && (
        <Card className="mt-4">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Flashcard {currentIndex + 1} / {flashcards.length}
              </CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={shuffleCards} title="Mélanger">
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={resetCards} title="Recommencer">
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={exportToCSV} title="Exporter CSV">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Card */}
            <div 
              className={cn(
                "relative h-48 cursor-pointer perspective-1000",
                "transition-transform duration-500 transform-style-3d",
                isFlipped && "rotate-y-180"
              )}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div 
                className={cn(
                  "absolute inset-0 rounded-lg p-6 flex items-center justify-center text-center",
                  "backface-hidden transition-all duration-300",
                  isFlipped ? "opacity-0" : "opacity-100",
                  "bg-gradient-to-br from-primary/10 to-primary/5 border"
                )}
              >
                <div>
                  <p className="text-xs text-muted-foreground mb-2">QUESTION</p>
                  <p className="font-medium">{currentCard?.question}</p>
                  <p className="text-xs text-muted-foreground mt-4">Cliquez pour voir la réponse</p>
                </div>
              </div>
              
              <div 
                className={cn(
                  "absolute inset-0 rounded-lg p-6 flex items-center justify-center text-center",
                  "backface-hidden transition-all duration-300",
                  isFlipped ? "opacity-100" : "opacity-0",
                  "bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20"
                )}
              >
                <div>
                  <p className="text-xs text-green-600 mb-2">RÉPONSE</p>
                  <p className="text-sm">{currentCard?.answer}</p>
                  <p className="text-xs text-muted-foreground mt-4">Cliquez pour voir la question</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={prevCard}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Précédent
              </Button>
              
              <div className="flex gap-1">
                {flashcards.map((_, i) => (
                  <button
                    key={i}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      i === currentIndex ? "bg-primary" : "bg-muted"
                    )}
                    onClick={() => {
                      setCurrentIndex(i)
                      setIsFlipped(false)
                    }}
                  />
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={nextCard}
                disabled={currentIndex === flashcards.length - 1}
              >
                Suivant
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
