'use client'

import { Bell, ChevronDown, Search, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DashboardTopbar() {
  const openCommandPalette = () => {
    window.dispatchEvent(new Event('locker:open-command'))
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-7 xl:px-8">
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Dashboard</p>
          <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">Your Locker</h1>
        </div>

      </div>
    </header>
  )
}
