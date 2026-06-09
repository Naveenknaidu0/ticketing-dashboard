/**
 * Global Filter Synchronization
 * 
 * Ensures that filter changes are synchronized across all modules:
 * - Dashboard
 * - Reports
 * - SLA Analytics
 * - Leaderboard
 * - Workload
 */

export interface GlobalFilters {
  dateRange?: {
    start: string
    end: string
  }
  group?: string
  agent?: string
  priority?: 'critical' | 'high' | 'medium' | 'low' | 'all'
  status?: 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed' | 'all'
}

class FilterSynchronizer {
  private filters: GlobalFilters = {
    priority: 'all',
    status: 'all',
  }
  private listeners: Set<(filters: GlobalFilters) => void> = new Set()

  updateFilters(updates: Partial<GlobalFilters>): void {
    this.filters = { ...this.filters, ...updates }
    this.notifyListeners()
  }

  getFilters(): GlobalFilters {
    return { ...this.filters }
  }

  subscribe(listener: (filters: GlobalFilters) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.getFilters()))
  }

  reset(): void {
    this.filters = {
      priority: 'all',
      status: 'all',
    }
    this.notifyListeners()
  }
}

// Global singleton instance
export const filterSynchronizer = new FilterSynchronizer()

/**
 * Apply filters to tickets
 */
export function applyFilters<T extends { priority?: string; status?: string; assignedTo?: string; createdAt?: string }>(
  items: T[],
  filters: GlobalFilters
): T[] {
  let result = items

  // Filter by priority
  if (filters.priority && filters.priority !== 'all') {
    result = result.filter(item => item.priority === filters.priority)
  }

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    result = result.filter(item => item.status === filters.status)
  }

  // Filter by agent
  if (filters.agent) {
    result = result.filter(item => item.assignedTo === filters.agent)
  }

  // Filter by group (future implementation for group-based filtering)
  if (filters.group) {
    // TODO: Implement group-based filtering when group mapping is available
  }

  // Filter by date range
  if (filters.dateRange) {
    result = result.filter(item => {
      if (!item.createdAt) return true
      const itemDate = new Date(item.createdAt).getTime()
      const startDate = new Date(filters.dateRange!.start).getTime()
      const endDate = new Date(filters.dateRange!.end).getTime()
      return itemDate >= startDate && itemDate <= endDate
    })
  }

  return result
}

/**
 * Get filter labels for display
 */
export function getFilterLabels(filters: GlobalFilters): string[] {
  const labels: string[] = []

  if (filters.priority && filters.priority !== 'all') {
    labels.push(`Priority: ${filters.priority}`)
  }

  if (filters.status && filters.status !== 'all') {
    labels.push(`Status: ${filters.status}`)
  }

  if (filters.agent) {
    labels.push(`Agent: ${filters.agent}`)
  }

  if (filters.group) {
    labels.push(`Group: ${filters.group}`)
  }

  if (filters.dateRange) {
    labels.push(`Date: ${filters.dateRange.start} to ${filters.dateRange.end}`)
  }

  return labels
}
