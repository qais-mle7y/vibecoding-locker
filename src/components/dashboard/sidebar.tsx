'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Code2,
  FileText,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  Sparkles,
  Terminal,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  { name: 'All Items', href: '/dashboard', type: 'all', icon: LayoutDashboard },
  { name: 'Snippets', href: '/dashboard?type=code_snippet', type: 'code_snippet', icon: Code2 },
  { name: 'Commands', href: '/dashboard?type=shell_command', type: 'shell_command', icon: Terminal },
  { name: 'Prompts', href: '/dashboard?type=ai_prompt', type: 'ai_prompt', icon: Sparkles },
  { name: 'Notes', href: '/dashboard?type=note', type: 'note', icon: FileText },
]

function NavLink({
  item,
  isActive,
  compact = false,
}: {
  item: (typeof menuItems)[number]
  isActive: boolean
  compact?: boolean
}) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      title={item.name}
      className={cn(
        'group flex items-center gap-3 rounded-lg text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/50',
        compact ? 'justify-center px-2 py-2' : 'px-3 py-2.5',
        isActive
          ? 'bg-primary/16 text-primary shadow-[inset_0_0_0_1px_rgba(93,156,236,0.24)]'
          : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground'
      )}
    >
      <Icon className={cn('size-4 shrink-0', isActive ? 'text-primary' : 'text-sidebar-foreground/62 group-hover:text-sidebar-foreground')} />
      {compact ? <span className="sr-only">{item.name}</span> : <span>{item.name}</span>}
    </Link>
  )
}

export function Sidebar({ onSignOut }: { onSignOut?: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeType = searchParams.get('type') || 'all'

  const isMenuItemActive = (type: string) => pathname === '/dashboard' && activeType === type

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-[248px] flex-col border-r border-sidebar-border bg-sidebar p-5 lg:flex">
        <Link
          href="/dashboard"
          className="mb-6 flex h-12 items-center gap-3 rounded-lg border border-sidebar-border bg-card px-3 text-sidebar-foreground shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition-colors hover:border-primary/45 focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Library className="size-4" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-semibold tracking-tight">Vibe Locker</span>
            <span className="block text-xs text-muted-foreground">Code command center</span>
          </span>
        </Link>

        <nav className="space-y-6" aria-label="Primary navigation">
          <div>
            <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">Menu</p>
            <div className="space-y-1.5">
              {menuItems.map((item) => (
                <NavLink key={item.name} item={item} isActive={isMenuItemActive(item.type)} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">General</p>
            <div className="space-y-1.5">
              <Link
                href="/dashboard/settings"
                className={cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all focus-visible:ring-3 focus-visible:ring-ring/50',
                  pathname === '/dashboard/settings'
                    ? 'bg-primary/16 text-primary shadow-[inset_0_0_0_1px_rgba(93,156,236,0.24)]'
                    : 'text-sidebar-foreground/72 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <Settings className="size-4" />
                <span>Settings</span>
              </Link>

              {onSignOut && (
                <form action={onSignOut}>
                  <button
                    type="submit"
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-sidebar-foreground/72 transition-all hover:bg-rose-500/12 hover:text-rose-200 focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <LogOut className="size-4" />
                    <span>Logout</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </nav>

        <div className="mt-auto rounded-lg border border-sidebar-border bg-secondary/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <p className="text-sm font-semibold text-sidebar-foreground">Command palette</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Search, copy, and move through your locker without leaving the keyboard.
          </p>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event('locker:open-command'))}
            className="mt-4 h-9 w-full rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Open Search
          </button>
        </div>
      </aside>

      <nav
        className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 gap-1 rounded-lg border border-sidebar-border bg-sidebar/95 p-1 shadow-[0_20px_60px_rgba(0,0,0,0.38)] backdrop-blur-xl lg:hidden"
        aria-label="Mobile navigation"
      >
        {menuItems.map((item) => (
          <NavLink key={item.name} item={item} isActive={isMenuItemActive(item.type)} compact />
        ))}
      </nav>
    </>
  )
}
