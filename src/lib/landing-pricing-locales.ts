import type { SeoLocale } from '@/lib/seo-locales'

type PricingCopy = {
  monthly: string
  pagesMonthly: string
  pagesDocument: string
  flashcards: string
  quizQuestions: string
  featured: string
  start: string
  details: readonly [string, string, string]
}

export const landingPricingCopy: Record<SeoLocale, PricingCopy> = {
  en: { monthly: 'month', pagesMonthly: 'pages / month', pagesDocument: 'pages per PDF', flashcards: 'flashcards per set', quizQuestions: 'questions per quiz', featured: 'Popular', start: 'Start free trial', details: ['For one course or exam.', 'For several subjects.', 'For large reading volumes.'] },
  es: { monthly: 'mes', pagesMonthly: 'páginas / mes', pagesDocument: 'páginas por PDF', flashcards: 'tarjetas por generación', quizQuestions: 'preguntas por cuestionario', featured: 'Popular', start: 'Empezar prueba gratis', details: ['Para una asignatura o un examen.', 'Para varias asignaturas.', 'Para grandes volúmenes de lectura.'] },
  de: { monthly: 'Monat', pagesMonthly: 'Seiten / Monat', pagesDocument: 'Seiten pro PDF', flashcards: 'Karteikarten pro Erstellung', quizQuestions: 'Fragen pro Quiz', featured: 'Beliebt', start: 'Kostenlos testen', details: ['Für einen Kurs oder eine Prüfung.', 'Für mehrere Fächer.', 'Für umfangreiche Lektüre.'] },
  it: { monthly: 'mese', pagesMonthly: 'pagine / mese', pagesDocument: 'pagine per PDF', flashcards: 'flashcard per generazione', quizQuestions: 'domande per quiz', featured: 'Popolare', start: 'Inizia la prova gratuita', details: ['Per un corso o un esame.', 'Per più materie.', 'Per grandi quantità di letture.'] },
  pt: { monthly: 'mês', pagesMonthly: 'páginas / mês', pagesDocument: 'páginas por PDF', flashcards: 'cartões por geração', quizQuestions: 'perguntas por questionário', featured: 'Popular', start: 'Iniciar teste grátis', details: ['Para uma disciplina ou exame.', 'Para várias disciplinas.', 'Para grandes volumes de leitura.'] },
  zh: { monthly: '月', pagesMonthly: '页 / 月', pagesDocument: '每份 PDF 页数', flashcards: '每次生成的记忆卡', quizQuestions: '每次测验的题目', featured: '热门', start: '开始免费试用', details: ['适合一门课程或一次考试。', '适合多门学科。', '适合大量文献阅读。'] },
  ja: { monthly: '月', pagesMonthly: 'ページ / 月', pagesDocument: 'PDF 1件あたりのページ', flashcards: '1回の生成で作れるカード', quizQuestions: '1回のクイズの問題', featured: '人気', start: '無料で試す', details: ['1科目や1つの試験に。', '複数の科目に。', '大量の資料を読む方に。'] },
  ar: { monthly: 'شهر', pagesMonthly: 'صفحة / شهر', pagesDocument: 'صفحة لكل PDF', flashcards: 'بطاقة لكل إنشاء', quizQuestions: 'سؤال لكل اختبار', featured: 'الأكثر اختيارًا', start: 'ابدأ التجربة المجانية', details: ['لمقرر واحد أو امتحان.', 'لعدة مواد دراسية.', 'لكميات كبيرة من القراءة.'] },
}
