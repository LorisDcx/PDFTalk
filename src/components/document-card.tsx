'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, FileText, Loader2, Trash2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import type { Document } from '@/types/database'

interface DocumentCardProps {
  document: Document
  summaryPreview?: string
  onDelete?: (id: string) => void
}

const cardLabels = {
  fr: { processing: 'En cours', completed: 'Prêt', failed: 'Échec', pages: 'pages', delete: 'Supprimer le document' },
  en: { processing: 'Processing', completed: 'Ready', failed: 'Failed', pages: 'pages', delete: 'Delete document' },
  es: { processing: 'En curso', completed: 'Listo', failed: 'Error', pages: 'páginas', delete: 'Eliminar documento' },
  de: { processing: 'In Bearbeitung', completed: 'Bereit', failed: 'Fehler', pages: 'Seiten', delete: 'Dokument löschen' },
  it: { processing: 'In corso', completed: 'Pronto', failed: 'Errore', pages: 'pagine', delete: 'Elimina documento' },
  pt: { processing: 'Em curso', completed: 'Pronto', failed: 'Erro', pages: 'páginas', delete: 'Excluir documento' },
  zh: { processing: '处理中', completed: '已就绪', failed: '失败', pages: '页', delete: '删除文档' },
  ja: { processing: '処理中', completed: '準備完了', failed: '失敗', pages: 'ページ', delete: '文書を削除' },
  ar: { processing: 'قيد المعالجة', completed: 'جاهز', failed: 'فشل', pages: 'صفحات', delete: 'حذف المستند' },
} as const

export function DocumentCard({ document, summaryPreview, onDelete }: DocumentCardProps) {
  const { language } = useLanguage()
  const labels = cardLabels[language]
  const status = document.status
  const StatusIcon = status === 'completed' ? CheckCircle2 : status === 'failed' ? AlertTriangle : Loader2
  const statusClasses = status === 'completed'
    ? 'bg-[#eff5f0] text-[#407255]'
    : status === 'failed'
      ? 'bg-[#fff0ed] text-[#a44d48]'
      : 'bg-[#fbf1e6] text-[#9a6a33]'
  const date = new Intl.DateTimeFormat(language, { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(document.created_at))
  const pageCount = new Intl.NumberFormat(language).format(document.pages_count)

  return (
    <article className="group relative flex h-full min-h-[194px] flex-col rounded-[24px] border border-[#e9e0e5] bg-white p-5 text-[#33252b] shadow-[0_10px_40px_-32px_rgba(43,34,48,0.4)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#c9b6c4] hover:shadow-[0_24px_48px_-34px_rgba(43,34,48,0.45)] sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f4ebf1] text-[#b84432]" aria-hidden="true">
          <FileText className="size-5" strokeWidth={1.7} />
        </span>
        <span className={`mr-8 inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses}`}>
          <StatusIcon className={`size-3.5 ${status === 'processing' ? 'animate-spin' : ''}`} aria-hidden="true" />
          {labels[status]}
        </span>
      </div>

      <Link href={`/documents/${document.id}`} className="flex flex-1 flex-col rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-4">
        <h3 className="line-clamp-2 pr-4 text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-[#b84432]">{document.file_name}</h3>
        {summaryPreview && status === 'completed' && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[#766b75]">{summaryPreview}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-[#807480]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{pageCount} {labels.pages}</span>
            <span className="inline-flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" />{date}</span>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-[#b84432] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </div>
      </Link>

      {onDelete && (
        <button
          type="button"
          onClick={() => onDelete(document.id)}
          aria-label={`${labels.delete}: ${document.file_name}`}
          className="absolute right-5 top-5 inline-flex size-8 items-center justify-center rounded-full text-[#968995] transition-colors hover:bg-[#fff0ed] hover:text-[#a44d48] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      )}
    </article>
  )
}
