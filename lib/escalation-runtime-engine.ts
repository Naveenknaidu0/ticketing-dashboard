'use server'

import { Ticket, EscalationRule, User, AssignmentQueue } from './types'

/**
 * PHASE 3A.11 - Escalation Engine
 * Handles ticket escalation when no response or SLA breach occurs
 */

interface EscalationContext {
  ticket: Ticket
  currentAgent?: User
  currentQueue?: AssignmentQueue
  escalationRules: EscalationRule[]
  auditTrail: string[]
}

interface EscalationResult {
  escalated: boolean
  escalationLevel: number
  previousAgent?: User
  escalatedToAgent?: User
  escalatedToQueue?: AssignmentQueue
  reason: string
  auditTrail: string[]
}

export class EscalationEngine {
  private escalationHistory: Array<{
    ticketId: string
    escalationLevel: number
    escalatedAt: string
  }> = []

  /**
   * Check if ticket should be escalated based on no-response condition
   */
  async checkNoResponseEscalation(
    ticket: Ticket,
    currentAgent: User | undefined,
    queue: AssignmentQueue | undefined,
    rules: EscalationRule[],
    noResponseThresholdMinutes: number = 60
  ): Promise<EscalationResult> {
    const context: EscalationContext = {
      ticket,
      currentAgent,
      currentQueue: queue,
      escalationRules: rules,
      auditTrail: [],
    }

    // Check if ticket has exceeded no-response threshold
    const assignedTime = ticket.assignmentTimestamp ? new Date(ticket.assignmentTimestamp).getTime() : Date.now()
    const currentTime = Date.now()
    const minutesElapsed = (currentTime - assignedTime) / (1000 * 60)

    if (minutesElapsed < noResponseThresholdMinutes) {
      context.auditTrail.push(`✓ No escalation - Response threshold not exceeded (${minutesElapsed.toFixed(0)}m/${noResponseThresholdMinutes}m)`)
      return {
        escalated: false,
        escalationLevel: 0,
        reason: 'Response threshold not exceeded',
        auditTrail: context.auditTrail,
      }
    }

    context.auditTrail.push(`⚠ No-response threshold exceeded: ${minutesElapsed.toFixed(0)} minutes`)

    // Find next escalation level
    const currentLevel = this.getEscalationLevel(ticket)
    const nextLevelRule = rules.find(r => r.escalationLevel === currentLevel + 1)

    if (!nextLevelRule) {
      context.auditTrail.push(`✗ No escalation rule found for level ${currentLevel + 1}`)
      return {
        escalated: false,
        escalationLevel: currentLevel,
        reason: 'Max escalation level reached',
        auditTrail: context.auditTrail,
      }
    }

    return this.executeEscalation(context, nextLevelRule)
  }

  /**
   * Check if ticket should be escalated due to SLA breach
   */
  async checkSLABreachEscalation(
    ticket: Ticket,
    currentAgent: User | undefined,
    queue: AssignmentQueue | undefined,
    rules: EscalationRule[]
  ): Promise<EscalationResult> {
    const context: EscalationContext = {
      ticket,
      currentAgent,
      currentQueue: queue,
      escalationRules: rules,
      auditTrail: [],
    }

    // Check if SLA is breached
    if (!ticket.slaResolutionTime) {
      context.auditTrail.push(`⚠ No SLA resolution time set`)
      return {
        escalated: false,
        escalationLevel: 0,
        reason: 'No SLA resolution time',
        auditTrail: context.auditTrail,
      }
    }

    const slaTime = new Date(ticket.slaResolutionTime).getTime()
    const currentTime = Date.now()

    if (currentTime < slaTime) {
      const minutesRemaining = (slaTime - currentTime) / (1000 * 60)
      context.auditTrail.push(`✓ SLA not breached - ${minutesRemaining.toFixed(0)} minutes remaining`)
      return {
        escalated: false,
        escalationLevel: 0,
        reason: 'SLA not breached',
        auditTrail: context.auditTrail,
      }
    }

    context.auditTrail.push(`🔴 SLA BREACHED`)

    // Find SLA breach escalation rule
    const slaBreachRule = rules.find(r => r.escalationCondition === 'sla-breach')

    if (!slaBreachRule) {
      context.auditTrail.push(`✗ No SLA breach escalation rule found`)
      return {
        escalated: false,
        escalationLevel: this.getEscalationLevel(ticket),
        reason: 'No SLA breach rule configured',
        auditTrail: context.auditTrail,
      }
    }

    return this.executeEscalation(context, slaBreachRule)
  }

  /**
   * Execute the escalation
   */
  private async executeEscalation(
    context: EscalationContext,
    rule: EscalationRule
  ): Promise<EscalationResult> {
    context.auditTrail.push(`→ Escalating to level ${rule.escalationLevel}: ${rule.escalationTarget}`)

    // Determine escalation target
    let escalatedToAgent: User | undefined
    let escalatedToQueue: AssignmentQueue | undefined

    switch (rule.escalationTarget.toLowerCase()) {
      case 'team-lead':
        context.auditTrail.push(`→ Escalating to Team Lead`)
        break

      case 'manager':
        context.auditTrail.push(`→ Escalating to Manager`)
        break

      case 'director':
        context.auditTrail.push(`→ Escalating to Director`)
        break

      default:
        if (rule.escalationTarget.includes('queue')) {
          context.auditTrail.push(`→ Escalating to queue: ${rule.escalationTarget}`)
        } else {
          context.auditTrail.push(`→ Escalating to: ${rule.escalationTarget}`)
        }
    }

    // Record escalation in history
    this.escalationHistory.push({
      ticketId: context.ticket.id,
      escalationLevel: rule.escalationLevel,
      escalatedAt: new Date().toISOString(),
    })

    context.auditTrail.push(`✓ Escalation executed at ${new Date().toISOString()}`)

    return {
      escalated: true,
      escalationLevel: rule.escalationLevel,
      previousAgent: context.currentAgent,
      escalatedToAgent,
      escalatedToQueue,
      reason: `Escalated due to ${rule.escalationCondition}`,
      auditTrail: context.auditTrail,
    }
  }

  /**
   * Get current escalation level of ticket
   */
  private getEscalationLevel(ticket: Ticket): number {
    const ticketEscalations = this.escalationHistory.filter(e => e.ticketId === ticket.id)
    return ticketEscalations.length > 0 ? Math.max(...ticketEscalations.map(e => e.escalationLevel)) : 0
  }

  /**
   * Get escalation history for a ticket
   */
  getEscalationHistory(ticketId: string): Array<{
    ticketId: string
    escalationLevel: number
    escalatedAt: string
  }> {
    return this.escalationHistory.filter(e => e.ticketId === ticketId)
  }

  /**
   * Get current escalation status
   */
  getCurrentEscalationLevel(ticketId: string): number {
    return this.getEscalationLevel({ id: ticketId } as Ticket)
  }
}

export const escalationEngine = new EscalationEngine()
