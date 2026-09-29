'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, FileText, Loader2, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { useLanguage } from '@/lib/i18n'

type Message = { id: string; role: 'user' | 'assistant'; content: string; source?: { quote: string; page: number | null } | null }

interface PDFChatProps {
  documentId: string
  documentContent: string
  documentName: string
  onOpenSource?: (page?: number) => void
}

export function PDFChat({ documentId, documentContent, documentName, onOpenSource }: PDFChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [failedQuestion, setFailedQuestion] = useState<string | null>(null)
  const [failedCode, setFailedCode] = useState<string | null>(null)
  const [accessBlocked, setAccessBlocked] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const controller = new AbortController()
    queueMicrotask(() => { if (!controller.signal.aborted) setSuggestions([]) })
    if (!documentContent) return () => controller.abort()
    fetch('/api/chat/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, language }),
      signal: controller.signal,
    }).then(async response => {
      if (!response.ok) return
      const data = await response.json()
      if (!controller.signal.aborted && Array.isArray(data.suggestions)) {
        setSuggestions(data.suggestions.filter((item: unknown) => typeof item === 'string').slice(0, 3))
      }
    }).catch(error => {
      if (!controller.signal.aborted) console.error('Suggestion error:', error)
    })
    return () => controller.abort()
  }, [documentContent, documentId, language])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!inputRef.current) return
    inputRef.current.style.height = 'auto'
    inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
  }, [input])

  const sendMessage = async (rawQuestion: string, retry = false) => {
    const question = rawQuestion.trim()
    if (!question || isLoading) return
    const conversation = retry ? messages.slice(0, -1) : messages
    const history = conversation.slice(-4).map(({ role, content }) => ({
      role,
      content: role === 'assistant' && content.length > 7000
        ? `${content.slice(0, 3200)}\n[…]\n${content.slice(-3200)}`
        : content,
    }))
    if (!retry) setMessages(previous => [...previous, { id: crypto.randomUUID(), role: 'user', content: question }])
    setFailedQuestion(null)
    setFailedCode(null)
    setAccessBlocked(false)
    setInput('')
    setIsLoading(true)

    let responseCode: string | null = null
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, question, history }),
      })
      const data = await response.json()
      if (response.status === 403 && data.code === 'access_expired') {
        setAccessBlocked(true)
        return
      }
      if (!response.ok || typeof data.answer !== 'string' || !data.answer.trim()) {
        responseCode = typeof data.code === 'string' ? data.code : null
        throw new Error(data.error || 'Empty chat response')
      }
      const source = data.source && typeof data.source.quote === 'string' &&
        (data.source.page === null || Number.isInteger(data.source.page)) ? data.source : null
      setMessages(previous => [...previous, { id: crypto.randomUUID(), role: 'assistant', content: data.answer.trim(), source }])
    } catch (error) {
      console.error('Chat error:', error)
      setFailedQuestion(question)
      setFailedCode(responseCode)
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return <section className="flex h-[min(650px,calc(100vh-230px))] min-h-[430px] flex-col overflow-hidden rounded-2xl border border-[#e8dedb] bg-white" aria-label={t('chatTitle')}>
    <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-8" aria-live="polite">
      {messages.length === 0 && <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center text-center">
        <span className="mb-5 flex size-12 items-center justify-center rounded-xl bg-[#f9e9df] text-[#ae4731]"><FileText className="size-6" /></span>
        <h3 className="font-editorial text-2xl text-[#33252b]">{t('chatWithPdf')}</h3>
        <p className="mt-3 text-base leading-6 text-[#756b73]">{t('askAnyQuestion')} <strong className="font-semibold text-[#42343e]">{documentName}</strong>. {t('getInstantAnswers')}</p>
      </div>}
      {messages.map(message => <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-2xl px-4 py-3 text-base leading-7 ${message.role === 'user' ? 'max-w-[90%] rounded-br-sm bg-[#b84432] text-white sm:max-w-[75%]' : 'w-full rounded-bl-sm border border-[var(--cd-line)] bg-[var(--cd-paper)] text-[var(--cd-ink)]'}`}>
          {message.role === 'assistant'
            ? <div className="study-chat-answer"><ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { trust: false, strict: 'ignore', throwOnError: false }]]}>{message.content}</ReactMarkdown></div>
            : <p className="whitespace-pre-wrap">{message.content}</p>}
          {message.role === 'assistant' && message.source && <button type="button" onClick={() => onOpenSource?.(message.source?.page || undefined)} className="mt-3 block min-h-11 w-full rounded-[var(--cd-radius-control)] border border-[var(--cd-line)] bg-[var(--cd-surface)] px-3 py-2 text-left text-base leading-6 text-[var(--cd-ink)] hover:border-[var(--cd-brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cd-brand)]">
            <span className="block font-bold">{language === 'fr' ? 'Extrait vérifié' : 'Verified excerpt'}{message.source.page ? ` · ${language === 'fr' ? 'page' : 'page'} ${message.source.page}` : ''}</span>
            <span className="mt-1 block line-clamp-2">« {message.source.quote} »</span>
          </button>}
        </div>
      </div>)}
      {isLoading && <div className="flex items-center gap-2 text-base text-[#756b73]"><Loader2 className="size-4 animate-spin text-[#b84432]" />{t('processing')}</div>}
      {failedQuestion && <div role="alert" className="rounded-xl border border-[#ecc9ba] bg-[#fff7f2] px-4 py-3 text-base text-[#864632]">
        <p>{failedCode === 'service_unavailable' || failedCode === 'ai_unavailable' ? t('chatServiceError') : t('chatError')}</p>
        <button type="button" onClick={() => void sendMessage(failedQuestion, true)} className="mt-2 inline-flex items-center gap-2 font-semibold underline underline-offset-4 hover:text-[#b84432]"><RotateCcw className="size-3.5" />{language === 'fr' ? 'Réessayer' : 'Retry'}</button>
      </div>}
      {accessBlocked && <div role="alert" className="rounded-xl border border-[#ecc9ba] bg-[#fff7f2] px-4 py-3 text-base text-[#864632]">
        <p>{t('accessExpired')}</p>
        <Link href="/billing" className="mt-2 inline-block font-semibold underline underline-offset-4 hover:text-[#b84432]">{t('billing')}</Link>
      </div>}
      <div ref={messagesEndRef} />
    </div>

    <div className="border-t border-[#eee5df] bg-[#fffdfa] px-4 py-4 sm:px-6">
      {messages.length === 0 && suggestions.length > 0 && <div className="mb-3 flex flex-wrap gap-2">
        {suggestions.map(question => <button key={question} type="button" onClick={() => void sendMessage(question)} disabled={isLoading} className="min-h-11 rounded-full border border-[#e6d8d0] bg-white px-3 py-2 text-left text-base font-medium text-[#604b50] transition hover:border-[#b84432] hover:text-[#a84431] disabled:opacity-50">{question}</button>)}
      </div>}
      <form onSubmit={event => { event.preventDefault(); void sendMessage(input) }} className="flex items-end gap-2 rounded-xl border border-[#ded2cd] bg-white p-1.5 focus-within:border-[#b84432] focus-within:ring-2 focus-within:ring-[#b84432]/10">
        <textarea ref={inputRef} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void sendMessage(input) } }} placeholder={t('askYourQuestion')} rows={1} maxLength={6000} disabled={isLoading} className="max-h-32 min-h-11 flex-1 resize-none border-0 bg-transparent px-3 py-2 text-base leading-6 text-[#352a32] outline-none placeholder:text-[#9b8d92] disabled:opacity-60" />
        <button type="submit" disabled={isLoading || !input.trim()} aria-label={language === 'fr' ? 'Envoyer' : 'Send'} className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#b84432] text-white transition hover:bg-[#963326] disabled:cursor-not-allowed disabled:bg-[#e6ded9] disabled:text-[#948b87]">{isLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowUp className="size-4" />}</button>
      </form>
      <p className="mt-2 px-1 text-sm leading-5 text-[#897d81]">{language === 'fr' ? 'Le PDF sert de source ; les exercices peuvent aussi utiliser les méthodes du cours. Vérifie les résultats importants.' : 'The PDF is a source; exercises may also use standard subject methods. Check important results.'}</p>
    </div>
  </section>
}
