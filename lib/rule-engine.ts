'use strict'

import {
  RuleTrigger,
  RuleCondition,
  RuleAction,
  RuleComplete,
  RuleTemplate,
  RuleTestCase,
  RuleTestResult,
  ExecutionStrategy,
  ConditionGroup,
} from '@/lib/types'
import { getRuleActions, getRulePriorities, getConditionOperators } from './registry-adapters'

// Rule Action Types (now sourced from Configuration Registry)
export const RULE_ACTION_TYPES = getRuleActions().map(a => ({
  id: a.id,
  label: a.label,
  icon: 'zap',
}))

// Condition Fields (from Masters - Ticket, Customer, Queue, etc)
// These are still hardcoded as they represent schema/data structure, not configurations
export const CONDITION_FIELDS = [
  { id: 'ticket.priority', label: 'Ticket Priority', type: 'string', operators: ['equals', 'not-equals', 'in-list'] },
  { id: 'ticket.type', label: 'Ticket Type', type: 'string', operators: ['equals', 'not-equals', 'in-list'] },
  { id: 'ticket.category', label: 'Ticket Category', type: 'string', operators: ['equals', 'contains', 'in-list'] },
  { id: 'ticket.status', label: 'Ticket Status', type: 'string', operators: ['equals', 'not-equals'] },
  { id: 'ticket.tags', label: 'Ticket Tags', type: 'list', operators: ['contains', 'not-contains', 'in-list'] },
  { id: 'ticket.description', label: 'Ticket Description', type: 'string', operators: ['contains', 'starts-with', 'regex'] },
  { id: 'ticket.subject', label: 'Ticket Subject', type: 'string', operators: ['contains', 'starts-with', 'regex'] },
  { id: 'customer.id', label: 'Customer ID', type: 'string', operators: ['equals', 'in-list'] },
  { id: 'customer.tier', label: 'Customer Tier', type: 'string', operators: ['equals', 'in-list'] },
  { id: 'customer.industry', label: 'Customer Industry', type: 'string', operators: ['equals', 'in-list'] },
  { id: 'queue.id', label: 'Queue', type: 'string', operators: ['equals', 'in-list'] },
  { id: 'queue.workload', label: 'Queue Workload', type: 'number', operators: ['greater-than', 'less-than'] },
  { id: 'queue.avgResponseTime', label: 'Queue Avg Response Time', type: 'number', operators: ['greater-than', 'less-than'] },
  { id: 'skill.required', label: 'Required Skill', type: 'string', operators: ['equals', 'in-list'] },
  { id: 'skill.level', label: 'Skill Level Required', type: 'number', operators: ['equals', 'greater-than', 'less-than'] },
  { id: 'urgency', label: 'Urgency', type: 'number', operators: ['greater-than', 'less-than', 'equals'] },
  { id: 'timeInQueue', label: 'Time In Queue (minutes)', type: 'number', operators: ['greater-than', 'less-than'] },
]

// Rule Categories (from Masters)
export const RULE_CATEGORIES = [
  { id: 'routing', label: 'Routing & Assignment', description: 'Route tickets to agents or queues' },
  { id: 'prioritization', label: 'Prioritization', description: 'Adjust ticket priority' },
  { id: 'escalation', label: 'Escalation', description: 'Escalate tickets based on conditions' },
  { id: 'skill-matching', label: 'Skill Matching', description: 'Match tickets to skilled agents' },
  { id: 'sla-management', label: 'SLA Management', description: 'Manage SLA compliance' },
  { id: 'automation', label: 'Automation', description: 'Automate workflow actions' },
  { id: 'custom', label: 'Custom', description: 'Custom business logic' },
]

// Execution Strategies
export const EXECUTION_STRATEGIES: { label: string; description: string }[] = [
  {
    label: 'First Match',
    description: 'Execute first matching rule and stop processing',
  },
  {
    label: 'Last Match',
    description: 'Execute last matching rule',
  },
  {
    label: 'Execute All',
    description: 'Execute all matching rules',
  },
  {
    label: 'Stop After First Success',
    description: 'Execute rules until one succeeds, then stop',
  },
  {
    label: 'Weighted Priority',
    description: 'Execute based on rule priority weights',
  },
]

