'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export const LANGUAGES = [
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

type LanguageCode = 'fr' | 'en' | 'es' | 'de' | 'it' | 'pt' | 'zh' | 'ja' | 'ar'

interface LanguageContextType {
  language: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string) => string
}

const translations: Record<LanguageCode, Record<string, string>> = {
  fr: {
    dashboard: 'Tableau de bord',
    documents: 'Documents',
    billing: 'Abonnement',
    settings: 'Paramètres',
    summary: 'Résumé',
    risks: 'Risques & Questions',
    easyReading: 'Lecture facile',
    flashcards: 'Flashcards',
    slides: 'Slides',
    translate: 'Traduire',
    translating: 'Traduction...',
    generate: 'Générer',
    download: 'Télécharger',
    copy: 'Copier',
    previous: 'Précédent',
    next: 'Suivant',
    chat: 'Discutez avec votre PDF',
    askQuestion: 'Posez votre question...',
  },
  en: {
    dashboard: 'Dashboard',
    documents: 'Documents',
    billing: 'Billing',
    settings: 'Settings',
    summary: 'Summary',
    risks: 'Risks & Questions',
    easyReading: 'Easy Reading',
    flashcards: 'Flashcards',
    slides: 'Slides',
    translate: 'Translate',
    translating: 'Translating...',
    generate: 'Generate',
    download: 'Download',
    copy: 'Copy',
    previous: 'Previous',
    next: 'Next',
    chat: 'Chat with your PDF',
    askQuestion: 'Ask your question...',
  },
  es: {
    dashboard: 'Panel',
    documents: 'Documentos',
    billing: 'Facturación',
    settings: 'Ajustes',
    summary: 'Resumen',
    risks: 'Riesgos y Preguntas',
    easyReading: 'Lectura fácil',
    flashcards: 'Tarjetas',
    slides: 'Diapositivas',
    translate: 'Traducir',
    translating: 'Traduciendo...',
    generate: 'Generar',
    download: 'Descargar',
    copy: 'Copiar',
    previous: 'Anterior',
    next: 'Siguiente',
    chat: 'Chatea con tu PDF',
    askQuestion: 'Haz tu pregunta...',
  },
  de: {
    dashboard: 'Dashboard',
    documents: 'Dokumente',
    billing: 'Abrechnung',
    settings: 'Einstellungen',
    summary: 'Zusammenfassung',
    risks: 'Risiken & Fragen',
    easyReading: 'Einfaches Lesen',
    flashcards: 'Karteikarten',
    slides: 'Folien',
    translate: 'Übersetzen',
    translating: 'Übersetze...',
    generate: 'Generieren',
    download: 'Herunterladen',
    copy: 'Kopieren',
    previous: 'Zurück',
    next: 'Weiter',
    chat: 'Chatten Sie mit Ihrem PDF',
    askQuestion: 'Stellen Sie Ihre Frage...',
  },
  it: {
    dashboard: 'Pannello',
    documents: 'Documenti',
    billing: 'Fatturazione',
    settings: 'Impostazioni',
    summary: 'Riepilogo',
    risks: 'Rischi e Domande',
    easyReading: 'Lettura facile',
    flashcards: 'Flashcard',
    slides: 'Diapositive',
    translate: 'Traduci',
    translating: 'Traduzione...',
    generate: 'Genera',
    download: 'Scarica',
    copy: 'Copia',
    previous: 'Precedente',
    next: 'Successivo',
    chat: 'Chatta con il tuo PDF',
    askQuestion: 'Fai la tua domanda...',
  },
  pt: {
    dashboard: 'Painel',
    documents: 'Documentos',
    billing: 'Faturamento',
    settings: 'Configurações',
    summary: 'Resumo',
    risks: 'Riscos e Perguntas',
    easyReading: 'Leitura fácil',
    flashcards: 'Flashcards',
    slides: 'Slides',
    translate: 'Traduzir',
    translating: 'Traduzindo...',
    generate: 'Gerar',
    download: 'Baixar',
    copy: 'Copiar',
    previous: 'Anterior',
    next: 'Próximo',
    chat: 'Converse com seu PDF',
    askQuestion: 'Faça sua pergunta...',
  },
  zh: {
    dashboard: '仪表板',
    documents: '文档',
    billing: '账单',
    settings: '设置',
    summary: '摘要',
    risks: '风险与问题',
    easyReading: '简易阅读',
    flashcards: '闪卡',
    slides: '幻灯片',
    translate: '翻译',
    translating: '翻译中...',
    generate: '生成',
    download: '下载',
    copy: '复制',
    previous: '上一个',
    next: '下一个',
    chat: '与您的PDF聊天',
    askQuestion: '提问...',
  },
  ja: {
    dashboard: 'ダッシュボード',
    documents: 'ドキュメント',
    billing: '請求',
    settings: '設定',
    summary: '要約',
    risks: 'リスクと質問',
    easyReading: '簡単に読む',
    flashcards: 'フラッシュカード',
    slides: 'スライド',
    translate: '翻訳',
    translating: '翻訳中...',
    generate: '生成',
    download: 'ダウンロード',
    copy: 'コピー',
    previous: '前へ',
    next: '次へ',
    chat: 'PDFとチャット',
    askQuestion: '質問する...',
  },
  ar: {
    dashboard: 'لوحة التحكم',
    documents: 'المستندات',
    billing: 'الفواتير',
    settings: 'الإعدادات',
    summary: 'ملخص',
    risks: 'المخاطر والأسئلة',
    easyReading: 'قراءة سهلة',
    flashcards: 'بطاقات',
    slides: 'شرائح',
    translate: 'ترجمة',
    translating: 'جاري الترجمة...',
    generate: 'إنشاء',
    download: 'تحميل',
    copy: 'نسخ',
    previous: 'السابق',
    next: 'التالي',
    chat: 'تحدث مع PDF',
    askQuestion: 'اطرح سؤالك...',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('fr')

  useEffect(() => {
    // Detect browser language on mount
    const stored = localStorage.getItem('pdftalk-language') as LanguageCode
    if (stored && LANGUAGES.find(l => l.code === stored)) {
      setLanguageState(stored)
    } else {
      const browserLang = navigator.language.split('-')[0] as LanguageCode
      if (LANGUAGES.find(l => l.code === browserLang)) {
        setLanguageState(browserLang)
      }
    }
  }, [])

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang)
    localStorage.setItem('pdftalk-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations.fr[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
