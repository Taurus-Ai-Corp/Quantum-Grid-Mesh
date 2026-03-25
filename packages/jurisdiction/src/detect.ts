import type { Jurisdiction } from './types.js'

export function detectJurisdiction(hostname: string, envOverride?: string): Jurisdiction {
  if (envOverride && isValidJurisdiction(envOverride)) return envOverride
  if (hostname.includes('q-grid.net') || hostname.includes('q-grid.ca')) return 'na'
  if (hostname.includes('q-grid.eu')) return 'eu'
  if (hostname.includes('q-grid.in')) return 'in'
  if (hostname.includes('q-grid.ae')) return 'ae'
  return 'na' // Default to NA
}

function isValidJurisdiction(value: string): value is Jurisdiction {
  return ['na', 'eu', 'in', 'ae'].includes(value)
}
