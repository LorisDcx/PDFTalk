import type { PdfTool } from '@/lib/pdf-tools'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

export const PDF_EXTRA_LOCALES = ['es', 'de', 'it', 'pt', 'zh', 'ja', 'ar'] as const
export type ExtraPdfLocale = typeof PDF_EXTRA_LOCALES[number]
export type PdfToolLocale = StudyPdfLocale

export const pdfHubWorkflow: Record<ExtraPdfLocale, { title: string; steps: readonly [string, string, string] }> = {
  es: { title: 'Lo esencial del PDF, sin complicaciones.', steps: ['Elige la tarea que necesitas.', 'Revisa los archivos o las páginas en miniatura.', 'Crea y descarga el nuevo PDF.'] },
  de: { title: 'Das Wesentliche für PDFs, ganz einfach.', steps: ['Wähle die passende Aufgabe.', 'Prüfe Dateien oder Seiten in der Vorschau.', 'Erstelle und lade das neue PDF herunter.'] },
  it: { title: 'Le operazioni PDF essenziali, senza complicazioni.', steps: ['Scegli l’operazione necessaria.', 'Controlla file e pagine nelle anteprime.', 'Crea e scarica il nuovo PDF.'] },
  pt: { title: 'O essencial para PDF, sem complicações.', steps: ['Escolhe a tarefa de que precisas.', 'Confirma os ficheiros ou as páginas nas miniaturas.', 'Cria e descarrega o novo PDF.'] },
  zh: { title: '常用 PDF 操作，简单完成。', steps: ['选择需要的任务。', '通过缩略图检查文件或页面。', '生成并下载新的 PDF。'] },
  ja: { title: 'PDFの基本操作を、もっと簡単に。', steps: ['必要な作業を選びます。', 'ファイルやページのプレビューを確認します。', '新しいPDFを作成して保存します。'] },
  ar: { title: 'أهم مهام PDF بسهولة.', steps: ['اختر المهمة التي تحتاج إليها.', 'راجع الملفات أو الصفحات في الصور المصغرة.', 'أنشئ ملف PDF الجديد ونزّله.'] },
}

type ToolEntry = readonly [PdfTool, string, string]

export const translatedTools: Record<ExtraPdfLocale, readonly ToolEntry[]> = {
  es: [
    ['merge', 'Fusionar PDF', 'Combina varios PDF en el orden elegido.'],
    ['extract', 'Extraer páginas', 'Conserva solo las páginas que necesitas.'],
    ['organize', 'Organizar páginas', 'Cambia el orden o elimina páginas.'],
    ['rotate', 'Girar páginas', 'Corrige la orientación de un PDF.'],
    ['number', 'Numerar páginas', 'Añade números discretos a cada página.'],
    ['watermark', 'Añadir marca de agua', 'Coloca texto tenue en todas las páginas.'],
    ['metadata', 'Borrar metadatos', 'Elimina los campos estándar del PDF.'],
    ['images', 'Imágenes a PDF', 'Reúne imágenes JPG o PNG en un PDF A4.'],
  ],
  de: [
    ['merge', 'PDFs zusammenfügen', 'Verbinde mehrere PDFs in deiner Reihenfolge.'],
    ['extract', 'Seiten extrahieren', 'Behalte nur die Seiten, die du brauchst.'],
    ['organize', 'Seiten sortieren', 'Ordne Seiten neu oder entferne sie.'],
    ['rotate', 'Seiten drehen', 'Korrigiere die Ausrichtung eines PDFs.'],
    ['number', 'Seiten nummerieren', 'Füge dezente Seitenzahlen hinzu.'],
    ['watermark', 'Wasserzeichen einfügen', 'Setze hellen Text auf jede Seite.'],
    ['metadata', 'Metadaten entfernen', 'Lösche Standardfelder der PDF-Datei.'],
    ['images', 'Bilder in PDF', 'Fasse JPG- oder PNG-Bilder als A4-PDF zusammen.'],
  ],
  it: [
    ['merge', 'Unire PDF', 'Combina più PDF nell’ordine che preferisci.'],
    ['extract', 'Estrarre pagine', 'Conserva solo le pagine necessarie.'],
    ['organize', 'Riordinare pagine', 'Sposta o rimuovi le pagine.'],
    ['rotate', 'Ruotare pagine', 'Correggi l’orientamento di un PDF.'],
    ['number', 'Numerare pagine', 'Aggiungi numeri discreti a ogni pagina.'],
    ['watermark', 'Aggiungere filigrana', 'Inserisci un testo leggero su ogni pagina.'],
    ['metadata', 'Rimuovere metadati', 'Elimina i campi standard del PDF.'],
    ['images', 'Immagini in PDF', 'Riunisci immagini JPG o PNG in un PDF A4.'],
  ],
  pt: [
    ['merge', 'Juntar PDF', 'Combina vários PDF pela ordem escolhida.'],
    ['extract', 'Extrair páginas', 'Guarda apenas as páginas necessárias.'],
    ['organize', 'Reordenar páginas', 'Muda a ordem ou retira páginas.'],
    ['rotate', 'Rodar páginas', 'Corrige a orientação de um PDF.'],
    ['number', 'Numerar páginas', 'Adiciona números discretos a cada página.'],
    ['watermark', 'Adicionar marca de água', 'Coloca texto discreto em todas as páginas.'],
    ['metadata', 'Remover metadados', 'Apaga os campos padrão do PDF.'],
    ['images', 'Imagens para PDF', 'Reúne imagens JPG ou PNG num PDF A4.'],
  ],
  zh: [
    ['merge', '合并 PDF', '按所选顺序合并多个 PDF。'],
    ['extract', '提取页面', '只保留需要的页面。'],
    ['organize', '整理页面', '调整顺序或移除页面。'],
    ['rotate', '旋转页面', '修正 PDF 页面的方向。'],
    ['number', '添加页码', '为每页添加清晰的页码。'],
    ['watermark', '添加水印', '在每页加入浅色文字。'],
    ['metadata', '清除元数据', '移除 PDF 的标准属性字段。'],
    ['images', '图片转 PDF', '将 JPG 或 PNG 图片合成 A4 PDF。'],
  ],
  ja: [
    ['merge', 'PDFを結合', '複数のPDFを好きな順番でまとめます。'],
    ['extract', 'ページを抽出', '必要なページだけを残します。'],
    ['organize', 'ページを並べ替え', '順番を変えたりページを削除したりします。'],
    ['rotate', 'ページを回転', 'PDFの向きを修正します。'],
    ['number', 'ページ番号を追加', '各ページに控えめな番号を付けます。'],
    ['watermark', '透かしを追加', '各ページに薄い文字を入れます。'],
    ['metadata', 'メタデータを削除', 'PDFの標準プロパティを消去します。'],
    ['images', '画像をPDFに変換', 'JPGやPNGをA4のPDFにまとめます。'],
  ],
  ar: [
    ['merge', 'دمج ملفات PDF', 'ادمج ملفات PDF بالترتيب الذي تختاره.'],
    ['extract', 'استخراج الصفحات', 'احتفظ بالصفحات التي تحتاج إليها فقط.'],
    ['organize', 'إعادة ترتيب الصفحات', 'غيّر الترتيب أو احذف صفحات.'],
    ['rotate', 'تدوير الصفحات', 'صحح اتجاه صفحات PDF.'],
    ['number', 'ترقيم الصفحات', 'أضف أرقامًا واضحة لكل صفحة.'],
    ['watermark', 'إضافة علامة مائية', 'ضع نصًا خفيفًا على كل صفحة.'],
    ['metadata', 'حذف البيانات الوصفية', 'امسح حقول خصائص PDF القياسية.'],
    ['images', 'الصور إلى PDF', 'اجمع صور JPG أو PNG في ملف PDF بحجم A4.'],
  ],
}

