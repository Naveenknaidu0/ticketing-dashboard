/**
 * Custom Fields Engine - Allows creation of custom fields without developer involvement
 */

export type FieldType =
  | 'text'
  | 'textarea'
  | 'dropdown'
  | 'multi-select'
  | 'date'
  | 'datetime'
  | 'user-picker'
  | 'team-picker'
  | 'checkbox'
  | 'number'
  | 'email'
  | 'phone'
  | 'url'

export interface FieldOption {
  id: string
  label: string
  value: string
  color?: string
}

export interface CustomField {
  id: string
  name: string
  description: string
  fieldType: FieldType
  isRequired: boolean
  isMultiline?: boolean
  placeholder?: string
  defaultValue?: any
  options?: FieldOption[] // For dropdown/multi-select
  minLength?: number
  maxLength?: number
  pattern?: string // Regex pattern for validation
  minValue?: number
  maxValue?: number
  applicableTo: 'tickets' | 'contacts' | 'companies' | 'both' // Entity types
  status: 'active' | 'draft' | 'archived'
  order: number
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
  usageCount: number
}

// In-memory storage
const FIELDS = new Map<string, CustomField>()

// Initialize with some default fields
function initializeDefaults() {
  if (FIELDS.size === 0) {
    const now = new Date().toISOString()
    const defaults: CustomField[] = [
      {
        id: 'field-priority-level',
        name: 'Priority Level',
        description: 'Ticket priority level',
        fieldType: 'dropdown',
        isRequired: true,
        options: [
          { id: 'p1', label: 'Critical', value: 'critical', color: '#DC2626' },
          { id: 'p2', label: 'High', value: 'high', color: '#F97316' },
          { id: 'p3', label: 'Medium', value: 'medium', color: '#EAB308' },
          { id: 'p4', label: 'Low', value: 'low', color: '#22C55E' },
        ],
        applicableTo: 'tickets',
        status: 'active',
        order: 1,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        usageCount: 0,
      },
      {
        id: 'field-customer-type',
        name: 'Customer Type',
        description: 'Type of customer',
        fieldType: 'dropdown',
        isRequired: false,
        options: [
          { id: 'ct1', label: 'Enterprise', value: 'enterprise' },
          { id: 'ct2', label: 'SMB', value: 'smb' },
          { id: 'ct3', label: 'Startup', value: 'startup' },
          { id: 'ct4', label: 'Individual', value: 'individual' },
        ],
        applicableTo: 'contacts',
        status: 'active',
        order: 1,
        createdAt: now,
        updatedAt: now,
        createdBy: 'system',
        updatedBy: 'system',
        usageCount: 0,
      },
    ]
    defaults.forEach(f => FIELDS.set(f.id, f))
  }
}

