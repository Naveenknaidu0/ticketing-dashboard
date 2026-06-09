// Masters Engine - Enterprise Configuration Layer
// Single source of truth for all Assignment Engine configuration
// Feature parity with Queue, Rules, and Automation engines

export interface MasterFieldDefinition {
  id: string
  name: string
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'email' | 'phone' | 'url' | 'textarea' | 'color' | 'file' | 'json'
  required: boolean
  validation?: {
    minLength?: number
    maxLength?: number
    pattern?: string
    min?: number
    max?: number
  }
  options?: Array<{ id: string; label: string }>
  defaultValue?: any
  description?: string
}

export interface MasterValue {
  id: string
  categoryId: string
  name: string
  code: string
  description?: string
  color?: string
  icon?: string
  status: 'active' | 'draft' | 'disabled' | 'archived'
  enabled: boolean
  customFields?: Record<string, any>
  parentValueId?: string
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    version: number
  }
  dependencies?: {
    usedInQueues?: string[]
    usedInSkills?: string[]
    usedInRules?: string[]
    usedInAutomations?: string[]
    usedInReports?: string[]
    totalUsageCount?: number
  }
}

export interface MasterValueVersion {
  version: number
  versionLabel: string
  createdAt: string
  createdBy: string
  changeType: 'created' | 'modified' | 'published' | 'disabled' | 'archived' | 'restored'
  changeDescription: string
  previousValue?: MasterValue
  currentValue: MasterValue
}

export interface MasterAuditLogEntry {
  id: string
  timestamp: string
  userId: string
  userName: string
  action: 'create' | 'update' | 'delete' | 'publish' | 'disable' | 'archive' | 'restore' | 'clone'
  targetValueId: string
  targetValueName: string
  changes?: Record<string, { from: any; to: any }>
  ipAddress?: string
  userAgent?: string
  status: 'success' | 'failed'
  errorMessage?: string
}

export interface MasterCategory {
  id: string
  name: string
  description: string
  icon?: string
  color: string
  order: number
  enabled: boolean
  type: 'predefined' | 'custom'
  parentCategoryId?: string
}

export interface MasterCategoryComplete {
  id: string
  name: string
  description: string
  parentCategoryId?: string
  type: 'predefined' | 'custom'
  fieldDefinitions: MasterFieldDefinition[]
  allowCustomValues: boolean
  allowHierarchy: boolean
  values: MasterValue[]
  totalDependencies: number
  versionHistory: MasterValueVersion[]
  auditLog: MasterAuditLogEntry[]
  stats: {
    totalValues: number
    activeValues: number
    draftValues: number
    disabledValues: number
    archivedValues: number
  }
  lastModified: string
  lastModifiedBy: string
}

