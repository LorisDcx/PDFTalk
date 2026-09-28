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

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export function DemoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isPreparing, setIsPreparing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()
  const { user } = useAuth()

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
          <input {...getInputProps()} />
          <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-[#ffe0d1] text-[#ae4731] sm:mb-4 sm:size-14">
            <Upload className="size-5 sm:size-6" />
          </div>
          <p className="font-editorial text-2xl tracking-tight text-[#352837] sm:text-3xl">
            {isDragActive ? t('dropPdfHere') : 'Glisse ton PDF ici'}
          </p>
          <p className="mt-1 text-base text-[#776c78]">
            ou choisis un fichier sur ton appareil
          </p>
          <span className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#b84432] px-5 py-3 text-sm font-bold text-white transition group-hover:bg-[#963326] sm:mt-5">
            <FileText className="size-4" />Choisir un PDF
          </span>
          <p className="mt-3 text-sm font-medium text-[#786e77]">
            PDF avec texte sélectionnable · {formatFileSize(MAX_SIZE)} max
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
            {isPreparing ? <Loader2 className="size-5 animate-spin" /> : <Sparkles className="size-5" />} {isPreparing ? 'Préparation du PDF…' : 'Préparer ma révision'}
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </button>
          <p className="mt-4 text-center text-xs text-[#776c78]">
            {user ? 'Le document sera ajouté à ton espace.' : 'Crée ton compte pour lancer l’analyse.'}
          </p>
        </div>
      )}
    </div>
  )
}
