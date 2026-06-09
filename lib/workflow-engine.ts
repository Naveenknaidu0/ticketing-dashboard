// Workflow Engine - Define business process workflows
// Allows managers to create automations and workflows visually

import { logAuditEvent } from './audit-log-engine'
import type { Action } from './action-engine'
import type { VisibilityRule } from './form-engine'

export interface WorkflowTrigger {
  id: string
  type: 'manual' | 'event' | 'scheduled' | 'webhook'
  event?: string
  schedule?: string
  webhook?: string
}

export interface WorkflowCondition {
  id: string
  field: string
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'in'
  value: any
  logicOperator?: 'and' | 'or'
}

export interface WorkflowStep {
  id: string
  name: string
  type: 'action' | 'condition' | 'wait' | 'parallel'
  actionId?: string
  conditions?: WorkflowCondition[]
  waitTime?: number // in seconds
  nextStepId?: string
  order: number
}

export interface Workflow {
  id: string
  name: string
  label: string
  description?: string
  type: 'queue' | 'skill' | 'rule' | 'automation' | 'ticket'
  trigger: WorkflowTrigger
  steps: WorkflowStep[]
  visibility: VisibilityRule
  enabled: boolean
  version: number
  status: 'draft' | 'active' | 'archived'
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    executionCount: number
  }
}

export let WORKFLOW_STORE: Workflow[] = [
  {
    id: 'workflow-escalate',
    name: 'auto-escalate',
    label: 'Auto Escalate Old Items',
    description: 'Escalate items older than 24 hours',
    type: 'ticket',
    trigger: { id: 'trigger-1', type: 'scheduled', schedule: '0 * * * *' },
    steps: [
      {
        id: 'step-1',
        name: 'check-age',
        type: 'condition',
        conditions: [{ id: 'cond-1', field: 'age', operator: 'greater', value: 86400 }],
        nextStepId: 'step-2',
        order: 1,
      },
      {
        id: 'step-2',
        name: 'escalate',
        type: 'action',
        actionId: 'action-escalate',
        order: 2,
      },
    ],
    visibility: { type: 'always' },
    enabled: true,
    version: 1,
    status: 'active',
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), executionCount: 0 },
  },
]

// Get workflow by ID
export function getWorkflow(id: string): Workflow | undefined {
  return WORKFLOW_STORE.find(w => w.id === id)
}

// Get workflows by type
export function getWorkflowsByType(type: Workflow['type']): Workflow[] {
  return WORKFLOW_STORE.filter(w => w.type === type && w.status === 'active')
}

// Get all active workflows
export function getAllActiveWorkflows(): Workflow[] {
  return WORKFLOW_STORE.filter(w => w.status === 'active' && w.enabled)
}

// Create workflow
export function createWorkflow(data: Omit<Workflow, 'id' | 'version' | 'metadata' | 'status'>): Workflow {
  const workflow: Workflow = {
    ...data,
    id: `workflow-${Date.now()}`,
    version: 1,
    status: 'draft',
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
      executionCount: 0,
    },
  }

  WORKFLOW_STORE.push(workflow)

  logAuditEvent({
    eventType: 'workflow_created',
    module: 'configuration',
    action: 'create',
    entityId: workflow.id,
    entityType: 'Workflow',
    entityName: workflow.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: workflow,
    source: 'ui',
  })

  return workflow
}

// Update workflow
export function updateWorkflow(id: string, updates: Partial<Omit<Workflow, 'id' | 'metadata'>>): Workflow | null {
  const workflow = getWorkflow(id)
  if (!workflow) return null

  const beforeState = JSON.parse(JSON.stringify(workflow))
  Object.assign(workflow, updates)
  workflow.version += 1

  logAuditEvent({
    eventType: 'workflow_updated',
    module: 'configuration',
    action: 'update',
    entityId: workflow.id,
    entityType: 'Workflow',
    entityName: workflow.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: workflow,
    source: 'ui',
  })

  return workflow
}

// Delete workflow
export function deleteWorkflow(id: string): boolean {
  const index = WORKFLOW_STORE.findIndex(w => w.id === id)
  if (index > -1) {
    const workflow = WORKFLOW_STORE[index]
    WORKFLOW_STORE.splice(index, 1)

    logAuditEvent({
      eventType: 'workflow_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: workflow.id,
      entityType: 'Workflow',
      entityName: workflow.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: workflow,
      source: 'ui',
    })

    return true
  }
  return false
}

// Toggle workflow
export function toggleWorkflow(id: string): Workflow | null {
  const workflow = getWorkflow(id)
  if (!workflow) return null
  return updateWorkflow(id, { enabled: !workflow.enabled })
}

// Publish workflow
export function publishWorkflow(id: string): Workflow | null {
  return updateWorkflow(id, { status: 'active' })
}

// Clone workflow
export function cloneWorkflow(id: string, newName?: string): Workflow | null {
  const source = getWorkflow(id)
  if (!source) return null

  const cloned = createWorkflow({
    name: newName || `${source.name}-copy`,
    label: newName ? newName : `${source.label} (Copy)`,
    description: source.description,
    type: source.type,
    trigger: JSON.parse(JSON.stringify(source.trigger)),
    steps: JSON.parse(JSON.stringify(source.steps)),
    visibility: source.visibility,
    enabled: false,
  })

  return cloned
}
