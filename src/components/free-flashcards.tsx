'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, Download, Plus, RotateCcw, Trash2, Upload } from 'lucide-react'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

type Card = { id: string; question: string; answer: string }
type Locale = StudyPdfLocale

const storageKey = 'cramdesk-free-flashcards-v1'
const maxCards = 40
const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-[#ead9cf] bg-white px-4 py-3 text-base text-[#33252b] outline-none transition focus:border-[#c95b3e] focus:ring-2 focus:ring-[#f6d5c5]'

const copy = {
  fr: {
    title: 'Ton jeu de cartes', question: 'Question ou notion', answer: 'Réponse à retrouver',
    questionPlaceholder: 'Ex. Quel est le rôle des mitochondries ?', answerPlaceholder: 'Ex. Elles produisent l’énergie utilisable par la cellule.',
    add: 'Ajouter une carte', limit: '40 cartes maximum par jeu', saved: 'Sauvegardé sur cet appareil',
    createFirst: 'Crée ta première carte pour lancer une session.', review: 'Session de rappel actif',
    start: 'Commencer à réviser', restart: 'Recommencer', show: 'Voir la réponse', know: 'Je savais', again: 'À revoir',
    done: 'Bravo, toutes les cartes ont été retrouvées.', doneHint: 'Reviens plus tard pour vérifier ce qui tient vraiment en mémoire.',
    progress: (known: number, total: number) => `${known} / ${total} maîtrisées`,
    remaining: (count: number) => `${count} carte${count > 1 ? 's' : ''} à retrouver`,
    myCards: 'Mes cartes', empty: 'Ton jeu est vide pour le moment.', remove: 'Supprimer la carte',
    export: 'Exporter mon jeu', import: 'Importer un jeu', invalid: 'Le fichier doit contenir un jeu CramDesk valide (40 cartes maximum).',
    storageError: 'Enregistrement local indisponible. Exporte ton jeu avant de quitter cette page.',
    helper: 'Les cartes restent dans ce navigateur. Exporte le fichier pour les conserver ou les transférer.',
    ctaTitle: 'Ton cours contient déjà les réponses ?', ctaText: 'Le studio CramDesk peut créer des cartes automatiquement à partir de ton PDF.',
    cta: 'Découvrir la génération depuis un PDF',
  },
  en: {
    title: 'Your deck', question: 'Question or concept', answer: 'Answer to recall',
    questionPlaceholder: 'E.g. What do mitochondria do?', answerPlaceholder: 'E.g. They produce usable energy for the cell.',
    add: 'Add a card', limit: 'Up to 40 cards per deck', saved: 'Saved on this device',
    createFirst: 'Create your first card to start a study session.', review: 'Active recall session',
    start: 'Start studying', restart: 'Start again', show: 'Show answer', know: 'I knew it', again: 'Review again',
    done: 'Well done. You recalled every card.', doneHint: 'Come back later to see what you still remember.',
    progress: (known: number, total: number) => `${known} / ${total} mastered`,
    remaining: (count: number) => `${count} card${count === 1 ? '' : 's'} to recall`,
    myCards: 'My cards', empty: 'Your deck is empty for now.', remove: 'Remove card',
    export: 'Export my deck', import: 'Import a deck', invalid: 'This file must contain a valid CramDesk deck (up to 40 cards).',
    storageError: 'Local saving is unavailable. Export your deck before leaving this page.',
    helper: 'Cards stay in this browser. Export the file to keep or transfer them.',
    ctaTitle: 'Already have a PDF full of answers?', ctaText: 'CramDesk can turn your course PDF into flashcards automatically.',
    cta: 'Explore flashcards from a PDF',
  },
  es: {
    title: 'Tu juego de tarjetas', question: 'Pregunta o concepto', answer: 'Respuesta que recordar', questionPlaceholder: 'Ej. ¿Qué función tienen las mitocondrias?', answerPlaceholder: 'Ej. Producen energía utilizable para la célula.', add: 'Añadir tarjeta', limit: 'Hasta 40 tarjetas por juego', saved: 'Guardado en este dispositivo', createFirst: 'Crea tu primera tarjeta para empezar.', review: 'Sesión de recuerdo activo', start: 'Empezar a estudiar', restart: 'Empezar de nuevo', show: 'Ver respuesta', know: 'La sabía', again: 'Repasar', done: 'Has recordado todas las tarjetas.', doneHint: 'Vuelve más tarde para comprobar qué recuerdas.', progress: (known: number, total: number) => `${known} / ${total} dominadas`, remaining: (count: number) => `${count} tarjetas pendientes`, myCards: 'Mis tarjetas', empty: 'Tu juego está vacío.', remove: 'Eliminar tarjeta', export: 'Exportar juego', import: 'Importar juego', invalid: 'El archivo debe contener un juego CramDesk válido (máximo 40 tarjetas).', storageError: 'No se puede guardar aquí. Exporta el juego antes de salir.', helper: 'Las tarjetas permanecen en este navegador. Expórtalas para conservarlas o transferirlas.', ctaTitle: '¿Ya tienes un PDF con las respuestas?', ctaText: 'CramDesk puede crear tarjetas automáticamente a partir de tu PDF.', cta: 'Crear tarjetas desde un PDF',
  },
  de: {
    title: 'Dein Kartenset', question: 'Frage oder Begriff', answer: 'Antwort zum Erinnern', questionPlaceholder: 'Z. B. Was machen Mitochondrien?', answerPlaceholder: 'Z. B. Sie erzeugen nutzbare Energie für die Zelle.', add: 'Karte hinzufügen', limit: 'Bis zu 40 Karten pro Set', saved: 'Auf diesem Gerät gespeichert', createFirst: 'Erstelle deine erste Karte zum Start.', review: 'Aktives Abrufen', start: 'Lernen starten', restart: 'Erneut beginnen', show: 'Antwort zeigen', know: 'Gewusst', again: 'Noch einmal', done: 'Du hast alle Karten erinnert.', doneHint: 'Komm später zurück und prüfe, was du noch weißt.', progress: (known: number, total: number) => `${known} / ${total} beherrscht`, remaining: (count: number) => `${count} Karten offen`, myCards: 'Meine Karten', empty: 'Dein Set ist noch leer.', remove: 'Karte löschen', export: 'Set exportieren', import: 'Set importieren', invalid: 'Die Datei muss ein gültiges CramDesk-Set enthalten (höchstens 40 Karten).', storageError: 'Lokales Speichern nicht möglich. Exportiere das Set vor dem Verlassen.', helper: 'Die Karten bleiben in diesem Browser. Exportiere sie zum Sichern oder Übertragen.', ctaTitle: 'Dein PDF enthält schon die Antworten?', ctaText: 'CramDesk kann aus deinem Kurs-PDF automatisch Karten erstellen.', cta: 'Karten aus PDF erstellen',
  },
  it: {
    title: 'Il tuo mazzo', question: 'Domanda o concetto', answer: 'Risposta da ricordare', questionPlaceholder: 'Es. Che funzione hanno i mitocondri?', answerPlaceholder: 'Es. Producono energia utilizzabile dalla cellula.', add: 'Aggiungi una carta', limit: 'Fino a 40 carte per mazzo', saved: 'Salvato su questo dispositivo', createFirst: 'Crea la prima carta per iniziare.', review: 'Sessione di richiamo attivo', start: 'Inizia a studiare', restart: 'Ricomincia', show: 'Mostra risposta', know: 'La sapevo', again: 'Da ripassare', done: 'Hai ricordato tutte le carte.', doneHint: 'Torna più tardi per verificare cosa ricordi ancora.', progress: (known: number, total: number) => `${known} / ${total} acquisite`, remaining: (count: number) => `${count} carte da ripassare`, myCards: 'Le mie carte', empty: 'Il mazzo è ancora vuoto.', remove: 'Elimina carta', export: 'Esporta mazzo', import: 'Importa mazzo', invalid: 'Il file deve contenere un mazzo CramDesk valido (massimo 40 carte).', storageError: 'Salvataggio locale non disponibile. Esporta il mazzo prima di uscire.', helper: 'Le carte restano in questo browser. Esportale per conservarle o trasferirle.', ctaTitle: 'Hai già un PDF con le risposte?', ctaText: 'CramDesk può creare automaticamente carte dal tuo PDF.', cta: 'Crea carte dal PDF',
  },
  pt: {
    title: 'O teu conjunto', question: 'Pergunta ou conceito', answer: 'Resposta a recordar', questionPlaceholder: 'Ex. Qual é a função das mitocôndrias?', answerPlaceholder: 'Ex. Produzem energia utilizável pela célula.', add: 'Adicionar cartão', limit: 'Até 40 cartões por conjunto', saved: 'Guardado neste dispositivo', createFirst: 'Cria o primeiro cartão para começar.', review: 'Sessão de recordação ativa', start: 'Começar a estudar', restart: 'Recomeçar', show: 'Mostrar resposta', know: 'Sabia', again: 'Rever', done: 'Recordaste todos os cartões.', doneHint: 'Volta mais tarde para veres o que ainda te lembras.', progress: (known: number, total: number) => `${known} / ${total} dominados`, remaining: (count: number) => `${count} cartões por rever`, myCards: 'Os meus cartões', empty: 'O conjunto ainda está vazio.', remove: 'Eliminar cartão', export: 'Exportar conjunto', import: 'Importar conjunto', invalid: 'O ficheiro deve conter um conjunto CramDesk válido (até 40 cartões).', storageError: 'Não foi possível guardar localmente. Exporta o conjunto antes de sair.', helper: 'Os cartões ficam neste navegador. Exporta-os para guardar ou transferir.', ctaTitle: 'O teu PDF já contém as respostas?', ctaText: 'A CramDesk pode criar cartões automaticamente a partir do PDF.', cta: 'Criar cartões a partir de PDF',
  },
  zh: {
    title: '我的卡组', question: '问题或概念', answer: '需要回忆的答案', questionPlaceholder: '例如：线粒体的作用是什么？', answerPlaceholder: '例如：为细胞产生可用的能量。', add: '添加卡片', limit: '每组最多 40 张卡片', saved: '保存在此设备上', createFirst: '先创建一张卡片再开始复习。', review: '主动回忆练习', start: '开始复习', restart: '重新开始', show: '显示答案', know: '我记得', again: '再复习', done: '你已回忆出全部卡片。', doneHint: '稍后再来，看看还能记住多少。', progress: (known: number, total: number) => `掌握 ${known} / ${total}`, remaining: (count: number) => `还有 ${count} 张卡片`, myCards: '我的卡片', empty: '卡组目前为空。', remove: '删除卡片', export: '导出卡组', import: '导入卡组', invalid: '文件必须是有效的 CramDesk 卡组（最多 40 张）。', storageError: '无法在本地保存。离开前请导出卡组。', helper: '卡片保存在此浏览器中。导出文件以备份或转移。', ctaTitle: '答案已经在你的 PDF 里？', ctaText: 'CramDesk 可以根据课程 PDF 自动制作卡片。', cta: '从 PDF 制作卡片',
  },
  ja: {
    title: '自分のカードセット', question: '質問・用語', answer: '思い出す答え', questionPlaceholder: '例：ミトコンドリアの役割は？', answerPlaceholder: '例：細胞が使えるエネルギーを作る。', add: 'カードを追加', limit: '1セット最大40枚', saved: 'この端末に保存', createFirst: '最初のカードを作って始めましょう。', review: '能動的な想起', start: '学習を始める', restart: 'もう一度', show: '答えを見る', know: '覚えていた', again: 'もう一度復習', done: 'すべてのカードを思い出せました。', doneHint: '時間をおいて、まだ覚えているか確かめましょう。', progress: (known: number, total: number) => `${known} / ${total} 枚を習得`, remaining: (count: number) => `残り ${count} 枚`, myCards: '自分のカード', empty: 'カードはまだありません。', remove: 'カードを削除', export: 'セットを書き出す', import: 'セットを読み込む', invalid: '有効な CramDesk セットを選んでください（最大40枚）。', storageError: '端末に保存できません。離れる前にセットを書き出してください。', helper: 'カードはこのブラウザーに保存されます。書き出して保管・移動できます。', ctaTitle: '答えが載ったPDFがありますか？', ctaText: 'CramDeskなら授業PDFからカードを自動作成できます。', cta: 'PDFからカードを作る',
  },
  ar: {
    title: 'مجموعة بطاقاتي', question: 'سؤال أو مفهوم', answer: 'الإجابة التي تريد تذكرها', questionPlaceholder: 'مثال: ما وظيفة الميتوكوندريا؟', answerPlaceholder: 'مثال: تنتج طاقة قابلة للاستخدام للخلية.', add: 'أضف بطاقة', limit: 'حتى 40 بطاقة لكل مجموعة', saved: 'محفوظة على هذا الجهاز', createFirst: 'أنشئ بطاقتك الأولى لتبدأ.', review: 'جلسة الاسترجاع النشط', start: 'ابدأ المذاكرة', restart: 'ابدأ من جديد', show: 'أظهر الإجابة', know: 'تذكرتها', again: 'راجعها مجددًا', done: 'لقد تذكرت جميع البطاقات.', doneHint: 'عد لاحقًا لتتحقق مما بقي في ذاكرتك.', progress: (known: number, total: number) => `أتقنت ${known} من ${total}`, remaining: (count: number) => `تبقى ${count} بطاقات`, myCards: 'بطاقاتي', empty: 'المجموعة فارغة حاليًا.', remove: 'احذف البطاقة', export: 'صدّر المجموعة', import: 'استورد مجموعة', invalid: 'يجب أن يحتوي الملف على مجموعة CramDesk صالحة (حتى 40 بطاقة).', storageError: 'الحفظ المحلي غير متاح. صدّر المجموعة قبل المغادرة.', helper: 'تبقى البطاقات في هذا المتصفح. صدّرها للاحتفاظ بها أو نقلها.', ctaTitle: 'هل يحتوي ملفك على الإجابات؟', ctaText: 'يمكن لـ CramDesk إنشاء بطاقات تلقائيًا من ملف المقرر.', cta: 'أنشئ بطاقات من PDF',
  },
} as const

function validCards(value: unknown): value is Array<{ id?: string; question: string; answer: string }> {
  return Array.isArray(value) && value.length <= maxCards && value.every(item =>
    item && typeof item.question === 'string' && typeof item.answer === 'string' &&
    item.question.trim().length > 0 && item.question.length <= 280 &&
    item.answer.trim().length > 0 && item.answer.length <= 600 &&
    (item.id === undefined || (typeof item.id === 'string' && item.id.length <= 100)),
  )
}

export function FreeFlashcards({ locale, deckId, initialCards, studyFirst = false }: { locale: Locale; deckId?: string; initialCards?: readonly (readonly [string, string])[]; studyFirst?: boolean }) {
  const t = copy[locale]
  const deckStorageKey = deckId ? `${storageKey}-${locale}-${deckId}` : storageKey
  const [cards, setCards] = useState<Card[]>(() => initialCards?.map(([question, answer], index) => ({ id: `${deckId}-${index}`, question, answer })) ?? [])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [hydrated, setHydrated] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [importError, setImportError] = useState(false)
  const [queue, setQueue] = useState<string[]>([])
  const [known, setKnown] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [session, setSession] = useState<'idle' | 'active' | 'complete'>('idle')
  const [editorOpen, setEditorOpen] = useState(!studyFirst)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(deckStorageKey)
        if (stored) {
          const parsed: unknown = JSON.parse(stored)
          if (validCards(parsed)) setCards(parsed.map(item => ({ id: item.id || crypto.randomUUID(), question: item.question, answer: item.answer })))
          else setStorageError(true)
        }
      } catch { setStorageError(true) }
      setHydrated(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [deckStorageKey, deckId, initialCards])

  useEffect(() => {
    if (!hydrated) return
    try { localStorage.setItem(deckStorageKey, JSON.stringify(cards)) }
    catch { window.setTimeout(() => setStorageError(true), 0) }
  }, [cards, hydrated, deckStorageKey])

  const resetSession = () => { setQueue([]); setKnown(0); setRevealed(false); setSession('idle') }

  const addCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuestion = question.trim()
    const nextAnswer = answer.trim()
    if (!nextQuestion || !nextAnswer || cards.length >= maxCards) return
    setCards(current => [...current, { id: crypto.randomUUID(), question: nextQuestion, answer: nextAnswer }])
    setQuestion('')
    setAnswer('')
    resetSession()
  }

  const exportDeck = () => {
    const payload = JSON.stringify(cards.map(({ question: front, answer: back }) => ({ question: front, answer: back })), null, 2)
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'cramdesk-flashcards.json'
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  const importDeck = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      if (file.size > 100_000) throw new Error('Too large')
      const parsed: unknown = JSON.parse(await file.text())
      if (!validCards(parsed)) throw new Error('Invalid deck')
      setCards(parsed.map(item => ({ id: crypto.randomUUID(), question: item.question.trim(), answer: item.answer.trim() })))
      setImportError(false)
      resetSession()
    } catch { setImportError(true) }
    event.target.value = ''
  }

  const currentCard = cards.find(card => card.id === queue[0])
  const startReview = () => { setQueue(cards.map(card => card.id)); setKnown(0); setRevealed(false); setSession('active') }
  const markKnown = () => {
    const remaining = queue.slice(1)
    setQueue(remaining)
    setKnown(current => current + 1)
    setRevealed(false)
    if (!remaining.length) setSession('complete')
  }
  const markAgain = () => { setQueue(current => [...current.slice(1), current[0]]); setRevealed(false) }

  return <section id="outil" className="scroll-mt-24 px-5 pb-24 sm:px-8 lg:pb-32">
    <div className={`mx-auto grid max-w-6xl items-start gap-8 lg:gap-10 ${studyFirst ? 'lg:grid-cols-[1.15fr_.85fr]' : 'lg:grid-cols-[.95fr_1.05fr]'}`}>
      <div className={`rounded-[1.8rem] border border-[#efdcd0] bg-white p-5 shadow-[0_26px_65px_-45px_rgba(120,49,35,.25)] sm:p-8 ${studyFirst ? 'order-2' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-[#b34c37]">CramDesk · Free</p><h2 className="font-editorial mt-1 text-3xl text-[#33252b]">{studyFirst ? <button type="button" aria-expanded={editorOpen} aria-controls="deck-editor" onClick={() => setEditorOpen(current => !current)} className="inline-flex items-center gap-2 rounded-md text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]">{t.title}<ChevronDown className={`size-5 text-[#b84432] transition-transform motion-reduce:transition-none ${editorOpen ? 'rotate-180' : ''}`} aria-hidden="true" /></button> : t.title}</h2></div><span className="rounded-full bg-[#fff0e6] px-3 py-1.5 text-xs font-bold text-[#b84432]">{cards.length}/{maxCards}</span></div>
        <div id="deck-editor" hidden={!editorOpen}>
        <form onSubmit={addCard} className="mt-7 space-y-4">
          <label className="block text-sm font-semibold text-[#493b3e]">{t.question}<textarea value={question} onChange={event => setQuestion(event.target.value)} maxLength={280} placeholder={t.questionPlaceholder} rows={2} className={fieldClass} /></label>
          <label className="block text-sm font-semibold text-[#493b3e]">{t.answer}<textarea value={answer} onChange={event => setAnswer(event.target.value)} maxLength={600} placeholder={t.answerPlaceholder} rows={3} className={fieldClass} /></label>
          <button type="submit" disabled={!question.trim() || !answer.trim() || cards.length >= maxCards} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b84432] px-5 text-sm font-bold text-white transition hover:bg-[#973326] disabled:cursor-not-allowed disabled:opacity-50"><Plus className="size-4" aria-hidden="true" />{t.add}</button>
          <p className="text-center text-xs text-[#8b7a78]">{t.limit} · {t.saved}</p>
        </form>
        <div className="mt-8 border-t border-[#f0dfd5] pt-6"><div className="flex items-center justify-between gap-3"><h3 className="font-editorial text-2xl text-[#33252b]">{t.myCards}</h3><span className="text-xs text-[#8b7a78]">{cards.length}/{maxCards}</span></div>{cards.length ? <ol className="mt-4 max-h-[360px] space-y-2 overflow-auto pr-1">{cards.map((card, index) => <li key={card.id} className="flex items-start gap-3 rounded-xl border border-[#f0dfd5] bg-[#fffbf8] p-3.5"><span className="mt-0.5 text-xs font-bold text-[#b46e56]">{String(index + 1).padStart(2, '0')}</span><p className="min-w-0 flex-1 break-words text-sm font-semibold leading-6 text-[#47383a]">{card.question}</p><button type="button" aria-label={`${t.remove} ${index + 1}`} onClick={() => { setCards(current => current.filter(item => item.id !== card.id)); resetSession() }} className="rounded-lg p-1 text-[#a28e89] hover:bg-[#fce8df] hover:text-[#a73d31]"><Trash2 className="size-4" aria-hidden="true" /></button></li>)}</ol> : <p className="mt-4 rounded-xl bg-[#fff7f1] p-4 text-sm text-[#857572]">{t.empty}</p>}</div>
        <div className="mt-7 grid gap-2 sm:grid-cols-2"><button type="button" onClick={exportDeck} disabled={!cards.length} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#ead7cc] bg-white px-4 text-xs font-bold text-[#a84431] hover:bg-[#fff5ee] disabled:opacity-40"><Download className="size-4" aria-hidden="true" />{t.export}</button><label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#ead7cc] bg-white px-4 text-xs font-bold text-[#a84431] hover:bg-[#fff5ee]"><Upload className="size-4" aria-hidden="true" />{t.import}<input type="file" accept="application/json,.json" onChange={importDeck} className="sr-only" /></label></div>
        {importError && <p role="alert" className="mt-3 text-sm text-[#a73d31]">{t.invalid}</p>}
        {storageError && <p role="alert" className="mt-3 text-sm text-[#a73d31]">{t.storageError}</p>}
        <p className="mt-5 text-xs leading-5 text-[#8b7a78]">{t.helper}</p>
        </div>
      </div>

      <div className={`rounded-[1.8rem] border border-[#efdcd0] bg-[#fff4ed] p-5 sm:p-8 ${studyFirst ? 'order-1' : ''}`}>
        <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.17em] text-[#b34c37]">{t.review}</p><h2 className="font-editorial mt-1 text-3xl text-[#33252b]">{session === 'active' ? t.progress(known, cards.length) : session === 'complete' ? t.done : cards.length ? t.start : t.createFirst}</h2></div><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#b84432]"><RotateCcw className="size-5" aria-hidden="true" /></span></div>
        {session === 'active' && currentCard ? <>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[.15em] text-[#a76a57]">{t.remaining(queue.length)}</p>
          <div role="progressbar" aria-label={t.progress(known, cards.length)} aria-valuenow={known} aria-valuemin={0} aria-valuemax={cards.length} className="mt-3 h-2 overflow-hidden rounded-full bg-[#eed9cb]"><span className="block h-full rounded-full bg-[#c25334] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${cards.length ? known / cards.length * 100 : 0}%` }} /></div>
          <div key={`${currentCard.id}-${revealed ? 'answer' : 'question'}`} aria-live="polite" className="study-card-motion mt-4 flex min-h-[300px] flex-col justify-between rounded-[1.4rem] bg-white p-7 shadow-[0_20px_45px_-35px_rgba(120,49,35,.35)] sm:min-h-[330px] sm:p-9"><div><span className="text-xs font-bold uppercase tracking-[.18em] text-[#b46e56]">{revealed ? t.answer : t.question}</span><p className="font-editorial mt-6 break-words text-3xl leading-snug text-[#33252b] sm:text-4xl">{revealed ? currentCard.answer : currentCard.question}</p></div><span className="mt-7 block h-1.5 w-20 rounded-full bg-[#e97743]" /></div>
          {revealed ? <div className="mt-5 grid grid-cols-2 gap-3"><button type="button" onClick={markAgain} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#dfb5a2] bg-white px-3 text-sm font-bold text-[#a84431] hover:bg-[#fff7f1]"><RotateCcw className="size-4" aria-hidden="true" />{t.again}</button><button type="button" onClick={markKnown} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b84432] px-3 text-sm font-bold text-white hover:bg-[#973326]"><Check className="size-4" aria-hidden="true" />{t.know}</button></div> : <button type="button" onClick={() => setRevealed(true)} className="mt-5 min-h-12 w-full rounded-full bg-[#b84432] px-5 text-sm font-bold text-white hover:bg-[#973326]">{t.show}</button>}
        </> : <div className="mt-7 flex min-h-[365px] flex-col justify-center rounded-[1.4rem] border border-[#f0dfd5] bg-white p-7 text-center sm:p-10"><span className="font-editorial text-7xl text-[#c25334]">{session === 'complete' ? '✓' : '?'}</span><p className="font-editorial mt-5 text-3xl leading-tight text-[#33252b]">{session === 'complete' ? t.done : cards.length ? t.start : t.createFirst}</p>{session === 'complete' && <p className="mt-3 text-sm leading-6 text-[#7d6c69]">{t.doneHint}</p>}{cards.length > 0 && <button type="button" onClick={startReview} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#b84432] px-6 text-sm font-bold text-white hover:bg-[#973326]">{session === 'complete' ? t.restart : t.start}<ArrowRight className="size-4" aria-hidden="true" /></button>}</div>}
        <div className="mt-7 rounded-[1.3rem] bg-[#33252b] p-6 text-white"><p className="font-editorial text-2xl">{t.ctaTitle}</p><p className="mt-2 text-sm leading-6 text-[#e5d5ce]">{t.ctaText}</p><Link href={locale === 'fr' ? '/#produit' : `/${locale}#studio`} className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#ffd9c5] underline-offset-4 hover:underline">{t.cta}<ArrowRight className="size-4" aria-hidden="true" /></Link></div>
      </div>
    </div>
  </section>
}
