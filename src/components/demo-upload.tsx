'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { cn, formatFileSize } from '@/lib/utils'
import { useToast } from './ui/use-toast'
import { useLanguage } from '@/lib/i18n'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export function DemoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useLanguage()

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
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
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
  })

  const handleAnalyze = () => {
    if (!selectedFile) return
    
    // Store file info in sessionStorage for after signup
    const fileInfo = {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
      lastModified: selectedFile.lastModified,
    }
    sessionStorage.setItem('pendingDocument', JSON.stringify(fileInfo))
    
    // Store the actual file data
    const reader = new FileReader()
    reader.onload = () => {
      sessionStorage.setItem('pendingDocumentData', reader.result as string)
      router.push('/signup?demo=true')
    }
    reader.readAsDataURL(selectedFile)
  }

  const clearFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="w-full max-w-xl mx-auto animate-fade-in-up stagger-2">
      {!selectedFile ? (
        <div
          {...getRootProps()}
          className={cn(
            'relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all duration-300 cursor-pointer group',
            'bg-background/50 backdrop-blur-sm',
            isDragActive || isDragging
              ? 'border-primary bg-primary/5 scale-[1.02] shadow-xl shadow-primary/10' 
              : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg'
          )}
        >
          <input {...getInputProps()} />
          
          {/* Animated background gradient */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className={cn(
            "relative z-10 transition-all duration-300",
            isDragActive ? "scale-110 -translate-y-2" : "group-hover:scale-105"
          )}>
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <p className="text-lg font-semibold mb-1 relative z-10">
            {isDragActive ? `🎯 ${t('dropPdfHere')}` : t('tryForFree')}
          </p>
          <p className="text-sm text-muted-foreground mb-4 relative z-10">
            {t('dragOrClickToSelect')}
          </p>
          
          <Button variant="outline" size="sm" className="relative z-10">
            <FileText className="mr-2 h-4 w-4" />
            {t('selectPdf')}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-3 relative z-10">
            Max {formatFileSize(MAX_SIZE)} • {t('dataStaysPrivate')}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-background/50 backdrop-blur-sm p-6 animate-scale-in shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <FileText className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearFile} className="text-muted-foreground hover:text-destructive">
              {t('change')}
            </Button>
          </div>
          
          <Button onClick={handleAnalyze} size="lg" className="w-full group">
            <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
            {t('analyzeMyDocument')}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-3">
            {t('createFreeAccountToSeeResults')}
          </p>
        </div>
      )}
    </div>
  )
}
