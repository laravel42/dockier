import type { ComponentType } from 'react'

import { template as waitlistConfirmation } from './waitlist-confirmation'
import { template as demoRequestConfirmation } from './demo-request-confirmation'
import { template as demoRequestTeamNotification } from './demo-request-team-notification'

export interface TemplateEntry {
  component: ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  displayName?: string
  previewData?: Record<string, any>
  /** Fixed recipient — overrides caller-provided recipientEmail when set. */
  to?: string
}

/**
 * Template registry — maps template names to their React Email components.
 * Import and register new templates here after creating them in this directory.
 *
 * Example:
 *   import { template as welcomeTemplate } from './welcome'
 *   // then add to TEMPLATES: 'welcome': welcomeTemplate
 */
export const TEMPLATES: Record<string, TemplateEntry> = {
  'waitlist-confirmation': waitlistConfirmation,
  'demo-request-confirmation': demoRequestConfirmation,
  'demo-request-team-notification': demoRequestTeamNotification,
}
