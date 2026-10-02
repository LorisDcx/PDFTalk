'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpenText, CheckCircle2, ChevronDown, Download, Loader2, MessageCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Button } from '@/components/ui/button'
import { LearningMicrophone } from '@/components/learning-microphone'
import { spokenText } from '@/lib/learning-voice'
import { LearningAudio } from '@/components/learning-audio'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { learningCopy, learningError } from '@/lib/learning-copy'
import { learningSessionSchema, learningPlanSchema, learningLessonSchema, learningFeedbackSchema, type LearningProfile, type LearningRequest, type LearningSession } from '@/lib/learning'

const fieldClass = 'mt-2 block min-h-11 w-full rounded-[var(--cd-radius-control)] border border-[var(--cd-line)] bg-white px-3 py-3 text-base text-[var(--cd-ink)]'
const actionClass = 'min-h-11 h-auto whitespace-normal bg-[var(--cd-brand)] px-5 py-3 text-base text-white hover:bg-[var(--cd-brand-hover)]'

// Saved model titles may already include their step number.
function stepTitle(title: string) { return title.replace(/^\s*(?:étape\s+|step\s+)?\d+\s*[.):\-–]\s+/i, '') }

function Markdown({ children }: { children: string }) {
  return <div className="study-chat-answer min-w-0 break-words text-base leading-8"><ReactMarkdown components={{ h1: props => <h4 className="mb-3 mt-5 text-lg font-bold">{props.children}</h4> }} remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { trust: false, strict: 'ignore', throwOnError: false }]]}>{children}</ReactMarkdown></div>
}

