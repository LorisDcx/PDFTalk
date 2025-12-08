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
import { LANGUAGES } from '@/lib/i18n'

interface TranslateButtonProps {
  content: string
  onTranslate: (translatedContent: string) => void
  size?: 'sm' | 'default' | 'icon'
}

export function TranslateButton({ content, onTranslate, size = 'sm' }: TranslateButtonProps) {
  const [isTranslating, setIsTranslating] = useState(false)

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

      if (response.ok) {
        const data = await response.json()
        onTranslate(data.translatedText)
      }
    } catch (error) {
      console.error('Translation error:', error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={size} disabled={isTranslating} className="gap-2">
          {isTranslating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Languages className="h-4 w-4" />
          )}
          {size !== 'icon' && (
            <span className="hidden sm:inline">
              {isTranslating ? 'Traduction...' : 'Traduire'}
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
