/**
 * Business Logic Engine for AdamsBridge ITSM Platform
 * Handles cascading updates for ticket actions and state synchronization
 * Ensures all modules stay in sync with ticket lifecycle events
 */

import {
  Ticket,
  TicketStatus,
  TicketPriority,
  SLARecord,
  WorkloadRecord,
  LeaderboardEntry,
  AuditLog,
  Notification,
  TodoAction,
  ApplicationStore,
  StoreState,
} from './store'

// ============================================================================
// BUSINESS LOGIC ENGINE CLASS
// ============================================================================

export class BusinessLogicEngine {
  private store: ApplicationStore

  constructor(store: ApplicationStore) {
    this.store = store
    this.attachListeners()
  }

  // ============================================================================
  // EVENT LISTENERS
  // ============================================================================

  private attachListeners(): void {
    // Ticket lifecycle events
    this.store.on('ticket.created', (ticket: Ticket) => this.onTicketCreated(ticket))
    this.store.on('ticket.assigned', (data: any) => this.onTicketAssigned(data))
    this.store.on('ticket.reassigned', (data: any) => this.onTicketReassigned(data))
    this.store.on('ticket.status-changed', (data: any) => this.onTicketStatusChanged(data))
    this.store.on('ticket.priority-changed', (data: any) => this.onTicketPriorityChanged(data))
    this.store.on('ticket.resolved', (data: any) => this.onTicketResolved(data))
    this.store.on('ticket.closed', (data: any) => this.onTicketClosed(data))
    this.store.on('ticket.escalated', (data: any) => this.onTicketEscalated(data))

    // Knowledge lifecycle events
    this.store.on('knowledge.published', (article: any) => this.onKnowledgePublished(article))
  }

  // ============================================================================
  // TICKET CREATED
  // ============================================================================

  private onTicketCreated(ticket: Ticket): void {
    // 1. Create ticket record (already done)
    // 2. Generate Ticket ID (already done)
    // 3. Add activity timeline entry (via audit log - already done)
    // 4. Create audit log (already done)
    // 5. Create notification (already done)

    // Update all modules
    this.updateTicketListView()
    this.updateDashboard()
    this.updateTeamDashboard()
    this.updateReports()
    this.updateSLAMetrics(ticket.id)
    this.updateWorkload()
    this.updateToDoList()
    this.updateLeaderboard()
    this.updateManagerDashboard()
  }

  // ============================================================================
  // TICKET ASSIGNED
  // ============================================================================

  private onTicketAssigned(data: { ticketId: string; userId: string; previousAssignee?: string }): void {
    const { ticketId, userId } = data

    // Update workload for new assignee
    this.recalculateAgentWorkload(userId)

    // Update to-do for new assignee
    this.updateToDoList()

    // Update agent dashboard
    this.updateAgentDashboard(userId)

    // Update team dashboard
    this.updateTeamDashboard()

    // Update reports
    this.updateReports()

    // Update leaderboard
    this.updateLeaderboard()

    // Update SLA
    this.updateSLAMetrics(ticketId)
  }

  // ============================================================================
  // TICKET REASSIGNED
  // ============================================================================

  private onTicketReassigned(data: { ticketId: string; fromUserId: string; toUserId: string }): void {
    const { ticketId, fromUserId, toUserId } = data

    // Remove from old owner's workload
    this.recalculateAgentWorkload(fromUserId)

    // Add to new owner's workload
    this.recalculateAgentWorkload(toUserId)

    // Update to-do for both users
    this.updateToDoList()

    // Update dashboards
    this.updateAgentDashboard(fromUserId)
    this.updateAgentDashboard(toUserId)
    this.updateTeamDashboard()

    // Update reports
    this.updateReports()

    // Update leaderboard
    this.updateLeaderboard()
  }

  // ============================================================================
  // TICKET STATUS CHANGED
  // ============================================================================

  private onTicketStatusChanged(data: { ticketId: string; newStatus: TicketStatus; oldStatus: TicketStatus }): void {
    const { ticketId, newStatus, oldStatus } = data

    switch (newStatus) {
      case 'open':
        this.handleStatusChangeToOpen(ticketId)
        break
      case 'in-progress':
        this.handleStatusChangeToInProgress(ticketId)
        break
      case 'pending':
        this.handleStatusChangeToPending(ticketId)
        break
      case 'resolved':
        this.handleStatusChangeToResolved(ticketId)
        break
      case 'closed':
        this.handleStatusChangeToClosed(ticketId)
        break
    }

    // Always update these
    this.updateTicketListView()
    this.updateDashboard()
    this.updateReports()
  }

