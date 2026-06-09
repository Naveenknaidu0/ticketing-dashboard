import { TicketFilter } from '@/app/app-context'

/**
 * Navigation utilities for dashboard interactions
 */

export function buildTicketListUrl(filters: TicketFilter): string {
  const params = new URLSearchParams()

  if (filters.status?.length) {
    params.append('status', filters.status.join(','))
  }
  if (filters.priority?.length) {
    params.append('priority', filters.priority.join(','))
  }
  if (filters.type?.length) {
    params.append('type', filters.type.join(','))
  }
  if (filters.group?.length) {
    params.append('group', filters.group.join(','))
  }
  if (filters.dueToday) {
    params.append('dueToday', 'true')
  }
  if (filters.slaRisk) {
    params.append('slaRisk', 'true')
  }
  if (filters.waitingCustomer) {
    params.append('waitingCustomer', 'true')
  }
  if (filters.resolved) {
    params.append('resolved', 'true')
  }
  if (filters.resolvedToday) {
    params.append('resolvedToday', 'true')
  }
  if (filters.overdue) {
    params.append('overdue', 'true')
  }

  const queryString = params.toString()
  return `/tickets${queryString ? `?${queryString}` : ''}`
}

export function navigateToTickets(router: any, filters: TicketFilter) {
  router.push(buildTicketListUrl(filters))
}

export function navigateToTicketWorkspace(router: any, ticketId: string) {
  router.push(`/tickets/${ticketId}`)
}

export function navigateToTodo(router: any, filters?: TicketFilter) {
  const params = new URLSearchParams()
  if (filters?.status?.length) {
    params.append('status', filters.status.join(','))
  }
  const queryString = params.toString()
  router.push(`/todo${queryString ? `?${queryString}` : ''}`)
}

export function navigateToKnowledgeBase(router: any) {
  router.push('/knowledge-base')
}

export function navigateToLeaderboard(router: any) {
  router.push('/leaderboard')
}

export function navigateToReports(router: any) {
  router.push('/reports')
}

export function navigateToSLAAnalytics(router: any, group?: string) {
  const params = group ? `?group=${group}` : ''
  router.push(`/sla-analytics${params}`)
}

export function navigateToWorkload(router: any) {
  router.push('/workload')
}
