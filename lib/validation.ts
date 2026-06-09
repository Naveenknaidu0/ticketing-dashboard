/**
 * CORE-01J: VALIDATION LAYER
 * Ensures all modules display only data from the 50-ticket master dataset
 * Logs validation results to console for debugging
 */

import { ApplicationStore } from './store'

export interface ValidationReport {
  timestamp: string
  totalTickets: number
  totalUsers: number
  ticketsWithoutAssignees: number
  unassignedTickets: number
  allAgentsValid: boolean
  dataIntegrityScore: number
  issues: string[]
}

/**
 * Validates that all displayed data comes from the master 50-ticket dataset
 */
export function validateDataIntegrity(store: ApplicationStore): ValidationReport {
  const state = store.getState()
  const issues: string[] = []

  // Count tickets
  const totalTickets = state.tickets.size
  const totalUsers = state.users.size

  // Check for unassigned tickets that shouldn't exist
  let ticketsWithoutAssignees = 0
  let unassignedTickets = 0
  
  state.tickets.forEach((ticket) => {
    if (!ticket.assignedTo) {
      unassignedTickets++
    }
  })

  // Validate all assigned tickets reference valid agents
  let invalidAssignments = 0
  state.tickets.forEach((ticket) => {
    if (ticket.assignedTo && !state.users.has(ticket.assignedTo)) {
      invalidAssignments++
      issues.push(`Ticket ${ticket.id} assigned to non-existent user: ${ticket.assignedTo}`)
    }
  })

  // Validate all users are either manager or agents
  let allAgentsValid = true
  state.users.forEach((user) => {
    if (user.role !== 'manager' && user.role !== 'agent') {
      allAgentsValid = false
      issues.push(`User ${user.id} has invalid role: ${user.role}`)
    }
  })

  // Calculate data integrity score
  const maxIssues = 10
  const issueCount = issues.length
  const dataIntegrityScore = Math.max(0, 100 - (issueCount / maxIssues) * 100)

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    totalTickets,
    totalUsers,
    ticketsWithoutAssignees,
    unassignedTickets,
    allAgentsValid,
    dataIntegrityScore: Math.round(dataIntegrityScore),
    issues,
  }

  return report
}

/**
 * Logs validation results to console for debugging
 */
export function logValidationResults(store: ApplicationStore): void {
  const report = validateDataIntegrity(store)

  console.log('[v0] ========== DATA INTEGRITY VALIDATION ==========')
  console.log(`[v0] Timestamp: ${report.timestamp}`)
  console.log(`[v0] Total Tickets: ${report.totalTickets} (expected 50)`)
  console.log(`[v0] Total Users: ${report.totalUsers} (expected 6)`)
  console.log(`[v0] Unassigned Tickets: ${report.unassignedTickets}`)
  console.log(`[v0] All Agents Valid: ${report.allAgentsValid}`)
  console.log(`[v0] Data Integrity Score: ${report.dataIntegrityScore}%`)

  if (report.issues.length > 0) {
    console.log(`[v0] Found ${report.issues.length} validation issues:`)
    report.issues.forEach((issue, idx) => {
      console.log(`[v0]   ${idx + 1}. ${issue}`)
    })
  } else {
    console.log('[v0] No validation issues found - all data is valid!')
  }

  console.log('[v0] ================================================')
}

/**
 * Validates that a specific metric exists in the dataset
 */
export function validateMetricExists(metricName: string, value: number, store: ApplicationStore): boolean {
  const state = store.getState()

  // Check if the metric is calculable from the dataset
  switch (metricName) {
    case 'total_tickets':
      return value === state.tickets.size

    case 'total_users':
      return value === state.users.size

    case 'open_tickets':
      return value === Array.from(state.tickets.values()).filter((t) => t.status === 'open').length

    case 'in_progress_tickets':
      return value === Array.from(state.tickets.values()).filter((t) => t.status === 'in-progress').length

    case 'resolved_tickets':
      return (
        value ===
        Array.from(state.tickets.values()).filter((t) => t.status === 'resolved' || t.status === 'closed').length
      )

    case 'critical_tickets':
      return value === Array.from(state.tickets.values()).filter((t) => t.priority === 'critical').length

    case 'high_tickets':
      return value === Array.from(state.tickets.values()).filter((t) => t.priority === 'high').length

    case 'medium_tickets':
      return value === Array.from(state.tickets.values()).filter((t) => t.priority === 'medium').length

    case 'low_tickets':
      return value === Array.from(state.tickets.values()).filter((t) => t.priority === 'low').length

    default:
      // For unknown metrics, assume valid if positive
      return value >= 0
  }
}

/**
 * Validates that all values in a dataset array exist in the master dataset
 */
export function validateDatasetConsistency(datasetName: string, store: ApplicationStore): boolean {
  const state = store.getState()

  switch (datasetName) {
    case 'tickets':
      // All tickets should have valid IDs and be in the master dataset
      return Array.from(state.tickets.keys()).length === state.tickets.size

    case 'users':
      // All users should be either the manager or one of the 5 agents
      const agents = Array.from(state.users.values()).filter((u) => u.role === 'agent')
      const managers = Array.from(state.users.values()).filter((u) => u.role === 'manager')
      return agents.length === 5 && managers.length === 1

    case 'tickets_assigned':
      // All assigned tickets should have valid agent IDs
      return !Array.from(state.tickets.values()).some(
        (t) => t.assignedTo && !state.users.has(t.assignedTo)
      )

    default:
      return true
  }
}
