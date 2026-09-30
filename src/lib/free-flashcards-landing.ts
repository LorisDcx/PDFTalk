import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

type Step = { title: string; text: string }
type Faq = { question: string; answer: string }
type Content = { howEyebrow: string; howTitle: string; steps: readonly [Step, Step, Step]; faqEyebrow: string; faqTitle: string; faqs: readonly [Faq, Faq, Faq] }

export const freeFlashcardsLanding: Record<StudyPdfLocale, Content> = {
  fr: { howEyebrow: 'Méthode de révision', howTitle: 'Une carte utile te fait réfléchir.', steps: [
    { title: 'Une idée par carte', text: 'Une question précise est plus simple à retrouver de mémoire qu’un paragraphe entier.' },
    { title: 'Réponse cachée', text: 'Essaie de répondre avant de révéler la carte : le rappel actif montre ce que tu sais vraiment.' },
    { title: 'Retour sur les hésitations', text: 'Les cartes marquées « À revoir » repassent pendant la session.' },
  ], faqEyebrow: 'Questions fréquentes', faqTitle: 'Avant de commencer.', faqs: [
    { question: 'Ces flashcards sont-elles vraiment gratuites ?', answer: 'Oui. Les jeux de départ, la création de 40 cartes par jeu, la révision et l’export sont gratuits sans compte. La génération automatique depuis un PDF est dans le studio CramDesk.' },
    { question: 'Où mes cartes sont-elles enregistrées ?', answer: 'Dans le stockage local de ce navigateur. Elles ne sont pas envoyées à CramDesk. Exporte le jeu pour le conserver ou le transférer.' },
    { question: 'Comment fonctionne la révision ?', answer: 'Essaie de répondre de mémoire avant de révéler la réponse. Une carte marquée « À revoir » revient dans la même session.' },
  ] },
  en: { howEyebrow: 'Study method', howTitle: 'A useful card makes you think.', steps: [
    { title: 'One idea per card', text: 'A focused question is easier to retrieve from memory than a whole paragraph.' },
    { title: 'Hidden answer', text: 'Try to answer before revealing the card: active recall shows what you really know.' },
    { title: 'Repeat difficult cards', text: 'Cards marked “Review again” return during the same session.' },
  ], faqEyebrow: 'Frequently asked questions', faqTitle: 'Before you start.', faqs: [
    { question: 'Are these flashcards really free?', answer: 'Yes. Starter decks, creating up to 40 cards per deck, studying and exporting are free without an account. Automatic generation from a PDF is part of the CramDesk studio.' },
    { question: 'Where are my cards saved?', answer: 'In this browser’s local storage. They are not sent to CramDesk. Export a deck to back it up or transfer it.' },
    { question: 'How does the study session work?', answer: 'Try to answer from memory before revealing the answer. A card marked “Review again” comes back in the same session.' },
  ] },
  es: { howEyebrow: 'Método de estudio', howTitle: 'Una buena tarjeta te hace pensar.', steps: [
    { title: 'Una idea por tarjeta', text: 'Una pregunta concreta se recuerda mejor que un párrafo entero.' },
    { title: 'Respuesta oculta', text: 'Intenta responder antes de mostrarla: el recuerdo activo revela lo que sabes.' },
    { title: 'Repite las difíciles', text: 'Las tarjetas marcadas «Repasar» vuelven en la misma sesión.' },
  ], faqEyebrow: 'Preguntas frecuentes', faqTitle: 'Antes de empezar.', faqs: [
    { question: '¿Son gratuitas estas tarjetas?', answer: 'Sí. Los juegos iniciales, la creación de hasta 40 tarjetas por juego, el estudio y la exportación son gratis y no requieren cuenta. La generación desde PDF pertenece al estudio CramDesk.' },
    { question: '¿Dónde se guardan mis tarjetas?', answer: 'En el almacenamiento local de este navegador. No se envían a CramDesk. Exporta el juego para conservarlo o transferirlo.' },
    { question: '¿Cómo funciona la sesión?', answer: 'Intenta responder de memoria antes de ver la respuesta. Las tarjetas marcadas «Repasar» vuelven en la misma sesión.' },
  ] },
  de: { howEyebrow: 'Lernmethode', howTitle: 'Gute Karten bringen dich zum Nachdenken.', steps: [
    { title: 'Ein Gedanke pro Karte', text: 'Eine gezielte Frage lässt sich leichter erinnern als ein ganzer Absatz.' },
    { title: 'Verdeckte Antwort', text: 'Antworte erst selbst, bevor du die Karte aufdeckst: So erkennst du echte Wissenslücken.' },
    { title: 'Schwieriges wiederholen', text: 'Karten mit „Noch einmal“ kommen in derselben Sitzung erneut.' },
  ], faqEyebrow: 'Häufige Fragen', faqTitle: 'Vor dem Start.', faqs: [
    { question: 'Sind diese Karteikarten wirklich kostenlos?', answer: 'Ja. Startersets, bis zu 40 eigene Karten pro Set, Lernen und Export sind ohne Konto kostenlos. Die automatische Erstellung aus PDFs ist Teil des CramDesk-Studios.' },
    { question: 'Wo werden meine Karten gespeichert?', answer: 'Im lokalen Speicher dieses Browsers. Sie werden nicht an CramDesk gesendet. Exportiere dein Set als Sicherung oder zum Übertragen.' },
    { question: 'Wie funktioniert das Lernen?', answer: 'Versuche, die Frage aus dem Gedächtnis zu beantworten. Mit „Noch einmal“ erscheint die Karte später in derselben Sitzung.' },
  ] },
  it: { howEyebrow: 'Metodo di studio', howTitle: 'Una buona carta ti fa ragionare.', steps: [
    { title: 'Un concetto per carta', text: 'Una domanda precisa è più facile da ricordare di un intero paragrafo.' },
    { title: 'Risposta nascosta', text: 'Prova a rispondere prima di scoprirla: il richiamo attivo mostra cosa sai davvero.' },
    { title: 'Ripeti quelle difficili', text: 'Le carte segnate «Da ripassare» tornano nella stessa sessione.' },
  ], faqEyebrow: 'Domande frequenti', faqTitle: 'Prima di iniziare.', faqs: [
    { question: 'Queste flashcard sono davvero gratuite?', answer: 'Sì. I mazzi iniziali, la creazione di massimo 40 carte per mazzo, lo studio e l’esportazione sono gratuiti senza account. La generazione da PDF è nello studio CramDesk.' },
    { question: 'Dove vengono salvate le carte?', answer: 'Nella memoria locale di questo browser. Non vengono inviate a CramDesk. Esporta il mazzo per conservarlo o trasferirlo.' },
    { question: 'Come funziona la sessione?', answer: 'Prova a rispondere a memoria prima di mostrare la risposta. Le carte segnate «Da ripassare» tornano nella stessa sessione.' },
  ] },
  pt: { howEyebrow: 'Método de estudo', howTitle: 'Um bom cartão faz-te pensar.', steps: [
    { title: 'Uma ideia por cartão', text: 'É mais fácil recordar uma pergunta concreta do que um parágrafo inteiro.' },
    { title: 'Resposta escondida', text: 'Tenta responder antes de a mostrar: a recordação ativa revela o que sabes.' },
    { title: 'Repete os difíceis', text: 'Os cartões marcados «Rever» voltam na mesma sessão.' },
  ], faqEyebrow: 'Perguntas frequentes', faqTitle: 'Antes de começares.', faqs: [
    { question: 'Estes cartões são mesmo grátis?', answer: 'Sim. Os conjuntos iniciais, a criação de até 40 cartões por conjunto, o estudo e a exportação são grátis sem conta. A geração a partir de PDF pertence ao estúdio CramDesk.' },
    { question: 'Onde ficam guardados os meus cartões?', answer: 'No armazenamento local deste navegador. Não são enviados à CramDesk. Exporta o conjunto para o guardar ou transferir.' },
    { question: 'Como funciona a sessão?', answer: 'Tenta responder de memória antes de mostrar a resposta. Os cartões marcados «Rever» regressam na mesma sessão.' },
  ] },
  zh: { howEyebrow: '复习方法', howTitle: '好卡片让你主动思考。', steps: [
    { title: '一张卡片，一个知识点', text: '具体的问题比整段文字更容易从记忆中提取。' },
    { title: '先想，再看答案', text: '揭晓前先尝试回答，主动回忆才能发现真正的薄弱点。' },
    { title: '重复难题', text: '标记为“再复习”的卡片会在本轮再次出现。' },
  ], faqEyebrow: '常见问题', faqTitle: '开始之前。', faqs: [
    { question: '这些卡片真的免费吗？', answer: '是。基础卡组、自建每组最多 40 张卡片、复习和导出均无需注册且免费。从 PDF 自动生成卡片属于 CramDesk 学习工作室。' },
    { question: '卡片保存在哪里？', answer: '保存在当前浏览器的本地存储中，不会发送给 CramDesk。可以导出卡组以备份或转移。' },
    { question: '复习流程是什么？', answer: '先凭记忆回答，再显示答案。标记为“再复习”的卡片会在同一轮再次出现。' },
  ] },
  ja: { howEyebrow: '復習の方法', howTitle: '良いカードは考える力を引き出します。', steps: [
    { title: '1枚に1つの知識', text: '段落全体より、的を絞った質問の方が思い出しやすくなります。' },
    { title: '答えは先に隠す', text: '答えを見る前に考えることで、本当に覚えているか確かめられます。' },
    { title: '難しいカードを繰り返す', text: '「もう一度復習」を選んだカードは同じ回に再登場します。' },
  ], faqEyebrow: 'よくある質問', faqTitle: '始める前に。', faqs: [
    { question: 'このカードは本当に無料ですか？', answer: 'はい。入門セット、1セット40枚までの作成、復習、書き出しは登録不要で無料です。PDFからの自動作成はCramDeskスタジオの機能です。' },
    { question: 'カードはどこに保存されますか？', answer: 'このブラウザーのローカルストレージです。CramDeskには送信されません。バックアップや移動にはセットを書き出してください。' },
    { question: '復習はどう進みますか？', answer: '答えを見る前に記憶から回答します。「もう一度復習」にしたカードは同じ回で再び出題されます。' },
  ] },
  ar: { howEyebrow: 'طريقة المراجعة', howTitle: 'البطاقة الجيدة تدفعك إلى التفكير.', steps: [
    { title: 'فكرة واحدة لكل بطاقة', text: 'استرجاع جواب سؤال محدد أسهل من استرجاع فقرة كاملة.' },
    { title: 'الإجابة مخفية أولًا', text: 'حاول الإجابة قبل كشفها: الاسترجاع النشط يظهر ما تتقنه فعلًا.' },
    { title: 'كرر البطاقات الصعبة', text: 'البطاقات التي تختار لها «راجعها مجددًا» تعود في الجلسة نفسها.' },
  ], faqEyebrow: 'أسئلة شائعة', faqTitle: 'قبل أن تبدأ.', faqs: [
    { question: 'هل هذه البطاقات مجانية حقًا؟', answer: 'نعم. المجموعات الأولية وإنشاء حتى 40 بطاقة لكل مجموعة والمراجعة والتصدير مجانية بلا حساب. إنشاء البطاقات تلقائيًا من PDF ضمن استوديو CramDesk.' },
    { question: 'أين تُحفظ بطاقاتي؟', answer: 'في التخزين المحلي لهذا المتصفح، ولا تُرسل إلى CramDesk. صدّر المجموعة للاحتفاظ بنسخة أو لنقلها.' },
    { question: 'كيف تعمل جلسة المراجعة؟', answer: 'حاول الإجابة من الذاكرة قبل كشف الجواب. البطاقة التي تختار لها «راجعها مجددًا» تعود في الجلسة نفسها.' },
  ] },
}
