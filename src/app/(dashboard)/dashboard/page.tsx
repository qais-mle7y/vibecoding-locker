import Link from 'next/link'
import { Suspense } from 'react'
import { Archive, Code2, Copy, Library, Plus, SearchX, Terminal } from 'lucide-react'
import { getLockerItems } from '@/app/actions/locker'
import { ItemCard, LockerItemWithTags } from '@/components/dashboard/item-card'
import { CreateItemSheet } from '@/components/dashboard/create-item-sheet'
import { CreateItemButton } from '@/components/dashboard/create-item-button'
import { SearchBar } from '@/components/dashboard/search-bar'
import { Button } from '@/components/ui/button'

const itemTypeLabels: Record<string, string> = {
  all: 'All Items',
  code_snippet: 'Code Snippets',
  shell_command: 'Shell Commands',
  ai_prompt: 'AI Prompts',
  agent_skill: 'Agent Skills',
  config: 'Configs',
  note: 'Notes',
}

export default async function DashboardPage(props: { searchParams: Promise<{ q?: string, type?: string }> }) {
  const searchParams = await props.searchParams
  const q = searchParams?.q
  const type = searchParams?.type || 'all'

  const [items, allItems] = await Promise.all([
    getLockerItems({ query: q, type }),
    getLockerItems(),
  ])

  const snippetCount = allItems.filter((item) => item.item_type === 'code_snippet').length
  const commandCount = allItems.filter((item) => item.item_type === 'shell_command').length
  const promptCount = allItems.filter((item) => item.item_type === 'ai_prompt' || item.item_type === 'agent_skill').length
  const copyCount = allItems.reduce((total, item) => total + (item.copy_count ?? 0), 0)
  const activeFilter = itemTypeLabels[type] ?? itemTypeLabels.all
  const hasFilters = Boolean(q || type !== 'all')

  const stats = [
    {
      label: 'Saved Items',
      value: allItems.length,
      detail: 'Total locker entries',
      icon: Library,
      tone: 'bg-sky-500/14 text-sky-200 ring-sky-400/20',
      panel: 'from-sky-500/10',
    },
    {
      label: 'Code Snippets',
      value: snippetCount,
      detail: 'Reusable code blocks',
      icon: Code2,
      tone: 'bg-emerald-500/14 text-emerald-200 ring-emerald-400/20',
      panel: 'from-emerald-500/10',
    },
    {
      label: 'Commands',
      value: commandCount,
      detail: 'Shell and terminal saves',
      icon: Terminal,
      tone: 'bg-amber-500/14 text-amber-200 ring-amber-400/20',
      panel: 'from-amber-500/10',
    },
    {
      label: 'Copied',
      value: copyCount,
      detail: `${promptCount} prompt${promptCount === 1 ? '' : 's'} stored`,
      icon: Copy,
      tone: 'bg-rose-500/14 text-rose-200 ring-rose-400/20',
      panel: 'from-rose-500/10',
    },
  ]

  return (
    <div className="w-full space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-500">
      <section aria-label="Locker summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon

          return (
            <div
              key={stat.label}
              className={`rounded-lg border border-border bg-gradient-to-br ${stat.panel} to-card p-5 shadow-[0_18px_48px_rgba(0,0,0,0.2)]`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.detail}</p>
                </div>
                <span className={`grid size-10 place-items-center rounded-lg ring-1 ${stat.tone}`}>
                  <Icon className="size-5" />
                </span>
              </div>
            </div>
          )
        })}
      </section>

      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-[0_24px_70px_rgba(0,0,0,0.24)]">
        <div className="flex flex-col gap-4 border-b border-border/80 p-4 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Archive className="size-5 text-primary" />
              <h2 className="text-xl font-semibold tracking-tight text-foreground">{activeFilter}</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {items.length} of {allItems.length} saved locker item{allItems.length === 1 ? '' : 's'}.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 lg:max-w-3xl lg:flex-row lg:items-center">
            <Suspense fallback={<div className="h-[54px] w-full animate-pulse rounded-lg bg-input/45" />}>
              <SearchBar />
            </Suspense>
            <CreateItemButton />
          </div>
        </div>

        <div className="p-4">
          {items.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background/45 px-6 py-16 text-center">
              <span className="grid size-14 place-items-center rounded-lg bg-primary/12 text-primary ring-1 ring-primary/18">
                <SearchX className="size-7" />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-foreground">
                {hasFilters ? 'No matching locker items' : 'Your locker is empty'}
              </h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                {hasFilters
                  ? 'Try a different search phrase or item type to find the code artifact you need.'
                  : 'Save your first code snippet, command, prompt, or configuration so it is ready when you need it.'}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {hasFilters ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-input bg-secondary px-4 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary/80 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    Clear filters
                  </Link>
                ) : (
                  <CreateItemButton variant="first" />
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item.id} item={item as unknown as LockerItemWithTags} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-2 border-t border-border/80 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing 1 - {items.length} of {allItems.length} locker items
            </span>
            <span>Filtered by {activeFilter.toLowerCase()}</span>
          </div>
        )}
      </section>
    <CreateItemSheet />
    </div>
  )
}
