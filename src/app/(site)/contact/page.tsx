'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bug, CheckCircle2, CreditCard, Lightbulb, Loader2, Mail, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { FeaturePageShell } from '@/components/feature-page-shell'
import { cn } from '@/lib/utils'

const TOPICS = [
  { value: 'idea', label: 'Idée / Suggestion', icon: Lightbulb },
  { value: 'issue', label: 'Bug / Problème', icon: Bug },
  { value: 'billing', label: 'Facturation', icon: CreditCard },
  { value: 'other', label: 'Autre', icon: MessageCircle },
]

export default function ContactPage() {
  const { toast } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('idea')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !email.trim()) {
      toast({ title: 'Merci de remplir email et message.', variant: 'destructive' })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur envoi')
      setSent(true)
    } catch (err: unknown) {
      toast({ title: 'Échec de l’envoi', description: err instanceof Error ? err.message : 'Une erreur est survenue.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <FeaturePageShell>
      {sent ? (
        <div className="flex min-h-[65vh] items-center justify-center px-5 py-20 sm:px-8">
          <div role="status" className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-[#efdcd0] bg-white px-6 py-14 text-center shadow-[0_30px_80px_-50px_rgba(59,34,56,.38)] sm:px-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-[#f4e5ef] blur-3xl" />
            <span className="relative mx-auto flex size-16 items-center justify-center rounded-[1.3rem] bg-[#f0e5ed] text-[#b84432]"><CheckCircle2 className="size-7" aria-hidden="true" /></span>
            <h1 className="font-editorial relative mt-6 text-4xl leading-tight sm:text-5xl">Message envoyé.</h1>
            <p className="relative mx-auto mt-4 max-w-sm text-sm leading-7 text-[#736873]">Merci pour ton retour. Nous reviendrons vers toi dès que possible.</p>
            <Link href="/" className="relative mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b84432] px-6 text-sm font-bold text-white transition hover:bg-[#963326] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-2"><ArrowLeft className="size-4" aria-hidden="true" />Retour à l’accueil</Link>
          </div>
        </div>
      ) : (
        <div className="relative px-5 pb-24 pt-12 sm:px-8 sm:pt-16 lg:pb-32">
          <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-48 size-[600px] rounded-full bg-[#ffe9da] opacity-70 blur-[110px]" />
          <div className="relative mx-auto max-w-6xl">
            <Link href="/" className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#e8dce5] bg-white px-4 py-2 text-sm font-semibold text-[#67435d] transition hover:border-[#bfa8b8] hover:bg-[#fff4ed] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]"><ArrowLeft className="size-4" aria-hidden="true" />Retour</Link>
            <div className="grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="mb-5 text-[11px] font-bold uppercase tracking-[.23em] text-[#b45438]">Nous contacter</p>
                <h1 className="font-editorial text-[clamp(3.1rem,5.5vw,5.6rem)] leading-[1.02] tracking-[-.055em]">Une idée ?<br />Un bug ?<br /><span className="italic text-[#c25334]">Dis-nous tout.</span></h1>
                <p className="mt-7 max-w-md text-base leading-8 text-[#6e6470]">Une question sur ton compte, un problème à signaler ou une idée pour CramDesk ? Décris-nous ce qui se passe et nous lirons ton message.</p>
                <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-[#efdcd0] bg-white px-4 py-3 text-sm text-[#765d70]">
                  <Mail className="size-4 shrink-0 text-[#bc6b50]" aria-hidden="true" />
                  <a href="mailto:contact.cramdesk@gmail.com" className="break-all underline decoration-[#cfb5c6] underline-offset-4 hover:text-[#b84432]">contact.cramdesk@gmail.com</a>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-[#efdcd0] bg-white p-5 shadow-[0_32px_80px_-50px_rgba(59,34,56,.35)] sm:p-8">
                <h2 className="font-editorial text-3xl leading-tight">Écris-nous.</h2>
                <p className="mt-2 text-sm leading-6 text-[#807581]">Les champs marqués d’un * sont obligatoires.</p>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                  <fieldset>
                    <legend className="mb-3 text-sm font-semibold text-[#3e303e]">Quel est le sujet ?</legend>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {TOPICS.map(item => {
                        const Icon = item.icon
                        const isSelected = topic === item.value
                        return (
                          <button key={item.value} type="button" aria-pressed={isSelected} onClick={() => setTopic(item.value)} className={cn('flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 text-center text-xs font-semibold leading-4 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]', isSelected ? 'border-[#b891ac] bg-[#f6ecf3] text-[#b84432]' : 'border-[#f0dfd5] bg-[#fcfafb] text-[#7b6f7b] hover:border-[#cdb6c6] hover:bg-[#faf4f8]')}>
                            <Icon className="size-5" aria-hidden="true" />{item.label}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-[#3e303e]">Ton nom <span className="font-normal text-[#918491]">(optionnel)</span></Label>
                      <Input id="name" autoComplete="name" maxLength={120} value={name} onChange={e => setName(e.target.value)} placeholder="Jean Dupont" className="h-12 rounded-xl border-[#e6dce3] bg-[#fcfafb] focus-visible:ring-[#b84432]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-[#3e303e]">Ton email *</Label>
                      <Input id="email" type="email" autoComplete="email" maxLength={254} required value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@universite.fr" className="h-12 rounded-xl border-[#e6dce3] bg-[#fcfafb] focus-visible:ring-[#b84432]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-semibold text-[#3e303e]">Ton message *</Label>
                    <Textarea id="message" required maxLength={5000} rows={6} value={message} onChange={e => setMessage(e.target.value)} className="min-h-36 resize-y rounded-xl border-[#e6dce3] bg-[#fcfafb] focus-visible:ring-[#b84432]" placeholder={topic === 'idea' ? "J’aimerais que CramDesk puisse..." : topic === 'issue' ? "J’ai rencontré un problème quand..." : topic === 'billing' ? "Concernant mon abonnement..." : "Bonjour, je souhaite..."} />
                  </div>

                  <Button type="submit" size="lg" disabled={loading} className="h-12 w-full rounded-full bg-[#b84432] text-sm font-bold text-white hover:bg-[#963326] sm:w-auto sm:px-8">
                    {loading ? <><Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />Envoi en cours...</> : <><Send className="mr-2 size-4" aria-hidden="true" />Envoyer le message</>}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </FeaturePageShell>
  )
}
