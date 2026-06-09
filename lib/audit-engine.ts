'use server'

import { Ticket } from './types'

/**
 * PHASE 3A.14 - Audit Engine
 * Comprehensive tracking of all assignment decisions and system activities
 */

interface AuditEntry {
  id: string
  timestamp: string
  ticketId: string
  eventType: string
  queueSelected?: string
  skillsEvaluated?: string[]
  rulesApplied?: string[]
  agentSelected?: string
  capacityUsed?: number
  fallbackUsed?: boolean
  escalationTriggered?: boolean
  details: Record<string, any>
  auditTrail: string[]
}

export class AuditEngine {
  private auditLog: AuditEntry[] = []
  private readonly MAX_AUDIT_ENTRIES = 10000

  /**
   * Record assignment decision
   */
  recordAssignmentDecision(
    ticketId: string,
    queueId: string | undefined,
    skillsMatched: string[],
    rulesApplied: string[],
    agentId: string | undefined,
    fallbackUsed: boolean,
    escalationTriggered: boolean,
    auditTrail: string[],
    additionalDetails: Record<string, any> = {}
  ): void {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ticketId,
      eventType: 'ASSIGNMENT_DECISION',
      queueSelected: queueId,
      skillsEvaluated: skillsMatched,
      rulesApplied,
      agentSelected: agentId,
      fallbackUsed,
      escalationTriggered,
      details: {
        ...additionalDetails,
      },
      auditTrail,
    }

    this.auditLog.push(entry)

    // Maintain maximum size
    if (this.auditLog.length > this.MAX_AUDIT_ENTRIES) {
      this.auditLog = this.auditLog.slice(-this.MAX_AUDIT_ENTRIES)
    }
  }

  /**
   * Record escalation event
   */
  recordEscalation(
    ticketId: string,
    fromLevel: number,
    toLevel: number,
    reason: string,
    details: Record<string, any> = {}
  ): void {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ticketId,
      eventType: 'ESCALATION',
      escalationTriggered: true,
      details: {
        fromLevel,
        toLevel,
        reason,
        ...details,
      },
      auditTrail: [`Escalated from L${fromLevel} to L${toLevel}: ${reason}`],
    }

    this.auditLog.push(entry)

    if (this.auditLog.length > this.MAX_AUDIT_ENTRIES) {
      this.auditLog = this.auditLog.slice(-this.MAX_AUDIT_ENTRIES)
    }
  }

  /**
   * Record fallback event
   */
  recordFallback(ticketId: string, reason: string, fallbackTarget: string, details: Record<string, any> = {}): void {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ticketId,
      eventType: 'FALLBACK',
      fallbackUsed: true,
      details: {
        reason,
        fallbackTarget,
        ...details,
      },
      auditTrail: [`Fallback triggered: ${reason} → ${fallbackTarget}`],
    }

    this.auditLog.push(entry)

    if (this.auditLog.length > this.MAX_AUDIT_ENTRIES) {
      this.auditLog = this.auditLog.slice(-this.MAX_AUDIT_ENTRIES)
    }
  }

  /**
   * Record assignment failure
   */
  recordFailure(ticketId: string, reason: string, details: Record<string, any> = {}): void {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ticketId,
      eventType: 'ASSIGNMENT_FAILURE',
      details: {
        reason,
        ...details,
      },
      auditTrail: [`Assignment failed: ${reason}`],
    }

    this.auditLog.push(entry)

    if (this.auditLog.length > this.MAX_AUDIT_ENTRIES) {
      this.auditLog = this.auditLog.slice(-this.MAX_AUDIT_ENTRIES)
    }
  }

  /**
   * Record simulation
   */
  recordSimulation(
    ticketId: string,
    queueId: string | undefined,
    agentId: string | undefined,
    simulationResults: Record<string, any>
  ): void {
    const entry: AuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ticketId,
      eventType: 'SIMULATION',
      queueSelected: queueId,
      agentSelected: agentId,
      details: simulationResults,
      auditTrail: ['Simulation run - no actual assignment'],
    }

    this.auditLog.push(entry)

    if (this.auditLog.length > this.MAX_AUDIT_ENTRIES) {
      this.auditLog = this.auditLog.slice(-this.MAX_AUDIT_ENTRIES)
    }
  }

  /**
   * Get full audit trail for a ticket
   */
  getTicketAuditTrail(ticketId: string): AuditEntry[] {
    return this.auditLog.filter(entry => entry.ticketId === ticketId).sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    })
  }

  /**
   * Get audit entries by event type
   */
  getEntriesByType(eventType: string, limit: number = 100): AuditEntry[] {
    return this.auditLog
      .filter(entry => entry.eventType === eventType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }

  /**
   * Get audit summary for a date range
   */
  getAuditSummary(
    startDate: Date,
    endDate: Date
  ): {
    totalEvents: number
    assignments: number
    escalations: number
    fallbacks: number
    failures: number
    simulations: number
    successRate: number
  } {
    const entries = this.auditLog.filter(entry => {
      const entryTime = new Date(entry.timestamp).getTime()
      return entryTime >= startDate.getTime() && entryTime <= endDate.getTime()
    })

    const assignments = entries.filter(e => e.eventType === 'ASSIGNMENT_DECISION').length
    const escalations = entries.filter(e => e.eventType === 'ESCALATION').length
    const fallbacks = entries.filter(e => e.eventType === 'FALLBACK').length
    const failures = entries.filter(e => e.eventType === 'ASSIGNMENT_FAILURE').length
    const simulations = entries.filter(e => e.eventType === 'SIMULATION').length

    const successfulAssignments = assignments - failures
    const successRate = assignments > 0 ? (successfulAssignments / assignments) * 100 : 0

    return {
      totalEvents: entries.length,
      assignments,
      escalations,
      fallbacks,
      failures,
      simulations,
      successRate,
    }
  }

  /**
   * Export audit log as JSON
   */
  exportAuditLog(filters?: { startDate?: Date; endDate?: Date; ticketId?: string }): string {
    let entries = [...this.auditLog]

    if (filters?.startDate && filters?.endDate) {
      entries = entries.filter(entry => {
        const entryTime = new Date(entry.timestamp).getTime()
        return (
          entryTime >= filters.startDate!.getTime() &&
          entryTime <= filters.endDate!.getTime()
        )
      })
    }

    if (filters?.ticketId) {
      entries = entries.filter(entry => entry.ticketId === filters.ticketId)
    }

    return JSON.stringify(entries, null, 2)
  }

  /**
   * Clear old audit entries (older than specified days)
   */
  clearOldEntries(daysOld: number = 90): number {
    const cutoffTime = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).getTime()
    const beforeCount = this.auditLog.length

    this.auditLog = this.auditLog.filter(entry => {
      const entryTime = new Date(entry.timestamp).getTime()
      return entryTime >= cutoffTime
    })

    return beforeCount - this.auditLog.length
  }

  /**
   * Get real-time audit activity
   */
  getRecentActivity(lastNMinutes: number = 60): AuditEntry[] {
    const cutoffTime = Date.now() - lastNMinutes * 60 * 1000

    return this.auditLog
      .filter(entry => new Date(entry.timestamp).getTime() >= cutoffTime)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  /**
   * Get total audit log size
   */
  getLogSize(): number {
    return this.auditLog.length
  }
}

export const auditEngine = new AuditEngine()