export function LearningWorkspace({ userId, documentId = null, documentName, onOpenSource }: { userId: string; documentId?: string | null; documentName?: string; onOpenSource?: (page?: number) => void }) {
  const { language } = useLanguage()
  const { refreshProfile } = useAuth()
  const copy = learningCopy[language === 'fr' ? 'fr' : 'en']
  const storageKey = `cramdesk-learning-v1:${userId}:${documentId || 'topic'}:${language}`
  const [session, setSession] = useState<LearningSession | null>(null)
  const [profile, setProfile] = useState<LearningProfile>({ topic: '', goal: '', knowledge: '', level: 'beginner' })
  const [ready, setReady] = useState(false)
  const [editing, setEditing] = useState(false)
  const [pending, setPending] = useState<LearningRequest['action'] | null>(null)
  const [voiceBusy, setVoiceBusy] = useState(false)
  const [voiceReady, setVoiceReady] = useState(false)
  const [programOpen, setProgramOpen] = useState(false)
  const programId = useId()
  const lessonId = useId()
  const tutorId = useId()
  const [question, setQuestion] = useState('')
  const [errorCode, setErrorCode] = useState<string | null>(null)
  const [errorAction, setErrorAction] = useState<LearningRequest['action'] | null>(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const controllerRef = useRef<AbortController | null>(null)
  const busyRef = useRef(false)
  const lessonRef = useRef<HTMLElement>(null)
  const tutorRef = useRef<HTMLElement>(null)
  const conversationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let active = true
    let saved: LearningSession | null = null
    let failed = false
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = learningSessionSchema.safeParse(JSON.parse(raw))
        if (parsed.success) saved = parsed.data
        else failed = true
      }
    } catch { failed = true }
    queueMicrotask(() => {
      if (!active) return
      setSession(saved)
      if (saved) setProfile(saved.profile)
      setSaveFailed(failed)
      setReady(true)
    })
    return () => { active = false; controllerRef.current?.abort() }
  }, [storageKey])

  useEffect(() => {
    if (!ready || !session) return
    let failed = false
    try { localStorage.setItem(storageKey, JSON.stringify(session)) } catch { failed = true }
    queueMicrotask(() => setSaveFailed(failed))
  }, [ready, session, storageKey])

  const conversation = session?.conversations[session.activeStep]
  useEffect(() => {
    if (conversationRef.current) conversationRef.current.scrollTop = conversationRef.current.scrollHeight
  }, [conversation])

  const refreshUsage = () => { void refreshProfile().catch(() => {}) }
  const request = async (input: LearningRequest) => {
    if (busyRef.current) return null
    busyRef.current = true
    const controller = new AbortController()
    controllerRef.current = controller
    setPending(input.action)
    setErrorCode(null)
    setErrorAction(input.action)
    try {
      const response = await fetch('/api/learn', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input), signal: controller.signal,
      })
      const data = await response.json()
      if (!response.ok) { setErrorCode(data.code || 'ai_unavailable'); return null }
      if (controller.signal.aborted) return null
      if (input.action === 'plan') learningPlanSchema.parse(data.plan)
      else if (input.action === 'lesson') learningLessonSchema.parse(data.lesson)
      else learningFeedbackSchema.parse(data)
      refreshUsage()
      return data
    } catch {
      if (!controller.signal.aborted) setErrorCode('ai_unavailable')
      return null
    } finally {
      busyRef.current = false
      if (!controller.signal.aborted) setPending(null)
    }
  }

  const createPlan = async () => {
    const data = await request({ action: 'plan', documentId, language, profile })
    if (!data) return
    setSession({ version: 1, profile, plan: data.plan, activeStep: 0, lessons: {}, completed: [], conversations: {}, answers: {}, adaptation: '' })
    setQuestion('')
    setEditing(false)
  }
  const createLesson = async () => {
    if (!session) return
    const data = await request({ action: 'lesson', documentId, language, profile: session.profile, plan: session.plan, stepIndex: session.activeStep, adaptation: session.adaptation })
    if (!data) return
    setSession(previous => previous ? { ...previous, lessons: { ...previous.lessons, [previous.activeStep]: data.lesson } } : previous)
  }
  const coach = async (mode: 'question' | 'evaluate') => {
    if (!session || !session.lessons[session.activeStep]) return
    const content = mode === 'evaluate' ? session.answers[session.activeStep] || '' : question
    if (!content.trim()) return
    const history = (session.conversations[session.activeStep] || []).slice(-4)
    const data = await request({ action: 'coach', documentId, language, profile: session.profile, step: session.plan.steps[session.activeStep], lesson: session.lessons[session.activeStep], question: content, mode, history })
    if (!data) return
    setSession(previous => {
      if (!previous) return previous
      const index = previous.activeStep
      const conversation = [...(previous.conversations[index] || []), { role: 'user' as const, content }, { role: 'assistant' as const, content: data.answer, ...(data.narration ? { narration: data.narration } : {}) }].slice(-40)
      return { ...previous, conversations: { ...previous.conversations, [index]: conversation },
        completed: data.mastered ? [...new Set([...previous.completed, index])] : previous.completed,
        adaptation: mode === 'evaluate' ? data.answer : previous.adaptation }
    })
    if (mode === 'question') { setQuestion(''); setVoiceReady(false) }
    else requestAnimationFrame(() => tutorRef.current?.focus())
  }
  const selectStep = (index: number) => {
    if (!session || pending || voiceBusy || (index > 0 && !session.completed.includes(index - 1))) return
    setSession({ ...session, activeStep: index })
    setQuestion('')
    setProgramOpen(false)
    setErrorCode(null)
    lessonRef.current?.focus()
  }
  const exportCourse = () => {
    if (!session) return
    const content = [
      `# ${session.plan.title}`, session.plan.introduction,
      `${copy.topic}: ${session.profile.topic}\n${copy.goal}: ${session.profile.goal}\n${copy.level}: ${copy[session.profile.level]}`,
      ...session.plan.steps.map((step, index) => {
        const lesson = session.lessons[index]
        return [`## ${index + 1}. ${stepTitle(step.title)}`, step.objective, lesson?.content || '',
          lesson?.source ? `> ${lesson.source.quote}${lesson.source.page ? ` (p. ${lesson.source.page})` : ''}` : '',
          lesson ? `### ${copy.questions}\n${lesson.questions.map((item, i) => `${i + 1}. ${item}`).join('\n')}` : '',
          session.answers[index] ? `### ${copy.answer}\n${session.answers[index]}` : '',
          ...(session.conversations[index] || []).map(message => `${message.role === 'user' ? '>' : ''} ${message.content}`),
        ].filter(Boolean).join('\n\n')
      }),
    ].join('\n\n')
    const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'cramdesk-parcours.md'
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  if (!ready) return <p role="status" className="flex items-center gap-2 py-8"><Loader2 className="size-5 animate-spin" /><span suppressHydrationWarning>{copy.loading}</span></p>
  const lesson = session?.lessons[session.activeStep]
  const currentStep = session?.plan.steps[session.activeStep]
  const completed = session?.completed.includes(session.activeStep)
  const error = errorCode ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-900">
    <p>{learningError(errorCode, copy)}</p>
    {['quota_exceeded', 'insufficient_pages', 'daily_limit_reached', 'subscription_expired', 'access_expired'].includes(errorCode) && <Link href="/billing" className="mt-2 inline-flex min-h-11 items-center font-semibold underline">{copy.billing}</Link>}
    {errorCode === 'unauthorized' && <Link href="/login?redirect=/apprendre" className="mt-2 inline-flex min-h-11 items-center font-semibold underline">{copy.signIn}</Link>}
    {errorCode === 'source_unavailable' && documentId && <Link href={`/documents/${documentId}`} className="mt-2 inline-flex min-h-11 items-center font-semibold underline">{copy.openPdf}</Link>}
  </div> : null

  return <div className="learning-workspace space-y-6 text-[var(--cd-ink)]">
    <p className="text-base leading-7 text-[var(--cd-muted)]">{copy.local}</p>
    {saveFailed && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-900">{copy.saveError}</p>}
    {(!session || editing) ? <form onSubmit={event => { event.preventDefault(); void createPlan() }} className="max-w-4xl space-y-5 rounded-[var(--cd-radius-panel)] border border-[var(--cd-line)] bg-white p-5 sm:p-8">
      {session && <div className="space-y-3"><p className="text-base leading-7">{copy.replace}</p><Button type="button" variant="outline" className="min-h-11" disabled={(!!pending || voiceBusy)} onClick={() => exportCourse()}>{copy.export}</Button></div>}
      {documentName && <p className="flex items-center gap-2 break-words text-base text-[var(--cd-muted)]"><BookOpenText className="size-5 shrink-0" aria-hidden="true" />{documentName}</p>}
      <fieldset disabled={(!!pending || voiceBusy)} className="space-y-5 disabled:opacity-70">
        <label className="block text-base font-semibold">{copy.topic}<input required value={profile.topic} onChange={event => setProfile({ ...profile, topic: event.target.value })} maxLength={500} className={fieldClass} placeholder={copy.topicPlaceholder} /></label>
        <label className="block text-base font-semibold">{copy.level}<select value={profile.level} onChange={event => setProfile({ ...profile, level: event.target.value as LearningProfile['level'] })} className={fieldClass}>{(['beginner', 'intermediate', 'advanced'] as const).map(level => <option key={level} value={level}>{copy[level]}</option>)}</select></label>
        <label className="block text-base font-semibold">{copy.goal}<textarea required value={profile.goal} onChange={event => setProfile({ ...profile, goal: event.target.value })} maxLength={800} rows={2} className={fieldClass} placeholder={copy.goalPlaceholder} /></label>
        <label className="block text-base font-semibold">{copy.knowledge}<textarea value={profile.knowledge} onChange={event => setProfile({ ...profile, knowledge: event.target.value })} maxLength={1200} rows={3} className={fieldClass} placeholder={copy.knowledgePlaceholder} /></label>
      </fieldset>
      <p className="text-base leading-7 text-[var(--cd-muted)]">{copy.cost}</p>
      {error}
      <div className="flex flex-wrap gap-3"><Button type="submit" disabled={(!!pending || voiceBusy) || !profile.topic.trim() || !profile.goal.trim()} className={`${actionClass} gap-2`}>{pending && <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden="true" />}{pending ? copy.building : copy.create}</Button>{session && <Button type="button" variant="outline" className="min-h-11" disabled={(!!pending || voiceBusy)} onClick={() => { setEditing(false); setProfile(session.profile); setErrorCode(null) }}>{copy.cancel}</Button>}</div>
    </form> : <>
      <header className="space-y-3">
        <h2 className="break-words font-editorial text-3xl">{session.plan.title}</h2>
        <p className="max-w-3xl text-base leading-7 text-[var(--cd-muted)]">{session.plan.introduction}</p>
        <div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={() => exportCourse()} className="min-h-11 h-auto gap-2 whitespace-normal"><Download className="size-4 shrink-0" aria-hidden="true" />{copy.export}</Button><Button type="button" variant="ghost" className="min-h-11" disabled={(!!pending || voiceBusy)} onClick={() => { setEditing(true); setErrorCode(null) }}>{copy.newCourse}</Button></div>
        <details className="text-base text-[var(--cd-muted)]"><summary className="flex min-h-11 w-fit cursor-pointer items-center gap-2 font-semibold text-[var(--cd-ink)]">{copy.usageDetails}<ChevronDown className="size-4" aria-hidden="true" /></summary><p className="max-w-3xl pb-3 leading-7">{copy.cost}</p></details>
      </header>
      {session.completed.length === session.plan.steps.length && <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-900"><p className="font-semibold">{copy.done}</p><p className="mt-2 text-base leading-7">{copy.congratulations}</p></div>}
      <div className="learning-grid grid min-w-0 items-start gap-6">
        <nav aria-label={copy.program} className="learning-program min-w-0 rounded-[var(--cd-radius-panel)] border border-[var(--cd-line)] bg-[var(--cd-paper)] p-4">
          <h3 className="mb-3 font-editorial text-2xl">{copy.program}</h3>
          <p className="mb-4 text-base text-[var(--cd-muted)]">{session.completed.length} / {session.plan.steps.length} {copy.completed}</p>
          <button type="button" aria-expanded={programOpen} aria-controls={programId} onClick={() => setProgramOpen(value => !value)} className="learning-program-toggle flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border border-[var(--cd-line)] bg-white p-3 text-left text-base"><span>{copy.step} {session.activeStep + 1} · {programOpen ? copy.hideProgram : copy.showProgram}</span><ChevronDown className={`size-5 shrink-0 ${programOpen ? 'rotate-180' : ''}`} aria-hidden="true" /></button>
          <ol id={programId} className={`learning-program-list mt-3 space-y-2 ${programOpen ? 'block' : 'hidden'}`}>{session.plan.steps.map((step, index) => <li key={index}><button type="button" disabled={(!!pending || voiceBusy) || (index > 0 && !session.completed.includes(index - 1))} onClick={() => selectStep(index)} aria-current={session.activeStep === index ? 'step' : undefined} title={index > 0 && !session.completed.includes(index - 1) ? copy.locked : undefined} className={`flex min-h-11 w-full items-start gap-3 rounded-xl border p-3 text-left text-base disabled:opacity-60 ${session.activeStep === index ? 'border-[var(--cd-brand)] bg-white font-semibold text-[var(--cd-brand)]' : 'border-transparent hover:border-[var(--cd-line)]'}`}>
            <span className="shrink-0">{session.completed.includes(index) ? <CheckCircle2 className="mt-1 size-5 text-green-700" aria-label={copy.completed} /> : `${index + 1}.`}</span><span className="min-w-0 break-words">{stepTitle(step.title)}</span>
          </button></li>)}</ol>
        </nav>
        <section id={lessonId} ref={lessonRef} tabIndex={-1} aria-label={`${copy.step} ${session.activeStep + 1}`} aria-busy={!!pending} className="learning-lesson min-w-0 scroll-mt-24 rounded-[var(--cd-radius-panel)] border border-[var(--cd-line)] bg-white p-5 sm:p-8">
          <div className="mx-auto max-w-[74ch] space-y-6">
          <header><p className="text-base font-semibold text-[var(--cd-brand)]">{copy.step} {session.activeStep + 1}</p><h3 className="mt-2 break-words font-editorial text-2xl sm:text-3xl">{currentStep ? stepTitle(currentStep.title) : ''}</h3><p className="mt-3 text-base leading-7 text-[var(--cd-muted)]">{currentStep?.objective}</p></header>
          {lesson && <a href={`#${tutorId}`} className="learning-tutor-link inline-flex min-h-11 items-center gap-2 text-base font-semibold text-[var(--cd-brand)] underline"><MessageCircle className="size-4 shrink-0" aria-hidden="true" />{copy.tutorLink}</a>}
          {errorAction !== 'coach' && error}
          {!lesson ? <div className="space-y-4"><p className="text-base leading-7">{copy.emptyLesson}</p><Button type="button" disabled={(!!pending || voiceBusy)} onClick={() => void createLesson()} className={`${actionClass} gap-2`}>{pending && <Loader2 className="size-5 shrink-0 animate-spin" aria-hidden="true" />}{pending ? copy.loadingLesson : copy.start}</Button></div> : <>
            <Markdown>{lesson.content}</Markdown>
            {documentId && <div className="space-y-2 rounded-xl border border-[var(--cd-line)] bg-[var(--cd-paper)] p-4">
              {lesson.source ? <><p className="text-base font-semibold">{copy.sourceQuote}{lesson.source.page ? ` · p. ${lesson.source.page}` : ''}</p><blockquote className="text-base leading-7">« {lesson.source.quote} »</blockquote></> : <p className="text-base leading-7 text-[var(--cd-muted)]">{copy.sourceMissing}</p>}
              {onOpenSource ? <Button type="button" variant="outline" className="min-h-11" onClick={() => onOpenSource(lesson.source?.page || undefined)}>{copy.openPdf}</Button> : <Link href={`/documents/${documentId}${lesson.source?.page ? `?page=${lesson.source.page}` : ''}`} className="inline-flex min-h-11 items-center font-semibold text-[var(--cd-brand)] underline">{copy.openPdf}</Link>}
            </div>}
            <form onSubmit={event => { event.preventDefault(); void coach('evaluate') }} className="space-y-4 border-t border-[var(--cd-line)] pt-6">
              <h4 className="font-editorial text-2xl">{copy.questions}</h4>
              <ol className="list-decimal space-y-3 ps-6">{lesson.questions.map((item, index) => <li key={index}><Markdown>{item}</Markdown></li>)}</ol>
              <label className="block text-base font-semibold">{copy.answer}<textarea required rows={4} maxLength={3000} value={session.answers[session.activeStep] || ''} disabled={(!!pending || voiceBusy)} onChange={event => setSession({ ...session, answers: { ...session.answers, [session.activeStep]: event.target.value } })} placeholder={copy.answerPlaceholder} className={fieldClass} /></label>
              <Button type="submit" disabled={(!!pending || voiceBusy) || !(session.answers[session.activeStep] || '').trim()} className={actionClass}>{copy.evaluate}</Button>
              <p className="text-base leading-7 text-[var(--cd-muted)]">{copy.correctionHint}</p>
              {completed && <p role="status" className="flex items-start gap-2 text-base leading-7 text-green-800"><CheckCircle2 className="mt-1 size-5 shrink-0" aria-hidden="true" />{copy.passed}</p>}
            </form>
          </>}
          <div className="flex flex-wrap justify-between gap-3 border-t border-[var(--cd-line)] pt-5">
            {session.activeStep > 0 && <Button type="button" variant="outline" className="min-h-11 h-auto whitespace-normal" disabled={(!!pending || voiceBusy)} onClick={() => selectStep(session.activeStep - 1)}>{copy.previous}</Button>}
            {session.activeStep < session.plan.steps.length - 1 && <Button type="button" disabled={(!!pending || voiceBusy) || !completed} onClick={() => selectStep(session.activeStep + 1)} title={!completed ? copy.locked : undefined} className={`${actionClass} ms-auto gap-2`}>{copy.continue}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Button>}
          </div>
          </div>
        </section>
        <aside id={tutorId} ref={tutorRef} tabIndex={-1} aria-label={copy.tutor} className="learning-tutor min-w-0 scroll-mt-24 space-y-5 rounded-[var(--cd-radius-panel)] border border-[var(--cd-line)] bg-white p-5">
          <header><h3 className="flex items-center gap-2 font-editorial text-2xl"><MessageCircle className="size-5 shrink-0 text-[var(--cd-brand)]" aria-hidden="true" />{copy.tutor}</h3><p className="mt-3 text-base leading-7 text-[var(--cd-muted)]">{copy.tutorHint}</p></header>
          {!lesson ? <p className="rounded-xl bg-[var(--cd-paper)] p-4 text-base leading-7 text-[var(--cd-muted)]">{copy.tutorEmpty}</p> : <>
            <a href={`#${lessonId}`} className="learning-tutor-link inline-flex min-h-11 items-center text-base font-semibold text-[var(--cd-brand)] underline">{copy.returnLesson}</a>
            <details className="rounded-xl border border-[var(--cd-line)]"><summary className="flex min-h-11 cursor-pointer items-center justify-between gap-2 p-3 text-base font-semibold">{copy.audioTools}<ChevronDown className="size-4 shrink-0" aria-hidden="true" /></summary><div className="px-3 pb-3"><LearningAudio key={`${session.activeStep}:${lesson.narration}`} text={lesson.narration} summary={lesson.audioSummary} fullText={lesson.content} language={language} copy={copy} onUsage={refreshUsage} /></div></details>
            {errorAction === 'coach' && error}
            {(!!conversation?.length || pending === 'coach') && <div ref={conversationRef} className="max-h-96 space-y-4 overflow-y-auto border-y border-[var(--cd-line)] py-4" aria-live="polite" aria-relevant="additions">
              {(conversation || []).map((message, index) => <div key={`${index}:${message.role}:${message.content}`} className={`min-w-0 rounded-xl p-3 ${message.role === 'user' ? 'border border-[var(--cd-line)] bg-[var(--cd-paper)]' : 'bg-white'}`}><Markdown>{message.content}</Markdown>{message.role === 'assistant' && <LearningAudio text={message.narration || spokenText(message.content)} fullText={message.content} language={language} copy={copy} onUsage={refreshUsage} />}</div>)}
              {pending === 'coach' && <p role="status" className="flex items-center gap-2 text-base text-[var(--cd-muted)]"><Loader2 className="size-5 shrink-0 animate-spin" aria-hidden="true" />{copy.thinking}</p>}
            </div>}
            <form onSubmit={event => { event.preventDefault(); void coach('question') }} className="space-y-3">
              <label className="block text-base font-semibold">{copy.ask}<textarea required value={question} disabled={(!!pending || voiceBusy)} onChange={event => setQuestion(event.target.value)} rows={3} maxLength={3000} className={fieldClass} placeholder={copy.askPlaceholder} /></label>
              <LearningMicrophone key={session.activeStep} copy={copy} disabled={!!pending} onBusy={setVoiceBusy} onUsage={refreshUsage} onText={text => { setQuestion(text); setVoiceReady(true) }} />
              {voiceReady && <p role="status" className="text-base text-green-800">{copy.micReady}</p>}
              <Button type="submit" variant="outline" disabled={(!!pending || voiceBusy) || !question.trim()} className="min-h-11 h-auto w-full whitespace-normal text-base">{copy.send}</Button>
            </form>
          </>}
        </aside>
      </div>
    </>}
  </div>
}