// Operators for conditions
export const CONDITION_OPERATORS = {
  string: ['equals', 'not-equals', 'contains', 'not-contains', 'starts-with', 'ends-with', 'regex'],
  number: ['equals', 'not-equals', 'greater-than', 'less-than'],
  boolean: ['equals', 'not-equals'],
  date: ['equals', 'greater-than', 'less-than', 'between'],
  list: ['in-list', 'not-in-list', 'contains', 'not-contains'],
  object: ['exists', 'not-exists'],
}

// Rule Templates
export const RULE_TEMPLATES: RuleTemplate[] = [
  {
    id: 'template-vip-fast-track',
    name: 'VIP Fast Track',
    description: 'Route VIP customers to senior agents immediately',
    category: 'routing',
    triggers: [{ id: 'trigger-ticket-created', type: 'ticket-created', description: 'When ticket is created' }],
    conditionGroups: [],
    actions: [],
    executionConfig: {
      strategy: 'first-match',
      maxActionsPerRule: 5,
      continueOnError: false,
      parallelExecution: false,
      timeoutSeconds: 5,
      rollbackOnError: true,
    },
    usageCount: 0,
  },
  {
    id: 'template-skill-based',
    name: 'Skill-Based Routing',
    description: 'Route to agents with required skills',
    category: 'skill-matching',
    triggers: [{ id: 'trigger-ticket-created', type: 'ticket-created', description: 'When ticket is created' }],
    conditionGroups: [],
    actions: [],
    executionConfig: {
      strategy: 'execute-all',
      maxActionsPerRule: 10,
      continueOnError: true,
      parallelExecution: true,
      timeoutSeconds: 10,
      rollbackOnError: false,
    },
    usageCount: 0,
  },
  {
    id: 'template-escalation',
    name: 'Automatic Escalation',
    description: 'Escalate based on SLA or time in queue',
    category: 'escalation',
    triggers: [{ id: 'trigger-sla-warning', type: 'sla-warning', description: 'When SLA warning' }],
    conditionGroups: [],
    actions: [],
    executionConfig: {
      strategy: 'first-match',
      maxActionsPerRule: 3,
      continueOnError: false,
      parallelExecution: false,
      timeoutSeconds: 3,
      rollbackOnError: true,
    },
    usageCount: 0,
  },
]

// Sample Rules for display
export const DEFAULT_RULES: RuleComplete[] = [
  {
    id: 'rule-1',
    name: 'Critical Priority VIP',
    description: 'Route critical priority tickets from VIP customers to senior agents',
    category: 'routing',
    priority: 1,
    status: 'active',
    triggers: [{ id: 'trigger-ticket-created', type: 'ticket-created', description: 'When ticket is created' }],
    conditionGroups: [],
    actions: [],
    executionConfig: {
      strategy: 'first-match',
      maxActionsPerRule: 5,
      continueOnError: false,
      parallelExecution: false,
      timeoutSeconds: 5,
      rollbackOnError: true,
    },
    enabled: true,
    relatedQueues: ['queue-1'],
    relatedSkills: [],
    relatedAutomations: [],
    dependentRules: [],
    testCases: [],
    lastTestResults: [],
    testCoverage: 0,
    totalExecutions: 245,
    successfulExecutions: 243,
    failedExecutions: 2,
    successRate: 99.2,
    averageExecutionTime: 250,
    version: 2,
    versionHistory: [],
    auditLog: [],
    createdBy: 'admin',
    createdAt: '2024-01-15T10:00:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-01-25T14:30:00Z',
  },
  {
    id: 'rule-2',
    name: 'Skill-Based Network Routing',
    description: 'Route network tickets to agents with Network skills at Level 3+',
    category: 'skill-matching',
    priority: 2,
    status: 'active',
    triggers: [{ id: 'trigger-ticket-created', type: 'ticket-created', description: 'When ticket is created' }],
    conditionGroups: [],
    actions: [],
    executionConfig: {
      strategy: 'execute-all',
      maxActionsPerRule: 10,
      continueOnError: true,
      parallelExecution: true,
      timeoutSeconds: 10,
      rollbackOnError: false,
    },
    enabled: true,
    relatedQueues: [],
    relatedSkills: ['skill-network'],
    relatedAutomations: [],
    dependentRules: [],
    testCases: [],
    lastTestResults: [],
    testCoverage: 0,
    totalExecutions: 512,
    successfulExecutions: 498,
    failedExecutions: 14,
    successRate: 97.3,
    averageExecutionTime: 320,
    version: 1,
    versionHistory: [],
    auditLog: [],
    createdBy: 'admin',
    createdAt: '2024-01-10T08:30:00Z',
    updatedBy: 'admin',
    updatedAt: '2024-01-20T11:15:00Z',
  },
]

