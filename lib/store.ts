/**
 * Global Application Store for AdamsBridge ITSM Platform
 * Manages all entities and cross-module synchronization
 */

import { EventEmitter } from 'events'
import { getEnhancedDemoTickets } from './demo-tickets'
// ============================================================================
// ENTITY TYPES
// ============================================================================

export type TicketStatus = 'open' | 'in-progress' | 'pending' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type TicketType = 'incident' | 'request' | 'change' | 'problem'
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'more-info'
export type KnowledgeStatus = 'draft' | 'review' | 'published' | 'archived'
export type UserRole = 'agent' | 'manager'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  group?: string
  avatar?: string
  status: 'available' | 'busy' | 'offline'
  totalResolved: number
  totalAssigned: number
  slaCompliance: number
}

export interface Ticket {
  id: string
  title: string
  description: string
  type: TicketType
  priority: TicketPriority
  status: TicketStatus
  createdBy: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  dueDate?: string
  resolvedAt?: string
  closedAt?: string
  category?: string
  tags?: string[]
  resolutionNotes?: string
  linkedKnowledgeArticles?: string[]
  csatScore?: number
  slaStatus?: 'compliant' | 'at-risk' | 'breached'
  comments?: Array<{ userId: string; text: string; createdAt: string }>
  worklogs?: Array<{ userId: string; duration: number; notes: string; createdAt: string }>
}

export interface Approval {
  id: string
  title: string
  type: 'escalation' | 'change' | 'knowledge' | 'request'
  status: ApprovalStatus
  requiredApprover: string
  createdAt: string
  updatedAt: string
  linkedTicketId?: string
  linkedArticleId?: string
  requestDetails?: Record<string, unknown>
}

export interface KnowledgeArticle {
  id: string
  title: string
  category: string
  status: KnowledgeStatus
  author: string
  createdAt: string
  publishedAt?: string
  updatedAt: string
  views: number
  helpful: number
  content?: string
  linkedTickets?: string[]
}

export interface TodoAction {
  id: string
  assignedTo: string
  description: string
  type: 'ticket' | 'approval' | 'follow-up'
  linkedEntityId?: string
  completed: boolean
  dueDate?: string
  createdAt: string
  completedAt?: string
}

export interface SLARecord {
  id: string
  ticketId: string
  responseDeadline?: string
  resolutionDeadline?: string
  responseBreached: boolean
  resolutionBreached: boolean
  complianceScore: number
}

export interface WorkloadRecord {
  userId: string
  totalTickets: number
  openTickets: number
  resolvedToday: number
  averageResolutionTime: number
  slaComplianceToday: number
  capacityUsage: number
}

export interface LeaderboardEntry {
  userId: string
  userName: string
  resolvedTickets: number
  slaCompliance: number
  csat: number
  knowledgeContributions: number
  totalScore: number
  rank: number
}

export interface AuditLog {
  id: string
  actor: string
  action: string
  entityType: 'ticket' | 'approval' | 'knowledge' | 'user'
  entityId: string
  changes?: Record<string, { from: unknown; to: unknown }>
  timestamp: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  linked?: { type: string; id: string }
  read: boolean
  createdAt: string
}

// ============================================================================
// STORE STATE
// ============================================================================

export interface StoreState {
  users: Map<string, User>
  tickets: Map<string, Ticket>
  approvals: Map<string, Approval>
  knowledgeArticles: Map<string, KnowledgeArticle>
  todoActions: Map<string, TodoAction>
  slaRecords: Map<string, SLARecord>
  workloadRecords: Map<string, WorkloadRecord>
  assignmentQueues: Map<string, any>
  leaderboardEntries: LeaderboardEntry[]
  auditLogs: AuditLog[]
  notifications: Notification[]
  currentUserId?: string
}

// ============================================================================
// EVENT SYSTEM
// ============================================================================

export class ApplicationStore extends EventEmitter {
  private state: StoreState = {
    users: new Map(),
    tickets: new Map(),
    approvals: new Map(),
    knowledgeArticles: new Map(),
    todoActions: new Map(),
    slaRecords: new Map(),
    workloadRecords: new Map(),
    assignmentQueues: new Map(),
    leaderboardEntries: [],
    auditLogs: [],
    notifications: [],
  }

  // Get state snapshot
  getState(): StoreState {
    return this.state
  }

  // ============================================================================
  // TICKET OPERATIONS
  // ============================================================================

  createTicket(ticket: Ticket): Ticket {
    this.state.tickets.set(ticket.id, ticket)
    this.emit('ticket.created', ticket)
    this.emitAuditLog('create', 'ticket', ticket.id, { ticket })
    this.updateLeaderboard()
    this.generateNotification(ticket.createdBy, `Ticket ${ticket.id} created: ${ticket.title}`, 'ticket.created', ticket.id)
    return ticket
  }

