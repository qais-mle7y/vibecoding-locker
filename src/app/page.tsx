import Link from 'next/link'
import { ArrowRight, Code2, Library, Search, ShieldCheck, Sparkles, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/button'

const previewItems = [
  { title: 'Next.js server action', type: 'Code Snippet', tone: 'text-sky-200 bg-sky-500/14' },
  { title: 'Deploy health check', type: 'Shell Command', tone: 'text-emerald-200 bg-emerald-500/14' },
  { title: 'Refactor prompt', type: 'AI Prompt', tone: 'text-violet-200 bg-violet-500/14' },
]

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-border/70 bg-background/90 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 rounded-lg focus-visible:ring-3 focus-visible:ring-ring/50">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Library className="size-4" />
            </span>
            <span className="font-semibold tracking-tight">Vibe Locker</span>
          </Link>

          <nav className="flex items-center gap-2" aria-label="Account">
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Sign up
              <ArrowRight className="size-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.84fr_1.16fr] lg:items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Private workspace for reusable code artifacts
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
                Store the code, prompts, and commands you actually reuse.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                Vibe Locker gives your best snippets a focused dashboard with fast search, type filters, copy actions, and clean backups.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
              >
                Get Started
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-input bg-input/45 px-5 text-sm font-semibold text-foreground transition-colors hover:bg-input/70 focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
              >
                Open Locker
              </Link>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3">
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-2xl font-semibold">3</p>
                <p className="text-xs text-muted-foreground">Item types</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-2xl font-semibold">1</p>
                <p className="text-xs text-muted-foreground">Search flow</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-3">
                <p className="text-2xl font-semibold">JSON</p>
                <p className="text-xs text-muted-foreground">Backups</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-3 shadow-[0_30px_100px_rgba(0,0,0,0.34)]">
            <div className="rounded-lg border border-border bg-background p-3">
              <div className="mb-3 flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2">
                <div>
                  <p className="text-xs text-muted-foreground">Dashboard</p>
                  <p className="font-semibold">Your Locker</p>
                </div>
                <div className="hidden min-w-[240px] items-center gap-2 rounded-lg border border-input bg-input/45 px-3 py-2 text-sm text-muted-foreground sm:flex">
                  <Search className="size-4" />
                  Search here...
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-[180px_1fr]">
                <aside className="hidden rounded-lg border border-border bg-sidebar p-3 md:block">
                  <div className="mb-5 flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                      <Library className="size-4" />
                    </span>
                    <span className="text-sm font-semibold">Vibe Locker</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    {[
                      ['All Items', Library],
                      ['Snippets', Code2],
                      ['Commands', Terminal],
                      ['Prompts', Sparkles],
                    ].map(([label, Icon], index) => {
                      const MenuIcon = Icon as typeof Library
                      return (
                        <div
                          key={label as string}
                          className={`flex items-center gap-2 rounded-lg px-2.5 py-2 ${index === 0 ? 'bg-primary/16 text-primary' : 'text-muted-foreground'}`}
                        >
                          <MenuIcon className="size-4" />
                          <span>{label as string}</span>
                        </div>
                      )
                    })}
                  </div>
                </aside>

                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      ['Saved Items', '156', 'bg-sky-500/10'],
                      ['Commands', '28', 'bg-emerald-500/10'],
                      ['Prompts', '57', 'bg-violet-500/10'],
                    ].map(([label, value, tone]) => (
                      <div key={label} className={`rounded-lg border border-border ${tone} p-4`}>
                        <p className="text-3xl font-semibold">{value}</p>
                        <p className="text-sm text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-semibold">All Items</p>
                      <Button className="h-9 gap-2 px-3 text-sm">
                        New Item
                      </Button>
                    </div>
                    <div className="grid gap-3 lg:grid-cols-3">
                      {previewItems.map((item) => (
                        <div key={item.title} className="rounded-lg border border-border bg-background p-3">
                          <div className="mb-3 flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold">{item.title}</p>
                              <span className={`mt-2 inline-flex rounded-md px-2 py-1 text-[11px] font-semibold ${item.tone}`}>
                                {item.type}
                              </span>
                            </div>
                          </div>
                          <div className="rounded-lg border border-border bg-[#0a0f18] p-3 font-mono text-xs leading-5 text-muted-foreground">
                            const saved = true;
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
