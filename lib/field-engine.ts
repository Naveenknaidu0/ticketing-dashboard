// Field Engine - Central repository of reusable form fields
// Managers can create field libraries shared across all forms

import { logAuditEvent } from './audit-log-engine'
import type { FieldType, ValidationRule, VisibilityRule } from './form-engine'

export interface ReusableField {
  id: string
  name: string
  label: string
  type: FieldType
  description?: string
  category: string
  required: boolean
  readOnly: boolean
  defaultValue?: any
  validation: ValidationRule[]
  visibility: VisibilityRule
  placeholder?: string
  helpText?: string
  options?: Array<{ label: string; value: string }> // For dropdown/radio/select
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    version: number
    usageCount: number
  }
}

export let FIELD_LIBRARY: ReusableField[] = [
  {
    id: 'field-text-name',
    name: 'text-name',
    label: 'Name',
    type: 'text',
    category: 'common',
    description: 'General text field for names',
    required: true,
    readOnly: false,
    placeholder: 'Enter name...',
    validation: [{ type: 'required', message: 'Name is required' }],
    visibility: { type: 'always' },
    helpText: 'Enter a valid name',
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1, usageCount: 0 },
  },
  {
    id: 'field-email',
    name: 'email-address',
    label: 'Email Address',
    type: 'email',
    category: 'contact',
    description: 'Email field with validation',
    required: true,
    readOnly: false,
    placeholder: 'user@example.com',
    validation: [{ type: 'required', message: 'Email is required' }],
    visibility: { type: 'always' },
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1, usageCount: 0 },
  },
  {
    id: 'field-phone',
    name: 'phone-number',
    label: 'Phone Number',
    type: 'phone',
    category: 'contact',
    description: 'Phone field with formatting',
    required: false,
    readOnly: false,
    placeholder: '+1-555-0000',
    validation: [],
    visibility: { type: 'always' },
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1, usageCount: 0 },
  },
  {
    id: 'field-description',
    name: 'description-textarea',
    label: 'Description',
    type: 'textarea',
    category: 'common',
    description: 'Multi-line text area',
    required: false,
    readOnly: false,
    placeholder: 'Enter description...',
    validation: [],
    visibility: { type: 'always' },
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1, usageCount: 0 },
  },
]

// Get field by ID
export function getField(id: string): ReusableField | undefined {
  return FIELD_LIBRARY.find(f => f.id === id)
}

// Get fields by category
export function getFieldsByCategory(category: string): ReusableField[] {
  return FIELD_LIBRARY.filter(f => f.category === category)
}

// Get all fields
export function getAllFields(): ReusableField[] {
  return FIELD_LIBRARY
}

// Create new field
export function createField(data: Omit<ReusableField, 'id' | 'metadata'>): ReusableField {
  const field: ReusableField = {
    ...data,
    id: `field-${Date.now()}`,
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
      version: 1,
      usageCount: 0,
    },
  }

  FIELD_LIBRARY.push(field)

  logAuditEvent({
    eventType: 'field_created',
    module: 'configuration',
    action: 'create',
    entityId: field.id,
    entityType: 'Field',
    entityName: field.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: field,
    source: 'ui',
  })

  return field
}

// Update field
export function updateField(id: string, updates: Partial<Omit<ReusableField, 'id' | 'metadata'>>): ReusableField | null {
  const field = getField(id)
  if (!field) return null

  const beforeState = JSON.parse(JSON.stringify(field))
  Object.assign(field, updates)
  field.metadata.updatedAt = new Date().toISOString()
  field.metadata.updatedBy = 'current-user'
  field.metadata.version += 1

  logAuditEvent({
    eventType: 'field_updated',
    module: 'configuration',
    action: 'update',
    entityId: field.id,
    entityType: 'Field',
    entityName: field.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: field,
    source: 'ui',
  })

  return field
}

// Delete field
export function deleteField(id: string): boolean {
  const index = FIELD_LIBRARY.findIndex(f => f.id === id)
  if (index > -1) {
    const field = FIELD_LIBRARY[index]

    // Check usage
    if (field.metadata.usageCount > 0) {
      return false // Cannot delete field in use
    }

    FIELD_LIBRARY.splice(index, 1)

    logAuditEvent({
      eventType: 'field_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: field.id,
      entityType: 'Field',
      entityName: field.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: field,
      source: 'ui',
    })

    return true
  }
  return false
}

// Increment usage counter
export function incrementFieldUsage(id: string): void {
  const field = getField(id)
  if (field) {
    field.metadata.usageCount += 1
  }
}

// Decrement usage counter
export function decrementFieldUsage(id: string): void {
  const field = getField(id)
  if (field && field.metadata.usageCount > 0) {
    field.metadata.usageCount -= 1
  }
}

// Clone field
export function cloneField(id: string, newName?: string): ReusableField | null {
  const source = getField(id)
  if (!source) return null

  const cloned = createField({
    name: newName || `${source.name}-copy`,
    label: newName ? newName : `${source.label} (Copy)`,
    type: source.type,
    description: source.description,
    category: source.category,
    required: source.required,
    readOnly: source.readOnly,
    defaultValue: source.defaultValue,
    validation: JSON.parse(JSON.stringify(source.validation)),
    visibility: source.visibility,
    placeholder: source.placeholder,
    helpText: source.helpText,
    options: source.options ? JSON.parse(JSON.stringify(source.options)) : undefined,
  })

  return cloned
}

// Get field statistics
export interface FieldStatistics {
  totalFields: number
  byCategory: Record<string, number>
  byType: Record<string, number>
  mostUsed: ReusableField[]
}

export function getFieldStatistics(): FieldStatistics {
  const stats: FieldStatistics = {
    totalFields: FIELD_LIBRARY.length,
    byCategory: {},
    byType: {},
    mostUsed: [],
  }

  FIELD_LIBRARY.forEach(field => {
    stats.byCategory[field.category] = (stats.byCategory[field.category] || 0) + 1
    stats.byType[field.type] = (stats.byType[field.type] || 0) + 1
  })

  stats.mostUsed = FIELD_LIBRARY.sort((a, b) => b.metadata.usageCount - a.metadata.usageCount).slice(0, 5)

  return stats
}
