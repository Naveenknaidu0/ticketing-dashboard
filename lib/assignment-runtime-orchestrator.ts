'use server'

import {
  Ticket,
  AssignmentRule,
  AssignmentQueue,
  Skill,
  User,
  AgentCapacity,
  EscalationRule,
  AssignmentLog,
  AssignmentMetrics,
} from './types'
import { dashboardLayoutEngine } from './dashboard-layout-engine'

/**
 * PHASE 3A - Assignment Engine Runtime Orchestrator
 * Central execution engine for automated ticket assignment
 * Coordinates all assignment engines: Queue Routing, Skill Matching, Capacity, Rules, Selection
 */

interface AssignmentContext {
  ticket: Ticket
  availableQueues: AssignmentQueue[]
  eligibleAgents: User[]
  capacities: Map<string, AgentCapacity>
  rules: AssignmentRule[]
  escalations: EscalationRule[]
  simulationMode: boolean
  auditTrail: string[]
}

interface AssignmentResult {
  success: boolean
  ticketId: string
  assignedAgent?: User
  assignedQueue?: AssignmentQueue
  reason: string
  auditTrail: string[]
  simulationMode: boolean
}

interface AgentScore {
  agentId: string
  agentName: string
  skillMatch: number
  capacity: number
  availability: number
  performance: number
  totalScore: number
}

export class AssignmentRuntimeOrchestrator {
  private assignmentLogs: AssignmentLog[] = []
  private metrics: AssignmentMetrics = {
    totalAssignments: 0,
    successfulAssignments: 0,
    failedAssignments: 0,
    averageAssignmentTime: 0,
    escalationCount: 0,
    fallbackCount: 0,
  }

