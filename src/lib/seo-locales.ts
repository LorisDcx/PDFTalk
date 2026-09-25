export const SEO_LOCALES = ['en', 'es', 'de', 'it', 'pt', 'zh', 'ja', 'ar'] as const
export type SeoLocale = typeof SEO_LOCALES[number]

type LocalizedLanding = {
  name: string
  title: string
  description: string
  eyebrow: string
  heading: string
  intro: string
  featuresTitle: string
  features: { title: string; description: string }[]
  stepsTitle: string
  steps: string[]
  pricingTitle: string
  pricingText: string
  faqTitle: string
  faqs: { question: string; answer: string }[]
  start: string
  login: string
  home: string
  disclaimer: string
}

export const localizedLandings: Record<SeoLocale, LocalizedLanding> = {
  en: {
    name: 'English', title: 'Turn PDFs into Study Notes, Flashcards & Quizzes | CramDesk',
    description: 'Upload a course PDF and create a structured summary, flashcards and practice quizzes. Study the key ideas and test what you remember.',
    eyebrow: 'A study workspace for your course PDFs', heading: 'Study your PDFs with a clearer plan',
    intro: 'CramDesk turns a readable PDF into a summary you can review, flashcards you can practise, and questions that reveal what needs another pass.',
    featuresTitle: 'From reading to active recall',
    features: [
      { title: 'Understand the essentials', description: 'See a structured overview and a simpler explanation of the document.' },
      { title: 'Review with flashcards', description: 'Generate question-and-answer cards and export them as CSV.' },
      { title: 'Check your understanding', description: 'Build multiple-choice quizzes and revisit the questions you missed.' },
    ],
    stepsTitle: 'How it works', steps: ['Upload a text-based PDF.', 'Read the summary and key points.', 'Create flashcards or a quiz and practise.'],
    pricingTitle: 'Start with a 7-day trial', pricingText: 'Plans start at €3.99 per month after the trial. No payment card is required to sign up.',
    faqTitle: 'Common questions', faqs: [
      { question: 'Can I use a scanned PDF?', answer: 'CramDesk needs selectable text in the PDF. Image-only scans may not be readable.' },
      { question: 'Can I study in another language?', answer: 'The interface supports nine languages, and you can choose the language used for generated flashcards and quizzes.' },
    ],
    start: 'Start studying', login: 'Sign in', home: 'French homepage', disclaimer: 'AI-generated study material can contain errors. Check important details against your source PDF.',
  },
  es: {
    name: 'Español', title: 'Convierte PDF en apuntes, tarjetas y cuestionarios | CramDesk',
    description: 'Sube un PDF de clase y crea un resumen, tarjetas de estudio y cuestionarios para repasar las ideas principales.',
    eyebrow: 'Tu espacio de estudio para documentos PDF', heading: 'Estudia tus PDF con un plan más claro',
    intro: 'CramDesk transforma tus apuntes en un resumen organizado, tarjetas de preguntas y respuestas, y cuestionarios para comprobar lo que recuerdas.',
    featuresTitle: 'Del documento al repaso activo',
    features: [
      { title: 'Comprende lo esencial', description: 'Consulta un resumen estructurado y una explicación más sencilla.' },
      { title: 'Repasa con tarjetas', description: 'Genera tarjetas de estudio y expórtalas en formato CSV.' },
      { title: 'Pon a prueba tus conocimientos', description: 'Crea cuestionarios y vuelve a las preguntas que hayas fallado.' },
    ],
    stepsTitle: 'Cómo funciona', steps: ['Sube un PDF con texto seleccionable.', 'Lee el resumen y los puntos clave.', 'Crea tarjetas o un cuestionario y practica.'],
    pricingTitle: 'Empieza con 7 días de prueba', pricingText: 'Después de la prueba, los planes empiezan en 3,99 € al mes. No necesitas tarjeta bancaria para registrarte.',
    faqTitle: 'Preguntas frecuentes', faqs: [
      { question: '¿Funciona con PDF escaneados?', answer: 'El PDF debe contener texto seleccionable. Puede que no se lean los documentos formados solo por imágenes.' },
      { question: '¿Puedo estudiar en otros idiomas?', answer: 'La interfaz admite nueve idiomas y puedes elegir el idioma de las tarjetas y los cuestionarios generados.' },
    ],
    start: 'Empezar a estudiar', login: 'Iniciar sesión', home: 'Inicio en francés', disclaimer: 'El contenido generado por IA puede contener errores. Comprueba los datos importantes en el PDF original.',
  },
  de: {
    name: 'Deutsch', title: 'PDFs in Lernnotizen, Karteikarten und Quizze umwandeln | CramDesk',
    description: 'Lade ein Kurs-PDF hoch und erstelle eine Zusammenfassung, Karteikarten und Übungsquizze für deine Prüfungsvorbereitung.',
    eyebrow: 'Dein Lernbereich für Kurs-PDFs', heading: 'Lerne mit deinen PDFs nach einem klaren Plan',
    intro: 'CramDesk erstellt aus einem lesbaren PDF eine geordnete Zusammenfassung, Karteikarten und Fragen, mit denen du dein Wissen überprüfen kannst.',
    featuresTitle: 'Vom Lesen zum aktiven Wiederholen',
    features: [
      { title: 'Das Wesentliche verstehen', description: 'Lies eine gegliederte Übersicht und eine einfachere Erklärung.' },
      { title: 'Mit Karteikarten üben', description: 'Erstelle Frage-Antwort-Karten und exportiere sie als CSV.' },
      { title: 'Wissen überprüfen', description: 'Erstelle Multiple-Choice-Quizze und wiederhole schwierige Fragen.' },
    ],
    stepsTitle: 'So funktioniert es', steps: ['Lade ein PDF mit auswählbarem Text hoch.', 'Lies die Zusammenfassung und Kernpunkte.', 'Erstelle Karteikarten oder ein Quiz.'],
    pricingTitle: 'Starte mit 7 Tagen Probezeit', pricingText: 'Danach beginnen die Tarife bei 3,99 € pro Monat. Für die Anmeldung ist keine Kreditkarte nötig.',
    faqTitle: 'Häufige Fragen', faqs: [
      { question: 'Funktionieren gescannte PDFs?', answer: 'CramDesk benötigt auswählbaren Text. Reine Bildscans können möglicherweise nicht gelesen werden.' },
      { question: 'Kann ich in anderen Sprachen lernen?', answer: 'Die Oberfläche unterstützt neun Sprachen. Die Sprache für Karteikarten und Quizze lässt sich auswählen.' },
    ],
    start: 'Jetzt lernen', login: 'Anmelden', home: 'Französische Startseite', disclaimer: 'KI-generierte Lerninhalte können Fehler enthalten. Prüfe wichtige Angaben im Original-PDF.',
  },
  it: {
    name: 'Italiano', title: 'Trasforma PDF in appunti, flashcard e quiz | CramDesk',
    description: 'Carica un PDF del corso e crea riassunti, flashcard e quiz per ripassare i concetti principali.',
    eyebrow: 'Uno spazio di studio per i tuoi PDF', heading: 'Studia i tuoi PDF con un piano più chiaro',
    intro: 'CramDesk ricava da un PDF leggibile un riassunto organizzato, flashcard e domande per verificare ciò che hai imparato.',
    featuresTitle: 'Dalla lettura al ripasso attivo',
    features: [
      { title: 'Capisci i punti essenziali', description: 'Leggi una panoramica strutturata e una spiegazione più semplice.' },
      { title: 'Ripassa con le flashcard', description: 'Crea schede domanda-risposta ed esportale in CSV.' },
      { title: 'Metti alla prova le tue conoscenze', description: 'Genera quiz a scelta multipla e rivedi gli errori.' },
    ],
    stepsTitle: 'Come funziona', steps: ['Carica un PDF con testo selezionabile.', 'Leggi il riassunto e i punti chiave.', 'Crea flashcard o un quiz e fai pratica.'],
    pricingTitle: 'Inizia con 7 giorni di prova', pricingText: 'Dopo la prova, i piani partono da 3,99 € al mese. Non serve una carta per registrarsi.',
    faqTitle: 'Domande frequenti', faqs: [
      { question: 'Posso usare PDF scansionati?', answer: 'Il PDF deve contenere testo selezionabile. Le scansioni composte solo da immagini potrebbero non essere leggibili.' },
      { question: 'Posso studiare in altre lingue?', answer: 'L’interfaccia supporta nove lingue e puoi scegliere la lingua delle flashcard e dei quiz generati.' },
    ],
    start: 'Inizia a studiare', login: 'Accedi', home: 'Pagina francese', disclaimer: 'I materiali generati dall’IA possono contenere errori. Verifica le informazioni importanti nel PDF originale.',
  },
  pt: {
    name: 'Português', title: 'Transforme PDFs em resumos, cartões e questionários | CramDesk',
    description: 'Envie um PDF de estudo e crie resumos, cartões de revisão e questionários para praticar os conceitos principais.',
    eyebrow: 'Um espaço de estudo para os seus PDFs', heading: 'Estude os seus PDFs com um plano mais claro',
    intro: 'O CramDesk transforma um PDF legível num resumo organizado, cartões de perguntas e respostas e questionários para testar a sua aprendizagem.',
    featuresTitle: 'Da leitura à revisão ativa',
    features: [
      { title: 'Compreenda o essencial', description: 'Leia um resumo estruturado e uma explicação mais simples.' },
      { title: 'Reveja com cartões', description: 'Crie cartões de estudo e exporte-os em CSV.' },
      { title: 'Teste o que aprendeu', description: 'Gere questionários de escolha múltipla e reveja os erros.' },
    ],
    stepsTitle: 'Como funciona', steps: ['Envie um PDF com texto selecionável.', 'Leia o resumo e os pontos principais.', 'Crie cartões ou um questionário e pratique.'],
    pricingTitle: 'Comece com 7 dias de teste', pricingText: 'Depois do teste, os planos começam em 3,99 € por mês. Não é necessário cartão para criar uma conta.',
    faqTitle: 'Perguntas frequentes', faqs: [
      { question: 'Posso usar um PDF digitalizado?', answer: 'O PDF precisa de texto selecionável. Digitalizações apenas com imagens podem não ser legíveis.' },
      { question: 'Posso estudar noutros idiomas?', answer: 'A interface suporta nove idiomas e pode escolher o idioma dos cartões e questionários gerados.' },
    ],
    start: 'Começar a estudar', login: 'Entrar', home: 'Página em francês', disclaimer: 'Os materiais gerados por IA podem conter erros. Confirme os dados importantes no PDF original.',
  },
  zh: {
    name: '中文', title: '将 PDF 课程资料变成笔记、记忆卡和测验 | CramDesk',
    description: '上传课程 PDF，生成结构化摘要、记忆卡和练习题，帮助你复习重点并检验理解。',
    eyebrow: '为课程 PDF 打造的学习空间', heading: '更有条理地学习 PDF 资料',
    intro: 'CramDesk 可从可读取文字的 PDF 中整理摘要、生成问答记忆卡和测验，帮助你发现仍需复习的知识点。',
    featuresTitle: '从阅读走向主动回忆',
    features: [
      { title: '抓住核心内容', description: '查看结构化摘要和更易懂的解释。' },
      { title: '用记忆卡复习', description: '生成问答卡片，并可导出为 CSV。' },
      { title: '检验学习成果', description: '创建选择题测验，回顾答错的题目。' },
    ],
    stepsTitle: '使用方法', steps: ['上传包含可选择文字的 PDF。', '阅读摘要和重点。', '生成记忆卡或测验并开始练习。'],
    pricingTitle: '先试用 7 天', pricingText: '试用结束后，套餐每月 3.99 欧元起。注册无需银行卡。',
    faqTitle: '常见问题', faqs: [
      { question: '可以使用扫描版 PDF 吗？', answer: 'PDF 需要包含可选择的文字。仅包含图片的扫描件可能无法读取。' },
      { question: '可以使用其他语言学习吗？', answer: '界面支持九种语言，你也可以选择记忆卡和测验的生成语言。' },
    ],
    start: '开始学习', login: '登录', home: '法语首页', disclaimer: 'AI 生成的学习内容可能有误，请对照原始 PDF 核实重要信息。',
  },
  ja: {
    name: '日本語', title: 'PDF教材から要約・単語カード・クイズを作成 | CramDesk',
    description: '授業のPDFをアップロードして、要約、学習カード、練習クイズを作成。重要な内容を復習できます。',
    eyebrow: 'PDF教材のための学習スペース', heading: 'PDF教材をもっと計画的に学ぶ',
    intro: 'CramDeskは文字を読み取れるPDFから要約、質問と回答のカード、理解度を確かめるクイズを作成します。',
    featuresTitle: '読むだけで終わらない復習へ',
    features: [
      { title: '要点を理解する', description: '整理された要約と、より平易な説明を確認できます。' },
      { title: 'カードで復習する', description: '質問と回答のカードを作成し、CSVで書き出せます。' },
      { title: '理解度を試す', description: '選択式クイズを作成し、間違えた問題を復習できます。' },
    ],
    stepsTitle: '使い方', steps: ['文字を選択できるPDFをアップロード。', '要約と重要ポイントを確認。', 'カードやクイズを作って練習。'],
    pricingTitle: 'まずは7日間お試し', pricingText: '試用後のプランは月額3.99ユーロから。登録時にカードは不要です。',
    faqTitle: 'よくある質問', faqs: [
      { question: 'スキャンしたPDFは使えますか？', answer: '選択可能な文字を含むPDFが必要です。画像だけのスキャンは読み取れない場合があります。' },
      { question: '他の言語でも学習できますか？', answer: '画面は9言語に対応し、カードとクイズの生成言語も選べます。' },
    ],
    start: '学習を始める', login: 'ログイン', home: 'フランス語のホーム', disclaimer: 'AIが作成した教材には誤りが含まれる場合があります。重要な点は元のPDFで確認してください。',
  },
  ar: {
    name: 'العربية', title: 'حوّل ملفات PDF إلى ملخصات وبطاقات وأسئلة تدريبية | CramDesk',
    description: 'ارفع ملف PDF للدراسة وأنشئ ملخصًا منظمًا وبطاقات مراجعة واختبارات قصيرة لفهم الأفكار الأساسية.',
    eyebrow: 'مساحة دراسة لملفات PDF التعليمية', heading: 'ذاكر ملفات PDF بخطة أوضح',
    intro: 'يحوّل CramDesk ملف PDF القابل لقراءة النص إلى ملخص وبطاقات سؤال وجواب واختبارات تساعدك على معرفة ما يحتاج إلى مراجعة.',
    featuresTitle: 'من القراءة إلى التذكر النشط',
    features: [
      { title: 'افهم النقاط المهمة', description: 'اقرأ ملخصًا منظمًا وشرحًا أبسط للمستند.' },
      { title: 'راجع باستخدام البطاقات', description: 'أنشئ بطاقات سؤال وجواب وصدّرها بصيغة CSV.' },
      { title: 'اختبر فهمك', description: 'أنشئ أسئلة متعددة الخيارات وراجع إجاباتك الخاطئة.' },
    ],
    stepsTitle: 'كيف يعمل', steps: ['ارفع ملف PDF يحتوي على نص قابل للتحديد.', 'اقرأ الملخص والأفكار الرئيسية.', 'أنشئ بطاقات أو اختبارًا وابدأ التدريب.'],
    pricingTitle: 'ابدأ بتجربة لمدة 7 أيام', pricingText: 'تبدأ الخطط بعد التجربة من 3.99 يورو شهريًا. لا تحتاج إلى بطاقة دفع عند التسجيل.',
    faqTitle: 'أسئلة شائعة', faqs: [
      { question: 'هل يدعم ملفات PDF الممسوحة ضوئيًا؟', answer: 'يحتاج الملف إلى نص قابل للتحديد. قد لا يمكن قراءة الملفات التي تحتوي على صور فقط.' },
      { question: 'هل يمكنني الدراسة بلغات أخرى؟', answer: 'تدعم الواجهة تسع لغات، ويمكنك اختيار لغة البطاقات والاختبارات التي تُنشأ.' },
    ],
    start: 'ابدأ الدراسة', login: 'تسجيل الدخول', home: 'الصفحة الفرنسية', disclaimer: 'قد تحتوي المواد المنشأة بالذكاء الاصطناعي على أخطاء. تحقق من المعلومات المهمة في ملف PDF الأصلي.',
  },
}

export const languageAlternates = {
  'fr-FR': '/',
  'en-US': '/en',
  'es-ES': '/es',
  'de-DE': '/de',
  'it-IT': '/it',
  'pt-PT': '/pt',
  'zh-CN': '/zh',
  'ja-JP': '/ja',
  'ar': '/ar',
  'x-default': '/',
}