export const MASTER_CATEGORIES: MasterCategory[] = [
  // Queue Management (5)
  { id: 'queue-types', name: 'Queue Types', description: 'Define queue types and categories', color: '#3B82F6', order: 1, enabled: true, type: 'predefined' },
  { id: 'queue-statuses', name: 'Queue Statuses', description: 'Queue operational statuses', color: '#06B6D4', order: 2, enabled: true, type: 'predefined' },
  { id: 'queue-priorities', name: 'Queue Priorities', description: 'Priority levels for queues', color: '#F59E0B', order: 3, enabled: true, type: 'predefined' },
  { id: 'queue-categories', name: 'Queue Categories', description: 'Business categories for queues', color: '#8B5CF6', order: 4, enabled: true, type: 'predefined' },
  { id: 'business-hours', name: 'Business Hours', description: 'Operating hours configuration', color: '#EC4899', order: 5, enabled: true, type: 'predefined' },

  // Skill Management (4)
  { id: 'skill-categories', name: 'Skill Categories', description: 'Classification of skills', color: '#10B981', order: 6, enabled: true, type: 'predefined' },
  { id: 'skill-levels', name: 'Skill Levels', description: 'Proficiency levels for skills', color: '#14B8A6', order: 7, enabled: true, type: 'predefined' },
  { id: 'certifications', name: 'Certifications', description: 'Required certifications', color: '#06B6D4', order: 8, enabled: true, type: 'predefined' },
  { id: 'skill-statuses', name: 'Skill Statuses', description: 'Skill availability statuses', color: '#F59E0B', order: 9, enabled: true, type: 'predefined' },

  // Rule Management (4)
  { id: 'rule-categories', name: 'Rule Categories', description: 'Rule classification', color: '#DC2626', order: 10, enabled: true, type: 'predefined' },
  { id: 'condition-operators', name: 'Condition Operators', description: 'Available condition operators', color: '#EF4444', order: 11, enabled: true, type: 'predefined' },
  { id: 'rule-actions', name: 'Rule Actions', description: 'Available rule actions', color: '#F87171', order: 12, enabled: true, type: 'predefined' },
  { id: 'rule-priorities', name: 'Rule Priorities', description: 'Rule execution priorities', color: '#FCA5A5', order: 13, enabled: true, type: 'predefined' },

  // Automation Management (3)
  { id: 'automation-categories', name: 'Automation Categories', description: 'Automation classification', color: '#8B5CF6', order: 14, enabled: true, type: 'predefined' },
  { id: 'automation-triggers', name: 'Automation Triggers', description: 'Available automation triggers', color: '#A78BFA', order: 15, enabled: true, type: 'predefined' },
  { id: 'automation-actions', name: 'Automation Actions', description: 'Available automation actions', color: '#C4B5FD', order: 16, enabled: true, type: 'predefined' },

  // System Management (5)
  { id: 'departments', name: 'Departments', description: 'Organizational departments', color: '#059669', order: 17, enabled: true, type: 'predefined' },
  { id: 'groups', name: 'Agent Groups', description: 'Team groupings', color: '#10B981', order: 18, enabled: true, type: 'predefined' },
  { id: 'locations', name: 'Locations', description: 'Office locations', color: '#34D399', order: 19, enabled: true, type: 'predefined' },
  { id: 'business-units', name: 'Business Units', description: 'Organizational units', color: '#6EE7B7', order: 20, enabled: true, type: 'predefined' },
  { id: 'tags', name: 'Global Tags', description: 'Reusable tags system-wide', color: '#A7F3D0', order: 21, enabled: true, type: 'predefined' },
]

