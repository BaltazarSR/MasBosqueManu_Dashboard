/**
 * Utility functions for environment variables validation and access
 */

interface EnvConfig {
  supabaseUrl: string
  supabaseAnonKey: string
}

class EnvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'EnvError'
  }
}

/**
 * Validates and retrieves required environment variables
 * Throws an error if any required variable is missing
 */
export function getEnvConfig(): EnvConfig {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const missingVars: string[] = []

  if (!supabaseUrl) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!supabaseAnonKey) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  if (missingVars.length > 0) {
    throw new EnvError(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
  }

  return {
    supabaseUrl: supabaseUrl!,
    supabaseAnonKey: supabaseAnonKey!,
  }
}

/**
 * Safely checks if all required environment variables are present
 */
export function hasRequiredEnvVars(): boolean {
  try {
    getEnvConfig()
    return true
  } catch {
    return false
  }
}
