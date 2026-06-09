// Leaderboard Agent type
export interface LeaderboardAgent {
  id: string
  name: string
  role: string
  photo: string
  badge: 'gold' | 'silver' | 'bronze' | 'none'
  rank: number
  points: number
  ticketsResolved: number
  csatScore: number
  avgResponseTime: string
  slaCompliance: number
  responseSLA: number
  resolutionSLA: number
  knowledgeArticles: number
  tasksCompleted: number
}

// Workload Agent type
export interface WorkloadAgent {
  id: string
  name: string
  capacity: number
  capacityUsed: number
  slaRisk: number
  group: string
}

// Ticket type
export interface Ticket {
  id: string
  title: string
  assignee: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'open' | 'in-progress' | 'pending'
  dueDate: string
  slaRisk?: number
}

// ===== ASSIGNMENT ENGINE TYPES =====

// ===== ENHANCED SKILL ENGINE TYPES =====

// Skill Level Definition (Extended)
export interface SkillLevelModel {
  id: string
  skillId: string
  name: string // 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' or custom 'L1' | 'L2' etc
  description: string
  requirements: string[]
  order: number // For custom ordering
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Skill Category from Masters
export interface SkillCategory {
  id: string
  code: string
  name: string // 'Network' | 'Infrastructure' | 'Security' | 'Cloud' | 'Database' | 'Application' | 'Identity' | 'Hardware' | 'Custom'
  description: string
  color: string
  isActive: boolean
  createdAt: string
}

// Certification Definition
export interface SkillCertification {
  id: string
  skillId: string
  name: string // 'Azure Administrator' | 'Cisco CCNA' etc
  provider: string // 'Microsoft' | 'Cisco' etc
  issueDate: string
  expiryDate: string
  isRequired: boolean
  isOptional: boolean
  url?: string
  createdAt: string
}

// User Skill Assignment (Extended)
export interface UserSkillAssignment {
  id: string
  userId: string
  userName: string
  skillId: string
  skillName: string
  skillLevel: number // 1-5
  isPrimary: boolean
  isSecondary: boolean
  yearsExperience: number
  certifications: {
    certificationId: string
    certificationName: string
    verifiedDate: string
    verifiedBy: string
    expiryDate?: string
  }[]
  assignedDate: string
  assignedBy: string
  lastReviewedDate: string
  lastReviewedBy: string
  status: 'active' | 'inactive' | 'expired'
}

// Skill Eligibility Configuration
export interface SkillEligibility {
  id: string
  skillId: string
  minimumLevel: number // 1-5
  requiredCertifications: string[] // certification IDs
  queuesEligible: string[] // queue IDs
  rulesEligible: string[] // rule IDs
  automationsEligible: string[] // automation IDs
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

// Skill-to-Queue Mapping
export interface SkillQueueMapping {
  id: string
  skillId: string
  skillName: string
  queueId: string
  queueName: string
  minimumLevel: number
  priority: number // 1=required, 2=preferred, 3=optional
  createdAt: string
}

// Skill-to-Rule Mapping
export interface SkillRuleMapping {
  id: string
  skillId: string
  skillName: string
  ruleId: string
  ruleName: string
  minimumLevel: number
  required: boolean
  createdAt: string
}

// Skill-to-Automation Mapping
export interface SkillAutomationMapping {
  id: string
  skillId: string
  skillName: string
  automationId: string
  automationName: string
  minimumLevel: number
  required: boolean
  createdAt: string
}

// Skill Template (Extended)
export interface SkillTemplateComprehensive {
  id: string
  name: string // 'L1 Service Desk Agent' | 'L2 Support Engineer' etc
  description: string
  category: string // from Masters
  role: 'l1-service-desk' | 'l2-support' | 'l3-specialist' | 'network-engineer' | 'security-analyst' | 'cloud-engineer' | 'custom'
  
  // Skills included in template
  skills: {
    skillId: string
    skillName: string
    minimumLevel: number
    isPrimary: boolean
  }[]
  
  // Required certifications
  certifications: {
    certificationId: string
    certificationName: string
    isRequired: boolean
  }[]
  
  // Eligibility rules
  eligibility: {
    queuesEligible: string[]
    rulesEligible: string[]
    automationsEligible: string[]
  }
  
  // Queue mapping
  queueMapping: {
    queueId: string
    priority: number
  }[]
  
