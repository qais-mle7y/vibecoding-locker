'use client'

import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const ITEM_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'code_snippet', label: 'Code Snippets' },
  { value: 'shell_command', label: 'Shell Commands' },
  { value: 'ai_prompt', label: 'AI Prompts' },
  { value: 'agent_skill', label: 'Agent Skills' },
  { value: 'config', label: 'Configs' },
  { value: 'note', label: 'Notes' },
]

export function SearchBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const initialQuery = searchParams.get('q') || ''
  const initialType = searchParams.get('type') || 'all'

  const [query, setQuery] = useState(initialQuery)
  const [type, setType] = useState(initialType)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    startTransition(() => {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set('q', debouncedQuery)
      if (type && type !== 'all') params.set('type', type)
      const queryString = params.toString()

      router.push(queryString ? `${pathname}?${queryString}` : pathname)
    })
  }, [debouncedQuery, type, pathname, router])

  const clearSearch = () => {
    setQuery('')
  }

  return (
    <div className={`flex w-full flex-col gap-3 rounded-lg border border-input bg-input/45 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:flex-row ${isPending ? 'opacity-80' : ''}`}>
      <div className="group relative flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          type="text"
          placeholder="Search snippets, commands, content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 w-full border-0 bg-transparent pl-9 pr-16 text-sm font-sans focus-visible:ring-0"
        />
        {!query && (
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden h-5 -translate-y-1/2 select-none items-center gap-1 rounded-md border border-border bg-secondary px-1.5 text-[10px] font-semibold text-muted-foreground sm:inline-flex">
            Ctrl K
          </kbd>
        )}
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      <div className="hidden h-8 w-px self-center bg-border/70 sm:block" />

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-input/50 hover:text-foreground focus-visible:outline-hidden focus-visible:ring-0">
          <SlidersHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          {ITEM_TYPES.map((t) => (
            <DropdownMenuItem 
              key={t.value} 
              onClick={() => setType(t.value)}
              className={type === t.value ? 'bg-primary/10 text-primary font-medium' : ''}
            >
              {t.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
