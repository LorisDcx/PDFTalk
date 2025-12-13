'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  GraduationCap, 
  FileText, 
  Search, 
  ChevronLeft,
  Sparkles,
  Calendar,
  Layers,
  Download,
  Play,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Circle,
  RotateCcw,
  Grid3X3
} from 'lucide-react'
import { cn } from '@/lib/utils'

type CardStatus = 'new' | 'success' | 'hard' | 'failed'

interface FlashcardItem {
  id: string
  question: string
  answer: string
  status: CardStatus
}

interface FlashcardSet {
  id: string
  document_id: string
  document_name: string
  cards_count: number
  created_at: string
  cards: FlashcardItem[]
  stats: {
    new: number
    success: number
    hard: number
    failed: number
  }
}

const STATUS_CONFIG = {
  new: { icon: Circle, color: 'text-gray-400', bg: 'bg-gray-100 dark:bg-gray-800', label: 'Nouveau' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Réussi' },
  hard: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Difficile' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30', label: 'À revoir' },
}

export default function FlashcardsPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSet, setSelectedSet] = useState<FlashcardSet | null>(null)
  const [studyMode, setStudyMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cardStatuses, setCardStatuses] = useState<Record<string, CardStatus>>({})

  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router])

  // Load saved statuses from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cramdesk-flashcard-statuses')
    if (saved) {
      setCardStatuses(JSON.parse(saved))
    }
  }, [])

  // Save statuses to localStorage
  const saveStatus = (cardId: string, status: CardStatus) => {
    const newStatuses = { ...cardStatuses, [cardId]: status }
    setCardStatuses(newStatuses)
    localStorage.setItem('cramdesk-flashcard-statuses', JSON.stringify(newStatuses))
  }

  useEffect(() => {
    async function fetchFlashcards() {
      if (!user) return
      
      const supabase = createClient()
      
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

      const groupedByDocument = flashcardsData?.reduce((acc, card: any) => {
        const docId = card.document_id
        if (!acc[docId]) {
          acc[docId] = {
            id: docId,
            document_id: docId,
            document_name: card.documents.file_name,
            cards_count: 0,
            created_at: card.created_at,
            cards: [],
            stats: { new: 0, success: 0, hard: 0, failed: 0 }
          }
        }
        const status = cardStatuses[card.id] || 'new'
        acc[docId].cards.push({
          id: card.id,
          question: card.question,
          answer: card.answer,
          status
        })
        acc[docId].cards_count = acc[docId].cards.length
        acc[docId].stats[status]++
        return acc
      }, {} as Record<string, FlashcardSet>) || {}

      setFlashcardSets(Object.values(groupedByDocument))
      setLoading(false)
    }

    fetchFlashcards()
  }, [user, cardStatuses])

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

  const handleStatusChange = (cardId: string, status: CardStatus) => {
    saveStatus(cardId, status)
    if (selectedSet) {
      const updatedCards = selectedSet.cards.map(c => 
        c.id === cardId ? { ...c, status } : c
      )
      const stats = { new: 0, success: 0, hard: 0, failed: 0 }
      updatedCards.forEach(c => stats[c.status]++)
      setSelectedSet({ ...selectedSet, cards: updatedCards, stats })
    }
  }

  const resetProgress = (set: FlashcardSet) => {
    const newStatuses = { ...cardStatuses }
    set.cards.forEach(card => {
      delete newStatuses[card.id]
    })
    setCardStatuses(newStatuses)
    localStorage.setItem('cramdesk-flashcard-statuses', JSON.stringify(newStatuses))
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

  // Study mode - single card view
  if (selectedSet && studyMode) {
    const currentCard = selectedSet.cards[currentIndex]
    
    return (
      <div className="container max-w-4xl py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setStudyMode(false)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back')}
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

        <div 
          className="relative h-[350px] cursor-pointer"
          onClick={() => setIsFlipped(!isFlipped)}
        >
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
            <p className="text-xs text-muted-foreground mt-6">👆 {t('clickToRevealAnswer')}</p>
          </div>
          
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

        {/* Status buttons */}
        {isFlipped && (
          <div className="flex justify-center gap-3 mt-6">
            {(['failed', 'hard', 'success'] as CardStatus[]).map((status) => {
              const config = STATUS_CONFIG[status]
              const Icon = config.icon
              return (
                <Button
                  key={status}
                  variant="outline"
                  className={cn(
                    "gap-2",
                    currentCard?.status === status && config.bg
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStatusChange(currentCard.id, status)
                    if (currentIndex < selectedSet.cards.length - 1) {
                      setCurrentIndex(currentIndex + 1)
                      setIsFlipped(false)
                    }
                  }}
                >
                  <Icon className={cn("h-4 w-4", config.color)} />
                  {config.label}
                </Button>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-6">
          <Button 
            variant="outline" 
            onClick={() => { setCurrentIndex(Math.max(0, currentIndex - 1)); setIsFlipped(false) }}
            disabled={currentIndex === 0}
          >
            {t('previous')}
          </Button>
          
          <div className="flex gap-1.5 max-w-[200px] overflow-x-auto py-2">
            {selectedSet.cards.map((card, i) => {
              const config = STATUS_CONFIG[card.status]
              return (
                <button
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all shrink-0 border-2",
                    i === currentIndex ? "scale-125 border-primary" : "border-transparent",
                    config.bg
                  )}
                  onClick={() => { setCurrentIndex(i); setIsFlipped(false) }}
                />
              )
            })}
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

  // Document detail view - grid of cards
  if (selectedSet && !studyMode) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedSet(null)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              {t('back')}
            </Button>
            <div>
              <h1 className="text-xl font-bold">{selectedSet.document_name.replace(/\.pdf$/i, '')}</h1>
              <p className="text-sm text-muted-foreground">{selectedSet.cards_count} flashcards</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => resetProgress(selectedSet)}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportToCSV(selectedSet)}>
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-primary to-orange-500" onClick={() => { setStudyMode(true); setCurrentIndex(0); setIsFlipped(false) }}>
              <Play className="h-4 w-4 mr-2" />
              Réviser
            </Button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex gap-4 mb-6 p-4 rounded-xl bg-muted/30">
          {(Object.keys(STATUS_CONFIG) as CardStatus[]).map((status) => {
            const config = STATUS_CONFIG[status]
            const Icon = config.icon
            const count = selectedSet.stats[status]
            return (
              <div key={status} className="flex items-center gap-2">
                <Icon className={cn("h-4 w-4", config.color)} />
                <span className="text-sm font-medium">{count}</span>
                <span className="text-xs text-muted-foreground">{config.label}</span>
              </div>
            )
          })}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {selectedSet.cards.map((card, index) => {
            const config = STATUS_CONFIG[card.status]
            const Icon = config.icon
            return (
              <Card 
                key={card.id}
                className={cn(
                  "cursor-pointer hover:shadow-md transition-all group relative overflow-hidden",
                  config.bg
                )}
                onClick={() => { setStudyMode(true); setCurrentIndex(index); setIsFlipped(false) }}
              >
                <div className="absolute top-2 right-2">
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <CardContent className="p-4">
                  <p className="text-xs font-medium line-clamp-3 pr-4">{card.question}</p>
                  <div className="mt-2 pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground line-clamp-2">{card.answer}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Main view - document compartments
  return (
    <div className="container max-w-6xl py-8">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/5 to-orange-500/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalCards}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-emerald-50 dark:bg-emerald-950/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{flashcardSets.reduce((sum, s) => sum + s.stats.success, 0)}</p>
              <p className="text-xs text-muted-foreground">Réussies</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{flashcardSets.reduce((sum, s) => sum + s.stats.hard, 0)}</p>
              <p className="text-xs text-muted-foreground">Difficiles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm bg-red-50 dark:bg-red-950/20">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{flashcardSets.reduce((sum, s) => sum + s.stats.failed, 0)}</p>
              <p className="text-xs text-muted-foreground">À revoir</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Document Compartments */}
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
              className="group cursor-pointer hover:shadow-lg hover:border-primary/30 transition-all overflow-hidden"
              onClick={() => setSelectedSet(set)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <Grid3X3 className="h-6 w-6 text-white" />
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
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(set.created_at)}</span>
                </div>
                
                {/* Progress mini stats */}
                <div className="flex gap-2 mb-4">
                  {set.stats.success > 0 && (
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600">
                      <CheckCircle className="h-3 w-3" />
                      {set.stats.success}
                    </div>
                  )}
                  {set.stats.hard > 0 && (
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600">
                      <AlertCircle className="h-3 w-3" />
                      {set.stats.hard}
                    </div>
                  )}
                  {set.stats.failed > 0 && (
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600">
                      <XCircle className="h-3 w-3" />
                      {set.stats.failed}
                    </div>
                  )}
                  {set.stats.new > 0 && (
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600">
                      <Circle className="h-3 w-3" />
                      {set.stats.new}
                    </div>
                  )}
                </div>
                
                {/* Progress bar */}
                <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                  {set.stats.success > 0 && (
                    <div className="bg-emerald-500" style={{ width: `${(set.stats.success / set.cards_count) * 100}%` }} />
                  )}
                  {set.stats.hard > 0 && (
                    <div className="bg-amber-500" style={{ width: `${(set.stats.hard / set.cards_count) * 100}%` }} />
                  )}
                  {set.stats.failed > 0 && (
                    <div className="bg-red-500" style={{ width: `${(set.stats.failed / set.cards_count) * 100}%` }} />
                  )}
                </div>
                
                <Button size="sm" className="w-full mt-4 bg-gradient-to-r from-primary to-orange-500 hover:opacity-90">
                  <Play className="h-3 w-3 mr-1" />
                  Ouvrir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