// Helper function to evaluate a condition
export function evaluateCondition(condition: RuleCondition, ticketData: any): boolean {
  const fieldValue = getNestedValue(ticketData, condition.field)
  const compareValue = condition.value

  switch (condition.operator) {
    case 'equals':
      return condition.caseSensitive 
        ? fieldValue === compareValue 
        : String(fieldValue).toLowerCase() === String(compareValue).toLowerCase()
    case 'not-equals':
      return condition.caseSensitive 
        ? fieldValue !== compareValue 
        : String(fieldValue).toLowerCase() !== String(compareValue).toLowerCase()
    case 'contains':
      return String(fieldValue).includes(String(compareValue))
    case 'not-contains':
      return !String(fieldValue).includes(String(compareValue))
    case 'starts-with':
      return String(fieldValue).startsWith(String(compareValue))
    case 'ends-with':
      return String(fieldValue).endsWith(String(compareValue))
    case 'greater-than':
      return Number(fieldValue) > Number(compareValue)
    case 'less-than':
      return Number(fieldValue) < Number(compareValue)
    case 'in-list':
      return Array.isArray(compareValue) 
        ? compareValue.includes(fieldValue) 
        : false
    case 'not-in-list':
      return Array.isArray(compareValue) 
        ? !compareValue.includes(fieldValue) 
        : true
    case 'regex':
      return new RegExp(compareValue).test(String(fieldValue))
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null
    case 'not-exists':
      return fieldValue === undefined || fieldValue === null
    default:
      return false
  }
}

// Helper function to get nested object value
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, prop) => current?.[prop], obj)
}

// Helper function to evaluate condition group
export function evaluateConditionGroup(group: ConditionGroup, ticketData: any): boolean {
  const conditionResults = group.conditions.map(cond => evaluateCondition(cond, ticketData))
  
  const groupResults = group.nestedGroups?.map(nested => evaluateConditionGroup(nested, ticketData)) || []
  const allResults = [...conditionResults, ...groupResults]

  if (group.logic === 'AND') {
    return allResults.every(result => result)
  } else {
    return allResults.some(result => result)
  }
}

// Helper function to test a rule
export function testRule(rule: RuleComplete, testCase: RuleTestCase): RuleTestResult {
  const startTime = Date.now()
  let conditionsMatched = false
  const matchedConditionIds: string[] = []
  const triggeredActions: RuleAction[] = []

  try {
    // Check if conditions match
    if (rule.conditionGroups.length > 0) {
      conditionsMatched = rule.conditionGroups.every(group => 
        evaluateConditionGroup(group, testCase.ticket)
      )
      
      if (conditionsMatched) {
        rule.conditionGroups.forEach(group => {
          group.conditions.forEach(cond => {
            if (evaluateCondition(cond, testCase.ticket)) {
              matchedConditionIds.push(cond.id)
            }
          })
        })
      }
    } else {
      conditionsMatched = true
    }

    // If conditions match, collect actions
    if (conditionsMatched) {
      triggeredActions.push(...rule.actions)
    }

    const executionTime = Date.now() - startTime
    const passed = triggeredActions.length === testCase.expectedActions.length

    return {
      testId: testCase.id,
      ruleName: rule.name,
      ticketData: testCase.ticket,
      conditionsMatched,
      matchedConditionIds,
      triggeredActions,
      executionTime,
      passed,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    const executionTime = Date.now() - startTime
    return {
      testId: testCase.id,
      ruleName: rule.name,
      ticketData: testCase.ticket,
      conditionsMatched: false,
      matchedConditionIds: [],
      triggeredActions: [],
      executionTime,
      passed: false,
      failureReason: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }
  }
}

// Helper function to import rules from JSON
export function importRules(jsonString: string): RuleComplete[] {
  try {
    const data = JSON.parse(jsonString)
    return Array.isArray(data) ? data : [data]
  } catch (error) {
    console.error('[v0] Error importing rules:', error)
    return []
  }
}

// Helper function to export rules to JSON
export function exportRules(rules: RuleComplete[]): string {
  return JSON.stringify(rules, null, 2)
}
