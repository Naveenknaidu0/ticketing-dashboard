/**
 * Dashboard Audit Engine
 * Tracks all dashboard governance changes - profiles, layouts, widgets
 * Provides audit trail and change history
 */

import { logAuditEvent } from './audit-log-engine'

export interface DashboardAuditEntry {
  id: string
  timestamp: string
  eventType: 'profile_created' | 'profile_updated' | 'profile_published' | 'profile_archived' |
    'layout_updated' | 'layout_reset' | 'widget_added' | 'widget_removed' | 'widget_reordered' |
    'permission_changed' | 'tab_added' | 'tab_removed' | 'tab_reordered'
  targetType: 'profile' | 'layout' | 'widget' | 'permission' | 'tab'
  targetId: string
  targetName: string
  action: 'create' | 'update' | 'delete' | 'publish' | 'archive'
  userId: string
  userName: string
  userRole: string
  beforeState?: Record<string, any>
  afterState?: Record<string, any>
  changes: Array<{
    field: string
    oldValue: any
    newValue: any
  }>
  reason?: string
}

let AUDIT_LOG: DashboardAuditEntry[] = []

class DashboardAuditEngineClass {
  /**
   * Log a dashboard event
   */
  logEvent(event: Omit<DashboardAuditEntry, 'id' | 'timestamp'>): DashboardAuditEntry {
    const entry: DashboardAuditEntry = {
      ...event,
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }

    AUDIT_LOG.push(entry)

    // Also log to main audit system
    logAuditEvent({
      eventType: `dashboard_${event.eventType}`,
      module: 'dashboard',
      action: event.action,
      entityId: event.targetId,
      entityType: event.targetType,
      entityName: event.targetName,
      userId: event.userId,
      userName: event.userName,
      userRole: event.userRole,
      beforeState: event.beforeState,
      afterState: event.afterState,
      source: 'ui',
    })

    return entry
  }

  /**
   * Get audit entries for a target
   */
  getAuditTrail(
    targetId: string,
    limit?: number,
  ): DashboardAuditEntry[] {
    const filtered = AUDIT_LOG.filter(e => e.targetId === targetId).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return limit ? filtered.slice(0, limit) : filtered
  }

  /**
   * Get audit entries for a user
   */
  getUserAuditTrail(userId: string, limit?: number): DashboardAuditEntry[] {
    const filtered = AUDIT_LOG.filter(e => e.userId === userId).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return limit ? filtered.slice(0, limit) : filtered
  }

  /**
   * Get audit entries by type
   */
  getAuditByType(eventType: DashboardAuditEntry['eventType'], limit?: number): DashboardAuditEntry[] {
    const filtered = AUDIT_LOG.filter(e => e.eventType === eventType).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )

    return limit ? filtered.slice(0, limit) : filtered
  }

  /**
   * Get recent changes across all dashboards
   */
  getRecentChanges(hours: number = 24): DashboardAuditEntry[] {
    const cutoff = new Date(Date.now() - hours * 3600000)

    return AUDIT_LOG.filter(e => new Date(e.timestamp) > cutoff).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
  }

  /**
   * Get audit summary for a time period
   */
  getAuditSummary(startDate: Date, endDate: Date): {
    totalEvents: number
    byEventType: Record<string, number>
    byUser: Record<string, number>
    byTargetType: Record<string, number>
  } {
    const filtered = AUDIT_LOG.filter(e => {
      const ts = new Date(e.timestamp)
      return ts >= startDate && ts <= endDate
    })

    return {
      totalEvents: filtered.length,
      byEventType: filtered.reduce(
        (acc, e) => {
          acc[e.eventType] = (acc[e.eventType] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byUser: filtered.reduce(
        (acc, e) => {
          acc[e.userId] = (acc[e.userId] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
      byTargetType: filtered.reduce(
        (acc, e) => {
          acc[e.targetType] = (acc[e.targetType] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    }
  }

  /**
   * Get change history for a specific field
   */
  getFieldChangeHistory(targetId: string, field: string): Array<{
    timestamp: string
    oldValue: any
    newValue: any
    changedBy: string
    reason?: string
  }> {
    return this.getAuditTrail(targetId)
      .filter(e => e.changes.some(c => c.field === field))
      .flatMap(e => 
        e.changes
          .filter(c => c.field === field)
          .map(c => ({
            timestamp: e.timestamp,
            oldValue: c.oldValue,
            newValue: c.newValue,
            changedBy: e.userName,
            reason: e.reason,
          }))
      )
  }

  /**
   * Compare two versions
   */
  compareVersions(targetId: string, version1Idx: number, version2Idx: number): {
    before: any
    after: any
    differences: Array<{
      field: string
      oldValue: any
      newValue: any
    }>
  } {
    const trail = this.getAuditTrail(targetId)
    const v1 = trail[version1Idx]
    const v2 = trail[version2Idx]

    if (!v1 || !v2) {
      return { before: null, after: null, differences: [] }
    }

    const differences = v2.changes || []

    return {
      before: v1.beforeState,
      after: v2.afterState,
      differences,
    }
  }

  /**
   * Get rollback points (publishable states)
   */
  getRollbackPoints(targetId: string): DashboardAuditEntry[] {
    return this.getAuditTrail(targetId).filter(
      e => e.action === 'publish' || e.action === 'create',
    )
  }

  /**
   * Export audit report
   */
  exportAuditReport(targetId: string, format: 'csv' | 'json' = 'csv'): string {
    const trail = this.getAuditTrail(targetId)

    if (format === 'json') {
      return JSON.stringify(trail, null, 2)
    }

    // CSV format
    const headers = [
      'Timestamp',
      'Event Type',
      'Action',
      'Target Type',
      'User',
      'User Role',
      'Reason',
    ]
    const rows = trail.map(e => [
      e.timestamp,
      e.eventType,
      e.action,
      e.targetType,
      e.userName,
      e.userRole,
      e.reason || '',
    ])

    const csv = [headers, ...rows].map(row => row.map(v => `"${v}"`).join(',')).join('\n')

    return csv
  }

  /**
   * Get audit stats
   */
  getAuditStats(): {
    totalEntries: number
    dateRange: { start: string; end: string }
    uniqueUsers: number
    uniqueTargets: number
    eventTypes: string[]
  } {
    return {
      totalEntries: AUDIT_LOG.length,
      dateRange: {
        start: AUDIT_LOG.length > 0 ? AUDIT_LOG[0].timestamp : new Date().toISOString(),
        end: AUDIT_LOG.length > 0 ? AUDIT_LOG[AUDIT_LOG.length - 1].timestamp : new Date().toISOString(),
      },
      uniqueUsers: new Set(AUDIT_LOG.map(e => e.userId)).size,
      uniqueTargets: new Set(AUDIT_LOG.map(e => e.targetId)).size,
      eventTypes: [...new Set(AUDIT_LOG.map(e => e.eventType))],
    }
  }

  /**
   * Clear old audit logs (older than X days)
   */
  clearOldLogs(daysOld: number = 90): number {
    const cutoff = new Date(Date.now() - daysOld * 24 * 3600000)
    const before = AUDIT_LOG.length
    AUDIT_LOG = AUDIT_LOG.filter(e => new Date(e.timestamp) > cutoff)
    return before - AUDIT_LOG.length
  }

  /**
   * Get all audit events (sorted by timestamp descending)
   */
  getAllEvents(limit?: number): DashboardAuditEntry[] {
    const sorted = AUDIT_LOG.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    return limit ? sorted.slice(0, limit) : sorted
  }
}

export const dashboardAuditEngine = new DashboardAuditEngineClass()
