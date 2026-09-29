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
import { STUDY_PDF_LOCALES, studyPdfPath } from '@/lib/study-pdf-locales'
import { pdfHubPath } from '@/lib/pdf-tool-locales'

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()
  const currentLang = LANGUAGES.find(l => l.code === language)

  const marketingPaths = new Set([
    '/', '/pour-etudiants', '/fiches-revision', '/quiz-pdf', '/humanizer',
    '/flashcards-landing', '/quiz', '/pdf', '/resume',
  ])

  const changeLanguage = (code: typeof language) => {
    setLanguage(code)
    if (marketingPaths.has(pathname) || STUDY_PDF_LOCALES.some(locale => pathname === (locale === 'fr' ? '/' : `/${locale}`))) {
      router.push(code === 'fr' ? '/' : `/${code}`)
    } else if (STUDY_PDF_LOCALES.some(locale => pathname === studyPdfPath(locale))) {
      router.push(studyPdfPath(code))
    } else if (STUDY_PDF_LOCALES.some(locale => pathname === pdfHubPath(locale))) {
      router.push(pdfHubPath(code))
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 rounded-full text-[#5d4c5a] hover:bg-[#f3e8ef]" aria-label="Choisir la langue">
          <Globe className="h-4 w-4" />
          <span className="text-[11px] font-bold uppercase">{currentLang?.code}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code as typeof language)}
            className={language === lang.code ? 'bg-primary/10' : ''}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