export const pdfHubCopy: Record<ExtraPdfLocale, {
  title: string; description: string; eyebrow: string; heading: string; intro: string
  choose: string; privacy: string; studyTitle: string; studyText: string; studyAction: string
  faqTitle: string; faqOne: string; faqAnswerOne: string; faqTwo: string; faqAnswerTwo: string
}> = {
  es: { title: 'Herramientas PDF gratis en línea | CramDesk', description: 'Fusiona, extrae, ordena, gira y numera páginas PDF. Añade marcas de agua, borra metadatos o convierte imágenes. Gratis, sin cuenta y en tu navegador.', eyebrow: '8 herramientas PDF gratuitas', heading: 'Prepara tus PDF para estudiar.', intro: 'Elige una tarea, revisa las páginas en miniatura y descarga el resultado. Los archivos se procesan en tu navegador, sin crear una cuenta.', choose: 'Elige una herramienta', privacy: 'Tus archivos permanecen en tu dispositivo. No hay cuota ni subida al servidor.', studyTitle: 'Del PDF preparado al repaso', studyText: 'Después de organizar el documento, puedes importarlo en el espacio de estudio para crear un resumen, tarjetas y preguntas. Ese análisis es una función aparte.', studyAction: 'Explorar el espacio de estudio', faqTitle: 'Preguntas frecuentes', faqOne: '¿Se suben mis archivos?', faqAnswerOne: 'No. Estas ocho operaciones se ejecutan en tu navegador y el nuevo PDF se descarga en tu dispositivo.', faqTwo: '¿Sirve para PDF escaneados?', faqAnswerTwo: 'Puedes reorganizar o girar sus páginas. Estas herramientas no reconocen el texto de las imágenes ni realizan OCR.' },
  de: { title: 'Kostenlose PDF-Werkzeuge online | CramDesk', description: 'PDFs zusammenfügen, Seiten extrahieren, sortieren, drehen und nummerieren. Wasserzeichen, Metadaten und Bilder ebenfalls bearbeiten – lokal und ohne Konto.', eyebrow: '8 kostenlose PDF-Werkzeuge', heading: 'Bereite deine PDFs fürs Lernen vor.', intro: 'Wähle eine Aufgabe, prüfe die Seiten in der Vorschau und lade das Ergebnis herunter. Deine Dateien werden ohne Anmeldung im Browser verarbeitet.', choose: 'Werkzeug auswählen', privacy: 'Die Dateien bleiben auf deinem Gerät. Kein Kontingent und kein Upload.', studyTitle: 'Vom geordneten PDF zum Lernen', studyText: 'Anschließend kannst du das Dokument in den Lernbereich importieren, um eine Zusammenfassung, Karteikarten und Fragen zu erstellen. Diese Analyse ist eine separate Funktion.', studyAction: 'Lernbereich ansehen', faqTitle: 'Häufige Fragen', faqOne: 'Werden meine Dateien hochgeladen?', faqAnswerOne: 'Nein. Alle acht Vorgänge laufen im Browser. Das neue PDF wird auf dein Gerät heruntergeladen.', faqTwo: 'Funktioniert das mit eingescannten PDFs?', faqAnswerTwo: 'Du kannst Seiten sortieren oder drehen. Die Werkzeuge erkennen jedoch keinen Text in Bildern und führen keine OCR durch.' },
  it: { title: 'Strumenti PDF gratuiti online | CramDesk', description: 'Unisci, estrai, riordina, ruota e numera pagine PDF. Aggiungi filigrane, rimuovi metadati o converti immagini. Gratis e senza caricare file.', eyebrow: '8 strumenti PDF gratuiti', heading: 'Prepara i tuoi PDF per studiare.', intro: 'Scegli un’operazione, controlla le anteprime e scarica il risultato. I file vengono elaborati nel browser, senza registrazione.', choose: 'Scegli uno strumento', privacy: 'I file rimangono sul tuo dispositivo. Nessuna quota o caricamento.', studyTitle: 'Dal PDF pronto al ripasso', studyText: 'Dopo aver organizzato il documento, puoi importarlo nello spazio di studio per creare riassunto, schede e domande. L’analisi è una funzione separata.', studyAction: 'Scopri lo spazio di studio', faqTitle: 'Domande frequenti', faqOne: 'I file vengono caricati online?', faqAnswerOne: 'No. Tutte e otto le operazioni avvengono nel browser e il nuovo PDF viene scaricato sul dispositivo.', faqTwo: 'Funzionano con PDF scansionati?', faqAnswerTwo: 'Puoi riordinare o ruotare le pagine. Questi strumenti non riconoscono il testo nelle immagini e non eseguono OCR.' },
  pt: { title: 'Ferramentas PDF gratuitas online | CramDesk', description: 'Junta, extrai, reordena, roda e numera páginas PDF. Adiciona marcas de água, remove metadados ou converte imagens. Grátis, sem conta e sem envio.', eyebrow: '8 ferramentas PDF gratuitas', heading: 'Prepara os teus PDF para estudar.', intro: 'Escolhe uma tarefa, confirma as páginas nas miniaturas e descarrega o resultado. Os ficheiros são processados no navegador, sem registo.', choose: 'Escolher ferramenta', privacy: 'Os ficheiros permanecem no teu dispositivo. Sem quotas nem envio.', studyTitle: 'Do PDF organizado ao estudo', studyText: 'Depois de organizares o documento, podes importá-lo para o espaço de estudo e criar um resumo, cartões e perguntas. Essa análise é uma função separada.', studyAction: 'Explorar o espaço de estudo', faqTitle: 'Perguntas frequentes', faqOne: 'Os ficheiros são enviados?', faqAnswerOne: 'Não. As oito operações decorrem no navegador e o novo PDF é descarregado para o teu dispositivo.', faqTwo: 'Funcionam com PDF digitalizados?', faqAnswerTwo: 'Podes reordenar ou rodar páginas. Estas ferramentas não reconhecem texto em imagens e não fazem OCR.' },
  zh: { title: '免费在线 PDF 工具 | CramDesk', description: '免费合并、提取、整理、旋转 PDF 页面，添加页码或水印，清除标准元数据并将图片转为 PDF。无需注册，文件在浏览器中处理。', eyebrow: '8 款免费 PDF 工具', heading: '整理好 PDF，再开始复习。', intro: '选择任务，查看页面缩略图并下载结果。文件在浏览器中处理，无需创建账户。', choose: '选择工具', privacy: '文件留在你的设备上，无配额限制，也不会上传。', studyTitle: '从整理文档到有效复习', studyText: '整理好文档后，你可以将它导入学习空间，生成摘要、记忆卡和练习题。AI 分析属于独立功能。', studyAction: '了解学习空间', faqTitle: '常见问题', faqOne: '文件会上传吗？', faqAnswerOne: '不会。这八项操作都在浏览器中完成，新的 PDF 会下载到你的设备。', faqTwo: '扫描版 PDF 能用吗？', faqAnswerTwo: '可以整理或旋转其页面，但这些工具不识别图片中的文字，也不提供 OCR。' },
  ja: { title: '無料オンラインPDFツール | CramDesk', description: 'PDFの結合、ページ抽出・並べ替え・回転・番号付け、透かし、メタデータ削除、画像からPDFへの変換。登録不要でブラウザー内で処理。', eyebrow: '無料のPDFツール8種類', heading: 'PDFを整えて、勉強を始めよう。', intro: '作業を選び、ページのプレビューを確認して結果を保存。ファイルは登録不要でブラウザー内で処理されます。', choose: 'ツールを選ぶ', privacy: 'ファイルは端末内に残ります。利用枠やアップロードはありません。', studyTitle: 'PDFの整理から学習へ', studyText: '文書を整えたら学習スペースに取り込み、要約、単語カード、練習問題を作成できます。AI分析は別の機能です。', studyAction: '学習スペースを見る', faqTitle: 'よくある質問', faqOne: 'ファイルはアップロードされますか？', faqAnswerOne: 'いいえ。8種類の操作はブラウザー内で行われ、新しいPDFは端末に保存されます。', faqTwo: 'スキャンPDFにも使えますか？', faqAnswerTwo: 'ページの並べ替えや回転はできます。ただし画像内の文字は認識せず、OCRは行いません。' },
  ar: { title: 'أدوات PDF مجانية عبر الإنترنت | CramDesk', description: 'ادمج ملفات PDF واستخرج الصفحات وأعد ترتيبها ودوّرها ورقّمها. أضف علامة مائية أو احذف البيانات الوصفية أو حوّل الصور إلى PDF مجانًا داخل متصفحك.', eyebrow: '8 أدوات PDF مجانية', heading: 'جهّز ملفات PDF قبل المذاكرة.', intro: 'اختر المهمة، راجع الصور المصغرة للصفحات، ثم نزّل النتيجة. تتم معالجة الملفات داخل متصفحك دون إنشاء حساب.', choose: 'اختر أداة', privacy: 'تبقى ملفاتك على جهازك. لا حصص استخدام ولا رفع للملفات.', studyTitle: 'من تنظيم الملف إلى المراجعة', studyText: 'بعد تنظيم المستند، يمكنك استيراده إلى مساحة الدراسة لإنشاء ملخص وبطاقات وأسئلة. تحليل الذكاء الاصطناعي وظيفة منفصلة.', studyAction: 'استكشف مساحة الدراسة', faqTitle: 'أسئلة شائعة', faqOne: 'هل تُرفع ملفاتي إلى الخادم؟', faqAnswerOne: 'لا. تعمل الأدوات الثماني داخل المتصفح، ويُنزل ملف PDF الجديد على جهازك.', faqTwo: 'هل تعمل مع ملفات PDF الممسوحة ضوئيًا؟', faqAnswerTwo: 'يمكنك ترتيب صفحاتها أو تدويرها. لكنها لا تتعرف على النص داخل الصور ولا توفر OCR.' },
}

