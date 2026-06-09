// Audit Log Engine - Enterprise Governance and Compliance Layer
// Complete tracking of all changes across Assignment Engine

export type AuditEventType = 
  | 'queue_created' | 'queue_updated' | 'queue_deleted'
  | 'skill_created' | 'skill_updated' | 'skill_deleted'
  | 'rule_created' | 'rule_updated' | 'rule_deleted'
  | 'automation_created' | 'automation_updated' | 'automation_deleted'
  | 'config_created' | 'config_updated' | 'config_deleted'
  | 'assignment_created' | 'assignment_updated' | 'assignment_deleted'
  | 'simulation_executed' | 'simulation_completed' | 'simulation_failed'

export type AuditModule = 'queues' | 'skills' | 'rules' | 'automations' | 'configuration' | 'assignments' | 'simulations'

export type AuditAction = 'create' | 'update' | 'delete' | 'publish' | 'disable' | 'archive' | 'restore' | 'execute' | 'rollback'

export interface AuditChangeLog {
  fieldName: string
  fieldLabel: string
  previousValue: any
  newValue: any
  changeType: 'modified' | 'added' | 'removed'
}

export interface AuditRecord {
  id: string
  timestamp: string
  eventType: AuditEventType
  module: AuditModule
  action: AuditAction
  entityId: string
  entityType: string
  entityName: string
  userId: string
  userName: string
  userRole: string
  userEmail?: string
  ipAddress?: string
  userAgent?: string
  changes: AuditChangeLog[]
  beforeState?: Record<string, any>
  afterState?: Record<string, any>
  reason?: string
  source: 'ui' | 'api' | 'import' | 'sync' | 'system'
  status: 'success' | 'failed' | 'partial'
  errorMessage?: string
  metadata?: Record<string, any>
  relatedRecords?: string[]
}

export interface AuditSnapshot {
  recordId: string
  version: number
  entityId: string
  entityType: string
  snapshotDate: string
  state: Record<string, any>
  changedBy: string
}

export interface AuditSummary {
  totalRecords: number
  recordsByModule: Record<AuditModule, number>
  recordsByAction: Record<AuditAction, number>
  recordsByUser: Record<string, number>
  dateRange: { from: string; to: string }
  averageRecordsPerDay: number
}

// In-memory audit store (in production, this would be a database)
export let AUDIT_LOG_STORE: AuditRecord[] = []
export let AUDIT_SNAPSHOTS: AuditSnapshot[] = []

// Configuration
export const AUDIT_CONFIG = {
  maxRecordsStored: 100000,
  retentionDays: 2555, // 7 years
  enableChangeLogging: true,
  enableStateSnapshots: true,
  enableIpTracking: true,
  enableUserAgentTracking: true,
}

// Core Logging Functions
export function logAuditEvent(data: {
  eventType: AuditEventType
  module: AuditModule
  action: AuditAction
  entityId: string
  entityType: string
  entityName: string
  userId: string
  userName: string
  userRole: string
  changes?: AuditChangeLog[]
  beforeState?: Record<string, any>
  afterState?: Record<string, any>
  reason?: string
  source?: 'ui' | 'api' | 'import' | 'sync' | 'system'
  metadata?: Record<string, any>
}): AuditRecord {
  const record: AuditRecord = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    eventType: data.eventType,
    module: data.module,
    action: data.action,
    entityId: data.entityId,
    entityType: data.entityType,
    entityName: data.entityName,
    userId: data.userId,
    userName: data.userName,
    userRole: data.userRole,
    changes: data.changes || [],
    beforeState: data.beforeState,
    afterState: data.afterState,
    reason: data.reason,
    source: data.source || 'ui',
    status: 'success',
    metadata: data.metadata,
    ipAddress: AUDIT_CONFIG.enableIpTracking ? '127.0.0.1' : undefined,
    userAgent: AUDIT_CONFIG.enableUserAgentTracking ? 'Mozilla/5.0' : undefined,
  }

  AUDIT_LOG_STORE.push(record)

  // Create snapshot if enabled
  if (AUDIT_CONFIG.enableStateSnapshots && data.afterState) {
    createSnapshot(data.entityId, data.entityType, data.afterState, data.userName)
  }

  // Maintain size limit
  if (AUDIT_LOG_STORE.length > AUDIT_CONFIG.maxRecordsStored) {
    AUDIT_LOG_STORE = AUDIT_LOG_STORE.slice(-AUDIT_CONFIG.maxRecordsStored)
  }

  return record
}

