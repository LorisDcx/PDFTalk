'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/lib/i18n'
import type { SeoLocale } from '@/lib/seo-locales'

export function LocalePreference({ locale }: { locale: SeoLocale | 'fr' }) {
  const { setLanguage } = useLanguage()
  useEffect(() => {
    setLanguage(locale)
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale, setLanguage])
  return null
}

export function HtmlLanguage({ locale }: { locale: SeoLocale | 'fr' }) {
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  }, [locale])
  return null
}
