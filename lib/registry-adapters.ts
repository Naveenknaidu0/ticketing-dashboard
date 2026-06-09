// Registry Adapters - Convert Configuration Registry to builder-compatible formats
// These adapters provide backward compatibility while all builders gradually migrate to the registry

import {
  CONFIGURATION_REGISTRY,
  getConfigurationsByCategory,
  getConfigurationsBySystemCategory,
  type ConfigurationValue,
} from './configuration-registry'

// Queue Adapters
export function getQueueTypes(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('queue-types').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#3B82F6',
    code: c.code,
  }))
}

export function getQueueStatuses(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('queue-statuses').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#10B981',
    code: c.code,
  }))
}

export function getQueuePriorities(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('queue-priorities').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#F59E0B',
    code: c.code,
  }))
}

// Skill Adapters
export function getSkillLevels(): Array<{ id: string; label: string; color: string; code: string; description?: string }> {
  return getConfigurationsByCategory('skill-levels').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#3B82F6',
    code: c.code,
    description: c.description,
  }))
}

export function getSkillCategories(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('skill-categories').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#10B981',
    code: c.code,
  }))
}

// Rule Adapters
export function getRuleActions(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('rule-actions').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#10B981',
    code: c.code,
  }))
}

export function getRulePriorities(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('rule-priorities').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#EF4444',
    code: c.code,
  }))
}

export function getConditionOperators(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('condition-operators').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#3B82F6',
    code: c.code,
  }))
}

// Automation Adapters
export function getAutomationTriggers(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('automation-triggers').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#3B82F6',
    code: c.code,
  }))
}

export function getAutomationActions(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('automation-actions').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#10B981',
    code: c.code,
  }))
}

// Department/System Adapters
export function getDepartments(): Array<{ id: string; label: string; color: string; code: string }> {
  return getConfigurationsByCategory('departments').map(c => ({
    id: c.id,
    label: c.label,
    color: c.color || '#3B82F6',
    code: c.code,
  }))
}

// Generic adapter - returns raw registry objects for any category
export function getConfigurationsByLabel(category: string): ConfigurationValue[] {
  return getConfigurationsByCategory(category)
}

// Get all configurations as old format options
export function getAllOptionsForCategory(
  category: string
): Array<{ id: string; label: string; color?: string; code?: string; description?: string }> {
  return getConfigurationsByCategory(category).map(c => ({
    id: c.id,
    label: c.label,
    color: c.color,
    code: c.code,
    description: c.description,
  }))
}

// Watch for registry changes and trigger updates (for live update support)
export interface RegistryChangeListener {
  (type: 'create' | 'update' | 'delete', value: ConfigurationValue): void
}

const listeners: Set<RegistryChangeListener> = new Set()

export function subscribeToRegistryChanges(listener: RegistryChangeListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function notifyRegistryChange(type: 'create' | 'update' | 'delete', value: ConfigurationValue): void {
  listeners.forEach(listener => listener(type, value))
}
