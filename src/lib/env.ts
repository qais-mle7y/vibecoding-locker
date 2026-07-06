function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${name}. ` +
      `Check your .env.local file.`
    )
  }
  return value
}

export const env = {
  SUPABASE_URL: requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
}