export function pdfHubPath(locale: PdfToolLocale) {
  return locale === 'fr' ? '/outils-pdf' : `/${locale}/pdf-tools`
}

type ToolkitCopy = {
  tools: readonly ToolEntry[]; title: string; intro: string; add: string; drop: string; checking: string
  watermark: string; watermarkPlaceholder: string; angle: string; start: string; working: string
  ready: string; reset: string; privacy: string; metadataNote: string; limits: string
  failure: string; available: string; choose: string; output: string; focusLabel: string
  pdfOnly: string; imagesOnly: string; selectPage: string; dropHere: string; dragSupported: string
}

export const extraToolkitCopy: Record<ExtraPdfLocale, ToolkitCopy> = {
  es: { tools: translatedTools.es, title: 'Elige una tarea', intro: 'Usa una herramienta cada vez. Tus archivos permanecen en este dispositivo.', add: 'Añadir archivos', drop: 'Elige tus archivos', checking: 'Comprobando el archivo…', watermark: 'Texto de la marca de agua', watermarkPlaceholder: 'BORRADOR', angle: 'Rotación', start: 'Crear PDF', working: 'Procesando…', ready: 'Tu PDF está listo.', reset: 'Empezar de nuevo', privacy: 'Procesamiento local, sin cuenta, cuota ni subida de archivos.', metadataNote: 'Solo se borran los campos estándar. El texto y otros datos visibles no se ocultan.', limits: 'Hasta 40 MB por PDF o 20 MB por imagen JPG/PNG. No se admiten PDF protegidos con contraseña.', failure: 'No se pudo procesar el archivo. Revísalo e inténtalo de nuevo.', available: 'herramientas disponibles', choose: 'Añade un archivo para empezar.', output: 'Crea el PDF y luego descárgalo.', focusLabel: 'Listo para usar', pdfOnly: 'Solo archivos PDF.', imagesOnly: 'Solo imágenes JPG o PNG.', selectPage: 'Selecciona al menos una página en la vista previa.', dropHere: 'Suelta los archivos aquí', dragSupported: 'puedes arrastrar archivos' },
  de: { tools: translatedTools.de, title: 'Wähle eine Aufgabe', intro: 'Ein Werkzeug nach dem anderen. Deine Dateien bleiben auf diesem Gerät.', add: 'Dateien hinzufügen', drop: 'Dateien auswählen', checking: 'Datei wird geprüft…', watermark: 'Text des Wasserzeichens', watermarkPlaceholder: 'ENTWURF', angle: 'Drehung', start: 'PDF erstellen', working: 'Wird verarbeitet…', ready: 'Dein PDF ist fertig.', reset: 'Neu beginnen', privacy: 'Lokale Verarbeitung ohne Konto, Kontingent oder Datei-Upload.', metadataNote: 'Nur Standardfelder werden gelöscht. Sichtbarer Text und weitere Daten bleiben erhalten.', limits: 'Bis zu 40 MB pro PDF oder 20 MB pro JPG/PNG. Passwortgeschützte PDFs werden nicht unterstützt.', failure: 'Die Verarbeitung ist fehlgeschlagen. Prüfe die Datei und versuche es erneut.', available: 'verfügbare Werkzeuge', choose: 'Füge zum Start eine Datei hinzu.', output: 'Erstelle das PDF und lade es dann herunter.', focusLabel: 'Sofort einsatzbereit', pdfOnly: 'Nur PDF-Dateien.', imagesOnly: 'Nur JPG- oder PNG-Bilder.', selectPage: 'Wähle mindestens eine Seite in der Vorschau aus.', dropHere: 'Dateien hier ablegen', dragSupported: 'Drag-and-drop möglich' },
  it: { tools: translatedTools.it, title: 'Scegli un’operazione', intro: 'Uno strumento alla volta. I file rimangono su questo dispositivo.', add: 'Aggiungi file', drop: 'Scegli i file', checking: 'Verifica del file…', watermark: 'Testo della filigrana', watermarkPlaceholder: 'BOZZA', angle: 'Rotazione', start: 'Crea PDF', working: 'Elaborazione in corso…', ready: 'Il PDF è pronto.', reset: 'Ricomincia', privacy: 'Elaborazione locale, senza account, quote o caricamento.', metadataNote: 'Vengono cancellati solo i campi standard. Il testo e i dati visibili restano.', limits: 'Massimo 40 MB per PDF o 20 MB per immagine JPG/PNG. I PDF protetti da password non sono supportati.', failure: 'Elaborazione non riuscita. Controlla il file e riprova.', available: 'strumenti disponibili', choose: 'Aggiungi un file per iniziare.', output: 'Crea il PDF e poi scaricalo.', focusLabel: 'Pronto da usare', pdfOnly: 'Solo file PDF.', imagesOnly: 'Solo immagini JPG o PNG.', selectPage: 'Seleziona almeno una pagina nell’anteprima.', dropHere: 'Rilascia i file qui', dragSupported: 'trascinamento supportato' },
  pt: { tools: translatedTools.pt, title: 'Escolhe uma tarefa', intro: 'Uma ferramenta de cada vez. Os ficheiros ficam neste dispositivo.', add: 'Adicionar ficheiros', drop: 'Escolher ficheiros', checking: 'A verificar o ficheiro…', watermark: 'Texto da marca de água', watermarkPlaceholder: 'RASCUNHO', angle: 'Rotação', start: 'Criar PDF', working: 'A processar…', ready: 'O teu PDF está pronto.', reset: 'Recomeçar', privacy: 'Processamento local, sem conta, quota ou envio de ficheiros.', metadataNote: 'Apenas os campos padrão são apagados. O texto e os dados visíveis permanecem.', limits: 'Até 40 MB por PDF ou 20 MB por imagem JPG/PNG. PDF protegidos por palavra-passe não são suportados.', failure: 'O processamento falhou. Verifica o ficheiro e tenta novamente.', available: 'ferramentas disponíveis', choose: 'Adiciona um ficheiro para começar.', output: 'Cria o PDF e depois descarrega-o.', focusLabel: 'Pronto a usar', pdfOnly: 'Apenas ficheiros PDF.', imagesOnly: 'Apenas imagens JPG ou PNG.', selectPage: 'Seleciona pelo menos uma página na pré-visualização.', dropHere: 'Larga os ficheiros aqui', dragSupported: 'podes arrastar ficheiros' },
  zh: { tools: translatedTools.zh, title: '选择一项任务', intro: '每次使用一项工具。文件始终留在此设备上。', add: '添加文件', drop: '选择文件', checking: '正在检查文件…', watermark: '水印文字', watermarkPlaceholder: '草稿', angle: '旋转角度', start: '创建 PDF', working: '正在处理…', ready: 'PDF 已生成。', reset: '重新开始', privacy: '在本地处理，无需账户、配额或上传文件。', metadataNote: '只清除标准属性字段。页面中可见的文字和其他数据不会隐藏。', limits: '每个 PDF 不超过 40 MB，每张 JPG/PNG 不超过 20 MB。不支持加密 PDF。', failure: '处理失败。请检查文件后重试。', available: '款可用工具', choose: '添加文件即可开始。', output: '创建 PDF 后即可下载。', focusLabel: '可立即使用', pdfOnly: '仅支持 PDF 文件。', imagesOnly: '仅支持 JPG 或 PNG 图片。', selectPage: '请在预览中至少选择一页。', dropHere: '将文件放在这里', dragSupported: '支持拖放' },
  ja: { tools: translatedTools.ja, title: '作業を選択', intro: '一度に使うツールは1つ。ファイルは端末内に残ります。', add: 'ファイルを追加', drop: 'ファイルを選択', checking: 'ファイルを確認中…', watermark: '透かしの文字', watermarkPlaceholder: '下書き', angle: '回転角度', start: 'PDFを作成', working: '処理中…', ready: 'PDFが完成しました。', reset: '最初からやり直す', privacy: '端末内で処理。登録、利用枠、ファイルのアップロードは不要です。', metadataNote: '標準プロパティのみを削除します。ページ内の文字や見える情報は残ります。', limits: 'PDFは1ファイル40 MBまで、JPG/PNGは1枚20 MBまで。パスワード付きPDFには対応していません。', failure: '処理できませんでした。ファイルを確認して再試行してください。', available: '種類のツール', choose: 'ファイルを追加して始めましょう。', output: 'PDFを作成してからダウンロードできます。', focusLabel: 'すぐに使えます', pdfOnly: 'PDFファイルのみ対応。', imagesOnly: 'JPGまたはPNG画像のみ対応。', selectPage: 'プレビューで1ページ以上選択してください。', dropHere: 'ここにファイルをドロップ', dragSupported: 'ドラッグ＆ドロップ対応' },
  ar: { tools: translatedTools.ar, title: 'اختر مهمة', intro: 'استخدم أداة واحدة كل مرة. تبقى ملفاتك على هذا الجهاز.', add: 'أضف ملفات', drop: 'اختر ملفاتك', checking: 'جارٍ فحص الملف…', watermark: 'نص العلامة المائية', watermarkPlaceholder: 'مسودة', angle: 'زاوية التدوير', start: 'أنشئ PDF', working: 'جارٍ المعالجة…', ready: 'ملف PDF جاهز.', reset: 'ابدأ من جديد', privacy: 'معالجة محلية دون حساب أو حصة استخدام أو رفع ملفات.', metadataNote: 'تُمسح الحقول القياسية فقط. يبقى النص والبيانات المرئية داخل الصفحات.', limits: 'حتى 40 ميغابايت لكل PDF و20 ميغابايت لكل صورة JPG/PNG. الملفات المحمية بكلمة مرور غير مدعومة.', failure: 'فشلت المعالجة. تحقق من الملف وحاول مجددًا.', available: 'أدوات متاحة', choose: 'أضف ملفًا للبدء.', output: 'أنشئ ملف PDF ثم نزّله.', focusLabel: 'جاهزة للاستخدام', pdfOnly: 'ملفات PDF فقط.', imagesOnly: 'صور JPG أو PNG فقط.', selectPage: 'اختر صفحة واحدة على الأقل في المعاينة.', dropHere: 'أفلت الملفات هنا', dragSupported: 'يدعم السحب والإفلات' },
}