  // Configuration
  isActive: boolean
  usageCount: number
  version: number
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

// Skill Usage Analytics
export interface SkillUsageAnalytics {
  skillId: string
  skillName: string
  totalAssignedUsers: number
  activeUsers: number
  inactiveUsers: number
  averageProficiency: number // 1-5
  queuesUsing: {
    queueId: string
    queueName: string
    count: number
  }[]
  rulesUsing: {
    ruleId: string
    ruleName: string
    count: number
  }[]
  automationsUsing: {
    automationId: string
    automationName: string
    count: number
  }[]
  assignmentFrequency: number // in last 30 days
  lastUsedDate: string
}

// Skill Audit Event
export type SkillAuditEventType = 'created' | 'edited' | 'disabled' | 'archived' | 'user-assigned' | 'user-removed' | 'level-changed' | 'certification-added' | 'certification-removed' | 'published' | 'cloned' | 'template-used'

export interface SkillAuditEvent {
  id: string
  skillId: string
  skillName: string
  eventType: SkillAuditEventType
  who: string // user ID
  whoName: string
  when: string
  oldValue?: any
  newValue?: any
  reason?: string
  affectedItems?: {
    type: 'user' | 'queue' | 'rule' | 'automation' | 'certification'
    id: string
    name: string
  }[]
}

// Skill Version Control
export interface SkillVersion {
  id: string
  skillId: string
  versionNumber: number
  status: 'draft' | 'published' | 'archived'
  
  // Snapshot of skill at this version
  snapshot: {
    name: string
    code: string
    description: string
    category: string
    parentSkill?: string
    levels: SkillLevelModel[]
    certifications: SkillCertification[]
    eligibility: SkillEligibility
    queueMappings: SkillQueueMapping[]
    ruleMappings: SkillRuleMapping[]
    automationMappings: SkillAutomationMapping[]
  }
  
  // Change tracking
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  
  // Audit trail
  createdBy: string
  createdAt: string
  publishedBy?: string
  publishedAt?: string
  rollbackTo?: string
  rollbackAt?: string
  rollbackBy?: string
  reason?: string
}

// Enhanced Skill (Complete)
export interface SkillComplete {
  id: string
  code: string
  name: string
  description: string
  category: string // from Masters
  parentSkill?: string // for hierarchical skills
  status: 'draft' | 'active' | 'disabled' | 'archived'
  
  // Proficiency model
  levelModel: SkillLevelModel[]
  defaultLevelCount: number // 5 for default, or custom count
  
  // Certifications
  certifications: SkillCertification[]
  
  // User assignments
  assignedUsers: UserSkillAssignment[]
  totalAssignedUsers: number
  
  // Eligibility
  eligibility: SkillEligibility
  
  // Mappings
  queueMappings: SkillQueueMapping[]
  relatedQueues: number
  ruleMappings: SkillRuleMapping[]
  relatedRules: number
  automationMappings: SkillAutomationMapping[]
  relatedAutomations: number
  
  // Analytics
  usageAnalytics: SkillUsageAnalytics
  
  // Version control
  version: number
  versionHistory: SkillVersion[]
  
  // Audit
  auditLog: SkillAuditEvent[]
  