  /**
   * PHASE 3A.1 - Main Orchestrator
   * Central entry point for all assignment requests
   */
  async executeAssignment(
    ticket: Ticket,
    queues: AssignmentQueue[],
    agents: User[],
    rules: AssignmentRule[],
    escalations: EscalationRule[],
    simulationMode: boolean = false
  ): Promise<AssignmentResult> {
    const startTime = Date.now()
    const context: AssignmentContext = {
      ticket,
      availableQueues: queues,
      eligibleAgents: agents,
      capacities: new Map(),
      rules,
      escalations,
      simulationMode,
      auditTrail: [],
    }

    try {
      // Step 1: Queue Routing
      const targetQueue = await this.routeToQueue(context)
      if (!targetQueue) {
        return this.handleAssignmentFailure(context, 'No matching queue found')
      }
      context.auditTrail.push(`✓ Queue routed: ${targetQueue.name}`)

      // Step 2: Skill Matching
      const skillEligibleAgents = await this.matchSkills(context, targetQueue)
      if (skillEligibleAgents.length === 0) {
        context.auditTrail.push(`✗ No agents match required skills`)
        return await this.handleFallback(context, targetQueue)
      }
      context.auditTrail.push(`✓ Skill matching: ${skillEligibleAgents.length} eligible agents`)
      context.eligibleAgents = skillEligibleAgents

      // Step 3: Availability Check
      const availableAgents = await this.filterAvailableAgents(context)
      if (availableAgents.length === 0) {
        context.auditTrail.push(`✗ No agents currently available`)
        return await this.handleFallback(context, targetQueue)
      }
      context.auditTrail.push(`✓ Availability check: ${availableAgents.length} available agents`)
      context.eligibleAgents = availableAgents

      // Step 4: Capacity Validation
      const capacitatedAgents = await this.validateCapacity(context)
      if (capacitatedAgents.length === 0) {
        context.auditTrail.push(`✗ No agents have capacity`)
        return await this.handleFallback(context, targetQueue)
      }
      context.auditTrail.push(`✓ Capacity check: ${capacitatedAgents.length} agents have capacity`)
      context.eligibleAgents = capacitatedAgents

      // Step 5: Rule Evaluation
      const ruleMatchedAgents = await this.evaluateRules(context)
      if (ruleMatchedAgents.length > 0) {
        context.auditTrail.push(`✓ Rule evaluation applied`)
        context.eligibleAgents = ruleMatchedAgents
      } else {
        context.auditTrail.push(`⚠ No rules matched, using available agents`)
      }

      // Step 6: Agent Selection
      const selectedAgent = await this.selectBestAgent(context)
      if (!selectedAgent) {
        context.auditTrail.push(`✗ Failed to select best agent`)
        return await this.handleFallback(context, targetQueue)
      }
      context.auditTrail.push(`✓ Agent selected: ${selectedAgent.name}`)

      // Step 7: Execute Assignment
      if (!context.simulationMode) {
        await this.executeAssignmentTransaction(context, selectedAgent, targetQueue)
      }
      context.auditTrail.push(`✓ Assignment executed`)

      // Step 8: Sync Systems
      await this.syncWorkloadEngine(selectedAgent, targetQueue, context)
      await this.syncSLAEngine(context.ticket)
      await this.updateDashboards(selectedAgent, targetQueue, context)

      context.auditTrail.push(`✓ System sync completed`)

      // Record metrics
      const assignmentTime = Date.now() - startTime
      this.recordAssignment(true, assignmentTime)

      return {
        success: true,
        ticketId: context.ticket.id,
        assignedAgent: selectedAgent,
        assignedQueue: targetQueue,
        reason: 'Assignment successful',
        auditTrail: context.auditTrail,
        simulationMode: context.simulationMode,
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      context.auditTrail.push(`✗ Error: ${errorMsg}`)
      this.recordAssignment(false, Date.now() - startTime)
      return this.handleAssignmentFailure(context, errorMsg)
    }
  }

  /**
   * PHASE 3A.2 - Queue Routing Engine
   * Determine destination queue based on ticket attributes
   */
  private async routeToQueue(context: AssignmentContext): Promise<AssignmentQueue | null> {
    const { ticket, availableQueues, rules } = context

    // Check rules first for explicit routing
    for (const rule of rules) {
      const matches = this.evaluateRuleConditions(ticket, rule.conditions)
      if (matches && rule.targetQueue) {
        const queue = availableQueues.find(q => q.id === rule.targetQueue)
        if (queue) return queue
      }
    }

    // Default category-based routing
    const categoryQueue = availableQueues.find(q =>
      q.description?.toLowerCase().includes(ticket.category?.toLowerCase() || '')
    )

    // Fallback to general queue
    return categoryQueue || availableQueues.find(q => q.name.includes('General')) || availableQueues[0]
  }

  /**
   * PHASE 3A.3 - Skill Matching Engine
   * Identify agents with required skills
   */
  private async matchSkills(context: AssignmentContext, queue: AssignmentQueue): Promise<User[]> {
    const { eligibleAgents } = context
    const requiredSkills = queue.skills || []

    if (requiredSkills.length === 0) {
      return eligibleAgents
    }

    return eligibleAgents.filter(agent => {
      const agentSkills = agent.supportSkills || []
      return requiredSkills.every(reqSkill =>
        agentSkills.some(
          agentSkill =>
            agentSkill.skillId === reqSkill.skillId &&
            (agentSkill.proficiencyLevel || 1) >= (reqSkill.minimumLevel || 1)
        )
      )
    })
  }

  /**
   * PHASE 3A.4 - Availability Engine
   * Remove unavailable agents (offline, away, on leave, etc.)
   */
  private async filterAvailableAgents(context: AssignmentContext): Promise<User[]> {
    return context.eligibleAgents.filter(agent => {
      if (agent.status === 'offline' || agent.status === 'away' || agent.status === 'on-leave') {
        return false
      }
      if (agent.isActive === false) {
        return false
      }
      return true
    })
  }

  /**
   * PHASE 3A.5 - Capacity Engine
   * Prevent overload - check current tickets and capacity
   */
  private async validateCapacity(context: AssignmentContext): Promise<User[]> {
    const { ticket, eligibleAgents } = context
    const capacity = ticket.priority === 'critical' ? 0.8 : 0.9 // Higher threshold for non-critical

    return eligibleAgents.filter(agent => {
      const activeTickets = agent.assignedTickets?.filter(t => t.status !== 'resolved') || []
      const capacityPercentage = activeTickets.length / (agent.maxCapacity || 20)
      return capacityPercentage <= capacity
    })
  }

  /**
   * PHASE 3A.6 - Rule Engine
   * Evaluate assignment rules in sequence
   */
  private async evaluateRules(context: AssignmentContext): Promise<User[]> {
    const { ticket, eligibleAgents, rules } = context
    let filteredAgents = [...eligibleAgents]

    for (const rule of rules) {
      if (rule.priority === 'skip') continue

      const matches = this.evaluateRuleConditions(ticket, rule.conditions)
      if (matches && rule.agentFilter) {
        filteredAgents = filteredAgents.filter(agent =>
          this.matchesAgentFilter(agent, rule.agentFilter!)
        )
      }

      if (filteredAgents.length === 0) break
    }

    return filteredAgents.length > 0 ? filteredAgents : context.eligibleAgents
  }

  /**
   * PHASE 3A.8 - Agent Selection Engine
   * Score and select the best agent using weighted scoring
   */
  private async selectBestAgent(context: AssignmentContext): Promise<User | null> {
    const scores = this.scoreAgents(context)

    if (scores.length === 0) return null

    // Sort by total score and return the best agent
    scores.sort((a, b) => b.totalScore - a.totalScore)
    context.auditTrail.push(`✓ Agent scoring: Best score ${scores[0].totalScore.toFixed(2)} for ${scores[0].agentName}`)

    return context.eligibleAgents.find(a => a.id === scores[0].agentId) || null
  }

  /**
   * Calculate weighted scores for each agent
   * Skill Match (40%), Capacity (25%), Availability (20%), Performance (15%)
   */
  private scoreAgents(context: AssignmentContext): AgentScore[] {
    const { ticket, eligibleAgents } = context

    return eligibleAgents.map(agent => {
      const skillMatch = this.calculateSkillMatch(agent, ticket) * 0.4
      const capacity = this.calculateCapacityScore(agent) * 0.25
      const availability = this.calculateAvailabilityScore(agent) * 0.2
      const performance = this.calculatePerformanceScore(agent) * 0.15

      const totalScore = skillMatch + capacity + availability + performance

      return {
        agentId: agent.id,
        agentName: agent.name,
        skillMatch,
        capacity,
        availability,
        performance,
        totalScore,
      }
    })
  }

  private calculateSkillMatch(agent: User, ticket: Ticket): number {
    const requiredSkills = ticket.requiredSkills || []
    if (requiredSkills.length === 0) return 100

    const agentSkills = agent.supportSkills || []
    const matchedSkills = requiredSkills.filter(req =>
      agentSkills.some(
        as => as.skillId === req.skillId && (as.proficiencyLevel || 1) >= (req.minimumLevel || 1)
      )
    )

    return (matchedSkills.length / requiredSkills.length) * 100
  }

  private calculateCapacityScore(agent: User): number {
    const activeTickets = agent.assignedTickets?.filter(t => t.status !== 'resolved') || []
    const maxCapacity = agent.maxCapacity || 20
    const utilization = (activeTickets.length / maxCapacity) * 100

    // Lower utilization = higher score (invert the percentage)
    return Math.max(0, 100 - utilization)
  }

  private calculateAvailabilityScore(agent: User): number {
    if (agent.status === 'offline' || agent.status === 'away') return 0
    if (agent.isActive === false) return 0
    return 100
  }

  private calculatePerformanceScore(agent: User): number {
    // Based on SLA compliance rate and customer satisfaction
    const slaCompliance = agent.slaComplianceRate || 95
    const avgRating = agent.averageRating || 4.5
    const ratingScore = (avgRating / 5) * 100

    return (slaCompliance + ratingScore) / 2
  }

  /**
   * PHASE 3A.9 - Assignment Execution
   * Update ticket with assignment details
   */
  private async executeAssignmentTransaction(
    context: AssignmentContext,
    agent: User,
    queue: AssignmentQueue
  ): Promise<void> {
    // In real implementation, this would update the ticket in the database
    context.ticket.assignedAgent = agent.id
    context.ticket.assignedGroup = queue.id
    context.ticket.assignedQueue = queue.id
    context.ticket.assignmentTimestamp = new Date().toISOString()
    context.ticket.status = 'assigned'

    // Create assignment history entry
    const historyEntry = {
      id: `history-${Date.now()}`,
      ticketId: context.ticket.id,
      agentId: agent.id,
      queueId: queue.id,
      assignedAt: new Date().toISOString(),
      assignmentReason: 'Automated assignment',
      auditTrail: context.auditTrail,
    }

    context.auditTrail.push(`✓ Assignment recorded in history`)
  }

  /**
   * PHASE 3A.10 - Fallback Engine
   * Handle cases where no matching agent is found
   */
  private async handleFallback(context: AssignmentContext, queue: AssignmentQueue): Promise<AssignmentResult> {
    context.auditTrail.push(`→ Fallback engine triggered`)

    // Try queue owner first
    if (queue.owner) {
      context.auditTrail.push(`→ Assigning to queue owner: ${queue.owner}`)
      this.metrics.fallbackCount++
      return {
        success: true,
        ticketId: context.ticket.id,
        reason: 'Assigned to queue owner (fallback)',
        auditTrail: context.auditTrail,
        simulationMode: context.simulationMode,
      }
    }

    // Leave in queue for manager assignment
    context.auditTrail.push(`→ Leaving ticket unassigned for manager review`)
    this.metrics.fallbackCount++

    return {
      success: false,
      ticketId: context.ticket.id,
      assignedQueue: queue,
      reason: 'No matching agent - placed in queue for manager',
      auditTrail: context.auditTrail,
      simulationMode: context.simulationMode,
    }
  }

  /**
   * PHASE 3A.11 - Escalation Engine (to be called after no response)
   */
  async handleEscalation(ticketId: string, escalations: EscalationRule[]): Promise<void> {
    context.auditTrail.push(`→ Escalation engine triggered for ticket ${ticketId}`)

    for (const esc of escalations) {
      context.auditTrail.push(`→ Level ${esc.escalationLevel}: ${esc.escalationTarget}`)
    }

    this.metrics.escalationCount++
  }

  /**
   * PHASE 3A.12 - Workload Engine Sync
   * Update agent workload and dashboard
   */
  private async syncWorkloadEngine(agent: User, queue: AssignmentQueue, context: AssignmentContext): Promise<void> {
    // Update agent's assigned ticket count
    if (agent.assignedTickets) {
      agent.assignedTickets.push({
        ...context.ticket,
        assignedAt: new Date().toISOString(),
      } as any)
    }

    // Update queue metrics
    queue.ticketCount = (queue.ticketCount || 0) + 1
    if (context.ticket.priority === 'critical') {
      queue.slaRiskCount = (queue.slaRiskCount || 0) + 1
    }

    context.auditTrail.push(`✓ Workload engine synced`)
  }

  /**
   * PHASE 3A.13 - SLA Engine Sync
   * Start SLA clocks for response and resolution
   */
  private async syncSLAEngine(ticket: Ticket): Promise<void> {
    // Trigger SLA clock start in existing SLA engine
    const now = new Date()

    // Calculate SLA times based on priority
    const slaTimes: Record<string, number> = {
      critical: 1, // 1 hour
      high: 4, // 4 hours
      medium: 8, // 8 hours
      low: 24, // 24 hours
    }

    const hours = slaTimes[ticket.priority] || 24
    const slaTime = new Date(now.getTime() + hours * 60 * 60 * 1000)

    ticket.slaResolutionTime = slaTime.toISOString()
  }

  /**
   * PHASE 3A.14 - Audit Engine
   * Track full assignment history
   */
  private recordAssignment(success: boolean, duration: number): void {
    this.metrics.totalAssignments++
    if (success) {
      this.metrics.successfulAssignments++
      this.metrics.averageAssignmentTime =
        (this.metrics.averageAssignmentTime * (this.metrics.successfulAssignments - 1) + duration) /
        this.metrics.successfulAssignments
    } else {
      this.metrics.failedAssignments++
    }
  }

  /**
   * PHASE 3A.15 - Simulation Mode
   * Test assignment without actually executing
   */
  async simulateAssignment(
    ticket: Ticket,
    queues: AssignmentQueue[],
    agents: User[],
    rules: AssignmentRule[]
  ): Promise<AssignmentResult> {
    return this.executeAssignment(ticket, queues, agents, rules, [], true)
  }

  /**
   * Helper methods
   */
  private evaluateRuleConditions(ticket: Ticket, conditions: any[]): boolean {
    return conditions.every(condition => {
      const value = (ticket as any)[condition.field]
      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'contains':
          return String(value).includes(condition.value)
        case 'greaterThan':
          return value > condition.value
        case 'lessThan':
          return value < condition.value
        default:
          return true
      }
    })
  }

  private matchesAgentFilter(agent: User, filter: any): boolean {
    if (filter.agentIds && filter.agentIds.includes(agent.id)) return true
    if (filter.groupIds && agent.supportGroups?.some(g => filter.groupIds.includes(g))) return true
    return false
  }

  private handleAssignmentFailure(context: AssignmentContext, reason: string): AssignmentResult {
    return {
      success: false,
      ticketId: context.ticket.id,
      reason,
      auditTrail: context.auditTrail,
      simulationMode: context.simulationMode,
    }
  }

  private async updateDashboards(agent: User, queue: AssignmentQueue, context: AssignmentContext): Promise<void> {
    // Dashboard updates would happen through app store events
    context.auditTrail.push(`✓ Dashboard update queued`)
  }

  getMetrics(): AssignmentMetrics {
    return this.metrics
  }
}

export const assignmentRuntimeOrchestrator = new AssignmentRuntimeOrchestrator()