export const extraFileCopy: Record<ExtraPdfLocale, { selected: string; pages: string; before: string; after: string; remove: string }> = {
  es: { selected: 'Archivos seleccionados', pages: 'páginas detectadas', before: 'Mover antes', after: 'Mover después', remove: 'Quitar' },
  de: { selected: 'Ausgewählte Dateien', pages: 'erkannte Seiten', before: 'Nach vorne verschieben', after: 'Nach hinten verschieben', remove: 'Entfernen' },
  it: { selected: 'File selezionati', pages: 'pagine rilevate', before: 'Sposta prima', after: 'Sposta dopo', remove: 'Rimuovi' },
  pt: { selected: 'Ficheiros selecionados', pages: 'páginas detetadas', before: 'Mover para antes', after: 'Mover para depois', remove: 'Remover' },
  zh: { selected: '已选文件', pages: '页已检测', before: '向前移动', after: '向后移动', remove: '移除' },
  ja: { selected: '選択したファイル', pages: 'ページを検出', before: '前に移動', after: '後ろに移動', remove: '削除' },
  ar: { selected: 'الملفات المختارة', pages: 'صفحات مكتشفة', before: 'انقل إلى الأمام', after: 'انقل إلى الخلف', remove: 'إزالة' },
}

type GridCopy = {
  title: string; original: string; extract: string; organize: string; rotate: string
  selected: string; rotateSelected: string; all: string; none: string; loading: string; error: string
  previous: string; next: string; page: string; of: string; moveLeft: string; moveRight: string
  included: string; excluded: string; rotated: string; unchanged: string
  quickTitle: string; quickLabel: string; quickPlaceholder: string; quickApply: string
  quickHelp: string; quickError: string
}

