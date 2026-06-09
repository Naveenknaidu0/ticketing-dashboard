// Form Engine - Central management of forms across Assignment Engine
// Allows managers to create, edit, and manage all forms without coding

import { logAuditEvent } from './audit-log-engine'

export type FieldType = 'text' | 'textarea' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'radio' | 'multi-select' | 'email' | 'phone' | 'url'

export interface ValidationRule {
  type: 'required' | 'min-length' | 'max-length' | 'pattern' | 'custom'
  value?: any
  message: string
}

export interface VisibilityRule {
  type: 'always' | 'role-based' | 'condition-based'
  roles?: string[]
  conditions?: Record<string, any>
}

export interface FormField {
  id: string
  name: string
  label: string
  type: FieldType
  required: boolean
  readOnly: boolean
  defaultValue?: any
  validation: ValidationRule[]
  visibility: VisibilityRule
  placeholder?: string
  order: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    version: number
  }
}

export interface FormSection {
  id: string
  name: string
  label: string
  description?: string
  fields: FormField[]
  visibility: VisibilityRule
  order: number
  collapsible: boolean
}

export interface Form {
  id: string
  name: string
  label: string
  type: 'queue-form' | 'skill-form' | 'rule-form' | 'automation-form'
  description?: string
  sections: FormSection[]
  permissions: VisibilityRule
  status: 'draft' | 'active' | 'archived'
  version: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
}

export let FORM_STORE: Form[] = [
  {
    id: 'form-queue-create',
    name: 'queue-create',
    label: 'Create Queue',
    type: 'queue-form',
    description: 'Form for creating new queues',
    sections: [
      {
        id: 'section-basic',
        name: 'basic-info',
        label: 'Basic Information',
        fields: [
          {
            id: 'field-name',
            name: 'name',
            label: 'Queue Name',
            type: 'text',
            required: true,
            readOnly: false,
            placeholder: 'e.g., Customer Support',
            validation: [
              { type: 'required', message: 'Queue name is required' },
              { type: 'min-length', value: 3, message: 'Minimum 3 characters' },
            ],
            visibility: { type: 'always' },
            order: 1,
            metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
          },
          {
            id: 'field-description',
            name: 'description',
            label: 'Description',
            type: 'textarea',
            required: false,
            readOnly: false,
            placeholder: 'Queue description...',
            validation: [],
            visibility: { type: 'always' },
            order: 2,
            metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
          },
        ],
        visibility: { type: 'always' },
        order: 1,
        collapsible: false,
      },
    ],
    permissions: { type: 'always' },
    status: 'active',
    version: 1,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
]

// Get form by ID
export function getForm(id: string): Form | undefined {
  return FORM_STORE.find(f => f.id === id)
}

// Get forms by type
export function getFormsByType(type: Form['type']): Form[] {
  return FORM_STORE.filter(f => f.type === type && f.status === 'active')
}

// Get all active forms
export function getAllActiveForms(): Form[] {
  return FORM_STORE.filter(f => f.status === 'active')
}

// Create new form
export function createForm(data: Omit<Form, 'id' | 'version' | 'metadata' | 'status'>): Form {
  const form: Form = {
    ...data,
    id: `form-${Date.now()}`,
    status: 'draft',
    version: 1,
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
    },
  }

  FORM_STORE.push(form)

  logAuditEvent({
    eventType: 'form_created',
    module: 'configuration',
    action: 'create',
    entityId: form.id,
    entityType: 'Form',
    entityName: form.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: form,
    source: 'ui',
  })

  return form
}

// Update form
export function updateForm(id: string, updates: Partial<Omit<Form, 'id' | 'metadata'>>): Form | null {
  const form = getForm(id)
  if (!form) return null

  const beforeState = JSON.parse(JSON.stringify(form))
  Object.assign(form, updates)
  form.version += 1
  form.metadata.updatedAt = new Date().toISOString()
  form.metadata.updatedBy = 'current-user'

  logAuditEvent({
    eventType: 'form_updated',
    module: 'configuration',
    action: 'update',
    entityId: form.id,
    entityType: 'Form',
    entityName: form.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: form,
    source: 'ui',
  })

  return form
}

// Delete form
export function deleteForm(id: string): boolean {
  const index = FORM_STORE.findIndex(f => f.id === id)
  if (index > -1) {
    const form = FORM_STORE[index]
    FORM_STORE.splice(index, 1)

    logAuditEvent({
      eventType: 'form_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: form.id,
      entityType: 'Form',
      entityName: form.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: form,
      source: 'ui',
    })

    return true
  }
  return false
}

// Publish form (move from draft to active)
export function publishForm(id: string): Form | null {
  return updateForm(id, { status: 'active' })
}

// Archive form
export function archiveForm(id: string): Form | null {
  return updateForm(id, { status: 'archived' })
}

// Clone form
export function cloneForm(id: string, newName?: string): Form | null {
  const source = getForm(id)
  if (!source) return null

  const cloned = createForm({
    name: newName || `${source.name}-copy`,
    label: newName ? newName : `${source.label} (Copy)`,
    type: source.type,
    description: source.description,
    sections: JSON.parse(JSON.stringify(source.sections)),
    permissions: source.permissions,
  })

  return cloned
}

// Validate form data against form schema
export interface FormValidationResult {
  valid: boolean
  errors: Record<string, string>
}

export function validateFormData(formId: string, data: Record<string, any>): FormValidationResult {
  const form = getForm(formId)
  if (!form) return { valid: false, errors: { _form: 'Form not found' } }

  const errors: Record<string, string> = {}

  form.sections.forEach(section => {
    section.fields.forEach(field => {
      const value = data[field.name]

      // Check required
      if (field.required && (value === undefined || value === null || value === '')) {
        errors[field.name] = field.validation.find(v => v.type === 'required')?.message || 'This field is required'
        return
      }

      // Run validation rules
      field.validation.forEach(rule => {
        if (rule.type === 'min-length' && value && value.length < rule.value) {
          errors[field.name] = rule.message
        }
        if (rule.type === 'max-length' && value && value.length > rule.value) {
          errors[field.name] = rule.message
        }
        if (rule.type === 'pattern' && value && !new RegExp(rule.value).test(value)) {
          errors[field.name] = rule.message
        }
      })
    })
  })

  return { valid: Object.keys(errors).length === 0, errors }
}

// Get form statistics
export interface FormStatistics {
  totalForms: number
  byType: Record<string, number>
  byStatus: Record<string, number>
  totalFields: number
}

export function getFormStatistics(): FormStatistics {
  const stats: FormStatistics = {
    totalForms: FORM_STORE.length,
    byType: {},
    byStatus: {},
    totalFields: 0,
  }

  FORM_STORE.forEach(form => {
    stats.byType[form.type] = (stats.byType[form.type] || 0) + 1
    stats.byStatus[form.status] = (stats.byStatus[form.status] || 0) + 1
    stats.totalFields += form.sections.reduce((sum, s) => sum + s.fields.length, 0)
  })

  return stats
}
