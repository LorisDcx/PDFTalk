'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, FileText, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'
import { useToast } from './ui/use-toast'
import { useLanguage } from '@/lib/i18n'
import { savePendingDocument } from '@/lib/pending-document'
import { useAuth } from '@/components/auth-provider'
import type { StudyPdfLocale } from '@/lib/study-pdf-locales'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

const uploadCopy: Record<StudyPdfLocale, { drop: string; chooseHint: string; choose: string; limit: string; preparing: string; prepare: string; added: string; signup: string }> = {
  fr: { drop: 'Glisse ton PDF ici', chooseHint: 'ou choisis un fichier sur ton appareil', choose: 'Choisir un PDF', limit: 'PDF avec texte sélectionnable', preparing: 'Préparation du PDF…', prepare: 'Préparer ma révision', added: 'Le document sera ajouté à ton espace.', signup: 'Crée ton compte pour lancer l’analyse.' },
  en: { drop: 'Drop your PDF here', chooseHint: 'or choose a file from your device', choose: 'Choose a PDF', limit: 'PDF with selectable text', preparing: 'Preparing your PDF…', prepare: 'Prepare my study session', added: 'The document will be added to your workspace.', signup: 'Create an account to start the analysis.' },
  es: { drop: 'Arrastra tu PDF aquí', chooseHint: 'o elige un archivo de tu dispositivo', choose: 'Elegir un PDF', limit: 'PDF con texto seleccionable', preparing: 'Preparando el PDF…', prepare: 'Preparar mi repaso', added: 'El documento se añadirá a tu espacio.', signup: 'Crea una cuenta para iniciar el análisis.' },
  de: { drop: 'Zieh dein PDF hierher', chooseHint: 'oder wähle eine Datei auf deinem Gerät', choose: 'PDF auswählen', limit: 'PDF mit auswählbarem Text', preparing: 'PDF wird vorbereitet…', prepare: 'Lerneinheit vorbereiten', added: 'Das Dokument wird deinem Bereich hinzugefügt.', signup: 'Erstelle ein Konto, um die Analyse zu starten.' },
  it: { drop: 'Trascina qui il tuo PDF', chooseHint: 'oppure scegli un file dal dispositivo', choose: 'Scegli un PDF', limit: 'PDF con testo selezionabile', preparing: 'Preparazione del PDF…', prepare: 'Prepara il ripasso', added: 'Il documento verrà aggiunto al tuo spazio.', signup: 'Crea un account per avviare l’analisi.' },
  pt: { drop: 'Arrasta o teu PDF para aqui', chooseHint: 'ou escolhe um ficheiro do dispositivo', choose: 'Escolher PDF', limit: 'PDF com texto selecionável', preparing: 'A preparar o PDF…', prepare: 'Preparar o estudo', added: 'O documento será adicionado ao teu espaço.', signup: 'Cria uma conta para iniciar a análise.' },
  zh: { drop: '将 PDF 拖到这里', chooseHint: '或从设备中选择文件', choose: '选择 PDF', limit: '包含可选文字的 PDF', preparing: '正在准备 PDF…', prepare: '开始准备复习', added: '文档将添加到你的学习空间。', signup: '创建账户后即可开始分析。' },
  ja: { drop: 'PDFをここにドロップ', chooseHint: 'または端末からファイルを選択', choose: 'PDFを選択', limit: '文字を選択できるPDF', preparing: 'PDFを準備中…', prepare: '学習の準備を始める', added: '文書を学習スペースに追加します。', signup: '分析を始めるにはアカウントを作成してください。' },
  ar: { drop: 'اسحب ملف PDF إلى هنا', chooseHint: 'أو اختر ملفًا من جهازك', choose: 'اختر ملف PDF', limit: 'ملف PDF بنص قابل للتحديد', preparing: 'جارٍ تجهيز الملف…', prepare: 'جهّز مراجعتي', added: 'سيُضاف المستند إلى مساحة دراستك.', signup: 'أنشئ حسابًا لبدء التحليل.' },
}

export function DemoUpload({ locale = 'fr' }: { locale?: StudyPdfLocale }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const { user } = useAuth()
  const copy = uploadCopy[locale]

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      toast({
        title: t('invalidFile'),
        description: error.code === 'file-too-large' 
          ? t('fileTooLarge').replace('{size}', formatFileSize(MAX_SIZE))
          : t('onlyPdfAccepted'),
        variant: 'destructive',
      })
      return
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [toast, t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
    multiple: false,
    disabled: isPreparing,
  })

  const handleAnalyze = async () => {
    if (!selectedFile || isPreparing) return
    setIsPreparing(true)
    
    // Store file info in sessionStorage for after signup
    const fileInfo = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
    }
    try {
      await savePendingDocument(selectedFile)
      sessionStorage.setItem('pendingDocument', JSON.stringify(fileInfo))
      if (user) {
        sessionStorage.setItem('processPendingDocument', 'true')
        router.push('/dashboard')
      } else {
        router.push('/signup?demo=true')
      }
    } catch {
      toast({ title: t('uploadError'), description: t('unexpectedError'), variant: 'destructive' })
    } finally {
      setIsPreparing(false)
    }
  }

  const clearFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="w-full">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={`group flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-5 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b84432] sm:min-h-52 sm:py-7 ${isDragActive ? 'border-[#b45438] bg-[#fff3ec]' : 'border-[#e7cfc2] bg-[#fffaf7] hover:border-[#b84432] hover:bg-[#fff4ed]'}`}
        >
          <input {...getInputProps({ 'aria-label': copy.choose })} />
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[#ffe0d1] text-[#ae4731] sm:mb-4 sm:size-14">
            <Upload className="size-5 sm:size-6" />
          </div>
          <p className="font-editorial text-2xl tracking-tight text-[#352837] sm:text-3xl">
            {copy.drop}
          </p>
          <p className="mt-1 text-base text-[#776c78]">
            {copy.chooseHint}
          </p>
          <span className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#b84432] px-5 py-3 text-sm font-bold text-white transition group-hover:bg-[#963326] sm:mt-5">
            <FileText className="size-4" />{copy.choose}
          </span>
          <p className="mt-3 text-sm font-medium text-[#786e77]">
            {copy.limit} · ≤ {formatFileSize(MAX_SIZE)}
          </p>
        </div>
      ) : (
        <div className="rounded-[1.3rem] border border-[#e6dbe3] bg-[#fcf9fb] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl bg-[#ffe0d1] text-[#ae4731]">
              <FileText className="size-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-[#352837]">{selectedFile.name}</p>
              <p className="text-sm text-[#776c78]">{formatFileSize(selectedFile.size)}</p>
            </div>
            <button type="button" onClick={clearFile} disabled={isPreparing} className="min-h-11 text-sm font-semibold text-[#776c78] underline-offset-4 hover:text-[#b84432] hover:underline disabled:opacity-50">
              {t('change')}
            </button>
          </div>
          <button type="button" onClick={handleAnalyze} disabled={isPreparing} className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#b84432] px-5 py-3.5 font-bold text-white transition hover:bg-[#963326] disabled:opacity-60">
            {isPreparing ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />} {isPreparing ? copy.preparing : copy.prepare}
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-center text-xs text-[#776c78]">
            {user ? copy.added : copy.signup}
          </p>
        </div>
      )}
    </div>
  )
}