export const customFieldsEngine = {
  /**
   * Create new custom field
   */
  createField(data: {
    name: string
    description: string
    fieldType: FieldType
    isRequired?: boolean
    options?: FieldOption[]
    applicableTo: 'tickets' | 'contacts' | 'companies' | 'both'
    placeholder?: string
    defaultValue?: any
    userId: string
  }): CustomField {
    const now = new Date().toISOString()
    const id = `field-${Date.now()}`
    const order = FIELDS.size + 1

    const field: CustomField = {
      id,
      name: data.name,
      description: data.description,
      fieldType: data.fieldType,
      isRequired: data.isRequired ?? false,
      options: data.options,
      applicableTo: data.applicableTo,
      status: 'draft',
      order,
      placeholder: data.placeholder,
      defaultValue: data.defaultValue,
      createdAt: now,
      updatedAt: now,
      createdBy: data.userId,
      updatedBy: data.userId,
      usageCount: 0,
    }

    FIELDS.set(id, field)
    return field
  },

  /**
   * Get field by ID
   */
  getField(fieldId: string): CustomField | null {
    initializeDefaults()
    return FIELDS.get(fieldId) || null
  },

  /**
   * Get all fields
   */
  getAllFields(): CustomField[] {
    initializeDefaults()
    return Array.from(FIELDS.values()).sort((a, b) => a.order - b.order)
  },

  /**
   * Get active fields
   */
  getActiveFields(): CustomField[] {
    initializeDefaults()
    return Array.from(FIELDS.values())
      .filter(f => f.status === 'active')
      .sort((a, b) => a.order - b.order)
  },

  /**
   * Get fields for entity type
   */
  getFieldsForEntity(applicableTo: 'tickets' | 'contacts' | 'companies' | 'both'): CustomField[] {
    initializeDefaults()
    return Array.from(FIELDS.values())
      .filter(f => f.status === 'active' && (f.applicableTo === applicableTo || f.applicableTo === 'both'))
      .sort((a, b) => a.order - b.order)
  },

  /**
   * Update field
   */
  updateField(fieldId: string, updates: Partial<Omit<CustomField, 'id' | 'createdAt' | 'createdBy'>>, userId: string): CustomField | null {
    const field = FIELDS.get(fieldId)
    if (!field) return null

    const updated: CustomField = {
      ...field,
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }

    FIELDS.set(fieldId, updated)
    return updated
  },

  /**
   * Add field option
   */
  addOption(fieldId: string, option: FieldOption, userId: string): CustomField | null {
    const field = FIELDS.get(fieldId)
    if (!field || !field.options) return field || null

    const updated: CustomField = {
      ...field,
      options: [...field.options, option],
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }

    FIELDS.set(fieldId, updated)
    return updated
  },

  /**
   * Remove field option
   */
  removeOption(fieldId: string, optionId: string, userId: string): CustomField | null {
    const field = FIELDS.get(fieldId)
    if (!field || !field.options) return field || null

    const updated: CustomField = {
      ...field,
      options: field.options.filter(o => o.id !== optionId),
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    }

    FIELDS.set(fieldId, updated)
    return updated
  },

  /**
   * Publish field (draft -> active)
   */
  publishField(fieldId: string, userId: string): CustomField | null {
    return this.updateField(fieldId, { status: 'active' }, userId)
  },

  /**
   * Archive field
   */
  archiveField(fieldId: string, userId: string): CustomField | null {
    return this.updateField(fieldId, { status: 'archived' }, userId)
  },

  /**
   * Delete field permanently
   */
  deleteField(fieldId: string): boolean {
    return FIELDS.delete(fieldId)
  },

  /**
   * Reorder fields
   */
  reorderFields(fieldIds: string[], userId: string): boolean {
    fieldIds.forEach((id, index) => {
      const field = FIELDS.get(id)
      if (field) {
        FIELDS.set(id, {
          ...field,
          order: index,
          updatedAt: new Date().toISOString(),
          updatedBy: userId,
        })
      }
    })
    return true
  },

  /**
   * Increment usage count
   */
  incrementUsageCount(fieldId: string): CustomField | null {
    const field = FIELDS.get(fieldId)
    if (!field) return null

    const updated: CustomField = {
      ...field,
      usageCount: field.usageCount + 1,
      updatedAt: new Date().toISOString(),
    }

    FIELDS.set(fieldId, updated)
    return updated
  },

  /**
   * Clone field
   */
  cloneField(fieldId: string, userId: string): CustomField | null {
    const original = FIELDS.get(fieldId)
    if (!original) return null

    const now = new Date().toISOString()
    const newId = `field-${Date.now()}`

    const cloned: CustomField = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      status: 'draft',
      order: FIELDS.size,
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
    }

    FIELDS.set(newId, cloned)
    return cloned
  },

  /**
   * Get field statistics
   */
  getStatistics() {
    initializeDefaults()
    const fields = Array.from(FIELDS.values())
    return {
      total: fields.length,
      active: fields.filter(f => f.status === 'active').length,
      draft: fields.filter(f => f.status === 'draft').length,
      archived: fields.filter(f => f.status === 'archived').length,
      byType: {
        text: fields.filter(f => f.fieldType === 'text').length,
        dropdown: fields.filter(f => f.fieldType === 'dropdown').length,
        'multi-select': fields.filter(f => f.fieldType === 'multi-select').length,
        date: fields.filter(f => f.fieldType === 'date').length,
        other: fields.filter(f => !['text', 'dropdown', 'multi-select', 'date'].includes(f.fieldType)).length,
      },
    }
  },

  /**
   * Export fields as JSON
   */
  exportFields(): CustomField[] {
    initializeDefaults()
    return Array.from(FIELDS.values())
  },

  /**
   * Import fields from JSON
   */
  importFields(fields: CustomField[], userId: string): number {
    let imported = 0
    for (const field of fields) {
      const newField = {
        ...field,
        createdBy: userId,
        updatedBy: userId,
      }
      FIELDS.set(field.id, newField)
      imported++
    }
    return imported
  },
}
