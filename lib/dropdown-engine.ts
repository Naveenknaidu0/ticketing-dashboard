// Dropdown Engine - Manage dropdown data sources
// Allows managers to define dynamic dropdown options

import { logAuditEvent } from './audit-log-engine'

export interface DropdownOption {
  label: string
  value: string
  color?: string
  icon?: string
  order: number
}

export interface DropdownSource {
  id: string
  name: string
  label: string
  description?: string
  type: 'static' | 'dynamic' | 'api' | 'database'
  options?: DropdownOption[]
  apiEndpoint?: string
  query?: string
  version: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
}

export let DROPDOWN_SOURCES: DropdownSource[] = [
  {
    id: 'dropdown-priority',
    name: 'priority-levels',
    label: 'Priority Levels',
    type: 'static',
    options: [
      { label: 'Low', value: 'low', color: '#10B981', order: 1 },
      { label: 'Medium', value: 'medium', color: '#F59E0B', order: 2 },
      { label: 'High', value: 'high', color: '#EF4444', order: 3 },
      { label: 'Urgent', value: 'urgent', color: '#7C3AED', order: 4 },
    ],
    version: 1,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
]

export function getDropdownSource(id: string): DropdownSource | undefined {
  return DROPDOWN_SOURCES.find(d => d.id === id)
}

export function createDropdownSource(data: Omit<DropdownSource, 'id' | 'version' | 'metadata'>): DropdownSource {
  const source: DropdownSource = {
    ...data,
    id: `dropdown-${Date.now()}`,
    version: 1,
    metadata: { createdBy: 'current-user', createdAt: new Date().toISOString(), updatedBy: 'current-user', updatedAt: new Date().toISOString() },
  }
  DROPDOWN_SOURCES.push(source)
  logAuditEvent({
    eventType: 'dropdown_created',
    module: 'configuration',
    action: 'create',
    entityId: source.id,
    entityType: 'DropdownSource',
    entityName: source.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: source,
    source: 'ui',
  })
  return source
}

export function updateDropdownSource(id: string, updates: Partial<Omit<DropdownSource, 'id' | 'metadata'>>): DropdownSource | null {
  const source = getDropdownSource(id)
  if (!source) return null
  const beforeState = JSON.parse(JSON.stringify(source))
  Object.assign(source, updates)
  source.version += 1
  logAuditEvent({
    eventType: 'dropdown_updated',
    module: 'configuration',
    action: 'update',
    entityId: source.id,
    entityType: 'DropdownSource',
    entityName: source.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: source,
    source: 'ui',
  })
  return source
}

export function deleteDropdownSource(id: string): boolean {
  const index = DROPDOWN_SOURCES.findIndex(d => d.id === id)
  if (index > -1) {
    const source = DROPDOWN_SOURCES[index]
    DROPDOWN_SOURCES.splice(index, 1)
    logAuditEvent({
      eventType: 'dropdown_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: source.id,
      entityType: 'DropdownSource',
      entityName: source.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: source,
      source: 'ui',
    })
    return true
  }
  return false
}
