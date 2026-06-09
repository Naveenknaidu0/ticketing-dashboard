// Category Management Engine
// Allows managers to create, edit, and manage configuration categories
// with full dependency tracking and version control

import { CONFIGURATION_REGISTRY, ConfigurationValue, logAuditEvent, validateConfigurationValue } from './configuration-registry'

export interface ConfigurationCategory {
  id: string
  name: string
  description: string
  systemCategory: 'queue' | 'skill' | 'rule' | 'automation' | 'system'
  color: string
  icon?: string
  allowCustom: boolean
  allowHierarchy: boolean
  isDefault: boolean
  metadata: {
    createdBy: string
    createdAt: string
    updatedBy: string
    updatedAt: string
    version: number
  }
}

// Store for custom categories created by managers
export let CUSTOM_CATEGORIES: ConfigurationCategory[] = []

// Default system categories
export const DEFAULT_CATEGORIES: ConfigurationCategory[] = [
  {
    id: 'queue-types',
    name: 'Queue Types',
    description: 'Define types of queues in your system',
    systemCategory: 'queue',
    color: '#3B82F6',
    icon: 'Layers',
    allowCustom: false,
    allowHierarchy: true,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'queue-statuses',
    name: 'Queue Statuses',
    description: 'Queue operational statuses',
    systemCategory: 'queue',
    color: '#06B6D4',
    icon: 'Activity',
    allowCustom: false,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'queue-priorities',
    name: 'Queue Priorities',
    description: 'Priority levels for queues',
    systemCategory: 'queue',
    color: '#F59E0B',
    icon: 'AlertCircle',
    allowCustom: false,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'skill-levels',
    name: 'Skill Levels',
    description: 'Define proficiency levels',
    systemCategory: 'skill',
    color: '#10B981',
    icon: 'TrendingUp',
    allowCustom: false,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'skill-categories',
    name: 'Skill Categories',
    description: 'Classification of skills',
    systemCategory: 'skill',
    color: '#8B5CF6',
    icon: 'Grid',
    allowCustom: true,
    allowHierarchy: true,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'rule-actions',
    name: 'Rule Actions',
    description: 'Available rule actions',
    systemCategory: 'rule',
    color: '#EF4444',
    icon: 'Zap',
    allowCustom: true,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'rule-priorities',
    name: 'Rule Priorities',
    description: 'Rule execution priorities',
    systemCategory: 'rule',
    color: '#DC2626',
    icon: 'Flag',
    allowCustom: false,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'condition-operators',
    name: 'Condition Operators',
    description: 'Available condition operators',
    systemCategory: 'rule',
    color: '#7C3AED',
    icon: 'Filter',
    allowCustom: false,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'automation-triggers',
    name: 'Automation Triggers',
    description: 'Events that trigger automations',
    systemCategory: 'automation',
    color: '#0EA5E9',
    icon: 'Bell',
    allowCustom: true,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'automation-actions',
    name: 'Automation Actions',
    description: 'Actions that automations can perform',
    systemCategory: 'automation',
    color: '#06B6D4',
    icon: 'Sliders',
    allowCustom: true,
    allowHierarchy: false,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
  {
    id: 'departments',
    name: 'Departments',
    description: 'Organizational departments',
    systemCategory: 'system',
    color: '#6B7280',
    icon: 'Building2',
    allowCustom: true,
    allowHierarchy: true,
    isDefault: true,
    metadata: { createdBy: 'system', createdAt: new Date().toISOString(), updatedBy: 'system', updatedAt: new Date().toISOString(), version: 1 },
  },
]

// Get all categories (default + custom)
export function getAllCategories(): ConfigurationCategory[] {
  return [...DEFAULT_CATEGORIES, ...CUSTOM_CATEGORIES]
}

// Get category by ID
export function getCategory(id: string): ConfigurationCategory | undefined {
  return getAllCategories().find(c => c.id === id)
}

// Get categories by system category
export function getCategoriesBySystemCategory(systemCategory: 'queue' | 'skill' | 'rule' | 'automation' | 'system'): ConfigurationCategory[] {
  return getAllCategories().filter(c => c.systemCategory === systemCategory)
}

// Create new custom category
export function createCategory(data: Omit<ConfigurationCategory, 'id' | 'metadata' | 'isDefault'>): ConfigurationCategory {
  const newCategory: ConfigurationCategory = {
    ...data,
    id: `cat-${Date.now()}`,
    isDefault: false,
    metadata: {
      createdBy: 'current-user',
      createdAt: new Date().toISOString(),
      updatedBy: 'current-user',
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  }

  CUSTOM_CATEGORIES.push(newCategory)

  logAuditEvent({
    eventType: 'category_created',
    module: 'configuration',
    action: 'create',
    entityId: newCategory.id,
    entityType: 'Category',
    entityName: newCategory.name,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    afterState: newCategory,
    source: 'ui',
  })

  return newCategory
}

// Update category
export function updateCategory(id: string, updates: Partial<Omit<ConfigurationCategory, 'id' | 'metadata' | 'isDefault'>>): ConfigurationCategory | null {
  const category = getCategory(id)
  if (!category || category.isDefault) return null

  const beforeState = JSON.parse(JSON.stringify(category))
  const categoryIndex = CUSTOM_CATEGORIES.findIndex(c => c.id === id)
  if (categoryIndex === -1) return null

  Object.assign(CUSTOM_CATEGORIES[categoryIndex], updates)
  CUSTOM_CATEGORIES[categoryIndex].metadata.updatedAt = new Date().toISOString()
  CUSTOM_CATEGORIES[categoryIndex].metadata.updatedBy = 'current-user'
  CUSTOM_CATEGORIES[categoryIndex].metadata.version += 1

  logAuditEvent({
    eventType: 'category_updated',
    module: 'configuration',
    action: 'update',
    entityId: id,
    entityType: 'Category',
    entityName: CUSTOM_CATEGORIES[categoryIndex].name,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState,
    afterState: CUSTOM_CATEGORIES[categoryIndex],
    source: 'ui',
  })

  return CUSTOM_CATEGORIES[categoryIndex]
}

// Delete category
export function deleteCategory(id: string): { success: boolean; reason?: string } {
  const category = getCategory(id)
  if (!category) return { success: false, reason: 'Category not found' }
  if (category.isDefault) return { success: false, reason: 'Cannot delete default system categories' }

  // Check if category has values
  const valuesInCategory = CONFIGURATION_REGISTRY.filter(v => v.category === id)
  if (valuesInCategory.length > 0) {
    return { success: false, reason: `Cannot delete category with ${valuesInCategory.length} values. Delete all values first.` }
  }

  const categoryIndex = CUSTOM_CATEGORIES.findIndex(c => c.id === id)
  if (categoryIndex === -1) return { success: false, reason: 'Custom category not found' }

  const deleted = CUSTOM_CATEGORIES.splice(categoryIndex, 1)[0]

  logAuditEvent({
    eventType: 'category_deleted',
    module: 'configuration',
    action: 'delete',
    entityId: id,
    entityType: 'Category',
    entityName: deleted.name,
    userId: 'current-user',
    userName: 'Current User',
    userRole: 'manager',
    beforeState: deleted,
    source: 'ui',
  })

  return { success: true }
}

// Get values in category
export function getCategoryValues(categoryId: string): ConfigurationValue[] {
  return CONFIGURATION_REGISTRY.filter(v => v.category === categoryId).sort((a, b) => a.order - b.order)
}

// Get category statistics
export interface CategoryStats {
  totalCategories: number
  customCategories: number
  defaultCategories: number
  totalValues: number
  valuesByCategory: Record<string, number>
}

export function getCategoryStatistics(): CategoryStats {
  const allCategories = getAllCategories()
  const valuesByCategory: Record<string, number> = {}

  allCategories.forEach(cat => {
    valuesByCategory[cat.id] = getCategoryValues(cat.id).length
  })

  return {
    totalCategories: allCategories.length,
    customCategories: CUSTOM_CATEGORIES.length,
    defaultCategories: DEFAULT_CATEGORIES.length,
    totalValues: CONFIGURATION_REGISTRY.length,
    valuesByCategory,
  }
}
