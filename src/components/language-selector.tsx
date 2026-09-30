'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import { useLanguage, LANGUAGES } from '@/lib/i18n'
import { usePathname, useRouter } from 'next/navigation'
import { STUDY_PDF_LOCALES, studyPdfPath, type StudyPdfLocale } from '@/lib/study-pdf-locales'
import { pdfHubPath } from '@/lib/pdf-tool-locales'
import { CURATED_DECK_IDS, curatedDeckPath, freeFlashcardsPath } from '@/lib/curated-decks'

export function LanguageSelector({ currentLocale, label }: { currentLocale?: StudyPdfLocale; label?: string } = {}) {
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const displayLanguage = currentLocale ?? language
  const currentLang = LANGUAGES.find(l => l.code === displayLanguage)

  const marketingPaths = new Set([
    '/', '/pour-etudiants', '/fiches-revision', '/quiz-pdf', '/humanizer',
    '/flashcards-landing', '/quiz', '/pdf', '/resume',
  ])

  const changeLanguage = (code: typeof language) => {
    setLanguage(code)
    const deck = CURATED_DECK_IDS.find(id => STUDY_PDF_LOCALES.some(locale => pathname === curatedDeckPath(locale, id)))
    if (deck) {
      router.push(curatedDeckPath(code, deck))
      return
    }
    if (marketingPaths.has(pathname) || STUDY_PDF_LOCALES.some(locale => pathname === (locale === 'fr' ? '/' : `/${locale}`))) {
      router.push(code === 'fr' ? '/' : `/${code}`)
    } else if (STUDY_PDF_LOCALES.some(locale => pathname === freeFlashcardsPath(locale))) {
      router.push(freeFlashcardsPath(code))
    } else if (STUDY_PDF_LOCALES.some(locale => pathname === studyPdfPath(locale))) {
      router.push(studyPdfPath(code))
    } else if (STUDY_PDF_LOCALES.some(locale => pathname === pdfHubPath(locale))) {
      router.push(pdfHubPath(code))
    } else if (currentLocale) {
      router.push(code === 'fr' ? '/' : `/${code}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="min-h-11 gap-2 rounded-xl text-[#5d4c5a] hover:bg-[#fff0e6]" aria-label={label ?? 'Choisir la langue'}>
          <Globe className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase">{currentLang?.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code as typeof language)}
            className={displayLanguage === lang.code ? 'bg-primary/10' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
