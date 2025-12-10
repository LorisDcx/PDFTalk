'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { 
  Loader2, 
  Target,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { useToast } from '@/components/ui/use-toast'

interface QuizQuestion {
  id: string
  question: string
  correctAnswer: string
  options: string[]
  sourceRef?: string // e.g., "Page 5, ligne 12"
}

interface QuizSession {
  id: string
  date: string
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  timeSpent: number // in seconds
  wrongQuestionIds: string[]
}

interface QuizProps {
  documentId: string
  documentContent: string
  documentName: string
  flashcards?: { id: string; question: string; answer: string; sourceRef?: string }[]
}

export function Quiz({ documentId, documentContent, documentName, flashcards = [] }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [wrongQuestions, setWrongQuestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [questionCount, setQuestionCount] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [showStats, setShowStats] = useState(false)
  const { t, language } = useLanguage()
  const { toast } = useToast()

  // Max questions available (when using flashcards as source)
  const maxQuestions = flashcards.length > 0 ? Math.min(30, flashcards.length) : 30

  // Keep questionCount in a valid range when flashcards are present
  useEffect(() => {
    setQuestionCount((current) => {
      const safe = Math.min(Math.max(current, 5), maxQuestions)
      return Number.isFinite(safe) ? safe : Math.min(10, maxQuestions)
    })
  }, [maxQuestions])

  // Load existing quiz data from localStorage
  useEffect(() => {
    loadQuizData()
  }, [documentId])

  const loadQuizData = () => {
    try {
      const storedQuestions = localStorage.getItem(`quiz-questions-${documentId}`)
      const storedSessions = localStorage.getItem(`quiz-sessions-${documentId}`)
      
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions))
      }
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions))
      }
    } catch (error) {
      console.error('Failed to load quiz data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Save quiz data
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(`quiz-questions-${documentId}`, JSON.stringify(questions))
    }
  }, [questions, documentId])

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(`quiz-sessions-${documentId}`, JSON.stringify(sessions))
    }
  }, [sessions, documentId])

  const generateQuizFromFlashcards = () => {
    if (flashcards.length === 0) return

    const shuffledCards = [...flashcards].sort(() => Math.random() - 0.5)
    const selectedCards = shuffledCards.slice(0, Math.min(questionCount, flashcards.length))

    const quizQuestions: QuizQuestion[] = selectedCards.map((card, index) => {
      // Generate wrong answers from other flashcards
      const otherAnswers = flashcards
        .filter(f => f.id !== card.id)
        .map(f => f.answer)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)

      const allOptions = [card.answer, ...otherAnswers].sort(() => Math.random() - 0.5)

      return {
        id: `q-${index}`,
        question: card.question,
        correctAnswer: card.answer,
        options: allOptions.length >= 4 ? allOptions : [card.answer, 'Option A', 'Option B', 'Option C'],
        sourceRef: card.sourceRef
      }
    })

    setQuestions(quizQuestions)
    startQuiz()
  }

  const generateQuizFromAI = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          documentContent,
          count: questionCount,
          language,
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
        throw new Error(data.error || 'Failed to generate quiz')
      }

      setQuestions(data.questions)
      setIsDialogOpen(false)
      startQuiz()
    } catch (error) {
      console.error('Quiz generation error:', error)
      toast({
        title: t('error'),
        description: t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const startQuiz = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsAnswered(false)
    setScore({ correct: 0, wrong: 0 })
    setWrongQuestions([])
    setIsComplete(false)
    setIsQuizActive(true)
    setStartTime(Date.now())
    setIsDialogOpen(false)
  }

  const handleAnswer = (answer: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(answer)
    setIsAnswered(true)

    const currentQuestion = questions[currentIndex]
    const isCorrect = answer === currentQuestion.correctAnswer

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }))
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }))
      setWrongQuestions(prev => [...prev, currentQuestion.id])
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000)
    
    const newSession: QuizSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString(),
      totalQuestions: questions.length,
      correctAnswers: score.correct,
      wrongAnswers: score.wrong,
      timeSpent,
      wrongQuestionIds: wrongQuestions
    }

    setSessions(prev => [newSession, ...prev].slice(0, 20)) // Keep last 20 sessions
    setIsComplete(true)
  }

  const getStudyTips = () => {
    const tips: string[] = []
    const successRate = (score.correct / questions.length) * 100

    if (successRate < 50) {
      tips.push("📚 Revois les concepts de base avant de refaire le quiz")
      tips.push("🔄 Utilise les flashcards pour mémoriser les réponses")
    } else if (successRate < 75) {
      tips.push("💪 Bon travail ! Concentre-toi sur les questions ratées")
      tips.push("📝 Prends des notes sur les points difficiles")
    } else if (successRate < 100) {
      tips.push("🌟 Excellent ! Tu maîtrises presque tout")
      tips.push("🎯 Revois juste les quelques erreurs")
    } else {
      tips.push("🏆 Parfait ! Tu maîtrises ce sujet")
      tips.push("📈 Passe au niveau suivant ou révise un autre chapitre")
    }

    return tips
  }

  const getAverageScore = () => {
    if (sessions.length === 0) return 0
    const total = sessions.reduce((acc, s) => acc + (s.correctAnswers / s.totalQuestions) * 100, 0)
    return Math.round(total / sessions.length)
  }

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0

  return (
    <>
      {/* Trigger Buttons */}
      <div className="flex gap-2">
        {/* View stats */}
        {sessions.length > 0 && (
          <Button 
            variant="outline" 
            className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={() => setShowStats(true)}
          >
            <BarChart3 className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span>Stats</span>
          </Button>
        )}

        {/* Start quiz */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
              <Target className="h-4 w-4 group-hover:text-primary transition-colors" />
              <span>Quiz</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl">{t('quizMode')}</DialogTitle>
                  <DialogDescription>
                    {t('quizModeDesc')}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('numberOfQuestions')}</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={5}
                    max={maxQuestions}
                    step={5}
                    value={questionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-2xl font-bold text-primary w-12">{questionCount}</span>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[5, 10, 20]
                  .filter((num) => num <= maxQuestions)
                  .map((num) => (
                  <button
                    key={num}
                    onClick={() => setQuestionCount(num)}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium transition-all",
                      questionCount === num 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {num} {t('questions')}
                  </button>
                ))}
              </div>
              {/* Page cost indicator */}
              <div className="flex items-center justify-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  💰 {t('pageCost').replace('{count}', String(Math.ceil(questionCount / 5)))}
                </span>
              </div>
            </div>
            <DialogFooter className="flex-col gap-2">
              {flashcards.length > 0 && (
                <Button 
                  onClick={generateQuizFromFlashcards}
                  className="w-full"
                  variant="outline"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t('quizFromFlashcards')} ({flashcards.length})
                </Button>
              )}
              <Button 
                onClick={generateQuizFromAI} 
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 text-white shadow-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {t('generateNewQuiz')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quiz Modal */}
      <Dialog open={isQuizActive} onOpenChange={(open) => !open && setIsQuizActive(false)}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
          {!isComplete ? (
            <>
              {/* Header */}
              <div className="p-4 border-b bg-gradient-to-r from-primary/10 to-cyan-500/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Quiz</h3>
                      <p className="text-sm text-muted-foreground">Question {currentIndex + 1} / {questions.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-emerald-600">
                      <CheckCircle className="h-4 w-4" />
                      {score.correct}
                    </span>
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="h-4 w-4" />
                      {score.wrong}
                    </span>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Question */}
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-lg font-medium leading-relaxed">{currentQuestion?.question}</p>
                  {currentQuestion?.sourceRef && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Source: {currentQuestion.sourceRef}
                    </p>
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {currentQuestion?.options.map((option, i) => {
                    const isSelected = selectedAnswer === option
                    const isCorrect = option === currentQuestion.correctAnswer
                    const showResult = isAnswered

                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                        className={cn(
                          "w-full p-4 rounded-xl border-2 text-left transition-all",
                          !showResult && !isSelected && "hover:border-primary/50 hover:bg-primary/5",
                          !showResult && isSelected && "border-primary bg-primary/10",
                          showResult && isCorrect && "border-emerald-500 bg-emerald-50 dark:bg-emerald-950",
                          showResult && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950",
                          showResult && !isSelected && !isCorrect && "opacity-50"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-3">
                            <span className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                              showResult && isCorrect ? "bg-emerald-500 text-white" :
                              showResult && isSelected && !isCorrect ? "bg-red-500 text-white" :
                              "bg-muted"
                            )}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="text-sm">{option}</span>
                          </span>
                          {showResult && isCorrect && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                          {showResult && isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-500" />}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Next button */}
                {isAnswered && (
                  <Button 
                    onClick={nextQuestion}
                    className="w-full mt-6 gap-2"
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        Question suivante
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Voir les résultats
                        <Trophy className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            /* Results */
            <div className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center mx-auto mb-6">
                <Trophy className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold mb-2">Quiz terminé !</h2>
              <p className="text-muted-foreground mb-6">
                Tu as obtenu {score.correct} / {questions.length} bonnes réponses
              </p>

              {/* Score circle */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(score.correct / questions.length) * 352} 352`}
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">
                    {Math.round((score.correct / questions.length) * 100)}%
                  </span>
                </div>
              </div>

              {/* Study tips */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-semibold flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Conseils pour réviser
                </h4>
                <ul className="space-y-2">
                  {getStudyTips().map((tip, i) => (
                    <li key={i} className="text-sm text-muted-foreground">{tip}</li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => setIsQuizActive(false)}
                >
                  Fermer
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={startQuiz}
                >
                  <RotateCcw className="h-4 w-4" />
                  Recommencer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Stats Modal */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Statistiques
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-primary">{sessions.length}</p>
                <p className="text-sm text-muted-foreground">Sessions</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-primary">{getAverageScore()}%</p>
                <p className="text-sm text-muted-foreground">Score moyen</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Dernières sessions</h4>
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()}
                  </span>
                  <span className={cn(
                    "font-medium",
                    (session.correctAnswers / session.totalQuestions) >= 0.7 ? "text-emerald-600" : "text-amber-600"
                  )}>
                    {session.correctAnswers}/{session.totalQuestions}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
