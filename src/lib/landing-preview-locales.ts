import type { SeoLocale } from '@/lib/seo-locales'

export const landingPreviewCopy: Record<SeoLocale, { example: string; snippets: readonly [string, string, string] }> = {
  en: { example: 'Example', snippets: ['The cell membrane controls exchanges between a cell and its surroundings.', 'Question: What does the cell membrane regulate?', 'Try it: Which structure controls what enters and leaves a cell?'] },
  es: { example: 'Ejemplo', snippets: ['La membrana celular regula los intercambios entre la célula y su entorno.', 'Pregunta: ¿Qué regula la membrana celular?', 'Practica: ¿Qué estructura controla lo que entra y sale de una célula?'] },
  de: { example: 'Beispiel', snippets: ['Die Zellmembran regelt den Austausch zwischen der Zelle und ihrer Umgebung.', 'Frage: Was regelt die Zellmembran?', 'Übung: Welche Struktur steuert, was in eine Zelle hinein- und hinausgelangt?'] },
  it: { example: 'Esempio', snippets: ['La membrana cellulare regola gli scambi tra la cellula e l’ambiente.', 'Domanda: Che cosa regola la membrana cellulare?', 'Esercizio: Quale struttura controlla ciò che entra ed esce dalla cellula?'] },
  pt: { example: 'Exemplo', snippets: ['A membrana celular regula as trocas entre a célula e o meio envolvente.', 'Pergunta: O que regula a membrana celular?', 'Pratica: Que estrutura controla o que entra e sai da célula?'] },
  zh: { example: '示例', snippets: ['细胞膜调节细胞与周围环境之间的物质交换。', '问题：细胞膜调节什么？', '练习：什么结构控制物质进出细胞？'] },
  ja: { example: '例', snippets: ['細胞膜は細胞と周囲の環境との物質のやり取りを調節します。', '質問：細胞膜は何を調節しますか？', '練習：細胞に出入りする物質を制御する構造は何ですか？'] },
  ar: { example: 'مثال', snippets: ['ينظم غشاء الخلية تبادل المواد بين الخلية ومحيطها.', 'سؤال: ما الذي ينظمه غشاء الخلية؟', 'تدرب: ما البنية التي تتحكم فيما يدخل الخلية ويخرج منها؟'] },
}