  private handleStatusChangeToOpen(ticketId: string): void {
    this.updateTicketListView()
    this.updateWorkload()
    this.updateToDoList()
  }

  private handleStatusChangeToInProgress(ticketId: string): void {
    this.updateTicketListView()
    this.updateWorkload()
    this.updateReports()
    this.updateToDoList()
  }

  private handleStatusChangeToPending(ticketId: string): void {
    this.updateTicketListView()
    this.updateWorkload()
    this.updateToDoList()
  }

  private handleStatusChangeToResolved(ticketId: string): void {
    const state = this.store.getState()
    const ticket = state.tickets.get(ticketId)
    if (!ticket) return

    // Update resolved count
    this.updateResolvedCount(ticket.assignedTo)

    // Trigger CSAT prompt
    this.triggerCSATSurvey(ticketId)

    // Update modules
    this.updateTicketListView()
    this.updateDashboard()
    if (ticket.assignedTo) {
      this.updateAgentDashboard(ticket.assignedTo)
    }
    this.updateLeaderboard()
    this.updateReports()
    this.updateSLAMetrics(ticketId)
    this.updateToDoList()

    // Mark as completed in agent's to-do
    if (ticket.assignedTo) {
      this.completeTicketInToDo(ticket.assignedTo, ticketId)
    }
  }

  private handleStatusChangeToClosed(ticketId: string): void {
    const state = this.store.getState()
    const ticket = state.tickets.get(ticketId)
    if (!ticket) return

    // Update closed count
    this.updateClosedCount(ticket.assignedTo)

    // CSAT is now locked in
    // Update modules
    this.updateTicketListView()
    this.updateDashboard()
    this.updateReports()
    this.updateLeaderboard()
    this.updateSLAMetrics(ticketId)

    // Remove from active to-do
    this.removeTicketFromToDo(ticket.assignedTo, ticketId)
  }

  // ============================================================================
  // TICKET PRIORITY CHANGED
  // ============================================================================

  private onTicketPriorityChanged(data: { ticketId: string; newPriority: TicketPriority; oldPriority: TicketPriority }): void {
    const { ticketId } = data

    // Update priority breakdown
    this.updatePriorityBreakdown()

    // Update SLA targets
    this.updateSLAMetrics(ticketId)

    // Update reports
    this.updateReports()

    // Update workload risk
    this.updateWorkload()

    // Update dashboard
    this.updateDashboard()
  }

  // ============================================================================
  // TICKET RESOLVED
  // ============================================================================

  private onTicketResolved(data: any): void {
    const { ticketId } = data
    const state = this.store.getState()
    const ticket = state.tickets.get(ticketId)
    if (!ticket) return

    // Already handled in status change, but ensure CSAT is available
    if (ticket.csatScore === undefined) {
      // CSAT not yet provided - ticket can be surveyed
    }
  }

  // ============================================================================
  // TICKET CLOSED
  // ============================================================================

  private onTicketClosed(data: any): void {
    const { ticketId } = data
    // Trigger any final cleanup
    this.archiveTicketData(ticketId)
  }

  // ============================================================================
  // TICKET ESCALATED
  // ============================================================================

  private onTicketEscalated(data: any): void {
    const { ticketId, reason } = data
    const state = this.store.getState()
    const ticket = state.tickets.get(ticketId)
    if (!ticket) return

    // Update dashboard with escalation
    this.updateDashboard()
    this.updateManagerDashboard()
    this.updateReports()

    // Create escalation audit entry
    this.logEscalation(ticketId, reason)
  }

  // ============================================================================
  // KNOWLEDGE PUBLISHED
  // ============================================================================

  private onKnowledgePublished(article: any): void {
    // Update leaderboard - knowledge contributions
    this.updateLeaderboard()

    // Update reports
    this.updateReports()

    // Update to-do for author (mark knowledge task as complete)
    if (article.author) {
      this.completeKnowledgeTaskInToDo(article.author, article.id)
    }
  }

