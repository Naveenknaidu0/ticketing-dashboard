// Status Engine - Manage status workflows and transitions
// Allows managers to define status lifecycles without coding

import { logAuditEvent } from './audit-log-engine'
import type { VisibilityRule } from './form-engine'

export interface StatusTransition {
  fromStatus: string
  toStatus: string
  label: string
  description?: string
  requiresReason: boolean
  allowedRoles: string[]
}

export interface Status {
  id: string
  code: string
  label: string
  color: string
  description?: string
  icon?: string
  type: 'initial' | 'intermediate' | 'terminal'
  nextStatuses: string[] // IDs of allowed next statuses
  permissions: VisibilityRule
  order: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    version: number
  }
}

export interface StatusWorkflow {
  id: string
  name: string
  label: string
  description?: string
  entityType: 'queue' | 'skill' | 'rule' | 'automation' | 'ticket'
  statuses: Status[]
  transitions: StatusTransition[]
  initialStatus: string
  version: number
  status: 'draft' | 'active' | 'archived'
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
}

export let STATUS_WORKFLOWS: StatusWorkflow[] = [
  {
    id: 'workflow-queue-status',
    name: 'queue-status-workflow',
    label: 'Queue Status Workflow',
    description: 'Defines queue lifecycle',
    entityType: 'queue',
    statuses: [
      {
        id: 'status-queue-active',
        code: 'active',
        label: 'Active',
        color: '#10B981',
        type: 'intermediate',
        nextStatuses: ['status-queue-paused', 'status-queue-closed'],
        permissions: { type: 'always' },
        order: 1,
        metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
      },
      {
        id: 'status-queue-paused',
        code: 'paused',
        label: 'Paused',
        color: '#F59E0B',
        type: 'intermediate',
        nextStatuses: ['status-queue-active', 'status-queue-closed'],
        permissions: { type: 'role-based', roles: ['admin', 'manager'] },
        order: 2,
        metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
      },
      {
        id: 'status-queue-closed',
        code: 'closed',
        label: 'Closed',
        color: '#EF4444',
        type: 'terminal',
        nextStatuses: [],
        permissions: { type: 'role-based', roles: ['admin'] },
        order: 3,
        metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
      },
    ],
    transitions: [
      { fromStatus: 'status-queue-active', toStatus: 'status-queue-paused', label: 'Pause Queue', requiresReason: true, allowedRoles: ['admin', 'manager'] },
      { fromStatus: 'status-queue-active', toStatus: 'status-queue-closed', label: 'Close Queue', requiresReason: true, allowedRoles: ['admin'] },
      { fromStatus: 'status-queue-paused', toStatus: 'status-queue-active', label: 'Resume Queue', requiresReason: false, allowedRoles: ['admin', 'manager'] },
    ],
    initialStatus: 'status-queue-active',
    version: 1,
    status: 'active',
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
]

// Get workflow by ID
export function getStatusWorkflow(id: string): StatusWorkflow | undefined {
  return STATUS_WORKFLOWS.find(w => w.id === id)
}

// Get workflow by entity type
export function getWorkflowByEntityType(entityType: StatusWorkflow['entityType']): StatusWorkflow | undefined {
  return STATUS_WORKFLOWS.find(w => w.entityType === entityType && w.status === 'active')
}

// Get status by ID
export function getStatus(workflowId: string, statusId: string): Status | undefined {
  const workflow = getStatusWorkflow(workflowId)
  return workflow?.statuses.find(s => s.id === statusId)
}

// Get all active workflows
export function getAllActiveWorkflows(): StatusWorkflow[] {
  return STATUS_WORKFLOWS.filter(w => w.status === 'active')
}

// Create new workflow
export function createStatusWorkflow(data: Omit<StatusWorkflow, 'id' | 'version' | 'metadata' | 'status'>): StatusWorkflow {
  const workflow: StatusWorkflow = {
    ...data,
    id: `workflow-${Date.now()}`,
    version: 1,
    status: 'draft',
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    },
  }

  STATUS_WORKFLOWS.push(workflow)

  logAuditEvent({
    eventType: 'workflow_created',
    module: 'configuration',
    action: 'create',
    entityId: workflow.id,
    entityType: 'StatusWorkflow',
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
export function updateStatusWorkflow(id: string, updates: Partial<Omit<StatusWorkflow, 'id' | 'metadata'>>): StatusWorkflow | null {
  const workflow = getStatusWorkflow(id)
  if (!workflow) return null

  const beforeState = JSON.parse(JSON.stringify(workflow))
  Object.assign(workflow, updates)
  workflow.version += 1
  workflow.metadata.updatedAt = new Date().toISOString()
  workflow.metadata.updatedBy = 'current-user'

  logAuditEvent({
    eventType: 'workflow_updated',
    module: 'configuration',
    action: 'update',
    entityId: workflow.id,
    entityType: 'StatusWorkflow',
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
export function deleteStatusWorkflow(id: string): boolean {
  const index = STATUS_WORKFLOWS.findIndex(w => w.id === id)
  if (index > -1) {
    const workflow = STATUS_WORKFLOWS[index]
    STATUS_WORKFLOWS.splice(index, 1)

    logAuditEvent({
      eventType: 'workflow_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: workflow.id,
      entityType: 'StatusWorkflow',
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

// Add status to workflow
export function addStatusToWorkflow(workflowId: string, status: Status): StatusWorkflow | null {
  const workflow = getStatusWorkflow(workflowId)
  if (!workflow) return null

  status.order = (workflow.statuses.length || 0) + 1
  workflow.statuses.push(status)
  return updateStatusWorkflow(workflowId, { statuses: workflow.statuses })
}

// Add transition
export function addTransition(workflowId: string, transition: StatusTransition): StatusWorkflow | null {
  const workflow = getStatusWorkflow(workflowId)
  if (!workflow) return null

  // Check if transition already exists
  if (workflow.transitions.some(t => t.fromStatus === transition.fromStatus && t.toStatus === transition.toStatus)) {
    return workflow
  }

  workflow.transitions.push(transition)
  return updateStatusWorkflow(workflowId, { transitions: workflow.transitions })
}

// Check if transition is allowed
export function isTransitionAllowed(workflowId: string, fromStatusId: string, toStatusId: string, userRole: string): boolean {
  const workflow = getStatusWorkflow(workflowId)
  if (!workflow) return false

  const transition = workflow.transitions.find(t => t.fromStatus === fromStatusId && t.toStatus === toStatusId)
  if (!transition) return false

  return transition.allowedRoles.includes(userRole)
}

// Publish workflow
export function publishStatusWorkflow(id: string): StatusWorkflow | null {
  return updateStatusWorkflow(id, { status: 'active' })
}

// Archive workflow
export function archiveStatusWorkflow(id: string): StatusWorkflow | null {
  return updateStatusWorkflow(id, { status: 'archived' })
}

// Clone workflow
export function cloneStatusWorkflow(id: string, newName?: string): StatusWorkflow | null {
  const source = getStatusWorkflow(id)
  if (!source) return null

  const cloned = createStatusWorkflow({
    name: newName || `${source.name}-copy`,
    label: newName ? newName : `${source.label} (Copy)`,
    description: source.description,
    entityType: source.entityType,
    statuses: JSON.parse(JSON.stringify(source.statuses)),
    transitions: JSON.parse(JSON.stringify(source.transitions)),
    initialStatus: source.initialStatus,
  })

  return cloned
}

// Get workflow statistics
export interface WorkflowStatistics {
  totalWorkflows: number
  byEntityType: Record<string, number>
  byStatus: Record<string, number>
  totalStatuses: number
  totalTransitions: number
}

export function getWorkflowStatistics(): WorkflowStatistics {
  const stats: WorkflowStatistics = {
    totalWorkflows: STATUS_WORKFLOWS.length,
    byEntityType: {},
    byStatus: {},
    totalStatuses: 0,
    totalTransitions: 0,
  }

  STATUS_WORKFLOWS.forEach(workflow => {
    stats.byEntityType[workflow.entityType] = (stats.byEntityType[workflow.entityType] || 0) + 1
    stats.byStatus[workflow.status] = (stats.byStatus[workflow.status] || 0) + 1
    stats.totalStatuses += workflow.statuses.length
    stats.totalTransitions += workflow.transitions.length
  })

  return stats
}
