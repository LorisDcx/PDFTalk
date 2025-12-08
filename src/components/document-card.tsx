'use client'

import Link from 'next/link'
import { FileText, Clock, File, Trash2 } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { formatDate } from '@/lib/utils'
import type { Document } from '@/types/database'

interface DocumentCardProps {
  document: Document
  summaryPreview?: string
  onDelete?: (id: string) => void
}

export function DocumentCard({ document, summaryPreview, onDelete }: DocumentCardProps) {
  const getStatusBadge = () => {
    switch (document.status) {
      case 'processing':
        return <Badge variant="warning">Processing</Badge>
      case 'completed':
        return <Badge variant="success">Ready</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return null
    }
  }

  const getDocumentTypeIcon = () => {
    return <FileText className="h-5 w-5" />
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onDelete) {
      onDelete(document.id)
    }
  }

  return (
    <Card className="card-hover cursor-pointer group relative">
      <Link href={`/documents/${document.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              {getDocumentTypeIcon()}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-medium truncate group-hover:text-primary transition-colors">{document.file_name}</h3>
                {getStatusBadge()}
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <File className="h-3.5 w-3.5" />
                  {document.pages_count} pages
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(document.created_at)}
                </span>
              </div>
              {summaryPreview && document.status === 'completed' && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {summaryPreview}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </Card>
  )
}