  // ============================================================================
  // UPDATE METHODS
  // ============================================================================

  private updateTicketListView(): void {
    this.store.emit('view.tickets.updated')
  }

  private updateDashboard(): void {
    this.store.emit('dashboard.updated')
  }

  private updateAgentDashboard(userId: string): void {
    this.store.emit('agent-dashboard.updated', { userId })
  }

  private updateTeamDashboard(): void {
    this.store.emit('team-dashboard.updated')
  }

  private updateManagerDashboard(): void {
    this.store.emit('manager-dashboard.updated')
  }

  private updateReports(): void {
    this.store.emit('reports.updated')
  }

  private updateSLAMetrics(ticketId: string): void {
    const state = this.store.getState()
    const ticket = state.tickets.get(ticketId)
    if (!ticket) return

    // Recalculate SLA status based on ticket priority and status
    const slaRecord = state.slaRecords.get(ticketId) || {
      id: `SLA-${ticketId}`,
      ticketId,
      responseBreached: false,
      resolutionBreached: false,
      complianceScore: 100,
    }

    // Update SLA based on ticket lifecycle
    if (ticket.status === 'open' || ticket.status === 'in-progress') {
      const now = new Date()
      const created = new Date(ticket.createdAt)
      const elapsedHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60)

      // Set SLA deadlines based on priority
      const responseDeadline = this.getResponseDeadline(ticket.priority)
      const resolutionDeadline = this.getResolutionDeadline(ticket.priority)

      if (elapsedHours > responseDeadline) {
        slaRecord.responseBreached = true
      }
      if (elapsedHours > resolutionDeadline) {
        slaRecord.resolutionBreached = true
      }

      // Update SLA status on ticket
      if (slaRecord.responseBreached || slaRecord.resolutionBreached) {
        this.store.updateTicket(ticketId, { slaStatus: 'breached' })
      } else if (elapsedHours > responseDeadline * 0.8 || elapsedHours > resolutionDeadline * 0.8) {
        this.store.updateTicket(ticketId, { slaStatus: 'at-risk' })
      } else {
        this.store.updateTicket(ticketId, { slaStatus: 'compliant' })
      }
    }

