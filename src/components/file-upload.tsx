'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { cn, formatFileSize } from '@/lib/utils'
import { useToast } from './ui/use-toast'

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>
  maxSize?: number // in bytes
  disabled?: boolean
}

export function FileUpload({ onUpload, maxSize = 20 * 1024 * 1024, disabled }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0]
      toast({
        title: 'Invalid file',
        description: error.code === 'file-too-large' 
          ? `File must be smaller than ${formatFileSize(maxSize)}` 
          : error.message,
        variant: 'destructive',
      })
      return
    }

    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0])
    }
  }, [maxSize, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxSize,
    multiple: false,
    disabled: disabled || isUploading,
  })

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      await onUpload(selectedFile)
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
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
          className={cn(
            'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-300 cursor-pointer group',
            isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5',
            (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input {...getInputProps()} />
          <div className={cn(
            "transition-transform duration-300",
            isDragActive ? "scale-110 -translate-y-2" : "group-hover:scale-105"
          )}>
            <Upload className="h-12 w-12 text-muted-foreground mb-4 mx-auto" />
          </div>
          <p className="text-lg font-medium mb-1">
            {isDragActive ? 'Déposez votre PDF ici' : 'Glissez-déposez votre PDF ici'}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            ou cliquez pour parcourir (max {formatFileSize(maxSize)})
          </p>
          <Button variant="outline" disabled={disabled || isUploading} className="btn-press">
            Sélectionner un PDF
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border p-6 animate-scale-in">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 animate-pulse-soft">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={clearFile} disabled={isUploading} className="hover:bg-destructive/10 hover:text-destructive transition-colors">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 flex gap-2">
            <Button onClick={handleUpload} disabled={isUploading} className="flex-1 btn-press">
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                'Analyser le document'
              )}
            </Button>
            <Button variant="outline" onClick={clearFile} disabled={isUploading} className="btn-press">
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
