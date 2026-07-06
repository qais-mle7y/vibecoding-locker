'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function CreateItemButton({ variant = 'default' }: { variant?: 'default' | 'first' }) {
  const openSheet = () => window.dispatchEvent(new Event('locker:open-create'))

  if (variant === 'first') {
    return (
      <Button onClick={openSheet} className="h-10 gap-2 px-4 font-semibold">
        <Plus className="size-4" />
        Add your first item
      </Button>
    )
  }

  return (
    <Button onClick={openSheet} className="h-[54px] w-full gap-2 px-4 font-semibold shadow-[0_16px_42px_rgba(93,156,236,0.24)] lg:w-auto">
      <Plus className="size-4" />
      New Item
    </Button>
  )
}
