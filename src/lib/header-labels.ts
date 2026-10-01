import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

// Keep compact header labels separate from long editorial/article content.
export const headerLabels: Record<StudyPdfLocale, { trial: string; studio: string; guides: string; average: string }> = {
  fr: { trial: 'Essayer', studio: 'Le studio PDF', guides: 'Guides de révision', average: 'Calculer ma moyenne' },
  en: { trial: 'Try free', studio: 'PDF study workspace', guides: 'Study guides', average: 'Grade calculator' },
  es: { trial: 'Probar', studio: 'Espacio de estudio PDF', guides: 'Guías de estudio', average: 'Calcular mi promedio' },
  de: { trial: 'Gratis testen', studio: 'PDF-Lernbereich', guides: 'Lernratgeber', average: 'Notendurchschnitt' },
  it: { trial: 'Prova', studio: 'Spazio di studio PDF', guides: 'Guide di studio', average: 'Calcola la media' },
  pt: { trial: 'Experimentar', studio: 'Espaço de estudo PDF', guides: 'Guias de estudo', average: 'Calcular a média' },
  zh: { trial: '免费试用', studio: 'PDF 学习空间', guides: '学习指南', average: '平均分计算器' },
  ja: { trial: '無料体験', studio: 'PDF学習スペース', guides: '学習ガイド', average: '平均点を計算' },
  ar: { trial: 'جرّب مجانًا', studio: 'مساحة دراسة PDF', guides: 'أدلة المراجعة', average: 'حساب المعدل' },
}
