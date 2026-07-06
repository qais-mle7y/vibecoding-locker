import { Sidebar } from '@/components/dashboard/sidebar'
import { signout } from '@/app/(auth)/actions'
import { CommandPalette } from '@/components/dashboard/command-palette'
import { DashboardTopbar } from '@/components/dashboard/topbar'
import { Suspense } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-[100dvh] bg-background font-sans selection:bg-primary/25">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground">
        Skip to content
      </a>
      <CommandPalette />
      <Suspense fallback={null}>
        <Sidebar onSignOut={signout} />
      </Suspense>
      <div className="min-h-[100dvh] lg:pl-[248px]">
        <DashboardTopbar />
        <main id="main-content" className="px-4 pb-24 pt-5 sm:px-6 lg:px-7 lg:pb-8 xl:px-8">
          <div className="mx-auto w-full max-w-[1440px]">
          {children}
          </div>
        </main>
      </div>
    </div>
  )
}
