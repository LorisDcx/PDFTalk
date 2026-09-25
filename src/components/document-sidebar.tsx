'use client'

import { useCallback, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/components/auth-provider'
import { useLanguage } from '@/lib/i18n'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { FileText, FolderPlus, ChevronRight, ChevronDown, MoreHorizontal, Pencil, Trash2, Loader2, Search, GraduationCap, Target, Presentation, Sparkles, FileCheck, Folder } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DocumentItem {
  id: string
  file_name: string
  created_at: string
  pages_count: number
  status: string
  folder_id?: string | null
  flashcardsCount: number
  quizSessionsCount: number
  slidesCount: number
}

interface FolderItem {
  id: string
  name: string
  color: string
  created_at: string
}

const FOLDER_COLORS = [
  { name: 'Prune', value: '#a84431' },
  { name: 'Sauge', value: '#66856d' },
  { name: 'Terracotta', value: '#bb7866' },
  { name: 'Bleu', value: '#658296' },
  { name: 'Miel', value: '#c29a5f' },
  { name: 'Violet', value: '#8b739e' },
]

interface DocumentSidebarProps {
  currentDocumentId: string
  onSelect?: () => void
}

export function DocumentSidebar({ currentDocumentId, onSelect }: DocumentSidebarProps) {
  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.id
  const [supabase] = useState(() => createClient())
  const { t } = useLanguage()
  const { toast } = useToast()
  
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [expandedDocs, setExpandedDocs] = useState<Set<string>>(new Set([currentDocumentId]))
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0].value)
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null)
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const { data: docs } = await supabase
        .from('documents')
        .select('id, file_name, created_at, pages_count, status')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })

      if (docs) {
        const enrichedDocs: DocumentItem[] = docs.map(doc => {
          const flashcards = localStorage.getItem(`flashcards-${doc.id}`)
          const flashcardsCount = flashcards ? JSON.parse(flashcards).length : 0
          const quizSessions = localStorage.getItem(`quiz-sessions-${doc.id}`)
          const quizSessionsCount = quizSessions ? JSON.parse(quizSessions).length : 0
          const slides = localStorage.getItem(`slides-${doc.id}`)
          const slidesData = slides ? JSON.parse(slides) : null
          const slidesCount = slidesData?.slides?.length || 0
          const assignments = localStorage.getItem(`doc-folders-${userId}`)
          const folderAssignments = assignments ? JSON.parse(assignments) : {}
          return { ...doc, flashcardsCount, quizSessionsCount, slidesCount, folder_id: folderAssignments[doc.id] || null }
        })
        setDocuments(enrichedDocs)
      }
      const storedFolders = localStorage.getItem(`folders-${userId}`)
      if (storedFolders) setFolders(JSON.parse(storedFolders))
    } catch (error) {
      console.error('Error loading sidebar data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase, userId])

  const saveFolders = (newFolders: FolderItem[]) => {
    setFolders(newFolders)
    localStorage.setItem(`folders-${user!.id}`, JSON.stringify(newFolders))
  }

  const saveDocumentAssignments = (docs: DocumentItem[]) => {
    const assignments: Record<string, string> = {}
    docs.forEach(doc => { if (doc.folder_id) assignments[doc.id] = doc.folder_id })
    localStorage.setItem(`doc-folders-${user!.id}`, JSON.stringify(assignments))
  }

  const createFolder = () => {
    if (!newFolderName.trim()) return
    const newFolder: FolderItem = { id: `folder-${Date.now()}`, name: newFolderName.trim(), color: newFolderColor, created_at: new Date().toISOString() }
    saveFolders([...folders, newFolder])
    setNewFolderName('')
    setNewFolderColor(FOLDER_COLORS[0].value)
    setIsCreateFolderOpen(false)
  }

  const updateFolder = () => {
    if (!editingFolder || !newFolderName.trim()) return
    const updated = folders.map(f => f.id === editingFolder.id ? { ...f, name: newFolderName.trim(), color: newFolderColor } : f)
    saveFolders(updated)
    setEditingFolder(null)
    setNewFolderName('')
  }

  const deleteFolder = (folderId: string) => {
    saveFolders(folders.filter(f => f.id !== folderId))
    const updatedDocs = documents.map(doc => doc.folder_id === folderId ? { ...doc, folder_id: null } : doc)
    setDocuments(updatedDocs)
    saveDocumentAssignments(updatedDocs)
  }

  const assignDocumentToFolder = (docId: string, folderId: string | null) => {
    const updatedDocs = documents.map(doc => doc.id === docId ? { ...doc, folder_id: folderId } : doc)
    setDocuments(updatedDocs)
    saveDocumentAssignments(updatedDocs)
  }

  const deleteDocument = async (docId: string) => {
    if (!confirm(t('confirmDelete'))) return
    
    setDeletingDocId(docId)
    try {
      const doc = documents.find(d => d.id === docId)
      
      // Delete from storage
      if (doc) {
        const { data: docData } = await supabase
          .from('documents')
          .select('file_path')
          .eq('id', docId)
          .single()
        
        if (docData?.file_path) {
          await supabase.storage.from('documents').remove([docData.file_path])
        }
      }
      
      // Delete from database
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)
      
      if (error) throw error
      
      // Clean up localStorage
      localStorage.removeItem(`flashcards-${docId}`)
      localStorage.removeItem(`quiz-sessions-${docId}`)
      localStorage.removeItem(`slides-${docId}`)
      
      // Update local state
      setDocuments(docs => docs.filter(d => d.id !== docId))
      
      toast({
        title: t('documentDeleted'),
        description: t('documentDeletedDesc'),
      })
      
      // If deleting current document, redirect to dashboard
      if (docId === currentDocumentId) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        title: t('error'),
        description: t('unexpectedError'),
        variant: 'destructive',
      })
    } finally {
      setDeletingDocId(null)
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) newExpanded.delete(folderId)
    else newExpanded.add(folderId)
    setExpandedFolders(newExpanded)
  }

  const toggleDocExpand = (docId: string) => {
    const newExpanded = new Set(expandedDocs)
    if (newExpanded.has(docId)) newExpanded.delete(docId)
    else newExpanded.add(docId)
    setExpandedDocs(newExpanded)
  }

  const navigateToDocument = (docId: string) => {
    onSelect?.()
    if (docId !== currentDocumentId) router.push(`/documents/${docId}`)
  }

  useEffect(() => {
    if (!userId) return
    let active = true
    queueMicrotask(() => { if (active) void loadData() })
    return () => { active = false }
  }, [loadData, userId])

  const filteredDocuments = documents.filter(doc => doc.file_name.toLowerCase().includes(searchQuery.toLowerCase()))
  const unassignedDocs = filteredDocuments.filter(doc => !doc.folder_id)
  const getDocsInFolder = (folderId: string) => filteredDocuments.filter(doc => doc.folder_id === folderId)
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#f8f5f0]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-[#673b58]" />
          <span className="text-sm text-muted-foreground">{t('processing')}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#f8f5f0] text-[#392639]">
      <div className="border-b border-[#e8dedb] bg-[#f4eee9] p-4">
        <div className="relative space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-[#a84431]">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-editorial text-lg">{t('myDocuments')}</span>
            </div>
            <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('newFolder')} className="h-8 w-8 hover:bg-[#e9dfe5] hover:text-[#a84431]">
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-primary" />
                    {t('newFolder')}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Input placeholder={t('folderName')} value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="border-2 focus:border-primary" />
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('color')}</label>
                    <div className="flex flex-wrap gap-2">
                      {FOLDER_COLORS.map((color) => (
                        <button key={color.value} type="button" onClick={() => setNewFolderColor(color.value)} className={cn("w-8 h-8 rounded-lg transition-all", newFolderColor === color.value && "ring-2 ring-offset-2 ring-[#a84431]")} style={{ backgroundColor: color.value }} title={color.name} aria-label={color.name} aria-pressed={newFolderColor === color.value} />
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={createFolder} disabled={!newFolderName.trim()} className="w-full bg-[#a84431] text-white hover:bg-[#4f2d45]">
                    <FolderPlus className="h-4 w-4 mr-2" />
                    {t('createFolder')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input aria-label={t('search')} placeholder={t('search')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-9 border-[#dfd2d3] bg-white pl-9 text-sm focus:border-[#a84431]" />
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {folders.map((folder) => {
          const docsInFolder = getDocsInFolder(folder.id)
          const isExpanded = expandedFolders.has(folder.id)
          return (
            <div key={folder.id} className="space-y-1">
              <div className={cn("group flex items-center rounded-xl transition-colors hover:bg-white", isExpanded && "bg-white")}>
                <button onClick={() => toggleFolder(folder.id)} className="flex items-center gap-2 flex-1 px-3 py-2.5 text-sm transition-colors">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: folder.color, boxShadow: `0 2px 8px ${folder.color}40` }}>
                    {isExpanded ? <ChevronDown className="h-3 w-3 text-white" /> : <ChevronRight className="h-3 w-3 text-white" />}
                  </div>
                  <span className="font-medium truncate">{folder.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0">{docsInFolder.length}</Badge>
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={t('editFolder')} className="mr-1 h-8 w-8 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem onClick={() => { setEditingFolder(folder); setNewFolderName(folder.name); setNewFolderColor(folder.color) }}>
                      <Pencil className="h-4 w-4 mr-2" />{t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => deleteFolder(folder.id)} className="text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />{t('delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {isExpanded && (
                <div className="ml-3 pl-3 border-l-2 space-y-1" style={{ borderColor: `${folder.color}30` }}>
                  {docsInFolder.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2 px-2">{t('noDocuments')}</p>
                  ) : (
                    docsInFolder.map((doc) => (
                      <DocumentCard key={doc.id} doc={doc} isActive={doc.id === currentDocumentId} isExpanded={expandedDocs.has(doc.id)} folders={folders} onNavigate={navigateToDocument} onAssign={assignDocumentToFolder} onToggleExpand={toggleDocExpand} onDelete={deleteDocument} deletingDocId={deletingDocId} formatDate={formatDate} t={t} />
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}

        {unassignedDocs.length > 0 && (
          <div className="space-y-1">
            {folders.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-2">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('uncategorized')}</span>
              </div>
            )}
            <div className="space-y-1">
              {unassignedDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} isActive={doc.id === currentDocumentId} isExpanded={expandedDocs.has(doc.id)} folders={folders} onNavigate={navigateToDocument} onAssign={assignDocumentToFolder} onToggleExpand={toggleDocExpand} onDelete={deleteDocument} deletingDocId={deletingDocId} formatDate={formatDate} t={t} />
              ))}
            </div>
          </div>
        )}

        {filteredDocuments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{searchQuery ? t('noResults') : t('noDocuments')}</p>
          </div>
        )}
      </div>

      <div className="border-t border-[#e8dedb] bg-[#f4eee9] p-3">
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-lg font-bold text-primary">{documents.length}</p>
            <p className="text-xs text-muted-foreground">{t('documents')}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-lg font-bold text-[#8c6a6d]">{folders.length}</p>
            <p className="text-xs text-muted-foreground">{t('folders')}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-lg font-bold text-[#6f836e]">{documents.reduce((acc, d) => acc + d.flashcardsCount, 0)}</p>
            <p className="text-xs text-muted-foreground">{t('flashcards')}</p>
          </div>
        </div>
      </div>

      <Dialog open={!!editingFolder} onOpenChange={(open) => !open && setEditingFolder(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5 text-primary" />
              {t('editFolder')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder={t('folderName')} value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} className="border-2 focus:border-primary" />
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('color')}</label>
              <div className="flex flex-wrap gap-2">
                {FOLDER_COLORS.map((color) => (
                  <button key={color.value} type="button" onClick={() => setNewFolderColor(color.value)} className={cn("w-8 h-8 rounded-lg transition-all", newFolderColor === color.value && "ring-2 ring-offset-2 ring-[#a84431]")} style={{ backgroundColor: color.value }} title={color.name} aria-label={color.name} aria-pressed={newFolderColor === color.value} />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={updateFolder} disabled={!newFolderName.trim()} className="w-full bg-[#a84431] text-white hover:bg-[#4f2d45]">{t('save')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DocumentCard({ doc, isActive, isExpanded, folders, onNavigate, onAssign, onToggleExpand, onDelete, deletingDocId, formatDate, t }: { doc: DocumentItem; isActive: boolean; isExpanded: boolean; folders: FolderItem[]; onNavigate: (id: string) => void; onAssign: (docId: string, folderId: string | null) => void; onToggleExpand: (id: string) => void; onDelete: (id: string) => void; deletingDocId: string | null; formatDate: (date: string) => string; t: (key: string) => string }) {
  const hasData = doc.flashcardsCount > 0 || doc.quizSessionsCount > 0 || doc.slidesCount > 0
  const isDeleting = deletingDocId === doc.id

  return (
    <div className={cn("overflow-hidden rounded-xl border transition-colors", isActive ? "border-[#decbd6] bg-[#eee4ea]" : "border-transparent hover:border-[#e8dedb] hover:bg-white", isDeleting && "opacity-50")}>
      <div className="flex items-center group">
        {hasData && <button type="button" onClick={() => onToggleExpand(doc.id)} aria-label={isExpanded ? t('back') : t('openDocument')} aria-expanded={isExpanded} className="ml-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-[#806979] hover:bg-[#e8dce5]">
          {isExpanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
        </button>}
        <button type="button" onClick={() => onNavigate(doc.id)} className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2.5 text-left" disabled={isDeleting} aria-current={isActive ? 'page' : undefined}>
          <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", isActive ? "bg-[#a84431]" : "bg-[#ece6e2]")}>
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : <FileText className={cn("h-4 w-4", isActive ? "text-white" : "text-muted-foreground")} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className={cn("text-sm truncate font-medium", isActive && "text-primary")}>{doc.file_name.replace(/\.pdf$/i, '')}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{doc.pages_count} p.</span>
              <span>•</span>
              <span>{formatDate(doc.created_at)}</span>
            </div>
          </div>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('edit')} className="mr-1 h-8 w-8 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100" disabled={isDeleting}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onNavigate(doc.id)}>
              <FileText className="h-4 w-4 mr-2" />{t('open')}
            </DropdownMenuItem>
            {folders.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">{t('moveTo')}</div>
                {folders.map((folder) => (
                  <DropdownMenuItem key={folder.id} onClick={() => onAssign(doc.id, folder.id)}>
                    <div className="w-3 h-3 rounded-sm mr-2" style={{ backgroundColor: folder.color }} />
                    {folder.name}
                  </DropdownMenuItem>
                ))}
                {doc.folder_id && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onAssign(doc.id, null)}>
                      <Folder className="h-4 w-4 mr-2" />{t('removeFromFolder')}
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(doc.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />{t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isExpanded && hasData && (
        <div className="px-3 pb-3 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            {doc.flashcardsCount > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400">
                <GraduationCap className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{doc.flashcardsCount}</span>
              </div>
            )}
            {doc.quizSessionsCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg bg-[#ecdfd8] px-2 py-1.5 text-[#805b55]">
                <Target className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{doc.quizSessionsCount}</span>
              </div>
            )}
            {doc.slidesCount > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg bg-[#e2e9e2] px-2 py-1.5 text-[#55705b]">
                <Presentation className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{doc.slidesCount}</span>
              </div>
            )}
          </div>
          <Button variant="ghost" size="sm" className="w-full h-7 text-xs" onClick={() => onNavigate(doc.id)}>{t('openDocument')}</Button>
        </div>
      )}
    </div>
  )
}
