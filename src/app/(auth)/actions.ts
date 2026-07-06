'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '60 s'),
  })
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  display_name: z.string().min(1).max(100),
})

export async function login(formData: FormData) {
  const supabase = await createClient()

  if (ratelimit) {
    const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await ratelimit.limit(`ratelimit_${ip}`)
    if (!success) {
      redirect('/login?message=Too many attempts. Please try again later.')
    }
  }

  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    redirect('/login?message=Invalid email or password')
  }

  const data = parsed.data

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=Could not authenticate user')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  if (ratelimit) {
    const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await ratelimit.limit(`ratelimit_${ip}`)
    if (!success) {
      redirect('/signup?message=Too many attempts. Please try again later.')
    }
  }

  const parsed = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    display_name: formData.get('display_name'),
  })

  if (!parsed.success) {
    redirect('/signup?message=Invalid input data')
  }

  const { email, password, display_name } = parsed.data

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name,
      }
    }
  })

  if (error) {
    console.error('Signup error:', error.message)
    redirect(`/signup?message=${encodeURIComponent(error.message)}`)
  }

  // If email confirmation is enabled, the session will be null
  if (!data.session) {
    redirect('/login?message=Signup successful! Please check your email to verify your account.&type=success')
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
