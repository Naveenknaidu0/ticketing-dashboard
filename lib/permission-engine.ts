// Permission Engine - Manage role-based access control
// Allows managers to control visibility and access without coding

import { logAuditEvent } from './audit-log-engine'

export type Role = 'admin' | 'manager' | 'agent' | 'supervisor' | 'analyst' | 'custom'

export interface Permission {
  id: string
  name: string
  label: string
  description?: string
  resource: string // form, field, action, status, etc.
  resourceId: string
  roles: Role[]
  canView: boolean
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  version: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
}

export let PERMISSIONS: Permission[] = [
  {
    id: 'perm-form-queue-create',
    name: 'queue-create-form-access',
    label: 'Queue Creation Form Access',
    description: 'Access to create new queues',
    resource: 'form',
    resourceId: 'form-queue-create',
    roles: ['admin', 'manager'],
    canView: true,
    canCreate: true,
    canEdit: true,
    canDelete: false,
    version: 1,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
]

export function getPermission(id: string): Permission | undefined {
  return PERMISSIONS.find(p => p.id === id)
}

export function getPermissionsByRole(role: Role): Permission[] {
  return PERMISSIONS.filter(p => p.roles.includes(role))
}

export function getPermissionsByResource(resource: string, resourceId: string): Permission[] {
  return PERMISSIONS.filter(p => p.resource === resource && p.resourceId === resourceId)
}

export function checkPermission(resourceId: string, userRole: Role, action: 'view' | 'create' | 'edit' | 'delete'): boolean {
  const perms = PERMISSIONS.filter(p => p.resourceId === resourceId && p.roles.includes(userRole))
  if (perms.length === 0) return false

  const perm = perms[0]
  switch (action) {
    case 'view':
      return perm.canView
    case 'create':
      return perm.canCreate
    case 'edit':
      return perm.canEdit
    case 'delete':
      return perm.canDelete
    default:
      return false
  }
}

export function createPermission(data: Omit<Permission, 'id' | 'version' | 'metadata'>): Permission {
  const permission: Permission = {
    ...data,
    id: `perm-${Date.now()}`,
    version: 1,
    metadata: { createdBy: 'current-user', createdAt: new Date().toISOString(), updatedBy: 'current-user', updatedAt: new Date().toISOString() },
  }
  PERMISSIONS.push(permission)
  logAuditEvent({
    eventType: 'permission_created',
    module: 'configuration',
    action: 'create',
    entityId: permission.id,
    entityType: 'Permission',
    entityName: permission.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: permission,
    source: 'ui',
  })
  return permission
}

export function updatePermission(id: string, updates: Partial<Omit<Permission, 'id' | 'metadata'>>): Permission | null {
  const permission = getPermission(id)
  if (!permission) return null
  const beforeState = JSON.parse(JSON.stringify(permission))
  Object.assign(permission, updates)
  permission.version += 1
  logAuditEvent({
    eventType: 'permission_updated',
    module: 'configuration',
    action: 'update',
    entityId: permission.id,
    entityType: 'Permission',
    entityName: permission.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: permission,
    source: 'ui',
  })
  return permission
}

export function deletePermission(id: string): boolean {
  const index = PERMISSIONS.findIndex(p => p.id === id)
  if (index > -1) {
    const permission = PERMISSIONS[index]
    PERMISSIONS.splice(index, 1)
    logAuditEvent({
      eventType: 'permission_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: permission.id,
      entityType: 'Permission',
      entityName: permission.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: permission,
      source: 'ui',
    })
    return true
  }
  return false
}
