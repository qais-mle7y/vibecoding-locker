import Link from 'next/link'
import { Library } from 'lucide-react'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage(props: { searchParams: Promise<{ message?: string, type?: string }> }) {
  const searchParams = await props.searchParams

  return (
    <main className="grid min-h-[100dvh] place-items-center bg-background px-4 py-10 text-foreground">
      <Card className="w-full max-w-[420px] rounded-lg border-border bg-card py-0 shadow-[0_30px_100px_rgba(0,0,0,0.34)]">
        <CardHeader className="items-center px-6 pb-4 pt-8 text-center">
          <Link href="/" className="mb-3 grid size-11 place-items-center rounded-lg bg-primary text-primary-foreground focus-visible:ring-3 focus-visible:ring-ring/50">
            <Library className="size-5" />
            <span className="sr-only">Vibe Locker home</span>
          </Link>
          <CardTitle className="text-2xl font-semibold tracking-tight">Welcome back</CardTitle>
          <CardDescription>Enter your details to open your locker.</CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <form id="login-form" action={login} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-11 bg-input/55" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="h-11 bg-input/55" />
            </div>
            {searchParams?.message && (
              <p className={`rounded-lg border px-3 py-2 text-sm font-medium ${searchParams.type === 'success' ? 'border-emerald-400/25 bg-emerald-500/12 text-emerald-200' : 'border-rose-400/25 bg-rose-500/12 text-rose-200'}`}>
                {searchParams.message}
              </p>
            )}
            <Button type="submit" className="mt-2 h-11 w-full font-semibold">Sign in</Button>
          </form>
        </CardContent>
        <CardFooter className="mt-6 flex flex-col gap-4 rounded-b-lg border-t border-border bg-muted/22 px-6 py-4">
          <div className="w-full text-center text-sm text-muted-foreground">
            Do not have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  )
}
