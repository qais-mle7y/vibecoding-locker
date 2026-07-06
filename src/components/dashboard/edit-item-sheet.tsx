'use client'

import { ReactElement, useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { MarkdownEditor } from './markdown-editor'
import { updateLockerItem, type LockerItemInsert, type LockerItemWithTags } from '@/app/actions/locker'
import { toast } from 'sonner'

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}

export function EditItemSheet({ 
  item, 
  open, 
  onOpenChange 
}: { 
  item: LockerItemWithTags, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [content, setContent] = useState(item.content)
  const tagsString = item.locker_item_tags?.map(t => t.tags?.name).filter(Boolean).join(', ') || ''

  useEffect(() => {
    if (open) {
      setContent(item.content)
    }
  }, [open, item.content])

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const data: Omit<LockerItemInsert, 'user_id'> = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        item_type: formData.get('item_type') as LockerItemInsert['item_type'],
        language: formData.get('language') as string,
        content: content,
      }
      
      const tags = formData.get('tags') as string
      
      await updateLockerItem(item.id, data, tags)
      toast.success('Item updated')
      onOpenChange(false)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Failed to update item'))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="w-full sm:max-w-3xl max-h-[90vh] overflow-y-auto border border-border bg-popover/98 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl p-0">
        <DialogHeader className="mb-2 border-b border-border/70 px-6 py-5">
          <DialogTitle className="text-2xl font-semibold tracking-tight">Edit Locker Item</DialogTitle>
          <DialogDescription>
            Update your snippet, command, or prompt.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-6 px-6 pb-20 pt-3">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={item.title} placeholder="e.g. Docker Compose Next.js Setup" required className="h-11 border-input bg-input/55 focus-visible:bg-input" />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="item_type">Item Type</Label>
              <Select name="item_type" defaultValue={item.item_type || "code_snippet"} required>
                <SelectTrigger className="h-11 w-full border-input bg-input/55">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="code_snippet">Code Snippet</SelectItem>
                  <SelectItem value="shell_command">Shell Command</SelectItem>
                  <SelectItem value="ai_prompt">AI Prompt</SelectItem>
                  <SelectItem value="config">Config File</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language / Tool</Label>
              <Input id="language" name="language" defaultValue={item.language || ''} placeholder="e.g. typescript, bash, react" className="h-11 border-input bg-input/55 focus-visible:bg-input" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description (optional)</Label>
            <Input id="description" name="description" defaultValue={item.description || ''} placeholder="Brief explanation of what this does..." className="h-11 border-input bg-input/55 focus-visible:bg-input" />
          </div>

          <div className="space-y-2 flex-1 flex flex-col min-h-[400px]">
            <Label>Content</Label>
            <input type="hidden" name="content" value={content} />
            <MarkdownEditor 
              value={content} 
              onChange={setContent} 
              className="flex-1 border-border bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" defaultValue={tagsString} placeholder="e.g. config, setup, production" className="h-11 border-input bg-input/55 focus-visible:bg-input" />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto font-medium">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
