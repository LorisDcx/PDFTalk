'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { 
  Loader2, 
  Send, 
  Lightbulb, 
  Bug, 
  CreditCard, 
  MessageCircle,
  Sparkles,
  ArrowLeft,
  Mail,
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const TOPICS = [
  { value: 'idea', label: 'Idée / Suggestion', icon: Lightbulb, color: 'text-amber-500' },
  { value: 'issue', label: 'Bug / Problème', icon: Bug, color: 'text-red-500' },
  { value: 'billing', label: 'Facturation', icon: CreditCard, color: 'text-blue-500' },
  { value: 'other', label: 'Autre', icon: MessageCircle, color: 'text-purple-500' },
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
    } catch (err: any) {
      toast({ title: 'Échec de l\'envoi', description: err.message, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const selectedTopic = TOPICS.find(t => t.value === topic)

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3">Message envoyé !</h1>
          <p className="text-muted-foreground mb-8">
            Merci pour ton retour. On te répond très vite. 🚀
          </p>
          <Button asChild className="bg-gradient-to-r from-primary to-orange-500 hover:opacity-90">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <div className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Retour</span>
          </Link>
          <Link href="/" className="font-bold text-xl bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
            Cramdesk
          </Link>
          <div className="w-16" />
        </div>
      </div>

      <div className="container max-w-4xl py-12 px-4">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Mail className="h-4 w-4" />
            <span>On t'écoute</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Une idée ? Un bug ?{' '}
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Dis-nous tout.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cramdesk est fait pour les étudiants, par des étudiants. Chaque retour compte pour améliorer l'app.
          </p>
        </div>

        {/* Form Card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-card border rounded-2xl p-6 md:p-8 shadow-xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Topic Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Quel est le sujet ?</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {TOPICS.map(t => {
                    const Icon = t.icon
                    const isSelected = topic === t.value
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setTopic(t.value)}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          isSelected 
                            ? "border-primary bg-primary/5 shadow-md" 
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        )}
                      >
                        <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : t.color)} />
                        <span className={cn("text-sm font-medium", isSelected && "text-primary")}>{t.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Ton nom <span className="text-muted-foreground">(optionnel)</span></Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Ton email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jean@universite.fr"
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">Ton message <span className="text-red-500">*</span></Label>
                <Textarea
                  id="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    topic === 'idea' ? "J'aimerais que Cramdesk puisse..." :
                    topic === 'issue' ? "J'ai rencontré un problème quand..." :
                    topic === 'billing' ? "Concernant mon abonnement..." :
                    "Bonjour, je souhaite..."
                  }
                  className="rounded-xl resize-none"
                />
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                size="lg"
                className="w-full h-14 text-lg rounded-xl bg-gradient-to-r from-primary to-orange-500 hover:opacity-90 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Envoyer le message
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                On répond généralement sous 24h. Promis, un humain lit ton message. 💬
              </p>
            </form>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Réponse rapide</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Équipe réactive</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-blue-500" />
            <span>Support humain</span>
          </div>
        </div>
      </div>
    </div>
  )
}
