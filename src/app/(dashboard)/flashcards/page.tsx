'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  GraduationCap, 
  FileText, 
  Search, 
  ChevronRight,
  Sparkles,
  Calendar,
  Layers,
  Download,
  Play,
  Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface FlashcardSet {
  id: string
  document_id: string
  document_name: string
  cards_count: number
  created_at: string
  cards: Array<{
    id: string
    question: string
    answer: string
  }>
}

export default function FlashcardsPage() {
  const { user, profile } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  useEffect(() => {
    async function fetchFlashcards() {
      if (!user) return
      
      const supabase = createClient()
      
      // Fetch all flashcard sets with their documents
      const { data: flashcardsData, error } = await supabase
        .from('flashcards')
        .select(`
          id,
          question,
          answer,
          created_at,
          document_id,
          documents!inner(id, file_name)
        `)
        .eq('documents.user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching flashcards:', error)
        setLoading(false)
        return
      }

      // Group flashcards by document
      const groupedByDocument = flashcardsData?.reduce((acc, card: any) => {
        const docId = card.document_id
        if (!acc[docId]) {
          acc[docId] = {
            id: docId,
            document_id: docId,
            document_name: card.documents.file_name,
            cards_count: 0,
            created_at: card.created_at,
            cards: []
          }
        }
        acc[docId].cards.push({
          id: card.id,
          question: card.question,
          answer: card.answer
        })
        acc[docId].cards_count = acc[docId].cards.length
        return acc
      }, {} as Record<string, FlashcardSet>) || {}

      setFlashcardSets(Object.values(groupedByDocument))
      setLoading(false)
    }

    fetchFlashcards()
  }, [user])

  const filteredSets = flashcardSets.filter(set => 
    set.document_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalCards = flashcardSets.reduce((sum, set) => sum + set.cards_count, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const exportToCSV = (set: FlashcardSet) => {
    const csvContent = set.cards
      .map(card => `"${card.question.replace(/"/g, '""')}","${card.answer.replace(/"/g, '""')}"`)
      .join('\n')
    const blob = new Blob([`Question,Answer\n${csvContent}`], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flashcards-${set.document_name.replace(/\.pdf$/i, '')}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full blur-xl opacity-30 animate-pulse" />
            <Loader2 className="h-8 w-8 animate-spin text-primary relative" />
          </div>
          <span className="text-sm text-muted-foreground">{t('processing')}</span>
        </div>
      </div>
    )
  }

  // Study mode view
  if (selectedSet) {
    const currentCard = selectedSet.cards[currentIndex]
    
    return (
      <div className="container max-w-4xl py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedSet(null)}>
              ← {t('back')}
            </Button>
            <div>
              <h1 className="text-xl font-bold">{selectedSet.document_name.replace(/\.pdf$/i, '')}</h1>
              <p className="text-sm text-muted-foreground">{currentIndex + 1} / {selectedSet.cards.length}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => exportToCSV(selectedSet)}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>

        {/* Card */}
        <div 
          className="relative h-[400px] cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Question Side */}
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500",
              "bg-gradient-to-br from-primary/10 to-orange-500/10 border-2 border-primary/20 shadow-xl",
              !isFlipped ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}
          >
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 px-3 py-1 bg-primary/10 rounded-full">
              {t('question')}
            </span>
            <p className="text-xl font-medium leading-relaxed">{currentCard?.question}</p>
            <p className="text-xs text-muted-foreground mt-6">
              👆 {t('clickToRevealAnswer')}
            </p>
          </div>
          
          {/* Answer Side */}
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-500",
              "bg-gradient-to-br from-emerald-50 to-orange-50 dark:from-emerald-950 dark:to-orange-950 border-2 border-emerald-200 dark:border-emerald-800 shadow-xl",
              isFlipped ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            )}
          >
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-4 px-3 py-1 bg-emerald-500/10 rounded-full">
              {t('answer')}
            </span>
            <p className="text-lg leading-relaxed">{currentCard?.answer}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setIsFlipped(false) }}
            disabled={currentIndex === 0}
          >
            {t('previous')}
          </Button>
          
          <div className="flex gap-1.5 max-w-[200px] overflow-x-auto py-2">
            {selectedSet.cards.map((_, i) => (
              <button
                key={i}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all shrink-0",
                  i === currentIndex 
                    ? "bg-gradient-to-r from-primary to-orange-500 scale-125" 
                    : "bg-muted hover:bg-muted-foreground/30"
                )}
                onClick={() => { setCurrentIndex(i); setIsFlipped(false) }}
              />
            ))}
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => { setCurrentIndex(Math.min(selectedSet.cards.length - 1, currentIndex + 1)); setIsFlipped(false) }}
            disabled={currentIndex === selectedSet.cards.length - 1}
          >
            {t('next')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t('flashcards')}</h1>
            <p className="text-sm text-muted-foreground">
              {totalCards} {t('cards')} • {flashcardSets.length} {t('documents')}
            </p>
          </div>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-orange-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCards}</p>
              <p className="text-xs text-muted-foreground">{t('flashcards')} total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-500/5 to-red-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{flashcardSets.length}</p>
              <p className="text-xs text-muted-foreground">{t('documents')}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-500/5 to-purple-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-violet-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{flashcardSets.length > 0 ? Math.round(totalCards / flashcardSets.length) : 0}</p>
              <p className="text-xs text-muted-foreground">moy. par doc</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Flashcard Sets Grid */}
      {filteredSets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">
              {searchQuery ? t('noResults') : 'Aucune flashcard'}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              {searchQuery 
                ? 'Essayez un autre terme de recherche'
                : 'Générez des flashcards depuis vos documents pour les retrouver ici'
              }
            </p>
            {!searchQuery && (
              <Button className="mt-4" onClick={() => router.push('/dashboard')}>
                <FileText className="h-4 w-4 mr-2" />
                Voir mes documents
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSets.map((set) => (
            <Card 
              key={set.id} 
              className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all"
              onClick={() => { setSelectedSet(set); setCurrentIndex(0); setIsFlipped(false) }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {set.cards_count} {t('cards')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                  {set.document_name.replace(/\.pdf$/i, '')}
                </h3>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(set.created_at)}</span>
                </div>
                
                {/* Preview */}
                <div className="mt-4 p-3 rounded-lg bg-muted/50 text-xs">
                  <p className="font-medium text-primary mb-1">Q: {set.cards[0]?.question.slice(0, 60)}...</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="flex-1 bg-gradient-to-r from-primary to-orange-500 hover:opacity-90">
                    <Play className="h-3 w-3 mr-1" />
                    {t('view')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => { e.stopPropagation(); exportToCSV(set) }}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
