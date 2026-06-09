import { AutomationComplete, AutomationTrigger, AutomationAction, AutomationTemplate, AutomationExecutionConfig } from './types'
import { getAutomationTriggers, getAutomationActions, subscribeToRegistryChanges } from './registry-adapters'

// Master Data - Triggers (now sourced from Configuration Registry)
export const AUTOMATION_TRIGGERS = getAutomationTriggers().map(t => ({
  id: t.id,
  name: t.label,
  category: 'system',
}))

// Master Data - Action Types (now sourced from Configuration Registry)
export const AUTOMATION_ACTION_TYPES = getAutomationActions().map(a => ({
  id: a.id,
  category: 'custom',
  name: a.label,
  description: a.description || 'Custom automation action',
}))

// Master Data - Automation Categories
export const AUTOMATION_CATEGORIES = [
  { id: 'ticket-lifecycle', name: 'Ticket Lifecycle', color: '#3B82F6' },
  { id: 'escalation', name: 'Escalation & SLA', color: '#EF4444' },
  { id: 'notification', name: 'Notification', color: '#8B5CF6' },
  { id: 'knowledge', name: 'Knowledge Management', color: '#06B6D4' },
  { id: 'integration', name: 'Integration', color: '#10B981' },
  { id: 'customer-experience', name: 'Customer Experience', color: '#F59E0B' },
  { id: 'reporting', name: 'Reporting & Analytics', color: '#6366F1' },
  { id: 'custom', name: 'Custom', color: '#6B7280' },
]

// Master Data - Execution Modes
export const EXECUTION_MODES = [
  { id: 'immediate', name: 'Immediate', description: 'Execute right away' },
  { id: 'delayed', name: 'Delayed', description: 'Execute after delay' },
  { id: 'scheduled', name: 'Scheduled', description: 'Execute at specific time' },
  { id: 'once', name: 'Once Only', description: 'Execute once per ticket' },
  { id: 'recurring', name: 'Recurring', description: 'Execute repeatedly' },
]

// Master Data - Condition Fields (16 categories)
export const AUTOMATION_CONDITION_FIELDS = [
  // Ticket Fields
  { id: 'ticket.priority', category: 'ticket', name: 'Ticket Priority', dataType: 'string' },
  { id: 'ticket.type', category: 'ticket', name: 'Ticket Type', dataType: 'string' },
  { id: 'ticket.status', category: 'ticket', name: 'Ticket Status', dataType: 'string' },
  { id: 'ticket.age', category: 'ticket', name: 'Ticket Age (hours)', dataType: 'number' },
  { id: 'ticket.description', category: 'ticket', name: 'Description Contains', dataType: 'string' },
  
  // Customer Fields
  { id: 'customer.name', category: 'customer', name: 'Customer Name', dataType: 'string' },
  { id: 'customer.type', category: 'customer', name: 'Customer Type', dataType: 'string' },
  { id: 'customer.sentiment', category: 'customer', name: 'Customer Sentiment', dataType: 'string' },
  { id: 'customer.vip', category: 'customer', name: 'Is VIP', dataType: 'boolean' },
  
  // Assignment Fields
  { id: 'assignment.queue', category: 'assignment', name: 'Queue', dataType: 'string' },
  { id: 'assignment.agent', category: 'assignment', name: 'Assigned Agent', dataType: 'string' },
  { id: 'assignment.skill', category: 'assignment', name: 'Required Skill', dataType: 'string' },
  
  // SLA Fields
  { id: 'sla.breached', category: 'sla', name: 'SLA Breached', dataType: 'boolean' },
  { id: 'sla.warningTime', category: 'sla', name: 'Warning Time', dataType: 'number' },
  
  // Time Fields
  { id: 'time.hour', category: 'time', name: 'Current Hour', dataType: 'number' },
  { id: 'time.day', category: 'time', name: 'Day of Week', dataType: 'string' },
]

// Sample Automation Templates
export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: 'template-1',
    name: 'Auto-Create Follow-up Task',
    description: 'Create follow-up task when ticket is resolved',
    category: 'ticket-lifecycle',
    icon: '📋',
    triggers: [{ id: 'ticket-resolved', type: 'ticket-resolved', description: 'When ticket resolved' }],
    conditionGroups: [],
    actions: [
      {
        id: 'action-1',
        type: 'create-task',
        name: 'Create Follow-up Task',
        order: 1,
        parameters: {
          taskTitle: 'Follow-up on ${ticket.id}',
          taskDueDate: '+3',
        },
        onErrorAction: 'continue',
      },
    ],
    executionConfig: {
      mode: 'immediate',
      timeoutSeconds: 30,
      continueOnError: true,
      parallelActions: false,
      rollbackOnError: false,
    },
    usageCount: 147,
    isPopular: true,
  },
  {
    id: 'template-2',
    name: 'SLA Breach Escalation',
    description: 'Escalate ticket when SLA is breached',
    category: 'escalation',
    icon: '⚠️',
    triggers: [{ id: 'sla-breach', type: 'sla-breach', description: 'When SLA breached' }],
    conditionGroups: [],
    actions: [
      {
        id: 'action-1',
        type: 'escalate',
        name: 'Escalate to Manager',
        order: 1,
        parameters: { escalationLevel: 2 },
        onErrorAction: 'continue',
      },
      {
        id: 'action-2',
        type: 'notify-agent',
        name: 'Notify Agent',
        order: 2,
        parameters: { notificationTemplate: 'sla-breach' },
        onErrorAction: 'continue',
      },
    ],
    executionConfig: {
      mode: 'immediate',
      timeoutSeconds: 60,
      continueOnError: true,
      parallelActions: true,
      rollbackOnError: false,
    },
    usageCount: 89,
    isPopular: true,
  },
]

