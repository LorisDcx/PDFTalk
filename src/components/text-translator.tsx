'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Languages, Loader2, Copy, Check } from 'lucide-react'
import { useToast } from './ui/use-toast'
import { cn } from '@/lib/utils'

interface TextTranslatorProps {
  text: string
  className?: string
}

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

export function TextTranslator({ text, className }: TextTranslatorProps) {
  const [targetLanguage, setTargetLanguage] = useState('fr')
  const [translatedText, setTranslatedText] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleTranslate = async () => {
    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLanguage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed')
      }

      setTranslatedText(data.translatedText)
      setShowTranslation(true)
      
      toast({
        title: '✅ Traduction terminée',
        description: `Texte traduit en ${languages.find(l => l.code === targetLanguage)?.name}`,
      })
    } catch (error: any) {
      console.error('Translation error:', error)
      toast({
        title: 'Erreur de traduction',
        description: error.message || 'Veuillez réessayer',
        variant: 'destructive',
      })
    } finally {
      setIsTranslating(false)
    }
  }

  const copyToClipboard = async () => {
    if (typeof window === 'undefined' || !navigator.clipboard) return
    
    try {
      await navigator.clipboard.writeText(translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: '✅ Copié',
        description: 'Traduction copiée dans le presse-papier',
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de copier le texte',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <Card className="p-4 bg-muted/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Languages className="h-5 w-5 text-primary" />
            <span>Traduire le texte</span>
          </div>
          
          <div className="flex items-center gap-2 flex-1">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleTranslate}
              disabled={isTranslating}
              size="sm"
              className="ml-auto"
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traduction...
                </>
              ) : (
                <>
                  <Languages className="mr-2 h-4 w-4" />
                  Traduire
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {showTranslation && translatedText && (
        <Card className="p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span>
                {languages.find(l => l.code === targetLanguage)?.flag}
              </span>
              <span>Traduction en {languages.find(l => l.code === targetLanguage)?.name}</span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-500" />
                  Copié
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copier
                </>
              )}
            </Button>
          </div>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-foreground">{translatedText}</p>
          </div>
        </Card>
      )}
    </div>
  )
}
