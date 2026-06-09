// Button Engine - Define dynamic buttons throughout the interface
// Allows managers to create and configure buttons without coding

import { logAuditEvent } from './audit-log-engine'
import type { VisibilityRule } from './form-engine'

export interface Button {
  id: string
  name: string
  label: string
  description?: string
  icon?: string
  color?: string
  placement: 'top' | 'bottom' | 'inline' | 'toolbar' | 'contextmenu'
  size: 'sm' | 'md' | 'lg'
  variant: 'primary' | 'secondary' | 'danger' | 'success'
  actionId: string // Links to Action Engine
  bulkAction: boolean // Can be applied to multiple items
  visibility: VisibilityRule
  requiresConfirmation: boolean
  confirmMessage?: string
  successMessage?: string
  errorMessage?: string
  order: number
  version: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
}

export let BUTTONS: Button[] = [
  {
    id: 'button-queue-edit',
    name: 'edit-queue',
    label: 'Edit',
    icon: 'Edit2',
    color: '#3B82F6',
    placement: 'toolbar',
    size: 'md',
    variant: 'primary',
    actionId: 'action-queue-edit',
    bulkAction: false,
    visibility: { type: 'role-based', roles: ['admin', 'manager'] },
    requiresConfirmation: false,
    order: 1,
    version: 1,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
  {
    id: 'button-queue-delete',
    name: 'delete-queue',
    label: 'Delete',
    icon: 'Trash2',
    color: '#EF4444',
    placement: 'toolbar',
    size: 'md',
    variant: 'danger',
    actionId: 'action-queue-delete',
    bulkAction: true,
    visibility: { type: 'role-based', roles: ['admin'] },
    requiresConfirmation: true,
    confirmMessage: 'Are you sure you want to delete this queue?',
    successMessage: 'Queue deleted successfully',
    order: 2,
    version: 1,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
]

export function getButton(id: string): Button | undefined {
  return BUTTONS.find(b => b.id === id)
}

export function getButtonsByPlacement(placement: Button['placement']): Button[] {
  return BUTTONS.filter(b => b.placement === placement)
}

export function getAllButtons(): Button[] {
  return BUTTONS.sort((a, b) => a.order - b.order)
}

export function createButton(data: Omit<Button, 'id' | 'version' | 'metadata'>): Button {
  const button: Button = {
    ...data,
    id: `button-${Date.now()}`,
    version: 1,
    metadata: { createdBy: 'current-user', createdAt: new Date().toISOString(), updatedBy: 'current-user', updatedAt: new Date().toISOString() },
  }
  BUTTONS.push(button)
  logAuditEvent({
    eventType: 'button_created',
    module: 'configuration',
    action: 'create',
    entityId: button.id,
    entityType: 'Button',
    entityName: button.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: button,
    source: 'ui',
  })
  return button
}

export function updateButton(id: string, updates: Partial<Omit<Button, 'id' | 'metadata'>>): Button | null {
  const button = getButton(id)
  if (!button) return null
  const beforeState = JSON.parse(JSON.stringify(button))
  Object.assign(button, updates)
  button.version += 1
  logAuditEvent({
    eventType: 'button_updated',
    module: 'configuration',
    action: 'update',
    entityId: button.id,
    entityType: 'Button',
    entityName: button.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: button,
    source: 'ui',
  })
  return button
}

export function deleteButton(id: string): boolean {
  const index = BUTTONS.findIndex(b => b.id === id)
  if (index > -1) {
    const button = BUTTONS[index]
    BUTTONS.splice(index, 1)
    logAuditEvent({
      eventType: 'button_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: button.id,
      entityType: 'Button',
      entityName: button.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: button,
      source: 'ui',
    })
    return true
  }
  return false
}

export function reorderButtons(placement: Button['placement'], orderedIds: string[]): boolean {
  const buttons = getButtonsByPlacement(placement)
  orderedIds.forEach((id, index) => {
    const btn = buttons.find(b => b.id === id)
    if (btn) btn.order = index + 1
  })
  return true
}
