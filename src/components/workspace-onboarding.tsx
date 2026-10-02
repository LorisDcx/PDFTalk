'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpenText, FileText, ListChecks, Volume2, Loader2 } from 'lucide-react'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const copy = {
  fr: {
    help: 'Comment utiliser CramDesk ?', welcome: 'Bienvenue dans ton espace', intro: 'Trois étapes pour passer d’un sujet à une vraie compréhension.',
    steps: [
      { title: 'Choisis ce que tu veux apprendre', body: 'Importe un PDF depuis le tableau de bord, ou ouvre Apprendre pour partir d’un sujet libre. Avec un PDF déjà prêt, le bouton Apprendre est aussi dans sa fiche.', icon: FileText },
      { title: 'Construis un cours à ton niveau', body: 'Dans Apprendre, indique ton thème, ton niveau et ton objectif. L’IA prépare un programme. Ouvre la première étape, lis la leçon puis réponds aux questions : le tuteur te corrige et adapte la suite.', icon: ListChecks },
      { title: 'Écoute et pose tes questions', body: 'Lis la leçon à voix haute, écoute son résumé ou dicte une question au tuteur. Vérifie le texte avant de l’envoyer. Tu peux ensuite écouter sa réponse. Le coût en quota est affiché avant chaque génération.', icon: Volume2 },
    ],
    next: 'Suivant', back: 'Précédent', skip: 'Passer le tutoriel', start: 'Commencer à apprendre', close: 'Fermer le tutoriel', progress: 'Étape', saving: 'Enregistrement…', error: 'Impossible d’enregistrer la fin du tutoriel sur ton compte. Réessaie ou continue dans ce navigateur.', local: 'Continuer dans ce navigateur',
  },
  en: {
    help: 'How do I use CramDesk?', welcome: 'Welcome to your workspace', intro: 'Three steps to turn a topic into real understanding.',
    steps: [
      { title: 'Choose what you want to learn', body: 'Upload a PDF from the dashboard, or open Learn to start from a topic. Ready PDFs also have a Learn button on their document card.', icon: FileText },
      { title: 'Build a course at your level', body: 'In Learn, enter your topic, level and goal. AI prepares a programme. Open the first step, read the lesson and answer its questions: your tutor checks your answers and adapts the next steps.', icon: ListChecks },
      { title: 'Listen and ask questions', body: 'Listen to the lesson, hear a short summary or dictate a question to your tutor. Check the text before sending it, then listen to the answer. The quota cost is shown before each generation.', icon: Volume2 },
    ],
    next: 'Next', back: 'Back', skip: 'Skip tutorial', start: 'Start learning', close: 'Close tutorial', progress: 'Step', saving: 'Saving…', error: 'Could not save tutorial completion to your account. Try again or continue in this browser.', local: 'Continue in this browser',
  },
} as const

export function WorkspaceTutorialButton() {
  const { language } = useLanguage()
  return <button type="button" className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-base font-semibold text-[var(--cd-brand)] underline underline-offset-4" onClick={() => window.dispatchEvent(new Event('cramdesk-open-tutorial'))}><BookOpenText className="size-5 shrink-0" aria-hidden="true" />{copy[language === 'fr' ? 'fr' : 'en'].help}</button>
}

export function WorkspaceOnboarding() {
  const { user } = useAuth()
  const { language } = useLanguage()
  const c = copy[language === 'fr' ? 'fr' : 'en']
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const dismissed = useRef<string | null>(null)
  const destination = useRef<string | null>(null)
  const busy = useRef(false)
  const key = `cramdesk-onboarding-v1:${user?.id}`
  useEffect(() => {
    const reopen = () => { destination.current = null; setStep(0); setError(false); setOpen(true) }
    window.addEventListener('cramdesk-open-tutorial', reopen)
    return () => window.removeEventListener('cramdesk-open-tutorial', reopen)
  }, [])
  useEffect(() => {
    if (!user || dismissed.current === user.id || user.user_metadata?.onboarding_version === 1) return
    const isNewAccount = user.user_metadata?.onboarding_pending === true
    if (!isNewAccount) return
    let alreadySeen = false
    try { alreadySeen = localStorage.getItem(key) === 'done' } catch { /* Account metadata remains authoritative. */ }
    if (!alreadySeen) queueMicrotask(() => { setStep(0); setOpen(true) })
  }, [key, user])

  const dismissLocally = () => {
    if (!user) return
    dismissed.current = user.id
    try { localStorage.setItem(key, 'done') } catch { /* The user can still enter the workspace. */ }
    setOpen(false)
    setError(false)
    if (destination.current) router.push(destination.current)
  }
  const finish = async (href: string | null = null) => {
    if (!user || busy.current) return
    destination.current = href
    busy.current = true
    setSaving(true)
    setError(false)
    try {
      const { error } = await supabase.auth.updateUser({ data: { onboarding_version: 1, onboarding_pending: false } })
      if (error) { setError(true); return }
      dismissLocally()
    } catch { setError(true) }
    finally { busy.current = false; setSaving(false) }
  }
  const activeStep = c.steps[step]
  const Icon = activeStep.icon
  return <>
    <Dialog open={open} onOpenChange={value => { if (!value) void finish() }}>
      <DialogContent closeLabel={c.close} className="max-h-[90dvh] w-[calc(100%-32px)] max-w-xl overflow-y-auto rounded-[var(--cd-radius-panel)] border-[var(--cd-line)] bg-[var(--cd-paper)] p-5 text-[var(--cd-ink)] sm:p-8">
        <DialogHeader className="pe-10 text-left"><DialogTitle className="font-editorial text-3xl leading-tight">{c.welcome}</DialogTitle><DialogDescription className="mt-2 text-base leading-7 text-[var(--cd-muted)]">{c.intro}</DialogDescription></DialogHeader>
        <div className="space-y-4 py-3" aria-live="polite">
          <p className="text-base font-semibold text-[var(--cd-brand)]">{c.progress} {step + 1} / {c.steps.length}</p>
          <Icon className="size-7 text-[var(--cd-brand)]" aria-hidden="true" />
          <h2 className="font-editorial text-2xl">{activeStep.title}</h2>
          <p className="text-base leading-7">{activeStep.body}</p>
        </div>
        {error && <div role="alert" className="space-y-2 rounded-xl border border-red-200 bg-red-50 p-3 text-base text-red-900"><p>{c.error}</p><button type="button" onClick={dismissLocally} className="min-h-11 font-semibold underline">{c.local}</button></div>}
        <div className="flex flex-wrap justify-between gap-3">
          {step > 0 && <Button variant="outline" className="min-h-11" disabled={saving} onClick={() => setStep(step - 1)}>{c.back}</Button>}
          {step < 2 ? <Button className="ms-auto min-h-11 bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]" disabled={saving} onClick={() => setStep(step + 1)}>{c.next}</Button> : <Button className="ms-auto min-h-11 h-auto gap-2 whitespace-normal bg-[var(--cd-brand)] text-white hover:bg-[var(--cd-brand-hover)]" disabled={saving} onClick={() => void finish('/apprendre')}>{saving && <Loader2 className="size-4 animate-spin" />}{saving ? c.saving : c.start}</Button>}
        </div>
        <button type="button" disabled={saving} onClick={() => void finish()} className="min-h-11 text-base text-[var(--cd-muted)] underline underline-offset-4">{c.skip}</button>
      </DialogContent>
    </Dialog>
  </>
}
