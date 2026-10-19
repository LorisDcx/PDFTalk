const locales = ['fr', 'en', 'es', 'de', 'it', 'pt', 'zh', 'ja', 'ar'] as const
type AuthLocale = typeof locales[number]

export function authLocaleFromSearch(search: string): AuthLocale | null {
  const locale = new URLSearchParams(search).get('lang')
  return locales.find(value => value === locale) ?? null
}

export function authHref(path: string, locale: string): string {
  const [pathname, query] = path.split('?')
  const params = new URLSearchParams(query)
  params.set('lang', locales.find(value => value === locale) ?? 'fr')
  return `${pathname}?${params}`
}

export function authHomeHref(locale: string): string {
  return locale === 'fr' || !locales.some(value => value === locale) ? '/' : `/${locale}`
}

export const authBackLabels: Record<AuthLocale, string> = {
  fr: 'Retour au site', en: 'Back to site', es: 'Volver al sitio',
  de: 'Zurück zur Website', it: 'Torna al sito', pt: 'Voltar ao site',
  zh: '返回网站', ja: 'サイトに戻る', ar: 'العودة إلى الموقع',
}
