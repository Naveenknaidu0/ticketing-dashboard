// Central Configuration Registry
// Single source of truth for all Assignment Engine configurations
// Replaces all hardcoded arrays with dynamic manager-controlled data

import { logAuditEvent } from './audit-log-engine'

// Import listeners for registry changes (to avoid circular imports, this is defined at bottom)
let registryChangeListeners: Array<(type: 'create' | 'update' | 'delete', value: ConfigurationValue) => void> = []

export function subscribeToRegistryChanges(listener: (type: 'create' | 'update' | 'delete', value: ConfigurationValue) => void) {
  registryChangeListeners.push(listener)
  return () => {
    registryChangeListeners = registryChangeListeners.filter(l => l !== listener)
  }
}

export interface ConfigurationValue {
  id: string
  code: string
  label: string
  description?: string
  color?: string
  icon?: string
  category: string
  systemCategory: 'queue' | 'skill' | 'rule' | 'automation' | 'system'
  status: 'active' | 'draft' | 'disabled' | 'archived'
  enabled: boolean
  order: number
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    version: number
  }
  dependencies?: {
    usedIn: Array<{
      system: string
      itemId: string
      itemName: string
    }>
  }
}

export interface ConfigurationSection {
  id: string
  title: string
  description: string
  systemCategory: 'queue' | 'skill' | 'rule' | 'automation' | 'system'
  icon: string
  color: string
  subsections: ConfigurationSubsection[]
}

export interface ConfigurationSubsection {
  id: string
  name: string
  description: string
  values: ConfigurationValue[]
  allowCustom: boolean
  allowHierarchy: boolean
}

export interface ConfigurationAuditLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: 'create' | 'update' | 'delete' | 'disable' | 'archive' | 'publish'
  section: string
  subsection: string
  targetId: string
  targetName: string
  changes?: Record<string, { from: any; to: any }>
  status: 'success' | 'failed'
}