  updateTicket(ticketId: string, updates: Partial<Ticket>): void {
    const ticket = this.state.tickets.get(ticketId)
    if (!ticket) return

    const oldTicket = { ...ticket }
    const updatedTicket = { ...ticket, ...updates, updatedAt: new Date().toISOString() }
    this.state.tickets.set(ticketId, updatedTicket)

    this.emit('ticket.updated', updatedTicket, oldTicket)
    this.emitAuditLog('update', 'ticket', ticketId, {
      from: oldTicket,
      to: updatedTicket,
    })

    // Emit specific events for priority changes
    if (updates.priority && updates.priority !== oldTicket.priority) {
      this.emit('ticket.priority-changed', { ticketId, newPriority: updates.priority, oldPriority: oldTicket.priority })
    }

    // Handle status changes and emit specific event
    if (updates.status && updates.status !== oldTicket.status) {
      this.emit('ticket.status-changed', { ticketId, newStatus: updates.status, oldStatus: oldTicket.status })
      this.handleTicketStatusChange(updatedTicket, oldTicket.status)
    }
  }

  assignTicket(ticketId: string, userId: string, previousAssignee?: string): void {
    const ticket = this.state.tickets.get(ticketId)
    if (!ticket) return

    // Determine if this is a reassignment
    const isReassignment = ticket.assignedTo && ticket.assignedTo !== userId
    const prevAssignee = isReassignment ? ticket.assignedTo : previousAssignee

    this.updateTicket(ticketId, { assignedTo: userId })
    this.emit('ticket.assigned', { ticketId, userId, previousAssignee: prevAssignee })

    // Emit specific reassignment event if applicable
    if (isReassignment && prevAssignee) {
      this.emit('ticket.reassigned', { ticketId, fromUserId: prevAssignee, toUserId: userId })
    }

    // Add to assignee's workload and todo
    this.addToAgentWorkload(userId, ticketId)
    this.addToAgentTodo(userId, ticketId, 'ticket')

    // Remove from previous assignee if exists
    if (prevAssignee) {
      this.removeFromAgentWorkload(prevAssignee, ticketId)
      this.removeFromAgentTodo(prevAssignee, ticketId)
      this.generateNotification(
        prevAssignee,
        `Ticket ${ticketId} reassigned to ${this.getUserName(userId)}`,
        'ticket.reassigned',
        ticketId
      )
    }

    // Notify new assignee
    this.generateNotification(userId, `Ticket ${ticketId} assigned to you`, 'ticket.assigned', ticketId)

    // Update manager dashboard
    this.emit('workload.updated')
  }

  escalateTicket(ticketId: string, reason: string): void {
    const ticket = this.state.tickets.get(ticketId)
    if (!ticket) return

    this.updateTicket(ticketId, { priority: 'critical' })
    this.emit('ticket.escalated', { ticketId, reason })
    
    // Notify assignee of escalation
    if (ticket.assignedTo) {
      this.generateNotification(
        ticket.assignedTo,
        `Ticket ${ticketId} escalated to critical priority. Reason: ${reason}`,
        'ticket.escalated',
        ticketId
      )
    }

    // Notify manager
    this.generateNotification(
      'manager1',
      `Critical ticket ${ticketId} requires attention. ${reason}`,
      'ticket.escalated',
      ticketId
    )
  }

  resolveTicket(ticketId: string, resolutionNotes: string): void {
    const ticket = this.state.tickets.get(ticketId)
    if (!ticket) return

    const resolvedAt = new Date().toISOString()
    this.updateTicket(ticketId, { status: 'resolved', resolutionNotes, resolvedAt })
    this.emit('ticket.resolved', { ticketId, resolvedAt })

    // Update agent metrics
    if (ticket.assignedTo) {
      const user = this.state.users.get(ticket.assignedTo)
      if (user) {
        user.totalResolved++
        this.emit('user.updated', user)
      }

      // Add leaderboard points
      this.updateLeaderboard()
    }

    // Mark todo as completed
    this.completeAgentTodo(ticket.assignedTo, ticketId)
  }

  closeTicket(ticketId: string): void {
    const ticket = this.state.tickets.get(ticketId)
    if (!ticket) return

    const closedAt = new Date().toISOString()
    this.updateTicket(ticketId, { status: 'closed', closedAt })
    this.emit('ticket.closed', { ticketId, closedAt })
  }

