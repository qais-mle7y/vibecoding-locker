'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Code2, Terminal, Sparkles, FileText, Plus, LayoutDashboard, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { getLockerItems, incrementCopyCount, type LockerItemRow } from '@/app/actions/locker'
import { signout } from '@/app/(auth)/actions'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

const typeIcons = {
  code_snippet: Code2,
  shell_command: Terminal,
  ai_prompt: Sparkles,
  agent_skill: Sparkles,
  project_idea: FileText,
  config: FileText,
  debug_fix: FileText,
  note: FileText,
}

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [items, setItems] = React.useState<LockerItemRow[]>([])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    const openPalette = () => setOpen(true)
    document.addEventListener('keydown', down)
    window.addEventListener('locker:open-command', openPalette)
    return () => {
      document.removeEventListener('keydown', down)
      window.removeEventListener('locker:open-command', openPalette)
    }
  }, [])

  // Fetch items when palette opens
  React.useEffect(() => {
    if (open) {
      getLockerItems().then(data => setItems(data))
    }
  }, [open])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const handleCopy = async (item: LockerItemRow) => {
    try {
      await navigator.clipboard.writeText(item.content)
      toast.success(`Copied "${item.title}" to clipboard`)
      await incrementCopyCount(item.id)
      router.refresh()
    } catch {
      toast.error('Failed to copy snippet')
    }
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search your locker... (Ctrl+K)" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Quick Actions">
          {/* Note: In a real app we'd dispatch a custom event to open the CreateItemSheet, 
              but since it's an MVP, we'll navigate or just show a toast if they need to click the + button manually.
              Actually, the CreateItemSheet is rendered in the page. We could move its state to a context,
              but for now, we'll just alert or if we navigate to a /new route.
          */}
          <CommandItem
            onSelect={() => {
              runCommand(() => {
                window.dispatchEvent(new Event('locker:open-create'))
              })
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            <span>Create New Item</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard'))}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Your Locker">
          {items.map((item) => {
            const Icon = typeIcons[item.item_type as keyof typeof typeIcons] || FileText
            return (
              <CommandItem
                key={item.id}
                value={`${item.title} ${item.description ?? ''} ${item.language ?? ''}`}
                onSelect={() => runCommand(() => handleCopy(item))}
                className="flex items-center"
              >
                <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{item.title}</span>
                {item.language && (
                  <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-sm">
                    {item.language}
                  </span>
                )}
                <span className="ml-auto text-xs text-muted-foreground opacity-50">
                  Enter to copy
                </span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Account">
          <CommandItem
            onSelect={() => runCommand(async () => {
              await signout()
            })}
          >
            <LogOut className="mr-2 h-4 w-4 text-destructive" />
            <span className="text-destructive">Sign Out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
