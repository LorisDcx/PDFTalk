'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Languages, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

interface LanguageSelectorProps {
  documentId: string
  onLanguageChange?: (language: string) => void
}

export function LanguageSelector({ documentId, onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('fr')

  // Load saved language for this document
  useEffect(() => {
    const saved = localStorage.getItem(`language-${documentId}`)
    if (saved) {
      setSelectedLanguage(saved)
    }
  }, [documentId])

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode)
    localStorage.setItem(`language-${documentId}`, langCode)
    onLanguageChange?.(langCode)
  }

  const currentLang = LANGUAGES.find(l => l.code === selectedLanguage) || LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 group hover:border-primary/50 hover:bg-primary/5 transition-all">
          <Languages className="h-4 w-4 group-hover:text-primary transition-colors" />
          <span>{currentLang.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              selectedLanguage === lang.code && "bg-primary/10"
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="flex-1">{lang.name}</span>
            {selectedLanguage === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Helper to get language name for prompts
export function getLanguageName(code: string): string {
  const lang = LANGUAGES.find(l => l.code === code)
  return lang?.name || 'Français'
}
