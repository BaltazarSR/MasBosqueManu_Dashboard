/**
 * Shared TypeScript types and interfaces used across the application
 */

/**
 * User profile from the database
 */
export interface UserProfile {
  id: string
  name: string
  last_name: string
  role: string
  created_at: string
  is_completed: boolean
  photo_url: string | null
}

/**
 * SOS Alert raw data from database
 */
export interface SOSAlert {
  id: string
  profile_id: string
  status: string
  lat: number
  lng: number
  created_at: string
  closed_at: string | null
  name: string
  last_name: string
  photo_url: string | null
}

/**
 * Formatted SOS Alert for display
 */
export interface SOSAlertFormatted {
  id: string
  status: string
  name: string
  profile_picture: string | null
  lat: number
  lng: number
  created_at: string
  closed_at: string | null
}

/**
 * Alert status types
 */
export type AlertStatus = 'open' | 'closed' | 'cancelled' | 'false_alarm'

/**
 * User roles
 */
export type UserRole = 'admin' | 'user' | 'volunteer'