// Sample Production Automations
export const DEFAULT_AUTOMATIONS: AutomationComplete[] = [
  {
    id: 'auto-1',
    name: 'High Priority Fast Track',
    description: 'Automatically escalate and notify for high priority tickets',
    category: 'escalation',
    priority: 1,
    status: 'active',
    triggers: [{ id: 'ticket-created', type: 'ticket-created', description: 'When ticket created' }],
    conditionGroups: [
      {
        id: 'group-1',
        logic: 'AND',
        conditions: [
          { id: 'cond-1', field: 'ticket.priority', operator: 'equals', value: 'critical', dataType: 'string' },
        ],
        nestedGroups: [],
      },
    ],
    actions: [
      {
        id: 'action-1',
        type: 'escalate',
        name: 'Escalate Immediately',
        order: 1,
        parameters: { escalationLevel: 1 },
        onErrorAction: 'continue',
      },
      {
        id: 'action-2',
        type: 'notify-agent',
        name: 'Notify Manager',
        order: 2,
        parameters: { notificationTemplate: 'high-priority' },
        onErrorAction: 'continue',
      },
    ],
    executionConfig: {
      mode: 'immediate',
      timeoutSeconds: 30,
      continueOnError: true,
      parallelActions: true,
      rollbackOnError: false,
    },
    enabled: true,
    enabledAt: new Date().toISOString(),
    relatedQueues: [],
    relatedSkills: [],
    relatedRules: [],
    dependentAutomations: [],
    chainsIncludedIn: [],
    testCases: [],
    lastTestResults: [],
    testCoverage: 85,
    totalExecutions: 342,
    successfulExecutions: 325,
    failedExecutions: 17,
    successRate: 95,
    averageExecutionTime: 245,
    tasksCreated: 0,
    notificationsSent: 342,
    lastExecuted: new Date().toISOString(),
    version: 1,
    versionHistory: [],
    auditLog: [],
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedBy: 'system',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'auto-2',
    name: 'Auto-Create Knowledge Link',
    description: 'Link knowledge articles to new tickets based on keywords',
    category: 'knowledge',
    priority: 2,
    status: 'active',
    triggers: [{ id: 'ticket-created', type: 'ticket-created', description: 'When ticket created' }],
    conditionGroups: [],
    actions: [
      {
        id: 'action-1',
        type: 'create-knowledge-link',
        name: 'Link Relevant Articles',
        order: 1,
        parameters: { knowledgeArticleId: 'kb-auto' },
        onErrorAction: 'continue',
      },
    ],
    executionConfig: {
      mode: 'immediate',
      timeoutSeconds: 60,
      continueOnError: true,
      parallelActions: false,
      rollbackOnError: false,
    },
    enabled: true,
    enabledAt: new Date().toISOString(),
    relatedQueues: [],
    relatedSkills: [],
    relatedRules: [],
    dependentAutomations: [],
    chainsIncludedIn: [],
    testCases: [],
    lastTestResults: [],
    testCoverage: 72,
    totalExecutions: 156,
    successfulExecutions: 148,
    failedExecutions: 8,
    successRate: 94.9,
    averageExecutionTime: 342,
    tasksCreated: 0,
    notificationsSent: 0,
    lastExecuted: new Date().toISOString(),
    version: 1,
    versionHistory: [],
    auditLog: [],
    createdBy: 'system',
    createdAt: new Date().toISOString(),
    updatedBy: 'system',
    updatedAt: new Date().toISOString(),
  },
]

// Utility Functions
export function validateAutomation(automation: Partial<AutomationComplete>): string[] {
  const errors: string[] = []
  if (!automation.name?.trim()) errors.push('Automation name is required')
  if (!automation.triggers?.length) errors.push('At least one trigger is required')
  if (!automation.actions?.length) errors.push('At least one action is required')
  return errors
}

export function exportAutomations(automations: AutomationComplete[]): string {
  return JSON.stringify(automations, null, 2)
}

export function importAutomations(jsonData: string): AutomationComplete[] {
  try {
    return JSON.parse(jsonData)
  } catch {
    throw new Error('Invalid automation JSON')
  }
}

export function getTriggerName(triggerId: string): string {
  return AUTOMATION_TRIGGERS.find(t => t.id === triggerId)?.name || triggerId
}

export function getActionName(actionType: string): string {
  return AUTOMATION_ACTION_TYPES.find(a => a.id === actionType)?.name || actionType
}

export function getCategoryColor(categoryId: string): string {
  return AUTOMATION_CATEGORIES.find(c => c.id === categoryId)?.color || '#6B7280'
}
