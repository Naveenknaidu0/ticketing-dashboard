import {
  Skill,
  AgentCapacity,
  AssignmentQueue,
  AssignmentRule,
  AssignmentStrategy,
  EscalationRule,
  AssignmentAutomation,
  AssignmentLog,
  AssignmentMetrics,
} from './types'

/**
 * Assignment Engine - Central module for ticket routing and assignment management
 * Manages queues, skills, capacities, rules, automations, and assignment history
 */

export class AssignmentEngine {
  private skills: Map<string, Skill> = new Map()
  private capacities: Map<string, AgentCapacity> = new Map()
  private queues: Map<string, AssignmentQueue> = new Map()
  private rules: Map<string, AssignmentRule> = new Map()
  private strategies: Map<string, AssignmentStrategy> = new Map()
  private escalations: Map<string, EscalationRule> = new Map()
  private automations: Map<string, AssignmentAutomation> = new Map()
  private logs: AssignmentLog[] = []

  constructor() {
    this.initializeDefaults()
  }

  /**
   * Initialize with default queues, skills, and configurations
   */
  private initializeDefaults() {
    // Default Skills
    this.createSkill({
      id: 'skill-technical',
      name: 'Technical Support',
      description: 'Technical issue resolution',
      requiredCertifications: [],
      agentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    this.createSkill({
      id: 'skill-billing',
      name: 'Billing & Accounts',
      description: 'Billing inquiries and account management',
      requiredCertifications: [],
      agentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    this.createSkill({
      id: 'skill-general',
      name: 'General Support',
      description: 'General customer inquiries',
      requiredCertifications: [],
      agentCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Default Queues - Enterprise Structure
    this.createQueue({
      id: 'queue-general',
      queueCode: 'GEN-001',
      name: 'General Queue',
      description: 'Default general support queue',
      queueType: 'support',
      department: 'Support',
      businessUnit: 'Operations',
      owner: 'Sarah Johnson',
      members: [
        { userId: 'user-1', name: 'Sarah Johnson', role: 'queue-lead' },
        { userId: 'user-2', name: 'Michael Chen', role: 'agent' },
        { userId: 'user-3', name: 'Emma Williams', role: 'agent' },
      ],
      capacity: {
        maxOpenTickets: 50,
        maxCritical: 5,
        maxHigh: 10,
        maxSlaRisk: 8,
        maxDailyAssignments: 100,
        maxConcurrent: 10,
      },
      businessHours: { mode: '24x7' },
      skills: [
        { skillId: 'skill-general', skillName: 'General Support', minimumLevel: 1, required: true },
      ],
      assignmentStrategy: 'round-robin',
      escalation: { escalationConditions: [] },
      ticketCount: 0,
      openTickets: 0,
      avgWaitTime: 0,
      slaRiskCount: 0,
      healthScore: 100,
      capacityUtilization: 0,
      version: 1,
      status: 'active',
      isActive: true,
      templateIds: [],
      versionHistory: [],
      currentVersionId: `v-queue-general-1`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    })

    this.createQueue({
      id: 'queue-billing',
      queueCode: 'BIL-001',
      name: 'Billing Queue',
      description: 'Billing and account management',
      queueType: 'support',
      department: 'Billing',
      businessUnit: 'Finance',
      owner: 'Lisa Anderson',
      members: [
        { userId: 'user-4', name: 'Lisa Anderson', role: 'queue-lead' },
      ],
      capacity: {
        maxOpenTickets: 30,
        maxCritical: 3,
        maxHigh: 6,
        maxSlaRisk: 5,
        maxDailyAssignments: 60,
        maxConcurrent: 8,
      },
      businessHours: { mode: 'business-hours', startTime: '09:00', endTime: '17:00', timezone: 'UTC' },
      skills: [
        { skillId: 'skill-billing', skillName: 'Billing Management', minimumLevel: 2, required: true },
      ],
      assignmentStrategy: 'least-workload',
      escalation: { escalationConditions: [] },
      ticketCount: 0,
      openTickets: 0,
      avgWaitTime: 0,
      slaRiskCount: 0,
      healthScore: 100,
      capacityUtilization: 0,
      version: 1,
      status: 'active',
      isActive: true,
      templateIds: [],
      versionHistory: [],
      currentVersionId: `v-queue-billing-1`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    })

    this.createQueue({
      id: 'queue-escalation',
      queueCode: 'ESC-001',
      name: 'Escalation Queue',
      description: 'Escalated and high-priority tickets',
      queueType: 'escalation',
      department: 'Support',
      businessUnit: 'Operations',
      owner: 'John Smith',
      members: [
        { userId: 'user-5', name: 'John Smith', role: 'queue-lead' },
        { userId: 'user-6', name: 'David Kumar', role: 'senior-agent' },
      ],
      capacity: {
        maxOpenTickets: 20,
        maxCritical: 10,
        maxHigh: 5,
        maxSlaRisk: 15,
        maxDailyAssignments: 40,
        maxConcurrent: 5,
      },
      businessHours: { mode: '24x7' },
      skills: [
        { skillId: 'skill-technical', skillName: 'Technical Support', minimumLevel: 3, required: true },
        { skillId: 'skill-general', skillName: 'General Support', minimumLevel: 2, required: false },
      ],
      assignmentStrategy: 'skill-based',
      escalation: { escalationConditions: [] },
      ticketCount: 0,
      openTickets: 0,
      avgWaitTime: 0,
      slaRiskCount: 0,
      healthScore: 100,
      capacityUtilization: 0,
      version: 1,
      status: 'active',
      isActive: true,
      templateIds: [],
      versionHistory: [],
      currentVersionId: `v-queue-escalation-1`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    })

    this.createQueue({
      id: 'queue-vip',
      queueCode: 'VIP-001',
      name: 'VIP Queue',
      description: 'VIP customer support',
      queueType: 'vip',
      department: 'Support',
      businessUnit: 'Operations',
      owner: 'James Rodriguez',
      members: [
        { userId: 'user-7', name: 'James Rodriguez', role: 'queue-lead' },
        { userId: 'user-8', name: 'Emma Williams', role: 'senior-agent' },
      ],
      capacity: {
        maxOpenTickets: 15,
        maxCritical: 10,
        maxHigh: 5,
        maxSlaRisk: 2,
        maxDailyAssignments: 30,
        maxConcurrent: 3,
      },
      businessHours: { mode: '24x7' },
      skills: [
        { skillId: 'skill-technical', skillName: 'Technical Support', minimumLevel: 3, required: true },
        { skillId: 'skill-billing', skillName: 'Billing Management', minimumLevel: 2, required: false },
      ],
      assignmentStrategy: 'capacity-based',
      escalation: { escalationConditions: [] },
      ticketCount: 0,
      openTickets: 0,
      avgWaitTime: 0,
      slaRiskCount: 0,
      healthScore: 100,
      capacityUtilization: 0,
      version: 1,
      status: 'active',
      isActive: true,
      templateIds: [],
      versionHistory: [],
      currentVersionId: `v-queue-vip-1`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    })

    this.createQueue({
      id: 'queue-overflow',
      queueCode: 'OVF-001',
      name: 'Overflow Queue',
      description: 'Overflow queue for peak times',
      queueType: 'overflow',
      department: 'Support',
      businessUnit: 'Operations',
      owner: 'Michael Chen',
      members: [
        { userId: 'user-2', name: 'Michael Chen', role: 'queue-lead' },
      ],
      capacity: {
        maxOpenTickets: 100,
        maxCritical: 5,
        maxHigh: 15,
        maxSlaRisk: 20,
        maxDailyAssignments: 200,
        maxConcurrent: 20,
      },
      businessHours: { mode: '24x7' },
      skills: [
        { skillId: 'skill-general', skillName: 'General Support', minimumLevel: 1, required: true },
      ],
      assignmentStrategy: 'random',
      escalation: { escalationConditions: [] },
      ticketCount: 0,
      openTickets: 0,
      avgWaitTime: 0,
      slaRiskCount: 0,
      healthScore: 100,
      capacityUtilization: 0,
      version: 1,
      status: 'active',
      isActive: true,
      templateIds: [],
      versionHistory: [],
      currentVersionId: `v-queue-overflow-1`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    })

    this.createQueue({
      id: 'queue-approval',
      queueCode: 'APR-001',
      name: 'Approval Queue',
      description: 'Tickets requiring approval',
      queueType: 'approval',
      department: 'Management',
      businessUnit: 'Operations',
      owner: 'John Smith',
      members: [
        { userId: 'user-5', name: 'John Smith', role: 'queue-lead' },
      ],
      capacity: {
        maxOpenTickets: 50,
        maxCritical: 50,
        maxHigh: 50,
        maxSlaRisk: 50,
        maxDailyAssignments: 100,
        maxConcurrent: 10,
      },
      businessHours: { mode: 'business-hours', startTime: '08:00', endTime: '18:00', timezone: 'UTC' },
      skills: [
        { skillId: 'skill-general', skillName: 'General Support', minimumLevel: 1, required: true },
      ],
      assignmentStrategy: 'hybrid',
      escalation: { escalationConditions: [] },
      ticketCount: 0,
      openTickets: 0,
      avgWaitTime: 0,
      slaRiskCount: 0,
      healthScore: 100,
      capacityUtilization: 0,
      version: 1,
      status: 'active',
      isActive: true,
      templateIds: [],
      versionHistory: [],
      currentVersionId: `v-queue-approval-1`,
      createdBy: 'admin',
      createdAt: new Date().toISOString(),
      updatedBy: 'admin',
      updatedAt: new Date().toISOString(),
    })

    // Default Assignment Rule
    this.createRule({
      id: 'rule-skill-match',
      name: 'Skill Match Routing',
      code: 'SKILL_ROUTE_001',
      description: 'Route to agents with matching skills',
      category: 'skill-match',
      priority: 1,
      status: 'active',
      ruleType: 'skill-match',
      triggers: [],
      conditions: [
        {
          id: 'cond-1',
          field: 'ticketCategory',
          fieldType: 'string',
          operator: 'contains',
          value: 'technical',
          logicOperator: 'and',
          createdAt: new Date().toISOString(),
        },
      ],
      actions: [
        {
          id: 'action-1',
          type: 'assign-to-queue',
          sequence: 1,
          config: { targetQueue: 'queue-technical' },
          executionTime: 100,
          successRate: 95,
          createdAt: new Date().toISOString(),
        },
      ],
      conflictResolution: 'first-match-wins',
      executionCount: 0,
      successRate: 0,
      version: 1,
      isDraft: false,
      createdBy: 'System',
      createdAt: new Date().toISOString(),
      updatedBy: 'System',
      updatedAt: new Date().toISOString(),
    })

    // Default Strategy
    this.createStrategy({
      id: 'strategy-default',
      name: 'Default Routing Strategy',
      description: 'Default assignment strategy combining skill and workload',
      rules: ['rule-skill-match'],
      fallbackQueue: 'queue-general',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    // Default Automation
    this.createAutomation({
      id: 'auto-on-create',
      name: 'Auto-assign on Create',
      description: 'Automatically assign tickets upon creation',
      trigger: 'on-create',
      action: 'auto-assign',
      assignmentStrategy: 'strategy-default',
      conditions: [],
      isActive: true,
      successRate: 0,
      lastRun: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  // ===== SKILL MANAGEMENT =====

  createSkill(skill: Skill): Skill {
    this.skills.set(skill.id, skill)
    return skill
  }

  getSkill(id: string): Skill | undefined {
    return this.skills.get(id)
  }

  getAllSkills(): Skill[] {
    return Array.from(this.skills.values())
  }

  updateSkill(id: string, updates: Partial<Skill>): Skill | undefined {
    const skill = this.skills.get(id)
    if (!skill) return undefined
    const updated = { ...skill, ...updates, updatedAt: new Date().toISOString() }
    this.skills.set(id, updated)
    return updated
  }

  deleteSkill(id: string): boolean {
    return this.skills.delete(id)
  }

  // ===== CAPACITY MANAGEMENT =====

  createCapacity(capacity: AgentCapacity): AgentCapacity {
    this.capacities.set(capacity.id, capacity)
    return capacity
  }

  getCapacity(id: string): AgentCapacity | undefined {
    return this.capacities.get(id)
  }

  getCapacitiesByAgent(agentId: string): AgentCapacity[] {
    return Array.from(this.capacities.values()).filter(c => c.agentId === agentId)
  }

  getAllCapacities(): AgentCapacity[] {
    return Array.from(this.capacities.values())
  }

  updateCapacity(id: string, updates: Partial<AgentCapacity>): AgentCapacity | undefined {
    const capacity = this.capacities.get(id)
    if (!capacity) return undefined
    const updated = { ...capacity, ...updates, updatedAt: new Date().toISOString() }
    this.capacities.set(id, updated)
    return updated
  }

  // ===== QUEUE MANAGEMENT =====

  createQueue(queue: AssignmentQueue): AssignmentQueue {
    this.queues.set(queue.id, queue)
    return queue
  }

  getQueue(id: string): AssignmentQueue | undefined {
    return this.queues.get(id)
  }

  getAllQueues(): AssignmentQueue[] {
    return Array.from(this.queues.values()).filter(q => q.isActive)
  }

  updateQueue(id: string, updates: Partial<AssignmentQueue>): AssignmentQueue | undefined {
    const queue = this.queues.get(id)
    if (!queue) return undefined
    const updated = { ...queue, ...updates, updatedAt: new Date().toISOString() }
    this.queues.set(id, updated)
    return updated
  }

  // ===== RULE MANAGEMENT =====

  createRule(rule: AssignmentRule): AssignmentRule {
    this.rules.set(rule.id, rule)
    return rule
  }

  getRule(id: string): AssignmentRule | undefined {
    return this.rules.get(id)
  }

  getAllRules(): AssignmentRule[] {
    return Array.from(this.rules.values()).filter(r => r.status === 'active')
  }

  updateRule(id: string, updates: Partial<AssignmentRule>): AssignmentRule | undefined {
    const rule = this.rules.get(id)
    if (!rule) return undefined
    const updated = { ...rule, ...updates, updatedAt: new Date().toISOString() }
    this.rules.set(id, updated)
    return updated
  }

  // ===== STRATEGY MANAGEMENT =====

  createStrategy(strategy: AssignmentStrategy): AssignmentStrategy {
    this.strategies.set(strategy.id, strategy)
    return strategy
  }

  getStrategy(id: string): AssignmentStrategy | undefined {
    return this.strategies.get(id)
  }

  getAllStrategies(): AssignmentStrategy[] {
    return Array.from(this.strategies.values()).filter(s => s.isActive)
  }

  updateStrategy(id: string, updates: Partial<AssignmentStrategy>): AssignmentStrategy | undefined {
    const strategy = this.strategies.get(id)
    if (!strategy) return undefined
    const updated = { ...strategy, ...updates, updatedAt: new Date().toISOString() }
    this.strategies.set(id, updated)
    return updated
  }

  // ===== ESCALATION MANAGEMENT =====

  createEscalation(escalation: EscalationRule): EscalationRule {
    this.escalations.set(escalation.id, escalation)
    return escalation
  }

  getEscalation(id: string): EscalationRule | undefined {
    return this.escalations.get(id)
  }

  getAllEscalations(): EscalationRule[] {
    return Array.from(this.escalations.values()).filter(e => e.isActive)
  }

  updateEscalation(id: string, updates: Partial<EscalationRule>): EscalationRule | undefined {
    const escalation = this.escalations.get(id)
    if (!escalation) return undefined
    const updated = { ...escalation, ...updates, updatedAt: new Date().toISOString() }
    this.escalations.set(id, updated)
    return updated
  }

  // ===== AUTOMATION MANAGEMENT =====

  createAutomation(automation: AssignmentAutomation): AssignmentAutomation {
    this.automations.set(automation.id, automation)
    return automation
  }

  getAutomation(id: string): AssignmentAutomation | undefined {
    return this.automations.get(id)
  }

  getAllAutomations(): AssignmentAutomation[] {
    return Array.from(this.automations.values()).filter(a => a.isActive)
  }

  updateAutomation(id: string, updates: Partial<AssignmentAutomation>): AssignmentAutomation | undefined {
    const automation = this.automations.get(id)
    if (!automation) return undefined
    const updated = { ...automation, ...updates, updatedAt: new Date().toISOString() }
    this.automations.set(id, updated)
    return updated
  }

  // ===== ASSIGNMENT LOGGING =====

  logAssignment(log: AssignmentLog): void {
    this.logs.push(log)
  }

  getAssignmentLogs(limit: number = 100): AssignmentLog[] {
    return this.logs.slice(-limit).reverse()
  }

  getAssignmentLogsByTicket(ticketId: string): AssignmentLog[] {
    return this.logs.filter(log => log.ticketId === ticketId)
  }

  getAssignmentLogsByAgent(agentId: string): AssignmentLog[] {
    return this.logs.filter(log => log.newAgent === agentId)
  }

  // ===== METRICS =====

  calculateMetrics(totalTickets: number, assignedTickets: number, autoAssignedToday: number, manualAssignmentsToday: number, failedAssignments: number, slaRiskTickets: number): AssignmentMetrics {
    const successfulAssignments = autoAssignedToday + manualAssignmentsToday
    const totalAttempts = successfulAssignments + failedAssignments
    const successRate = totalAttempts > 0 ? (successfulAssignments / totalAttempts) * 100 : 0

    return {
      unassignedTickets: totalTickets - assignedTickets,
      autoAssignedToday,
      manualAssignmentsToday,
      failedAssignments,
      assignmentSuccessRate: Math.round(successRate),
      slaRisksDueToAssignment: slaRiskTickets,
    }
  }
}

// Singleton instance
export const assignmentEngine = new AssignmentEngine()
