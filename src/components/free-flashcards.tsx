'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, BookOpen, Check, Download, Layers3, Loader2, Pencil, Plus, RotateCcw, Trash2, Upload } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { freeFlashcardsWorkspaceCopy } from '@/lib/free-flashcards-workspace-copy'
import { cn } from '@/lib/utils'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

type Card = { id: string; question: string; answer: string }
type Locale = StudyPdfLocale

const storageKey = 'cramdesk-free-flashcards-v1'
const maxCards = 40
const fieldClass = 'mt-2 min-h-12 w-full rounded-xl border border-[var(--cd-line)] bg-white px-4 py-3 text-base text-[var(--cd-ink)] outline-none transition focus:border-[var(--cd-brand)] focus:ring-2 focus:ring-[#f6d5c5]'
const controlClass = 'cd-press inline-flex min-h-11 items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40'
const primaryClass = `${controlClass} px-4 bg-[var(--cd-brand)] text-white hover:bg-[#983b2b]`
const secondaryClass = `${controlClass} px-4 border border-[var(--cd-line)] bg-white text-[var(--cd-ink)] hover:bg-[var(--cd-paper)]`

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
    title: 'Tu juego de tarjetas', question: 'Pregunta o concepto', answer: 'Respuesta que recordar', questionPlaceholder: 'Ej. ¿Qué función tienen las mitocondrias?', answerPlaceholder: 'Ej. Producen energía utilizable para la célula.', add: 'Añadir tarjeta', limit: 'Hasta 40 tarjetas por juego', saved: 'Guardado en este dispositivo', createFirst: 'Crea tu primera tarjeta para empezar.', review: 'Sesión de recuerdo activo', start: 'Empezar a estudiar', restart: 'Empezar de nuevo', show: 'Ver respuesta', know: 'La sabía', again: 'Repasar', done: 'Has recordado todas las tarjetas.', doneHint: 'Vuelve más tarde para comprobar qué recuerdas.', progress: (known: number, total: number) => `${known} / ${total} dominadas`, remaining: (count: number) => `${count} tarjeta${count === 1 ? '' : 's'} pendiente${count === 1 ? '' : 's'}`, myCards: 'Mis tarjetas', empty: 'Tu juego está vacío.', remove: 'Eliminar tarjeta', export: 'Exportar juego', import: 'Importar juego', invalid: 'El archivo debe contener un juego CramDesk válido (máximo 40 tarjetas).', storageError: 'No se puede guardar aquí. Exporta el juego antes de salir.', helper: 'Las tarjetas permanecen en este navegador. Expórtalas para conservarlas o transferirlas.', ctaTitle: '¿Ya tienes un PDF con las respuestas?', ctaText: 'CramDesk puede crear tarjetas automáticamente a partir de tu PDF.', cta: 'Crear tarjetas desde un PDF',
  },
  de: {
    title: 'Dein Kartenset', question: 'Frage oder Begriff', answer: 'Antwort zum Erinnern', questionPlaceholder: 'Z. B. Was machen Mitochondrien?', answerPlaceholder: 'Z. B. Sie erzeugen nutzbare Energie für die Zelle.', add: 'Karte hinzufügen', limit: 'Bis zu 40 Karten pro Set', saved: 'Auf diesem Gerät gespeichert', createFirst: 'Erstelle deine erste Karte zum Start.', review: 'Aktives Abrufen', start: 'Lernen starten', restart: 'Erneut beginnen', show: 'Antwort zeigen', know: 'Gewusst', again: 'Noch einmal', done: 'Du hast alle Karten erinnert.', doneHint: 'Komm später zurück und prüfe, was du noch weißt.', progress: (known: number, total: number) => `${known} / ${total} beherrscht`, remaining: (count: number) => `${count} Karte${count === 1 ? '' : 'n'} offen`, myCards: 'Meine Karten', empty: 'Dein Set ist noch leer.', remove: 'Karte löschen', export: 'Set exportieren', import: 'Set importieren', invalid: 'Die Datei muss ein gültiges CramDesk-Set enthalten (höchstens 40 Karten).', storageError: 'Lokales Speichern nicht möglich. Exportiere das Set vor dem Verlassen.', helper: 'Die Karten bleiben in diesem Browser. Exportiere sie zum Sichern oder Übertragen.', ctaTitle: 'Dein PDF enthält schon die Antworten?', ctaText: 'CramDesk kann aus deinem Kurs-PDF automatisch Karten erstellen.', cta: 'Karten aus PDF erstellen',
  },
  it: {
    title: 'Il tuo mazzo', question: 'Domanda o concetto', answer: 'Risposta da ricordare', questionPlaceholder: 'Es. Che funzione hanno i mitocondri?', answerPlaceholder: 'Es. Producono energia utilizzabile dalla cellula.', add: 'Aggiungi una carta', limit: 'Fino a 40 carte per mazzo', saved: 'Salvato su questo dispositivo', createFirst: 'Crea la prima carta per iniziare.', review: 'Sessione di richiamo attivo', start: 'Inizia a studiare', restart: 'Ricomincia', show: 'Mostra risposta', know: 'La sapevo', again: 'Da ripassare', done: 'Hai ricordato tutte le carte.', doneHint: 'Torna più tardi per verificare cosa ricordi ancora.', progress: (known: number, total: number) => `${known} / ${total} acquisite`, remaining: (count: number) => `${count} cart${count === 1 ? 'a' : 'e'} da ripassare`, myCards: 'Le mie carte', empty: 'Il mazzo è ancora vuoto.', remove: 'Elimina carta', export: 'Esporta mazzo', import: 'Importa mazzo', invalid: 'Il file deve contenere un mazzo CramDesk valido (massimo 40 carte).', storageError: 'Salvataggio locale non disponibile. Esporta il mazzo prima di uscire.', helper: 'Le carte restano in questo browser. Esportale per conservarle o trasferirle.', ctaTitle: 'Hai già un PDF con le risposte?', ctaText: 'CramDesk può creare automaticamente carte dal tuo PDF.', cta: 'Crea carte dal PDF',
  },
  pt: {
    title: 'O teu conjunto', question: 'Pergunta ou conceito', answer: 'Resposta a recordar', questionPlaceholder: 'Ex. Qual é a função das mitocôndrias?', answerPlaceholder: 'Ex. Produzem energia utilizável pela célula.', add: 'Adicionar cartão', limit: 'Até 40 cartões por conjunto', saved: 'Guardado neste dispositivo', createFirst: 'Cria o primeiro cartão para começar.', review: 'Sessão de recordação ativa', start: 'Começar a estudar', restart: 'Recomeçar', show: 'Mostrar resposta', know: 'Sabia', again: 'Rever', done: 'Recordaste todos os cartões.', doneHint: 'Volta mais tarde para veres o que ainda te lembras.', progress: (known: number, total: number) => `${known} / ${total} dominados`, remaining: (count: number) => `${count} cart${count === 1 ? 'ão' : 'ões'} por rever`, myCards: 'Os meus cartões', empty: 'O conjunto ainda está vazio.', remove: 'Eliminar cartão', export: 'Exportar conjunto', import: 'Importar conjunto', invalid: 'O ficheiro deve conter um conjunto CramDesk válido (até 40 cartões).', storageError: 'Não foi possível guardar localmente. Exporta o conjunto antes de sair.', helper: 'Os cartões ficam neste navegador. Exporta-os para guardar ou transferir.', ctaTitle: 'O teu PDF já contém as respostas?', ctaText: 'A CramDesk pode criar cartões automaticamente a partir do PDF.', cta: 'Criar cartões a partir de PDF',
  },
  zh: {
    title: '我的卡组', question: '问题或概念', answer: '需要回忆的答案', questionPlaceholder: '例如：线粒体的作用是什么？', answerPlaceholder: '例如：为细胞产生可用的能量。', add: '添加卡片', limit: '每组最多 40 张卡片', saved: '保存在此设备上', createFirst: '先创建一张卡片再开始复习。', review: '主动回忆练习', start: '开始复习', restart: '重新开始', show: '显示答案', know: '我记得', again: '再复习', done: '你已回忆出全部卡片。', doneHint: '稍后再来，看看还能记住多少。', progress: (known: number, total: number) => `掌握 ${known} / ${total}`, remaining: (count: number) => `还有 ${count} 张卡片`, myCards: '我的卡片', empty: '卡组目前为空。', remove: '删除卡片', export: '导出卡组', import: '导入卡组', invalid: '文件必须是有效的 CramDesk 卡组（最多 40 张）。', storageError: '无法在本地保存。离开前请导出卡组。', helper: '卡片保存在此浏览器中。导出文件以备份或转移。', ctaTitle: '答案已经在你的 PDF 里？', ctaText: 'CramDesk 可以根据课程 PDF 自动制作卡片。', cta: '从 PDF 制作卡片',
  },
  ja: {
    title: '自分のカードセット', question: '質問・用語', answer: '思い出す答え', questionPlaceholder: '例：ミトコンドリアの役割は？', answerPlaceholder: '例：細胞が使えるエネルギーを作る。', add: 'カードを追加', limit: '1セット最大40枚', saved: 'この端末に保存', createFirst: '最初のカードを作って始めましょう。', review: '能動的な想起', start: '学習を始める', restart: 'もう一度', show: '答えを見る', know: '覚えていた', again: 'もう一度復習', done: 'すべてのカードを思い出せました。', doneHint: '時間をおいて、まだ覚えているか確かめましょう。', progress: (known: number, total: number) => `${known} / ${total} 枚を習得`, remaining: (count: number) => `残り ${count} 枚`, myCards: '自分のカード', empty: 'カードはまだありません。', remove: 'カードを削除', export: 'セットを書き出す', import: 'セットを読み込む', invalid: '有効な CramDesk セットを選んでください（最大40枚）。', storageError: '端末に保存できません。離れる前にセットを書き出してください。', helper: 'カードはこのブラウザーに保存されます。書き出して保管・移動できます。', ctaTitle: '答えが載ったPDFがありますか？', ctaText: 'CramDeskなら授業PDFからカードを自動作成できます。', cta: 'PDFからカードを作る',
  },
  ar: {
    title: 'مجموعة بطاقاتي', question: 'سؤال أو مفهوم', answer: 'الإجابة التي تريد تذكرها', questionPlaceholder: 'مثال: ما وظيفة الميتوكوندريا؟', answerPlaceholder: 'مثال: تنتج طاقة قابلة للاستخدام للخلية.', add: 'أضف بطاقة', limit: 'حتى 40 بطاقة لكل مجموعة', saved: 'محفوظة على هذا الجهاز', createFirst: 'أنشئ بطاقتك الأولى لتبدأ.', review: 'جلسة الاسترجاع النشط', start: 'ابدأ المذاكرة', restart: 'ابدأ من جديد', show: 'أظهر الإجابة', know: 'تذكرتها', again: 'راجعها مجددًا', done: 'لقد تذكرت جميع البطاقات.', doneHint: 'عد لاحقًا لتتحقق مما بقي في ذاكرتك.', progress: (known: number, total: number) => `أتقنت ${known} من ${total}`, remaining: (count: number) => count === 1 ? 'تبقت بطاقة واحدة' : count === 2 ? 'تبقت بطاقتان' : `تبقى ${count} ${count <= 10 ? 'بطاقات' : 'بطاقة'}`, myCards: 'بطاقاتي', empty: 'المجموعة فارغة حاليًا.', remove: 'احذف البطاقة', export: 'صدّر المجموعة', import: 'استورد مجموعة', invalid: 'يجب أن يحتوي الملف على مجموعة CramDesk صالحة (حتى 40 بطاقة).', storageError: 'الحفظ المحلي غير متاح. صدّر المجموعة قبل المغادرة.', helper: 'تبقى البطاقات في هذا المتصفح. صدّرها للاحتفاظ بها أو نقلها.', ctaTitle: 'هل يحتوي ملفك على الإجابات؟', ctaText: 'يمكن لـ CramDesk إنشاء بطاقات تلقائيًا من ملف المقرر.', cta: 'أنشئ بطاقات من PDF',
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

export function FreeFlashcards({ locale, deckId, initialCards }: { locale: Locale; deckId?: string; initialCards?: readonly (readonly [string, string])[] }) {
  const t = copy[locale]
  const ui = freeFlashcardsWorkspaceCopy[locale]
  const workspaceId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const studyActionRef = useRef<HTMLButtonElement>(null)
  const dialogOpenerRef = useRef<HTMLElement | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const cardListRef = useRef<HTMLOListElement>(null)
  const persistenceAllowedRef = useRef(true)
  const deckStorageKey = deckId ? `${storageKey}-${locale}-${deckId}` : storageKey
  const [cards, setCards] = useState<Card[]>(() => initialCards?.map(([question, answer], index) => ({ id: `${deckId}-${index}`, question, answer })) ?? [])
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [view, setView] = useState<'review' | 'cards'>('review')
  const [hydrated, setHydrated] = useState(false)
  const [storageError, setStorageError] = useState(false)
  const [importError, setImportError] = useState(false)
  const [importBusy, setImportBusy] = useState(false)
  const [pendingImport, setPendingImport] = useState<Card[] | null>(null)
  const [notice, setNotice] = useState('')
  const [deleted, setDeleted] = useState<{ card: Card; index: number } | null>(null)
  const [queue, setQueue] = useState<string[]>([])
  const [known, setKnown] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [session, setSession] = useState<'idle' | 'active' | 'complete'>('idle')

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(deckStorageKey)
        if (stored) {
          const parsed: unknown = JSON.parse(stored)
          if (validCards(parsed)) {
            const saved = parsed.map(item => ({ id: item.id || crypto.randomUUID(), question: item.question, answer: item.answer }))
            const migrationKey = `${deckStorageKey}-starter-v2`
            if (deckId && initialCards && !localStorage.getItem(migrationKey)) {
              // Add expanded starter cards once without replacing personal edits.
              if (saved.some(card => card.id.startsWith(`${deckId}-`))) {
                const existingIds = new Set(saved.map(card => card.id))
                initialCards.slice(6).forEach(([question, answer], offset) => {
                  const id = `${deckId}-${offset + 6}`
                  if (!existingIds.has(id) && saved.length < maxCards) saved.push({ id, question, answer })
                })
              }
              localStorage.setItem(migrationKey, '1')
            }
            setCards(saved)
          } else {
            persistenceAllowedRef.current = false
            setStorageError(true)
          }
        } else if (deckId) {
          localStorage.setItem(`${deckStorageKey}-starter-v2`, '1')
        }
      } catch {
        persistenceAllowedRef.current = false
        setStorageError(true)
      }
      setHydrated(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [deckStorageKey, deckId, initialCards])

  useEffect(() => {
    if (!hydrated || !persistenceAllowedRef.current) return
    try { localStorage.setItem(deckStorageKey, JSON.stringify(cards)) }
    catch { window.setTimeout(() => setStorageError(true), 0) }
  }, [cards, hydrated, deckStorageKey])

  // Keep the next study action reachable when revealing or advancing a card.
  useEffect(() => {
    if (session !== 'idle' && view === 'review') studyActionRef.current?.focus({ preventScroll: true })
  }, [session, revealed, queue, view])

  const resetSession = () => { setQueue([]); setKnown(0); setRevealed(false); setSession('idle') }
  const openCardForm = (card?: Card) => {
    dialogOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setEditingId(card?.id ?? null)
    setQuestion(card?.question ?? '')
    setAnswer(card?.answer ?? '')
    setFormOpen(true)
  }
  const saveCard = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextQuestion = question.trim()
    const nextAnswer = answer.trim()
    if (!nextQuestion || !nextAnswer || (!editingId && cards.length >= maxCards)) return
    setCards(current => editingId
      ? current.map(card => card.id === editingId ? { ...card, question: nextQuestion, answer: nextAnswer } : card)
      : [...current, { id: crypto.randomUUID(), question: nextQuestion, answer: nextAnswer }])
    setNotice(editingId ? ui.updated : ui.added)
    setDeleted(null)
    setFormOpen(false)
    setView('cards')
    resetSession()
  }
  const removeCard = (card: Card, index: number) => {
    setDeleted({ card, index })
    setCards(current => current.filter(item => item.id !== card.id))
    setNotice(ui.removed)
    resetSession()
    requestAnimationFrame(() => {
      const actions = cardListRef.current?.querySelectorAll<HTMLButtonElement>('button[data-edit-card]')
      const target = actions?.length ? actions[Math.min(index, actions.length - 1)] : headingRef.current
      target?.focus({ preventScroll: true })
    })
  }
  const undoRemove = () => {
    if (!deleted || cards.length >= maxCards) return
    setCards(current => [...current.slice(0, deleted.index), deleted.card, ...current.slice(deleted.index)])
    setDeleted(null)
    setNotice(ui.updated)
  }
  // Decks are bounded at 40 cards: a native download link avoids object-URL
  // lifetimes and preserves the browser's normal save-file interaction.
  const exportUrl = useMemo(() => `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(cards.map(({ question, answer }) => ({ question, answer })), null, 2))}`, [cards])
  const applyImport = (incoming: Card[], merge: boolean) => {
    if (merge && cards.length + incoming.length > maxCards) return
    setCards(current => merge ? [...current, ...incoming] : incoming)
    setPendingImport(null)
    setImportError(false)
    setDeleted(null)
    setNotice(ui.imported)
    setView('cards')
    resetSession()
  }
  const importDeck = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setImportBusy(true)
    setImportError(false)
    try {
      if (file.size > 100_000) throw new Error('Too large')
      const parsed: unknown = JSON.parse(await file.text())
      if (!validCards(parsed) || !parsed.length) throw new Error('Invalid deck')
      const incoming = parsed.map(item => ({ id: crypto.randomUUID(), question: item.question.trim(), answer: item.answer.trim() }))
      if (cards.length) {
        dialogOpenerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
        setPendingImport(incoming)
      }
      else applyImport(incoming, false)
    } catch { setImportError(true) }
    finally { setImportBusy(false) }
  }

  const currentCard = cards.find(card => card.id === queue[0])
  const previewCard = session === 'active' ? currentCard : cards[0]
  const startReview = () => {
    if (!cards.length) return
    setQueue(cards.map(card => card.id)); setKnown(0); setRevealed(false); setSession('active'); setNotice('')
  }
  const markKnown = () => {
    const remaining = queue.slice(1)
    setQueue(remaining); setKnown(current => current + 1); setRevealed(false)
    if (!remaining.length) setSession('complete')
  }
  const markAgain = () => { setQueue(current => [...current.slice(1), current[0]]); setRevealed(false) }
  const chooseView = (next: 'review' | 'cards') => { setView(next) }
  const restoreDialogFocus = (event: Event) => {
    event.preventDefault()
    const target = dialogOpenerRef.current?.isConnected ? dialogOpenerRef.current : headingRef.current
    target?.focus({ preventScroll: true })
  }
  const dialogClass = `max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-3xl border-[var(--cd-line)] bg-[var(--cd-paper)] p-5 text-[var(--cd-ink)] sm:rounded-3xl sm:p-8 ${locale === 'ar' ? '[&>button]:right-auto [&>button]:left-3 sm:[&>button]:left-4' : ''}`
  const importButton = <button type="button" onClick={() => inputRef.current?.click()} disabled={!hydrated || importBusy} className={secondaryClass}>
    {importBusy ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}{importBusy ? ui.reading : t.import}
  </button>

  return <section id="outil" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} aria-labelledby={`${workspaceId}-heading`} className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-24">
    <div className="mx-auto max-w-4xl">
      <div className={`mb-6 flex gap-5 sm:items-end sm:justify-between ${deckId ? 'items-center justify-between' : 'flex-col sm:flex-row'}`}>
        <div>{!deckId && <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">{t.review}</p>}<h2 ref={headingRef} tabIndex={-1} id={`${workspaceId}-heading`} className={`font-editorial text-[var(--cd-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cd-brand)] ${deckId ? 'text-2xl sm:text-3xl' : 'mt-3 text-3xl sm:text-4xl'}`}>{deckId ? t.review : t.title}</h2>{!deckId && <p className="mt-3 text-base leading-7 text-[var(--cd-muted)]">{ui.intro}</p>}</div>
        <p className="shrink-0 text-sm text-[var(--cd-muted)]">{cards.length} / {maxCards} {ui.cards}</p>
      </div>
      <input ref={inputRef} type="file" accept="application/json,.json" aria-label={t.import} onChange={importDeck} className="hidden" />
      <div className="overflow-hidden rounded-3xl border border-[var(--cd-line)] bg-white">
        {cards.length > 0 && <div className="flex items-center justify-between gap-2 border-b border-[var(--cd-line)] px-4 py-4 sm:px-6">
          <div role="group" aria-label={t.title} className="flex min-w-0 flex-1 gap-1 rounded-xl bg-[var(--cd-paper)] p-1 sm:flex-none">
            <button type="button" aria-pressed={view === 'review'} aria-controls={`${workspaceId}-content`} onClick={() => chooseView('review')} className={`${controlClass} flex-1 whitespace-nowrap px-2 sm:px-4 ${view === 'review' ? 'bg-white text-[var(--cd-brand)] shadow-sm' : 'text-[var(--cd-muted)] hover:text-[var(--cd-ink)]'}`}><BookOpen className="hidden size-4 shrink-0 sm:block" aria-hidden="true" />{ui.study}</button>
            <button type="button" aria-pressed={view === 'cards'} aria-controls={`${workspaceId}-content`} onClick={() => chooseView('cards')} className={`${controlClass} flex-1 whitespace-nowrap px-2 sm:px-4 ${view === 'cards' ? 'bg-white text-[var(--cd-brand)] shadow-sm' : 'text-[var(--cd-muted)] hover:text-[var(--cd-ink)]'}`}><Layers3 className="hidden size-4 shrink-0 sm:block" aria-hidden="true" />{ui.manage}<span className="hidden text-xs tabular-nums sm:inline">{cards.length}</span></button>
          </div>
          <button type="button" onClick={() => openCardForm()} disabled={!hydrated || cards.length >= maxCards} className={cn(secondaryClass, 'min-w-11 shrink-0 px-2 sm:px-4')}><Plus className="size-4" aria-hidden="true" /><span className="sr-only sm:not-sr-only">{t.add}</span></button>
        </div>}
        {(notice || importError || storageError) && <div className="border-b border-[var(--cd-line)] px-5 py-3 sm:px-8">
          {notice && <div role="status" className="flex flex-wrap items-center gap-3 text-sm text-[var(--cd-ink)]"><Check className="size-4 text-[var(--cd-brand)]" aria-hidden="true" />{notice}{deleted && <button type="button" onClick={undoRemove} className={`${controlClass} min-h-11 text-[var(--cd-brand)] underline underline-offset-4`}>{ui.undo}</button>}</div>}
          {importError && <p role="alert" className="text-sm leading-6 text-[#a73d31]">{t.invalid}</p>}
          {storageError && <p role="alert" className="text-sm leading-6 text-[#a73d31]">{t.storageError}</p>}
        </div>}
        <div id={`${workspaceId}-content`}>
          {!hydrated ? <p role="status" className="flex min-h-64 items-center justify-center gap-3 p-8 text-base text-[var(--cd-muted)]"><Loader2 className="size-5 animate-spin motion-reduce:animate-none" aria-hidden="true" />{ui.loading}</p>
          : !cards.length ? <div className="flex min-h-80 flex-col items-center justify-center px-5 py-12 text-center sm:px-12 sm:py-16">
            <Layers3 className="size-9 text-[var(--cd-brand)]" aria-hidden="true" />
            <h3 className="font-editorial mt-6 max-w-lg text-3xl leading-tight sm:text-4xl">{t.createFirst}</h3>
            <p className="mt-4 max-w-lg text-base leading-7 text-[var(--cd-muted)]">{t.helper}</p>
            <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"><button type="button" onClick={() => openCardForm()} className={primaryClass}><Plus className="size-4" aria-hidden="true" />{t.add}</button>{importButton}</div>
          </div>
          : view === 'cards' ? <div className="px-5 py-6 sm:px-8 sm:py-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><h3 className="text-lg font-semibold text-[var(--cd-ink)]">{ui.manage}</h3><div className="flex flex-wrap gap-2">{importButton}<a href={exportUrl} download="cramdesk-flashcards.json" className={secondaryClass}><Download className="size-4" aria-hidden="true" />{t.export}</a></div></div>
            <ol ref={cardListRef} className="divide-y divide-[var(--cd-line)]">{cards.map((card, index) => <li key={card.id} className="flex items-start gap-3 py-5 first:pt-0 last:pb-0 sm:gap-5">
              <span className="pt-1 text-sm font-semibold tabular-nums text-[var(--cd-muted)]">{String(index + 1).padStart(2, '0')}</span>
              <div className="min-w-0 flex-1"><p className="break-words text-base font-semibold leading-7 text-[var(--cd-ink)]">{card.question}</p><p className="mt-2 whitespace-pre-wrap break-words text-base leading-7 text-[var(--cd-muted)]">{card.answer}</p></div>
              <div className="flex shrink-0 flex-col gap-1 sm:flex-row"><button type="button" data-edit-card onClick={() => openCardForm(card)} aria-label={`${ui.edit} ${index + 1}`} className={`${controlClass} min-w-11 px-2 text-[var(--cd-muted)] hover:bg-[var(--cd-paper)] hover:text-[var(--cd-brand)]`}><Pencil className="size-4" aria-hidden="true" /></button><button type="button" onClick={() => removeCard(card, index)} aria-label={`${t.remove} ${index + 1}`} className={`${controlClass} min-w-11 px-2 text-[var(--cd-muted)] hover:bg-[#fff1eb] hover:text-[#a73d31]`}><Trash2 className="size-4" aria-hidden="true" /></button></div>
            </li>)}</ol>
            {cards.length >= maxCards && <p className="mt-6 text-sm text-[var(--cd-muted)]">{t.limit}</p>}
          </div>
          : session === 'complete' ? <div role="status" className="flex min-h-96 flex-col items-center justify-center px-5 py-12 text-center sm:px-12">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#fff0e6] text-[var(--cd-brand)]"><Check className="size-6" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.16em] text-[var(--cd-brand)]">{ui.finish}</p><h3 className="font-editorial mt-3 max-w-lg text-3xl sm:text-4xl">{t.done}</h3><p className="mt-4 max-w-lg text-base leading-7 text-[var(--cd-muted)]">{t.doneHint}</p>
            <button ref={studyActionRef} type="button" onClick={startReview} className={`${primaryClass} mt-7`}><RotateCcw className="size-4" aria-hidden="true" />{t.restart}</button>
          </div>
          : previewCard && <div className="p-5 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--cd-muted)]"><p>{session === 'active' ? t.progress(known, cards.length) : ui.ready}</p><p>{t.remaining(session === 'active' ? queue.length : cards.length)}</p></div>
            {session === 'active' && <div role="progressbar" aria-label={t.progress(known, cards.length)} aria-valuenow={known} aria-valuemin={0} aria-valuemax={cards.length} className="mt-3 h-1 overflow-hidden rounded-full bg-[var(--cd-line)]"><span className="block h-full rounded-full bg-[var(--cd-brand)] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${known / cards.length * 100}%` }} /></div>}
            <div key={`${previewCard.id}-${revealed ? 'answer' : 'question'}`} aria-live="polite" aria-atomic="true" className={`study-card-motion ${revealed ? 'study-card-reveal' : ''} mt-6 flex min-h-64 flex-col items-center justify-center rounded-2xl bg-[var(--cd-paper)] px-5 py-10 text-center sm:min-h-80 sm:px-10`}>
              <span className="text-xs font-bold uppercase tracking-[.14em] text-[var(--cd-brand)]">{revealed ? t.answer : t.question}</span>
              <p className={`mt-6 max-w-2xl whitespace-pre-wrap break-words text-[var(--cd-ink)] ${revealed ? 'text-xl leading-8 sm:text-2xl sm:leading-9' : 'font-editorial text-3xl leading-tight sm:text-4xl'}`}>{revealed ? previewCard.answer : previewCard.question}</p>
            </div>
            <div className="mx-auto mt-6 max-w-md">
              {session === 'idle' ? <><p className="mb-5 text-center text-sm leading-6 text-[var(--cd-muted)]">{ui.answerHidden}</p><button type="button" onClick={startReview} className={`${primaryClass} w-full`}>{t.start}<ArrowRight className="size-4" aria-hidden="true" /></button></>
              : revealed ? <div className="grid grid-cols-2 gap-3"><button ref={studyActionRef} type="button" onClick={markAgain} className={secondaryClass}><RotateCcw className="size-4 shrink-0" aria-hidden="true" />{t.again}</button><button type="button" onClick={markKnown} className={primaryClass}><Check className="size-4 shrink-0" aria-hidden="true" />{t.know}</button></div>
              : <><p className="mb-5 text-center text-sm leading-6 text-[var(--cd-muted)]">{ui.recall}</p><button ref={studyActionRef} type="button" onClick={() => setRevealed(true)} className={`${primaryClass} w-full`}>{t.show}</button></>}
            </div>
          </div>}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--cd-line)] px-5 py-4 text-xs leading-5 text-[var(--cd-muted)] sm:px-8"><p>{storageError ? t.storageError : hydrated ? t.saved : ui.loading}</p><p>{t.limit}</p></div>
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--cd-muted)]">{t.helper}</p>
      <aside className="mt-10 flex flex-col gap-5 border-t border-[var(--cd-line)] pt-7 sm:flex-row sm:items-center sm:justify-between"><div><h3 className="text-base font-semibold text-[var(--cd-ink)]">{t.ctaTitle}</h3><p className="mt-2 max-w-xl text-sm leading-6 text-[var(--cd-muted)]">{t.ctaText}</p></div><Link href={locale === 'fr' ? '/#produit' : `/${locale}#studio`} className={`${controlClass} shrink-0 justify-start px-0 text-[var(--cd-brand)] underline-offset-4 hover:underline`}>{t.cta}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></Link></aside>
    </div>
    <Dialog open={formOpen} onOpenChange={setFormOpen}>
      <DialogContent closeLabel={ui.close} onCloseAutoFocus={restoreDialogFocus} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={dialogClass}>
        <DialogTitle className="font-editorial pe-10 text-3xl font-normal">{editingId ? ui.edit : t.add}</DialogTitle>
        <DialogDescription className="text-sm leading-6 text-[var(--cd-muted)]">{t.limit} · {t.helper}</DialogDescription>
        <form onSubmit={saveCard} className="space-y-5">
          <label className="block text-sm font-semibold">{t.question}<textarea value={question} onChange={event => setQuestion(event.target.value)} required maxLength={280} placeholder={t.questionPlaceholder} rows={3} className={fieldClass} /></label>
          <label className="block text-sm font-semibold">{t.answer}<textarea value={answer} onChange={event => setAnswer(event.target.value)} required maxLength={600} placeholder={t.answerPlaceholder} rows={4} className={fieldClass} /></label>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={() => setFormOpen(false)} className={secondaryClass}>{ui.cancel}</button><button type="submit" disabled={!question.trim() || !answer.trim() || (!editingId && cards.length >= maxCards)} className={primaryClass}>{editingId ? ui.save : t.add}</button></div>
        </form>
      </DialogContent>
    </Dialog>
    <Dialog open={pendingImport !== null} onOpenChange={open => { if (!open) setPendingImport(null) }}>
      <DialogContent closeLabel={ui.close} onCloseAutoFocus={restoreDialogFocus} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={dialogClass}>
        <DialogTitle className="font-editorial pe-10 text-3xl font-normal">{ui.importTitle}</DialogTitle><DialogDescription className="text-base leading-7 text-[var(--cd-muted)]">{ui.importHint}</DialogDescription>
        <p className="rounded-xl border border-[var(--cd-line)] bg-white p-4 text-base tabular-nums">{cards.length} + {pendingImport?.length ?? 0} = {cards.length + (pendingImport?.length ?? 0)} / {maxCards} {ui.cards}</p>
        {cards.length + (pendingImport?.length ?? 0) > maxCards && <p role="status" className="text-sm leading-6 text-[var(--cd-muted)]">{ui.importLimit}</p>}
        <div className="flex flex-col gap-3"><button type="button" disabled={cards.length + (pendingImport?.length ?? 0) > maxCards} onClick={() => { if (pendingImport) applyImport(pendingImport, true) }} className={primaryClass}>{ui.merge}</button><button type="button" onClick={() => { if (pendingImport) applyImport(pendingImport, false) }} className={secondaryClass}>{ui.replace}</button><button type="button" onClick={() => setPendingImport(null)} className={`${controlClass} text-[var(--cd-muted)]`}>{ui.cancel}</button></div>
      </DialogContent>
    </Dialog>
  </section>
}
