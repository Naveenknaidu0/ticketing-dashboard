// Configuration Validation and Dependency Tracking
// Prevents deletion of configurations that are in use, validates changes
// Integrates with dependency-engine, usage-engine, and impact-analysis-engine

import { CONFIGURATION_REGISTRY, ConfigurationValue, getConfigurationValue } from './configuration-registry'
import { dependencyEngine } from './dependency-engine'
import { usageEngine } from './usage-engine'
import { impactAnalysisEngine } from './impact-analysis-engine'
import type { RuleComplete } from './types'
import type { AutomationComplete } from './types'

export interface DeletionValidation {
  canDelete: boolean
  dependencies: Array<{
    type: 'rule' | 'automation' | 'assignment-rule'
    id: string
    name: string
    reason: string
  }>
  warningMessage?: string
}

// Track which rules use a configuration
export function findRulesUsingConfig(configId: string): Array<{ id: string; name: string; field: string }> {
  const results: Array<{ id: string; name: string; field: string }> = []

  // Use dependency engine to find rules that depend on this config
  const dependents = dependencyEngine.getDependents(configId)
  dependents.forEach(dep => {
    if (dep.type === 'rule') {
      results.push({
        id: dep.id,
        name: dep.label,
        field: 'configuration reference',
      })
    }
  })

  return results
}

// Track which automations use a configuration
export function findAutomationsUsingConfig(configId: string): Array<{ id: string; name: string; field: string }> {
  const results: Array<{ id: string; name: string; field: string }> = []

  // Use dependency engine to find automations that depend on this config
  const dependents = dependencyEngine.getDependents(configId)
  dependents.forEach(dep => {
    if (dep.type === 'automation') {
      results.push({
        id: dep.id,
        name: dep.label,
        field: 'configuration reference',
      })
    }
  })

  return results
}

// Main deletion validation
export function validateDeletion(configId: string): DeletionValidation {
  const config = getConfigurationValue(configId)
  if (!config) {
    return {
      canDelete: false,
      dependencies: [],
      warningMessage: 'Configuration not found',
    }
  }

  const canDeleteResult = dependencyEngine.canDelete(configId)

  if (!canDeleteResult.canDelete) {
    const dependents = dependencyEngine.getDependents(configId)
    const dependencies: DeletionValidation['dependencies'] = dependents.map(d => ({
      type: d.type as 'rule' | 'automation' | 'assignment-rule',
      id: d.id,
      name: d.label,
      reason: `Used in ${d.type}`,
    }))

    return {
      canDelete: false,
      dependencies,
      warningMessage: canDeleteResult.reason,
    }
  }

  return {
    canDelete: true,
    dependencies: [],
  }
}

// Validate unique code within category
export function validateUniqueCode(code: string, category: string, excludeId?: string): { isUnique: boolean; conflict?: string } {
  const conflicts = CONFIGURATION_REGISTRY.filter(c => c.code === code && c.category === category && c.id !== excludeId)

  if (conflicts.length > 0) {
    return {
      isUnique: false,
      conflict: `Code "${code}" already exists in category "${category}" (${conflicts[0].label})`,
    }
  }

  return { isUnique: true }
}

// Validate hierarchy - child cannot exist without parent
export function validateHierarchy(parentId: string): { isValid: boolean; message?: string } {
  const parent = getConfigurationValue(parentId)
  if (!parent) {
    return {
      isValid: false,
      message: 'Parent configuration does not exist',
    }
  }

  return { isValid: true }
}

// Validate configuration value before creation/update
export interface ConfigValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateConfigValue(value: Partial<ConfigurationValue>, existingId?: string): ConfigValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!value.code) {
    errors.push('Code is required')
  } else {
    // Check if code is unique
    const codeCheck = validateUniqueCode(value.code, value.category || '', existingId)
    if (!codeCheck.isUnique) {
      errors.push(codeCheck.conflict || 'Code must be unique')
    }

    // Validate code format
    if (!/^[a-z0-9-]+$/.test(value.code)) {
      errors.push('Code must be lowercase alphanumeric with hyphens only')
    }
  }

  if (!value.label) {
    errors.push('Label is required')
  }

  if (!value.category) {
    errors.push('Category is required')
  }

  if (!value.systemCategory) {
    errors.push('System category is required')
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Check if a configuration can be modified (used in rules/automations)
export function canModifyConfig(configId: string): { canModify: boolean; message?: string } {
  const rulesUsing = findRulesUsingConfig(configId)
  const automationsUsing = findAutomationsUsingConfig(configId)
  const totalUsage = rulesUsing.length + automationsUsing.length

  if (totalUsage > 0) {
    return {
      canModify: true,
      message: `This configuration is used in ${totalUsage} rule(s)/automation(s). Changes will affect those rules/automations.`,
    }
  }

  return { canModify: true }
}

// Get impact analysis for a configuration change
export function getChangeImpact(configId: string, changeType: 'delete' | 'update' | 'archive' | 'disable' = 'delete') {
  const config = getConfigurationValue(configId)
  if (!config) return null

  return impactAnalysisEngine.analyzeImpact(changeType, configId, config.code, config.label)
}

// Get detailed impact report before dangerous operations
export function generateImpactReport(configId: string, changeType: 'delete' | 'update' | 'archive' | 'disable' = 'delete'): string {
  const config = getConfigurationValue(configId)
  if (!config) return 'Configuration not found'

  const impact = impactAnalysisEngine.analyzeImpact(changeType, configId, config.code, config.label)
  const usage = usageEngine.getTotalUsage(configId)
  const dependents = dependencyEngine.getDependents(configId)

  const report = [
    '=== CONFIGURATION CHANGE IMPACT REPORT ===',
    `Configuration: ${config.label} (${config.code})`,
    `Change Type: ${changeType}`,
    `Report Generated: ${new Date().toISOString()}`,
    '',
    '--- USAGE ---',
    `Total Usage: ${usage} times`,
    `Severity: ${impact.severity.toUpperCase()}`,
    '',
    '--- DEPENDENCIES ---',
    `Direct Dependents: ${dependents.length}`,
    `Transitive Impact: ${impact.affectedItems.transitiveCount}`,
    '',
    '--- AFFECTED ITEMS ---',
    `Rules: ${impact.affectedItems.byType.rules}`,
    `Automations: ${impact.affectedItems.byType.automations}`,
    `Dashboards: ${impact.affectedItems.byType.dashboards}`,
    `Reports: ${impact.affectedItems.byType.reports}`,
    '',
    '--- RISKS ---',
    ...impact.risks.map(r => `• ${r.title} (${r.severity}): ${r.description}`),
    '',
    '--- RECOMMENDATIONS ---',
    ...impact.recommendations.map(r => `• ${r}`),
    '',
    `Can Proceed: ${impact.canProceeed ? 'YES' : 'NO'}`,
  ]

  return report.join('\n')
}

