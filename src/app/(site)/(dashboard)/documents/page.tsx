'use client'

import { useDeferredValue, useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, FileText, Loader2, Search, UploadCloud, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { DocumentCard } from '@/components/document-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import type { Document } from '@/types/database'

const PAGE_SIZE = 18

const libraryLabels = {
  fr: { search: 'Rechercher un document', noResults: 'Aucun document trouvé', clear: 'Effacer la recherche', previous: 'Page précédente', next: 'Page suivante', page: 'Page' },
  en: { search: 'Search documents', noResults: 'No documents found', clear: 'Clear search', previous: 'Previous page', next: 'Next page', page: 'Page' },
  es: { search: 'Buscar documentos', noResults: 'No se encontraron documentos', clear: 'Borrar búsqueda', previous: 'Página anterior', next: 'Página siguiente', page: 'Página' },
  de: { search: 'Dokumente suchen', noResults: 'Keine Dokumente gefunden', clear: 'Suche löschen', previous: 'Vorherige Seite', next: 'Nächste Seite', page: 'Seite' },
  it: { search: 'Cerca documenti', noResults: 'Nessun documento trovato', clear: 'Cancella ricerca', previous: 'Pagina precedente', next: 'Pagina successiva', page: 'Pagina' },
  pt: { search: 'Buscar documentos', noResults: 'Nenhum documento encontrado', clear: 'Limpar busca', previous: 'Página anterior', next: 'Próxima página', page: 'Página' },
  zh: { search: '搜索文档', noResults: '未找到文档', clear: '清除搜索', previous: '上一页', next: '下一页', page: '第' },
  ja: { search: '文書を検索', noResults: '文書が見つかりません', clear: '検索をクリア', previous: '前のページ', next: '次のページ', page: 'ページ' },
  ar: { search: 'البحث في المستندات', noResults: 'لم يتم العثور على مستندات', clear: 'مسح البحث', previous: 'الصفحة السابقة', next: 'الصفحة التالية', page: 'صفحة' },
} as const

export default function DocumentsPage() {
  const { user, isLoading: authLoading } = useAuth()
  const { language, t } = useLanguage()
  const labels = libraryLabels[language]
  const { toast } = useToast()
  const [supabase] = useState(() => createClient())
  const [documents, setDocuments] = useState<Document[]>([])
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    let request = supabase.from('documents').select('*').eq('user_id', user.id)
    if (deferredQuery.trim()) request = request.ilike('file_name', `%${deferredQuery.trim()}%`)
    request.order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          toast({ title: t('uploadError'), description: error.message, variant: 'destructive' })
        } else {
          setDocuments(data?.slice(0, PAGE_SIZE) || [])
          setHasMore((data?.length || 0) > PAGE_SIZE)
        }
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [user, page, deferredQuery, supabase, toast, t])

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return
    const doc = documents.find(item => item.id === id)
    if (!doc) return
    const { error } = await supabase.from('documents').delete().eq('id', id).eq('user_id', user!.id)
    if (error) {
      toast({ title: t('uploadError'), description: error.message, variant: 'destructive' })
      return
    }
    if (doc.file_path) await supabase.storage.from('documents').remove([doc.file_path])
    setDocuments(items => items.filter(item => item.id !== id))
    toast({ title: t('documentDeleted') })
  }

  if (authLoading || !user) return <div className="flex min-h-[50vh] items-center justify-center bg-[#faf7f5]"><Loader2 className="h-7 w-7 animate-spin text-[#b84432]" aria-label={t('myDocuments')} /></div>

  return (
    <div className="min-h-screen bg-[#faf7f5] px-4 pb-20 pt-9 text-[#33252b] sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#bc6b50]">{t('documents')}</p>
            <h1 className="font-editorial text-4xl leading-[1.08] tracking-tight sm:text-5xl">{t('myDocuments')}</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#756a74] sm:text-base">{t('analyzeDocuments')}</p>
          </div>
          <Link href="/dashboard#upload-panel" className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#b84432] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#512b46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-2">
            <UploadCloud className="size-4" aria-hidden="true" />{t('uploadDocument')}
          </Link>
        </header>

        <div className="mt-9 rounded-[28px] border border-[#e9e0e5] bg-white p-4 shadow-[0_24px_60px_-50px_rgba(43,34,48,0.4)] sm:p-6">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[#9a8796]" aria-hidden="true" />
            <Input
              type="search"
              aria-label={labels.search}
              value={query}
              onChange={event => { setLoading(true); setQuery(event.target.value); setPage(0) }}
              placeholder={labels.search}
              className="h-12 rounded-2xl border-[#e6dce3] bg-[#fcfafb] pl-11 pr-11 text-[#33252b] placeholder:text-[#9a8c98] focus-visible:ring-[#b84432]"
            />
            {query && (
              <button type="button" aria-label={labels.clear} onClick={() => { setLoading(true); setQuery(''); setPage(0) }} className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-[#877786] hover:bg-[#f2e8ef] hover:text-[#b84432] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432]">
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        <section aria-label={t('myDocuments')} aria-live="polite" className="mt-7">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-[194px] rounded-[24px]" />)}
            </div>
          ) : documents.length ? (
            <div className="grid gap-4 md:grid-cols-2">{documents.map(doc => <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />)}</div>
          ) : (
            <div className="flex flex-col items-center rounded-[28px] border border-dashed border-[#e3cbbf] bg-white px-5 py-16 text-center">
              <span className="mb-5 flex size-16 items-center justify-center rounded-[22px] bg-[#f3eaf0] text-[#b84432]"><FileText className="size-7" strokeWidth={1.5} aria-hidden="true" /></span>
              <h2 className="font-editorial text-2xl">{query ? labels.noResults : t('noDocuments')}</h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#786d77]">{query ? labels.search : t('uploadFirstPdf')}</p>
              {query ? (
                <Button variant="outline" onClick={() => { setLoading(true); setQuery(''); setPage(0) }} className="mt-5 rounded-full border-[#e3cbbf] text-[#b84432]">{labels.clear}</Button>
              ) : (
                <Link href="/dashboard#upload-panel" className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#b84432] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#512b46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b84432] focus-visible:ring-offset-2">
                  {t('uploadDocument')} <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          )}
        </section>

        {(page > 0 || hasMore) && (
          <nav aria-label={t('myDocuments')} className="mt-9 flex items-center justify-center gap-4">
            <Button variant="outline" size="icon" aria-label={labels.previous} disabled={page === 0 || loading} onClick={() => { setLoading(true); setPage(page - 1) }} className="size-10 rounded-full border-[#e7d3c8] bg-white text-[#b84432]"><ArrowLeft className="size-4" aria-hidden="true" /></Button>
            <span className="text-sm font-medium text-[#766b75]">{labels.page} {new Intl.NumberFormat(language).format(page + 1)}</span>
            <Button variant="outline" size="icon" aria-label={labels.next} disabled={!hasMore || loading} onClick={() => { setLoading(true); setPage(page + 1) }} className="size-10 rounded-full border-[#e7d3c8] bg-white text-[#b84432]"><ArrowRight className="size-4" aria-hidden="true" /></Button>
          </nav>
        )}
      </div>
    </div>
  )
}