export const extraGridCopy: Record<ExtraPdfLocale, GridCopy> = {
  es: { title: 'Vista previa de páginas', original: 'Vista previa del documento original', extract: 'Todas las páginas están incluidas al principio. Pulsa las que quieras excluir.', organize: 'Arrastra las páginas para ordenarlas o usa las flechas. Pulsa una página para quitarla o recuperarla.', rotate: 'Todas las páginas están seleccionadas. Pulsa las que quieras dejar sin cambios.', selected: 'páginas conservadas', rotateSelected: 'páginas para girar', all: 'Seleccionar todo', none: 'Quitar selección', loading: 'Creando vistas previas…', error: 'No se pudieron mostrar las miniaturas. Aun así puedes procesar el PDF.', previous: 'Páginas anteriores', next: 'Páginas siguientes', page: 'Página', of: 'de', moveLeft: 'Mover antes', moveRight: 'Mover después', included: 'incluida', excluded: 'excluida', rotated: 'para girar', unchanged: 'sin cambios', quickTitle: 'Introducción rápida (opcional)', quickLabel: 'Números de página', quickPlaceholder: 'Ejemplo: 1-3, 5', quickApply: 'Aplicar a miniaturas', quickHelp: 'Sustituye la selección visual. Para reordenar, indica el nuevo orden; se quitarán las páginas omitidas.', quickError: 'Indica páginas válidas entre 1 y' },
  de: { title: 'Seitenvorschau', original: 'Vorschau des Originaldokuments', extract: 'Zunächst bleiben alle Seiten erhalten. Klicke auf Seiten, die du ausschließen möchtest.', organize: 'Ziehe Seiten in die gewünschte Reihenfolge oder nutze die Pfeile. Klicke, um Seiten zu entfernen oder wiederherzustellen.', rotate: 'Zunächst sind alle Seiten ausgewählt. Klicke auf Seiten, die unverändert bleiben sollen.', selected: 'behaltene Seiten', rotateSelected: 'zu drehende Seiten', all: 'Alle auswählen', none: 'Auswahl aufheben', loading: 'Vorschau wird erstellt…', error: 'Miniaturen konnten nicht angezeigt werden. Du kannst das PDF trotzdem verarbeiten.', previous: 'Vorherige Seiten', next: 'Nächste Seiten', page: 'Seite', of: 'von', moveLeft: 'Nach vorne verschieben', moveRight: 'Nach hinten verschieben', included: 'enthalten', excluded: 'entfernt', rotated: 'wird gedreht', unchanged: 'unverändert', quickTitle: 'Schnelleingabe (optional)', quickLabel: 'Seitenzahlen', quickPlaceholder: 'Beispiel: 1-3, 5', quickApply: 'Auf Vorschau anwenden', quickHelp: 'Ersetzt die Auswahl in der Vorschau. Gib zum Sortieren die neue Reihenfolge ein; fehlende Seiten werden entfernt.', quickError: 'Gib gültige Seiten zwischen 1 und' },
  it: { title: 'Anteprima delle pagine', original: 'Anteprima del documento originale', extract: 'All’inizio tutte le pagine sono incluse. Tocca quelle da escludere.', organize: 'Trascina le pagine per riordinarle o usa le frecce. Tocca una pagina per rimuoverla o ripristinarla.', rotate: 'All’inizio tutte le pagine sono selezionate. Tocca quelle da lasciare invariate.', selected: 'pagine conservate', rotateSelected: 'pagine da ruotare', all: 'Seleziona tutte', none: 'Deseleziona tutte', loading: 'Creazione delle anteprime…', error: 'Impossibile mostrare le miniature. Puoi comunque elaborare il PDF.', previous: 'Pagine precedenti', next: 'Pagine successive', page: 'Pagina', of: 'di', moveLeft: 'Sposta prima', moveRight: 'Sposta dopo', included: 'inclusa', excluded: 'rimossa', rotated: 'da ruotare', unchanged: 'invariata', quickTitle: 'Inserimento rapido (facoltativo)', quickLabel: 'Numeri di pagina', quickPlaceholder: 'Esempio: 1-3, 5', quickApply: 'Applica alle anteprime', quickHelp: 'Sostituisce la selezione visiva. Per riordinare, indica il nuovo ordine; le pagine omesse verranno rimosse.', quickError: 'Indica pagine valide tra 1 e' },
  pt: { title: 'Pré-visualização das páginas', original: 'Pré-visualização do documento original', extract: 'Todas as páginas começam incluídas. Toca nas que pretendes excluir.', organize: 'Arrasta as páginas para mudar a ordem ou usa as setas. Toca para remover ou repor uma página.', rotate: 'Todas as páginas começam selecionadas. Toca nas que devem ficar iguais.', selected: 'páginas mantidas', rotateSelected: 'páginas a rodar', all: 'Selecionar tudo', none: 'Limpar seleção', loading: 'A criar pré-visualizações…', error: 'Não foi possível mostrar as miniaturas. Ainda podes processar o PDF.', previous: 'Páginas anteriores', next: 'Páginas seguintes', page: 'Página', of: 'de', moveLeft: 'Mover para antes', moveRight: 'Mover para depois', included: 'incluída', excluded: 'removida', rotated: 'a rodar', unchanged: 'inalterada', quickTitle: 'Introdução rápida (opcional)', quickLabel: 'Números de página', quickPlaceholder: 'Exemplo: 1-3, 5', quickApply: 'Aplicar às miniaturas', quickHelp: 'Substitui a seleção visual. Para reordenar, indica a nova ordem; as páginas omitidas serão removidas.', quickError: 'Indica páginas válidas entre 1 e' },
  zh: { title: '页面预览', original: '原文档预览', extract: '开始时保留全部页面。点击不需要的页面即可排除。', organize: '拖动页面或使用箭头调整顺序。点击页面可移除或重新加入。', rotate: '开始时选中全部页面。点击不需要旋转的页面即可排除。', selected: '页保留', rotateSelected: '页待旋转', all: '全选', none: '清除选择', loading: '正在生成预览…', error: '无法显示缩略图，但仍可处理 PDF。', previous: '上一组页面', next: '下一组页面', page: '第', of: '/', moveLeft: '向前移动', moveRight: '向后移动', included: '已保留', excluded: '已移除', rotated: '待旋转', unchanged: '不变', quickTitle: '快速输入（可选）', quickLabel: '页码', quickPlaceholder: '例如：1-3, 5', quickApply: '应用到缩略图', quickHelp: '将替换当前可视选择。整理页面时，请按新顺序输入；未填写的页面会被移除。', quickError: '请输入 1 到以下页码之间的有效页面：' },
  ja: { title: 'ページのプレビュー', original: '元の文書のプレビュー', extract: '最初は全ページが選択されています。除外するページをタップしてください。', organize: 'ドラッグまたは矢印で順番を変更。ページをタップすると削除・復元できます。', rotate: '最初は全ページが選択されています。回転しないページをタップしてください。', selected: 'ページを保持', rotateSelected: 'ページを回転', all: 'すべて選択', none: '選択を解除', loading: 'プレビューを作成中…', error: 'サムネイルを表示できませんでした。PDFの処理は続行できます。', previous: '前のページ', next: '次のページ', page: 'ページ', of: '/', moveLeft: '前に移動', moveRight: '後ろに移動', included: '追加済み', excluded: '除外済み', rotated: '回転対象', unchanged: '変更なし', quickTitle: 'ページ番号で指定（任意）', quickLabel: 'ページ番号', quickPlaceholder: '例：1-3, 5', quickApply: 'プレビューに反映', quickHelp: '現在の選択を置き換えます。並べ替える場合は新しい順番を入力してください。省いたページは削除されます。', quickError: '1から次の番号までの有効なページを入力してください：' },
  ar: { title: 'معاينة الصفحات', original: 'معاينة المستند الأصلي', extract: 'تُحفظ كل الصفحات مبدئيًا. انقر الصفحات التي تريد استبعادها.', organize: 'اسحب الصفحات لتغيير ترتيبها أو استخدم الأسهم. انقر لإزالة صفحة أو إعادتها.', rotate: 'تُحدد كل الصفحات مبدئيًا. انقر الصفحات التي تريد تركها دون تغيير.', selected: 'صفحات محفوظة', rotateSelected: 'صفحات للتدوير', all: 'حدد الكل', none: 'ألغِ التحديد', loading: 'جارٍ إنشاء المعاينات…', error: 'تعذر عرض الصور المصغرة. لا يزال بإمكانك معالجة PDF.', previous: 'الصفحات السابقة', next: 'الصفحات التالية', page: 'الصفحة', of: 'من', moveLeft: 'انقل إلى الأمام', moveRight: 'انقل إلى الخلف', included: 'مضافة', excluded: 'مزالة', rotated: 'للتدوير', unchanged: 'دون تغيير', quickTitle: 'إدخال سريع (اختياري)', quickLabel: 'أرقام الصفحات', quickPlaceholder: 'مثال: 1-3, 5', quickApply: 'طبّق على المعاينة', quickHelp: 'يستبدل التحديد المرئي. لإعادة الترتيب، أدخل التسلسل الجديد؛ وستُزال الصفحات المحذوفة منه.', quickError: 'أدخل صفحات صالحة بين 1 و' },
}

