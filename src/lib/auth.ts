import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { UserProfile } from '@/types'

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  const supabase = await createClient(cookies())
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

/**
 * Get the user profile from the database
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient(cookies())
  
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error || !profile) {
    return null
  }
  
  return profile as UserProfile
}

/**
 * Check if user has admin role
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.role === 'admin'
}

/**
 * Get the current user with their profile
 */
export async function getCurrentUserWithProfile() {
  const user = await getCurrentUser()
  
  if (!user) {
    return { user: null, profile: null }
  }
  
  const profile = await getUserProfile(user.id)
  
  return { user, profile }
}