    state.slaRecords.set(ticketId, slaRecord as SLARecord)
    this.store.emit('sla.updated', slaRecord)
  }

  private updateWorkload(): void {
    const state = this.store.getState()
    const tickets = Array.from(state.tickets.values())

    // Recalculate workload for all agents
    const agents = new Set<string>()
    tickets.forEach((t) => {
      if (t.assignedTo) agents.add(t.assignedTo)
    })

    agents.forEach((userId) => {
      this.recalculateAgentWorkload(userId)
    })

    this.store.emit('workload.recalculated')
  }

  private recalculateAgentWorkload(userId: string): void {
    const state = this.store.getState()
    const tickets = Array.from(state.tickets.values()).filter((t) => t.assignedTo === userId)

    const openTickets = tickets.filter((t) => t.status === 'open' || t.status === 'in-progress').length
    const totalTickets = tickets.length
    const criticalTickets = tickets.filter((t) => t.priority === 'critical').length

    let workload = state.workloadRecords.get(userId)
    if (!workload) {
      workload = {
        userId,
        totalTickets: 0,
        openTickets: 0,
        resolvedToday: 0,
        averageResolutionTime: 0,
        slaComplianceToday: 0,
        capacityUsage: 0,
      }
    }

    workload.openTickets = openTickets
    workload.totalTickets = totalTickets
    workload.capacityUsage = Math.min(100, (openTickets / 10) * 100)

    state.workloadRecords.set(userId, workload)
    this.store.emit('agent-workload.updated', { userId, workload })
  }

  private updateToDoList(): void {
    this.store.emit('todo.refreshed')
  }

  private updateLeaderboard(): void {
    const state = this.store.getState()

    // Recalculate leaderboard based on actual ticket data
    const entries: LeaderboardEntry[] = []

    state.users.forEach((user) => {
      const userTickets = Array.from(state.tickets.values()).filter((t) => t.assignedTo === user.id)
      const resolvedTickets = userTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length
      const csatScores = userTickets
        .filter((t) => t.csatScore !== undefined)
        .map((t) => t.csatScore as number)
      const avgCSAT = csatScores.length > 0 ? csatScores.reduce((a, b) => a + b) / csatScores.length : 0

      // Count knowledge contributions
      const knowledgeArticles = Array.from(state.knowledgeArticles.values()).filter((a) => a.author === user.id).length

      // Calculate SLA compliance
      const slaCompliance = this.calculateSLACompliance(user.id)

      // Calculate total score
      const totalScore = resolvedTickets * 10 + avgCSAT * 5 + knowledgeArticles * 15 + slaCompliance * 2

      entries.push({
        userId: user.id,
        userName: user.name,
        resolvedTickets,
        slaCompliance,
        csat: avgCSAT,
        knowledgeContributions: knowledgeArticles,
        totalScore,
        rank: 0,
      })
    })

    // Sort and rank
    entries.sort((a, b) => b.totalScore - a.totalScore)
    entries.forEach((e, idx) => {
      e.rank = idx + 1
    })

    state.leaderboardEntries = entries
    this.store.emit('leaderboard.updated', entries)
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private getResponseDeadline(priority: TicketPriority): number {
    const deadlines: Record<TicketPriority, number> = {
      critical: 1, // 1 hour
      high: 4, // 4 hours
      medium: 8, // 8 hours
      low: 24, // 24 hours
    }
    return deadlines[priority]
  }

  private getResolutionDeadline(priority: TicketPriority): number {
    const deadlines: Record<TicketPriority, number> = {
      critical: 4, // 4 hours
      high: 24, // 24 hours
      medium: 72, // 72 hours
      low: 168, // 1 week
    }
    return deadlines[priority]
  }

  private updateResolvedCount(userId: string | undefined): void {
    if (!userId) return
    const state = this.store.getState()
    const user = state.users.get(userId)
    if (user) {
      user.totalResolved++
      this.store.emit('user.updated', user)
    }
  }

  private updateClosedCount(userId: string | undefined): void {
    if (!userId) return
    // Closed tickets are counted differently in some systems
    this.updateResolvedCount(userId)
  }

  private updatePriorityBreakdown(): void {
    this.store.emit('reports.priority-breakdown.updated')
  }

  private triggerCSATSurvey(ticketId: string): void {
    this.store.emit('csat.survey-triggered', { ticketId })
  }

  private completeTicketInToDo(userId: string | undefined, ticketId: string): void {
    if (!userId) return
    const state = this.store.getState()
    const todos = Array.from(state.todoActions.values()).filter(
      (t) => t.assignedTo === userId && t.linkedEntityId === ticketId && !t.completed
    )
    todos.forEach((t) => {
      t.completed = true
      t.completedAt = new Date().toISOString()
      this.store.emit('todo.completed', t)
    })
  }

  private removeTicketFromToDo(userId: string | undefined, ticketId: string): void {
    if (!userId) return
    const state = this.store.getState()
    const todos = Array.from(state.todoActions.values()).filter(
      (t) => t.assignedTo === userId && t.linkedEntityId === ticketId
    )
    todos.forEach((t) => {
      state.todoActions.delete(t.id)
    })
  }

  private completeKnowledgeTaskInToDo(userId: string, articleId: string): void {
    const state = this.store.getState()
    const todos = Array.from(state.todoActions.values()).filter(
      (t) => t.assignedTo === userId && t.linkedEntityId === articleId && t.type === 'approval'
    )
    todos.forEach((t) => {
      t.completed = true
      t.completedAt = new Date().toISOString()
    })
  }

  private calculateSLACompliance(userId: string): number {
    const state = this.store.getState()
    const userTickets = Array.from(state.tickets.values()).filter((t) => t.assignedTo === userId)
    if (userTickets.length === 0) return 100

    const compliantTickets = userTickets.filter((t) => t.slaStatus !== 'breached').length
    return Math.round((compliantTickets / userTickets.length) * 100)
  }

  private archiveTicketData(ticketId: string): void {
    // Archive old ticket data for historical reports
    this.store.emit('ticket.archived', { ticketId })
  }

  private logEscalation(ticketId: string, reason: string): void {
    this.store.emit('escalation.logged', { ticketId, reason })
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default BusinessLogicEngine
