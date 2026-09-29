'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Layers3, Loader2, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { getPlanLimits } from '@/lib/plans'
import { createClient } from '@/lib/supabase/client'
import { studyFlowCopy } from '@/lib/study-flow-locales'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

export type Flashcard = { id: string; question: string; answer: string; sourceRef?: string }

export function Flashcards({ documentId, onFlashcardsChange }: {
  documentId: string
  onFlashcardsChange?: (flashcards: Flashcard[]) => void
}) {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [count, setCount] = useState(20)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [justCreated, setJustCreated] = useState(false)
  const { t, language } = useLanguage()
  const { profile } = useAuth()
  const { toast } = useToast()
  const c = studyFlowCopy[language as StudyPdfLocale] || studyFlowCopy.en
  const maxCount = getPlanLimits(profile?.current_plan ?? null).maxFlashcardsPerGen
  const safeCount = Math.min(count, maxCount)

  const loadCards = useCallback(async () => {
    setState('loading')
    try {
      const { data, error } = await createClient().from('flashcards')
        .select('id, question, answer, source_ref')
        .eq('document_id', documentId)
        .order('order_index', { ascending: true })
      if (error) throw error
      setCards((data || []).map(card => ({
        id: card.id, question: card.question, answer: card.answer, sourceRef: card.source_ref || undefined,
      })))
      setState('ready')
      return true
    } catch (error) {
      console.error('Could not load flashcards:', error)
      setState('error')
      return false
    }
  }, [documentId])

  useEffect(() => {
    let active = true
    queueMicrotask(() => { if (active) void loadCards() })
    return () => { active = false }
  }, [loadCards])

  useEffect(() => { onFlashcardsChange?.(cards) }, [cards, onFlashcardsChange])

  async function generateCards() {
    setGenerating(true)
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, count: safeCount, language }),
      })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        if (response.status === 403 && ['insufficient_pages', 'daily_limit_reached', 'quota_exceeded'].includes(result.code)) {
          throw new Error(t('insufficientPages'))
        }
        throw new Error(result.code === 'subscription_expired' ? t('accessExpired') :
          response.status === 503 || result.error === 'Document unavailable' ? t('notAvailable') : t('unexpectedError'))
      }
      setDialogOpen(false)
      setJustCreated(true)
      if (!await loadCards()) throw new Error(c.loadFailed)
    } catch (error) {
      toast({ title: t('error'), description: error instanceof Error ? error.message : t('unexpectedError'), variant: 'destructive' })
    } finally {
      setGenerating(false)
    }
  }

  return <section className="rounded-2xl border border-[var(--cd-line)] bg-white p-5 sm:p-6" aria-labelledby="document-flashcards-title">
    <div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0e6] text-[var(--cd-brand)]"><Layers3 className="size-5" /></span><div><h3 id="document-flashcards-title" className="font-editorial text-2xl text-[var(--cd-ink)]">{t('flashcards')}</h3><p className="mt-1 text-base leading-6 text-[var(--cd-muted)]">{t('flashcardsDesc')}</p></div></div>
    {state === 'loading' && <p role="status" className="mt-5 flex items-center gap-2 text-sm text-[var(--cd-muted)]"><Loader2 className="size-4 animate-spin" />{t('processing')}</p>}
    {state === 'error' && <div role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p>{c.loadFailed}</p><Button type="button" variant="outline" onClick={() => void loadCards()} className="mt-3 min-h-11">{c.retry}</Button></div>}
    {state === 'ready' && <>
      <p className="mt-5 text-sm font-semibold text-[var(--cd-ink)]">{cards.length} {t('cards')} · {c.savedCards}</p>
      {justCreated && <p role="status" className="mt-3 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-800">{cards.length} {t('cards')} · {c.savedCards}</p>}
      <div className="mt-5 flex flex-wrap gap-3">
        {cards.length > 0 && <Link href={`/flashcards?document=${encodeURIComponent(documentId)}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--cd-brand)] px-5 text-sm font-bold text-white hover:bg-[var(--cd-brand-hover)]">{c.openCards}<ArrowRight className="size-4" /></Link>}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button type="button" variant={cards.length ? 'outline' : 'default'} className={cards.length ? 'min-h-11 rounded-full border-[var(--cd-line)]' : 'min-h-11 rounded-full bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]'}>{cards.length ? t('regenerate') : c.createCards}</Button></DialogTrigger>
          <DialogContent lang={language} dir={language === 'ar' ? 'rtl' : 'ltr'} className="max-h-[90dvh] overflow-y-auto border-[var(--cd-line)] bg-[var(--cd-paper)] sm:max-w-md">
            <DialogHeader><DialogTitle className="font-editorial text-2xl">{c.createCards}</DialogTitle><DialogDescription>{t('flashcardsDesc')}</DialogDescription></DialogHeader>
            <div className="space-y-4 py-3">
              <label htmlFor="document-card-count" className="block text-sm font-bold">{t('numberOfCards')}</label>
              <div className="flex items-center gap-4"><input id="document-card-count" type="range" min={5} max={maxCount} step={5} value={safeCount} onChange={event => setCount(Number(event.target.value))} className="min-w-0 flex-1 accent-[var(--cd-brand)]" /><output htmlFor="document-card-count" className="w-10 text-center text-xl font-bold tabular-nums">{safeCount}</output></div>
              <p className="text-sm text-[var(--cd-muted)]">{t('pageCost').replace('{count}', String(Math.ceil(safeCount / 5)))}</p>
              {cards.length > 0 && <p className="rounded-xl border border-[#e9cdbd] bg-[#fff4ec] p-3 text-sm text-[#734b40]">{c.replaceWarning}</p>}
            </div>
            <DialogFooter><Button type="button" onClick={() => void generateCards()} disabled={generating} className="min-h-11 w-full bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]">{generating ? <><Loader2 className="me-2 size-4 animate-spin" />{t('generatingCards')}</> : <><Sparkles className="me-2 size-4" />{t('generate')} {safeCount} {t('cards')}</>}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>}
  </section>
}
