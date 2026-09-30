import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

export type BlogArticleId = 'study-pdf' | 'check-summary'
export type BlogArticle = {
  slug: string
  title: string
  description: string
  lead: string
  sections: readonly [
    { title: string; body: string },
    { title: string; body: string },
    { title: string; body: string },
  ]
  takeaway: string
}
type BlogCopy = { indexTitle: string; indexDescription: string; eyebrow: string; read: string; tryTool: string; back: string; articles: Record<BlogArticleId, BlogArticle> }

export const BLOG_IDS: BlogArticleId[] = ['study-pdf', 'check-summary']
export const blogCopy: Record<StudyPdfLocale, BlogCopy> = {
  fr: {
    indexTitle: 'Le guide de révision CramDesk', indexDescription: 'Des méthodes concrètes pour comprendre un cours PDF, vérifier une synthèse et t’entraîner sans perdre le lien avec la source.', eyebrow: 'Guides pratiques', read: 'Lire le guide', tryTool: 'Essayer avec mon PDF', back: 'Tous les guides',
    articles: {
      'study-pdf': { slug: 'reviser-un-cours-pdf', title: 'Comment réviser un cours PDF sans le relire en boucle', description: 'Une méthode en trois temps pour passer du PDF aux questions, puis aux rappels ciblés avant un examen.', lead: 'Un PDF peut contenir tout le cours et pourtant laisser une impression trompeuse de maîtrise. Le but est de transformer chaque chapitre en questions auxquelles tu peux répondre sans regarder.', sections: [
        { title: '1. Préparer un chapitre lisible', body: 'Vérifie que tu peux sélectionner le texte du PDF. Si ce n’est qu’une image, il faut d’abord une reconnaissance de caractères. Isole un chapitre, retire les pages inutiles et repère les définitions, les mécanismes et les exemples. Un document plus court rend les erreurs de lecture plus faciles à détecter.' },
        { title: '2. Passer de la synthèse aux questions', body: 'Lis une synthèse comme une carte du chapitre, puis vérifie les idées importantes dans le document. Transforme une notion en question précise : « Quel est le rôle de la membrane cellulaire ? » fonctionne mieux qu’une carte intitulée simplement « membrane ». Tente de répondre avant de retourner la carte.' },
        { title: '3. Revenir sur ce qui résiste', body: 'Termine par un quiz sans notes. Après chaque erreur, retourne au passage source et écris la raison de ta confusion. Révise d’abord ces points difficiles lors de ta prochaine séance. Le nombre de cartes terminées compte moins que ta capacité à expliquer le cours sans support.' },
      ], takeaway: 'Commence par un chapitre, formule quelques questions vérifiables, puis réserve ta séance suivante aux réponses hésitantes.' },
      'check-summary': { slug: 'verifier-un-resume-ia', title: 'Comment vérifier un résumé de PDF créé par IA', description: 'Contrôle les chiffres, les formules et les idées clés dans le document source avant d’apprendre un résumé généré.', lead: 'Un résumé fluide peut masquer une valeur mal lue ou une nuance absente. Pour réviser avec confiance, traite la synthèse comme une aide à la lecture, puis confronte ses affirmations au PDF.', sections: [
        { title: '1. Retrouver la phrase source', body: 'Choisis chaque affirmation importante du résumé et retrouve le passage correspondant. Si le document n’exprime pas clairement cette idée, marque-la comme incertaine. Vérifie particulièrement les définitions, les exceptions et les conclusions d’un raisonnement.' },
        { title: '2. Refaire les nombres et les unités', body: 'Pour un exercice scientifique, recopie les données avant de calculer : 27 °C vaut environ 300 K, tandis que 270 °C vaut environ 543 K. Cette différence change tout le résultat. Contrôle aussi les signes du travail, les unités et les exposants dans les formules.' },
        { title: '3. Transformer la vérification en révision', body: 'Corrige la synthèse avec tes propres mots, puis crée une question sur chaque point où tu as hésité. Dans le quiz, explique pourquoi la bonne réponse est juste et pourquoi les autres ne le sont pas. Si une formule ou une valeur reste douteuse, garde le PDF original ouvert à côté.' },
      ], takeaway: 'Une synthèse utile doit te permettre de remonter à la source, surtout quand une seule valeur peut changer la réponse.' },
    },
  },
  en: {
    indexTitle: 'The CramDesk study guide', indexDescription: 'Practical ways to understand a course PDF, check a summary and practise while keeping the source in view.', eyebrow: 'Practical guides', read: 'Read the guide', tryTool: 'Try it with my PDF', back: 'All guides',
    articles: {
      'study-pdf': { slug: 'study-a-course-pdf', title: 'How to study a course PDF without endlessly rereading it', description: 'A three-step workflow for turning a PDF into questions and targeted review before an exam.', lead: 'A PDF may hold the whole course while leaving you with a false sense of mastery. Turn each chapter into questions you can answer without looking.', sections: [
        { title: '1. Prepare one readable chapter', body: 'Check that you can select text in the PDF. An image-only scan needs OCR first. Work on one chapter, remove irrelevant pages and identify definitions, mechanisms and examples. A shorter document makes extraction mistakes easier to spot.' },
        { title: '2. Turn a summary into questions', body: 'Use the summary as a map, then verify important ideas against the document. Make each card specific: “What does the cell membrane do?” is more useful than a card called “membrane”. Attempt the answer before turning it over.' },
        { title: '3. Revisit the difficult parts', body: 'Finish with a quiz without notes. For each error, return to the source passage and write down what confused you. Review those points first next time. The goal is to explain the course independently, not simply finish a large deck.' },
      ], takeaway: 'Start with one chapter, write a few checkable questions and spend your next session on hesitant answers.' },
      'check-summary': { slug: 'check-an-ai-pdf-summary', title: 'How to check an AI summary against your PDF', description: 'Verify numbers, formulas and key claims in the original document before studying an AI-generated summary.', lead: 'A fluent summary can hide a misread value or a missing qualification. Use it to navigate the course, then test its claims against the PDF.', sections: [
        { title: '1. Find the source passage', body: 'Pick each important claim and find the matching passage. If the document does not clearly support it, mark it as uncertain. Pay special attention to definitions, exceptions and conclusions drawn from evidence.' },
        { title: '2. Recalculate numbers and units', body: 'In a scientific exercise, copy the inputs before calculating: 27 °C is about 300 K, whereas 270 °C is about 543 K. This changes the result. Check work sign conventions, units and exponents in formulas too.' },
        { title: '3. Turn checking into practice', body: 'Correct the summary in your own words and create a question for every uncertain point. In a quiz, explain why the correct answer works and the others do not. Keep the original PDF beside you when a value remains ambiguous.' },
      ], takeaway: 'A useful summary should always let you return to the source, especially when one number can change the answer.' },
    },
  },
  es: {
    indexTitle: 'Guías de estudio CramDesk', indexDescription: 'Métodos prácticos para entender un PDF de clase, comprobar un resumen y practicar con el documento a mano.', eyebrow: 'Guías prácticas', read: 'Leer la guía', tryTool: 'Probar con mi PDF', back: 'Todas las guías',
    articles: {
      'study-pdf': { slug: 'estudiar-un-pdf-de-clase', title: 'Cómo estudiar un PDF de clase sin releerlo sin parar', description: 'Tres pasos para convertir un PDF en preguntas y repasar lo que cuesta antes del examen.', lead: 'Tener todo el curso en un PDF no significa dominarlo. Convierte cada capítulo en preguntas que puedas responder sin mirar.', sections: [
        { title: '1. Prepara un capítulo legible', body: 'Comprueba que puedes seleccionar el texto. Un escaneo formado solo por imágenes necesita OCR. Trabaja con un capítulo, quita páginas irrelevantes y localiza definiciones, mecanismos y ejemplos. Así resulta más fácil detectar errores de extracción.' },
        { title: '2. Convierte el resumen en preguntas', body: 'Usa el resumen como mapa y contrasta las ideas importantes con el original. Haz preguntas precisas: «¿Qué función tiene la membrana celular?» es más útil que una tarjeta titulada «membrana». Intenta responder antes de revelar la solución.' },
        { title: '3. Vuelve a lo difícil', body: 'Termina con un cuestionario sin apuntes. Por cada error, regresa al pasaje original y anota qué te confundió. Empieza por esos puntos en la siguiente sesión. El objetivo es explicar el curso sin apoyo, no completar muchas tarjetas.' },
      ], takeaway: 'Empieza con un capítulo, escribe preguntas comprobables y dedica la siguiente sesión a las respuestas dudosas.' },
      'check-summary': { slug: 'comprobar-resumen-ia-pdf', title: 'Cómo comprobar un resumen de PDF generado por IA', description: 'Verifica cifras, fórmulas e ideas clave en el documento original antes de estudiar.', lead: 'Un resumen bien escrito puede ocultar una cifra mal leída o un matiz perdido. Úsalo como guía, pero comprueba sus afirmaciones en el PDF.', sections: [
        { title: '1. Encuentra el pasaje original', body: 'Toma cada afirmación importante y busca dónde aparece en el documento. Si el texto no la respalda claramente, márcala como incierta. Revisa con especial cuidado definiciones, excepciones y conclusiones.' },
        { title: '2. Recalcula cifras y unidades', body: 'En un ejercicio científico, copia los datos antes de calcular: 27 °C son unos 300 K, mientras que 270 °C son unos 543 K. Ese cambio altera el resultado. Comprueba también signos, unidades y exponentes.' },
        { title: '3. Convierte la revisión en práctica', body: 'Corrige el resumen con tus palabras y formula una pregunta por cada punto dudoso. En un cuestionario, explica por qué una opción es correcta y las otras no. Mantén el PDF abierto si una cifra sigue siendo ambigua.' },
      ], takeaway: 'Un resumen útil siempre permite volver a la fuente, sobre todo cuando una sola cifra cambia la respuesta.' },
    },
  },
  de: {
    indexTitle: 'CramDesk Lernratgeber', indexDescription: 'Konkrete Methoden, um Kurs-PDFs zu verstehen, Zusammenfassungen zu prüfen und mit dem Original zu üben.', eyebrow: 'Praktische Anleitungen', read: 'Anleitung lesen', tryTool: 'Mit meinem PDF ausprobieren', back: 'Alle Anleitungen',
    articles: {
      'study-pdf': { slug: 'kurs-pdf-lernen', title: 'Ein Kurs-PDF lernen, ohne es endlos erneut zu lesen', description: 'Drei Schritte vom PDF zu Fragen und gezielter Wiederholung vor der Prüfung.', lead: 'Ein PDF kann den ganzen Stoff enthalten und trotzdem ein falsches Gefühl von Sicherheit geben. Verwandle jedes Kapitel in Fragen, die du ohne Nachschlagen beantworten kannst.', sections: [
        { title: '1. Ein lesbares Kapitel vorbereiten', body: 'Prüfe, ob sich Text im PDF markieren lässt. Ein reiner Bildscan braucht zuerst OCR. Nimm ein Kapitel, entferne unnötige Seiten und markiere Definitionen, Abläufe und Beispiele. In einem kürzeren Dokument fallen Auslesefehler schneller auf.' },
        { title: '2. Aus der Zusammenfassung Fragen machen', body: 'Nutze die Zusammenfassung als Überblick und prüfe wichtige Aussagen im Original. Formuliere konkrete Fragen: „Welche Aufgabe hat die Zellmembran?“ ist hilfreicher als eine Karte namens „Membran“. Versuche die Antwort, bevor du die Karte umdrehst.' },
        { title: '3. Schwierige Stellen erneut bearbeiten', body: 'Schließe mit einem Quiz ohne Unterlagen ab. Suche nach jedem Fehler die Textstelle und notiere die Ursache. Beginne die nächste Einheit mit diesen Punkten. Entscheidend ist, ob du den Stoff selbst erklären kannst, nicht wie viele Karten du abschließt.' },
      ], takeaway: 'Starte mit einem Kapitel, stelle überprüfbare Fragen und wiederhole beim nächsten Mal zuerst unsichere Antworten.' },
      'check-summary': { slug: 'ki-pdf-zusammenfassung-pruefen', title: 'Eine KI-Zusammenfassung mit dem PDF abgleichen', description: 'Zahlen, Formeln und zentrale Aussagen im Original prüfen, bevor du sie lernst.', lead: 'Auch eine flüssige Zusammenfassung kann eine Zahl falsch lesen oder eine Einschränkung auslassen. Nutze sie zur Orientierung und überprüfe ihre Aussagen im PDF.', sections: [
        { title: '1. Die Textstelle wiederfinden', body: 'Suche zu jeder wichtigen Behauptung die passende Stelle. Steht sie nicht klar im Dokument, markiere sie als unsicher. Achte besonders auf Definitionen, Ausnahmen und Schlussfolgerungen.' },
        { title: '2. Zahlen und Einheiten nachrechnen', body: 'Übertrage bei einer naturwissenschaftlichen Aufgabe zuerst die Daten: 27 °C sind etwa 300 K, 270 °C dagegen etwa 543 K. Das verändert das Ergebnis. Prüfe auch Vorzeichen, Einheiten und Exponenten.' },
        { title: '3. Aus dem Prüfen eine Übung machen', body: 'Korrigiere die Zusammenfassung in eigenen Worten und erstelle zu jedem unsicheren Punkt eine Frage. Erkläre im Quiz, warum eine Antwort stimmt und die anderen nicht. Lass das Original offen, wenn ein Wert unklar bleibt.' },
      ], takeaway: 'Eine gute Zusammenfassung führt zur Quelle zurück – besonders wenn eine einzige Zahl das Ergebnis verändert.' },
    },
  },
  it: {
    indexTitle: 'Guide allo studio CramDesk', indexDescription: 'Metodi pratici per capire un PDF, controllare un riassunto e allenarti mantenendo la fonte a portata di mano.', eyebrow: 'Guide pratiche', read: 'Leggi la guida', tryTool: 'Prova con il mio PDF', back: 'Tutte le guide',
    articles: {
      'study-pdf': { slug: 'studiare-un-pdf', title: 'Come studiare un PDF senza rileggerlo all’infinito', description: 'Tre passaggi per trasformare un PDF in domande e ripassi mirati prima dell’esame.', lead: 'Avere tutto il corso in un PDF non significa averlo imparato. Trasforma ogni capitolo in domande a cui sai rispondere senza guardare.', sections: [
        { title: '1. Prepara un capitolo leggibile', body: 'Controlla che il testo sia selezionabile. Una scansione composta solo da immagini richiede prima l’OCR. Lavora su un capitolo, elimina le pagine superflue e individua definizioni, meccanismi ed esempi. È più semplice notare errori di estrazione.' },
        { title: '2. Dal riassunto alle domande', body: 'Usa il riassunto come mappa e verifica le idee importanti nel documento. Crea domande precise: «Qual è la funzione della membrana cellulare?» è più utile di una scheda intitolata «membrana». Prova a rispondere prima di girarla.' },
        { title: '3. Torna sui punti difficili', body: 'Concludi con un quiz senza appunti. Dopo ogni errore, torna al passaggio originale e annota cosa ti ha confuso. Parti da lì nella sessione successiva. Conta saper spiegare il corso senza aiuti, non completare molte schede.' },
      ], takeaway: 'Inizia con un capitolo, formula domande verificabili e riprendi prima le risposte incerte.' },
      'check-summary': { slug: 'verificare-riassunto-ia-pdf', title: 'Come verificare un riassunto PDF creato dall’IA', description: 'Controlla numeri, formule e idee principali nel documento originale prima di studiare.', lead: 'Un riassunto scorrevole può nascondere un numero letto male o una precisazione mancante. Usalo per orientarti, poi confronta le affermazioni con il PDF.', sections: [
        { title: '1. Ritrova il passaggio originale', body: 'Per ogni affermazione importante, cerca il punto corrispondente nel documento. Se non la supporta chiaramente, segnala il dubbio. Presta attenzione a definizioni, eccezioni e conclusioni.' },
        { title: '2. Ricontrolla numeri e unità', body: 'In un esercizio scientifico, trascrivi i dati prima di calcolare: 27 °C sono circa 300 K, mentre 270 °C sono circa 543 K. Il risultato cambia. Controlla anche segni, unità ed esponenti.' },
        { title: '3. Trasforma la verifica in esercizio', body: 'Correggi il riassunto con parole tue e crea una domanda per ogni punto incerto. Nel quiz, spiega perché una risposta è corretta e le altre no. Tieni aperto il PDF se un valore resta ambiguo.' },
      ], takeaway: 'Un riassunto utile deve riportarti alla fonte, soprattutto se un solo numero può cambiare la risposta.' },
    },
  },
  pt: {
    indexTitle: 'Guias de estudo CramDesk', indexDescription: 'Métodos práticos para compreender um PDF, verificar um resumo e treinar sem perder a ligação ao original.', eyebrow: 'Guias práticos', read: 'Ler o guia', tryTool: 'Experimentar com o meu PDF', back: 'Todos os guias',
    articles: {
      'study-pdf': { slug: 'estudar-um-pdf', title: 'Como estudar um PDF sem o reler sem parar', description: 'Três passos para passar do PDF a perguntas e revisões orientadas antes do exame.', lead: 'Ter toda a matéria num PDF não significa dominá-la. Transforma cada capítulo em perguntas a que consegues responder sem consultar o texto.', sections: [
        { title: '1. Prepara um capítulo legível', body: 'Confirma que o texto do PDF é selecionável. Uma digitalização feita só de imagens precisa primeiro de OCR. Trabalha um capítulo, retira páginas irrelevantes e identifica definições, processos e exemplos. Fica mais fácil detetar erros de extração.' },
        { title: '2. Transforma o resumo em perguntas', body: 'Usa o resumo como mapa e confirma as ideias principais no original. Faz perguntas específicas: «Qual é a função da membrana celular?» é mais útil do que um cartão chamado «membrana». Tenta responder antes de virar o cartão.' },
        { title: '3. Volta aos pontos difíceis', body: 'Termina com um quiz sem apontamentos. Após cada erro, regressa ao trecho original e regista a causa da dúvida. Começa por esses pontos na sessão seguinte. O objetivo é explicar a matéria sem apoio, não terminar muitos cartões.' },
      ], takeaway: 'Começa com um capítulo, cria perguntas verificáveis e dedica a próxima sessão às respostas incertas.' },
      'check-summary': { slug: 'verificar-resumo-ia-pdf', title: 'Como verificar um resumo de PDF criado por IA', description: 'Confirma números, fórmulas e ideias importantes no documento original antes de estudar.', lead: 'Um resumo fluente pode esconder um valor mal lido ou uma ressalva omitida. Usa-o para te orientares e compara as afirmações com o PDF.', sections: [
        { title: '1. Encontra a passagem original', body: 'Para cada afirmação importante, procura o trecho correspondente. Se o documento não a sustentar claramente, assinala a dúvida. Confirma sobretudo definições, exceções e conclusões.' },
        { title: '2. Refaz números e unidades', body: 'Num exercício científico, copia os dados antes de calcular: 27 °C são cerca de 300 K, mas 270 °C são cerca de 543 K. Isso altera o resultado. Verifica também sinais, unidades e expoentes.' },
        { title: '3. Faz da verificação um exercício', body: 'Corrige o resumo por palavras tuas e cria uma pergunta para cada ponto incerto. No quiz, explica por que uma resposta está certa e as outras não. Mantém o PDF aberto se um valor continuar ambíguo.' },
      ], takeaway: 'Um resumo útil permite sempre voltar à fonte, sobretudo quando um único número altera a resposta.' },
    },
  },
  zh: {
    indexTitle: 'CramDesk 学习指南', indexDescription: '了解如何读懂课程 PDF、核对摘要，并始终对照原文练习。', eyebrow: '实用指南', read: '阅读指南', tryTool: '用我的 PDF 试一试', back: '全部指南',
    articles: {
      'study-pdf': { slug: 'study-course-pdf', title: '如何学习课程 PDF，而不是反复重读', description: '用三个步骤把 PDF 变成练习题，并在考试前针对薄弱点复习。', lead: 'PDF 收录了整门课，也不代表你已经掌握。把每一章变成不看原文也能回答的问题，才能发现真正的薄弱点。', sections: [
        { title: '1. 准备一章可读取的内容', body: '先确认 PDF 中的文字可以选中。纯图片扫描件需要先做 OCR。一次处理一章，去掉无关页面，标出定义、过程和例子。范围缩小后也更容易发现提取错误。' },
        { title: '2. 从摘要走向提问', body: '把摘要当作章节地图，再回到原文核对重点。问题要具体：“细胞膜有什么作用？”比只写“细胞膜”的卡片更有用。翻看答案前，先试着独立回答。' },
        { title: '3. 回到难点', body: '最后不看笔记完成测验。每答错一次，回到对应段落，写下混淆的原因。下一次先复习这些问题。重点不是做完多少卡片，而是能否不用提示讲清课程内容。' },
      ], takeaway: '先选一章，写出几道可核对的问题，下一次优先复习犹豫过的答案。' },
      'check-summary': { slug: 'check-ai-pdf-summary', title: '如何核对 AI 生成的 PDF 摘要', description: '复习之前，对照原文核对数字、公式和重要观点。', lead: '语言流畅的摘要也可能漏掉条件或读错数字。把它当成阅读导航，再逐条与 PDF 原文核对。', sections: [
        { title: '1. 找到原文依据', body: '挑出摘要中的重要结论，寻找对应的原文段落。如果文档没有明确支持，就标记为待核实。定义、例外情况和推论尤其值得检查。' },
        { title: '2. 重算数字与单位', body: '做科学题时先抄准条件：27 °C 约为 300 K，而 270 °C 约为 543 K，结果会完全不同。还要检查功的正负号、单位和公式中的指数。' },
        { title: '3. 把核对变成练习', body: '用自己的话改写摘要，并针对每个犹豫点出一道题。做测验时说明正确选项为什么正确、其他选项为什么不对。数值仍有歧义时，把原 PDF 放在旁边。' },
      ], takeaway: '有用的摘要应该能带你回到来源，尤其当一个数字就能改变答案时。' },
    },
  },
  ja: {
    indexTitle: 'CramDesk 学習ガイド', indexDescription: '授業PDFを理解し、要約を確認し、原文と照らしながら練習するための具体的な方法。', eyebrow: '実践ガイド', read: 'ガイドを読む', tryTool: '自分のPDFで試す', back: 'ガイド一覧',
    articles: {
      'study-pdf': { slug: 'study-course-pdf', title: '授業PDFを何度も読み返すだけで終わらせない方法', description: 'PDFを問題に変え、試験前に苦手な部分を重点的に復習する3段階の方法。', lead: '授業全体がPDFに入っていても、理解できているとは限りません。各章を、資料を見ずに答えられる質問に変えてみましょう。', sections: [
        { title: '1. 読める章を一つ用意する', body: 'PDFの文字を選択できるか確認します。画像だけのスキャンには先にOCRが必要です。一章ずつ扱い、不要なページを除いて、定義・仕組み・例を探します。範囲を絞ると抽出ミスにも気づきやすくなります。' },
        { title: '2. 要約を質問に変える', body: '要約を章の地図として使い、重要な点は原文で確認します。「細胞膜の役割は何か？」のような具体的な質問は、「細胞膜」とだけ書いたカードより答えやすさを確かめられます。裏返す前に自分で答えましょう。' },
        { title: '3. 難しい部分に戻る', body: '最後にノートを見ずにクイズを解きます。間違えたら元の箇所に戻り、何を混同したのか書き出します。次回はそこから始めます。カードを何枚終えたかより、内容を自力で説明できるかが大切です。' },
      ], takeaway: 'まず一章を選び、原文で確認できる質問を作り、次回は迷った答えから復習しましょう。' },
      'check-summary': { slug: 'check-ai-pdf-summary', title: 'AIが作ったPDF要約を確認する方法', description: '学習前に数字、式、重要な記述を元の資料と照らし合わせましょう。', lead: '読みやすい要約にも、数字の読み違いや条件の抜け落ちがあります。要約を案内図として使い、記述をPDF原文で一つずつ確かめます。', sections: [
        { title: '1. 根拠となる箇所を見つける', body: '重要な記述ごとに対応する原文を探します。資料が明確に裏付けていなければ、未確認として残します。定義、例外、結論には特に注意してください。' },
        { title: '2. 数字と単位を計算し直す', body: '理科の問題ではまず条件を書き写します。27 °Cは約300 Kですが、270 °Cは約543 Kです。これだけで答えが変わります。仕事の符号、単位、式の指数も確認しましょう。' },
        { title: '3. 確認を練習につなげる', body: '要約を自分の言葉で直し、迷った点ごとに質問を作ります。クイズでは正解だけでなく、他の選択肢が違う理由も説明します。数値が曖昧なら元のPDFを横に置いてください。' },
      ], takeaway: '役に立つ要約なら、特に一つの数字で結果が変わる場面で、原文に戻れるはずです。' },
    },
  },
  ar: {
    indexTitle: 'دليل المذاكرة من CramDesk', indexDescription: 'طرق عملية لفهم ملف المقرر، والتحقق من الملخص، والتدرب مع الرجوع إلى النص الأصلي.', eyebrow: 'أدلة عملية', read: 'اقرأ الدليل', tryTool: 'جرّب باستخدام ملفي', back: 'كل الأدلة',
    articles: {
      'study-pdf': { slug: 'study-course-pdf', title: 'كيف تذاكر ملف PDF من دون إعادة قراءته باستمرار', description: 'ثلاث خطوات لتحويل ملف المقرر إلى أسئلة ومراجعة الأجزاء الصعبة قبل الامتحان.', lead: 'قد يحتوي ملف PDF على المقرر كله من دون أن يعني ذلك أنك أتقنته. حوّل كل فصل إلى أسئلة تستطيع الإجابة عنها دون النظر إلى النص.', sections: [
        { title: '1. جهّز فصلًا قابلًا للقراءة', body: 'تأكد أولًا من إمكانية تحديد النص في الملف. يحتاج الملف الممسوح ضوئيًا كصور فقط إلى OCR. اعمل على فصل واحد، واحذف الصفحات غير المهمة، وحدد التعريفات والعمليات والأمثلة. يسهل بذلك اكتشاف أخطاء استخراج النص.' },
        { title: '2. حوّل الملخص إلى أسئلة', body: 'استخدم الملخص خريطة للفصل، ثم راجع الأفكار المهمة في الأصل. اجعل السؤال محددًا: «ما وظيفة غشاء الخلية؟» أنفع من بطاقة عنوانها «الغشاء». حاول الإجابة بنفسك قبل إظهار الوجه الآخر.' },
        { title: '3. عُد إلى النقاط الصعبة', body: 'اختم باختبار من دون ملاحظات. بعد كل خطأ، ارجع إلى الفقرة الأصلية واكتب سبب الالتباس. ابدأ بهذه النقاط في الجلسة التالية. المهم أن تتمكن من شرح المقرر بنفسك، لا أن تنهي عددًا كبيرًا من البطاقات.' },
      ], takeaway: 'ابدأ بفصل واحد، واكتب أسئلة يمكن التحقق منها، وخصص الجلسة التالية للإجابات التي ترددت فيها.' },
      'check-summary': { slug: 'check-ai-pdf-summary', title: 'كيف تتحقق من ملخص PDF أنشأه الذكاء الاصطناعي', description: 'راجع الأرقام والمعادلات والأفكار المهمة في المستند الأصلي قبل الدراسة.', lead: 'قد يخفي الملخص السلس رقمًا قُرئ خطأ أو شرطًا مفقودًا. استخدمه دليلًا للقراءة، ثم قارن ادعاءاته بملف PDF.', sections: [
        { title: '1. اعثر على النص الأصلي', body: 'اختر كل معلومة مهمة في الملخص وابحث عن الفقرة التي تدعمها. إذا لم يدعمها المستند بوضوح، فضع عليها علامة «غير مؤكدة». دقق في التعريفات والاستثناءات والاستنتاجات.' },
        { title: '2. أعد حساب الأرقام والوحدات', body: 'في المسائل العلمية، انسخ المعطيات أولًا: 27 °م تساوي نحو 300 كلفن، أما 270 °م فتساوي نحو 543 كلفن. يتغير الحل تمامًا. راجع أيضًا إشارة الشغل والوحدات والأسس في الصيغ.' },
        { title: '3. حوّل التحقق إلى تدريب', body: 'صحح الملخص بأسلوبك، وضع سؤالًا لكل نقطة شككت فيها. في الاختبار، اشرح لماذا الإجابة الصحيحة صحيحة ولماذا الأخرى خاطئة. أبقِ الملف الأصلي مفتوحًا عندما تكون قيمة ما ملتبسة.' },
      ], takeaway: 'ينبغي أن يقودك الملخص المفيد دائمًا إلى المصدر، خاصة عندما يغير رقم واحد الإجابة.' },
    },
  },
}

export function blogIndexPath(locale: StudyPdfLocale) { return locale === 'fr' ? '/blog' : `/${locale}/blog` }
export function blogArticlePath(locale: StudyPdfLocale, id: BlogArticleId) { return `${blogIndexPath(locale)}/${blogCopy[locale].articles[id].slug}` }
export function blogArticleFromSlug(locale: StudyPdfLocale, slug: string) { return BLOG_IDS.find(id => blogCopy[locale].articles[id].slug === slug) }
export function blogAlternates(id?: BlogArticleId) {
  return Object.fromEntries((['fr', 'en', 'es', 'de', 'it', 'pt', 'zh', 'ja', 'ar'] as const).map(locale => [locale, id ? blogArticlePath(locale, id) : blogIndexPath(locale)]))
}
