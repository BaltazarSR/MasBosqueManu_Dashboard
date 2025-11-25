/**
 * Application-wide constants
 */

/**
 * Alert status constants
 */
export const ALERT_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
  FALSE_ALARM: 'false_alarm',
} as const

/**
 * User role constants
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  VOLUNTEER: 'volunteer',
} as const

/**
 * Route paths
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
} as const

/**
 * Badge color mappings for alert statuses
 */
export const ALERT_BADGE_STYLES = {
  [ALERT_STATUS.OPEN]: {
    backgroundColor: 'var(--badge-open)',
    color: 'var(--badge-open-foreground)',
    borderColor: 'var(--badge-open-foreground)',
  },
  [ALERT_STATUS.CLOSED]: {
    backgroundColor: 'var(--badge-closed)',
    color: 'var(--badge-closed-foreground)',
    borderColor: 'var(--badge-closed-foreground)',
  },
} as const

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 30, 40, 50],
} as const
