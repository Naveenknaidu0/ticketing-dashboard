// Action Engine - Manage available actions throughout Assignment Engine
// Allows managers to create custom actions without coding

import { logAuditEvent } from './audit-log-engine'
import type { VisibilityRule } from './form-engine'

export interface ActionParameter {
  id: string
  name: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'date' | 'dropdown'
  required: boolean
  defaultValue?: any
  options?: Array<{ label: string; value: string }> // For dropdown type
}

export interface ActionOutcome {
  type: 'success' | 'error' | 'warning'
  message: string
  action?: string // Next action to perform
}

export interface Action {
  id: string
  name: string
  label: string
  description?: string
  icon?: string
  color?: string
  type: 'system' | 'custom'
  category: 'queue' | 'skill' | 'rule' | 'automation' | 'ticket'
  parameters: ActionParameter[]
  outcomes: ActionOutcome[]
  visibility: VisibilityRule
  requiresConfirmation: boolean
  bulkEnabled: boolean // Can be applied to multiple items
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    version: number
    usageCount: number
  }
}

export let ACTION_REGISTRY: Action[] = [
  {
    id: 'action-queue-reassign',
    name: 'reassign-queue',
    label: 'Reassign Queue',
    description: 'Reassign queue to different owner',
    icon: 'UserSwitch',
    color: '#3B82F6',
    type: 'system',
    category: 'queue',
    parameters: [
      {
        id: 'param-owner',
        name: 'new-owner',
        label: 'New Owner',
        type: 'dropdown',
        required: true,
        options: [
          { label: 'Manager 1', value: 'mgr1' },
          { label: 'Manager 2', value: 'mgr2' },
        ],
      },
    ],
    outcomes: [
      { type: 'success', message: 'Queue reassigned successfully' },
      { type: 'error', message: 'Failed to reassign queue' },
    ],
    visibility: { type: 'role-based', roles: ['admin', 'manager'] },
    requiresConfirmation: true,
    bulkEnabled: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1, usageCount: 0 },
  },
  {
    id: 'action-queue-close',
    name: 'close-queue',
    label: 'Close Queue',
    description: 'Close queue and prevent new items',
    icon: 'XCircle',
    color: '#EF4444',
    type: 'system',
    category: 'queue',
    parameters: [
      {
        id: 'param-reason',
        name: 'close-reason',
        label: 'Reason',
        type: 'text',
        required: true,
      },
    ],
    outcomes: [
      { type: 'success', message: 'Queue closed' },
      { type: 'error', message: 'Cannot close active queue' },
    ],
    visibility: { type: 'role-based', roles: ['admin'] },
    requiresConfirmation: true,
    bulkEnabled: false,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1, usageCount: 0 },
  },
  {
    id: 'action-skill-activate',
    name: 'activate-skill',
    label: 'Activate Skill',
    description: 'Activate skill for use',
    icon: 'CheckCircle',
    color: '#10B981',
    type: 'system',
    category: 'skill',
    parameters: [],
    outcomes: [
      { type: 'success', message: 'Skill activated' },
      { type: 'error', message: 'Failed to activate skill' },
    ],
    visibility: { type: 'role-based', roles: ['admin', 'manager'] },
    requiresConfirmation: false,
    bulkEnabled: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1, usageCount: 0 },
  },
]

// Get action by ID
export function getAction(id: string): Action | undefined {
  return ACTION_REGISTRY.find(a => a.id === id)
}

// Get actions by category
export function getActionsByCategory(category: Action['category']): Action[] {
  return ACTION_REGISTRY.filter(a => a.category === category)
}

// Get all system actions
export function getSystemActions(): Action[] {
  return ACTION_REGISTRY.filter(a => a.type === 'system')
}

// Get all custom actions
export function getCustomActions(): Action[] {
  return ACTION_REGISTRY.filter(a => a.type === 'custom')
}

// Get all actions
export function getAllActions(): Action[] {
  return ACTION_REGISTRY
}

// Create new action
export function createAction(data: Omit<Action, 'id' | 'metadata'>): Action {
  const action: Action = {
    ...data,
    id: `action-${Date.now()}`,
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
      version: 1,
      usageCount: 0,
    },
  }

  ACTION_REGISTRY.push(action)

  logAuditEvent({
    eventType: 'action_created',
    module: 'configuration',
    action: 'create',
    entityId: action.id,
    entityType: 'Action',
    entityName: action.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: action,
    source: 'ui',
  })

  return action
}

// Update action
export function updateAction(id: string, updates: Partial<Omit<Action, 'id' | 'metadata'>>): Action | null {
  const action = getAction(id)
  if (!action) return null

  const beforeState = JSON.parse(JSON.stringify(action))
  Object.assign(action, updates)
  action.metadata.updatedAt = new Date().toISOString()
  action.metadata.updatedBy = 'current-user'
  action.metadata.version += 1

  logAuditEvent({
    eventType: 'action_updated',
    module: 'configuration',
    action: 'update',
    entityId: action.id,
    entityType: 'Action',
    entityName: action.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: action,
    source: 'ui',
  })

  return action
}

// Delete action (only custom actions)
export function deleteAction(id: string): boolean {
  const action = getAction(id)
  if (!action || action.type === 'system') return false

  const index = ACTION_REGISTRY.findIndex(a => a.id === id)
  if (index > -1) {
    const deleted = ACTION_REGISTRY[index]
    ACTION_REGISTRY.splice(index, 1)

    logAuditEvent({
      eventType: 'action_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: deleted.id,
      entityType: 'Action',
      entityName: deleted.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: deleted,
      source: 'ui',
    })

    return true
  }
  return false
}

// Increment usage counter
export function incrementActionUsage(id: string): void {
  const action = getAction(id)
  if (action) {
    action.metadata.usageCount += 1
  }
}

// Decrement usage counter
export function decrementActionUsage(id: string): void {
  const action = getAction(id)
  if (action && action.metadata.usageCount > 0) {
    action.metadata.usageCount -= 1
  }
}

// Clone action
export function cloneAction(id: string, newName?: string): Action | null {
  const source = getAction(id)
  if (!source) return null

  const cloned = createAction({
    name: newName || `${source.name}-copy`,
    label: newName ? newName : `${source.label} (Copy)`,
    description: source.description,
    icon: source.icon,
    color: source.color,
    type: 'custom',
    category: source.category,
    parameters: JSON.parse(JSON.stringify(source.parameters)),
    outcomes: JSON.parse(JSON.stringify(source.outcomes)),
    visibility: source.visibility,
    requiresConfirmation: source.requiresConfirmation,
    bulkEnabled: source.bulkEnabled,
  })

  return cloned
}

// Get action statistics
export interface ActionStatistics {
  totalActions: number
  systemActions: number
  customActions: number
  byCategory: Record<string, number>
  mostUsed: Action[]
}

export function getActionStatistics(): ActionStatistics {
  const stats: ActionStatistics = {
    totalActions: ACTION_REGISTRY.length,
    systemActions: ACTION_REGISTRY.filter(a => a.type === 'system').length,
    customActions: ACTION_REGISTRY.filter(a => a.type === 'custom').length,
    byCategory: {},
    mostUsed: [],
  }

  ACTION_REGISTRY.forEach(action => {
    stats.byCategory[action.category] = (stats.byCategory[action.category] || 0) + 1
  })

  stats.mostUsed = ACTION_REGISTRY.sort((a, b) => b.metadata.usageCount - a.metadata.usageCount).slice(0, 5)

  return stats
}
