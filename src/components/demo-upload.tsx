'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, FileText, ArrowRight, Sparkles } from 'lucide-react'
import { formatFileSize } from '@/lib/utils'
import { useToast } from './ui/use-toast'
import { useLanguage } from '@/lib/i18n'
import { savePendingDocument } from '@/lib/pending-document'
import { useAuth } from '@/components/auth-provider'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export function DemoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
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
  })

  const handleAnalyze = async () => {
    if (!selectedFile) return
    
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
          className={`group flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-[1.1rem] border-2 border-dashed px-6 py-8 text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b84432] ${isDragActive ? 'border-[#b45438] bg-[#fff3ec]' : 'border-[#e7cfc2] bg-[#fffaf7] hover:border-[#b84432] hover:bg-[#fff4ed]'}`}
        >
          <input {...getInputProps()} />
          <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-[#ffe0d1] text-[#ae4731] transition group-hover:scale-105">
            <Upload className="size-7" />
          </div>
          <p className="font-editorial text-3xl tracking-tight text-[#352837]">
            {isDragActive ? t('dropPdfHere') : 'Glisse ton PDF ici'}
          </p>
          <p className="mt-2 text-sm text-[#776c78]">
            ou choisis un fichier sur ton appareil
          </p>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#b84432] px-5 py-3 text-sm font-bold text-white transition group-hover:bg-[#963326]">
            <FileText className="size-4" />Choisir un PDF
          </span>
          <p className="mt-5 text-xs font-medium text-[#8e8390]">
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
            <button type="button" onClick={clearFile} className="text-sm font-semibold text-[#776c78] underline-offset-4 hover:text-[#b84432] hover:underline">
              {t('change')}
            </button>
          </div>
          <button type="button" onClick={handleAnalyze} className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#b84432] px-5 py-3.5 font-bold text-white transition hover:bg-[#963326]">
            <Sparkles className="size-5" /> Préparer ma révision
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