type PdfErrorCopy = {
  pages: string; format: string; noFile: string; tooLarge: string; invalid: string
  protected: string; imageTooLarge: string; imagesOnly: string; mergeTwo: string
  angle: string; watermarkLength: string; watermarkCharset: string; pageRange: string; duplicate: string
}

export const extraPdfErrors: Record<ExtraPdfLocale, PdfErrorCopy> = {
  es: { pages: 'Indica al menos una página.', format: 'Usa números como 1-3, 5, 8.', noFile: 'Añade un archivo para empezar.', tooLarge: 'Este PDF supera los 40 MB. Usa uno más pequeño.', invalid: 'El archivo no parece ser un PDF válido.', protected: 'No se puede abrir el PDF. Puede estar protegido o dañado.', imageTooLarge: 'Cada imagen debe ocupar menos de 20 MB.', imagesOnly: 'Usa solo imágenes JPG o PNG.', mergeTwo: 'Añade al menos dos PDF para fusionarlos.', angle: 'Elige una rotación de 90°, 180° o 270°.', watermarkLength: 'Escribe entre 1 y 60 caracteres.', watermarkCharset: 'Hay caracteres no admitidos. Usa texto latino sencillo.', pageRange: 'Elige páginas entre 1 y', duplicate: 'Esta página aparece dos veces:' },
  de: { pages: 'Gib mindestens eine Seite an.', format: 'Nutze Seitenzahlen wie 1-3, 5, 8.', noFile: 'Füge zuerst eine Datei hinzu.', tooLarge: 'Dieses PDF ist größer als 40 MB. Versuche eine kleinere Datei.', invalid: 'Diese Datei scheint kein gültiges PDF zu sein.', protected: 'Das PDF lässt sich nicht öffnen. Es könnte geschützt oder beschädigt sein.', imageTooLarge: 'Jedes Bild muss kleiner als 20 MB sein.', imagesOnly: 'Verwende nur JPG- oder PNG-Bilder.', mergeTwo: 'Füge mindestens zwei PDFs zum Zusammenfügen hinzu.', angle: 'Wähle eine Drehung um 90°, 180° oder 270°.', watermarkLength: 'Gib 1 bis 60 Zeichen ein.', watermarkCharset: 'Einige Zeichen werden nicht unterstützt. Verwende einfachen lateinischen Text.', pageRange: 'Wähle Seiten zwischen 1 und', duplicate: 'Diese Seite wurde zweimal ausgewählt:' },
  it: { pages: 'Indica almeno una pagina.', format: 'Usa numeri come 1-3, 5, 8.', noFile: 'Aggiungi un file per iniziare.', tooLarge: 'Questo PDF supera 40 MB. Prova con un file più piccolo.', invalid: 'Il file non sembra un PDF valido.', protected: 'Impossibile aprire il PDF. Potrebbe essere protetto o danneggiato.', imageTooLarge: 'Ogni immagine deve essere inferiore a 20 MB.', imagesOnly: 'Usa solo immagini JPG o PNG.', mergeTwo: 'Aggiungi almeno due PDF da unire.', angle: 'Scegli una rotazione di 90°, 180° o 270°.', watermarkLength: 'Inserisci da 1 a 60 caratteri.', watermarkCharset: 'Alcuni caratteri non sono supportati. Usa testo latino semplice.', pageRange: 'Scegli pagine tra 1 e', duplicate: 'Questa pagina compare due volte:' },
  pt: { pages: 'Indica pelo menos uma página.', format: 'Usa números como 1-3, 5, 8.', noFile: 'Adiciona um ficheiro para começar.', tooLarge: 'Este PDF excede 40 MB. Experimenta um ficheiro mais pequeno.', invalid: 'O ficheiro não parece ser um PDF válido.', protected: 'Não é possível abrir o PDF. Pode estar protegido ou danificado.', imageTooLarge: 'Cada imagem deve ter menos de 20 MB.', imagesOnly: 'Usa apenas imagens JPG ou PNG.', mergeTwo: 'Adiciona pelo menos dois PDF para juntar.', angle: 'Escolhe uma rotação de 90°, 180° ou 270°.', watermarkLength: 'Escreve entre 1 e 60 caracteres.', watermarkCharset: 'Há caracteres não suportados. Usa texto latino simples.', pageRange: 'Escolhe páginas entre 1 e', duplicate: 'Esta página foi escolhida duas vezes:' },
  zh: { pages: '请至少指定一页。', format: '请按 1-3, 5, 8 这样的格式输入页码。', noFile: '请先添加文件。', tooLarge: 'PDF 超过 40 MB。请使用较小的文件。', invalid: '此文件似乎不是有效的 PDF。', protected: '无法打开 PDF；文件可能受密码保护或已损坏。', imageTooLarge: '每张图片必须小于 20 MB。', imagesOnly: '仅支持 JPG 或 PNG 图片。', mergeTwo: '请至少添加两个 PDF 进行合并。', angle: '请选择 90°、180° 或 270°。', watermarkLength: '请输入 1 至 60 个字符。', watermarkCharset: '包含不支持的字符。请使用简单的拉丁字母。', pageRange: '请选择 1 至以下页码之间的页面：', duplicate: '这一页重复出现：' },
  ja: { pages: '1ページ以上指定してください。', format: '1-3, 5, 8 のようにページを入力してください。', noFile: '最初にファイルを追加してください。', tooLarge: 'PDFが40 MBを超えています。小さいファイルを選んでください。', invalid: '有効なPDFファイルではないようです。', protected: 'PDFを開けません。パスワード付きか、破損している可能性があります。', imageTooLarge: '画像は1枚20 MB未満にしてください。', imagesOnly: 'JPGまたはPNG画像のみ使用できます。', mergeTwo: '結合するPDFを2つ以上追加してください。', angle: '90°、180°、270°から選んでください。', watermarkLength: '1～60文字で入力してください。', watermarkCharset: '対応していない文字があります。簡単なラテン文字を使ってください。', pageRange: '1から次の番号までのページを選んでください：', duplicate: 'このページが重複しています：' },
  ar: { pages: 'حدد صفحة واحدة على الأقل.', format: 'استخدم أرقامًا مثل 1-3, 5, 8.', noFile: 'أضف ملفًا للبدء.', tooLarge: 'يتجاوز هذا الملف 40 ميغابايت. اختر ملف PDF أصغر.', invalid: 'لا يبدو أن الملف PDF صالح.', protected: 'تعذر فتح PDF. قد يكون محميًا بكلمة مرور أو تالفًا.', imageTooLarge: 'يجب ألا يتجاوز حجم كل صورة 20 ميغابايت.', imagesOnly: 'استخدم صور JPG أو PNG فقط.', mergeTwo: 'أضف ملفي PDF على الأقل للدمج.', angle: 'اختر تدويرًا بمقدار 90° أو 180° أو 270°.', watermarkLength: 'أدخل نصًا من 1 إلى 60 حرفًا.', watermarkCharset: 'بعض الأحرف غير مدعومة. استخدم نصًا لاتينيًا بسيطًا.', pageRange: 'اختر صفحات بين 1 و', duplicate: 'تكررت هذه الصفحة:' },
}
