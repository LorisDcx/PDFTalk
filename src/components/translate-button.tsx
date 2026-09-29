'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages, Loader2 } from 'lucide-react'
import { LANGUAGES, useLanguage } from '@/lib/i18n'
import { useToast } from '@/components/ui/use-toast'

interface TranslateButtonProps {
  content: string
  onTranslate: (translatedContent: string) => void
  size?: 'sm' | 'default' | 'icon'
}

export function TranslateButton({ content, onTranslate, size = 'sm' }: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()

  const handleTranslate = async (targetLang: string) => {
    if (!content || isTranslating) return
    
    setIsTranslating(true)
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: content,
          targetLanguage: targetLang 
        }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || typeof data.translatedText !== 'string' || !data.translatedText.trim()) throw new Error(data.error || 'Translation unavailable')
      onTranslate(data.translatedText)
    } catch (error) {
      console.error('Translation error:', error)
      toast({ title: t('error'), description: t('translationUnavailable'), variant: 'destructive' })
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} disabled={isTranslating} className="min-h-11 gap-2" aria-label={t('translate')}>
          {isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
          {size !== 'icon' && (
            <span className="hidden sm:inline">
              {isTranslating ? t('translating') : t('translate')}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleTranslate(lang.code)}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