// Default master data with real values and dependencies
export const DEFAULT_MASTERS_DATA: Record<string, MasterCategoryComplete> = {
  'queue-types': {
    id: 'queue-types',
    name: 'Queue Types',
    description: 'Define queue types and categories',
    type: 'predefined',
    fieldDefinitions: [
      { id: 'name', name: 'Queue Type Name', type: 'text', required: true, description: 'Display name for the queue type' },
      { id: 'code', name: 'Code', type: 'text', required: true, description: 'System code identifier' },
      { id: 'icon', name: 'Icon', type: 'select', required: false, options: [{ id: 'phone', label: 'Phone' }, { id: 'email', label: 'Email' }, { id: 'chat', label: 'Chat' }] },
    ],
    allowCustomValues: false,
    allowHierarchy: true,
    values: [
      { id: 'queue-type-1', categoryId: 'queue-types', name: 'Support', code: 'support', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 1 } },
      { id: 'queue-type-2', categoryId: 'queue-types', name: 'Billing', code: 'billing', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 1 } },
      { id: 'queue-type-3', categoryId: 'queue-types', name: 'Technical', code: 'technical', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 1 } },
    ],
    totalDependencies: 3,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'queue-statuses': {
    id: 'queue-statuses',
    name: 'Queue Statuses',
    description: 'Queue operational statuses',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: false,
    allowHierarchy: false,
    values: [
      { id: 'status-active', categoryId: 'queue-statuses', name: 'Active', code: 'active', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'status-paused', categoryId: 'queue-statuses', name: 'Paused', code: 'paused', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'status-offline', categoryId: 'queue-statuses', name: 'Offline', code: 'offline', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'queue-priorities': {
    id: 'queue-priorities',
    name: 'Queue Priorities',
    description: 'Priority levels for queues',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: false,
    allowHierarchy: false,
    values: [
      { id: 'priority-low', categoryId: 'queue-priorities', name: 'Low', code: 'low', color: '#06B6D4', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'priority-medium', categoryId: 'queue-priorities', name: 'Medium', code: 'medium', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'priority-high', categoryId: 'queue-priorities', name: 'High', code: 'high', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'queue-categories': {
    id: 'queue-categories',
    name: 'Queue Categories',
    description: 'Business categories for queues',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: true,
    values: [
      { id: 'qcat-support', categoryId: 'queue-categories', name: 'Customer Support', code: 'customer-support', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'qcat-sales', categoryId: 'queue-categories', name: 'Sales', code: 'sales', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'business-hours': {
    id: 'business-hours',
    name: 'Business Hours',
    description: 'Operating hours configuration',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [
      { id: 'bhours-standard', categoryId: 'business-hours', name: 'Standard Hours', code: 'standard', description: '9 AM - 6 PM, Monday - Friday', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'bhours-24h', categoryId: 'business-hours', name: '24/7 Hours', code: '24-7', description: 'Round the clock operations', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'skill-categories': {
    id: 'skill-categories',
    name: 'Skill Categories',
    description: 'Classification of skills',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: true,
    values: [
      { id: 'scat-technical', categoryId: 'skill-categories', name: 'Technical', code: 'technical', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'scat-customer-service', categoryId: 'skill-categories', name: 'Customer Service', code: 'customer-service', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'scat-product', categoryId: 'skill-categories', name: 'Product Knowledge', code: 'product', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'skill-levels': {
    id: 'skill-levels',
    name: 'Skill Levels',
    description: 'Proficiency levels for skills',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: false,
    allowHierarchy: false,
    values: [
      { id: 'level-1', categoryId: 'skill-levels', name: 'Beginner', code: 'beginner', description: 'Entry level - 0-6 months', color: '#EBF8FF', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 2 } },
      { id: 'level-2', categoryId: 'skill-levels', name: 'Intermediate', code: 'intermediate', description: 'Mid level - 6-18 months', color: '#DBEAFE', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 2 } },
      { id: 'level-3', categoryId: 'skill-levels', name: 'Advanced', code: 'advanced', description: 'Senior level - 18+ months', color: '#BFDBFE', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 1 } },
      { id: 'level-4', categoryId: 'skill-levels', name: 'Expert', code: 'expert', description: 'Expert level - 3+ years', color: '#93C5FD', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 1 } },
    ],
    totalDependencies: 6,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 4, activeValues: 4, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'certifications': {
    id: 'certifications',
    name: 'Certifications',
    description: 'Required certifications',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [
      { id: 'cert-csp', categoryId: 'certifications', name: 'Customer Support Professional', code: 'csp', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'cert-asa', categoryId: 'certifications', name: 'Advanced Support Associate', code: 'asa', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'skill-statuses': {
    id: 'skill-statuses',
    name: 'Skill Statuses',
    description: 'Skill availability statuses',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: false,
    allowHierarchy: false,
    values: [
      { id: 'skill-status-active', categoryId: 'skill-statuses', name: 'Active', code: 'active', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'skill-status-inactive', categoryId: 'skill-statuses', name: 'Inactive', code: 'inactive', color: '#9CA3AF', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'rule-categories': {
    id: 'rule-categories',
    name: 'Rule Categories',
    description: 'Rule classification',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: true,
    values: [
      { id: 'rcat-assignment', categoryId: 'rule-categories', name: 'Assignment', code: 'assignment', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'rcat-escalation', categoryId: 'rule-categories', name: 'Escalation', code: 'escalation', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'rcat-sla', categoryId: 'rule-categories', name: 'SLA', code: 'sla', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'condition-operators': {
    id: 'condition-operators',
    name: 'Condition Operators',
    description: 'Available condition operators',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: false,
    allowHierarchy: false,
    values: [
      { id: 'op-equals', categoryId: 'condition-operators', name: 'Equals', code: 'equals', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'op-contains', categoryId: 'condition-operators', name: 'Contains', code: 'contains', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'op-gt', categoryId: 'condition-operators', name: 'Greater Than', code: 'gt', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'rule-actions': {
    id: 'rule-actions',
    name: 'Rule Actions',
    description: 'Available rule actions',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [
      { id: 'raction-assign', categoryId: 'rule-actions', name: 'Assign', code: 'assign', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'raction-escalate', categoryId: 'rule-actions', name: 'Escalate', code: 'escalate', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'raction-notify', categoryId: 'rule-actions', name: 'Notify', code: 'notify', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'rule-priorities': {
    id: 'rule-priorities',
    name: 'Rule Priorities',
    description: 'Rule execution priorities',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: false,
    allowHierarchy: false,
    values: [
      { id: 'rpri-1', categoryId: 'rule-priorities', name: 'Priority 1', code: 'p1', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'rpri-2', categoryId: 'rule-priorities', name: 'Priority 2', code: 'p2', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'rpri-3', categoryId: 'rule-priorities', name: 'Priority 3', code: 'p3', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'automation-categories': {
    id: 'automation-categories',
    name: 'Automation Categories',
    description: 'Automation classification',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: true,
    values: [
      { id: 'acat-ticket', categoryId: 'automation-categories', name: 'Ticket Management', code: 'ticket', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'acat-notification', categoryId: 'automation-categories', name: 'Notifications', code: 'notification', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'automation-triggers': {
    id: 'automation-triggers',
    name: 'Automation Triggers',
    description: 'Available automation triggers',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [
      { id: 'atrigger-assign', categoryId: 'automation-triggers', name: 'On Assignment', code: 'on-assignment', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'atrigger-status', categoryId: 'automation-triggers', name: 'On Status Change', code: 'on-status-change', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'atrigger-sla', categoryId: 'automation-triggers', name: 'On SLA Risk', code: 'on-sla-risk', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'automation-actions': {
    id: 'automation-actions',
    name: 'Automation Actions',
    description: 'Available automation actions',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [
      { id: 'aaction-assign', categoryId: 'automation-actions', name: 'Assign to Queue', code: 'assign-to-queue', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'aaction-escalate', categoryId: 'automation-actions', name: 'Escalate', code: 'escalate', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'aaction-send-email', categoryId: 'automation-actions', name: 'Send Email', code: 'send-email', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'departments': {
    id: 'departments',
    name: 'Departments',
    description: 'Organizational departments',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: true,
    values: [
      { id: 'dept-1', categoryId: 'departments', name: 'Support', code: 'support', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'dept-2', categoryId: 'departments', name: 'Sales', code: 'sales', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'dept-3', categoryId: 'departments', name: 'Operations', code: 'operations', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'groups': {
    id: 'groups',
    name: 'Agent Groups',
    description: 'Team groupings',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: true,
    values: [
      { id: 'group-tier1', categoryId: 'groups', name: 'Tier 1 Support', code: 'tier-1', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'group-tier2', categoryId: 'groups', name: 'Tier 2 Support', code: 'tier-2', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'locations': {
    id: 'locations',
    name: 'Locations',
    description: 'Office locations',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [
      { id: 'loc-hq', categoryId: 'locations', name: 'Headquarters', code: 'hq', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'loc-branch', categoryId: 'locations', name: 'Branch Office', code: 'branch', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'business-units': {
    id: 'business-units',
    name: 'Business Units',
    description: 'Organizational units',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: true,
    values: [
      { id: 'bu-us', categoryId: 'business-units', name: 'US Operations', code: 'us-ops', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'bu-emea', categoryId: 'business-units', name: 'EMEA Operations', code: 'emea-ops', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 2, activeValues: 2, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
  'tags': {
    id: 'tags',
    name: 'Global Tags',
    description: 'Reusable tags system-wide',
    type: 'predefined',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [
      { id: 'tag-urgent', categoryId: 'tags', name: 'Urgent', code: 'urgent', color: '#EF4444', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'tag-vip', categoryId: 'tags', name: 'VIP', code: 'vip', color: '#F59E0B', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
      { id: 'tag-internal', categoryId: 'tags', name: 'Internal', code: 'internal', color: '#6B7280', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 }, dependencies: { totalUsageCount: 0 } },
    ],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: { totalValues: 3, activeValues: 3, draftValues: 0, disabledValues: 0, archivedValues: 0 },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'admin',
  },
}

// Utility functions
export function findMasterCategory(categoryId: string): MasterCategory | undefined {
  return MASTER_CATEGORIES.find(c => c.id === categoryId)
}

export function getMasterCategoryConfig(categoryId: string): MasterCategoryComplete {
  return DEFAULT_MASTERS_DATA[categoryId] || {
    id: categoryId,
    name: 'Unknown',
    description: '',
    type: 'custom',
    fieldDefinitions: [],
    allowCustomValues: true,
    allowHierarchy: false,
    values: [],
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: {
      totalValues: 0,
      activeValues: 0,
      draftValues: 0,
      disabledValues: 0,
      archivedValues: 0,
    },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'system',
  }
}

export function getDependencyCount(valueId: string): number {
  let count = 0
  Object.values(DEFAULT_MASTERS_DATA).forEach(category => {
    category.values.forEach(value => {
      if (value.id === valueId && value.dependencies) {
        count = value.dependencies.totalUsageCount || 0
      }
    })
  })
  return count
}

export function canDeleteMasterValue(categoryId: string, valueId: string): { canDelete: boolean; reason?: string } {
  const config = getMasterCategoryConfig(categoryId)
  const value = config.values.find(v => v.id === valueId)
  
  if (!value) {
    return { canDelete: false, reason: 'Value not found' }
  }

  const dependencyCount = value.dependencies?.totalUsageCount || 0
  if (dependencyCount > 0) {
    return { canDelete: false, reason: `This value is used in ${dependencyCount} other locations` }
  }

  return { canDelete: true }
}

export function exportMasters(): string {
  return JSON.stringify(DEFAULT_MASTERS_DATA, null, 2)
}

export function createMasterValue(categoryId: string, data: Partial<MasterValue>): MasterValue {
  return {
    id: `master-${Date.now()}`,
    categoryId,
    name: data.name || 'New Value',
    code: data.code || data.name?.toLowerCase().replace(/\s+/g, '-') || 'new-value',
    description: data.description,
    color: data.color || '#6B7280',
    status: 'draft',
    enabled: true,
    customFields: data.customFields,
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
      version: 1,
    },
    dependencies: {
      totalUsageCount: 0,
    },
  }
}

export function cloneMasterValue(sourceValue: MasterValue, categoryId: string): MasterValue {
  const cloned = createMasterValue(categoryId, {
    name: `${sourceValue.name} (Copy)`,
    code: `${sourceValue.code}-copy`,
    description: sourceValue.description,
    color: sourceValue.color,
  })
  return cloned
}

// Advanced Masters Management Functions

export interface MasterCategoryTemplate {
  id: string
  name: string
  description: string
  baseCategory: MasterCategory
  defaultValues: MasterValue[]
  defaultFieldDefinitions: MasterFieldDefinition[]
  metadata: {
    createdBy: string
    createdAt: string
    usageCount: number
  }
}

export interface MasterValueRelationship {
  id: string
  sourceValueId: string
  targetValueId: string
  relationshipType: 'parent' | 'related' | 'duplicate' | 'supersedes'
  metadata?: Record<string, any>
  createdAt: string
  createdBy: string
}

export interface MasterRegistryEntry {
  categoryId: string
  registeredIn: Array<{
    system: 'queues' | 'skills' | 'rules' | 'automations' | 'reports' | 'dashboard' | 'workload' | 'sla'
    field: string
    isRequired: boolean
    lastSync: string
  }>
  totalReferences: number
  lastUpdated: string
}

// Store for dynamic categories created by managers
export let CUSTOM_MASTER_CATEGORIES: MasterCategory[] = []
export let MASTER_REGISTRY: Map<string, MasterRegistryEntry> = new Map()

// Category Creation and Management
export function createMasterCategory(data: {
  name: string
  description: string
  color: string
  allowCustomValues: boolean
  allowHierarchy: boolean
  fieldDefinitions?: MasterFieldDefinition[]
  initialValues?: Partial<MasterValue>[]
}): MasterCategory {
  const newCategory: MasterCategory = {
    id: `master-cat-${Date.now()}`,
    name: data.name,
    description: data.description,
    color: data.color,
    order: MASTER_CATEGORIES.length + CUSTOM_MASTER_CATEGORIES.length + 1,
    enabled: true,
    type: 'custom',
  }

  CUSTOM_MASTER_CATEGORIES.push(newCategory)

  // Initialize category in data store
  const categoryComplete: MasterCategoryComplete = {
    id: newCategory.id,
    name: newCategory.name,
    description: newCategory.description,
    type: 'custom',
    fieldDefinitions: data.fieldDefinitions || [],
    allowCustomValues: data.allowCustomValues,
    allowHierarchy: data.allowHierarchy,
    values: (data.initialValues || []).map(v => createMasterValue(newCategory.id, v)),
    totalDependencies: 0,
    versionHistory: [],
    auditLog: [],
    stats: {
      totalValues: data.initialValues?.length || 0,
      activeValues: data.initialValues?.filter(v => v.status !== 'draft').length || 0,
      draftValues: data.initialValues?.filter(v => v.status === 'draft').length || 0,
      disabledValues: 0,
      archivedValues: 0,
    },
    lastModified: new Date().toISOString(),
    lastModifiedBy: 'manager',
  }

  DEFAULT_MASTERS_DATA[newCategory.id] = categoryComplete

  // Register in dynamic registry
  MASTER_REGISTRY.set(newCategory.id, {
    categoryId: newCategory.id,
    registeredIn: [],
    totalReferences: 0,
    lastUpdated: new Date().toISOString(),
  })

  return newCategory
}

export function updateMasterCategory(categoryId: string, updates: Partial<MasterCategory>): MasterCategory | null {
  let updated = MASTER_CATEGORIES.find(c => c.id === categoryId)
  if (!updated) {
    updated = CUSTOM_MASTER_CATEGORIES.find(c => c.id === categoryId)
  }
  if (!updated) return null

  Object.assign(updated, updates)
  return updated
}

export function deleteMasterCategory(categoryId: string): { success: boolean; reason?: string } {
  const registry = MASTER_REGISTRY.get(categoryId)
  if (registry && registry.totalReferences > 0) {
    return { success: false, reason: `Category is referenced in ${registry.totalReferences} locations` }
  }

  const customIndex = CUSTOM_MASTER_CATEGORIES.findIndex(c => c.id === categoryId)
  if (customIndex > -1) {
    CUSTOM_MASTER_CATEGORIES.splice(customIndex, 1)
  }

  delete DEFAULT_MASTERS_DATA[categoryId]
  MASTER_REGISTRY.delete(categoryId)

  return { success: true }
}

export function getAllMasterCategories(): MasterCategory[] {
  return [...MASTER_CATEGORIES, ...CUSTOM_MASTER_CATEGORIES]
}

// Value Management with Full Audit Trail
export function updateMasterValue(categoryId: string, valueId: string, updates: Partial<MasterValue>): MasterValue | null {
  const config = getMasterCategoryConfig(categoryId)
  const value = config.values.find(v => v.id === valueId)

  if (!value) return null

  // Record change in audit log
  const auditEntry: MasterAuditLogEntry = {
    id: `audit-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: 'current-user',
    userName: 'Current User',
    action: 'update',
    targetValueId: valueId,
    targetValueName: value.name,
    changes: {},
    status: 'success',
  }

  // Track changes
  Object.keys(updates).forEach(key => {
    if (key !== 'metadata' && value[key as keyof MasterValue] !== updates[key as keyof MasterValue]) {
      auditEntry.changes![key] = {
        from: value[key as keyof MasterValue],
        to: updates[key as keyof MasterValue],
      }
    }
  })

  config.auditLog.push(auditEntry)

  // Update the value
  Object.assign(value, updates)
  value.metadata.updatedAt = new Date().toISOString()
  value.metadata.updatedBy = 'current-user'
  value.metadata.version += 1

  // Record version history
  config.versionHistory.push({
    version: value.metadata.version,
    versionLabel: `Version ${value.metadata.version}`,
    createdAt: new Date().toISOString(),
    createdBy: 'current-user',
    changeType: 'modified',
    changeDescription: `Updated ${Object.keys(auditEntry.changes || {}).join(', ')}`,
    currentValue: value,
  })

  return value
}

export function archiveMasterValue(categoryId: string, valueId: string): MasterValue | null {
  const config = getMasterCategoryConfig(categoryId)
  const value = config.values.find(v => v.id === valueId)

  if (!value) return null

  return updateMasterValue(categoryId, valueId, { status: 'archived', enabled: false })
}

export function publishMasterValue(categoryId: string, valueId: string): MasterValue | null {
  const config = getMasterCategoryConfig(categoryId)
  const value = config.values.find(v => v.id === valueId)

  if (!value) return null

  if (value.status !== 'draft') {
    return value
  }

  return updateMasterValue(categoryId, valueId, { status: 'active', enabled: true })
}

// Relationship Management
export function createMasterValueRelationship(
  sourceValueId: string,
  targetValueId: string,
  relationshipType: 'parent' | 'related' | 'duplicate' | 'supersedes'
): MasterValueRelationship {
  return {
    id: `rel-${Date.now()}`,
    sourceValueId,
    targetValueId,
    relationshipType,
    createdAt: new Date().toISOString(),
    createdBy: 'current-user',
  }
}

// Dependency Analysis and Registry
export function analyzeDependencies(categoryId: string, valueId: string): {
  directDependencies: number
  affectedSystems: string[]
  riskLevel: 'low' | 'medium' | 'high'
} {
  const config = getMasterCategoryConfig(categoryId)
  const value = config.values.find(v => v.id === valueId)

  if (!value) {
    return { directDependencies: 0, affectedSystems: [], riskLevel: 'low' }
  }

  const dependencies = value.dependencies?.totalUsageCount || 0
  const affectedSystems: string[] = []

  if (value.dependencies?.usedInQueues?.length) affectedSystems.push('Queues')
  if (value.dependencies?.usedInSkills?.length) affectedSystems.push('Skills')
  if (value.dependencies?.usedInRules?.length) affectedSystems.push('Rules')
  if (value.dependencies?.usedInAutomations?.length) affectedSystems.push('Automations')
  if (value.dependencies?.usedInReports?.length) affectedSystems.push('Reports')

  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  if (dependencies > 10) riskLevel = 'high'
  else if (dependencies > 3) riskLevel = 'medium'

  return { directDependencies: dependencies, affectedSystems, riskLevel }
}

export function registerCategoryInSystem(
  categoryId: string,
  system: 'queues' | 'skills' | 'rules' | 'automations' | 'reports' | 'dashboard' | 'workload' | 'sla',
  field: string,
  isRequired: boolean
): void {
  let entry = MASTER_REGISTRY.get(categoryId)

  if (!entry) {
    entry = {
      categoryId,
      registeredIn: [],
      totalReferences: 0,
      lastUpdated: new Date().toISOString(),
    }
    MASTER_REGISTRY.set(categoryId, entry)
  }

  const existing = entry.registeredIn.find(r => r.system === system && r.field === field)
  if (!existing) {
    entry.registeredIn.push({
      system,
      field,
      isRequired,
      lastSync: new Date().toISOString(),
    })
  }

  entry.lastUpdated = new Date().toISOString()
}

export function getSyncStatus(categoryId: string): { isSynced: boolean; lastSync: string; systems: string[] } {
  const entry = MASTER_REGISTRY.get(categoryId)

  if (!entry) {
    return { isSynced: false, lastSync: 'Never', systems: [] }
  }

  return {
    isSynced: entry.registeredIn.length > 0,
    lastSync: entry.lastUpdated,
    systems: Array.from(new Set(entry.registeredIn.map(r => r.system))),
  }
}

// Template Management
export const MASTER_TEMPLATES: MasterCategoryTemplate[] = [
  {
    id: 'template-queue-type',
    name: 'Queue Type Template',
    description: 'Template for creating queue type categories',
    baseCategory: { id: 'queue-types', name: 'Queue Types', description: 'Queue classifications', color: '#3B82F6', order: 1, enabled: true, type: 'predefined' },
    defaultValues: [
      { id: 'val-1', categoryId: '', name: 'Support', code: 'support', color: '#3B82F6', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
      { id: 'val-2', categoryId: '', name: 'Sales', code: 'sales', color: '#10B981', status: 'active', enabled: true, metadata: { createdBy: 'admin', createdAt: new Date().toISOString(), updatedBy: 'admin', updatedAt: new Date().toISOString(), version: 1 } },
    ],
    defaultFieldDefinitions: [
      { id: 'f1', name: 'Type Name', type: 'text', required: true },
      { id: 'f2', name: 'Code', type: 'text', required: true },
      { id: 'f3', name: 'Priority', type: 'number', required: false },
    ],
    metadata: {
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      usageCount: 0,
    },
  },
]

export function createFromTemplate(templateId: string, overrides: Partial<MasterCategory>): MasterCategory | null {
  const template = MASTER_TEMPLATES.find(t => t.id === templateId)
  if (!template) return null

  return createMasterCategory({
    name: overrides.name || template.baseCategory.name,
    description: overrides.description || template.baseCategory.description,
    color: overrides.color || template.baseCategory.color,
    allowCustomValues: true,
    allowHierarchy: true,
    fieldDefinitions: template.defaultFieldDefinitions,
    initialValues: template.defaultValues,
  })
}

// Bulk Operations
export function bulkUpdateStatus(
  categoryId: string,
  valueIds: string[],
  newStatus: 'active' | 'draft' | 'disabled' | 'archived'
): { success: number; failed: number } {
  let success = 0
  let failed = 0

  valueIds.forEach(valueId => {
    const result = updateMasterValue(categoryId, valueId, { status: newStatus })
    if (result) success++
    else failed++
  })

  return { success, failed }
}

export function getAuditLog(categoryId: string, limit: number = 50): MasterAuditLogEntry[] {
  const config = getMasterCategoryConfig(categoryId)
  return config.auditLog.slice(-limit).reverse()
}

export function getVersionHistory(categoryId: string, valueId: string): MasterValueVersion[] {
  const config = getMasterCategoryConfig(categoryId)
  return config.versionHistory.filter(v => v.currentValue.id === valueId)
}

// Statistics and Analytics
export function getCategoryStatistics(categoryId: string): {
  totalValues: number
  byStatus: Record<string, number>
  avgDependencies: number
  lastModified: string
} {
  const config = getMasterCategoryConfig(categoryId)

  const byStatus: Record<string, number> = {
    active: 0,
    draft: 0,
    disabled: 0,
    archived: 0,
  }

  let totalDeps = 0

  config.values.forEach(v => {
    byStatus[v.status]++
    totalDeps += v.dependencies?.totalUsageCount || 0
  })

  return {
    totalValues: config.values.length,
    byStatus,
    avgDependencies: config.values.length > 0 ? Math.round(totalDeps / config.values.length) : 0,
    lastModified: config.lastModified,
  }
}

export function getMostUsedValues(categoryId: string, limit: number = 10): MasterValue[] {
  const config = getMasterCategoryConfig(categoryId)
  return config.values
    .sort((a, b) => ((b.dependencies?.totalUsageCount || 0) - (a.dependencies?.totalUsageCount || 0)))
    .slice(0, limit)
}