  // Metadata
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  archivedBy?: string
  archivedAt?: string
}

// Skill List Item (for table display)
export interface SkillListItem {
  id: string
  name: string
  code: string
  category: string
  levelModel: string // 'Default' or custom model name
  assignedUsers: number
  relatedQueues: number
  relatedRules: number
  status: 'draft' | 'active' | 'disabled' | 'archived'
  version: number
  lastUpdated: string
}

// Restore old Skill interface for backward compatibility
export interface Skill {
  id: string
  name: string
  description: string
  requiredCertifications: string[]
  agentCount: number
  createdAt: string
  updatedAt: string
}

// Capacity Template Definition
export interface CapacityTemplate {
  id: string
  name: string
  description: string
  role: 'l1-agent' | 'l2-specialist' | 'l3-expert' | 'manager' | 'custom'
  config: {
    maxOpenTickets: number
    maxCritical: number
    maxHigh: number
    maxSlaRisk: number
    maxDailyAssignments: number
    maxConcurrent: number
  }
  appliedCount: number
  version: number
  createdBy: string
  createdAt: string
}

// Custom Availability Status
export interface CustomAvailabilityStatus {
  id: string
  name: string
  description: string
  color: string
  eligibleForAssignment: boolean
  createdBy: string
  createdAt: string
}

// Assignment Eligibility Result with detailed scoring
export interface EligibilityResult {
  userId: string
  userName: string
  ticketId: string
  queueId: string
  isEligible: boolean
  eligibilityScore: number // 0-100
  reasonsIneligible: string[]
  reasonsEligible: string[]
  scoreBreakdown: {
    skillScore: number
    capacityScore: number
    availabilityScore: number
    queueScore: number
    weightedScore: number
  }
  calculatedAt: string
}

// Assignment Weighted Priority Configuration
export interface AssignmentWeightedPriority {
  id: string
  name: string
  description: string
  weights: {
    skillMatch: number // 0-100, default 40
    capacity: number // 0-100, default 30
    availability: number // 0-100, default 20
    queueMembership: number // 0-100, default 10
  }
  totalWeight: number // should equal 100
  isActive: boolean
  version: number
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

// Simulation Request for testing eligibility logic
export interface AssignmentSimulation {
  id: string
  name: string
  description: string
  ticketId: string
  queueId: string
  results: EligibilityResult[]
  topCandidates: {
    userId: string
    userName: string
    score: number
  }[]
  rejectionReasons: Record<string, string[]> // userId -> reasons
  createdBy: string
  createdAt: string
  simulatedAt: string
}

// Version Control for Capacity/Eligibility Changes
export interface ConfigurationVersion {
  id: string
  versionNumber: number
  entityType: 'capacity' | 'eligibility' | 'priority' | 'availability'
  entityId: string
  status: 'draft' | 'published' | 'archived'
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  changedBy: string
  changedAt: string
  publishedBy?: string
  publishedAt?: string
  rollbackTo?: string
}

// User Skill Assignment
export interface UserSkill {
  userId: string
  skillId: string
  skillName: string
  level: 1 | 2 | 3 | 4
  isPrimary: boolean
  isSecondary: boolean
  yearsExperience: number
  lastUpdated: string
  verifiedBy?: string
}

// Availability Status
export type AvailabilityStatus = 'available' | 'busy' | 'meeting' | 'training' | 'out-of-office' | 'leave' | 'suspended'

// User Availability
export interface UserAvailability {
  userId: string
  status: AvailabilityStatus
  startTime?: string
  endTime?: string
  reason?: string
  eligibleForAssignment: boolean
  lastUpdated: string
  updatedBy: string
}

// User Capacity Configuration
export interface UserCapacity {
  userId: string
  maxOpenTickets: number
  maxCritical: number
  maxHigh: number
  maxSlaRisk: number
  maxDailyAssignments: number
  maxConcurrent: number
  currentOpen: number
  currentCritical: number
  currentHigh: number
  currentSla: number
  dailyAssignedToday: number
  capacityUtilization: number // 0-100
  version: number
  status: 'active' | 'disabled' | 'archived'
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

// Assignment Priority Configuration
export interface AssignmentPriority {
  id: string
  name: string
  skillMatchWeight: number // 0-100
  capacityWeight: number // 0-100
  availabilityWeight: number // 0-100
  queueMembershipWeight: number // 0-100
  version: number
  status: 'draft' | 'active' | 'archived'
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

// Assignment Eligibility Reason
export type EligibilityReason = 'no-skill-match' | 'capacity-reached' | 'out-of-office' | 'queue-restriction' | 'rule-restriction' | 'skill-level-mismatch'

// Assignment Eligibility
export interface AssignmentEligibility {
  userId: string
  queueId: string
  ticketId: string
  status: 'eligible' | 'not-eligible' | 'conditional'
  reasons: EligibilityReason[]
  skillMatch: number // 0-100
  capacityScore: number // 0-100
  availabilityScore: number // 0-100
  queueScore: number // 0-100
  overallScore: number // 0-100
  calculatedAt: string
}

// Skill Template
export interface SkillTemplate {
  id: string
  name: string
  description: string
  role: 'network-engineer' | 'security-analyst' | 'l1-service-desk' | 'l2-support' | 'l3-support' | 'application-support'
  skills: {
    skillId: string
    skillName: string
    minimumLevel: 1 | 2 | 3 | 4
    isPrimary: boolean
  }[]
  capacityTemplate: Partial<UserCapacity>
  version: number
  createdBy: string
  createdAt: string
}

// Capacity Audit Event
export interface CapacityAuditEvent {
  id: string
  eventType: 'skill-added' | 'skill-removed' | 'capacity-changed' | 'availability-changed' | 'eligibility-changed'
  userId: string
  userName: string
  targetId?: string
  targetName?: string
  oldValue?: any
  newValue?: any
  reason?: string
  changedBy: string
  timestamp: string
  version: number
}

// Agent Capacity - Workload limits per agent
export interface AgentCapacity {
  id: string
  agentId: string
  agentName: string
  maxCapacity: number
  currentLoad: number
  skills: string[]
  workingHours: {
    startTime: string
    endTime: string
    timezone: string
  }
  availability: 'available' | 'unavailable' | 'break'
  createdAt: string
  updatedAt: string
}

// Queue Types (7 types)
export type QueueType = 'support' | 'assignment' | 'escalation' | 'vip' | 'overflow' | 'approval' | 'custom'

// Business Hours Configuration
export interface BusinessHours {
  mode: '24x7' | 'business-hours' | 'custom'
  startTime?: string // HH:MM format
  endTime?: string // HH:MM format
  timezone?: string
  holidays?: string[] // ISO dates
}

// Queue Capacity Configuration
export interface QueueCapacity {
  maxOpenTickets: number
  maxCritical: number
  maxHigh: number
  maxSlaRisk: number
  maxDailyAssignments: number
  maxConcurrent: number
  overflowQueue?: string
}

// Queue Skills with Levels
export interface QueueSkill {
  skillId: string
  skillName: string
  minimumLevel: number // 1-5
  required: boolean
}

// Queue Escalation Configuration
export interface QueueEscalation {
  escalationQueue?: string
  escalationTeam?: string
  escalationOwner?: string
  escalationConditions: {
    field: string
    operator: string
    value: any
  }[]
}

// Queue Version for change tracking
export interface QueueVersion {
  versionId: string
  versionNumber: number
  status: 'draft' | 'published' | 'archived'
  createdBy: string
  createdAt: string
  publishedAt?: string
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
}

// Assignment Queue - Comprehensive
export interface AssignmentQueue {
  id: string
  queueCode: string
  name: string
  description: string
  queueType: QueueType
  department: string
  businessUnit: string
  owner: string
  backupOwner?: string
  
