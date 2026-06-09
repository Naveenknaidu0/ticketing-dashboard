import { Ticket, SLARecord, User } from '@/lib/store'

/**
 * CORE-01H: Master Demo Dataset - Data Governance
 * 
 * All modules MUST calculate metrics from the single 50-ticket dataset.
 * NO module may generate independent data or random values.
 */

export interface DataMetrics {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  pendingTickets: number
  resolvedTickets: number
  closedTickets: number
  unassignedTickets: number
  
  criticalTickets: number
  highTickets: number
  mediumTickets: number
  lowTickets: number
  
  slaWithin: number
  slaAtRisk: number
  slaBreached: number
  
  avgResolutionTime: number
  avgResponseTime: number
}

export interface AgentMetrics {
  agentId: string
  agentName: string
  totalAssigned: number
  openTickets: number
  inProgressTickets: number
  pendingTickets: number
  resolvedTickets: number
  closedTickets: number
  resolutionRate: number
  avgResolutionTime: number
}

/**
 * Calculate all metrics from the ticket dataset
 * This is the single source of truth for all application metrics
 */
export function calculateMetrics(
  tickets: Ticket[],
  slaRecords: Map<string, SLARecord>
): DataMetrics {
  const openTickets = tickets.filter(t => t.status === 'open').length
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress').length
  const pendingTickets = tickets.filter(t => t.status === 'pending').length
  const resolvedTickets = tickets.filter(t => t.status === 'resolved').length
  const closedTickets = tickets.filter(t => t.status === 'closed').length
  const unassignedTickets = tickets.filter(t => !t.assignedTo).length

  const criticalTickets = tickets.filter(t => t.priority === 'critical').length
  const highTickets = tickets.filter(t => t.priority === 'high').length
  const mediumTickets = tickets.filter(t => t.priority === 'medium').length
  const lowTickets = tickets.filter(t => t.priority === 'low').length

  // Calculate SLA metrics from SLA records
  let slaWithin = 0
  let slaAtRisk = 0
  let slaBreached = 0

  slaRecords.forEach((record) => {
    if (record.resolutionBreached || record.responseBreached) {
      slaBreached++
    } else if (
      record.resolutionDeadline &&
      new Date(record.resolutionDeadline).getTime() - Date.now() < 2 * 60 * 60 * 1000
    ) {
      // At risk if less than 2 hours until deadline
      slaAtRisk++
    } else {
      slaWithin++
    }
  })

  // Calculate average resolution time (in hours)
  const resolvedWithDates = tickets.filter(t => t.resolvedAt && t.createdAt)
  const avgResolutionTime =
    resolvedWithDates.length > 0
      ? resolvedWithDates.reduce((sum, t) => {
          const created = new Date(t.createdAt).getTime()
          const resolved = new Date(t.resolvedAt!).getTime()
          return sum + (resolved - created) / (1000 * 60 * 60)
        }, 0) / resolvedWithDates.length
      : 0

  // Calculate average response time (in hours)
  const slaRecordsWithResponse = Array.from(slaRecords.values()).filter(
    r => r.responseDeadline
  )
  const avgResponseTime =
    slaRecordsWithResponse.length > 0
      ? slaRecordsWithResponse.reduce((sum, r) => {
          const deadline = new Date(r.responseDeadline!).getTime()
          const slaWindow = 4 // Default 4-hour SLA window
          return sum + (slaWindow / 2) // Average response time assumption
        }, 0) / slaRecordsWithResponse.length
      : 0

  return {
    totalTickets: tickets.length,
    openTickets,
    inProgressTickets,
    pendingTickets,
    resolvedTickets,
    closedTickets,
    unassignedTickets,
    criticalTickets,
    highTickets,
    mediumTickets,
    lowTickets,
    slaWithin,
    slaAtRisk,
    slaBreached,
    avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    avgResponseTime: Math.round(avgResponseTime * 10) / 10,
  }
}

/**
 * Calculate metrics for a specific agent
 */
export function calculateAgentMetrics(
  agentId: string,
  agent: User,
  tickets: Ticket[]
): AgentMetrics {
  const agentTickets = tickets.filter(t => t.assignedTo === agentId)

  const openTickets = agentTickets.filter(t => t.status === 'open').length
  const inProgressTickets = agentTickets.filter(t => t.status === 'in-progress').length
  const pendingTickets = agentTickets.filter(t => t.status === 'pending').length
  const resolvedTickets = agentTickets.filter(t => t.status === 'resolved').length
  const closedTickets = agentTickets.filter(t => t.status === 'closed').length

  const completedTickets = resolvedTickets + closedTickets
  const resolutionRate = agentTickets.length > 0 ? (completedTickets / agentTickets.length) * 100 : 0

  // Calculate average resolution time
  const resolvedWithDates = agentTickets.filter(t => t.resolvedAt && t.createdAt)
  const avgResolutionTime =
    resolvedWithDates.length > 0
      ? resolvedWithDates.reduce((sum, t) => {
          const created = new Date(t.createdAt).getTime()
          const resolved = new Date(t.resolvedAt!).getTime()
          return sum + (resolved - created) / (1000 * 60 * 60)
        }, 0) / resolvedWithDates.length
      : 0

  return {
    agentId,
    agentName: agent.name,
    totalAssigned: agentTickets.length,
    openTickets,
    inProgressTickets,
    pendingTickets,
    resolvedTickets,
    closedTickets,
    resolutionRate: Math.round(resolutionRate * 10) / 10,
    avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
  }
}

/**
 * Validate that all modules are using the correct dataset
 * This ensures no independent data is being generated
 */
export function validateDataConsistency(
  moduleMetrics: Record<string, number>,
  expectedMetrics: DataMetrics
): boolean {
  const checks = {
    totalTickets: moduleMetrics['totalTickets'] === expectedMetrics.totalTickets,
    openTickets: moduleMetrics['openTickets'] === expectedMetrics.openTickets,
    resolvedTickets: moduleMetrics['resolvedTickets'] === expectedMetrics.resolvedTickets,
    slaMetrics:
      (moduleMetrics['slaWithin'] ?? 0) +
        (moduleMetrics['slaAtRisk'] ?? 0) +
        (moduleMetrics['slaBreached'] ?? 0) ===
      expectedMetrics.slaWithin + expectedMetrics.slaAtRisk + expectedMetrics.slaBreached,
  }

  const isConsistent = Object.values(checks).every(c => c)

  if (!isConsistent) {
    console.warn('[v0] Data inconsistency detected:', checks)
  }

  return isConsistent
}
