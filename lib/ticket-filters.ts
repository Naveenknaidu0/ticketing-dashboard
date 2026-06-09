import { Ticket } from '@/lib/store'

export type TicketScope = 'my-tickets' | 'team-tickets' | 'all-tickets'
export type DateRange = 'today' | 'yesterday' | 'this-week' | 'last-week' | 'this-month' | 'last-month' | 'this-quarter' | 'last-quarter' | 'this-year' | 'custom'

export interface ManagerFilters {
  scope: TicketScope
  teamMember?: string
  dateRange: DateRange
  customDateStart?: string
  customDateEnd?: string
  status?: string
  priority?: string
  category?: string
  slaStatus?: string
}

export const TEAM_MEMBERS = [
  { id: 'agent1', name: 'Sarah Johnson' },
  { id: 'agent2', name: 'Michael Chen' },
  { id: 'agent3', name: 'Emma Williams' },
  { id: 'agent4', name: 'James Rodriguez' },
  { id: 'agent5', name: 'David Kumar' },
]

export const DATE_RANGES = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'this-week', label: 'This Week' },
  { id: 'last-week', label: 'Last Week' },
  { id: 'this-month', label: 'This Month' },
  { id: 'last-month', label: 'Last Month' },
  { id: 'this-quarter', label: 'This Quarter' },
  { id: 'last-quarter', label: 'Last Quarter' },
  { id: 'this-year', label: 'This Year' },
  { id: 'custom', label: 'Custom Range' },
]

function getDateRange(range: DateRange): { start: Date; end: Date } {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const start = new Date(today)
  const end = new Date(today)
  end.setHours(23, 59, 59, 999)

  switch (range) {
    case 'today':
      return { start: today, end }

    case 'yesterday':
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayEnd = new Date(yesterday)
      yesterdayEnd.setHours(23, 59, 59, 999)
      return { start: yesterday, end: yesterdayEnd }

    case 'this-week':
      const weekStart = new Date(today)
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      return { start: weekStart, end }

    case 'last-week':
      const lastWeekStart = new Date(today)
      lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay() - 7)
      const lastWeekEnd = new Date(lastWeekStart)
      lastWeekEnd.setDate(lastWeekEnd.getDate() + 6)
      lastWeekEnd.setHours(23, 59, 59, 999)
      return { start: lastWeekStart, end: lastWeekEnd }

    case 'this-month':
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start: monthStart, end }

    case 'last-month':
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)
      lastMonthEnd.setHours(23, 59, 59, 999)
      return { start: lastMonthStart, end: lastMonthEnd }

    case 'this-quarter':
      const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      return { start: quarterStart, end }

    case 'last-quarter':
      const lastQuarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3 - 3, 1)
      const lastQuarterEnd = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 0)
      lastQuarterEnd.setHours(23, 59, 59, 999)
      return { start: lastQuarterStart, end: lastQuarterEnd }

    case 'this-year':
      const yearStart = new Date(now.getFullYear(), 0, 1)
      return { start: yearStart, end }

    default:
      return { start: today, end }
  }
}

export function applyManagerFilters(
  tickets: Ticket[],
  filters: ManagerFilters,
  managerId: string
): Ticket[] {
  let filtered = [...tickets]

  // Apply ticket scope filter
  if (filters.scope === 'my-tickets') {
    filtered = filtered.filter(t => t.assignedTo === managerId)
  } else if (filters.scope === 'team-tickets') {
    // Show only team member tickets (exclude manager-owned)
    filtered = filtered.filter(t => t.assignedTo && t.assignedTo !== managerId && t.assignedTo.startsWith('agent'))
  }
  // 'all-tickets' shows everything (no filtering)

  // Apply team member filter
  if (filters.teamMember && filters.teamMember !== 'all') {
    filtered = filtered.filter(t => t.assignedTo === filters.teamMember)
  }

  // Apply date range filter (on createdAt)
  if (filters.dateRange === 'custom') {
    if (filters.customDateStart && filters.customDateEnd) {
      const start = new Date(filters.customDateStart)
      const end = new Date(filters.customDateEnd)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter(t => {
        const ticketDate = new Date(t.createdAt)
        return ticketDate >= start && ticketDate <= end
      })
    }
  } else {
    const { start, end } = getDateRange(filters.dateRange)
    filtered = filtered.filter(t => {
      const ticketDate = new Date(t.createdAt)
      return ticketDate >= start && ticketDate <= end
    })
  }

  // Apply advanced filters
  if (filters.status) {
    filtered = filtered.filter(t => t.status === filters.status)
  }

  if (filters.priority) {
    filtered = filtered.filter(t => t.priority === filters.priority)
  }

  if (filters.category) {
    filtered = filtered.filter(t => t.category === filters.category)
  }

  if (filters.slaStatus) {
    filtered = filtered.filter(t => t.slaStatus === filters.slaStatus)
  }

  return filtered
}

export function getFilterSummary(filters: ManagerFilters): string[] {
  const summary: string[] = []

  if (filters.scope === 'my-tickets') {
    summary.push('My Tickets')
  } else if (filters.scope === 'team-tickets') {
    summary.push('Team Tickets')
  }

  if (filters.teamMember && filters.teamMember !== 'all') {
    const member = TEAM_MEMBERS.find(m => m.id === filters.teamMember)
    if (member) summary.push(member.name)
  }

  if (filters.priority) {
    summary.push(filters.priority.charAt(0).toUpperCase() + filters.priority.slice(1))
  }

  if (filters.dateRange !== 'today') {
    const range = DATE_RANGES.find(r => r.id === filters.dateRange)
    if (range) summary.push(range.label)
  }

  return summary
}