  private handleTicketStatusChange(ticket: Ticket, previousStatus: TicketStatus): void {
    if (ticket.status === 'resolved') {
      this.emit('ticket.resolved', ticket)
    } else if (ticket.status === 'closed') {
      this.emit('ticket.closed', ticket)
    }
  }

  // ============================================================================
  // APPROVAL OPERATIONS
  // ============================================================================

  approveApproval(approvalId: string, notes?: string): void {
    const approval = this.state.approvals.get(approvalId)
    if (!approval) return

    approval.status = 'approved'
    approval.updatedAt = new Date().toISOString()
    this.state.approvals.set(approvalId, approval)
    this.emit('approval.approved', approval)

    this.emitAuditLog('approve', 'approval', approvalId, { notes })

    // Remove from manager todo
    const managerTodos = Array.from(this.state.todoActions.values()).filter(
      (t) => t.assignedTo === approval.requiredApprover && t.linkedEntityId === approvalId
    )
    managerTodos.forEach((t) => {
      t.completed = true
      t.completedAt = new Date().toISOString()
    })
  }

  rejectApproval(approvalId: string, reason: string): void {
    const approval = this.state.approvals.get(approvalId)
    if (!approval) return

    approval.status = 'rejected'
    approval.updatedAt = new Date().toISOString()
    this.state.approvals.set(approvalId, approval)
    this.emit('approval.rejected', approval)

    this.emitAuditLog('reject', 'approval', approvalId, { reason })
  }

  // ============================================================================
  // KNOWLEDGE OPERATIONS
  // ============================================================================

  createKnowledgeArticle(article: KnowledgeArticle): KnowledgeArticle {
    this.state.knowledgeArticles.set(article.id, article)
    this.emit('knowledge.created', article)
    return article
  }

  publishKnowledgeArticle(articleId: string): void {
    const article = this.state.knowledgeArticles.get(articleId)
    if (!article) return

    article.status = 'published'
    article.publishedAt = new Date().toISOString()
    article.updatedAt = new Date().toISOString()
    this.state.knowledgeArticles.set(articleId, article)

    this.emit('knowledge.published', article)
    this.emit('knowledge.reviewed', article)
    this.updateLeaderboard()
  }