// Central configuration data store
export const CONFIGURATION_REGISTRY: ConfigurationValue[] = [
  // Queue Configurations
  { id: 'queue-type-support', code: 'support', label: 'Support', category: 'queue-types', systemCategory: 'queue', status: 'active', enabled: true, order: 1, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'queue-type-billing', code: 'billing', label: 'Billing', category: 'queue-types', systemCategory: 'queue', status: 'active', enabled: true, order: 2, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'queue-type-technical', code: 'technical', label: 'Technical', category: 'queue-types', systemCategory: 'queue', status: 'active', enabled: true, order: 3, color: '#F59E0B', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'queue-type-sales', code: 'sales', label: 'Sales', category: 'queue-types', systemCategory: 'queue', status: 'active', enabled: true, order: 4, color: '#8B5CF6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  { id: 'queue-status-active', code: 'active', label: 'Active', category: 'queue-statuses', systemCategory: 'queue', status: 'active', enabled: true, order: 1, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'queue-status-paused', code: 'paused', label: 'Paused', category: 'queue-statuses', systemCategory: 'queue', status: 'active', enabled: true, order: 2, color: '#F59E0B', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'queue-status-offline', code: 'offline', label: 'Offline', category: 'queue-statuses', systemCategory: 'queue', status: 'active', enabled: true, order: 3, color: '#EF4444', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  { id: 'queue-priority-low', code: 'low', label: 'Low', category: 'queue-priorities', systemCategory: 'queue', status: 'active', enabled: true, order: 1, color: '#06B6D4', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'queue-priority-medium', code: 'medium', label: 'Medium', category: 'queue-priorities', systemCategory: 'queue', status: 'active', enabled: true, order: 2, color: '#F59E0B', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'queue-priority-high', code: 'high', label: 'High', category: 'queue-priorities', systemCategory: 'queue', status: 'active', enabled: true, order: 3, color: '#EF4444', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  // Skill Configurations
  { id: 'skill-level-beginner', code: 'beginner', label: 'Beginner', description: '0-6 months', category: 'skill-levels', systemCategory: 'skill', status: 'active', enabled: true, order: 1, color: '#DBEAFE', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'skill-level-intermediate', code: 'intermediate', label: 'Intermediate', description: '6-18 months', category: 'skill-levels', systemCategory: 'skill', status: 'active', enabled: true, order: 2, color: '#BFDBFE', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'skill-level-advanced', code: 'advanced', label: 'Advanced', description: '18+ months', category: 'skill-levels', systemCategory: 'skill', status: 'active', enabled: true, order: 3, color: '#93C5FD', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'skill-level-expert', code: 'expert', label: 'Expert', description: '3+ years', category: 'skill-levels', systemCategory: 'skill', status: 'active', enabled: true, order: 4, color: '#60A5FA', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  { id: 'skill-category-technical', code: 'technical', label: 'Technical', category: 'skill-categories', systemCategory: 'skill', status: 'active', enabled: true, order: 1, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'skill-category-customer-service', code: 'customer-service', label: 'Customer Service', category: 'skill-categories', systemCategory: 'skill', status: 'active', enabled: true, order: 2, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'skill-category-language', code: 'language', label: 'Language', category: 'skill-categories', systemCategory: 'skill', status: 'active', enabled: true, order: 3, color: '#F59E0B', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  // Rule Configurations
  { id: 'rule-action-assign', code: 'assign', label: 'Assign', category: 'rule-actions', systemCategory: 'rule', status: 'active', enabled: true, order: 1, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'rule-action-escalate', code: 'escalate', label: 'Escalate', category: 'rule-actions', systemCategory: 'rule', status: 'active', enabled: true, order: 2, color: '#EF4444', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'rule-action-queue', code: 'queue', label: 'Send to Queue', category: 'rule-actions', systemCategory: 'rule', status: 'active', enabled: true, order: 3, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'rule-action-notify', code: 'notify', label: 'Notify', category: 'rule-actions', systemCategory: 'rule', status: 'active', enabled: true, order: 4, color: '#F59E0B', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  { id: 'rule-priority-1', code: 'p1', label: 'Priority 1', category: 'rule-priorities', systemCategory: 'rule', status: 'active', enabled: true, order: 1, color: '#EF4444', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'rule-priority-2', code: 'p2', label: 'Priority 2', category: 'rule-priorities', systemCategory: 'rule', status: 'active', enabled: true, order: 2, color: '#F59E0B', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'rule-priority-3', code: 'p3', label: 'Priority 3', category: 'rule-priorities', systemCategory: 'rule', status: 'active', enabled: true, order: 3, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  { id: 'condition-op-equals', code: 'equals', label: 'Equals', category: 'condition-operators', systemCategory: 'rule', status: 'active', enabled: true, order: 1, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'condition-op-contains', code: 'contains', label: 'Contains', category: 'condition-operators', systemCategory: 'rule', status: 'active', enabled: true, order: 2, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'condition-op-gt', code: 'gt', label: 'Greater Than', category: 'condition-operators', systemCategory: 'rule', status: 'active', enabled: true, order: 3, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'condition-op-lt', code: 'lt', label: 'Less Than', category: 'condition-operators', systemCategory: 'rule', status: 'active', enabled: true, order: 4, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  // Automation Configurations
  { id: 'automation-trigger-assign', code: 'on-assignment', label: 'On Assignment', category: 'automation-triggers', systemCategory: 'automation', status: 'active', enabled: true, order: 1, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'automation-trigger-status', code: 'on-status-change', label: 'On Status Change', category: 'automation-triggers', systemCategory: 'automation', status: 'active', enabled: true, order: 2, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'automation-trigger-sla', code: 'on-sla-risk', label: 'On SLA Risk', category: 'automation-triggers', systemCategory: 'automation', status: 'active', enabled: true, order: 3, color: '#EF4444', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  { id: 'automation-action-assign', code: 'assign-queue', label: 'Assign to Queue', category: 'automation-actions', systemCategory: 'automation', status: 'active', enabled: true, order: 1, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'automation-action-escalate', code: 'escalate', label: 'Escalate', category: 'automation-actions', systemCategory: 'automation', status: 'active', enabled: true, order: 2, color: '#EF4444', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'automation-action-email', code: 'send-email', label: 'Send Email', category: 'automation-actions', systemCategory: 'automation', status: 'active', enabled: true, order: 3, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },

  // System Configurations
  { id: 'dept-support', code: 'support', label: 'Support', category: 'departments', systemCategory: 'system', status: 'active', enabled: true, order: 1, color: '#3B82F6', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'dept-sales', code: 'sales', label: 'Sales', category: 'departments', systemCategory: 'system', status: 'active', enabled: true, order: 2, color: '#10B981', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
  { id: 'dept-operations', code: 'operations', label: 'Operations', category: 'departments', systemCategory: 'system', status: 'active', enabled: true, order: 3, color: '#F59E0B', metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
]

// Audit log storage
export const CONFIGURATION_AUDIT_LOG: ConfigurationAuditLog[] = []

// Registry query functions
export function getConfigurationsByCategory(category: string): ConfigurationValue[] {
  return CONFIGURATION_REGISTRY.filter(c => c.category === category && c.status === 'active' && c.enabled)
}

export function getConfigurationsBySystemCategory(systemCategory: 'queue' | 'skill' | 'rule' | 'automation' | 'system'): ConfigurationValue[] {
  return CONFIGURATION_REGISTRY.filter(c => c.systemCategory === systemCategory && c.status === 'active' && c.enabled)
}

export function getConfigurationValue(id: string): ConfigurationValue | undefined {
  return CONFIGURATION_REGISTRY.find(c => c.id === id)
}

export function getConfigurationsByIds(ids: string[]): ConfigurationValue[] {
  return CONFIGURATION_REGISTRY.filter(c => ids.includes(c.id))
}

export function createConfigurationValue(data: Partial<ConfigurationValue>): ConfigurationValue {
  const newValue: ConfigurationValue = {
    id: `config-${Date.now()}`,
    code: data.code || '',
    label: data.label || '',
    description: data.description,
    color: data.color,
    icon: data.icon,
    category: data.category || '',
    systemCategory: data.systemCategory || 'system',
    status: 'draft',
    enabled: true,
    order: data.order || CONFIGURATION_REGISTRY.filter(c => c.category === data.category).length + 1,
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  }

  CONFIGURATION_REGISTRY.push(newValue)

  // Notify listeners of registry change
  registryChangeListeners.forEach(listener => listener('create', newValue))

  // Log audit event
  logAuditEvent({
    eventType: 'config_created',
    module: 'configuration',
    action: 'create',
    entityId: newValue.id,
    entityType: 'ConfigurationValue',
    entityName: newValue.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: newValue,
    source: 'ui',
  })

  return newValue
}

export function updateConfigurationValue(id: string, updates: Partial<ConfigurationValue>): ConfigurationValue | null {
  const value = getConfigurationValue(id)
  if (!value) return null

  const beforeState = JSON.parse(JSON.stringify(value))

  Object.assign(value, updates)
  value.metadata.updatedAt = new Date().toISOString()
  value.metadata.updatedBy = 'current-user'
  value.metadata.version += 1

  // Notify listeners of registry change
  registryChangeListeners.forEach(listener => listener('update', value))

  // Log audit event
  logAuditEvent({
    eventType: 'config_updated',
    module: 'configuration',
    action: 'update',
    entityId: value.id,
    entityType: 'ConfigurationValue',
    entityName: value.label,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: value,
    source: 'ui',
  })

  return value
}

export function deleteConfigurationValue(id: string): boolean {
  const value = getConfigurationValue(id)
  const index = CONFIGURATION_REGISTRY.findIndex(c => c.id === id)
  if (index > -1) {
    CONFIGURATION_REGISTRY.splice(index, 1)

    // Notify listeners of registry change
    if (value) {
      registryChangeListeners.forEach(listener => listener('delete', value))
    }

    // Log audit event
    if (value) {
      logAuditEvent({
        eventType: 'config_deleted',
        module: 'configuration',
        action: 'delete',
        entityId: value.id,
        entityType: 'ConfigurationValue',
        entityName: value.label,
        userId: 'current-user',
        userName: 'Current User',
        userRole: 'manager',
        beforeState: value,
        source: 'ui',
      })
    }

    return true
  }
  return false
}

export function publishConfigurationValue(id: string): ConfigurationValue | null {
  const value = getConfigurationValue(id)
  if (!value) return null

  return updateConfigurationValue(id, { status: 'active', enabled: true })
}

export function archiveConfigurationValue(id: string): ConfigurationValue | null {
  const value = getConfigurationValue(id)
  if (!value) return null

  return updateConfigurationValue(id, { status: 'archived', enabled: false })
}

// Audit logging
export function addAuditLog(entry: Omit<ConfigurationAuditLog, 'id'>): ConfigurationAuditLog {
  const auditEntry: ConfigurationAuditLog = {
    id: `audit-${Date.now()}`,
    ...entry,
  }
  CONFIGURATION_AUDIT_LOG.push(auditEntry)
  return auditEntry
}

export function getAuditLog(limit: number = 100): ConfigurationAuditLog[] {
  return CONFIGURATION_AUDIT_LOG.slice(-limit).reverse()
}

export function getConfigurationSections(): ConfigurationSection[] {
  return [
    {
      id: 'queue-section',
      title: 'Queue Configuration',
      description: 'Manage queue types, statuses, and priorities',
      systemCategory: 'queue',
      icon: 'Layers',
      color: '#3B82F6',
      subsections: [
        {
          id: 'queue-types',
          name: 'Queue Types',
          description: 'Define types of queues in your system',
          values: getConfigurationsByCategory('queue-types'),
          allowCustom: false,
          allowHierarchy: true,
        },
        {
          id: 'queue-statuses',
          name: 'Queue Statuses',
          description: 'Queue operational statuses',
          values: getConfigurationsByCategory('queue-statuses'),
          allowCustom: false,
          allowHierarchy: false,
        },
        {
          id: 'queue-priorities',
          name: 'Queue Priorities',
          description: 'Priority levels for queues',
          values: getConfigurationsByCategory('queue-priorities'),
          allowCustom: false,
          allowHierarchy: false,
        },
      ],
    },
    {
      id: 'skill-section',
      title: 'Skill Configuration',
      description: 'Manage skill levels and categories',
      systemCategory: 'skill',
      icon: 'Target',
      color: '#10B981',
      subsections: [
        {
          id: 'skill-levels',
          name: 'Skill Levels',
          description: 'Define proficiency levels',
          values: getConfigurationsByCategory('skill-levels'),
          allowCustom: false,
          allowHierarchy: false,
        },
        {
          id: 'skill-categories',
          name: 'Skill Categories',
          description: 'Classify skills by category',
          values: getConfigurationsByCategory('skill-categories'),
          allowCustom: true,
          allowHierarchy: true,
        },
      ],
    },
    {
      id: 'rule-section',
      title: 'Rule Configuration',
      description: 'Manage rule actions, priorities, and conditions',
      systemCategory: 'rule',
      icon: 'Zap',
      color: '#EF4444',
      subsections: [
        {
          id: 'rule-actions',
          name: 'Rule Actions',
          description: 'Available actions for rules',
          values: getConfigurationsByCategory('rule-actions'),
          allowCustom: true,
          allowHierarchy: false,
        },
        {
          id: 'rule-priorities',
          name: 'Rule Priorities',
          description: 'Rule execution priorities',
          values: getConfigurationsByCategory('rule-priorities'),
          allowCustom: false,
          allowHierarchy: false,
        },
        {
          id: 'condition-operators',
          name: 'Condition Operators',
          description: 'Available condition operators',
          values: getConfigurationsByCategory('condition-operators'),
          allowCustom: false,
          allowHierarchy: false,
        },
      ],
    },
    {
      id: 'automation-section',
      title: 'Automation Configuration',
      description: 'Manage automation triggers and actions',
      systemCategory: 'automation',
      icon: 'Clock',
      color: '#8B5CF6',
      subsections: [
        {
          id: 'automation-triggers',
          name: 'Automation Triggers',
          description: 'Events that trigger automations',
          values: getConfigurationsByCategory('automation-triggers'),
          allowCustom: true,
          allowHierarchy: false,
        },
        {
          id: 'automation-actions',
          name: 'Automation Actions',
          description: 'Actions that automations can perform',
          values: getConfigurationsByCategory('automation-actions'),
          allowCustom: true,
          allowHierarchy: false,
        },
      ],
    },
    {
      id: 'system-section',
      title: 'System Configuration',
      description: 'Manage departments, groups, and locations',
      systemCategory: 'system',
      icon: 'Settings',
      color: '#6B7280',
      subsections: [
        {
          id: 'departments',
          name: 'Departments',
          description: 'Organizational departments',
          values: getConfigurationsByCategory('departments'),
          allowCustom: true,
          allowHierarchy: true,
        },
      ],
    },
  ]
}

// Validation Functions
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateConfigurationValue(data: Partial<ConfigurationValue>): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!data.code || data.code.trim() === '') {
    errors.push('Code is required')
  }

  if (!data.label || data.label.trim() === '') {
    errors.push('Label is required')
  }

  if (data.code && !/^[a-z0-9-]+$/.test(data.code)) {
    errors.push('Code must be lowercase alphanumeric with hyphens only')
  }

  if (data.category && !CONFIGURATION_REGISTRY.some(c => c.category === data.category)) {
    warnings.push(`Category "${data.category}" does not exist yet`)
  }

  // Check for duplicate codes within the same category
  if (data.code && data.category) {
    const duplicates = CONFIGURATION_REGISTRY.filter(
      c => c.code === data.code && c.category === data.category && c.id !== data.id
    )
    if (duplicates.length > 0) {
      errors.push(`Code "${data.code}" already exists in category "${data.category}"`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

export function cloneConfigurationValue(sourceId: string, overrides?: Partial<ConfigurationValue>): ConfigurationValue | null {
  const source = getConfigurationValue(sourceId)
  if (!source) return null

  const cloned = createConfigurationValue({
    ...source,
    code: overrides?.code || `${source.code}-copy`,
    label: overrides?.label || `${source.label} (Copy)`,
    status: 'draft',
    ...overrides,
  })

  return cloned
}

// Dependency Checking
export interface DependencyInfo {
  id: string
  label: string
  usageCount: number
  usedIn: Array<{
    system: string
    itemId: string
    itemName: string
  }>
}

export function checkDependencies(valueId: string): DependencyInfo | null {
  const value = getConfigurationValue(valueId)
  if (!value) return null

  return {
    id: value.id,
    label: value.label,
    usageCount: value.dependencies?.usedIn?.length || 0,
    usedIn: value.dependencies?.usedIn || [],
  }
}

export function canDeleteValue(valueId: string): { canDelete: boolean; reason?: string } {
  const dependencies = checkDependencies(valueId)
  if (!dependencies) return { canDelete: false, reason: 'Value not found' }

  if (dependencies.usageCount > 0) {
    return {
      canDelete: false,
      reason: `This value is used in ${dependencies.usageCount} items. Remove all references before deleting.`,
    }
  }

  return { canDelete: true }
}

// Ordering and Reordering
export function reorderConfigurationValues(categoryName: string, orderedIds: string[]): boolean {
  const values = getConfigurationsByCategory(categoryName)
  
  orderedIds.forEach((id, index) => {
    const value = values.find(v => v.id === id)
    if (value) {
      value.order = index + 1
    }
  })

  return true
}

// Bulk Operations
export function bulkUpdateStatus(
  valueIds: string[],
  newStatus: 'active' | 'draft' | 'disabled' | 'archived'
): { successful: number; failed: number } {
  let successful = 0
  let failed = 0

  valueIds.forEach(id => {
    const result = updateConfigurationValue(id, { status: newStatus })
    if (result) successful++
    else failed++
  })

  return { successful, failed }
}

// Export/Import
export function exportConfigurations(systemCategory?: 'queue' | 'skill' | 'rule' | 'automation' | 'system'): string {
  const toExport = systemCategory
    ? getConfigurationsBySystemCategory(systemCategory)
    : CONFIGURATION_REGISTRY

  return JSON.stringify(toExport, null, 2)
}

export function importConfigurations(jsonString: string): { success: boolean; count: number; errors: string[] } {
  const errors: string[] = []
  let count = 0

  try {
    const data = JSON.parse(jsonString)
    const values = Array.isArray(data) ? data : [data]

    values.forEach(value => {
      const validation = validateConfigurationValue(value)
      if (validation.isValid) {
        CONFIGURATION_REGISTRY.push(value)
        count++
      } else {
        errors.push(`Failed to import "${value.label}": ${validation.errors.join(', ')}`)
      }
    })

    return { success: errors.length === 0, count, errors }
  } catch (error) {
    return { success: false, count: 0, errors: [`Invalid JSON: ${error}`] }
  }
}

// Statistics
export interface ConfigurationStatistics {
  totalConfigurations: number
  byStatus: Record<string, number>
  byCategory: Record<string, number>
  bySystemCategory: Record<string, number>
}

export function getStatistics(): ConfigurationStatistics {
  const stats: ConfigurationStatistics = {
    totalConfigurations: CONFIGURATION_REGISTRY.length,
    byStatus: {},
    byCategory: {},
    bySystemCategory: {},
  }

  CONFIGURATION_REGISTRY.forEach(config => {
    stats.byStatus[config.status] = (stats.byStatus[config.status] || 0) + 1
    stats.byCategory[config.category] = (stats.byCategory[config.category] || 0) + 1
    stats.bySystemCategory[config.systemCategory] = (stats.bySystemCategory[config.systemCategory] || 0) + 1
  })

  return stats
}
