import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

type WorkspaceCopy = {
  study: string; manage: string; intro: string; recall: string; ready: string
  edit: string; save: string; cancel: string; close: string; loading: string
  reading: string; added: string; updated: string; imported: string; removed: string
  undo: string; importTitle: string; importHint: string; merge: string; replace: string
  importLimit: string; cards: string; answerHidden: string; finish: string
}

export const freeFlashcardsWorkspaceCopy: Record<StudyPdfLocale, WorkspaceCopy> = {
  fr: {
    study: 'Réviser', manage: 'Mes cartes', intro: 'Un espace pour tes cartes, une session pour te concentrer.',
    recall: 'Cherche la réponse de mémoire, puis retourne la carte.', ready: 'Ton jeu est prêt.',
    edit: 'Modifier la carte', save: 'Enregistrer', cancel: 'Annuler', close: 'Fermer', loading: 'Chargement de tes cartes…',
    reading: 'Lecture du fichier…', added: 'Carte ajoutée.', updated: 'Carte modifiée.', imported: 'Cartes importées.', removed: 'Carte supprimée.',
    undo: 'Rétablir', importTitle: 'Importer ces cartes', importHint: 'Ajoute-les à ton jeu ou remplace-le. Exporte ton jeu actuel avant de le remplacer si tu souhaites le conserver.',
    merge: 'Ajouter à mon jeu', replace: 'Remplacer mon jeu', importLimit: 'Le total dépasse 40 cartes. Retire des cartes ou remplace le jeu.',
    cards: 'cartes', answerHidden: 'La réponse reste cachée jusqu’à ce que tu la révèles.', finish: 'Session terminée',
  },
  en: {
    study: 'Study', manage: 'My cards', intro: 'A place for your cards. A session to focus.',
    recall: 'Recall the answer, then turn the card over.', ready: 'Your deck is ready.',
    edit: 'Edit card', save: 'Save', cancel: 'Cancel', close: 'Close', loading: 'Loading your cards…',
    reading: 'Reading file…', added: 'Card added.', updated: 'Card updated.', imported: 'Cards imported.', removed: 'Card removed.',
    undo: 'Undo', importTitle: 'Import these cards', importHint: 'Add them to your deck or replace it. Export your current deck first if you want to keep it.',
    merge: 'Add to my deck', replace: 'Replace my deck', importLimit: 'The total exceeds 40 cards. Remove some cards or replace the deck.',
    cards: 'cards', answerHidden: 'The answer stays hidden until you reveal it.', finish: 'Session complete',
  },
  es: {
    study: 'Estudiar', manage: 'Mis tarjetas', intro: 'Un espacio para tus tarjetas. Una sesión para concentrarte.',
    recall: 'Recuerda la respuesta y después da la vuelta a la tarjeta.', ready: 'Tu juego está listo.',
    edit: 'Editar tarjeta', save: 'Guardar', cancel: 'Cancelar', close: 'Cerrar', loading: 'Cargando tus tarjetas…',
    reading: 'Leyendo el archivo…', added: 'Tarjeta añadida.', updated: 'Tarjeta actualizada.', imported: 'Tarjetas importadas.', removed: 'Tarjeta eliminada.',
    undo: 'Deshacer', importTitle: 'Importar estas tarjetas', importHint: 'Añádelas a tu juego o sustitúyelo. Exporta primero el juego actual si quieres conservarlo.',
    merge: 'Añadir a mi juego', replace: 'Sustituir mi juego', importLimit: 'El total supera las 40 tarjetas. Elimina algunas o sustituye el juego.',
    cards: 'tarjetas', answerHidden: 'La respuesta permanece oculta hasta que la muestres.', finish: 'Sesión terminada',
  },
  de: {
    study: 'Lernen', manage: 'Meine Karten', intro: 'Ein Platz für deine Karten. Eine Sitzung zum Konzentrieren.',
    recall: 'Erinnere dich an die Antwort und drehe dann die Karte um.', ready: 'Dein Set ist bereit.',
    edit: 'Karte bearbeiten', save: 'Speichern', cancel: 'Abbrechen', close: 'Schließen', loading: 'Deine Karten werden geladen…',
    reading: 'Datei wird gelesen…', added: 'Karte hinzugefügt.', updated: 'Karte aktualisiert.', imported: 'Karten importiert.', removed: 'Karte gelöscht.',
    undo: 'Rückgängig', importTitle: 'Diese Karten importieren', importHint: 'Füge sie deinem Set hinzu oder ersetze es. Exportiere das aktuelle Set zuerst, wenn du es behalten möchtest.',
    merge: 'Zu meinem Set hinzufügen', replace: 'Mein Set ersetzen', importLimit: 'Insgesamt sind es mehr als 40 Karten. Entferne Karten oder ersetze das Set.',
    cards: 'Karten', answerHidden: 'Die Antwort bleibt verborgen, bis du sie aufdeckst.', finish: 'Sitzung abgeschlossen',
  },
  it: {
    study: 'Studia', manage: 'Le mie carte', intro: 'Uno spazio per le tue carte. Una sessione per concentrarti.',
    recall: 'Richiama la risposta, poi gira la carta.', ready: 'Il tuo mazzo è pronto.',
    edit: 'Modifica carta', save: 'Salva', cancel: 'Annulla', close: 'Chiudi', loading: 'Caricamento delle carte…',
    reading: 'Lettura del file…', added: 'Carta aggiunta.', updated: 'Carta aggiornata.', imported: 'Carte importate.', removed: 'Carta eliminata.',
    undo: 'Ripristina', importTitle: 'Importa queste carte', importHint: 'Aggiungile al mazzo o sostituiscilo. Esporta prima il mazzo attuale se vuoi conservarlo.',
    merge: 'Aggiungi al mio mazzo', replace: 'Sostituisci il mio mazzo', importLimit: 'Il totale supera 40 carte. Rimuovi alcune carte o sostituisci il mazzo.',
    cards: 'carte', answerHidden: 'La risposta resta nascosta finché non la riveli.', finish: 'Sessione completata',
  },
  pt: {
    study: 'Estudar', manage: 'Os meus cartões', intro: 'Um espaço para os teus cartões. Uma sessão para te concentrares.',
    recall: 'Recorda a resposta e depois vira o cartão.', ready: 'O teu conjunto está pronto.',
    edit: 'Editar cartão', save: 'Guardar', cancel: 'Cancelar', close: 'Fechar', loading: 'A carregar os teus cartões…',
    reading: 'A ler o ficheiro…', added: 'Cartão adicionado.', updated: 'Cartão atualizado.', imported: 'Cartões importados.', removed: 'Cartão eliminado.',
    undo: 'Restaurar', importTitle: 'Importar estes cartões', importHint: 'Adiciona-os ao conjunto ou substitui-o. Exporta primeiro o conjunto atual se o quiseres conservar.',
    merge: 'Adicionar ao meu conjunto', replace: 'Substituir o meu conjunto', importLimit: 'O total ultrapassa 40 cartões. Remove alguns ou substitui o conjunto.',
    cards: 'cartões', answerHidden: 'A resposta fica escondida até a revelares.', finish: 'Sessão concluída',
  },
  zh: {
    study: '复习', manage: '我的卡片', intro: '整理你的卡片，专注每一次复习。',
    recall: '先回忆答案，再翻开卡片。', ready: '卡组已准备好。',
    edit: '编辑卡片', save: '保存', cancel: '取消', close: '关闭', loading: '正在加载卡片…',
    reading: '正在读取文件…', added: '卡片已添加。', updated: '卡片已更新。', imported: '卡片已导入。', removed: '卡片已删除。',
    undo: '撤销', importTitle: '导入这些卡片', importHint: '添加到当前卡组或替换卡组。如需保留当前卡组，请先导出备份。',
    merge: '添加到我的卡组', replace: '替换我的卡组', importLimit: '总数超过40张。请删除部分卡片或替换卡组。',
    cards: '张卡片', answerHidden: '在你揭晓之前，答案会保持隐藏。', finish: '本轮复习完成',
  },
  ja: {
    study: '復習', manage: '自分のカード', intro: 'カードを整理して、目の前の復習に集中。',
    recall: '答えを思い出してから、カードをめくりましょう。', ready: 'カードセットの準備ができました。',
    edit: 'カードを編集', save: '保存', cancel: 'キャンセル', close: '閉じる', loading: 'カードを読み込み中…',
    reading: 'ファイルを読み込み中…', added: 'カードを追加しました。', updated: 'カードを更新しました。', imported: 'カードを読み込みました。', removed: 'カードを削除しました。',
    undo: '元に戻す', importTitle: 'このカードを読み込む', importHint: '現在のセットに追加するか、置き換えます。現在のセットを残したい場合は、先に書き出してください。',
    merge: 'セットに追加', replace: 'セットを置き換える', importLimit: '合計が40枚を超えています。カードを減らすか、セットを置き換えてください。',
    cards: '枚', answerHidden: '答えは表示するまで隠れています。', finish: '復習完了',
  },
  ar: {
    study: 'راجع', manage: 'بطاقاتي', intro: 'مساحة لبطاقاتك وجلسة تساعدك على التركيز.',
    recall: 'حاول تذكر الإجابة، ثم اقلب البطاقة.', ready: 'مجموعتك جاهزة.',
    edit: 'عدّل البطاقة', save: 'احفظ', cancel: 'إلغاء', close: 'إغلاق', loading: 'جارٍ تحميل بطاقاتك…',
    reading: 'جارٍ قراءة الملف…', added: 'تمت إضافة البطاقة.', updated: 'تم تعديل البطاقة.', imported: 'تم استيراد البطاقات.', removed: 'تم حذف البطاقة.',
    undo: 'تراجع', importTitle: 'استورد هذه البطاقات', importHint: 'أضفها إلى مجموعتك أو استبدل المجموعة. صدّر مجموعتك الحالية أولًا إذا أردت الاحتفاظ بها.',
    merge: 'أضف إلى مجموعتي', replace: 'استبدل مجموعتي', importLimit: 'يتجاوز المجموع 40 بطاقة. احذف بعض البطاقات أو استبدل المجموعة.',
    cards: 'بطاقة', answerHidden: 'تبقى الإجابة مخفية حتى تختار إظهارها.', finish: 'اكتملت الجلسة',
  },
}
