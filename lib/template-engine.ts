// Template Engine - Store reusable templates and components
// Allows managers to create templates for forms, workflows, and UI patterns

import { logAuditEvent } from './audit-log-engine'
import type { Form } from './form-engine'
import type { Workflow } from './workflow-engine'

export type TemplateType = 'form' | 'workflow' | 'layout' | 'page' | 'widget' | 'action'

export interface Template {
  id: string
  name: string
  label: string
  description?: string
  type: TemplateType
  category: string
  content: Record<string, any>
  thumbnail?: string
  tags: string[]
  isPublic: boolean
  usageCount: number
  version: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
  }
}

export let TEMPLATES: Template[] = [
  {
    id: 'template-form-contact',
    name: 'contact-form-template',
    label: 'Contact Form',
    description: 'Standard contact form with name, email, message',
    type: 'form',
    category: 'forms',
    content: {
      sections: [
        {
          name: 'basic',
          label: 'Contact Information',
          fields: ['field-text-name', 'field-email', 'field-description'],
        },
      ],
    },
    tags: ['contact', 'standard', 'form'],
    isPublic: true,
    usageCount: 0,
    version: 1,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
  {
    id: 'template-workflow-escalate',
    name: 'escalation-workflow-template',
    label: 'Auto Escalation Workflow',
    description: 'Automatically escalate old items',
    type: 'workflow',
    category: 'workflows',
    content: {
      trigger: { type: 'scheduled', schedule: '0 * * * *' },
      steps: [
        { type: 'condition', field: 'age', operator: 'greater', value: 86400 },
        { type: 'action', actionId: 'action-escalate' },
      ],
    },
    tags: ['escalation', 'automated', 'workflow'],
    isPublic: true,
    usageCount: 0,
    version: 1,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString() },
  },
]

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find(t => t.id === id)
}

export function getTemplatesByType(type: TemplateType): Template[] {
  return TEMPLATES.filter(t => t.type === type && t.isPublic)
}

export function getTemplatesByCategory(category: string): Template[] {
  return TEMPLATES.filter(t => t.category === category && t.isPublic)
}

export function searchTemplates(query: string): Template[] {
  return TEMPLATES.filter(
    t =>
      t.isPublic &&
      (t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.label.toLowerCase().includes(query.toLowerCase()) ||
        t.description?.toLowerCase().includes(query.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())))
  )
}

export function createTemplate(data: Omit<Template, 'id' | 'version' | 'metadata' | 'usageCount'>): Template {
  const template: Template = {
    ...data,
    id: `template-${Date.now()}`,
    version: 1,
    usageCount: 0,
    metadata: { createdBy: 'current-user', createdAt: new Date().toISOString(), updatedBy: 'current-user', updatedAt: new Date().toISOString() },
  }
  TEMPLATES.push(template)
  logAuditEvent({
    eventType: 'template_created',
    module: 'configuration',
    action: 'create',
    entityId: template.id,
    entityType: 'Template',
    entityName: template.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: template,
    source: 'ui',
  })
  return template
}

export function updateTemplate(id: string, updates: Partial<Omit<Template, 'id' | 'metadata'>>): Template | null {
  const template = getTemplate(id)
  if (!template) return null
  const beforeState = JSON.parse(JSON.stringify(template))
  Object.assign(template, updates)
  template.version += 1
  logAuditEvent({
    eventType: 'template_updated',
    module: 'configuration',
    action: 'update',
    entityId: template.id,
    entityType: 'Template',
    entityName: template.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: template,
    source: 'ui',
  })
  return template
}

export function deleteTemplate(id: string): boolean {
  const index = TEMPLATES.findIndex(t => t.id === id)
  if (index > -1) {
    const template = TEMPLATES[index]
    TEMPLATES.splice(index, 1)
    logAuditEvent({
      eventType: 'template_deleted',
      module: 'configuration',
      action: 'delete',
      entityId: template.id,
      entityType: 'Template',
      entityName: template.label,
      userId: 'current-user',
      userName: 'Current User',
      userRole: 'manager',
      beforeState: template,
      source: 'ui',
    })
    return true
  }
  return false
}

export function incrementTemplateUsage(id: string): void {
  const template = getTemplate(id)
  if (template) {
    template.usageCount += 1
  }
}

export function cloneTemplate(id: string, newName?: string): Template | null {
  const source = getTemplate(id)
  if (!source) return null

  const cloned = createTemplate({
    name: newName || `${source.name}-copy`,
    label: newName ? newName : `${source.label} (Copy)`,
    description: source.description,
    type: source.type,
    category: source.category,
    content: JSON.parse(JSON.stringify(source.content)),
    thumbnail: source.thumbnail,
    tags: [...source.tags],
    isPublic: false,
  })

  return cloned
}

export function getTemplateStatistics() {
  return {
    totalTemplates: TEMPLATES.length,
    byType: TEMPLATES.reduce((acc, t) => ({ ...acc, [t.type]: (acc[t.type] || 0) + 1 }), {} as Record<string, number>),
    mostUsed: TEMPLATES.sort((a, b) => b.usageCount - a.usageCount).slice(0, 5),
  }
}
