'use client'

import { useState, useEffect, useRef } from 'react'
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
  ChevronRight,
  BarChart3
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/components/auth-provider'
import { getPlanLimits } from '@/lib/plans'
import { quizFlowCopy, studyFlowCopy } from '@/lib/study-flow-locales'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

function shuffled<T>(items: T[]): T[] {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

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
  flashcards?: { id: string; question: string; answer: string; sourceRef?: string }[]
  openFromCards?: boolean
  onAutoOpen?: () => void
}

export function Quiz({ documentId, flashcards = [], openFromCards = false, onAutoOpen }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState({ correct: 0, wrong: 0 })
  const [wrongQuestions, setWrongQuestions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [questionCount, setQuestionCount] = useState(10)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [sessions, setSessions] = useState<QuizSession[]>([])
  const [startTime, setStartTime] = useState<number>(0)
  const [showStats, setShowStats] = useState(false)
  const openedFromCards = useRef(false)
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const { profile } = useAuth()
  const flow = quizFlowCopy[language as StudyPdfLocale] || quizFlowCopy.en
  const common = studyFlowCopy[language as StudyPdfLocale] || studyFlowCopy.en

  const maxQuestions = getPlanLimits(profile?.current_plan ?? null).maxQuizQuestions
  const selectedQuestionCount = Math.min(Math.max(questionCount, 5), maxQuestions)
  const distinctAnswers = Array.from(new Map(flashcards.map(card => card.answer.trim()).filter(Boolean).map(answer => [answer.toLocaleLowerCase(), answer])).values())
  const canQuizFromFlashcards = flashcards.length >= 4 && distinctAnswers.length >= 4

  useEffect(() => {
    if (!openFromCards || flashcards.length === 0 || openedFromCards.current) return
    openedFromCards.current = true
    queueMicrotask(() => {
      setIsDialogOpen(true)
      onAutoOpen?.()
    })
  }, [flashcards.length, onAutoOpen, openFromCards])

  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      try {
        const stored = localStorage.getItem(`quiz-sessions-${documentId}`)
        const parsed: unknown = stored ? JSON.parse(stored) : []
        setSessions(Array.isArray(parsed) ? parsed : [])
      } catch (error) {
        console.error('Failed to load quiz sessions:', error)
        setSessions([])
      }
    })
    return () => { active = false }
  }, [documentId])

  const generateQuizFromFlashcards = () => {
    if (!canQuizFromFlashcards) return

    const selectedCards = shuffled(flashcards).slice(0, Math.min(selectedQuestionCount, flashcards.length))

    const quizQuestions: QuizQuestion[] = selectedCards.map((card, index) => {
      // Generate wrong answers from other flashcards
      const otherAnswers = shuffled(distinctAnswers.filter(answer => answer.toLocaleLowerCase() !== card.answer.trim().toLocaleLowerCase())).slice(0, 3)

      const allOptions = shuffled([card.answer.trim(), ...otherAnswers])

      return {
        id: `q-${index}`,
        question: card.question,
        correctAnswer: card.answer,
        options: allOptions,
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
          count: selectedQuestionCount,
          language,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle quota errors
        if (response.status === 403 && ['insufficient_pages', 'daily_limit_reached', 'quota_exceeded'].includes(data.code)) {
          toast({
            title: t('insufficientPages'),
            description: t('insufficientPages'),
            variant: 'destructive',
          })
          setIsDialogOpen(false)
          return
        }
        throw new Error(data.code === 'subscription_expired' ? t('accessExpired') :
          response.status === 503 || data.error === 'Document unavailable' ? t('notAvailable') : t('unexpectedError'))
      }

      setQuestions(data.questions)
      setIsDialogOpen(false)
      startQuiz()
    } catch (error) {
      console.error('Quiz generation error:', error)
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('unexpectedError'),
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

    const nextSessions = [newSession, ...sessions].slice(0, 20)
    setSessions(nextSessions)
    try {
      localStorage.setItem(`quiz-sessions-${documentId}`, JSON.stringify(nextSessions))
    } catch (error) {
      console.error('Failed to save quiz session:', error)
    }
    setIsComplete(true)
  }

  const getAverageScore = () => {
    if (sessions.length === 0) return 0
    const total = sessions.reduce((acc, s) => acc + (s.totalQuestions > 0 ? (s.correctAnswers / s.totalQuestions) * 100 : 0), 0)
    return Math.round(total / sessions.length)
  }

  const currentQuestion = questions[currentIndex]
  const progress = questions.length > 0 ? ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {sessions.length > 0 && (
          <Button 
            variant="outline" 
            className="min-h-11 gap-2"
            onClick={() => setShowStats(true)}
          >
            <BarChart3 className="h-4 w-4" />
            <span>{flow.recent}</span>
          </Button>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="min-h-11 gap-2 bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]">
              <Target className="h-4 w-4" />
              <span>{t('quizMode')}</span>
            </Button>
          </DialogTrigger>
          <DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--cd-brand)]">
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
                <label htmlFor="quiz-question-count" className="text-sm font-medium">{t('numberOfQuestions')}</label>
                <div className="flex items-center gap-4">
                  <input
                    id="quiz-question-count"
                    type="range"
                    min={5}
                    max={maxQuestions}
                    step={5}
                    value={selectedQuestionCount}
                    onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-2xl font-bold text-primary w-12">{selectedQuestionCount}</span>
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
                      selectedQuestionCount === num
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    {num} {t('questions')}
                  </button>
                ))}
              </div>
            </div>
            <DialogFooter className="flex-col gap-4 sm:flex-col">
              {flashcards.length > 0 && (
                <div className="w-full space-y-2">
                <Button 
                  onClick={generateQuizFromFlashcards}
                  disabled={!canQuizFromFlashcards}
                  className="min-h-11 w-full"
                  variant="outline"
                  title={!canQuizFromFlashcards ? t('quizNeedsDistinctCards') : undefined}
                >
                  <Target className="h-4 w-4 mr-2" />
                  {t('quizFromFlashcards')} ({flashcards.length})
                </Button>
                <p className="text-xs text-muted-foreground">{flow.freeCards}</p>
                </div>
              )}
              {flashcards.length > 0 && !canQuizFromFlashcards && <p className="text-sm text-muted-foreground">{t('quizNeedsDistinctCards')}</p>}
              <div className="w-full space-y-2">
              <Button 
                onClick={generateQuizFromAI} 
                disabled={isGenerating}
                className="min-h-11 w-full bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]"
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
              <p className="text-xs text-muted-foreground">{flow.aiCost} {t('pageCost').replace('{count}', String(Math.ceil(selectedQuestionCount / 5)))}</p>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={isQuizActive} onOpenChange={(open) => !open && setIsQuizActive(false)}>
        <DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="max-h-[90dvh] overflow-y-auto p-0 sm:max-w-2xl">
          <DialogTitle className="sr-only">{t('quizMode')}</DialogTitle>
          {!isComplete ? (
            <>
              <div className="border-b p-4 pr-12">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--cd-brand)]">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{t('quizMode')}</h3>
                      <p className="text-sm text-muted-foreground">{t('question')} {currentIndex + 1} / {questions.length}</p>
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

              <div className="p-6">
                <div className="mb-6">
                  <p className="text-lg font-medium leading-relaxed">{currentQuestion?.question}</p>
                  {currentQuestion?.sourceRef && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {common.source} : {currentQuestion.sourceRef}
                    </p>
                  )}
                </div>

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
                          "min-h-12 w-full rounded-xl border-2 p-4 text-left transition-colors",
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

                {isAnswered && (
                  <Button 
                    onClick={nextQuestion}
                    className="w-full mt-6 gap-2"
                  >
                    {currentIndex < questions.length - 1 ? (
                      <>
                        {t('next')}
                        <ChevronRight className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        {t('seeResults')}
                        <Trophy className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <div className="space-y-6 p-6">
              <div className="space-y-2 pr-8">
                <Trophy className="h-7 w-7 text-[var(--cd-brand)]" />
                <h2 className="text-2xl font-semibold">{t('quizComplete')}</h2>
                <p className="text-muted-foreground">{score.correct} / {questions.length} · {t('correct')}</p>
              </div>
              <div className="rounded-xl border bg-[var(--cd-paper)] p-5">
                <span className="text-4xl font-semibold text-[var(--cd-ink)]">{questions.length > 0 ? Math.round((score.correct / questions.length) * 100) : 0}%</span>
                <Progress value={questions.length > 0 ? (score.correct / questions.length) * 100 : 0} className="mt-4 h-2" />
              </div>
              {wrongQuestions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">{flow.history}</h3>
                  {questions.filter((question) => wrongQuestions.includes(question.id)).map((question) => (
                    <div key={question.id} className="rounded-xl border p-4">
                      <p className="font-medium">{question.question}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{t('answer')} : {question.correctAnswer}</p>
                      {question.sourceRef && <p className="mt-1 text-xs text-muted-foreground">{common.source} : {question.sourceRef}</p>}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button 
                  variant="outline" 
                  className="min-h-11 flex-1"
                  onClick={() => setIsQuizActive(false)}
                >
                  {t('back')}
                </Button>
                <Button 
                  className="min-h-11 flex-1 gap-2 bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]"
                  onClick={startQuiz}
                >
                  <RotateCcw className="h-4 w-4" />
                  {t('restart')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              {t('score')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-primary">{sessions.length}</p>
                <p className="text-sm text-muted-foreground">{flow.sessions}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 text-center">
                <p className="text-3xl font-bold text-primary">{getAverageScore()}%</p>
                <p className="text-sm text-muted-foreground">{flow.average}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{flow.recent}</h4>
              {sessions.slice(0, 5).map((session) => (
                <div key={session.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString(language)}
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
