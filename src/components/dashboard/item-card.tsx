'use client'

import { formatDistanceToNow } from 'date-fns'
import { Check, Code2, Copy, FileText, Sparkles, Terminal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LockerItemRow, deleteLockerItem, incrementCopyCount } from '@/app/actions/locker'
import { toast } from 'sonner'
import { EditItemSheet } from './edit-item-sheet'

const typeConfig = {
  code_snippet: {
    icon: Code2,
    label: 'Code Snippet',
    badge: 'bg-sky-500/14 text-sky-200 ring-sky-400/20',
    iconColor: 'text-sky-300',
  },
  shell_command: {
    icon: Terminal,
    label: 'Shell Command',
    badge: 'bg-emerald-500/14 text-emerald-200 ring-emerald-400/20',
    iconColor: 'text-emerald-300',
  },
  ai_prompt: {
    icon: Sparkles,
    label: 'AI Prompt',
    badge: 'bg-violet-500/14 text-violet-200 ring-violet-400/20',
    iconColor: 'text-violet-300',
  },
  agent_skill: {
    icon: Sparkles,
    label: 'Agent Skill',
    badge: 'bg-fuchsia-500/14 text-fuchsia-200 ring-fuchsia-400/20',
    iconColor: 'text-fuchsia-300',
  },
  project_idea: {
    icon: FileText,
    label: 'Project Idea',
    badge: 'bg-amber-500/14 text-amber-200 ring-amber-400/20',
    iconColor: 'text-amber-300',
  },
  config: {
    icon: FileText,
    label: 'Config',
    badge: 'bg-cyan-500/14 text-cyan-200 ring-cyan-400/20',
    iconColor: 'text-cyan-300',
  },
  debug_fix: {
    icon: FileText,
    label: 'Debug Fix',
    badge: 'bg-rose-500/14 text-rose-200 ring-rose-400/20',
    iconColor: 'text-rose-300',
  },
  note: {
    icon: FileText,
    label: 'Note',
    badge: 'bg-slate-500/18 text-slate-200 ring-slate-400/20',
    iconColor: 'text-slate-300',
  },
}

export type LockerItemWithTags = LockerItemRow & {
  locker_item_tags?: { tags: { name: string; slug: string } }[]
}

export function ItemCard({ item }: { item: LockerItemWithTags }) {
  const [copied, setCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const config = typeConfig[item.item_type as keyof typeof typeConfig] || typeConfig.note
  const Icon = config.icon
  const tags = item.locker_item_tags ?? []
  const visibleTags = tags.slice(0, 3)

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(item.content)
      setCopied(true)
      toast.success('Copied to clipboard')
      await incrementCopyCount(item.id)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    setDeleteOpen(false)
    try {
      await deleteLockerItem(item.id)
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete item')
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Card 
        onClick={() => setEditOpen(true)}
        className="group/item cursor-pointer h-full rounded-lg border-border bg-[#141a25] py-0 shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/45 hover:shadow-[0_24px_70px_rgba(0,0,0,0.28)]"
      >
        <CardHeader className="gap-3 px-4 pb-3 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1.5">
            <CardTitle className="flex items-center gap-2 text-base font-semibold leading-tight text-foreground">
              <Icon className={`size-4 shrink-0 ${config.iconColor}`} />
              <span className="truncate">{item.title}</span>
            </CardTitle>
            {item.description && (
              <CardDescription className="line-clamp-2 text-sm leading-5">
                {item.description}
              </CardDescription>
            )}
          </div>

          <div className="flex shrink-0 gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover/item:opacity-100 md:group-focus-within/item:opacity-100">
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:bg-primary/12 hover:text-foreground"
              onClick={handleCopy}
              aria-label={`Copy ${item.title}`}
            >
              {copied ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:bg-rose-500/12 hover:text-rose-200"
              onClick={handleDeleteClick}
              disabled={isDeleting}
              aria-label={`Delete ${item.title}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`${config.badge} h-6 rounded-md border-0 px-2 text-[11px] font-semibold capitalize ring-1`}>
            {config.label}
          </Badge>
          {item.language && (
            <Badge variant="outline" className="h-6 rounded-md border-border bg-background/55 px-2 text-[11px] font-semibold text-muted-foreground">
              {item.language}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="relative max-h-[220px] overflow-hidden rounded-lg border border-border bg-[#0a0f18] text-xs">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-14 bg-gradient-to-t from-[#0a0f18] to-transparent" />
          <div className="p-3 leading-5 text-muted-foreground">
            <ReactMarkdown
              components={{
                code(props) {
                  const { children, className, node, ...rest } = props
                  void node
                  const match = /language-(\w+)/.exec(className || '')
                  return match ? (
                    <SyntaxHighlighter
                      PreTag="div"
                      language={match[1]}
                      style={vscDarkPlus}
                      customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code {...rest} className="rounded bg-secondary px-1 py-0.5 text-sky-200">
                      {children}
                    </code>
                  )
                },
              }}
            >
              {item.content}
            </ReactMarkdown>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex-col items-start gap-3 rounded-b-lg border-t border-border bg-muted/22 px-4 py-3">
        <div className="flex w-full items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>{formatDistanceToNow(new Date(item.created_at))} ago</span>
          <span>{item.copy_count ?? 0} copies</span>
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {visibleTags.map((lit, idx) => (
              <Badge key={`${lit.tags.slug}-${idx}`} variant="outline" className="h-5 rounded-md border-border bg-background/45 px-1.5 text-[10px] font-medium text-muted-foreground">
                #{lit.tags.name}
              </Badge>
            ))}
            {tags.length > visibleTags.length && (
              <Badge variant="outline" className="h-5 rounded-md border-border bg-background/45 px-1.5 text-[10px] font-medium text-muted-foreground">
                +{tags.length - visibleTags.length}
              </Badge>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
    <EditItemSheet item={item} open={editOpen} onOpenChange={setEditOpen} />
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
      <DialogContent className="sm:max-w-md border-border bg-popover/98 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Delete Locker Item</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  )
}