  submitKnowledgeForReview(articleId: string): void {
    const article = this.state.knowledgeArticles.get(articleId)
    if (!article) return

    article.status = 'review'
    article.updatedAt = new Date().toISOString()
    this.state.knowledgeArticles.set(articleId, article)

    this.emit('knowledge.submitted_for_review', article)

    // Create approval for manager
    const approvalId = `APR-KB-${Date.now()}`
    const approval: Approval = {
      id: approvalId,
      title: `Knowledge Review: ${article.title}`,
      type: 'knowledge',
      status: 'pending',
      requiredApprover: this.findManager(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      linkedArticleId: articleId,
    }
    this.state.approvals.set(approvalId, approval)
  }

  // ============================================================================
  // WORKLOAD SYNCHRONIZATION
  // ============================================================================

  private addToAgentWorkload(userId: string, ticketId: string): void {
    let workload = this.state.workloadRecords.get(userId)
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

    workload.totalTickets++
    workload.openTickets++
    workload.capacityUsage = Math.min(100, (workload.openTickets / 10) * 100) // Assume capacity of 10 tickets
    this.state.workloadRecords.set(userId, workload)

    this.emit('workload.updated', workload)
  }

  private removeFromAgentWorkload(userId: string, ticketId: string): void {
    let workload = this.state.workloadRecords.get(userId)
    if (!workload) return

    workload.totalTickets = Math.max(0, workload.totalTickets - 1)
    workload.openTickets = Math.max(0, workload.openTickets - 1)
    workload.capacityUsage = Math.min(100, (workload.openTickets / 10) * 100)
    this.state.workloadRecords.set(userId, workload)

    this.emit('workload.updated', workload)
  }

  // ============================================================================
  // TODO MANAGEMENT
  // ============================================================================

  private addToAgentTodo(userId: string, linkedEntityId: string, type: 'ticket' | 'approval' | 'follow-up'): void {
    const todo: TodoAction = {
      id: `TODO-${Date.now()}`,
      assignedTo: userId,
      description: type === 'ticket' ? `Handle ticket ${linkedEntityId}` : `Complete approval ${linkedEntityId}`,
      type,
      linkedEntityId,
      completed: false,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    }
    this.state.todoActions.set(todo.id, todo)
    this.emit('todo.created', todo)
  }

  private removeFromAgentTodo(userId: string, linkedEntityId: string): void {
    const todos = Array.from(this.state.todoActions.values()).filter(
      (t) => t.assignedTo === userId && t.linkedEntityId === linkedEntityId
    )
    todos.forEach((t) => this.state.todoActions.delete(t.id))
  }

  private completeAgentTodo(userId: string | undefined, linkedEntityId: string): void {
    if (!userId) return
    const todos = Array.from(this.state.todoActions.values()).filter(
      (t) => t.assignedTo === userId && t.linkedEntityId === linkedEntityId && !t.completed
    )
    todos.forEach((t) => {
      t.completed = true
      t.completedAt = new Date().toISOString()
    })
  }

  // ============================================================================
  // LEADERBOARD CALCULATIONS
  // ============================================================================

  private updateLeaderboard(): void {
    const entries: LeaderboardEntry[] = []

    this.state.users.forEach((user, userId) => {
      if (user.role !== 'agent') return

      const userTickets = Array.from(this.state.tickets.values()).filter((t) => t.assignedTo === userId)
      const resolvedTickets = userTickets.filter((t) => t.status === 'resolved' || t.status === 'closed').length
      const slaCompliance = user.slaCompliance
      const csat = 85 + Math.random() * 15 // Mock CSAT
      const knowledgeContributions = Array.from(this.state.knowledgeArticles.values()).filter(
        (a) => a.author === userId && a.status === 'published'
      ).length

      const totalScore = resolvedTickets * 10 + slaCompliance * 5 + csat + knowledgeContributions * 20

      entries.push({
        userId,
        userName: user.name,
        resolvedTickets,
        slaCompliance,
        csat,
        knowledgeContributions,
        totalScore,
        rank: 0,
      })
    })

    // Sort and assign ranks
    entries.sort((a, b) => b.totalScore - a.totalScore)
    entries.forEach((entry, index) => {
      entry.rank = index + 1
    })

    this.state.leaderboardEntries = entries
    this.emit('leaderboard.updated', entries)
  }

  // ============================================================================
  // QUEUE OPERATIONS
  // ============================================================================

  createQueue(queue: any): any {
    this.state.assignmentQueues.set(queue.id, queue)
    this.emit('queue.created', queue)
    return queue
  }

  updateQueue(queueId: string, updates: Partial<any>): void {
    const queue = this.state.assignmentQueues.get(queueId)
    if (!queue) return
    const updatedQueue = { ...queue, ...updates, updatedAt: new Date().toISOString() }
    this.state.assignmentQueues.set(queueId, updatedQueue)
    this.emit('queue.updated', updatedQueue)
  }

  deleteQueue(queueId: string): void {
    this.state.assignmentQueues.delete(queueId)
    this.emit('queue.deleted', queueId)
  }

  getQueue(queueId: string): any | undefined {
    return this.state.assignmentQueues.get(queueId)
  }

  getAllQueues(): any[] {
    return Array.from(this.state.assignmentQueues.values())
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private generateNotification(userId: string, message: string, type: string, linkedId: string): void {
    const notification: Notification = {
      id: `NOTIF-${Date.now()}`,
      userId,
      type,
      title: type.split('.')[0],
      message,
      linked: { type: type.split('.')[0], id: linkedId },
      read: false,
      createdAt: new Date().toISOString(),
    }
    this.state.notifications.push(notification)
    this.emit('notification.created', notification)
  }

  setUserPresence(userId: string, status: 'available' | 'busy' | 'offline'): void {
    const user = this.state.users.get(userId)
    if (!user) return

    user.status = status
    
    if (status === 'available') {
      this.emit('user.available', { userId, updatedAt: new Date().toISOString() })
    } else if (status === 'busy') {
      this.emit('user.busy', { userId, updatedAt: new Date().toISOString() })
    } else if (status === 'offline') {
      this.emit('user.offline', { userId, updatedAt: new Date().toISOString() })
    }

    this.emit('user.updated', user)
  }

  addWorklog(ticketId: string, userId: string, duration: number, notes: string): void {
    const ticket = this.state.tickets.get(ticketId)
    if (!ticket) return

    // Track worklog in audit log
    this.emitAuditLog('add_worklog', 'ticket', ticketId, { duration, notes, userId })

    // Update leaderboard (worklog contributes to productivity metrics)
    this.updateLeaderboard()

    // Emit event for reports and productivity tracking
    this.emit('worklog.created', { ticketId, userId, duration, notes, createdAt: new Date().toISOString() })

    // Generate notification for manager if worklog on assigned ticket
    if (ticket.assignedTo === userId) {
      this.generateNotification('manager1', `Worklog added to ${ticketId}: ${duration}h - ${notes}`, 'worklog.created', ticketId)
    }
  }

  addComment(ticketId: string, userId: string, text: string): void {
    const ticket = this.state.tickets.get(ticketId)
    if (!ticket) return

    // Track comment in audit log
    this.emitAuditLog('add_comment', 'ticket', ticketId, { userId, text })

    // Emit event for activity feed and workspace timeline
    this.emit('comment.created', {
      id: `COMMENT-${Date.now()}`,
      ticketId,
      userId,
      text,
      createdAt: new Date().toISOString(),
    })

    // Notify ticket assignee if someone else comments
    if (ticket.assignedTo && ticket.assignedTo !== userId) {
      const commenter = this.state.users.get(userId)
      const commenterName = commenter?.name || userId
      this.generateNotification(
        ticket.assignedTo,
        `${commenterName} commented on ${ticketId}: "${text.substring(0, 50)}..."`,
        'comment.created',
        ticketId
      )
    }
  }

  private emitAuditLog(action: string, entityType: 'ticket' | 'approval' | 'knowledge' | 'user', entityId: string, details?: Record<string, unknown>): void {
    const log: AuditLog = {
      id: `AUDIT-${Date.now()}`,
      actor: this.state.currentUserId || 'system',
      action,
      entityType,
      entityId,
      changes: details as Record<string, { from: unknown; to: unknown }>,
      timestamp: new Date().toISOString(),
    }
    this.state.auditLogs.push(log)
    this.emit('audit.logged', log)
  }

  getUserName(userId: string): string {
    return this.state.users.get(userId)?.name || 'Unknown'
  }

  private findManagerForTicket(ticket: Ticket): string {
    const managers = Array.from(this.state.users.values()).filter((u) => u.role === 'manager')
    return managers[0]?.id || 'manager1'
  }

  private findManager(): string {
    const managers = Array.from(this.state.users.values()).filter((u) => u.role === 'manager')
    return managers[0]?.id || 'manager1'
  }

  // ============================================================================
  // STATE INITIALIZATION
  // ============================================================================

  async initializeWithMockData(): Promise<void> {
    // Create users: 1 Manager + 5 Agents
    const users: User[] = [
      {
        id: 'manager1',
        name: 'Robert Anderson',
        email: 'robert@adambridge.com',
        role: 'manager',
        group: 'Service Desk Manager',
        status: 'available',
        totalResolved: 0,
        totalAssigned: 0,
        slaCompliance: 100,
      },
      {
        id: 'agent1',
        name: 'Sarah Johnson',
        email: 'sarah@adambridge.com',
        role: 'agent',
        group: 'L1 Service Desk',
        status: 'available',
        totalResolved: 0,
        totalAssigned: 0,
        slaCompliance: 95,
      },
      {
        id: 'agent2',
        name: 'Michael Chen',
        email: 'michael@adambridge.com',
        role: 'agent',
        group: 'L1 Service Desk',
        status: 'available',
        totalResolved: 0,
        totalAssigned: 0,
        slaCompliance: 92,
      },
      {
        id: 'agent3',
        name: 'Emma Williams',
        email: 'emma@adambridge.com',
        role: 'agent',
        group: 'L2 Support',
        status: 'available',
        totalResolved: 0,
        totalAssigned: 0,
        slaCompliance: 94,
      },
      {
        id: 'agent4',
        name: 'James Rodriguez',
        email: 'james@adambridge.com',
        role: 'agent',
        group: 'L2 Support',
        status: 'available',
        totalResolved: 0,
        totalAssigned: 0,
        slaCompliance: 89,
      },
      {
        id: 'agent5',
        name: 'David Kumar',
        email: 'david@adambridge.com',
        role: 'agent',
        group: 'L3 Support Engineer',
        status: 'available',
        totalResolved: 0,
        totalAssigned: 0,
        slaCompliance: 96,
      },
      {
        id: 'agent5',
        name: 'Lisa Anderson',
        email: 'lisa@adambridge.com',
        role: 'agent',
        group: 'L3 Engineering',
        status: 'available',
        totalResolved: 0,
        totalAssigned: 0,
        slaCompliance: 96,
      },
    ]

    users.forEach((u) => this.state.users.set(u.id, u))

    // Load enhanced demo tickets with realistic business scenarios
    const tickets = getEnhancedDemoTickets()

    tickets.forEach((t) => this.state.tickets.set(t.id, t))

    // Initialize assignment queues from the assignment engine
    const { assignmentEngine } = await import('./assignment-engine')
    const queues = assignmentEngine.getAllQueues()
    queues.forEach((q) => this.state.assignmentQueues.set(q.id, q))

    this.emit('store.initialized')
  }
}

// Create singleton instance
export const applicationStore = new ApplicationStore()