export function createSnapshot(
  entityId: string,
  entityType: string,
  state: Record<string, any>,
  changedBy: string
): AuditSnapshot {
  const version = AUDIT_SNAPSHOTS.filter(s => s.entityId === entityId).length + 1

  const snapshot: AuditSnapshot = {
    recordId: `snap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    version,
    entityId,
    entityType,
    snapshotDate: new Date().toISOString(),
    state,
    changedBy,
  }

  AUDIT_SNAPSHOTS.push(snapshot)
  return snapshot
}

// Query Functions
export function getAuditRecords(filters?: {
  module?: AuditModule
  entityId?: string
  entityType?: string
  userId?: string
  action?: AuditAction
  dateFrom?: string
  dateTo?: string
  limit?: number
}): AuditRecord[] {
  let results = [...AUDIT_LOG_STORE]

  if (filters?.module) {
    results = results.filter(r => r.module === filters.module)
  }

  if (filters?.entityId) {
    results = results.filter(r => r.entityId === filters.entityId)
  }

  if (filters?.entityType) {
    results = results.filter(r => r.entityType === filters.entityType)
  }

  if (filters?.userId) {
    results = results.filter(r => r.userId === filters.userId)
  }

  if (filters?.action) {
    results = results.filter(r => r.action === filters.action)
  }

  if (filters?.dateFrom) {
    results = results.filter(r => new Date(r.timestamp) >= new Date(filters.dateFrom!))
  }

  if (filters?.dateTo) {
    results = results.filter(r => new Date(r.timestamp) <= new Date(filters.dateTo!))
  }

  results = results.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  if (filters?.limit) {
    results = results.slice(0, filters.limit)
  }

  return results
}

export function getEntityHistory(entityId: string, entityType: string): AuditRecord[] {
  return getAuditRecords({
    entityId,
    entityType,
  })
}

export function getEntitySnapshots(entityId: string): AuditSnapshot[] {
  return AUDIT_SNAPSHOTS.filter(s => s.entityId === entityId).sort((a, b) => b.version - a.version)
}

export function getRecordsByUser(userId: string, limit: number = 100): AuditRecord[] {
  return getAuditRecords({ userId, limit })
}

export function getRecordsByModule(module: AuditModule, limit: number = 100): AuditRecord[] {
  return getAuditRecords({ module, limit })
}

export function searchAuditLogs(query: string, limit: number = 50): AuditRecord[] {
  const lowerQuery = query.toLowerCase()
  return AUDIT_LOG_STORE.filter(
    r =>
      r.entityName.toLowerCase().includes(lowerQuery) ||
      r.userName.toLowerCase().includes(lowerQuery) ||
      r.entityId.toLowerCase().includes(lowerQuery) ||
      r.reason?.toLowerCase().includes(lowerQuery)
  )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

// Statistics
export function getAuditSummary(dateFrom?: string, dateTo?: string): AuditSummary {
  const records = getAuditRecords({
    dateFrom: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    dateTo: dateTo || new Date().toISOString(),
  })

  const recordsByModule: Record<AuditModule, number> = {
    queues: 0,
    skills: 0,
    rules: 0,
    automations: 0,
    configuration: 0,
    assignments: 0,
    simulations: 0,
  }

  const recordsByAction: Record<AuditAction, number> = {
    create: 0,
    update: 0,
    delete: 0,
    publish: 0,
    disable: 0,
    archive: 0,
    restore: 0,
    execute: 0,
    rollback: 0,
  }

  const recordsByUser: Record<string, number> = {}

  records.forEach(r => {
    recordsByModule[r.module]++
    recordsByAction[r.action]++
    recordsByUser[r.userName] = (recordsByUser[r.userName] || 0) + 1
  })

  const daysDiff = Math.max(
    1,
    Math.ceil((new Date(dateTo || new Date()).getTime() - new Date(dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).getTime()) / (24 * 60 * 60 * 1000))
  )

  return {
    totalRecords: records.length,
    recordsByModule,
    recordsByAction,
    recordsByUser,
    dateRange: {
      from: dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      to: dateTo || new Date().toISOString(),
    },
    averageRecordsPerDay: Math.round(records.length / daysDiff),
  }
}

export function getRecentActivity(limit: number = 20): AuditRecord[] {
  return AUDIT_LOG_STORE.slice(-limit).reverse()
}

export function getMostActiveUsers(limit: number = 10): Array<{ userName: string; userId: string; recordCount: number }> {
  const userStats: Record<string, { userId: string; recordCount: number }> = {}

  AUDIT_LOG_STORE.forEach(r => {
    if (!userStats[r.userName]) {
      userStats[r.userName] = { userId: r.userId, recordCount: 0 }
    }
    userStats[r.userName].recordCount++
  })

  return Object.entries(userStats)
    .map(([userName, data]) => ({ userName, ...data }))
    .sort((a, b) => b.recordCount - a.recordCount)
    .slice(0, limit)
}

// Advanced Operations
export function rollbackToSnapshot(snapshotId: string): { success: boolean; message: string } {
  const snapshot = AUDIT_SNAPSHOTS.find(s => s.recordId === snapshotId)

  if (!snapshot) {
    return { success: false, message: 'Snapshot not found' }
  }

  logAuditEvent({
    eventType: 'queue_updated',
    module: 'queues',
    action: 'rollback',
    entityId: snapshot.entityId,
    entityType: snapshot.entityType,
    entityName: `Rollback to v${snapshot.version}`,
    userId: 'system',
    userName: 'System',
    userRole: 'admin',
    beforeState: snapshot.state,
    afterState: snapshot.state,
    reason: `Rolled back to snapshot version ${snapshot.version}`,
    source: 'system',
  })

  return { success: true, message: `Successfully rolled back to version ${snapshot.version}` }
}

export function exportAuditLog(filters?: {
  module?: AuditModule
  dateFrom?: string
  dateTo?: string
}): string {
  const records = getAuditRecords(filters)
  return JSON.stringify(records, null, 2)
}

export function getAuditReport(): {
  totalRecords: number
  totalSnapshots: number
  uniqueEntities: number
  uniqueUsers: number
  oldestRecord: string
  newestRecord: string
} {
  const uniqueEntities = new Set(AUDIT_LOG_STORE.map(r => r.entityId)).size
  const uniqueUsers = new Set(AUDIT_LOG_STORE.map(r => r.userId)).size

  return {
    totalRecords: AUDIT_LOG_STORE.length,
    totalSnapshots: AUDIT_SNAPSHOTS.length,
    uniqueEntities,
    uniqueUsers,
    oldestRecord: AUDIT_LOG_STORE[0]?.timestamp || 'N/A',
    newestRecord: AUDIT_LOG_STORE[AUDIT_LOG_STORE.length - 1]?.timestamp || 'N/A',
  }
}

// Compliance exports
export function generateComplianceReport(dateFrom: string, dateTo: string): string {
  const summary = getAuditSummary(dateFrom, dateTo)
  const report = {
    reportDate: new Date().toISOString(),
    period: { from: dateFrom, to: dateTo },
    summary,
    topUsers: getMostActiveUsers(5),
    stats: getAuditReport(),
  }
  return JSON.stringify(report, null, 2)
}