  // Membership
  members: {
    userId: string
    name: string
    role: 'queue-lead' | 'senior-agent' | 'agent'
  }[]
  
  // Configuration
  capacity: QueueCapacity
  businessHours: BusinessHours
  skills: QueueSkill[]
  
  // Routing Strategy
  assignmentStrategy: 'round-robin' | 'least-workload' | 'skill-based' | 'capacity-based' | 'availability' | 'hybrid' | 'random'
  
  // Escalation
  escalation: QueueEscalation
  
  // Metrics
  ticketCount: number
  openTickets: number
  avgWaitTime: number
  slaRiskCount: number
  healthScore: number // 0-100
  capacityUtilization: number // 0-100
  version: number
  
  // Status & Configuration
  status: 'active' | 'disabled' | 'archived'
  isActive: boolean
  
  // Templates
  templateIds: string[]
  
  // Versioning
  versionHistory: QueueVersion[]
  currentVersionId: string
  
  // Audit
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

// Queue Template
export interface QueueTemplate {
  id: string
  name: string
  description: string
  category: 'l1-service-desk' | 'l2-support' | 'l3-support' | 'network' | 'security' | 'application' | 'vip'
  baseQueue: Partial<AssignmentQueue>
  createdAt: string
}

// Assignment Rule - Logic for routing decisions
export interface AssignmentRule {
  id: string
  name: string
  code: string
  description: string
  category: 'skill-match' | 'workload-balance' | 'priority-routing' | 'availability' | 'custom'
  priority: 1 | 2 | 3 | 4 | 5
  status: 'draft' | 'active' | 'disabled' | 'archived'
  ruleType: 'skill-match' | 'workload-balance' | 'priority-routing' | 'availability'
  triggers: RuleTrigger[]
  conditions: RuleCondition[]
  actions: RuleAction[]
  conflictResolution: 'first-match-wins' | 'last-match-wins' | 'execute-all' | 'stop-after-match'
  effectiveDate?: string
  expirationDate?: string
  executionCount: number
  successRate: number
  lastExecuted?: string
  version: number
  isDraft: boolean
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

// Rule Trigger - Events that activate rules
export type RuleTriggerType = 'ticket-created' | 'ticket-updated' | 'ticket-priority-changed' | 'ticket-status-changed' | 'ticket-reassigned' | 'sla-breach-risk' | 'queue-overflow' | 'agent-unavailable' | 'time-based' | 'manual-trigger' | 'escalation' | 'custom' | 'webhook'

export interface RuleTrigger {
  id: string
  type: RuleTriggerType
  name: string
  description: string
  params?: Record<string, any>
  isCustom: boolean
  createdAt: string
}

// Rule Condition - Decision criteria with complex logic
export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multiselect' | 'enum'
export type OperatorType = 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'greater-than' | 'less-than' | 'greater-equal' | 'less-equal' | 'in' | 'not-in' | 'exists' | 'matches-regex'

export interface RuleCondition {
  id: string
  field: string
  fieldType: FieldType
  operator: OperatorType
  value: any
  logicOperator: 'and' | 'or'
  nested?: RuleCondition[]
  createdAt: string
}

// Rule Action - Outcomes triggered by rule match
export type ActionType = 'assign-to-agent' | 'assign-to-queue' | 'escalate' | 'notify' | 'workflow' | 'update-field' | 'add-tag' | 'send-email' | 'custom'

export interface RuleAction {
  id: string
  type: ActionType
  sequence: number
  config: {
    targetAgent?: string
    targetQueue?: string
    escalationLevel?: number
    notificationTemplate?: string
    workflowId?: string
    fieldUpdates?: Record<string, any>
    tags?: string[]
    emailTemplate?: string
    customAction?: string
  }
  executionTime: number // ms
  successRate: number
  createdAt: string
}

// Rule Version - Version control for rules
export interface RuleVersion {
  id: string
  ruleId: string
  versionNumber: number
  status: 'draft' | 'published' | 'archived'
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  changedBy: string
  changedAt: string
  publishedBy?: string
  publishedAt?: string
  rollbackTo?: string
  rollbackAt?: string
  rollbackBy?: string
}


// Rule Audit Event - Complete audit trail (removed - duplicate defined later)

// Assignment Strategy - Complex routing strategies
export interface AssignmentStrategy {
  id: string
  name: string
  description: string
  rules: string[] // IDs of AssignmentRule
  fallbackQueue: string
  timeBasedRules?: {
    startTime: string
    endTime: string
    rules: string[]
  }[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Escalation Rule - For handling special cases
export interface EscalationRule {
  id: string
  name: string
  description: string
  triggerCondition: {
    field: string
    operator: string
    value: any
  }
  escalationLevel: number
  assignTo: string // Manager or team lead ID
  notifyManagement: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Assignment Automation - Auto-assignment configurations
export interface AssignmentAutomation {
  id: string
  name: string
  description: string
  trigger: 'on-create' | 'on-status-change' | 'on-time-elapsed'
  action: 'auto-assign' | 'reassign' | 'escalate'
  assignmentStrategy: string // ID of AssignmentStrategy
  conditions: {
    field: string
    operator: string
    value: any
  }[]
  isActive: boolean
  successRate: number
  lastRun: string
  createdAt: string
  updatedAt: string
}

// ===== ENHANCED RULE ENGINE TYPES (NO-CODE) =====

// Rule Trigger - What initiates rule evaluation
export interface RuleTrigger {
  id: string
  type: 'ticket-created' | 'ticket-updated' | 'sla-warning' | 'queue-full' | 'manual' | 'scheduled' | 'webhook'
  description: string
  conditions?: {
    field: string
    operator: string
    value: any
  }[]
}

// Condition Group - Logical grouping of conditions (AND/OR)
export interface ConditionGroup {
  id: string
  logic: 'AND' | 'OR'
  conditions: RuleCondition[]
  nestedGroups?: ConditionGroup[]
}

// Rule Condition - Individual condition that must be evaluated
export interface RuleCondition {
  id: string
  field: string // from Masters (ticket.priority, ticket.type, ticket.customer, queue.name, etc)
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with' | 'greater-than' | 'less-than' | 'in-list' | 'not-in-list' | 'regex' | 'exists' | 'not-exists'
  value: any
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'list' | 'object'
  caseSensitive?: boolean
}

// Rule Action - What happens when rule conditions are met
export type RuleActionType = 'assign-to-agent' | 'assign-to-queue' | 'assign-to-skill' | 'set-priority' | 'add-tag' | 'remove-tag' | 'notify' | 'escalate' | 'reassign' | 'workflow-trigger' | 'webhook-call' | 'custom'

export interface RuleAction {
  id: string
  type: RuleActionType
  name: string
  
  // Action-specific parameters
  parameters: {
    agentId?: string
    queueId?: string
    skillId?: string
    skillLevel?: number
    priorityLevel?: 'critical' | 'high' | 'medium' | 'low'
    tags?: string[]
    notificationTemplate?: string
    escalationLevel?: number
    workflowId?: string
    webhookUrl?: string
    customFunction?: string
  }
  
  // Execution settings
  executeImmediately: boolean
  delaySeconds?: number
  stopRuleProcessing?: boolean // Stop evaluating further rules if this executes
}

// Rule Execution Strategy - How rules are evaluated and executed
export type ExecutionStrategy = 'first-match' | 'last-match' | 'execute-all' | 'stop-after-first-success' | 'weighted-priority'

export interface RuleExecutionConfig {
  strategy: ExecutionStrategy
  maxActionsPerRule: number
  continueOnError: boolean
  parallelExecution: boolean
  timeoutSeconds: number
  rollbackOnError: boolean
}

// Rule Template - Pre-built rule patterns
export interface RuleTemplate {
  id: string
  name: string // 'High Priority Fast Track' | 'Skill-Based Routing' etc
  description: string
  category: string
  triggers: RuleTrigger[]
  conditionGroups: ConditionGroup[]
  actions: RuleAction[]
  executionConfig: RuleExecutionConfig
  usageCount: number
}

// Rule Test Data
export interface RuleTestCase {
  id: string
  name: string
  ticket: {
    priority: string
    type: string
    customer: string
    description: string
    [key: string]: any
  }
  expectedActions: string[] // IDs of actions expected to trigger
  expectedAssignee?: string
  notes?: string
}

// Rule Test Result
export interface RuleTestResult {
  testId: string
  ruleName: string
  ticketData: any
  conditionsMatched: boolean
  matchedConditionIds: string[]
  triggeredActions: RuleAction[]
  assignedTo?: string
  executionTime: number
  passed: boolean
  failureReason?: string
  timestamp: string
}

// Rule Audit Event
export type RuleAuditEventType = 'created' | 'edited' | 'enabled' | 'disabled' | 'archived' | 'tested' | 'published' | 'cloned' | 'executed' | 'version-published'

export interface RuleAuditEvent {
  id: string
  ruleId: string
  ruleName: string
  eventType: RuleAuditEventType
  who: string // user ID
  whoName: string
  when: string
  oldValue?: any
  newValue?: any
  details?: string
  ticketsAffected?: number
  successRate?: number
}

// Rule Version
export interface RuleVersion {
  id: string
  ruleId: string
  versionNumber: number
  status: 'draft' | 'published' | 'archived'
  
  // Complete rule snapshot
  snapshot: {
    name: string
    description: string
    triggers: RuleTrigger[]
    conditionGroups: ConditionGroup[]
    actions: RuleAction[]
    executionConfig: RuleExecutionConfig
    priority: number
  }
  
  // Change tracking
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  
  // Publishing info
  publishedBy?: string
  publishedAt?: string
  publishReason?: string
  rollbackTo?: string
}

// Complete Rule (Full Entity)
export interface RuleComplete {
  id: string
  name: string
  description: string
  category: string // from Masters
  priority: number // Higher = evaluated first
  status: 'draft' | 'active' | 'disabled' | 'archived'
  
  // Rule logic
  triggers: RuleTrigger[]
  conditionGroups: ConditionGroup[]
  actions: RuleAction[]
  
  // Execution
  executionConfig: RuleExecutionConfig
  enabled: boolean
  enabledAt?: string
  
  // Relationships
  relatedQueues: string[]
  relatedSkills: string[]
  relatedAutomations: string[]
  dependentRules: string[] // Other rules that depend on this one
  
  // Testing
  testCases: RuleTestCase[]
  lastTestResults: RuleTestResult[]
  testCoverage: number // percentage
  
  // Analytics
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  successRate: number
  averageExecutionTime: number
  lastExecuted?: string
  
  // Version control
  version: number
  versionHistory: RuleVersion[]
  
  // Audit
  auditLog: RuleAuditEvent[]
  
  // Metadata
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  publishedBy?: string
  publishedAt?: string
}

// Rule List Item (for table display)
export interface RuleListItem {
  id: string
  name: string
  category: string
  priority: number
  triggers: string // comma-separated trigger types
  actions: number
  status: 'draft' | 'active' | 'disabled' | 'archived'
  successRate: number
  executions: number
  version: number
  lastUpdated: string
}

// ===== ENTERPRISE AUTOMATION ENGINE TYPES =====

// Automation Trigger - What initiates automation
export interface AutomationTrigger {
  id: string
  type: 'ticket-created' | 'ticket-updated' | 'ticket-assigned' | 'ticket-resolved' | 'queue-assignment' | 'sla-warning' | 'sla-breach' | 'milestone-reached' | 'status-changed' | 'priority-changed' | 'on-delay' | 'scheduled' | 'webhook' | 'manual' | 'chain-trigger' | 'customer-interaction' | 'agent-action' | 'system-event'
  description: string
  delaySeconds?: number // For delayed triggers
  conditions?: {
    field: string
    operator: string
    value: any
  }[]
}

// Automation Condition - Conditions to evaluate
export interface AutomationCondition {
  id: string
  field: string // from Masters
  operator: 'equals' | 'not-equals' | 'contains' | 'not-contains' | 'starts-with' | 'ends-with' | 'greater-than' | 'less-than' | 'in-list' | 'not-in-list' | 'regex' | 'exists' | 'not-exists' | 'date-before' | 'date-after' | 'time-between'
  value: any
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'list' | 'object'
}

// Automation Condition Group - AND/OR logical grouping
export interface AutomationConditionGroup {
  id: string
  logic: 'AND' | 'OR'
  conditions: AutomationCondition[]
  nestedGroups?: AutomationConditionGroup[]
}

// Automation Action - What happens in automation
export type AutomationActionType = 'create-task' | 'update-ticket' | 'assign-ticket' | 'notify-agent' | 'notify-customer' | 'send-email' | 'send-sms' | 'create-note' | 'add-tag' | 'remove-tag' | 'set-priority' | 'set-status' | 'escalate' | 'create-follow-up' | 'add-to-queue' | 'trigger-workflow' | 'webhook-call' | 'create-knowledge-link' | 'schedule-callback' | 'customer-portal-message' | 'internal-comment' | 'update-custom-field' | 'automation-chain' | 'conditional-branch' | 'wait' | 'loop' | 'custom'

export interface AutomationAction {
  id: string
  type: AutomationActionType
  name: string
  order: number
  
  // Action-specific parameters
  parameters: {
    taskTitle?: string
    taskDescription?: string
    taskDueDate?: string
    assignedTo?: string
    ticketField?: string
    ticketValue?: string
    notificationTemplate?: string
    emailTemplate?: string
    smsTemplate?: string
    agentGroups?: string[]
    customerEmail?: string
    tags?: string[]
    priorityLevel?: 'critical' | 'high' | 'medium' | 'low'
    status?: string
    escalationLevel?: number
    followUpDays?: number
    queueId?: string
    workflowId?: string
    webhookUrl?: string
    webhookMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    webhookPayload?: string
    knowledgeArticleId?: string
    callbackTime?: string
    portalMessage?: string
    internalComment?: string
    customFieldName?: string
    customFieldValue?: string
    chainAutomationId?: string
    branchCondition?: string
    waitDuration?: number
    waitUnit?: 'seconds' | 'minutes' | 'hours' | 'days'
    loopCount?: number
    customCode?: string
  }
  
  // Execution controls
  onErrorAction?: 'continue' | 'stop' | 'retry'
  retryCount?: number
  stopProcessing?: boolean // If true, skip remaining actions
}

// Automation Execution Configuration
export type ExecutionMode = 'immediate' | 'delayed' | 'scheduled' | 'once' | 'recurring'
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom'

export interface AutomationExecutionConfig {
  mode: ExecutionMode
  delaySeconds?: number
  scheduleTime?: string // HH:mm
  scheduleTimezone?: string
  recurrence?: RecurrencePattern
  recurrenceDays?: number[] // for weekly
  recurrenceDate?: string // for monthly
  maxExecutionsPerDay?: number
  timeoutSeconds: number
  continueOnError: boolean
  parallelActions: boolean
  rollbackOnError: boolean
}

// Automation Test Case
export interface AutomationTestCase {
  id: string
  name: string
  ticketData: {
    priority: string
    type: string
    customer: string
    description: string
    status: string
    queue?: string
    [key: string]: any
  }
  expectedActions: string[] // IDs of actions expected to trigger
  expectedNotifications?: string[]
  notes?: string
}

// Automation Test Result
export interface AutomationTestResult {
  testId: string
  automationId: string
  automationName: string
  ticketData: any
  conditionsMatched: boolean
  matchedConditionIds: string[]
  triggeredActions: AutomationAction[]
  executedActions: string[]
  failedActions: string[]
  executionTime: number
  passed: boolean
  failureReason?: string
  timestamp: string
  warnings: string[]
}

// Automation Audit Event
export type AutomationAuditEventType = 'created' | 'edited' | 'enabled' | 'disabled' | 'archived' | 'tested' | 'published' | 'cloned' | 'executed' | 'version-published' | 'triggered'

export interface AutomationAuditEvent {
  id: string
  automationId: string
  automationName: string
  eventType: AutomationAuditEventType
  who: string // user ID
  whoName: string
  when: string
  oldValue?: any
  newValue?: any
  details?: string
  ticketsAffected?: number
  tasksCreated?: number
}

// Automation Version
export interface AutomationVersion {
  id: string
  automationId: string
  versionNumber: number
  status: 'draft' | 'published' | 'archived'
  
  // Complete automation snapshot
  snapshot: {
    name: string
    description: string
    triggers: AutomationTrigger[]
    conditionGroups: AutomationConditionGroup[]
    actions: AutomationAction[]
    executionConfig: AutomationExecutionConfig
    category: string
    priority: number
  }
  
  // Change tracking
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  
  // Publishing info
  publishedBy?: string
  publishedAt?: string
  publishReason?: string
}

// Automation Template - Pre-built automation patterns
export interface AutomationTemplate {
  id: string
  name: string // 'Auto-Create Follow-Up Task' | 'SLA Breach Escalation' etc
  description: string
  category: string
  icon?: string
  triggers: AutomationTrigger[]
  conditionGroups: AutomationConditionGroup[]
  actions: AutomationAction[]
  executionConfig: AutomationExecutionConfig
  usageCount: number
  isPopular: boolean
}

// Automation Chain - Link automations together
export interface AutomationChain {
  id: string
  name: string
  description: string
  automations: {
    automationId: string
    automationName: string
    order: number
    passCriteria?: 'success' | 'failure' | 'always'
    delayBefore?: number
  }[]
  successRateTarget?: number
  createdBy: string
  createdAt: string
}

// Complete Automation (Full Entity)
export interface AutomationComplete {
  id: string
  name: string
  description: string
  category: string // from Masters (ticket-lifecycle, escalation, notification, knowledge, integration, custom)
  priority: number // Higher = evaluated first
  status: 'draft' | 'active' | 'disabled' | 'archived'
  
  // Automation logic
  triggers: AutomationTrigger[]
  conditionGroups: AutomationConditionGroup[]
  actions: AutomationAction[]
  
  // Execution
  executionConfig: AutomationExecutionConfig
  enabled: boolean
  enabledAt?: string
  
  // Relationships
  relatedQueues: string[]
  relatedSkills: string[]
  relatedRules: string[]
  dependentAutomations: string[] // Automations that depend on this one
  chainsIncludedIn: string[] // Chain IDs that include this automation
  
  // Testing
  testCases: AutomationTestCase[]
  lastTestResults: AutomationTestResult[]
  testCoverage: number // percentage
  
  // Analytics
  totalExecutions: number
  successfulExecutions: number
  failedExecutions: number
  successRate: number
  averageExecutionTime: number
  tasksCreated: number
  notificationsSent: number
  lastExecuted?: string
  
  // Version control
  version: number
  versionHistory: AutomationVersion[]
  
  // Audit
  auditLog: AutomationAuditEvent[]
  
  // Metadata
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
  publishedBy?: string
  publishedAt?: string
}

// Automation List Item (for table display)
export interface AutomationListItem {
  id: string
  name: string
  category: string
  triggers: string // comma-separated trigger types
  actions: number
  status: 'draft' | 'active' | 'disabled' | 'archived'
  successRate: number
  tasksCreated: number
  executions: number
  version: number
  lastUpdated: string
}

// Restore old Automation interface for backward compatibility
export interface Automation {
  id: string
  name: string
  description: string
  triggers: string[]
  actions: string[]
  status: 'active' | 'inactive' | 'paused'
  createdAt: string
  updatedAt: string
}

// Assignment Log - Audit trail for all assignments
export interface AssignmentLog {
  id: string
  ticketId: string
  ticketTitle: string
  previousAgent: string | null
  newAgent: string
  assignmentType: 'manual' | 'auto' | 'reassign' | 'escalate'
  rule: string // ID of rule that triggered assignment
  reason: string
  wasSuccessful: boolean
  failureReason?: string
  timestamp: string
}

// Assignment Metrics - For overview dashboard
export interface AssignmentMetrics {
  unassignedTickets: number
  autoAssignedToday: number
  manualAssignmentsToday: number
  failedAssignments: number
  assignmentSuccessRate: number
  slaRisksDueToAssignment: number
}
