'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface PDFChatProps {
  documentId: string
  documentContent: string
  documentName: string
  language?: string
}

export function PDFChat({ documentId, documentContent, documentName, language = 'fr' }: PDFChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Generate AI suggestions on mount and when language changes
  useEffect(() => {
    generateSuggestions()
  }, [documentContent, language])

  const generateSuggestions = async () => {
    try {
      const response = await fetch('/api/chat/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentContent: documentContent.substring(0, 5000), language }),
      })
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId,
          documentContent,
          question: content.trim(),
          history: messages.slice(-6),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Désolé, je n'ai pas pu traiter votre question. Veuillez réessayer.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <div className="relative rounded-2xl border bg-gradient-to-b from-background to-muted/20 shadow-xl overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 via-cyan-400/20 to-teal-400/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="relative flex flex-col h-[600px]">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              {/* Animated icon */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary via-cyan-400 to-teal-400 rounded-full blur-xl opacity-50 animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-2xl">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Discutez avec votre PDF
              </h3>
              <p className="text-muted-foreground max-w-md">
                Posez n'importe quelle question sur <span className="font-medium text-foreground">"{documentName}"</span> et obtenez des réponses instantanées.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-4 animate-slide-up",
                    message.role === 'user' ? "justify-end" : "justify-start"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === 'assistant' && (
                    <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-5 py-3 shadow-md",
                      message.role === 'user'
                        ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-br-md"
                        : "bg-background border rounded-bl-md"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-medium">Moi</span>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start animate-slide-up">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-background border rounded-2xl rounded-bl-md px-5 py-4 shadow-md">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <div className="p-4 border-t bg-background/80 backdrop-blur-xl space-y-3">
          {/* Quick suggestions - AI generated */}
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              {suggestions.map((question: string, i: number) => (
                <button
                  key={i}
                  onClick={() => sendMessage(question)}
                  disabled={isLoading}
                  className="px-4 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/40 text-xs font-medium text-foreground/70 hover:text-foreground transition-all duration-200 disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-end gap-2 p-2 rounded-2xl border bg-background shadow-lg focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/50 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question..."
                disabled={isLoading}
                rows={1}
                className="flex-1 bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-[15px] px-3 py-2 max-h-32 placeholder:text-muted-foreground/60"
              />
              <Button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                size="icon"
                className={cn(
                  "h-10 w-10 rounded-xl shrink-0 transition-all duration-300",
                  input.trim() 
                    ? "bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 shadow-lg" 
                    : "bg-muted text-muted-foreground"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
